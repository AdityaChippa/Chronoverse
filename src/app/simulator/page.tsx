'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Globe, Target, Fuel, AlertTriangle, CheckCircle,
  Gauge, Zap, Clock, Users, Play, Pause, RotateCcw,
  ArrowUp, ArrowDown, RotateCw, Settings, Radio,
  Navigation, Thermometer, Wind, Shield, Heart,
  Battery, Wifi, Moon, Sun
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, Button } from '@/components/ui';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Earth } from '@/components/3d/Earth';
import { Moon as Moon3D } from '@/components/3d/Moon';
import { Rocket as Rocket3D } from '@/components/3d/Rocket';

interface MissionState {
  phase: 'pre-launch' | 'launch' | 'ascent' | 'orbit' | 'transfer' | 'approach' | 'docking' | 'landing' | 'completed' | 'failed';
  altitude: number;
  velocity: number;
  fuel: number;
  oxygen: number;
  power: number;
  temperature: number;
  pressure: number;
  radiation: number;
  time: number;
  score: number;
  crew: number;
  missionObjectives: Record<string, boolean>;
  systemStatus: Record<string, 'nominal' | 'warning' | 'critical'>;
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'critical' | 'info' | 'success';
  message: string;
  timestamp: number;
  system?: string;
}

interface ControlInput {
  thrust: number;
  pitch: number;
  yaw: number;
  roll: number;
  rcs: boolean;
  sas: boolean;
  landing_gear: boolean;
}

const missions = [
  {
    id: 'iss-docking',
    title: 'ISS Docking Mission',
    description: 'Navigate your spacecraft to dock with the International Space Station',
    difficulty: 'intermediate',
    duration: '15-20 minutes',
    spacecraft: 'Dragon Capsule',
    objectives: {
      'launch': 'Launch successfully from Earth',
      'orbit': 'Achieve stable orbit at 408km',
      'rendezvous': 'Rendezvous with ISS',
      'approach': 'Approach within 200m',
      'dock': 'Complete soft docking'
    },
    parameters: {
      targetAltitude: 408,
      targetVelocity: 7.66,
      dockingVelocity: 0.1,
      fuelCapacity: 100,
      crewSize: 4
    }
  },
  {
    id: 'lunar-landing',
    title: 'Apollo-Style Lunar Landing',
    description: 'Recreate the historic journey to the Moon with precision landing',
    difficulty: 'expert',
    duration: '30-40 minutes',
    spacecraft: 'Lunar Module',
    objectives: {
      'tli': 'Trans-lunar injection burn',
      'cruise': 'Navigate to Moon',
      'loi': 'Lunar orbit insertion',
      'descent': 'Powered descent initiation',
      'landing': 'Soft landing at target site'
    },
    parameters: {
      targetAltitude: 100,
      landingAltitude: 0,
      maxLandingVelocity: 2,
      fuelCapacity: 100,
      crewSize: 2
    }
  },
  {
    id: 'mars-entry',
    title: 'Mars Entry, Descent & Landing',
    description: 'Execute the challenging EDL sequence for Mars landing',
    difficulty: 'expert',
    duration: '25-30 minutes',
    spacecraft: 'Mars Lander',
    objectives: {
      'entry': 'Enter Mars atmosphere',
      'deceleration': 'Deploy heat shield',
      'parachute': 'Deploy parachutes',
      'powered': 'Fire retro rockets',
      'touchdown': 'Land within target zone'
    },
    parameters: {
      entryVelocity: 5.9,
      parachuteAltitude: 11,
      poweredDescentAltitude: 1.5,
      maxLandingVelocity: 1,
      fuelCapacity: 100,
      crewSize: 0
    }
  },
  {
    id: 'spacewalk',
    title: 'EVA Repair Mission',
    description: 'Perform critical repairs during a spacewalk outside the ISS',
    difficulty: 'advanced',
    duration: '20-25 minutes',
    spacecraft: 'EMU Spacesuit',
    objectives: {
      'egress': 'Exit airlock safely',
      'translate': 'Navigate to repair site',
      'repair': 'Complete panel replacement',
      'return': 'Return to airlock',
      'ingress': 'Re-enter station'
    },
    parameters: {
      oxygenCapacity: 100,
      batteryCapacity: 100,
      tethers: 3,
      repairTime: 300,
      crewSize: 1
    }
  }
];

