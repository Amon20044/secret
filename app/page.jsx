'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from '../components/LandingPage';
import Dashboard from '../components/Dashboard';
import SceneViewer from '../components/SceneViewer';
import { useAppStore } from '../store/useAppStore';

export default function Home() {
  const { currentView, isAuthenticated } = useAppStore();

  useEffect(() => {
    // Initialize app - check auth status, load preferences
    console.log('Three21.go: AI-Powered 3D Engineering Explorer initialized');
  }, []);

  const renderView = () => {
    if (!isAuthenticated) {
      return <LandingPage />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'scene':
        return <SceneViewer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-deep-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}