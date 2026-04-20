import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";
import admin from "firebase-admin";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import fs from "fs";
import { socialService, SocialPlatform } from "./src/services/socialService.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
let firebaseConfig: any;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  console.log(`[System] Firebase Configuration loaded for Project: ${firebaseConfig.projectId}`);
} catch (err) {
  console.error("[System] Failed to load firebase-applet-config.json. Ensure set_up_firebase was run.");
  process.exit(1);
}

const adminApp = admin.initializeApp({
  projectId: firebaseConfig.projectId,
});

// Use the specific database ID from config
const db = getFirestore(adminApp, firebaseConfig.firestoreDatabaseId || "(default)");
console.log(`[System] Firestore initialized for Database: ${firebaseConfig.firestoreDatabaseId || "(default)"}`);

/**
 * Background Worker: Publication Engine
 */
async function processScheduledPosts() {
  const now = new Date();
  console.log(`[Worker] Checking scheduled posts at ${now.toISOString()}...`);

  try {
    const workspacesSnap = await db.collection('workspaces').get();
    
    if (workspacesSnap.empty) {
      console.log("[Worker] No workspaces found in system archive.");
      return;
    }

    const allDocs: any[] = [];

    for (const workspaceDoc of workspacesSnap.docs) {
      const workspaceId = workspaceDoc.id;
      
      const scheduledPostsQuery = db.collection(`workspaces/${workspaceId}/posts`)
        .where('status', '==', 'scheduled')
        .where('scheduledAt', '<=', now.toISOString());

      const failedPostsQuery = db.collection(`workspaces/${workspaceId}/posts`)
        .where('status', '==', 'failed')
        .where('retryCount', '<', 3)
        .where('scheduledAt', '<=', now.toISOString());

      const [scheduledSnapshot, failedSnapshot] = await Promise.all([
        scheduledPostsQuery.get().catch(err => {
          console.error(`[Worker] Scheduled query for WS:${workspaceId} failed:`, err.message);
          return { docs: [] };
        }),
        failedPostsQuery.get().catch(err => {
          console.error(`[Worker] Failed query for WS:${workspaceId} failed:`, err.message);
          return { docs: [] };
        })
      ]);

      allDocs.push(...scheduledSnapshot.docs, ...failedSnapshot.docs);
    }

    if (allDocs.length === 0) {
      return;
    }

    console.log(`[Worker] Found ${allDocs.length} posts for processing.`);

    for (const doc of allDocs) {
      const post = doc.data();
      const postRef = doc.ref;
      const workspaceId = doc.ref.parent.parent?.id;

      if (!workspaceId) continue;

      const currentRetries = post.retryCount || 0;
      console.log(`[Worker] Processing post ${doc.id} (Attempt ${currentRetries + 1}) for WS: ${workspaceId}`);

      // 1. Mark as publishing
      await postRef.update({ 
        status: 'publishing',
        updatedAt: FieldValue.serverTimestamp(),
        retryCount: currentRetries + 1
      });

      // 2. Execute publishing via Social Service
      const accountIds = post.accountIds || [];
      const content = post.content || "";
      
      // We need to fetch the platforms for these accounts
      const accountsSnap = await db.collection(`workspaces/${workspaceId}/social_accounts`).get();
      const accounts = accountsSnap.docs
        .filter(d => accountIds.includes(d.id))
        .map(d => d.data());
      
      const platforms = accounts.map(a => a.platform as SocialPlatform);

      if (platforms.length === 0) {
        await postRef.update({ 
          status: 'failed',
          errorMessage: 'No valid social accounts found for this post.',
          updatedAt: FieldValue.serverTimestamp()
        });
        continue;
      }

      try {
        const results = await socialService.publishToAll(platforms, content);
        const isFullSuccess = Object.values(results).every(r => r.success);

        // 3. Finalize Status
        await postRef.update({
          status: isFullSuccess ? 'published' : 'failed',
          updatedAt: FieldValue.serverTimestamp()
        });

        // 4. Log individual results
        for (const [platform, res] of Object.entries(results)) {
          await db.collection(`workspaces/${workspaceId}/publishing_logs`).add({
            postId: doc.id,
            platform,
            status: res.success ? 'success' : 'error',
            errorMessage: res.error || null,
            timestamp: FieldValue.serverTimestamp()
          });
        }

        console.log(`[Worker] Completed publication for post ${doc.id}. Result: ${isFullSuccess ? 'Success' : 'Partial/Failed'}`);
      } catch (pubErr) {
        console.error(`[Worker] Error during publication of post ${doc.id}:`, pubErr);
        await postRef.update({
          status: 'failed',
          errorMessage: pubErr instanceof Error ? pubErr.message : 'Unknown publication error',
          updatedAt: FieldValue.serverTimestamp()
        });
      }
    }
  } catch (err) {
    console.error(`[Worker] Critical error in processing loop:`, err);
  }
}

// Scheduled Cron Job: Every 1 minute
cron.schedule("* * * * *", () => {
  processScheduledPosts();
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", async (req, res) => {
    let dbStatus = "unknown";
    let defaultDbStatus = "unknown";
    try {
      // Diagnostic read: Limit 1 to check permissions
      await db.collection('workspaces').limit(1).get();
      dbStatus = "connected";
    } catch (err: any) {
      dbStatus = `error: ${err.message}`;
    }

    try {
      const defaultDb = getFirestore(adminApp, "(default)");
      await defaultDb.collection('workspaces').limit(1).get();
      defaultDbStatus = "connected";
    } catch (err: any) {
      defaultDbStatus = `error: ${err.message}`;
    }

    res.json({ 
      status: "ok", 
      time: new Date().toISOString(),
      worker: "active",
      database: dbStatus,
      defaultDatabase: defaultDbStatus,
      projectId: firebaseConfig.projectId
    });
  });

  // Manual Trigger for testing
  app.post("/api/queue/process", async (req, res) => {
    processScheduledPosts();
    res.json({ message: "Worker manually triggered" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`[System] Background publishing worker initialized (1min cycle)`);
  });
}

startServer();
