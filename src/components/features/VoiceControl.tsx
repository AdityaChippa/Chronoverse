'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAIContext } from '@/contexts/AIContext';

export function VoiceControl() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const router = useRouter();
  const { sendMessage } = useAIContext();

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = async (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript.toLowerCase();
      setTranscript(transcript);

      if (event.results[current].isFinal) {
        // Process voice commands
        await processVoiceCommand(transcript);
        setTranscript('');
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const processVoiceCommand = async (command: string) => {
    // Navigation commands
    if (command.includes('go to') || command.includes('navigate to') || command.includes('show me')) {
      if (command.includes('mission')) {
        router.push('/missions');
        speak('Navigating to missions');
      } else if (command.includes('timeline') || command.includes('event')) {
        router.push('/events');
        speak('Opening the timeline');
      } else if (command.includes('satellite')) {
        router.push('/orbit');
        speak('Opening satellite tracker');
      } else if (command.includes('moon') || command.includes('lunar')) {
        router.push('/lunar');
        speak('Showing lunar phases');
      } else if (command.includes('gallery')) {
        router.push('/gallery');
        speak('Opening cosmic gallery');
      } else if (command.includes('news')) {
        router.push('/news');
        speak('Loading space news');
      } else if (command.includes('home')) {
        router.push('/');
        speak('Going home');
      }
    } 
    // Search commands
    else if (command.includes('search for') || command.includes('find')) {
      const searchQuery = command.replace(/search for|find/g, '').trim();
      router.push(`/events?search=${encodeURIComponent(searchQuery)}`);
      speak(`Searching for ${searchQuery}`);
    }
    // AI assistant commands
    else if (command.includes('nova') || command.includes('assistant')) {
      await sendMessage(command);
    }
    // Date navigation
    else if (command.includes('today')) {
      const today = new Date();
      router.push(`/${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`);
      speak("Showing today's events");
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      speak('Listening for commands');
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleListening}
        className={`relative ${isListening ? 'text-cosmic-cream' : 'text-cosmic-grey-300'} hover:text-cosmic-cream`}
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Mic className="h-5 w-5" />
          </motion.div>
        ) : (
          <MicOff className="h-5 w-5" />
        )}
      </Button>

      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 cosmic-glass cosmic-border rounded-lg px-4 py-2 z-50"
          >
            <p className="text-cosmic-grey-200 text-sm">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}