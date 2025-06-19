import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  X, 
  Bot, 
  User, 
  Sparkles,
  Volume2,
  Copy,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';

const AIChat = () => {
  const { setAiChatOpen } = useAppStore();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm Nova, your AI engineering assistant. I can help you understand this 3D model, explain components, analyze mechanical systems, and answer technical questions. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(input),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('engine') || lowerQuery.includes('v8')) {
      return "This V8 engine assembly features 8 cylinders arranged in a V configuration. The main components include the engine block (housing the cylinders), pistons that convert combustion pressure into rotational motion, connecting rods that link pistons to the crankshaft, and the crankshaft that converts linear piston motion into rotational output. Each cylinder contains valves for intake and exhaust, controlled by camshafts. The V8 design provides excellent power-to-weight ratio and smooth operation due to its firing order.";
    }
    
    if (lowerQuery.includes('cylinder') || lowerQuery.includes('piston')) {
      return "The cylinders are the heart of the engine where combustion occurs. Each cylinder contains a piston that moves up and down in a four-stroke cycle: intake (drawing in fuel/air mixture), compression (squeezing the mixture), power (combustion pushes piston down), and exhaust (expelling burned gases). The pistons are connected to connecting rods, which transfer the linear motion to the rotating crankshaft.";
    }
    
    if (lowerQuery.includes('how') && lowerQuery.includes('work')) {
      return "The V8 engine works through a coordinated four-stroke cycle across all 8 cylinders. The crankshaft timing ensures that while some cylinders are on their power stroke, others are in different phases, creating smooth power delivery. The V configuration allows for a more compact design compared to inline engines while maintaining excellent balance and performance characteristics.";
    }
    
    if (lowerQuery.includes('disassemble') || lowerQuery.includes('layers')) {
      return "To disassemble this engine model, we'll work in reverse assembly order: First remove the valve covers and intake manifold (Layer 1), then the cylinder heads and camshafts (Layer 2), followed by the pistons and connecting rods (Layer 3), and finally access the crankshaft and engine block (Layer 4). Each layer reveals different mechanical systems and their relationships.";
    }
    
    // Default response
    return "I can help you understand various aspects of this 3D model. You can ask me about specific components, how systems work together, material properties, failure analysis, or assembly procedures. Try asking about specific parts you're interested in, or use voice commands like 'Nova, explain the engine block' for detailed information.";
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // Show toast notification
  };

  const handleFeedback = (messageId, feedback) => {
    console.log(`Message ${messageId} feedback: ${feedback}`);
    // Send feedback to backend
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed right-6 top-6 bottom-6 w-96 z-40"
    >
      <GlassCard className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-glass-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-electric-blue to-purple-gradient flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Nova AI Assistant</h3>
              <p className="text-xs text-gray-400">Engineering Expert</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAiChatOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'ai' 
                    ? 'bg-gradient-to-r from-electric-blue to-purple-gradient' 
                    : 'bg-gray-600'
                }`}>
                  {message.type === 'ai' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[85%] p-3 rounded-2xl ${
                    message.type === 'ai'
                      ? 'bg-glass-white border border-glass-border'
                      : 'bg-electric-blue text-white'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span>{formatTime(message.timestamp)}</span>
                    
                    {message.type === 'ai' && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyMessage(message.content)}
                          className="p-1 h-6 w-6"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(message.id, 'up')}
                          className="p-1 h-6 w-6"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(message.id, 'down')}
                          className="p-1 h-6 w-6"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-electric-blue to-purple-gradient flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-glass-white border border-glass-border rounded-2xl p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-glass-border">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about the 3D model..."
                className="w-full px-4 py-3 bg-glass-white border border-glass-border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-electric-blue pr-12"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceInput}
                disabled={isListening}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Mic className={`w-4 h-4 ${isListening ? 'text-red-400 animate-pulse' : ''}`} />
              </Button>
            </div>
            
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-gray-400">
            Try: "What is this part?", "How does this work?", or "Disassemble the model"
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default AIChat;