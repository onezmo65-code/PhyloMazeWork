import React, { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Handle autoplay policies
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay prevented:", error);
            // Interaction might be required
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, src]);

  return (
    <audio 
      ref={audioRef} 
      src={src} 
      loop 
      style={{ display: 'none' }} 
    />
  );
};
