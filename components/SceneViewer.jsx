'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Box } from '@react-three/drei';
import { 
  ArrowLeft, 
  Maximize2, 
  RotateCcw, 
  Layers, 
  MessageCircle, 
  Mic, 
  Hand, 
  Settings,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Eye,
  EyeOff
} from 'lucide-react';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import AIChat from './ai/AIChat';
import HandTracking from './tracking/HandTracking';
import VoiceControl from './voice/VoiceControl';
import { useAppStore } from '../store/useAppStore';

// Sample 3D Engine Model Component
function EngineModel({ isExploded, currentLayer }) {
  const groupRef = useRef();

  useEffect(() => {
    if (groupRef.current) {
      // Apply explosion animation based on isExploded state
      const children = groupRef.current.children;
      children.forEach((child, index) => {
        if (isExploded) {
          const direction = new THREE.Vector3(
            Math.cos((index / children.length) * Math.PI * 2),
            Math.sin((index / children.length) * Math.PI * 2),
            0
          ).normalize();
          child.position.copy(direction.multiplyScalar(2));
        } else {
          child.position.set(0, 0, 0);
        }
      });
    }
  }, [isExploded]);

  return (
    <group ref={groupRef}>
      {/* Engine Block */}
      <Box args={[4, 3, 5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#333333" />
      </Box>
      
      {/* Cylinders */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1.5;
        const z = Math.sin(angle) * 1.5;
        
        return (
          <mesh key={`cylinder-${i}`} position={[x, 1, z]}>
            <cylinderGeometry args={[0.3, 0.3, 2]} />
            <meshStandardMaterial color="#666666" />
          </mesh>
        );
      })}
      
      {/* Pistons */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1.5;
        const z = Math.sin(angle) * 1.5;
        
        return (
          <mesh key={`piston-${i}`} position={[x, 0, z]}>
            <cylinderGeometry args={[0.25, 0.25, 1]} />
            <meshStandardMaterial color="#999999" />
          </mesh>
        );
      })}
    </group>
  );
}

// Loading component
function LoadingScreen() {
  return (
    <div className="absolute inset-0 bg-deep-black flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl">Loading 3D Model...</p>
      </div>
    </div>
  );
}

const SceneViewer = () => {
  const {
    setCurrentView,
    aiChatOpen,
    setAiChatOpen,
    handTrackingEnabled,
    setHandTrackingEnabled,
    voiceEnabled,
    setVoiceEnabled,
    isListening,
    gestureData
  } = useAppStore();

  const [isLoading, setIsLoading] = useState(true);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [maxLayers, setMaxLayers] = useState(127);
  const [isExploded, setIsExploded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Handle gesture data
  useEffect(() => {
    if (gestureData) {
      // Process gesture commands
      switch (gestureData.gesture) {
        case 'peace':
          // Zoom control handled by OrbitControls
          break;
        case 'point':
          // Ray casting for selection
          handlePartSelection(gestureData.position);
          break;
        case 'palm':
          // Reset camera
          handleResetCamera();
          break;
        case 'both_hands':
          // Toggle exploded view
          handleExplodeToggle();
          break;
      }
    }
  }, [gestureData]);

  const handlePartSelection = (position) => {
    // Mock part selection
    setSelectedPart({
      name: 'Engine Block',
      layer: 0
    });
  };

  const handleResetCamera = () => {
    // Camera reset handled by OrbitControls
    console.log('Reset camera');
  };

  const handleExplodeToggle = () => {
    setIsExploded(!isExploded);
  };

  const handleLayerChange = (layer) => {
    setCurrentLayer(layer);
  };

  return (
    <div className="relative min-h-screen bg-deep-black text-white overflow-hidden">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [8, 6, 8], fov: 75 }}
        className="absolute inset-0"
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} color="#667eea" />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, 5, 10]} intensity={0.5} color="#764ba2" />
          <pointLight position={[10, -5, -10]} intensity={0.3} color="#f093fb" />

          {/* 3D Model */}
          <EngineModel isExploded={isExploded} currentLayer={currentLayer} />

          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Ground */}
          <ContactShadows
            position={[0, -4, 0]}
            opacity={0.4}
            scale={20}
            blur={1.5}
            far={4.5}
          />

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : -20 }}
        className="absolute top-0 left-0 right-0 z-20"
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setCurrentView('dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <GlassCard className="px-4 py-2">
              <h2 className="font-semibold">V8 Engine Assembly</h2>
            </GlassCard>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setHandTrackingEnabled(!handTrackingEnabled)}
            >
              <Hand className={`w-4 h-4 ${handTrackingEnabled ? 'text-electric-blue' : ''}`} />
            </Button>
            
            <Button
              variant="glass"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
            >
              <Mic className={`w-4 h-4 ${voiceEnabled ? 'text-electric-blue' : ''}`} />
            </Button>
            
            <Button
              variant="glass"
              size="sm"
              onClick={() => setAiChatOpen(!aiChatOpen)}
            >
              <MessageCircle className={`w-4 h-4 ${aiChatOpen ? 'text-electric-blue' : ''}`} />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Left Sidebar - Layer Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: showControls ? 1 : 0, x: showControls ? 0 : -20 }}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20"
      >
        <GlassCard className="p-4 w-64">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Layers
            </h3>
            <span className="text-sm text-gray-400">{currentLayer + 1}/{maxLayers}</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Layer Control</label>
              <input
                type="range"
                min="0"
                max={maxLayers - 1}
                value={currentLayer}
                onChange={(e) => handleLayerChange(parseInt(e.target.value))}
                className="w-full h-2 bg-glass-white rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="glass"
                size="sm"
                onClick={handleExplodeToggle}
                className="flex-1"
              >
                {isExploded ? 'Assemble' : 'Explode'}
              </Button>
              <Button
                variant="glass"
                size="sm"
                onClick={handleResetCamera}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Bottom Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
      >
        <GlassCard className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button variant="glass" size="sm">
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button variant="glass" size="sm">
              <SkipForward className="w-4 h-4" />
            </Button>
            
            <div className="h-6 border-l border-glass-border mx-2"></div>
            
            <Button
              variant="glass"
              size="sm"
              onClick={() => setShowControls(!showControls)}
            >
              {showControls ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            
            <Button variant="glass" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Part Information Panel */}
      {selectedPart && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20"
        >
          <GlassCard className="p-4 w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Part Information</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPart(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <p className="text-white">{selectedPart.name}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Layer</label>
                <p className="text-white">Layer {selectedPart.layer + 1}</p>
              </div>
              
              <Button variant="primary" className="w-full">
                Ask AI about this part
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Hand Tracking */}
      {handTrackingEnabled && <HandTracking />}

      {/* Voice Control */}
      {voiceEnabled && <VoiceControl />}

      {/* AI Chat */}
      {aiChatOpen && <AIChat />}

      {/* Gesture Indicator */}
      {gestureData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-24 right-6 z-30"
        >
          <GlassCard className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <Hand className="w-4 h-4 text-electric-blue" />
              <span>Gesture: {gestureData.gesture}</span>
              <span className="text-gray-400">({Math.round(gestureData.confidence * 100)}%)</span>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Voice Listening Indicator */}
      {isListening && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
        >
          <GlassCard className="p-6">
            <div className="flex flex-col items-center text-center">
              <Mic className="w-8 h-8 text-electric-blue mb-2" />
              <p className="text-lg font-semibold">Listening...</p>
              <p className="text-sm text-gray-400">Say "Nova" to activate</p>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

export default SceneViewer;