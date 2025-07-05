'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { fetchActiveMissions } from '@/services/nasa';
import { Mission, MissionStatus } from '@/types';

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const data = await fetchActiveMissions();
      setMissions(data);
    } catch (error) {
      console.error('Error loading missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<MissionStatus, string> = {
    [MissionStatus.PLANNED]: 'bg-blue-500/20 text-blue-300',
    [MissionStatus.ACTIVE]: 'bg-green-500/20 text-green-300',
    [MissionStatus.COMPLETED]: 'bg-gray-500/20 text-gray-300',
    [MissionStatus.FAILED]: 'bg-red-500/20 text-red-300',
    [MissionStatus.CANCELLED]: 'bg-orange-500/20 text-orange-300',
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
          <h1 className="font-display-2 text-cosmic-cream mb-4">Space Missions</h1>
          <p className="font-body-lg text-cosmic-grey-300 max-w-3xl mx-auto">
            Track active space missions and command center for exploration
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="loading-spinner w-12 h-12" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mission List */}
            <div className="lg:col-span-2 space-y-6">
              {missions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="cursor-pointer hover:cosmic-glow transition-cosmic"
                    onClick={() => setSelectedMission(mission)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-cosmic-cream">{mission.name}</CardTitle>
                          <CardDescription className="text-cosmic-grey-400">
                            {mission.agency} • Launched {new Date(mission.launchDate).getFullYear()}
                          </CardDescription>
                        </div>
                        <Badge className={statusColors[mission.status]}>
                          {mission.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-cosmic-grey-300 mb-4">{mission.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-cosmic-grey-500">
                        <div className="flex items-center gap-2">
                          <Rocket className="h-4 w-4" />
                          {mission.spacecraft || 'Multiple'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          {mission.destination || 'Earth Orbit'}
                        </div>
                      </div>

                      {mission.achievements.length > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-cosmic-grey-400">
                              {mission.achievements.length} Achievements
                            </span>
                          </div>
                          <Progress value={(mission.achievements.length / mission.objectives.length) * 100} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Mission Details */}
            <div className="lg:col-span-1">
              {selectedMission ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="sticky top-24"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Mission Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-cosmic-cream mb-2">Objectives</h4>
                        <ul className="space-y-1">
                          {selectedMission.objectives.map((obj, i) => (
                            <li key={i} className="text-sm text-cosmic-grey-300 flex items-start gap-2">
                              <span className="text-cosmic-grey-500 mt-1">•</span>
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {selectedMission.achievements.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-cosmic-cream mb-2">Achievements</h4>
                          <ul className="space-y-1">
                            {selectedMission.achievements.map((achievement, i) => (
                              <li key={i} className="text-sm text-cosmic-grey-300 flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="pt-4 border-t cosmic-border">
                        <div className="flex items-center gap-2 text-sm text-cosmic-grey-400">
                          <Calendar className="h-4 w-4" />
                          Launch: {new Date(selectedMission.launchDate).toLocaleDateString()}
                        </div>
                        {selectedMission.endDate && (
                          <div className="flex items-center gap-2 text-sm text-cosmic-grey-400 mt-2">
                            <Calendar className="h-4 w-4" />
                            End: {new Date(selectedMission.endDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="cosmic-glass">
                  <CardContent className="py-12 text-center">
                    <Rocket className="h-12 w-12 text-cosmic-grey-600 mx-auto mb-4" />
                    <p className="text-cosmic-grey-400">
                      Select a mission to view details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}