import { Purchases, LOG_LEVEL, PurchasesPackage, PurchasesOffering } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

const API_KEYS = {
  ios: 'test_BlUxAlKBmWzQdTWPveJVbrqXKWe',
  android: 'goog_placeholder_key', 
};

export const ENTITLEMENT_ID = 'Nebula Maze Pro';

class RevenueCatService {
  private initialized = false;

  async init() {
    if (this.initialized) return;
    
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      console.log('RevenueCat skipped on web');
      return;
    }

    try {
      if (platform === 'ios') {
        await Purchases.configure({ apiKey: API_KEYS.ios });
      } else if (platform === 'android') {
        await Purchases.configure({ apiKey: API_KEYS.android });
      }

      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
      this.initialized = true;
    } catch (error) {
      console.error('RevenueCat init failed:', error);
    }
  }

  async getOfferings(): Promise<PurchasesOffering | null> {
    if (!this.initialized) await this.init();
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('Error fetching offerings:', error);
      return null;
    }
  }

  async purchasePackage(pkg: PurchasesPackage) {
    if (!this.initialized) await this.init();
    try {
      const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
      return customerInfo;
    } catch (error: any) {
      if (error.userCancelled) {
        throw new Error('User cancelled');
      }
      throw error;
    }
  }

  async checkEntitlement(): Promise<boolean> {
    if (!this.initialized) await this.init();
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    } catch (error) {
      return false;
    }
  }

  async restorePurchases() {
    if (!this.initialized) await this.init();
    try {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      throw error;
    }
  }
}

export const revenueCat = new RevenueCatService();
