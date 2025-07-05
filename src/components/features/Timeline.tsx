'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, Calendar, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEventContext } from '@/contexts/EventContext';
import { EventCard } from './EventCard';
import { formatDate } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { events } = useEventContext();

  const years = Array.from(
    new Set(events.map(e => new Date(e.date).getFullYear()))
  ).sort((a, b) => b - a);

  const eventsByYear = events.reduce((acc, event) => {
    const year = new Date(event.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {} as Record<number, typeof events>);

  useEffect(() => {
    if (!timelineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.timeline-item',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, timelineRef);

    return () => ctx.revert();
  }, [selectedYear]);

  const navigateYear = (direction: 'prev' | 'next') => {
    const currentIndex = years.indexOf(selectedYear);
    if (direction === 'prev' && currentIndex < years.length - 1) {
      setSelectedYear(years[currentIndex + 1]);
    } else if (direction === 'next' && currentIndex > 0) {
      setSelectedYear(years[currentIndex - 1]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Year Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateYear('prev')}
          disabled={selectedYear === years[years.length - 1]}
          className="text-cosmic-grey-400 hover:text-cosmic-cream"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <motion.h3
          key={selectedYear}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display-2 text-cosmic-cream"
        >
          {selectedYear}
        </motion.h3>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateYear('next')}
          disabled={selectedYear === years[0]}
          className="text-cosmic-grey-400 hover:text-cosmic-cream"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-cosmic-grey-700" />

        {/* Events */}
        <div className="space-y-8">
          {eventsByYear[selectedYear]?.map((event, index) => (
            <motion.div
              key={event.id}
              className="timeline-item relative flex items-start"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {/* Timeline Dot */}
              <div className="absolute left-8 w-4 h-4 -translate-x-1/2">
                <motion.div
                  className="w-full h-full rounded-full bg-cosmic-cream"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                />
                <div className="absolute inset-0 rounded-full bg-cosmic-cream/30 animate-ping" />
              </div>

              {/* Content */}
              <div className="ml-16 flex-1">
                <div className="mb-2 text-cosmic-grey-500 text-sm">
                  {formatDate(event.date)}
                </div>
                <EventCard event={event} variant="compact" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Year Overview */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cosmic-border rounded-lg p-4 text-center"
        >
          <Rocket className="h-8 w-8 text-cosmic-cream mx-auto mb-2" />
          <div className="text-2xl font-bold text-cosmic-grey-100">
            {eventsByYear[selectedYear]?.filter(e => e.type === 'LAUNCH').length || 0}
          </div>
          <div className="text-sm text-cosmic-grey-400">Launches</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cosmic-border rounded-lg p-4 text-center"
        >
          <Star className="h-8 w-8 text-cosmic-cream mx-auto mb-2" />
          <div className="text-2xl font-bold text-cosmic-grey-100">
            {eventsByYear[selectedYear]?.filter(e => e.significance >= 8).length || 0}
          </div>
          <div className="text-sm text-cosmic-grey-400">Major Events</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cosmic-border rounded-lg p-4 text-center"
        >
          <Calendar className="h-8 w-8 text-cosmic-cream mx-auto mb-2" />
          <div className="text-2xl font-bold text-cosmic-grey-100">
            {eventsByYear[selectedYear]?.length || 0}
          </div>
          <div className="text-sm text-cosmic-grey-400">Total Events</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cosmic-border rounded-lg p-4 text-center"
        >
          <div className="h-8 w-8 text-cosmic-cream mx-auto mb-2 font-serif text-2xl">∞</div>
          <div className="text-2xl font-bold text-cosmic-grey-100">
            {new Set(eventsByYear[selectedYear]?.map(e => e.country).filter(Boolean)).size || 0}
          </div>
          <div className="text-sm text-cosmic-grey-400">Countries</div>
        </motion.div>
      </div>
    </div>
  );
}