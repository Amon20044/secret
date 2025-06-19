import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Brain, 
  Hand, 
  Mic, 
  Zap, 
  Layers3, 
  Sparkles,
  Play,
  Github,
  Twitter,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import { useAppStore } from '../store/useAppStore';

const LandingPage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const { setAuthenticated, setCurrentView } = useAppStore();

  useEffect(() => {
    // GSAP Hero Animation
    const tl = gsap.timeline();
    
    tl.from(heroRef.current.querySelector('.hero-title'), {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out'
    })
    .from(heroRef.current.querySelector('.hero-subtitle'), {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5')
    .from(heroRef.current.querySelector('.hero-cta'), {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3');

    // Floating animations for feature cards
    gsap.to('.float-1', {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    });

    gsap.to('.float-2', {
      y: -10,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
      delay: 0.5
    });

    gsap.to('.float-3', {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
      delay: 1
    });
  }, []);

  const handleGetStarted = () => {
    setAuthenticated(true);
    setCurrentView('dashboard');
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Context-aware AI assistant that understands your 3D models and provides engineering insights in real-time.",
      highlight: "GPT-4 Integration"
    },
    {
      icon: <Hand className="w-8 h-8" />,
      title: "Gesture Controls",
      description: "Intuitive hand tracking with MediaPipe - rotate, zoom, select, and manipulate 3D models naturally.",
      highlight: "90%+ Accuracy"
    },
    {
      icon: <Layers3 className="w-8 h-8" />,
      title: "Smart Disassembly",
      description: "Mathematically precise layer-based disassembly system for complex mechanical assemblies.",
      highlight: "Real-time Physics"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "WebGPU Rendering",
      description: "GPU-accelerated 3D rendering with WebGPU for lightning-fast performance in your browser.",
      highlight: "60 FPS Target"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice Assistant",
      description: "Voice commands and natural language queries - 'Nova, what is this part?' gets instant answers.",
      highlight: "Wake Word: Nova"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI Environments",
      description: "Automatically generated 360° environments that match your model context and industry.",
      highlight: "Dynamic Lighting"
    }
  ];

  const stats = [
    { number: "90%+", label: "Gesture Accuracy" },
    { number: "<3s", label: "AI Response Time" },
    { number: "100MB", label: "Max Model Size" },
    { number: "60 FPS", label: "Render Target" }
  ];

  return (
    <div className="min-h-screen bg-deep-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-gradient/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-highlight/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-glass-white border border-glass-border text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2 text-electric-blue" />
              Powered by WebGPU + AI
            </span>
          </motion.div>

          <h1 className="hero-title text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-electric-blue via-purple-gradient to-pink-highlight bg-clip-text text-transparent">
            Three21.go
          </h1>

          <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-4 max-w-4xl mx-auto">
            AI-Powered 3D Engineering Explorer
          </p>

          <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
            Revolutionize how you interact with mechanical systems through immersive hand gesture controls, 
            voice AI, and GPU-accelerated real-time 3D visualization. No headset required - just your browser.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleGetStarted}
              variant="primary" 
              size="lg"
              className="group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Start Exploring
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="glass" size="lg">
              <Github className="w-5 h-5 mr-2" />
              View Source
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-electric-blue mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Next-Generation 3D Engineering
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built with cutting-edge web technologies to deliver desktop-class performance in your browser
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`float-${(index % 3) + 1}`}
              >
                <GlassCard className="h-full p-8 hover:scale-105 transition-all duration-300 group">
                  <div className="text-electric-blue mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-electric-blue/20 text-electric-blue">
                      {feature.highlight}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">Powered by Modern Web Technologies</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "WebGPU", desc: "GPU Acceleration" },
              { name: "Three.js", desc: "3D Rendering" },
              { name: "MediaPipe", desc: "Hand Tracking" },
              { name: "GPT-4", desc: "AI Assistant" },
              { name: "Supabase", desc: "Backend" },
              { name: "TensorFlow.js", desc: "ML Processing" },
              { name: "GSAP", desc: "Animations" },
              { name: "RevenueCat", desc: "Subscriptions" }
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <GlassCard className="p-6 hover:scale-105 transition-all duration-300">
                  <div className="text-lg font-semibold mb-2 text-electric-blue group-hover:text-pink-highlight transition-colors">
                    {tech.name}
                  </div>
                  <div className="text-sm text-gray-400">{tech.desc}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Revolutionize 3D Engineering?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join the future of interactive 3D model exploration and AI-powered engineering insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                onClick={handleGetStarted}
                variant="primary" 
                size="lg"
                className="group"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Free Trial
              </Button>
              
              <div className="flex items-center text-sm text-gray-400">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                No credit card required
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                Free tier includes 3 models
              </span>
              <span>•</span>
              <span>WebGPU compatible browser required</span>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-glass-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-pink-highlight bg-clip-text text-transparent">
                Three21.go
              </h3>
              <p className="text-gray-400 text-sm">AI-Powered 3D Engineering Explorer</p>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-glass-border text-center text-gray-500 text-sm">
            <p>&copy; 2025 Three21.go. Built with RevenueCat & IONOS Domain Integration.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;