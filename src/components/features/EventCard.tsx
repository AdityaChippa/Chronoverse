'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Building2, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SpaceEvent, EventType } from '@/types';
import { formatDate, getRelativeTime } from '@/lib/utils';
import Link from 'next/link';

interface EventCardProps {
  event: SpaceEvent;
  variant?: 'default' | 'compact';
}

export function EventCard({ event, variant = 'default' }: EventCardProps) {
  const typeColors: Record<EventType, string> = {
    [EventType.LAUNCH]: 'bg-green-500/20 text-green-300',
    [EventType.LANDING]: 'bg-blue-500/20 text-blue-300',
    [EventType.DISCOVERY]: 'bg-purple-500/20 text-purple-300',
    [EventType.MILESTONE]: 'bg-yellow-500/20 text-yellow-300',
    [EventType.DISASTER]: 'bg-red-500/20 text-red-300',
    [EventType.OBSERVATION]: 'bg-cyan-500/20 text-cyan-300',
    [EventType.ACHIEVEMENT]: 'bg-orange-500/20 text-orange-300',
  };

  const Badge = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );

  const eventDate = new Date(event.date);
  const eventUrl = `/${eventDate.getFullYear()}/${String(eventDate.getMonth() + 1).padStart(2, '0')}/${String(eventDate.getDate()).padStart(2, '0')}#${event.id}`;

  if (variant === 'compact') {
    return (
      <Link href={eventUrl}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 cosmic-border rounded-lg hover:bg-cosmic-grey-900/50 transition-cosmic cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-body font-semibold text-cosmic-grey-100 mb-1">
                {event.title}
              </h4>
              <p className="text-cosmic-grey-400 text-sm line-clamp-2">
                {event.description}
              </p>
            </div>
            <Badge className={`ml-3 ${typeColors[event.type]}`}>
              {event.type}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-cosmic-grey-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(event.date)}
            </span>
            {event.agency && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {event.agency}
              </span>
            )}
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={eventUrl}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Card className="h-full overflow-hidden hover:cosmic-glow transition-cosmic cursor-pointer">
          {event.imageUrl && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black/80 to-transparent" />
              <Badge className={`absolute top-4 right-4 ${typeColors[event.type]}`}>
                {event.type}
              </Badge>
            </div>
          )}
          
          <CardHeader className={!event.imageUrl ? 'pb-3' : ''}>
            {!event.imageUrl && (
              <Badge className={`mb-3 w-fit ${typeColors[event.type]}`}>
                {event.type}
              </Badge>
            )}
            <CardTitle className="line-clamp-2">{event.title}</CardTitle>
            <CardDescription className="text-cosmic-grey-400">
              {getRelativeTime(event.date)}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="text-cosmic-grey-300 line-clamp-3 mb-4">
              {event.description}
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-cosmic-grey-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(event.date)}
              </div>
              
              {event.country && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.country}
                </div>
              )}
              
              {event.agency && (
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {event.agency}
                </div>
              )}
              
              <div className="flex items-center gap-1 ml-auto">
                <Star className="h-4 w-4" />
                {event.significance}/10
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}