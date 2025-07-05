'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/features/EventCard';
import { useEventContext } from '@/contexts/EventContext';
import { formatDate } from '@/lib/utils';

export default function DatePage() {
  const params = useParams();
  const router = useRouter();
  const { getEventsByDate } = useEventContext();
  const [events, setEvents] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    if (params.year && params.month && params.day) {
      const date = new Date(
        parseInt(params.year as string),
        parseInt(params.month as string) - 1,
        parseInt(params.day as string)
      );
      setCurrentDate(date);
      setEvents(getEventsByDate(date));
    }
  }, [params, getEventsByDate]);

  const navigateDate = (direction: 'prev' | 'next') => {
    if (!currentDate) return;
    
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    
    router.push(`/${newDate.getFullYear()}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${String(newDate.getDate()).padStart(2, '0')}`);
  };

  if (!currentDate) return null;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-cosmic">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display-2 text-cosmic-cream mb-4">
            {dayNames[currentDate.getDay()]}
          </h1>
          <p className="font-heading-1 text-cosmic-grey-300">
            {monthNames[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}
          </p>
        </motion.div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-12 max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigateDate('prev')}
            className="text-cosmic-grey-400 hover:text-cosmic-cream"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Previous Day
          </Button>

          <Link href="/events">
            <Button variant="outline" size="icon">
              <Calendar className="h-5 w-5" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            onClick={() => navigateDate('next')}
            className="text-cosmic-grey-400 hover:text-cosmic-cream"
          >
            Next Day
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {/* Events */}
        {events.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-heading-1 text-cosmic-cream mb-8 text-center">
              {events.length} Event{events.length > 1 ? 's' : ''} on This Day
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Sparkles className="h-16 w-16 text-cosmic-grey-600 mx-auto mb-6" />
            <h2 className="font-heading-1 text-cosmic-grey-400 mb-4">
              No Recorded Events
            </h2>
            <p className="text-cosmic-grey-500 max-w-md mx-auto mb-8">
              No space events were recorded for this date. Every day is an opportunity for new discoveries!
            </p>
            <Link href="/events">
              <Button variant="outline">
                Explore Other Dates
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Historical Context */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 cosmic-border rounded-lg p-8 text-center"
        >
          <Clock className="h-8 w-8 text-cosmic-cream mx-auto mb-4" />
          <h3 className="font-heading-2 text-cosmic-grey-200 mb-2">
            Historical Perspective
          </h3>
          <p className="text-cosmic-grey-400 max-w-2xl mx-auto">
            {currentDate < new Date() 
              ? `This date is ${Math.floor((new Date().getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))} days in the past.`
              : `This date is ${Math.floor((currentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days in the future.`
            }
          </p>
        </motion.div>
      </div>
    </div>
  );
}