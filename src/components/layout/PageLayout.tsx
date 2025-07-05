'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-cosmic">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display-2 text-cosmic-cream mb-4">{title}</h1>
          {description && (
            <p className="font-body-lg text-cosmic-grey-300 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}