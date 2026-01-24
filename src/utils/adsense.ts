// Google AdSense Service for Web
// Documentation: https://support.google.com/adsense

export interface AdSlot {
  id: string;
  format: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidth?: boolean;
}

// Ad slot configurations - Replace with your actual AdSense ad unit IDs after approval
export const AD_SLOTS = {
  // Banner at top/bottom of game
  BANNER_TOP: {
    id: 'ca-pub-XXXXXXXXXXXXXXXX', // Replace after AdSense approval
    slot: '1234567890', // Replace with your ad slot ID
    format: 'horizontal' as const,
  },
  // Square ad in sidebar
  SIDEBAR: {
    id: 'ca-pub-XXXXXXXXXXXXXXXX',
    slot: '0987654321',
    format: 'rectangle' as const,
  },
  // In-feed ad between content
  IN_FEED: {
    id: 'ca-pub-XXXXXXXXXXXXXXXX',
    slot: '1122334455',
    format: 'auto' as const,
  },
};

class AdSenseService {
  private initialized = false;
  private adsbygoogle: any[] = [];

  init() {
    if (this.initialized || typeof window === 'undefined') return;

    // Check if AdSense script is loaded
    if ((window as any).adsbygoogle) {
      this.adsbygoogle = (window as any).adsbygoogle;
      this.initialized = true;
      console.log('AdSense initialized');
    }
  }

  // Push ad to be displayed
  pushAd() {
    if (!this.initialized) {
      this.init();
    }
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense push failed:', e);
    }
  }

  // Check if ads are blocked
  isAdBlocked(): boolean {
    // Simple ad blocker detection
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    document.body.appendChild(testAd);
    const isBlocked = testAd.offsetHeight === 0;
    document.body.removeChild(testAd);
    return isBlocked;
  }
}

export const adsenseService = new AdSenseService();

// Helper function to create ad unit HTML
export function getAdUnitCode(slot: typeof AD_SLOTS.BANNER_TOP): string {
  return `
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="${slot.id}"
         data-ad-slot="${slot.slot}"
         data-ad-format="${slot.format}"
         data-full-width-responsive="true"></ins>
  `;
}
