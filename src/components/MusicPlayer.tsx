import React, { useEffect, useRef, useCallback } from 'react';

interface MusicPlayerProps {
  src: string;
  volume?: number; // 0.0 to 1.0
  isPlaying?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  src,
  volume = 0.1,
  isPlaying = true
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const tryPlay = useCallback(() => {
    if (audioRef.current && isPlaying && !hasStartedRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hasStartedRef.current = true;
          })
          .catch(() => {
            // Autoplay blocked - will retry on user interaction
          });
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    tryPlay();
  }, [tryPlay, src]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        tryPlay();
      } else {
        audioRef.current.pause();
        hasStartedRef.current = false;
      }
    }
  }, [isPlaying, tryPlay]);

  // Listen for any user interaction to start audio
  useEffect(() => {
    const handleInteraction = () => {
      tryPlay();
    };

    // Add listeners for various user interactions
    document.addEventListener('click', handleInteraction, { once: false });
    document.addEventListener('touchstart', handleInteraction, { once: false });
    document.addEventListener('keydown', handleInteraction, { once: false });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [tryPlay]);

  return (
    <audio
      ref={audioRef}
      src={src}
      loop
      style={{ display: 'none' }}
    />
  );
};
