"use client";

import { useRef, useState } from 'react';

export function SoundToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        type="button"
        onClick={toggleSound}
        className="px-4 py-2 border-2 border-[var(--neon-pink)] text-[var(--neon-pink)]"
      >
        AUDIO: {isPlaying ? 'ON' : 'OFF'}
      </button>
      <audio ref={audioRef} loop src="/sounds/ambient.mp3" />
    </div>
  );
}