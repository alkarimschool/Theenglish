import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface Props {
  text: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  rate?: number;
  className?: string;
}

export const TextToSpeechButton: React.FC<Props> = ({
  text,
  label,
  size = 'md',
  rate = 0.9,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!('speechSynthesis' in window)) {
      alert('Browser Anda tidak mendukung Text-to-Speech audio.');
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Try to find English voice if available
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const safeText = typeof text === 'string' ? text : String(text || '');

  return (
    <button
      id={`tts-btn-${(safeText.slice(0, 10) || 'audio').replace(/\s+/g, '-').toLowerCase()}`}
      type="button"
      onClick={handleSpeak}
      title="Dengarkan pengucapan audio (Pronunciation)"
      className={`inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200 cursor-pointer ${
        isPlaying
          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300 animate-pulse'
          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-200'
      } ${sizeClasses[size]} ${className}`}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 animate-bounce text-white" />
          <span>{label || 'Playing...'}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-emerald-700" />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
