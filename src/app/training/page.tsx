'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, Users, Brain, Wrench, Globe, Heart, 
  CheckCircle, Clock, Star, Trophy, Target,
  Play, Pause, RotateCcw, Award, BookOpen,
  Zap, Shield, Activity, Compass
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, Button } from '@/components/ui';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'physical' | 'technical' | 'psychological' | 'survival' | 'science' | 'emergency';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon: React.ComponentType<any>;
  completed: boolean;
  progress: number;
  objectives: string[];
  skills: string[];
  prerequisites?: string[];
  certification?: string;
  practicalExercises: string[];
  theoryTopics: string[];
}

interface UserProgress {
  totalModules: number;
  completedModules: number;
  totalTime: number; // in minutes
  currentStreak: number;
  achievements: Achievement[];
  certifications: string[];
  skillLevels: Record<string, number>;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  unlockedAt?: Date;
}

const trainingModules: TrainingModule[] = [
  {
    id: 'basic-physics',
    title: 'Space Physics Fundamentals',
    description: 'Master the physics principles that govern space travel, orbital mechanics, and celestial navigation.',
    category: 'science',
    duration: 45,
    difficulty: 'beginner',
    icon: Brain,
    completed: false,
    progress: 0,
    objectives: [
      'Understand Newton\'s laws in space environment',
      'Calculate orbital velocities and periods',
      'Master Kepler\'s laws of planetary motion',
      'Comprehend escape velocity and gravitational assists'
    ],
    skills: ['Physics', 'Mathematics', 'Problem Solving', 'Critical Thinking'],
    theoryTopics: [
      'Microgravity effects on objects',
      'Conservation of momentum in space',
      'Orbital mechanics equations',
      'Gravitational field calculations'
    ],
    practicalExercises: [
      'Calculate ISS orbital period',
      'Design a Hohmann transfer orbit',
      'Simulate gravitational slingshot',
      'Plot spacecraft trajectory'
    ]
  },
  {
    id: 'spacecraft-systems',
    title: 'Spacecraft Systems Engineering',
    description: 'Deep dive into spacecraft subsystems including life support, propulsion, power, and communications.',
    category: 'technical',
    duration: 90,
    difficulty: 'intermediate',
    icon: Wrench,
    completed: false,
    progress: 0,
    prerequisites: ['basic-physics'],
    objectives: [
      'Operate Environmental Control and Life Support Systems (ECLSS)',
      'Manage spacecraft power distribution',
      'Troubleshoot communication systems',
      'Handle propulsion system operations'
    ],
    skills: ['Engineering', 'Systems Management', 'Troubleshooting', 'Technical Analysis'],
    theoryTopics: [
      'ECLSS components and operation',
      'Solar panel efficiency in space',
      'Reaction control systems',
      'Deep space communication protocols'
    ],
    practicalExercises: [
      'Configure life support parameters',
      'Diagnose power system failures',
      'Align communication antennas',
      'Calculate fuel consumption rates'
    ],
    certification: 'Spacecraft Systems Operator Level 1'
  },
  {
    id: 'eva-advanced',
    title: 'Advanced EVA Operations',
    description: 'Comprehensive training for extravehicular activities including spacesuit operations and emergency procedures.',
    category: 'physical',
    duration: 120,
    difficulty: 'advanced',
    icon: Rocket,
    completed: false,
    progress: 0,
    prerequisites: ['spacecraft-systems', 'emergency-procedures'],
    objectives: [
      'Master EMU (Extravehicular Mobility Unit) operations',
      'Perform complex repairs in vacuum',
      'Execute emergency EVA procedures',
      'Coordinate multi-person EVA operations'
    ],
    skills: ['Dexterity', 'Spatial Awareness', 'Emergency Response', 'Team Coordination'],
    theoryTopics: [
      'Spacesuit architecture and systems',
      'Decompression sickness prevention',
      'Thermal management in space',
      'EVA tool usage and techniques'
    ],
    practicalExercises: [
      'Pre-breathe protocol simulation',
      'Airlock operations practice',
      'Tethering and mobility exercises',
      'Emergency suit repair drills'
    ],
    certification: 'EVA Specialist Certification'
  },
  {
    id: 'emergency-procedures',
    title: 'Emergency Response Training',
    description: 'Critical training for handling spacecraft emergencies including fire, depressurization, and system failures.',
    category: 'emergency',
    duration: 60,
    difficulty: 'intermediate',
    icon: Shield,
    completed: false,
    progress: 0,
    objectives: [
      'Respond to fire in microgravity',
      'Handle rapid depressurization',
      'Execute emergency evacuation procedures',
      'Perform medical emergencies response'
    ],
    skills: ['Crisis Management', 'Quick Decision Making', 'First Aid', 'Leadership'],
    theoryTopics: [
      'Fire behavior in microgravity',
      'Depressurization effects and timeline',
      'Emergency communication protocols',
      'Crew resource management'
    ],
    practicalExercises: [
      'Fire suppression drill',
      'Pressure suit donning speed test',
      'Medical emergency simulation',
      'Evacuation timeline practice'
    ]
  },
  {
    id: 'mission-planning',
    title: 'Mission Planning & Navigation',
    description: 'Learn to plan complex space missions, calculate trajectories, and navigate using celestial references.',
    category: 'technical',
    duration: 75,
    difficulty: 'advanced',
    icon: Compass,
    completed: false,
    progress: 0,
    prerequisites: ['basic-physics', 'spacecraft-systems'],
    objectives: [
      'Design mission trajectories',
      'Calculate launch windows',
      'Plan resource allocation',
      'Navigate using star trackers'
    ],
    skills: ['Strategic Planning', 'Navigation', 'Resource Management', 'Mathematics'],
    theoryTopics: [
      'Interplanetary trajectory design',
      'Launch window calculations',
      'Delta-V budgeting',
      'Celestial navigation techniques'
    ],
    practicalExercises: [
      'Plan Mars mission trajectory',
      'Calculate optimal launch date',
      'Design station-keeping maneuvers',
      'Star identification exercise'
    ]
  },
  {
    id: 'psychological-resilience',
    title: 'Psychological Resilience Training',
    description: 'Develop mental fortitude for long-duration missions, isolation, and high-stress situations.',
    category: 'psychological',
    duration: 60,
    difficulty: 'expert',
    icon: Heart,
    completed: false,
    progress: 0,
    objectives: [
      'Manage isolation and confinement',
      'Develop stress coping mechanisms',
      'Maintain team cohesion',
      'Handle mission-critical pressure'
    ],
    skills: ['Mental Resilience', 'Emotional Intelligence', 'Communication', 'Mindfulness'],
    theoryTopics: [
      'Psychology of isolation',
      'Stress management techniques',
      'Team dynamics in confined spaces',
      'Cognitive performance under stress'
    ],
    practicalExercises: [
      'Isolation chamber sessions',
      'Conflict resolution scenarios',
      'Mindfulness meditation practice',
      'High-pressure decision exercises'
    ]
  },
  {
    id: 'robotics-operation',
    title: 'Space Robotics & Automation',
    description: 'Master the operation of robotic systems including the Canadarm and autonomous rovers.',
    category: 'technical',
    duration: 80,
    difficulty: 'intermediate',
    icon: Zap,
    completed: false,
    progress: 0,
    prerequisites: ['spacecraft-systems'],
    objectives: [
      'Operate robotic manipulator arms',
      'Program autonomous sequences',
      'Perform remote robotic repairs',
      'Coordinate human-robot operations'
    ],
    skills: ['Robotics', 'Programming', 'Remote Operation', 'Precision Control'],
    theoryTopics: [
      'Robotic arm kinematics',
      'Teleoperation principles',
      'Computer vision in space',
      'Autonomous navigation algorithms'
    ],
    practicalExercises: [
      'Canadarm operation simulation',
      'Robotic grappling practice',
      'Rover navigation course',
      'Automated docking sequence'
    ]
  },
  {
    id: 'medical-training',
    title: 'Space Medicine & First Aid',
    description: 'Comprehensive medical training for treating injuries and illnesses in the space environment.',
    category: 'emergency',
    duration: 90,
    difficulty: 'advanced',
    icon: Activity,
    completed: false,
    progress: 0,
    objectives: [
      'Perform medical procedures in microgravity',
      'Diagnose common space-related conditions',
      'Administer medications in space',
      'Use medical equipment in zero-g'
    ],
    skills: ['Medical Knowledge', 'Emergency Medicine', 'Diagnostic Skills', 'Patient Care'],
    theoryTopics: [
      'Physiological changes in space',
      'Space adaptation syndrome',
      'Bone and muscle degradation',
      'Radiation exposure effects'
    ],
    practicalExercises: [
      'IV insertion in microgravity',
      'CPR in zero-g simulation',
      'Wound care procedures',
      'Medical equipment operation'
    ],
    certification: 'Space Medical Officer Basic'
  }
];

