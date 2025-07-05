'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon as MoonIcon, Calendar, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Moon } from '@/components/3d/Moon';

interface LunarPhaseData {
  phase: string;
  illumination: number;
  age: number;
  distance: number;
  nextNewMoon: Date;
  nextFullMoon: Date;
}

export default function LunarPage() {
  const [lunarData, setLunarData] = useState<LunarPhaseData | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    calculateLunarPhase(selectedDate);
  }, [selectedDate]);

  const calculateLunarPhase = (date: Date) => {
    // Lunar phase calculation
    const phases = [
      'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
      'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
    ];
    
    const lunation = 29.53058867; // Days in lunar cycle
    const baseNewMoon = new Date('2000-01-06').getTime();
    const now = date.getTime();
    const daysSince = (now - baseNewMoon) / 86400000;
    const currentCycle = daysSince / lunation;
    const phase = (currentCycle % 1) * lunation;
    const phaseIndex = Math.floor((phase / lunation) * 8);
    const illumination = Math.abs(Math.cos((phase / lunation) * Math.PI * 2)) * 100;

    // Calculate next phases
    const daysToNewMoon = phase > 0 ? lunation - phase : 0;
    const daysToFullMoon = phase < lunation / 2 ? lunation / 2 - phase : lunation * 1.5 - phase;

    setLunarData({
      phase: phases[phaseIndex],
      illumination: Math.round(illumination),
      age: Math.round(phase),
      distance: 384400 + Math.sin(phase / lunation * Math.PI * 2) * 20000,
      nextNewMoon: new Date(now + daysToNewMoon * 86400000),
      nextFullMoon: new Date(now + daysToFullMoon * 86400000)
    });
  };

  const phaseDescriptions: Record<string, string> = {
    'New Moon': 'The Moon is between Earth and the Sun, invisible from Earth.',
    'Waxing Crescent': 'A sliver of the Moon becomes visible after the New Moon.',
    'First Quarter': 'Half of the Moon is illuminated and visible.',
    'Waxing Gibbous': 'More than half of the Moon is illuminated.',
    'Full Moon': 'The entire face of the Moon is illuminated.',
    'Waning Gibbous': 'The Moon begins to decrease in illumination.',
    'Last Quarter': 'Half of the Moon is illuminated during its decrease.',
    'Waning Crescent': 'Only a sliver remains visible before the New Moon.'
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-cosmic">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display-2 text-cosmic-cream mb-4">Lunar Phases</h1>
          <p className="font-body-lg text-cosmic-grey-300 max-w-3xl mx-auto">
            Track the Moon's journey through its phases and explore lunar events
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Moon Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-[500px] cosmic-border rounded-xl overflow-hidden"
          >
            <Canvas>
              <ambientLight intensity={0.1} />
              <directionalLight position={[5, 0, 0]} intensity={1} />
              <Moon scale={2} showPhases />
              <OrbitControls enablePan={false} />
              <fog attach="fog" args={['#000000', 5, 20]} />
            </Canvas>
          </motion.div>

          {/* Lunar Information */}
          <div className="space-y-6">
            {lunarData && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MoonIcon className="h-6 w-6" />
                        Current Phase
                      </CardTitle>
                      <CardDescription>
                        {selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-heading-2 text-cosmic-cream mb-2">
                            {lunarData.phase}
                          </h3>
                          <p className="text-cosmic-grey-400">
                            {phaseDescriptions[lunarData.phase]}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-cosmic-grey-500 text-sm">Illumination</p>
                            <p className="font-heading-3 text-cosmic-cream">
                              {lunarData.illumination}%
                            </p>
                          </div>
                          <div>
                            <p className="text-cosmic-grey-500 text-sm">Age</p>
                            <p className="font-heading-3 text-cosmic-cream">
                              {lunarData.age} days
                            </p>
                          </div>
                          <div>
                            <p className="text-cosmic-grey-500 text-sm">Distance</p>
                            <p className="font-heading-3 text-cosmic-cream">
                              {Math.round(lunarData.distance).toLocaleString()} km
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Upcoming Phases
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-cosmic-grey-400">Next New Moon</span>
                        <span className="text-cosmic-cream">
                          {lunarData.nextNewMoon.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-cosmic-grey-400">Next Full Moon</span>
                        <span className="text-cosmic-cream">
                          {lunarData.nextFullMoon.toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Lunar Facts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-cosmic-grey-300">
                      <p>• The Moon orbits Earth every 27.3 days</p>
                      <p>• Lunar phases cycle every 29.5 days</p>
                      <p>• The Moon is moving away from Earth at 3.8 cm/year</p>
                      <p>• Only 59% of the Moon's surface is visible from Earth</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Date Picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <label className="text-cosmic-grey-400 block mb-4">
            Select a date to see the Moon phase
          </label>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="bg-cosmic-grey-900 cosmic-border rounded-lg px-4 py-2 text-cosmic-cream"
          />
        </motion.div>
      </div>
    </div>
  );
}