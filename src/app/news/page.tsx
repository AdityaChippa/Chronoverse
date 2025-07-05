'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, TrendingUp, Filter, Search, Newspaper } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, Button, LoadingSpinner } from '@/components/ui';
import { searchNASAImages } from '@/services/nasa';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
}

// Mock news data since we need a real news API
const mockNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'James Webb Space Telescope Discovers Most Distant Galaxy',
    summary: 'Astronomers using the James Webb Space Telescope have identified what appears to be the most distant galaxy ever observed, existing just 300 million years after the Big Bang.',
    url: '#',
    imageUrl: 'https://via.placeholder.com/400x200/1a1a2e/ffffff?text=JWST+Discovery',
    publishedAt: new Date().toISOString(),
    source: 'NASA'
  },
  {
    id: '2',
    title: 'SpaceX Successfully Launches Starship Test Flight',
    summary: 'SpaceX\'s Starship completed its latest test flight, achieving new milestones in the development of the next-generation spacecraft designed for Mars missions.',
    url: '#',
    imageUrl: 'https://via.placeholder.com/400x200/1a1a2e/ffffff?text=Starship+Launch',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    source: 'SpaceX'
  },
  {
    id: '3',
    title: 'Artemis III Crew Selection Announced',
    summary: 'NASA has announced the crew members for Artemis III, the mission that will return humans to the lunar surface for the first time since 1972.',
    url: '#',
    imageUrl: 'https://via.placeholder.com/400x200/1a1a2e/ffffff?text=Artemis+III',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    source: 'NASA'
  },
  {
    id: '4',
    title: 'New Exoplanet Discovery in Habitable Zone',
    summary: 'Scientists have discovered a new exoplanet orbiting within the habitable zone of its star, raising possibilities for the existence of liquid water.',
    url: '#',
    imageUrl: 'https://via.placeholder.com/400x200/1a1a2e/ffffff?text=Exoplanet',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    source: 'ESO'
  }
];

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Use mock data for now
        setArticles(mockNewsData);
        
        // Try to fetch real NASA images as news items
        if (searchQuery) {
          const images = await searchNASAImages(searchQuery);
          const newsFromImages = images.slice(0, 4).map((item: any, index: number) => ({
            id: `nasa-${index}`,
            title: item.data[0]?.title || 'NASA Update',
            summary: item.data[0]?.description || 'Latest from NASA',
            url: item.links[0]?.href || '#',
            imageUrl: item.links[0]?.href || '',
            publishedAt: item.data[0]?.date_created || new Date().toISOString(),
            source: 'NASA'
          }));
          setArticles([...mockNewsData, ...newsFromImages]);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchNews, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const categories = [
    { id: 'all', label: 'All News', icon: Newspaper },
    { id: 'launches', label: 'Launches', query: 'rocket launch' },
    { id: 'discoveries', label: 'Discoveries', query: 'space discovery' },
    { id: 'nasa', label: 'NASA', query: 'NASA' },
    { id: 'spacex', label: 'SpaceX', query: 'SpaceX' },
    { id: 'astronomy', label: 'Astronomy', query: 'astronomy' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${Math.floor(diffHours)} hours ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.source.toLowerCase().includes(filter.toLowerCase()));

  return (
    <PageLayout 
      title="Space News" 
      description="Stay updated with the latest space exploration news and discoveries"
    >
      {/* Search and Filter Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card variant="glass" className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-grey-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search space news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-cosmic-grey-400 focus:outline-none focus:ring-2 focus:ring-cosmic-purple focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon || TrendingUp;
                return (
                  <Button
                    key={category.id}
                    variant={filter === category.id ? 'gradient' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setFilter(category.id);
                      if (category.query) {
                        setSearchQuery(category.query);
                      }
                    }}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-1" />}
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.section>

      {/* News Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" variant="orbit" />
        </div>
      ) : filteredArticles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Newspaper className="w-16 h-16 text-cosmic-grey-500 mx-auto mb-4" />
          <p className="text-xl text-cosmic-grey-400">No news articles found</p>
          <p className="text-cosmic-grey-500 mt-2">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card variant="glass" className="h-full flex flex-col">
                {/* Article Image */}
                <div className="relative h-48 -m-6 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10 rounded-t-xl"></div>
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover rounded-t-xl"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x200/1a1a2e/ffffff?text=Space+News';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cosmic-purple/20 to-cosmic-pink/20 rounded-t-xl flex items-center justify-center">
                      <Newspaper className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white">
                      {article.source}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="flex-1 flex flex-col p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-cosmic-grey-400 mb-4 line-clamp-3 flex-1">
                    {article.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-cosmic-grey-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(article.publishedAt)}
                    </div>
                    
                    <motion.a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center text-cosmic-purple hover:text-cosmic-pink transition-colors"
                    >
                      Read More
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </motion.a>
                  </div>
                </div>
              </Card>
            </motion.article>
          ))}
        </motion.div>
      )}

      {/* Newsletter CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20"
      >
        <Card variant="gradient" className="p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Never Miss a Space Update
          </h2>
          <p className="text-cosmic-grey-300 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest space news, launch updates, and astronomical discoveries delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-cosmic-grey-400 focus:outline-none focus:ring-2 focus:ring-cosmic-purple focus:border-transparent"
            />
            <Button variant="gradient">Subscribe</Button>
          </div>
        </Card>
      </motion.section>
    </PageLayout>
  );
}