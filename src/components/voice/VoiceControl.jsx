import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';

const VoiceControl = () => {
  const { 
    voiceEnabled, 
    isListening, 
    setIsListening, 
    setAiChatOpen 
  } = useAppStore();
  
  const [recognition, setRecognition] = useState(null);
  const [synthesis, setSynthesis] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [lastCommand, setLastCommand] = useState('');

  useEffect(() => {
    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        console.log('Voice input:', transcript);
        
        // Check for wake word
        if (transcript.toLowerCase().includes('nova') || transcript.toLowerCase().includes('hey nova')) {
          handleVoiceCommand(transcript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        // Restart recognition if voice is enabled
        if (voiceEnabled) {
          setTimeout(() => {
            recognitionInstance.start();
          }, 1000);
        }
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    }

    // Check for speech synthesis support
    if ('speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis);
    }
  }, [voiceEnabled, setIsListening]);

  useEffect(() => {
    if (!recognition || !voiceEnabled) return;

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [recognition, voiceEnabled]);

  const handleVoiceCommand = (transcript) => {
    const command = transcript.toLowerCase();
    setLastCommand(command);

    // Process voice commands
    if (command.includes('what is this') || command.includes('identify')) {
      speak("I can see this is a V8 engine assembly. Would you like me to explain specific components?");
      setAiChatOpen(true);
    } else if (command.includes('explode') || command.includes('disassemble')) {
      speak("Initiating exploded view of the model.");
      // Trigger exploded view
    } else if (command.includes('reset') || command.includes('home')) {
      speak("Resetting camera to home position.");
      // Reset camera
    } else if (command.includes('zoom in')) {
      speak("Zooming in on the model.");
      // Zoom in
    } else if (command.includes('zoom out')) {
      speak("Zooming out from the model.");
      // Zoom out
    } else if (command.includes('rotate')) {
      speak("Rotating the model.");
      // Start rotation
    } else if (command.includes('stop')) {
      speak("Stopping current action.");
      // Stop current action
    } else if (command.includes('help')) {
      speak("You can ask me to identify parts, explode the view, reset the camera, zoom in or out, rotate the model, or ask technical questions about the engineering components.");
    } else {
      // General AI query
      speak("Let me analyze that for you.");
      setAiChatOpen(true);
    }
  };

  const speak = (text) => {
    if (synthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      // Try to use a female voice for Nova
      const voices = synthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen') ||
        voice.gender === 'female'
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      synthesis.speak(utterance);
    }
  };

  if (!voiceEnabled || !isSupported) {
    return null;
  }

  return (
    <>
      {/* Voice Status Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-30"
      >
        <GlassCard className="px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isListening ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Mic className="w-4 h-4 text-electric-blue" />
                </motion.div>
              ) : (
                <MicOff className="w-4 h-4 text-gray-400" />
              )}
              
              <span className="text-sm">
                {isListening ? 'Listening for "Nova"...' : 'Voice Ready'}
              </span>
            </div>

            {lastCommand && (
              <div className="text-xs text-gray-400 border-l border-glass-border pl-3">
                Last: {lastCommand.substring(0, 30)}...
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Voice Commands Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-24 left-6 z-20"
      >
        <GlassCard className="p-4 max-w-xs">
          <div className="flex items-center gap-2 mb-3">
            <Volume2 className="w-4 h-4 text-electric-blue" />
            <h4 className="font-semibold text-sm">Voice Commands</h4>
          </div>
          
          <div className="text-xs text-gray-400 space-y-1">
            <p><span className="text-white">"Nova, what is this?"</span> - Identify parts</p>
            <p><span className="text-white">"Nova, explode view"</span> - Disassemble model</p>
            <p><span className="text-white">"Nova, reset camera"</span> - Home position</p>
            <p><span className="text-white">"Nova, zoom in/out"</span> - Camera control</p>
            <p><span className="text-white">"Nova, help"</span> - Show all commands</p>
          </div>
          
          <div className="mt-3 pt-3 border-t border-glass-border text-xs text-gray-500">
            <p>Wake word: <span className="text-electric-blue">"Nova"</span> or <span className="text-electric-blue">"Hey Nova"</span></p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Active Listening Overlay */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-electric-blue/5 backdrop-blur-sm z-10 pointer-events-none"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
              className="w-32 h-32 rounded-full border-2 border-electric-blue"
            />
          </div>
        </motion.div>
      )}
    </>
  );
};

export default VoiceControl;