export default function SimulatorPage() {
  const [selectedMission, setSelectedMission] = useState<typeof missions[0] | null>(null);
  const [missionActive, setMissionActive] = useState(false);
  const [missionState, setMissionState] = useState<MissionState>({
    phase: 'pre-launch',
    altitude: 0,
    velocity: 0,
    fuel: 100,
    oxygen: 100,
    power: 100,
    temperature: 20,
    pressure: 101.3,
    radiation: 0.1,
    time: 0,
    score: 0,
    crew: 4,
    missionObjectives: {},
    systemStatus: {
      engines: 'nominal',
      life_support: 'nominal',
      navigation: 'nominal',
      communications: 'nominal',
      power: 'nominal',
      thermal: 'nominal'
    }
  });
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [controls, setControls] = useState<ControlInput>({
    thrust: 0,
    pitch: 0,
    yaw: 0,
    roll: 0,
    rcs: true,
    sas: true,
    landing_gear: false
  });
  const [telemetryView, setTelemetryView] = useState<'orbital' | 'systems' | 'crew'>('orbital');

  // Physics simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (missionActive && selectedMission) {
      interval = setInterval(() => {
        setMissionState(prev => {
          const newState = { ...prev };
          newState.time += 0.1;
          
          // Basic physics
          const gravity = newState.altitude < 100 ? 9.81 * Math.pow(6371 / (6371 + newState.altitude), 2) : 0;
          const thrust = controls.thrust * 30; // kN
          const mass = 10000 - (100 - newState.fuel) * 50; // kg
          const acceleration = (thrust / mass) - gravity;
          
          newState.velocity += acceleration * 0.1;
          newState.altitude = Math.max(0, newState.altitude + newState.velocity * 0.1);
          
          // Fuel consumption
          if (controls.thrust > 0) {
            newState.fuel = Math.max(0, newState.fuel - controls.thrust * 0.05);
          }
          
          // Life support
          newState.oxygen = Math.max(0, newState.oxygen - 0.01 * newState.crew);
          newState.power = Math.max(0, newState.power - 0.02);
          
          // Temperature management
          if (newState.phase === 'launch' || newState.phase === 'ascent') {
            newState.temperature += 0.5;
          } else {
            newState.temperature += (20 - newState.temperature) * 0.01;
          }
          
          // Radiation exposure
          if (newState.altitude > 400) {
            newState.radiation = Math.min(10, newState.radiation + 0.001);
          }
          
          // Phase transitions
          if (newState.altitude > 100 && newState.phase === 'launch') {
            newState.phase = 'ascent';
            addAlert('info', 'Reached space! Altitude > 100km');
            newState.score += 500;
          }
          
          if (selectedMission.parameters.targetAltitude && 
    newState.altitude > selectedMission.parameters.targetAltitude * 0.9 &&
              newState.phase === 'ascent') {
            newState.phase = 'orbit';
            addAlert('success', 'Orbital insertion successful!');
            newState.score += 1000;
            newState.missionObjectives['orbit'] = true;
          }
          
          // System failures
          if (newState.temperature > 100) {
            newState.systemStatus.thermal = 'critical';
            addAlert('critical', 'Thermal system critical! Temperature too high');
          }
          
          if (newState.fuel < 20) {
            newState.systemStatus.engines = 'warning';
            addAlert('warning', 'Low fuel warning!');
          }
          
          if (newState.oxygen < 30) {
            newState.systemStatus.life_support = 'warning';
            addAlert('warning', 'Oxygen levels low!');
          }
          
          // Mission failure conditions
          if (newState.fuel <= 0 && selectedMission.parameters.targetAltitude && newState.altitude < selectedMission.parameters.targetAltitude) {
            newState.phase = 'failed';
            addAlert('critical', 'Mission failed: Out of fuel');
            setMissionActive(false);
          }
          
          if (newState.oxygen <= 0) {
            newState.phase = 'failed';
            addAlert('critical', 'Mission failed: Life support failure');
            setMissionActive(false);
          }
          
          if (newState.altitude === 0 && newState.velocity < -5) {
            newState.phase = 'failed';
            addAlert('critical', 'Mission failed: Crash landing');
            setMissionActive(false);
          }
          
          return newState;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [missionActive, controls, selectedMission]);

  const addAlert = (type: SystemAlert['type'], message: string, system?: string) => {
    const alert: SystemAlert = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now(),
      system
    };
    setAlerts(prev => [alert, ...prev.slice(0, 9)]);
  };

  const startMission = (mission: typeof missions[0]) => {
    setSelectedMission(mission);
    setMissionActive(true);
    setMissionState({
      phase: 'pre-launch',
      altitude: 0,
      velocity: 0,
      fuel: 100,
      oxygen: 100,
      power: 100,
      temperature: 20,
      pressure: 101.3,
      radiation: 0.1,
      time: 0,
      score: 0,
      crew: mission.parameters.crewSize,
      missionObjectives: Object.keys(mission.objectives).reduce((acc, key) => ({
        ...acc,
        [key]: false
      }), {}),
      systemStatus: {
        engines: 'nominal',
        life_support: 'nominal',
        navigation: 'nominal',
        communications: 'nominal',
        power: 'nominal',
        thermal: 'nominal'
      }
    });
    setAlerts([]);
    addAlert('info', `${mission.title} initialized. All systems nominal.`);
  };

  const resetMission = () => {
    setMissionActive(false);
    setSelectedMission(null);
    setControls({
      thrust: 0,
      pitch: 0,
      yaw: 0,
      roll: 0,
      rcs: true,
      sas: true,
      landing_gear: false
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `T+${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      'pre-launch': 'text-yellow-400',
      'launch': 'text-orange-400',
      'ascent': 'text-blue-400',
      'orbit': 'text-green-400',
      'transfer': 'text-purple-400',
      'approach': 'text-cyan-400',
      'docking': 'text-pink-400',
      'landing': 'text-emerald-400',
      'completed': 'text-green-500',
      'failed': 'text-red-500'
    };
    return colors[phase] || 'text-gray-400';
  };

  const getSystemStatusColor = (status: string) => {
    return status === 'nominal' ? 'text-green-400' : 
           status === 'warning' ? 'text-yellow-400' : 'text-red-400';
  };

  return (
    <PageLayout
      title="Mission Simulator"
      description="Experience realistic space missions with advanced physics simulation and system management"
    >
      <div className="min-h-screen py-8">
        {!selectedMission ? (
          /* Mission Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {missions.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="h-full hover:scale-105 transition-transform">
                  <div className="p-4 bg-gradient-to-br from-cosmic-purple/20 to-cosmic-pink/20 rounded-full inline-flex mb-6">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-white mb-3">{mission.title}</h3>
                  <p className="text-gray-400 mb-4">{mission.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Spacecraft</p>
                      <p className="text-white">{mission.spacecraft}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Crew</p>
                      <p className="text-white">{mission.parameters.crewSize}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Difficulty</p>
                      <p className={`font-semibold ${
                        mission.difficulty === 'intermediate' ? 'text-yellow-400' :
                        mission.difficulty === 'advanced' ? 'text-orange-400' :
                        'text-red-400'
                      }`}>{mission.difficulty}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="text-white">{mission.duration}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-2">Mission Objectives:</h4>
                    <ul className="space-y-1">
                      {Object.values(mission.objectives).map((obj, i) => (
                        <li key={i} className="text-gray-400 text-sm flex items-center">
                          <Target className="w-3 h-3 mr-2 text-cosmic-blue" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button
                    onClick={() => startMission(mission)}
                    variant="gradient"
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Mission
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Mission Control Interface */
          <div className="space-y-6">
            {/* Mission Header */}
            <Card variant="gradient" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {selectedMission.title}
                  </h2>
                  <div className="flex items-center space-x-6">
                    <span className={`text-lg font-semibold ${getPhaseColor(missionState.phase)}`}>
                      {missionState.phase.replace(/-/g, ' ').toUpperCase()}
                    </span>
                    <span className="text-white">Mission Time: {formatTime(missionState.time)}</span>
                    <span className="text-white">Score: {missionState.score.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setMissionActive(!missionActive)}
                    variant="secondary"
                  >
                    {missionActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button onClick={resetMission} variant="secondary">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 3D Visualization */}
              <div className="lg:col-span-2 space-y-6">
                {/* 3D View */}
                <Card variant="glass" className="p-0 h-[400px] overflow-hidden">
                  <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Earth position={[0, -missionState.altitude / 100, -10]} />
                    {selectedMission.id === 'lunar-landing' && (
                      <Moon3D position={[3, 2, -5]} scale={0.5} />
                    )}
                    <Rocket3D 
                      position={[0, 0, 0]} 
                      launching={missionState.phase === 'launch' || missionState.phase === 'ascent'}
                    />
                    <OrbitControls enablePan={false} />
                  </Canvas>
                </Card>

                {/* Flight Instruments */}
                <Card variant="glass" className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">Flight Instruments</h3>
                    <div className="flex gap-2">
                      {['orbital', 'systems', 'crew'].map((view) => (
                        <Button
                          key={view}
                          variant={telemetryView === view ? 'gradient' : 'ghost'}
                          size="sm"
                          onClick={() => setTelemetryView(view as any)}
                        >
                          {view.charAt(0).toUpperCase() + view.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {telemetryView === 'orbital' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <Gauge className="w-8 h-8 text-cosmic-blue mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{missionState.altitude.toFixed(1)}</div>
                        <div className="text-sm text-gray-400">Altitude (km)</div>
                      </div>
                      <div className="text-center">
                        <ArrowUp className="w-8 h-8 text-cosmic-green mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{missionState.velocity.toFixed(2)}</div>
                        <div className="text-sm text-gray-400">Velocity (km/s)</div>
                      </div>
                      <div className="text-center">
                        <Fuel className="w-8 h-8 text-cosmic-orange mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{missionState.fuel.toFixed(0)}%</div>
                        <div className="text-sm text-gray-400">Fuel</div>
                      </div>
                      <div className="text-center">
                        <Navigation className="w-8 h-8 text-cosmic-purple mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{controls.pitch.toFixed(0)}°</div>
                        <div className="text-sm text-gray-400">Pitch</div>
                      </div>
                    </div>
                  )}

                  {telemetryView === 'systems' && (
                    <div className="space-y-3">
                      {Object.entries(missionState.systemStatus).map(([system, status]) => (
                        <div key={system} className="flex items-center justify-between p-3 bg-cosmic-grey-800 rounded-lg">
                          <span className="text-white capitalize">{system.replace(/_/g, ' ')}</span>
                          <span className={`font-semibold ${getSystemStatusColor(status)}`}>
                            {status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {telemetryView === 'crew' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <Users className="w-8 h-8 text-cosmic-blue mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{missionState.crew}</div>
                        <div className="text-sm text-gray-400">Crew</div>
                      </div>
                      <div className="text-center">
                        <Wind className="w-8 h-8 text-cosmic-cyan mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{missionState.oxygen.toFixed(0)}%</div>
                        <div className="text-sm text-gray-400">Oxygen</div>
                      </div>
                      <div className="text-center">
                        <Thermometer className="w-8 h-8 text-cosmic-orange mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{missionState.temperature.toFixed(1)}°C</div>
                        <div className="text-sm text-gray-400">Temperature</div>
                      </div>
                      <div className="text-center">
                        <Shield className="w-8 h-8 text-cosmic-pink mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{missionState.radiation.toFixed(2)}</div>
                        <div className="text-sm text-gray-400">Radiation (mSv)</div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Controls */}
                <Card variant="glass" className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Flight Controls</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-white">Main Engine Thrust</label>
                        <span className="text-cosmic-purple">{controls.thrust}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={controls.thrust}
                        onChange={(e) => setControls(prev => ({ ...prev, thrust: Number(e.target.value) }))}
                        className="w-full accent-cosmic-purple"
                        disabled={!missionActive}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-white mb-2">Pitch</label>
                        <input
                          type="range"
                          min="-90"
                          max="90"
                          value={controls.pitch}
                          onChange={(e) => setControls(prev => ({ ...prev, pitch: Number(e.target.value) }))}
                          className="w-full accent-cosmic-blue"
                          disabled={!missionActive}
                        />
                        <div className="text-center text-gray-400 mt-1">{controls.pitch}°</div>
                      </div>
                      <div>
                        <label className="block text-white mb-2">Yaw</label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={controls.yaw}
                          onChange={(e) => setControls(prev => ({ ...prev, yaw: Number(e.target.value) }))}
                          className="w-full accent-cosmic-green"
                          disabled={!missionActive}
                        />
                        <div className="text-center text-gray-400 mt-1">{controls.yaw}°</div>
                      </div>
                      <div>
                        <label className="block text-white mb-2">Roll</label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={controls.roll}
                          onChange={(e) => setControls(prev => ({ ...prev, roll: Number(e.target.value) }))}
                          className="w-full accent-cosmic-pink"
                          disabled={!missionActive}
                        />
                        <div className="text-center text-gray-400 mt-1">{controls.roll}°</div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant={controls.rcs ? 'gradient' : 'secondary'}
                        onClick={() => setControls(prev => ({ ...prev, rcs: !prev.rcs }))}
                        disabled={!missionActive}
                      >
                        RCS {controls.rcs ? 'ON' : 'OFF'}
                      </Button>
                      <Button
                        variant={controls.sas ? 'gradient' : 'secondary'}
                        onClick={() => setControls(prev => ({ ...prev, sas: !prev.sas }))}
                        disabled={!missionActive}
                      >
                        SAS {controls.sas ? 'ON' : 'OFF'}
                      </Button>
                      <Button
                        variant={controls.landing_gear ? 'gradient' : 'secondary'}
                        onClick={() => setControls(prev => ({ ...prev, landing_gear: !prev.landing_gear }))}
                        disabled={!missionActive}
                      >
                        Landing Gear {controls.landing_gear ? 'DOWN' : 'UP'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Panel */}
              <div className="space-y-6">
                {/* Mission Objectives */}
                <Card variant="glass" className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Mission Objectives</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedMission.objectives).map(([key, objective]) => (
                      <div key={key} className="flex items-center space-x-3">
                        {missionState.missionObjectives[key] ? 
                          <CheckCircle className="w-5 h-5 text-green-400" /> :
                          <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
                        }
                        <span className={missionState.missionObjectives[key] ? 'text-white' : 'text-gray-400'}>
                          {objective}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Alerts and Communications */}
                <Card variant="glass" className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Mission Control</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {alerts.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No alerts</p>
                    ) : (
                      alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-lg border-l-4 ${
                            alert.type === 'critical' ? 'bg-red-500/20 border-red-500' :
                            alert.type === 'warning' ? 'bg-yellow-500/20 border-yellow-500' :
                            alert.type === 'success' ? 'bg-green-500/20 border-green-500' :
                            'bg-blue-500/20 border-blue-500'
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            {alert.type === 'critical' || alert.type === 'warning' ? 
                              <AlertTriangle className="w-4 h-4 mr-2" /> :
                              alert.type === 'success' ? 
                              <CheckCircle className="w-4 h-4 mr-2" /> :
                              <Radio className="w-4 h-4 mr-2" />
                            }
                            <span className="text-xs text-gray-400">
                              T+{Math.floor((Date.now() - alert.timestamp) / 1000)}s ago
                            </span>
                          </div>
                          <p className="text-white text-sm">{alert.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card variant="glass" className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary" size="sm" disabled={!missionActive}>
                      <Zap className="w-4 h-4 mr-1" />
                      Emergency Stop
                    </Button>
                    <Button variant="secondary" size="sm" disabled={!missionActive}>
                      <Shield className="w-4 h-4 mr-1" />
                      Deploy Shield
                    </Button>
                    <Button variant="secondary" size="sm" disabled={!missionActive}>
                      <Battery className="w-4 h-4 mr-1" />
                      Backup Power
                    </Button>
                    <Button variant="secondary" size="sm" disabled={!missionActive}>
                      <Wifi className="w-4 h-4 mr-1" />
                      Comm Check
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}