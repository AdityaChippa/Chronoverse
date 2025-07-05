'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Calendar, MapPin, Clock, AlertCircle, TrendingUp, Filter } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, Button, LoadingSpinner } from '@/components/ui';
import { getUpcomingLaunches } from '@/lib/api/astronomyData';
import { SpaceEvent } from '@/types/spaceEventExtensions';

export default function LaunchesPage() {
  const [launches, setLaunches] = useState<SpaceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const fetchLaunches = async () => {
      setLoading(true);
      try {
        const upcomingLaunches = await getUpcomingLaunches(20);
        setLaunches(upcomingLaunches);
      } catch (error) {
        console.error('Error fetching launches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);

  const getCountdown = (launchDate: string | Date) => {
    const now = new Date().getTime();
    const launch = new Date(launchDate).getTime();
    const distance = launch - now;

    if (distance < 0) return 'Launched';

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `T-${days}d ${hours}h`;
    if (hours > 0) return `T-${hours}h ${minutes}m`;
    return `T-${minutes}m`;
  };

  const agencies = ['all', 'SpaceX', 'NASA', 'ROSCOSMOS', 'ESA', 'ISRO'];

  const filteredLaunches = filter === 'all' 
    ? launches 
    : launches.filter(launch => launch.agency?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <PageLayout 
      title="Upcoming Launches" 
      description="Track rocket launches from space agencies around the world"
    >
      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="glass">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Launches</p>
                <p className="text-2xl font-bold text-white">{launches.length}</p>
              </div>
              <Rocket className="w-8 h-8 text-cosmic-purple" />
            </div>
          </Card>
          
          <Card variant="glass">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Week</p>
                <p className="text-2xl font-bold text-white">
                  {launches.filter(l => {
                    const launchDate = new Date(l.date);
                    const weekFromNow = new Date();
                    weekFromNow.setDate(weekFromNow.getDate() + 7);
                    return launchDate <= weekFromNow;
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-cosmic-pink" />
            </div>
          </Card>
          
          <Card variant="glass">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Countries</p>
                <p className="text-2xl font-bold text-white">
                  {[...new Set(launches.map(l => l.country))].filter(Boolean).length}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-cosmic-blue" />
            </div>
          </Card>
          
          <Card variant="glass">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Next Launch</p>
                <p className="text-2xl font-bold text-white">
                  {launches.length > 0 ? getCountdown(launches[0].date) : '--'}
                </p>
              </div>
              <Clock className="w-8 h-8 text-cosmic-cyan" />
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Filter Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card variant="glass" className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400">Filter by Agency:</span>
              <div className="flex flex-wrap gap-2">
                {agencies.map((agency) => (
                  <Button
                    key={agency}
                    variant={filter === agency.toLowerCase() ? 'gradient' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(agency.toLowerCase())}
                  >
                    {agency}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'list' ? 'gradient' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List View
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'gradient' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                Calendar
              </Button>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Launches List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" variant="orbit" />
        </div>
      ) : filteredLaunches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Rocket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-xl text-gray-400">No launches found</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {filteredLaunches.map((launch, index) => (
            <motion.div
              key={launch.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card variant="glass" className="overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Launch Image */}
                  <div className="lg:w-1/3 h-48 lg:h-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 z-10"></div>
                    {launch.imageUrl ? (
                      <img
                        src={launch.imageUrl}
                        alt={launch.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300/1a1a2e/ffffff?text=Rocket+Launch';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cosmic-purple/20 to-cosmic-pink/20 flex items-center justify-center">
                        <Rocket className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                    
                    {/* Countdown Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-400">Countdown</p>
                        <p className="text-lg font-bold text-white">{getCountdown(launch.date)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Launch Details */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{launch.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Rocket className="w-4 h-4 mr-1 text-cosmic-purple" />
                              {launch.agency}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-cosmic-pink" />
                              {launch.location}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-cosmic-blue" />
                              {new Date(launch.date).toLocaleDateString('en-US', { 
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="flex items-center space-x-2">
                          <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                            Scheduled
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 flex-1">{launch.description}</p>

                      {/* Mission Details */}
                      {launch.details && (
                        <div className="bg-white/5 rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-semibold text-gray-400 mb-2">Mission Details</h4>
                          <p className="text-gray-300 text-sm">{launch.details}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="gradient" size="sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Set Reminder
                          </Button>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < (launch.significance || 3) 
                                  ? 'bg-cosmic-purple' 
                                  : 'bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Launch Alerts CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <Card variant="gradient" className="p-8 text-center">
          <Rocket className="w-16 h-16 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Never Miss a Launch
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get notified about upcoming launches from your favorite space agencies. 
            Receive alerts 24 hours, 1 hour, and 10 minutes before liftoff.
          </p>
          <Button variant="gradient" size="lg">
            <AlertCircle className="w-5 h-5 mr-2" />
            Enable Launch Alerts
          </Button>
        </Card>
      </motion.section>
    </PageLayout>
  );
}