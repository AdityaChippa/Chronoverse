'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Calendar, Star, Share2, Lock, Globe as GlobeIcon, Edit, Trash2 } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, Button } from '@/components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  eventId?: string;
  imageUrl?: string;
  tags: string[];
}

interface Journal {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  createdAt: Date;
  entries: JournalEntry[];
  coverImage?: string;
}

export default function JournalsPage() {
  const [journals, setJournals] = useState<Journal[]>([
    {
      id: '1',
      title: 'My Space Exploration Journey',
      description: 'Documenting my fascination with space and astronomical events',
      isPublic: true,
      createdAt: new Date('2024-01-01'),
      entries: [
        {
          id: 'e1',
          title: 'Witnessed the Aurora Borealis',
          content: 'Tonight was magical. The northern lights danced across the sky in waves of green and purple...',
          date: new Date('2024-03-15'),
          tags: ['aurora', 'photography', 'nature']
        },
        {
          id: 'e2',
          title: 'Total Solar Eclipse Experience',
          content: 'Traveled to the path of totality to witness this incredible astronomical event...',
          date: new Date('2024-04-08'),
          tags: ['eclipse', 'solar', 'travel']
        }
      ]
    }
  ]);

  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [newJournal, setNewJournal] = useState({
    title: '',
    description: '',
    isPublic: false
  });

  const createJournal = () => {
    const journal: Journal = {
      id: Date.now().toString(),
      title: newJournal.title,
      description: newJournal.description,
      isPublic: newJournal.isPublic,
      createdAt: new Date(),
      entries: []
    };
    setJournals([...journals, journal]);
    setIsCreateModalOpen(false);
    setNewJournal({ title: '', description: '', isPublic: false });
  };

  const deleteJournal = (id: string) => {
    setJournals(journals.filter(j => j.id !== id));
  };

  return (
    <PageLayout
      title="Cosmic Journals"
      description="Create personal space exploration diaries and document your astronomical journey"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="glass" className="text-center">
          <BookOpen className="h-8 w-8 text-cosmic-purple mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-cosmic-cream">{journals.length}</h3>
          <p className="text-cosmic-grey-400">Total Journals</p>
        </Card>
        
        <Card variant="glass" className="text-center">
          <Calendar className="h-8 w-8 text-cosmic-pink mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-cosmic-cream">
            {journals.reduce((acc, j) => acc + j.entries.length, 0)}
          </h3>
          <p className="text-cosmic-grey-400">Total Entries</p>
        </Card>
        
        <Card variant="glass" className="text-center">
          <GlobeIcon className="h-8 w-8 text-cosmic-blue mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-cosmic-cream">
            {journals.filter(j => j.isPublic).length}
          </h3>
          <p className="text-cosmic-grey-400">Public Journals</p>
        </Card>
        
        <Card variant="glass" className="text-center">
          <Star className="h-8 w-8 text-cosmic-cyan mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-cosmic-cream">12</h3>
          <p className="text-cosmic-grey-400">Achievements</p>
        </Card>
      </div>

      {/* Create New Journal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card variant="gradient" className="text-center p-8">
          <Plus className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Start Your Cosmic Journey</h2>
          <p className="text-cosmic-grey-300 mb-6 max-w-2xl mx-auto">
            Create a journal to document your space observations, thoughts, and discoveries
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)} variant="gradient" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create New Journal
          </Button>
        </Card>
      </motion.div>

      {/* Journals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {journals.map((journal, index) => (
          <motion.div
            key={journal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="glass" className="h-full cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedJournal(journal)}>
              {/* Cover Image */}
              <div className="h-32 -m-6 mb-4 bg-gradient-to-br from-cosmic-purple/20 to-cosmic-pink/20 rounded-t-xl flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white/30" />
              </div>

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-cosmic-cream mb-2">{journal.title}</h3>
                  <p className="text-cosmic-grey-400 text-sm">{journal.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {journal.isPublic ? (
                    <GlobeIcon className="h-4 w-4 text-cosmic-blue" />
                  ) : (
                    <Lock className="h-4 w-4 text-cosmic-grey-500" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-cosmic-grey-500">
                <span>{journal.entries.length} entries</span>
                <span>{journal.createdAt.toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  // Edit functionality
                }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  deleteJournal(journal.id);
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  // Share functionality
                }}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Journal Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Journal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Journal Title</Label>
              <Input
                id="title"
                value={newJournal.title}
                onChange={(e) => setNewJournal({ ...newJournal, title: e.target.value })}
                placeholder="My Space Exploration Journey"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={newJournal.description}
                onChange={(e) => setNewJournal({ ...newJournal, description: e.target.value })}
                placeholder="Document your cosmic discoveries..."
                className="w-full px-3 py-2 bg-cosmic-grey-900/50 border border-cosmic-grey-700 rounded-md text-cosmic-grey-100 placeholder:text-cosmic-grey-500 focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="public"
                checked={newJournal.isPublic}
                onChange={(e) => setNewJournal({ ...newJournal, isPublic: e.target.checked })}
                className="rounded border-cosmic-grey-700"
              />
              <Label htmlFor="public">Make this journal public</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={createJournal}>
              Create Journal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Journal Detail Modal */}
      {selectedJournal && (
        <Dialog open={!!selectedJournal} onOpenChange={() => setSelectedJournal(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedJournal.title}</DialogTitle>
              <p className="text-cosmic-grey-400">{selectedJournal.description}</p>
            </DialogHeader>
            
            <div className="py-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-cosmic-cream">Journal Entries</h3>
                <Button variant="gradient" size="sm" onClick={() => setIsEntryModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Entry
                </Button>
              </div>

              {selectedJournal.entries.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-cosmic-grey-600 mx-auto mb-4" />
                  <p className="text-cosmic-grey-400">No entries yet. Start documenting your journey!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedJournal.entries.map((entry) => (
                    <Card key={entry.id} variant="glass">
                      <h4 className="text-lg font-semibold text-cosmic-cream mb-2">{entry.title}</h4>
                      <p className="text-cosmic-grey-400 mb-3">{entry.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {entry.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-cosmic-grey-800 rounded-full text-xs text-cosmic-grey-300">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-cosmic-grey-500">
                          {entry.date.toLocaleDateString()}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PageLayout>
  );
}