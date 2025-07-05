'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Rocket, Globe, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEventContext } from '@/contexts/EventContext';
import { useRouter } from 'next/navigation';
import { debounce } from '@/lib/utils';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { events, searchEvents } = useEventContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = debounce((value: string) => {
    if (value.trim()) {
      // Generate suggestions based on query
      const eventSuggestions = events
        .filter(event => 
          event.title.toLowerCase().includes(value.toLowerCase()) ||
          event.description.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5)
        .map(event => ({
          type: 'event',
          icon: Calendar,
          title: event.title,
          subtitle: new Date(event.date).getFullYear(),
          action: () => {
            const date = new Date(event.date);
            router.push(`/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}#${event.id}`);
          }
        }));

      // Add quick navigation suggestions
      const navigationSuggestions = [
        {
          type: 'navigation',
          icon: Rocket,
          title: 'Explore Missions',
          subtitle: 'Active space missions',
          action: () => router.push('/missions')
        },
        {
          type: 'navigation',
          icon: Globe,
          title: 'Track Satellites',
          subtitle: 'Live satellite positions',
          action: () => router.push('/orbit')
        }
      ].filter(nav => nav.title.toLowerCase().includes(value.toLowerCase()));

      setSuggestions([...eventSuggestions, ...navigationSuggestions]);
    } else {
      setSuggestions([]);
    }
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    handleSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchEvents(query);
      router.push(`/events?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cosmic-grey-500 pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder="Search events, missions, or ask about space..."
            className="pl-10 pr-10 h-12 bg-cosmic-grey-900/80 border-cosmic-grey-700 text-cosmic-grey-100 placeholder:text-cosmic-grey-500 text-lg"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-cosmic-grey-500 hover:text-cosmic-grey-300"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 cosmic-glass cosmic-border rounded-lg overflow-hidden z-50"
          >
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    suggestion.action();
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-cosmic-grey-800/50 transition-cosmic text-left"
                >
                  <suggestion.icon className="h-5 w-5 text-cosmic-grey-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-cosmic-grey-100 font-medium truncate">
                      {suggestion.title}
                    </p>
                    <p className="text-cosmic-grey-500 text-sm truncate">
                      {suggestion.subtitle}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}