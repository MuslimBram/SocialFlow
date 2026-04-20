import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const aiService = {
  async generateCaption(prompt: string, platform: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are a social media expert. Create a high-engagement caption for ${platform} based on the user's topic. Include 3 relevant hashtags.`,
      },
      contents: prompt,
    });
    return response.text || "";
  },

  async rewriteContent(content: string, tone: 'formal' | 'casual' | 'sales' | 'witty'): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `Rewrite the following content in a ${tone} tone for social media. Keep the core message but adjust the vibe.`,
      },
      contents: content,
    });
    return response.text || "";
  },

  async suggestHashtags(content: string): Promise<string[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "Extract and suggest 10 trending and relevant hashtags for the given content. Return as a JSON array.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      contents: content,
    });
    try {
      return JSON.parse(response.text || "[]");
    } catch {
      return [];
    }
  },

  async suggestMedia(content: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "Based on the social media post content, suggest a visual concept or prompt for an image that would increase engagement. Be brief and creative.",
      },
      contents: `Suggest an image concept for this post: "${content}"`,
    });
    return response.text || "A vibrant, engaging visual related to the topic.";
  }
};
