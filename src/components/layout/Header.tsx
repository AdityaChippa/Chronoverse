'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket, Calendar, Telescope, Globe, Moon, BookOpen, GraduationCap, Sparkles, Newspaper, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceControl } from '@/components/features/VoiceControl';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Timeline', href: '/events', icon: Calendar },
    { name: 'Missions', href: '/missions', icon: Rocket },
    { name: 'Gallery', href: '/gallery', icon: Telescope },
    { name: 'Satellites', href: '/orbit', icon: Globe },
    { name: 'Lunar', href: '/lunar', icon: Moon },
    { name: 'News', href: '/news', icon: Newspaper },
    { name: 'Journals', href: '/journals', icon: BookOpen },
    { name: 'Training', href: '/training', icon: GraduationCap },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-overlay transition-cosmic ${
      isScrolled ? 'cosmic-glass cosmic-border' : ''
    }`}>
      <nav className="container-cosmic">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Sparkles className="h-8 w-8 text-cosmic-cream" />
            </motion.div>
            <span className="font-serif text-2xl text-cosmic-cream">ChronoVerse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-cosmic-grey-300 hover:text-cosmic-cream transition-cosmic font-body"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <VoiceControl />
            
            <Link href="/classroom">
              <Button variant="ghost" size="icon" className="text-cosmic-grey-300 hover:text-cosmic-cream">
                <Users className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-cosmic-grey-300 hover:text-cosmic-cream"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden cosmic-glass border-t cosmic-border"
          >
            <div className="container-cosmic py-6">
              <div className="grid grid-cols-2 gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-cosmic-grey-900 transition-cosmic"
                  >
                    <item.icon className="h-5 w-5 text-cosmic-grey-400" />
                    <span className="text-cosmic-grey-200 font-body">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}