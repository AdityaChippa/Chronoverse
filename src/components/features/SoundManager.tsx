'use client';

import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as Tone from 'tone';

export function SoundManager() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
  const [noise, setNoise] = useState<Tone.Noise | null>(null);

  useEffect(() => {
    // Initialize Tone.js
    const initAudio = async () => {
      await Tone.start();
      
      // Create ambient synth
      const polySynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: {
          attack: 2,
          decay: 1,
          sustain: 0.5,
          release: 4
        }
      }).toDestination();
      
      polySynth.volume.value = -20;
      setSynth(polySynth);

      // Create white noise for ambient effect
      const whiteNoise = new Tone.Noise('white').toDestination();
      whiteNoise.volume.value = -40;
      setNoise(whiteNoise);
    };

    initAudio();

    return () => {
      synth?.dispose();
      noise?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!synth || !noise) return;

    if (isPlaying && !isMuted) {
      // Start ambient space sounds
      noise.start();
      
      // Play random cosmic notes
      const playRandomNotes = () => {
        const notes = ['C2', 'E2', 'G2', 'C3', 'E3', 'G3', 'B3'];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        synth.triggerAttackRelease(randomNote, '4n');
      };

      const interval = setInterval(playRandomNotes, 3000);
      
      return () => {
        clearInterval(interval);
        noise.stop();
      };
    } else {
      noise.stop();
    }
  }, [isPlaying, isMuted, synth, noise]);

  const toggleSound = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (synth) {
      synth.volume.value = isMuted ? -Infinity : -20;
    }
    if (noise) {
      noise.volume.value = isMuted ? -Infinity : -40;
    }
  };

  useEffect(() => {
    // Auto-start ambient sounds after user interaction
    const handleInteraction = () => {
      setIsPlaying(true);
      document.removeEventListener('click', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    return () => document.removeEventListener('click', handleInteraction);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-overlay">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="h-12 w-12 rounded-full cosmic-glass cosmic-border text-cosmic-grey-300 hover:text-cosmic-cream"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
    </div>
  );
}