'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Brain, Zap, Globe, Clock, Atom, ChevronRight, Sparkles } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/card';

interface Mystery {
  id: string;
  title: string;
  description: string;
  category: 'cosmic' | 'physics' | 'life' | 'technology';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: React.ComponentType<any>;
  details: string;
  facts: string[];
  theories: string[];
}

const mysteries: Mystery[] = [
  {
    id: 'dark-matter',
    title: 'Dark Matter',
    description: 'An invisible substance that makes up 85% of all matter in the universe',
    category: 'cosmic',
    difficulty: 'intermediate',
    icon: Eye,
    details: 'Dark matter is one of the greatest unsolved mysteries in cosmology. We can detect its gravitational effects on visible matter, but we cannot see it directly with any telescope or instrument.',
    facts: [
      'Makes up about 27% of the total universe',
      'Five times more abundant than ordinary matter',
      'Only interacts gravitationally with normal matter',
      'May be composed of unknown particles'
    ],
    theories: [
      'WIMPs (Weakly Interacting Massive Particles)',
      'Axions - hypothetical particles',
      'Sterile neutrinos',
      'Modified gravity theories'
    ]
  },
  {
    id: 'black-holes',
    title: 'Black Hole Information Paradox',
    description: 'What happens to information that falls into a black hole?',
    category: 'physics',
    difficulty: 'advanced',
    icon: Globe,
    details: 'Stephen Hawking\'s discovery that black holes emit radiation created a paradox: if black holes evaporate completely, what happens to the information that fell into them?',
    facts: [
      'Black holes emit Hawking radiation',
      'Information cannot be destroyed according to quantum mechanics',
      'Creates conflict between general relativity and quantum theory',
      'No consensus solution exists yet'
    ],
    theories: [
      'Information is encoded in Hawking radiation',
      'Black hole complementarity',
      'Holographic principle',
      'Information remains in black hole remnants'
    ]
  },
  {
    id: 'fermi-paradox',
    title: 'The Fermi Paradox',
    description: 'If the universe is so vast, where is everybody?',
    category: 'life',
    difficulty: 'beginner',
    icon: Brain,
    details: 'Given the billions of stars and potentially habitable planets, why haven\'t we encountered any signs of extraterrestrial civilizations?',
    facts: [
      'Our galaxy contains 100-400 billion stars',
      'Many stars have potentially habitable planets',
      'The universe is 13.8 billion years old',
      'No confirmed evidence of alien civilizations'
    ],
    theories: [
      'Great Filter - civilizations don\'t survive long',
      'We are among the first intelligent species',
      'Aliens are deliberately avoiding contact',
      'Life is much rarer than we think'
    ]
  },
  {
    id: 'fast-radio-bursts',
    title: 'Fast Radio Bursts',
    description: 'Mysterious radio signals from deep space that last milliseconds',
    category: 'cosmic',
    difficulty: 'intermediate',
    icon: Zap,
    details: 'These incredibly energetic radio pulses release as much energy in milliseconds as the Sun does in several days. Their origin remains unknown.',
    facts: [
      'Last only a few milliseconds',
      'Release enormous amounts of energy',
      'Come from billions of light-years away',
      'Only recently discovered in 2007'
    ],
    theories: [
      'Neutron star magnetospheric activity',
      'Colliding neutron stars',
      'Alien technology (least likely)',
      'Unknown cosmic phenomena'
    ]
  },
  {
    id: 'consciousness',
    title: 'Consciousness in the Universe',
    description: 'How does consciousness arise from matter, and could it exist elsewhere?',
    category: 'life',
    difficulty: 'advanced',
    icon: Brain,
    details: 'The hard problem of consciousness - how subjective experience emerges from physical processes - remains unsolved. Could consciousness be a fundamental feature of the universe?',
    facts: [
      'No scientific explanation for subjective experience',
      'Consciousness may not be unique to biological systems',
      'Could emerge from complex information processing',
      'May be related to quantum processes'
    ],
    theories: [
      'Integrated Information Theory',
      'Panpsychism - consciousness is fundamental',
      'Emergent property of complex systems',
      'Quantum consciousness theories'
    ]
  },
  {
    id: 'time-nature',
    title: 'The Nature of Time',
    description: 'Is time fundamental or emergent? Can it be manipulated?',
    category: 'physics',
    difficulty: 'advanced',
    icon: Clock,
    details: 'Time seems to flow for us, but physics suggests it might be an illusion. Einstein showed time is relative, but many questions remain about its fundamental nature.',
    facts: [
      'Time dilation occurs at high speeds and in gravity',
      'Past, present, and future may exist simultaneously',
      'Time travel to the future is theoretically possible',
      'The arrow of time may be linked to entropy'
    ],
    theories: [
      'Block universe theory - all times exist',
      'Time is emergent from quantum processes',
      'Time is fundamental like space',
      'Loop quantum gravity and discrete time'
    ]
  }
];

const categoryColors = {
  cosmic: 'from-purple-500 to-pink-500',
  physics: 'from-blue-500 to-cyan-500',
  life: 'from-green-500 to-emerald-500',
  technology: 'from-orange-500 to-red-500'
};

const categoryIcons = {
  cosmic: Globe,
  physics: Atom,
  life: Brain,
  technology: Sparkles
};

export default function MysteriesPage() {
  const [selectedMystery, setSelectedMystery] = useState<Mystery | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredMysteries = selectedCategory === 'all' 
    ? mysteries 
    : mysteries.filter(m => m.category === selectedCategory);

  return (
    <PageLayout
      title="Space Mysteries"
      description="Explore the greatest unsolved mysteries of the universe, from dark matter to the nature of consciousness itself."
    >
      <div className="min-h-screen py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {['all', 'cosmic', 'physics', 'life', 'technology'].map((category) => {
            const Icon = category === 'all' ? Sparkles : categoryIcons[category as keyof typeof categoryIcons];
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="capitalize">{category}</span>
              </button>
            );
          })}
        </div>

        {/* Mysteries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredMysteries.map((mystery, index) => {
            const Icon = mystery.icon;
            return (
              <motion.div
                key={mystery.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMystery(mystery)}
                className="cursor-pointer"
              >
                <Card className="h-full hover:scale-105 transition-transform">
                  <div className={`p-4 bg-gradient-to-br ${categoryColors[mystery.category]} rounded-full inline-flex mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white">{mystery.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      mystery.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      mystery.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {mystery.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 mb-4">{mystery.description}</p>
                  
                  <div className="flex items-center text-cosmic-cyan hover:text-white transition-colors">
                    <span className="text-sm font-medium">Explore Mystery</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Mystery Detail Modal */}
        {selectedMystery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMystery(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="cosmic-glass cosmic-border rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 bg-gradient-to-br ${categoryColors[selectedMystery.category]} rounded-full`}>
                    <selectedMystery.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedMystery.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedMystery.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      selectedMystery.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedMystery.difficulty}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMystery(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {selectedMystery.details}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-cosmic-pink" />
                    Key Facts
                  </h3>
                  <ul className="space-y-3">
                    {selectedMystery.facts.map((fact, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-cosmic-pink rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-cosmic-blue" />
                    Current Theories
                  </h3>
                  <ul className="space-y-3">
                    {selectedMystery.theories.map((theory, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-cosmic-blue rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300">{theory}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-cosmic-purple/20 to-cosmic-pink/20 rounded-xl border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">Why This Matters</h4>
                <p className="text-gray-300">
                  Understanding {selectedMystery.title.toLowerCase()} could revolutionize our understanding of 
                  the universe and our place within it. These mysteries drive scientific progress and inspire 
                  new technologies that benefit humanity.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}