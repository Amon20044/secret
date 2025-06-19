'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Hand, Wifi, WifiOff, Settings } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';

const HandTracking = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [currentGesture, setCurrentGesture] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  
  const { setGestureData, handTrackingEnabled, setHandTrackingEnabled } = useAppStore();

  useEffect(() => {
    if (!handTrackingEnabled) return;

    let hands;
    let camera;

    const initializeHandTracking = async () => {
      try {
        // Import MediaPipe Hands
        const { Hands } = await import('@mediapipe/hands');
        const { Camera } = await import('@mediapipe/camera_utils');

        hands = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.8,
          minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);

        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (hands && videoRef.current) {
                await hands.send({ image: videoRef.current });
              }
            },
            width: 320,
            height: 240
          });

          await camera.start();
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize hand tracking:', error);
      }
    };

    const onResults = (results) => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = 320;
      canvas.height = 240;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw video feed if debug mode
      if (showDebug && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const gestureResult = detectGesture(landmarks);
        
        setCurrentGesture(gestureResult.gesture);
        setConfidence(gestureResult.confidence);
        
        // Send gesture data to store
        setGestureData({
          gesture: gestureResult.gesture,
          confidence: gestureResult.confidence,
          landmarks: landmarks,
          position: {
            x: landmarks[8].x * window.innerWidth,
            y: landmarks[8].y * window.innerHeight
          }
        });

        // Draw hand landmarks if debug mode
        if (showDebug) {
          drawLandmarks(ctx, landmarks);
        }
      } else {
        setCurrentGesture(null);
        setConfidence(0);
        setGestureData(null);
      }
    };

    const detectGesture = (landmarks) => {
      // Gesture detection logic
      const fingerTips = [4, 8, 12, 16, 20]; // Thumb, Index, Middle, Ring, Pinky
      const fingerPips = [3, 6, 10, 14, 18];
      
      // Calculate if fingers are extended
      const fingersUp = fingerTips.map((tip, index) => {
        if (index === 0) { // Thumb
          return landmarks[tip].x > landmarks[fingerPips[index]].x;
        } else {
          return landmarks[tip].y < landmarks[fingerPips[index]].y;
        }
      });

      const totalFingersUp = fingersUp.filter(Boolean).length;

      // Peace sign (Index and Middle up)
      if (totalFingersUp === 2 && fingersUp[1] && fingersUp[2]) {
        return { gesture: 'peace', confidence: 0.9 };
      }

      // Point (Only Index up)
      if (totalFingersUp === 1 && fingersUp[1]) {
        return { gesture: 'point', confidence: 0.85 };
      }

      // Open palm (All fingers up)
      if (totalFingersUp === 5) {
        return { gesture: 'palm', confidence: 0.9 };
      }

      // Pinch (Thumb and Index close)
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      const distance = Math.sqrt(
        Math.pow(thumbTip.x - indexTip.x, 2) + 
        Math.pow(thumbTip.y - indexTip.y, 2)
      );
      
      if (distance < 0.05) {
        return { gesture: 'pinch', confidence: 0.8 };
      }

      // Fist (No fingers up)
      if (totalFingersUp === 0) {
        return { gesture: 'fist', confidence: 0.7 };
      }

      return { gesture: 'unknown', confidence: 0.3 };
    };

    const drawLandmarks = (ctx, landmarks) => {
      // Draw hand connections
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [5, 9], [9, 10], [10, 11], [11, 12], // Middle
        [9, 13], [13, 14], [14, 15], [15, 16], // Ring
        [13, 17], [17, 18], [18, 19], [19, 20], // Pinky
        [0, 17] // Palm
      ];

      // Draw connections
      ctx.strokeStyle = '#667eea';
      ctx.lineWidth = 2;
      connections.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(landmarks[start].x * 320, landmarks[start].y * 240);
        ctx.lineTo(landmarks[end].x * 320, landmarks[end].y * 240);
        ctx.stroke();
      });

      // Draw landmarks
      ctx.fillStyle = '#f093fb';
      landmarks.forEach((landmark) => {
        ctx.beginPath();
        ctx.arc(landmark.x * 320, landmark.y * 240, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    };

    initializeHandTracking();

    return () => {
      if (camera) {
        camera.stop();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [handTrackingEnabled, showDebug, setGestureData]);

  if (!handTrackingEnabled) return null;

  return (
    <>
      {/* Hidden video element for camera feed */}
      <video
        ref={videoRef}
        className="hidden"
        autoPlay
        muted
        playsInline
      />

      {/* Debug canvas */}
      {showDebug && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 left-6 z-30"
        >
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">Hand Tracking Debug</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDebug(false)}
              >
                ×
              </Button>
            </div>
            <canvas
              ref={canvasRef}
              className="rounded-lg border border-glass-border"
              width={320}
              height={240}
            />
          </GlassCard>
        </motion.div>
      )}

      {/* Status Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-30"
      >
        <GlassCard className="p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Hand className={`w-4 h-4 ${isInitialized ? 'text-electric-blue' : 'text-gray-400'}`} />
              {isInitialized ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
            </div>

            <div className="text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Status:</span>
                <span className={isInitialized ? 'text-green-400' : 'text-red-400'}>
                  {isInitialized ? 'Active' : 'Initializing...'}
                </span>
              </div>
              
              {currentGesture && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400">Gesture:</span>
                  <span className="text-electric-blue capitalize">{currentGesture}</span>
                  <span className="text-gray-500">({Math.round(confidence * 100)}%)</span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Gesture Help */}
      {isInitialized && !currentGesture && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        >
          <GlassCard className="p-6 text-center max-w-md">
            <Hand className="w-12 h-12 text-electric-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Hand Gestures Ready</h3>
            <div className="text-sm text-gray-400 space-y-1">
              <p>✌️ Peace Sign - Zoom control</p>
              <p>👉 Point - Select parts</p>
              <p>✋ Open Palm - Reset camera</p>
              <p>🤏 Pinch - Grab and move</p>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </>
  );
};

export default HandTracking;