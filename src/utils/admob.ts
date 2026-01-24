import { AdMob, RewardAdOptions, AdOptions, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

 // ============================================================
// ADMOB CONFIGURATION
// ============================================================

// MASTER SWITCH: Set this to true to enable real ads and earn revenue
const IS_PRODUCTION = true; 

// Test Ad Unit IDs (Google's official test IDs - always work)
const TEST_AD_UNITS = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  REWARDED_INTERSTITIAL: 'ca-app-pub-3940256099942544/5354046379',
};

// Production Ad Unit IDs - Nebula Maze (App ID: ca-app-pub-2187994309647585~6672282109)
const PROD_AD_UNITS = {
  // Android
  ANDROID_BANNER: 'ca-app-pub-2187994309647585/7058207179',
  ANDROID_INTERSTITIAL: 'ca-app-pub-2187994309647585/3361864112',
  ANDROID_REWARDED: 'ca-app-pub-2187994309647585/4483374098',
  // iOS
  IOS_BANNER: 'ca-app-pub-2187994309647585/7058207179',
  IOS_INTERSTITIAL: 'ca-app-pub-2187994309647585/3361864112',
  IOS_REWARDED: 'ca-app-pub-2187994309647585/4483374098',
};

// Get the correct ad unit ID based on platform and environment
function getAdUnitId(type: 'banner' | 'interstitial' | 'rewarded'): string {
  if (!IS_PRODUCTION) {
    return TEST_AD_UNITS[type.toUpperCase() as keyof typeof TEST_AD_UNITS];
  }

  const platform = Capacitor.getPlatform();
  const prefix = platform === 'ios' ? 'IOS' : 'ANDROID';
  const key = `${prefix}_${type.toUpperCase()}` as keyof typeof PROD_AD_UNITS;
  return PROD_AD_UNITS[key];
}

// ============================================================
// ADMOB SERVICE
// ============================================================

export const admobService = {
  initialized: false,
  bannerShowing: false,

  async init() {
    if (!Capacitor.isNativePlatform()) {
      console.log('AdMob: Not a native platform, skipping init');
      return;
    }

    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: IS_PRODUCTION ? [] : ['EMULATOR'], // Add your test device IDs here
        initializeForTesting: !IS_PRODUCTION,
      });
      this.initialized = true;
      console.log('AdMob initialized successfully');
    } catch (e) {
      console.error('AdMob init failed:', e);
    }
  },

  // Banner Ad (persistent at bottom of screen)
  async showBanner(): Promise<boolean> {
    if (!this.initialized || this.bannerShowing) return false;

    try {
      const options: BannerAdOptions = {
        adId: getAdUnitId('banner'),
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      };

      await AdMob.showBanner(options);
      this.bannerShowing = true;
      console.log('Banner ad shown');
      return true;
    } catch (e) {
      console.error('AdMob banner failed:', e);
      return false;
    }
  },

  async hideBanner(): Promise<void> {
    if (!this.bannerShowing) return;
    try {
      await AdMob.hideBanner();
      this.bannerShowing = false;
    } catch (e) {
      console.error('AdMob hide banner failed:', e);
    }
  },

  async removeBanner(): Promise<void> {
    try {
      await AdMob.removeBanner();
      this.bannerShowing = false;
    } catch (e) {
      console.error('AdMob remove banner failed:', e);
    }
  },

  // Interstitial Ad (full screen between levels)
  async showInterstitial(): Promise<boolean> {
    if (!this.initialized) {
      console.warn('AdMob not initialized');
      return false;
    }

    try {
      const options: AdOptions = {
        adId: getAdUnitId('interstitial'),
      };

      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
      console.log('Interstitial ad shown');
      return true;
    } catch (e) {
      console.error('AdMob interstitial failed:', e);
      return false;
    }
  },

  // Rewarded Video Ad (watch ad for reward)
  async showRewardVideo(): Promise<boolean> {
    if (!this.initialized) {
      console.warn('AdMob not initialized');
      return false;
    }

    try {
      const options: RewardAdOptions = {
        adId: getAdUnitId('rewarded'),
      };

      await AdMob.prepareRewardVideoAd(options);
      const result = await AdMob.showRewardVideoAd();
      console.log('Reward video completed:', result);
      return !!result;
    } catch (e) {
      console.error('AdMob reward failed:', e);
      return false;
    }
  },

  // Preload ads for faster display
  async preloadAds(): Promise<void> {
    if (!this.initialized) return;

    try {
      // Preload interstitial
      await AdMob.prepareInterstitial({
        adId: getAdUnitId('interstitial'),
      });
      console.log('Interstitial preloaded');
    } catch (e) {
      console.error('Preload interstitial failed:', e);
    }

    try {
      // Preload rewarded
      await AdMob.prepareRewardVideoAd({
        adId: getAdUnitId('rewarded'),
      });
      console.log('Rewarded ad preloaded');
    } catch (e) {
      console.error('Preload rewarded failed:', e);
    }
  },
};

// Export configuration for reference
export { IS_PRODUCTION, TEST_AD_UNITS, PROD_AD_UNITS };
