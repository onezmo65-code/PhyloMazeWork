declare global {
  interface Window {
    CrazyGames: {
      SDK: {
        init: () => Promise<void>;
        ad: {
          requestAd: (type: 'midgame' | 'rewarded') => Promise<void>;
        };
        game: {
          gameplayStart: () => Promise<void>;
          gameplayStop: () => Promise<void>;
        };
      };
    };
  }
}

export const crazyGames = {
  init: async () => {
    if (window.CrazyGames) {
      try {
        await window.CrazyGames.SDK.init();
        console.log('CrazyGames SDK initialized');
      } catch (e) {
        console.error('CrazyGames init error:', e);
      }
    }
  },
  requestAd: async (type: 'midgame' | 'rewarded') => {
    if (window.CrazyGames) {
      try {
        await window.CrazyGames.SDK.ad.requestAd(type);
      } catch (e) {
        console.error('CrazyGames ad error:', e);
      }
    } else {
      console.log('CrazyGames SDK not found (mock ad)');
    }
  },
  gameplayStart: async () => {
    if (window.CrazyGames) {
      try {
        await window.CrazyGames.SDK.game.gameplayStart();
      } catch (e) {
        console.error('CrazyGames gameplayStart error:', e);
      }
    }
  },
  gameplayStop: async () => {
    if (window.CrazyGames) {
      try {
        await window.CrazyGames.SDK.game.gameplayStop();
      } catch (e) {
        console.error('CrazyGames gameplayStop error:', e);
      }
    }
  }
};
