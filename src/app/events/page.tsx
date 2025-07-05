'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/features/EventCard';
import { Timeline } from '@/components/features/Timeline';
import { FilterPanel } from '@/components/features/FilterPanel';
import { SearchBar } from '@/components/features/SearchBar';
import { useEventContext } from '@/contexts/EventContext';

export default function EventsPage() {
  const { events, loading } = useEventContext();
  const [view, setView] = useState<'grid' | 'list' | 'timeline'>('grid');

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-cosmic">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-display-2 text-cosmic-cream mb-4">Space Timeline</h1>
          <p className="font-body-lg text-cosmic-grey-300 max-w-3xl">
            Journey through humanity's greatest achievements in space exploration
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar />
          </div>
          
          <div className="flex gap-2">
            <div className="flex bg-cosmic-grey-900 rounded-lg p-1">
              <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'timeline' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('timeline')}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
            
            <FilterPanel />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="loading-spinner w-12 h-12" />
          </div>
        ) : (
          <>
            {view === 'grid' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {view === 'list' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <EventCard event={event} variant="compact" />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {view === 'timeline' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Timeline />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}