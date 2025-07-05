// components/features/Timeline/index.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Rocket, Star } from 'lucide-react';
import { useEventContext } from '@/contexts/EventContext';

export function Timeline() {
  const { events } = useEventContext();
  
  // Group events by year
  const eventsByYear = events.reduce((acc, event) => {
    const year = new Date(event.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as Record<number, typeof events>);

  const years = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-cosmic-grey-800" />
      
      {years.map((year, yearIndex) => (
        <div key={year} className="mb-12">
          {/* Year marker */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: yearIndex * 0.1 }}
            className="flex items-center mb-6"
          >
            <div className="w-16 h-16 bg-cosmic-purple rounded-full flex items-center justify-center relative z-10">
              <span className="text-cosmic-cream font-bold">{year}</span>
            </div>
            <h2 className="ml-6 text-2xl font-display text-cosmic-cream">{year}</h2>
          </motion.div>
          
          {/* Events for this year */}
          <div className="ml-24 space-y-4">
            {eventsByYear[year].map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: yearIndex * 0.1 + index * 0.05 }}
                className="relative"
              >
                {/* Event dot */}
                <div className="absolute -left-[4.5rem] top-6 w-4 h-4 bg-cosmic-pink rounded-full" />
                
                {/* Event card */}
                <div className="bg-cosmic-grey-900 rounded-lg p-6 border border-cosmic-grey-800 hover:border-cosmic-purple transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-cosmic-cream">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-cosmic-grey-400 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <p className="text-cosmic-grey-300 mb-4">{event.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    {event.agency && (
                      <span className="flex items-center text-cosmic-grey-400">
                        <Rocket className="w-4 h-4 mr-1" />
                        {event.agency}
                      </span>
                    )}
                    {event.significance && (
                      <span className="flex items-center text-cosmic-grey-400">
                        <Star className="w-4 h-4 mr-1" />
                        Significance: {event.significance}/5
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Export as default as well
export default Timeline;