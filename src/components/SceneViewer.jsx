import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
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

const SceneViewer = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  
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
    if (!canvasRef.current) return;

    // Initialize Three.js scene with WebGPU renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    let renderer;
    try {
      // Try WebGPU first
      renderer = new THREE.WebGPURenderer({ 
        canvas: canvasRef.current,
        antialias: true,
        alpha: true 
      });
    } catch (error) {
      // Fallback to WebGL
      renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current,
        antialias: true,
        alpha: true 
      });
      console.log('WebGPU not supported, using WebGL fallback');
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0a, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x667eea, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x764ba2, 0.5, 100);
    pointLight1.position.set(-10, 5, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xf093fb, 0.3, 100);
    pointLight2.position.set(10, -5, -10);
    scene.add(pointLight2);

    // Sample 3D model (placeholder geometry)
    const createEngineModel = () => {
      const group = new THREE.Group();
      
      // Engine block
      const blockGeometry = new THREE.BoxGeometry(4, 3, 5);
      const blockMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
      const engineBlock = new THREE.Mesh(blockGeometry, blockMaterial);
      engineBlock.userData = { name: 'Engine Block', layer: 0 };
      group.add(engineBlock);

      // Cylinders
      for (let i = 0; i < 8; i++) {
        const cylinderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2);
        const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        
        const angle = (i / 8) * Math.PI * 2;
        cylinder.position.x = Math.cos(angle) * 1.5;
        cylinder.position.z = Math.sin(angle) * 1.5;
        cylinder.position.y = 1;
        cylinder.userData = { name: `Cylinder ${i + 1}`, layer: 1 };
        
        group.add(cylinder);
      }

      // Pistons
      for (let i = 0; i < 8; i++) {
        const pistonGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1);
        const pistonMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
        const piston = new THREE.Mesh(pistonGeometry, pistonMaterial);
        
        const angle = (i / 8) * Math.PI * 2;
        piston.position.x = Math.cos(angle) * 1.5;
        piston.position.z = Math.sin(angle) * 1.5;
        piston.position.y = 0;
        piston.userData = { name: `Piston ${i + 1}`, layer: 2 };
        
        group.add(piston);
      }

      return group;
    };

    const model = createEngineModel();
    scene.add(model);

    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (isPlaying) {
        model.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };

    animate();
    setIsLoading(false);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isPlaying]);

  // Handle gesture data
  useEffect(() => {
    if (gestureData && sceneRef.current && cameraRef.current) {
      // Process gesture commands
      switch (gestureData.gesture) {
        case 'peace':
          // Zoom control
          const zoomFactor = gestureData.confidence * 0.1;
          cameraRef.current.position.multiplyScalar(1 - zoomFactor);
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
    if (!sceneRef.current || !cameraRef.current) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    mouse.x = (position.x / window.innerWidth) * 2 - 1;
    mouse.y = -(position.y / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      setSelectedPart(object.userData);
    }
  };

  const handleResetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(8, 6, 8);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const handleExplodeToggle = () => {
    setIsExploded(!isExploded);
    // Implement exploded view animation
  };

  const handleLayerChange = (layer) => {
    setCurrentLayer(layer);
    // Implement layer visibility logic
  };

  return (
    <div className="relative min-h-screen bg-deep-black text-white overflow-hidden">
      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 bg-deep-black flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl">Loading 3D Model...</p>
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

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