'use client';

import Link from 'next/link';
import { Github, Twitter, Globe, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { name: 'Timeline', href: '/events' },
      { name: 'Missions', href: '/missions' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'Satellites', href: '/orbit' },
    ],
    learn: [
      { name: 'Training', href: '/training' },
      { name: 'Classroom', href: '/classroom' },
      { name: 'Journals', href: '/journals' },
      { name: 'About', href: '/about' },
    ],
    community: [
      { name: 'News', href: '/news' },
      { name: 'Events', href: '/events' },
      { name: 'Contact', href: '/contact' },
      { name: 'Support', href: '/support' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Globe, href: '#', label: 'Website' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="relative z-content bg-cosmic-grey-900 border-t cosmic-border">
      <div className="container-cosmic py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl text-cosmic-cream mb-4">ChronoVerse</h3>
            <p className="text-cosmic-grey-400 font-body-sm mb-6">
              Where every day births a universe of discovery. Explore space history through time.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-cosmic-grey-500 hover:text-cosmic-cream transition-cosmic"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-heading-3 text-cosmic-grey-200 mb-4">Explore</h4>
              <ul className="space-y-2">
                {footerLinks.explore.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-cosmic-grey-400 hover:text-cosmic-cream transition-cosmic font-body-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading-3 text-cosmic-grey-200 mb-4">Learn</h4>
              <ul className="space-y-2">
                {footerLinks.learn.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-cosmic-grey-400 hover:text-cosmic-cream transition-cosmic font-body-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading-3 text-cosmic-grey-200 mb-4">Community</h4>
              <ul className="space-y-2">
                {footerLinks.community.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-cosmic-grey-400 hover:text-cosmic-cream transition-cosmic font-body-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t cosmic-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-cosmic-grey-500 font-body-sm text-center md:text-left">
              © {currentYear} ChronoVerse. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-cosmic-grey-500 hover:text-cosmic-cream transition-cosmic font-body-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-cosmic-grey-500 hover:text-cosmic-cream transition-cosmic font-body-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}