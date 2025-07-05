'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Rocket, Telescope, Globe, Sparkles, Moon, Satellite, BookOpen } from 'lucide-react';
import { Universe } from '@/components/3d/Universe';
import { Timeline } from '@/components/features/Timeline';
import { EventCard } from '@/components/features/EventCard';
import { SearchBar } from '@/components/features/SearchBar';
import { Button } from '@/components/ui/button';
import { useEventContext } from '@/contexts/EventContext';
import { SpaceEvent } from '@/types';
import Link from 'next/link';

export default function HomePage() {
  const { todayEvents, loading } = useEventContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moonPhase, setMoonPhase] = useState<string>('');

  useEffect(() => {
    // Calculate moon phase
    const getMoonPhase = () => {
      const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 
                      'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
      const lunation = 29.53058867;
      const baseNewMoon = new Date('2000-01-06').getTime();
      const now = new Date().getTime();
      const daysSince = (now - baseNewMoon) / 86400000;
      const currentCycle = daysSince / lunation;
      const phaseIndex = Math.floor((currentCycle % 1) * 8);
      return phases[phaseIndex];
    };

    setMoonPhase(getMoonPhase());
  }, []);

  const features = [
    {
      icon: Calendar,
      title: "On This Day in Space",
      description: "Discover what happened in space history on today's date",
      link: `/${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`,
      gradient: "from-cosmic-skin-light to-cosmic-skin-medium"
    },
    {
      icon: Rocket,
      title: "Mission Simulator",
      description: "Command real space missions in an immersive environment",
      link: "/simulator",
      gradient: "from-cosmic-skin-medium to-cosmic-skin-dark"
    },
    {
      icon: Telescope,
      title: "Constellation Explorer",
      description: "Navigate the night sky and learn stellar mythology",
      link: "/constellation",
      gradient: "from-cosmic-grey-600 to-cosmic-grey-700"
    },
    {
      icon: Globe,
      title: "Live Satellite Tracker",
      description: "Track satellites orbiting Earth in real-time",
      link: "/orbit",
      gradient: "from-cosmic-grey-700 to-cosmic-grey-800"
    },
    {
      icon: Moon,
      title: "Lunar Phases",
      description: `Current phase: ${moonPhase}`,
      link: "/lunar",
      gradient: "from-cosmic-cream to-cosmic-grey-200"
    },
    {
      icon: Sparkles,
      title: "Mystery Mode",
      description: "Explore unsolved cosmic phenomena",
      link: "/mystery",
      gradient: "from-cosmic-grey-800 to-cosmic-black"
    },
    {
      icon: Satellite,
      title: "Space News Portal",
      description: "Latest updates from space agencies worldwide",
      link: "/news",
      gradient: "from-cosmic-skin-dark to-cosmic-grey-600"
    },
    {
      icon: BookOpen,
      title: "Cosmic Journals",
      description: "Create your personal space exploration diary",
      link: "/journals",
      gradient: "from-cosmic-grey-500 to-cosmic-grey-600"
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* 3D Universe Background */}
      <div className="three-container">
        <Universe />
      </div>

      {/* Hero Section */}
      <section className="relative z-content min-h-screen flex items-center justify-center">
        <div className="container-cosmic text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="font-display-1 text-cosmic-cream mb-6">
              ChronoVerse
            </h1>
            <p className="font-heading-2 text-cosmic-grey-300 mb-12 max-w-3xl mx-auto">
              Where Every Day Births a Universe of Discovery
            </p>
            
            <div className="max-w-2xl mx-auto mb-12">
              <SearchBar />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/events">
                <Button className="bg-cosmic-cream text-cosmic-black hover:bg-cosmic-skin-light">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Explore Timeline
                </Button>
              </Link>
              <Link href="/missions">
                <Button variant="outline" className="border-cosmic-grey-600 text-cosmic-grey-200 hover:bg-cosmic-grey-900">
                  <Rocket className="mr-2 h-5 w-5" />
                  Active Missions
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-cosmic-grey-400"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M19 12l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Today's Events Section */}
      {!loading && todayEvents.length > 0 && (
        <section className="relative z-content py-24 cosmic-gradient">
          <div className="container-cosmic">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display-3 text-cosmic-cream mb-12 text-center">
                On This Day in Space History
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {todayEvents.slice(0, 3).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {todayEvents.length > 3 && (
                <div className="text-center mt-12">
                  <Link href={`/${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`}>
                    <Button variant="outline" className="border-cosmic-grey-600 text-cosmic-grey-200">
                      View All {todayEvents.length} Events
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="relative z-content py-24">
        <div className="container-cosmic">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display-3 text-cosmic-cream mb-16 text-center">
              Explore the Cosmos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={feature.link}>
                    <div className="group relative h-full cosmic-border rounded-xl overflow-hidden transition-cosmic hover:cosmic-glow">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                      <div className="relative p-6">
                        <feature.icon className="h-12 w-12 text-cosmic-cream mb-4" />
                        <h3 className="font-heading-3 text-cosmic-grey-100 mb-2">
                          {feature.title}
                        </h3>
                        <p className="font-body-sm text-cosmic-grey-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Timeline Preview */}
      <section className="relative z-content py-24 cosmic-gradient">
        <div className="container-cosmic">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display-3 text-cosmic-cream mb-12 text-center">
              Journey Through Time
            </h2>
            <p className="font-body-lg text-cosmic-grey-300 text-center mb-16 max-w-3xl mx-auto">
              Scroll through decades of space exploration. Every moment, a new discovery awaits.
            </p>
            
            <Timeline />
          </motion.div>
        </div>
      </section>
    </div>
  );
}