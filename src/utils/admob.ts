import { AdMob, RewardAdOptions, AdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const admobService = {
  initialized: false,

  async init() {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: true,
      });
      this.initialized = true;
      console.log('AdMob initialized');
    } catch (e) {
      console.error('AdMob init failed', e);
    }
  },

  async showRewardVideo(): Promise<boolean> {
    if (!this.initialized) {
        console.warn('AdMob not initialized');
        return false;
    }

    try {
      const options: RewardAdOptions = {
        adId: 'ca-app-pub-3940256099942544/5224354917', // Test ID
      };
      
      await AdMob.prepareRewardVideoAd(options);
      const result = await AdMob.showRewardVideoAd();
      return !!result;
    } catch (e) {
      console.error('AdMob reward failed', e);
      return false;
    }
  },

  async showInterstitial(): Promise<boolean> {
    if (!this.initialized) return false;
    try {
       const options: AdOptions = {
        adId: 'ca-app-pub-3940256099942544/1033173712', // Test ID
       };
       await AdMob.prepareInterstitial(options);
       await AdMob.showInterstitial();
       return true;
    } catch (e) {
      console.error('AdMob interstitial failed', e);
      return false;
    }
  }
};
