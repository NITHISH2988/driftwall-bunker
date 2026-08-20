import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Track {
  title: string;
  url: string;
  duration?: string;
}

interface MusicPlayerProps {
  tracks: Track[];
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
  isShuffle: boolean;
  setIsShuffle: (shuffle: boolean) => void;
}

export function MusicPlayer({
  tracks,
  onClose,
  audioRef,
  currentTrackIndex,
  setCurrentTrackIndex,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
  isShuffle,
  setIsShuffle
}: MusicPlayerProps) {
  
  const currentTrack = tracks[currentTrackIndex];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
    }
  };

  const prevTrack = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-auto">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#060010]/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Player Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-[#120F17]/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]"
      >
        <div className="p-8 pb-6 flex flex-col items-center">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          {/* Album Art Placeholder */}
          <div className="w-48 h-48 rounded-full border border-white/20 mb-8 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] relative flex items-center justify-center bg-black/50 group">
            <img 
              src="/logo.png" 
              alt="One Piece" 
              className={`w-32 h-32 object-contain transition-transform duration-[20s] ease-linear ${isPlaying ? 'rotate-[360deg]' : ''}`} 
              style={{ animation: isPlaying ? 'spin 10s linear infinite' : 'none' }}
            />
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 font-display">{currentTrack.title}</h2>
            <p className="text-white/50 text-sm uppercase tracking-widest">One Piece Original Soundtrack</p>
          </div>

          <div className="flex items-center justify-center gap-6 mb-8">
            <button 
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-3 rounded-full transition-colors ${isShuffle ? 'text-white bg-white/10' : 'text-white/40 hover:text-white/80'}`}
            >
              <Shuffle size={20} />
            </button>
            
            <button 
              onClick={prevTrack}
              className="p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <SkipBack size={24} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
            </button>
            
            <button 
              onClick={nextTrack}
              className="p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <SkipForward size={24} />
            </button>
            
            <button 
              onClick={() => {}}
              className="p-3 text-white/40 hover:text-white/80 rounded-full transition-colors"
            >
              <Repeat size={20} />
            </button>
          </div>

        </div>

        {/* Playlist */}
        <div className="bg-black/40 border-t border-white/5 max-h-64 overflow-y-auto hide-scrollbar">
          {tracks.map((track, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentTrackIndex(idx);
                if (!isPlaying) {
                  setIsPlaying(true);
                  if (audioRef.current) audioRef.current.play().catch(console.error);
                }
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/5 text-left border-b border-white/5 last:border-0 ${
                currentTrackIndex === idx ? 'bg-white/5' : ''
              }`}
            >
              <div className="w-8 text-center flex-shrink-0">
                {currentTrackIndex === idx && isPlaying ? (
                  <div className="flex items-end justify-center gap-1 h-4">
                    <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-white rounded-t-sm" />
                    <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1 bg-white rounded-t-sm" />
                    <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-white rounded-t-sm" />
                  </div>
                ) : (
                  <span className={`text-sm ${currentTrackIndex === idx ? 'text-white font-bold' : 'text-white/40'}`}>
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
              <span className={`flex-1 truncate ${currentTrackIndex === idx ? 'text-white font-medium' : 'text-white/70'}`}>
                {track.title}
              </span>
              {track.duration && (
                <span className="text-xs text-white/30">{track.duration}</span>
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
