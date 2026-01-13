import React, { useState, useEffect } from 'react';
import { Play, CreditCard, Star, X, Loader2, RefreshCw } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { revenueCat } from '../utils/revenueCat';
import { admobService } from '../utils/admob';
import { crazyGames } from '../utils/crazyGames';

interface PaywallProps {
  onUnlock: (method: 'ad' | 'sub_weekly' | 'sub_monthly' | 'sub_yearly') => void;
  onClose: () => void;
}

export const Paywall: React.FC<PaywallProps> = ({ onUnlock, onClose }) => {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [adCount, setAdCount] = useState(0);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (isNative) {
      loadOfferings();
    } else {
      setLoading(false);
    }
  }, [isNative]);

  const loadOfferings = async () => {
    try {
      const currentOffering = await revenueCat.getOfferings();
      if (currentOffering && currentOffering.availablePackages) {
        setPackages(currentOffering.availablePackages);
      }
    } catch (error) {
      console.error('Failed to load offerings', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      setLoading(true);
      const customerInfo = await revenueCat.purchasePackage(pkg);
      if (customerInfo.entitlements.active['Nebula Maze Pro']) {
        onUnlock('sub_monthly'); // Generic success
      }
    } catch (error: any) {
      if (error.message !== 'User cancelled') {
        alert('Purchase failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      setLoading(true);
      const customerInfo = await revenueCat.restorePurchases();
      if (customerInfo.entitlements.active['Nebula Maze Pro']) {
        onUnlock('sub_monthly');
        alert('Purchases restored!');
      } else {
        alert('No active subscriptions found.');
      }
    } catch (error) {
      alert('Restore failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchAd = async () => {
    if (isNative) {
      const success = await admobService.showRewardVideo();
      if (success) {
        onUnlock('ad');
      } else {
        alert('Ad failed to load. Try again later.');
      }
    } else {
      await crazyGames.requestAd('rewarded');
      onUnlock('ad');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in"
      style={{ backgroundColor: "#593d3de6" }}
    >
      <div 
        className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1661777032455-5582bf3eba07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-500 mb-3 shadow-lg shadow-yellow-500/10">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 drop-shadow-md">Continue Your Adventure</h2>
          <p className="text-slate-300 text-sm font-medium drop-shadow-sm">
            {isNative ? "Unlock unlimited access or watch ads to play." : "Watch ads to continue playing."}
          </p>
        </div>

        <div className="space-y-3 relative z-10">
          {/* Ad Option */}
          <button
            onClick={handleWatchAd}
            className="w-full p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-sm">Watch Ads</div>
                <div className="text-[10px] text-slate-400">Watch 2 short videos to play</div>
              </div>
            </div>
            <div className="text-xs font-mono text-blue-400">
              {adCount}/2
            </div>
          </button>

          {/* Native Purchase Options */}
          {isNative && packages.map((pkg) => (
            <button
              key={pkg.identifier}
              onClick={() => handlePurchase(pkg)}
              disabled={loading}
              className="w-full p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-500/20 text-green-400 rounded-lg group-hover:scale-110 transition-transform">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-sm">{pkg.product.title}</div>
                  <div className="text-[10px] text-slate-400">{pkg.product.description}</div>
                </div>
              </div>
              <div className="text-sm font-bold text-green-400">
                {pkg.product.priceString}
              </div>
            </button>
          ))}

          {/* Loading State */}
          {isNative && loading && (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          )}

          {/* Restore Purchases */}
          {isNative && (
            <button 
              onClick={handleRestore}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-300 mt-2 flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Restore Purchases
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
