'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Satellite as SatelliteIcon, Globe, Clock, Radio, Search, Filter } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Earth } from '@/components/3d/Earth';
import { Satellite } from '@/components/3d/Satellite';
import PageLayout from '@/components/layout/PageLayout';

interface SatelliteData {
  id: string;
  name: string;
  noradId: string;
  type: string;
  country: string;
  altitude: number;
  velocity: number;
  period: number;
  inclination: number;
  isActive: boolean;
  position: {
    lat: number;
    lon: number;
    alt: number;
  };
}

// Simulated satellite data
const mockSatellites: SatelliteData[] = [
  {
    id: '1',
    name: 'International Space Station (ISS)',
    noradId: '25544',
    type: 'Space Station',
    country: 'International',
    altitude: 408,
    velocity: 7.66,
    period: 92.68,
    inclination: 51.64,
    isActive: true,
    position: { lat: 28.5, lon: -80.6, alt: 408 }
  },
  {
    id: '2',
    name: 'Hubble Space Telescope',
    noradId: '20580',
    type: 'Telescope',
    country: 'USA',
    altitude: 547,
    velocity: 7.59,
    period: 95.42,
    inclination: 28.47,
    isActive: true,
    position: { lat: 15.3, lon: 120.5, alt: 547 }
  },
  {
    id: '3',
    name: 'Starlink-1234',
    noradId: '45678',
    type: 'Communication',
    country: 'USA',
    altitude: 550,
    velocity: 7.58,
    period: 95.6,
    inclination: 53.0,
    isActive: true,
    position: { lat: -10.2, lon: 45.8, alt: 550 }
  },
  {
    id: '4',
    name: 'GOES-16',
    noradId: '41866',
    type: 'Weather',
    country: 'USA',
    altitude: 35786,
    velocity: 3.07,
    period: 1436,
    inclination: 0.04,
    isActive: true,
    position: { lat: 0, lon: -75.2, alt: 35786 }
  }
];

export default function OrbitPage() {
  const [satellites, setSatellites] = useState<SatelliteData[]>(mockSatellites);
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Simulate real-time position updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSatellites(prev => prev.map(sat => ({
        ...sat,
        position: {
          lat: sat.position.lat + (Math.random() - 0.5) * 2,
          lon: (sat.position.lon + 0.5) % 360 - 180,
          alt: sat.altitude + (Math.random() - 0.5) * 10
        }
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const filteredSatellites = satellites.filter(sat => {
    const matchesSearch = sat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sat.noradId.includes(searchQuery);
    const matchesType = filterType === 'all' || sat.type === filterType;
    return matchesSearch && matchesType;
  });

  const satelliteTypes = ['all', 'Space Station', 'Communication', 'Weather', 'Telescope', 'Navigation'];

  return (
    <PageLayout
      title="Satellite Tracker"
      description="Track satellites and space stations orbiting Earth in real-time"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <SatelliteIcon className="h-8 w-8 text-cosmic-purple mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-cosmic-cream">{satellites.length}</h3>
          <p className="text-cosmic-grey-400">Active Satellites</p>
        </Card>
        
        <Card className="text-center">
          <Globe className="h-8 w-8 text-cosmic-pink mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-cosmic-cream">
            {satellites.filter(s => s.altitude < 2000).length}
          </h3>
          <p className="text-cosmic-grey-400">Low Earth Orbit</p>
        </Card>
        
        <Card className="text-center">
          <Radio className="h-8 w-8 text-cosmic-blue mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-cosmic-cream">
            {satellites.filter(s => s.type === 'Communication').length}
          </h3>
          <p className="text-cosmic-grey-400">Communication Sats</p>
        </Card>
        
        <Card className="text-center">
          <Clock className="h-8 w-8 text-cosmic-cyan mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-cosmic-cream">Live</h3>
          <p className="text-cosmic-grey-400">Real-time Tracking</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3D Earth Visualization */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] p-0 overflow-hidden">
            <Canvas camera={{ position: [0, 0, 3] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Earth />
              {filteredSatellites.map((sat) => (
                <Satellite
                  key={sat.id}
                  position={[
                    Math.cos(sat.position.lat * Math.PI / 180) * Math.cos(sat.position.lon * Math.PI / 180) * (1 + sat.altitude / 6371),
                    Math.sin(sat.position.lat * Math.PI / 180) * (1 + sat.altitude / 6371),
                    Math.cos(sat.position.lat * Math.PI / 180) * Math.sin(sat.position.lon * Math.PI / 180) * (1 + sat.altitude / 6371)
                  ]}
                  orbitRadius={1 + sat.altitude / 6371}
                  orbitSpeed={0.001 * (6371 / (6371 + sat.altitude))}
                  name={sat.name}
                />
              ))}
              <OrbitControls enablePan={false} minDistance={1.5} maxDistance={5} />
            </Canvas>
          </Card>
        </div>

        {/* Satellite List and Controls */}
        <div className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cosmic-grey-500" />
                <Input
                  type="text"
                  placeholder="Search satellites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-cosmic-grey-400">Filter by type:</p>
                <div className="flex flex-wrap gap-2">
                  {satelliteTypes.map(type => (
                    <Button
                      key={type}
                      variant={filterType === type ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilterType(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Satellite List */}
          <Card className="max-h-[400px] overflow-y-auto">
            <h3 className="font-heading-3 text-cosmic-cream mb-4">Tracked Satellites</h3>
            <div className="space-y-3">
              {filteredSatellites.map((sat) => (
                <motion.div
                  key={sat.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedSatellite(sat)}
                  className={`p-3 rounded-lg cosmic-border cursor-pointer transition-all ${
                    selectedSatellite?.id === sat.id ? 'bg-cosmic-grey-800' : 'hover:bg-cosmic-grey-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-cosmic-cream">{sat.name}</h4>
                      <p className="text-sm text-cosmic-grey-400">
                        {sat.type} • {sat.country}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${sat.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <div className="mt-2 text-xs text-cosmic-grey-500">
                    Alt: {sat.altitude.toFixed(0)} km • 
                    Vel: {sat.velocity.toFixed(2)} km/s
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Selected Satellite Details */}
          {selectedSatellite && (
            <Card>
              <h3 className="font-heading-3 text-cosmic-cream mb-4">Satellite Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-cosmic-grey-500">NORAD ID</p>
                  <p className="text-cosmic-grey-200">{selectedSatellite.noradId}</p>
                </div>
                <div>
                  <p className="text-sm text-cosmic-grey-500">Orbital Period</p>
                  <p className="text-cosmic-grey-200">{selectedSatellite.period.toFixed(2)} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-cosmic-grey-500">Inclination</p>
                  <p className="text-cosmic-grey-200">{selectedSatellite.inclination.toFixed(2)}°</p>
                </div>
                <div>
                  <p className="text-sm text-cosmic-grey-500">Current Position</p>
                  <p className="text-cosmic-grey-200">
                    {selectedSatellite.position.lat.toFixed(2)}°, {selectedSatellite.position.lon.toFixed(2)}°
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}