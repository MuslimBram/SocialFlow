export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'telegram';

export interface PublishResult {
  success: boolean;
  platformId: string;
  error?: string;
  externalUrl?: string;
}

export interface SocialProvider {
  platform: SocialPlatform;
  publish(content: string, media?: string[], accountData?: any): Promise<PublishResult>;
  validate(content: string, media?: string[]): { valid: boolean; error?: string };
}

// Simple Simulation Adapter
class SimulatedProvider implements SocialProvider {
  constructor(public platform: SocialPlatform) {}

  async publish(content: string, media?: string[]): Promise<PublishResult> {
    // Simulate API latency
    await new Promise(r => setTimeout(r, 2000));
    
    // Simulate potential failure
    const isSuccess = Math.random() > 0.1; 

    if (isSuccess) {
      return {
        success: true,
        platformId: `sim_${Date.now()}`,
        externalUrl: `https://${this.platform}.com/post/simulated`
      };
    } else {
      return {
        success: false,
        platformId: '',
        error: `Simulated error from ${this.platform} API: Rate limit exceeded or Invalid media format.`
      };
    }
  }

  validate(content: string, media?: string[]) {
    if (this.platform === 'twitter' && content.length > 280) {
      return { valid: false, error: "X (Twitter) posts must be under 280 characters." };
    }
    if (media && media.length > 4) {
      return { valid: false, error: "Most platforms support up to 4 images." };
    }
    return { valid: true };
  }
}

export const socialService = {
  getProvider(platform: SocialPlatform): SocialProvider {
    // In a real production app, you would switch between Simulated and Real adapters
    // based on environment or configuration.
    return new SimulatedProvider(platform);
  },

  async publishToAll(platforms: SocialPlatform[], content: string, media?: string[]): Promise<Record<string, PublishResult>> {
    const results: Record<string, PublishResult> = {};
    
    await Promise.all(platforms.map(async (platform) => {
      const provider = this.getProvider(platform);
      results[platform] = await provider.publish(content, media);
    }));

    return results;
  }
};