const achievements: Achievement[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first training module',
    icon: Trophy
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Complete 5 training modules',
    icon: BookOpen
  },
  {
    id: 'space-expert',
    name: 'Space Expert',
    description: 'Complete all beginner modules',
    icon: Brain
  },
  {
    id: 'mission-ready',
    name: 'Mission Ready',
    description: 'Earn 3 certifications',
    icon: Award
  },
  {
    id: 'master-astronaut',
    name: 'Master Astronaut',
    description: 'Complete all training modules',
    icon: Rocket
  }
];

const categoryColors = {
  physical: 'from-red-500 to-pink-500',
  technical: 'from-blue-500 to-cyan-500',
  psychological: 'from-purple-500 to-indigo-500',
  survival: 'from-green-500 to-emerald-500',
  science: 'from-yellow-500 to-orange-500',
  emergency: 'from-red-600 to-red-800'
};

export default function TrainingPage() {
  const [modules, setModules] = useState<TrainingModule[]>(trainingModules);
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [progress, setProgress] = useState<UserProgress>({
    totalModules: trainingModules.length,
    completedModules: 0,
    totalTime: 0,
    currentStreak: 0,
    achievements: [],
    certifications: [],
    skillLevels: {}
  });
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simulationActive && activeModule) {
      interval = setInterval(() => {
        setSimulationTime(prev => {
          const newTime = prev + 1;
          // Update module progress
          const progressPercent = Math.min((newTime / (activeModule.duration * 60)) * 100, 100);
          setModules(prevModules =>
            prevModules.map(m =>
              m.id === activeModule.id ? { ...m, progress: progressPercent } : m
            )
          );
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simulationActive, activeModule]);

  const startModule = (module: TrainingModule) => {
    // Check prerequisites
    if (module.prerequisites) {
      const unmetPrereqs = module.prerequisites.filter(
        prereq => !modules.find(m => m.id === prereq)?.completed
      );
      if (unmetPrereqs.length > 0) {
        alert('Complete prerequisite modules first!');
        return;
      }
    }
    setActiveModule(module);
    setSimulationTime(0);
    setSimulationActive(true);
  };

  const completeModule = () => {
    if (activeModule) {
      const updatedModules = modules.map(m =>
        m.id === activeModule.id ? { ...m, completed: true, progress: 100 } : m
      );
      setModules(updatedModules);
      
      // Update progress
      const completedCount = updatedModules.filter(m => m.completed).length;
      const totalTime = progress.totalTime + activeModule.duration;
      const newCertifications = activeModule.certification 
        ? [...progress.certifications, activeModule.certification]
        : progress.certifications;

      // Check achievements
      const newAchievements = [...progress.achievements];
      if (completedCount === 1 && !progress.achievements.find(a => a.id === 'first-steps')) {
        const achievement = achievements.find(a => a.id === 'first-steps')!;
        newAchievements.push({ ...achievement, unlockedAt: new Date() });
      }
      if (completedCount === 5 && !progress.achievements.find(a => a.id === 'dedicated-learner')) {
        const achievement = achievements.find(a => a.id === 'dedicated-learner')!;
        newAchievements.push({ ...achievement, unlockedAt: new Date() });
      }

      setProgress({
        ...progress,
        completedModules: completedCount,
        totalTime,
        certifications: newCertifications,
        achievements: newAchievements
      });

      setSimulationActive(false);
      setActiveModule(null);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredModules = selectedCategory === 'all'
    ? modules
    : modules.filter(m => m.category === selectedCategory);

  const categories = ['all', 'physical', 'technical', 'psychological', 'survival', 'science', 'emergency'];

  return (
    <PageLayout
      title="Astronaut Training"
      description="Master the skills needed for space exploration through comprehensive training modules and simulations"
    >
      <div className="min-h-screen py-8">
        {/* Progress Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="glass" className="text-center p-6">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{progress.completedModules}/{progress.totalModules}</h3>
            <p className="text-gray-400">Modules Completed</p>
          </Card>
          
          <Card variant="glass" className="text-center p-6">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{progress.totalTime}</h3>
            <p className="text-gray-400">Training Minutes</p>
          </Card>
          
          <Card variant="glass" className="text-center p-6">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{progress.certifications.length}</h3>
            <p className="text-gray-400">Certifications</p>
          </Card>
          
          <Card variant="glass" className="text-center p-6">
            <Star className="w-8 h-8 text-cosmic-pink mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{progress.achievements.length}</h3>
            <p className="text-gray-400">Achievements</p>
          </Card>
        </div>

        {/* Active Module Simulation */}
        {activeModule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card variant="gradient" className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{activeModule.title}</h2>
                  <p className="text-gray-300">{activeModule.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{formatTime(simulationTime)}</div>
                  <div className="text-gray-400">Training Time</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{activeModule.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-cosmic-grey-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-cosmic-purple to-cosmic-pink h-3 rounded-full transition-all duration-300"
                    style={{ width: `${activeModule.progress}%` }}
                  />
                </div>
              </div>

              {/* Simulation Controls */}
              <div className="flex items-center space-x-4 mb-8">
                <Button
                  onClick={() => setSimulationActive(!simulationActive)}
                  variant="secondary"
                  className="flex items-center space-x-2"
                >
                  {simulationActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{simulationActive ? 'Pause' : 'Resume'}</span>
                </Button>
                
                <Button
                  onClick={() => {
                    setSimulationTime(0);
                    setModules(prevModules =>
                      prevModules.map(m =>
                        m.id === activeModule.id ? { ...m, progress: 0 } : m
                      )
                    );
                  }}
                  variant="secondary"
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </Button>
                
                <Button
                  onClick={completeModule}
                  variant="gradient"
                  className="flex items-center space-x-2"
                  disabled={activeModule.progress < 100}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Module</span>
                </Button>
              </div>

              {/* Module Content Tabs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Learning Objectives */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-cosmic-pink" />
                    Learning Objectives
                  </h4>
                  <ul className="space-y-2">
                    {activeModule.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className={`w-5 h-5 mt-0.5 ${
                          activeModule.progress > (index + 1) * (100 / activeModule.objectives.length)
                            ? 'text-green-500'
                            : 'text-gray-600'
                        }`} />
                        <span className="text-gray-300 text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Theory Topics */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-cosmic-blue" />
                    Theory Topics
                  </h4>
                  <ul className="space-y-2">
                    {activeModule.theoryTopics.map((topic, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-cosmic-blue rounded-full"></div>
                        <span className="text-gray-300 text-sm">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practical Exercises */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-cosmic-purple" />
                    Practical Exercises
                  </h4>
                  <ul className="space-y-2">
                    {activeModule.practicalExercises.map((exercise, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-cosmic-purple rounded-full"></div>
                        <span className="text-gray-300 text-sm">{exercise}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skills Developed */}
              <div className="mt-6 pt-6 border-t border-cosmic-grey-700">
                <h4 className="text-lg font-semibold text-white mb-4">Skills Developed</h4>
                <div className="flex flex-wrap gap-2">
                  {activeModule.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'gradient' : 'ghost'}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Training Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module, index) => {
            const Icon = module.icon;
            const isLocked = module.prerequisites?.some(
              prereq => !modules.find(m => m.id === prereq)?.completed
            );

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className={`h-full ${isLocked ? 'opacity-60' : ''}`}>
                  <div className="relative">
                    {module.completed && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                    
                    <div className={`p-4 bg-gradient-to-br ${categoryColors[module.category]} rounded-full inline-flex mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">{module.title}</h3>
                    <p className="text-gray-400 mb-4">{module.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        module.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        module.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        module.difficulty === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {module.difficulty}
                      </span>
                      <span className="text-gray-400 text-sm">{module.duration} min</span>
                    </div>

                    {/* Progress Bar */}
                    {module.progress > 0 && (
                      <div className="mb-4">
                        <div className="w-full bg-cosmic-grey-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cosmic-purple to-cosmic-pink h-2 rounded-full transition-all"
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Prerequisites */}
                    {module.prerequisites && (
                      <div className="mb-4 p-3 bg-cosmic-grey-800/50 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Prerequisites:</p>
                        <div className="flex flex-wrap gap-1">
                          {module.prerequisites.map(prereq => {
                            const prereqModule = modules.find(m => m.id === prereq);
                            return (
                              <span
                                key={prereq}
                                className={`text-xs px-2 py-1 rounded ${
                                  prereqModule?.completed
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}
                              >
                                {prereqModule?.title}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Certification Badge */}
                    {module.certification && (
                      <div className="mb-4 flex items-center gap-2 text-cosmic-cyan">
                        <Award className="w-4 h-4" />
                        <span className="text-sm">{module.certification}</span>
                      </div>
                    )}
                    
                    <Button
                      onClick={() => startModule(module)}
                      variant={module.completed ? "secondary" : "gradient"}
                      className="w-full"
                      disabled={activeModule !== null || isLocked}
                    >
                      {isLocked ? 'Locked' : module.completed ? 'Review Module' : 'Start Training'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Achievements Section */}
        {progress.achievements.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-white mb-6">Your Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {progress.achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card variant="gradient" className="text-center p-6">
                      <Icon className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-white mb-1">{achievement.name}</h3>
                      <p className="text-sm text-gray-300">{achievement.description}</p>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Certifications */}
        {progress.certifications.length > 0 && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-white mb-6">Certifications Earned</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progress.certifications.map((cert, index) => (
                <motion.div
                  key={cert}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="glass" className="flex items-center gap-4 p-4">
                    <Award className="w-10 h-10 text-cosmic-cyan" />
                    <div>
                      <h4 className="text-white font-semibold">{cert}</h4>
                      <p className="text-sm text-gray-400">Certified Astronaut Training</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}