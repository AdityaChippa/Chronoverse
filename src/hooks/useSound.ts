import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useSoundContext } from '@/contexts/SoundContext';

export function useSound(soundName: string) {
  const { soundEnabled, playSound } = useSoundContext();
  const synthRef = useRef<Tone.Synth | null>(null);
  
  useEffect(() => {
    synthRef.current = new Tone.Synth().toDestination();
    
    return () => {
      synthRef.current?.dispose();
    };
  }, []);
  
  const play = (note: string = 'C4', duration: string = '8n') => {
    if (!soundEnabled || !synthRef.current) return;
    
    Tone.start().then(() => {
      synthRef.current?.triggerAttackRelease(note, duration);
      playSound(soundName);
    });
  };
  
  return { play };
}

export function useAmbientSound() {
  const { soundEnabled } = useSoundContext();
  const noiseRef = useRef<Tone.Noise | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  
  useEffect(() => {
    if (!soundEnabled) return;
    
    // Create ambient space sound
    filterRef.current = new Tone.Filter(800, 'lowpass').toDestination();
    noiseRef.current = new Tone.Noise('pink').connect(filterRef.current);
    noiseRef.current.volume.value = -30;
    
    Tone.start().then(() => {
      noiseRef.current?.start();
    });
    
    return () => {
      noiseRef.current?.stop();
      noiseRef.current?.dispose();
      filterRef.current?.dispose();
    };
  }, [soundEnabled]);
}