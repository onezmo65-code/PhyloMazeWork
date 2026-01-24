import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';

interface AdBannerProps {
  adClient: string;  // Your AdSense publisher ID: ca-pub-2187994309647585
  adSlot: string;    // Your ad unit slot ID
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

// AdSense Banner Component for Web
export const AdBanner: React.FC<AdBannerProps> = ({
  adClient,
  adSlot,
  format = 'auto',
  className = '',
  style = {},
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    // Don't show AdSense on native platforms (use AdMob instead)
    if (isNative) return;

    // Push ad after component mounts
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [isNative]);

  // Don't render on native platforms
  if (isNative) {
    return null;
  }

  // Placeholder during development (when AdSense isn't approved yet)
  const isDevelopment = adClient.includes('XXXXXXXX');

  if (isDevelopment) {
    return (
      <div
        className={`bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg flex items-center justify-center text-white/60 text-xs font-medium ${className}`}
        style={{ minHeight: '90px', ...style }}
      >
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider mb-1">Advertisement</p>
          <p className="text-[8px] opacity-60">Ad space reserved</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={adRef} className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Responsive ad that fits container
export const ResponsiveAd: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <AdBanner
      adClient="ca-pub-2187994309647585"
      adSlot="1234567890" // Replace with your slot ID
      format="auto"
      className={className}
    />
  );
};

// Fixed size rectangle ad (300x250)
export const RectangleAd: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <AdBanner
      adClient="ca-pub-2187994309647585"
      adSlot="0987654321"
      format="rectangle"
      className={className}
      style={{ width: '300px', height: '250px' }}
    />
  );
};

// Horizontal banner ad
export const HorizontalBannerAd: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <AdBanner
      adClient="ca-pub-2187994309647585"
      adSlot="1122334455"
      format="horizontal"
      className={className}
      style={{ minHeight: '90px' }}
    />
  );
};

export default AdBanner;
