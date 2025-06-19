import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FolderOpen, 
  Settings, 
  User, 
  LogOut,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  Trash2,
  Download,
  Share2,
  Clock,
  FileText,
  Cpu,
  Layers3
} from 'lucide-react';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import ModelCard from './ui/ModelCard';
import UploadZone from './ui/UploadZone';
import { useAppStore } from '../store/useAppStore';

const Dashboard = () => {
  const { 
    setCurrentView, 
    setAuthenticated, 
    subscriptionTier,
    user 
  } = useAppStore();
  
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Sample models data
  const [models] = useState([
    {
      id: 1,
      name: "V8 Engine Assembly",
      description: "Complete automotive V8 engine with detailed components",
      thumbnail: "https://images.pexels.com/photos/159740/car-engine-motor-clean-159740.jpeg?auto=compress&cs=tinysrgb&w=400",
      size: "45.2 MB",
      format: ".glb",
      layers: 127,
      created: "2025-01-15",
      category: "Automotive"
    },
    {
      id: 2,
      name: "Human Heart Model",
      description: "Anatomically accurate human heart with chambers and vessels",
      thumbnail: "https://images.pexels.com/photos/433267/pexels-photo-433267.jpeg?auto=compress&cs=tinysrgb&w=400",
      size: "32.8 MB",
      format: ".gltf",
      layers: 89,
      created: "2025-01-12",
      category: "Medical"
    },
    {
      id: 3,
      name: "Aircraft Turbine",
      description: "Jet engine turbine with rotating components and airflow paths",
      thumbnail: "https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=400",
      size: "67.5 MB",
      format: ".glb",
      layers: 203,
      created: "2025-01-10",
      category: "Aerospace"
    },
    {
      id: 4,
      name: "Mechanical Gearbox",
      description: "Multi-speed transmission with detailed gear mechanisms",
      thumbnail: "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400",
      size: "28.9 MB",
      format: ".glb",
      layers: 156,
      created: "2025-01-08",
      category: "Mechanical"
    }
  ]);

  const stats = [
    { label: "Total Models", value: models.length, icon: <Layers3 className="w-5 h-5" /> },
    { label: "Storage Used", value: "174.4 MB", icon: <Cpu className="w-5 h-5" /> },
    { label: "Tier", value: subscriptionTier, icon: <User className="w-5 h-5" /> },
    { label: "This Month", value: "12 Views", icon: <Eye className="w-5 h-5" /> }
  ];

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || model.category.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleModelSelect = (model) => {
    setCurrentView('scene');
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-deep-black text-white">
      {/* Header */}
      <header className="border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-pink-highlight bg-clip-text text-transparent">
                Three21.go
              </h1>
              <nav className="hidden md:flex items-center gap-6">
                <Button variant="ghost" className="text-electric-blue">
                  Dashboard
                </Button>
                <Button variant="ghost">Models</Button>
                <Button variant="ghost">Scenes</Button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-glass-white border border-glass-border">
                <User className="w-4 h-4 text-electric-blue" />
                <span className="text-sm capitalize">{subscriptionTier}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
            <p className="text-gray-400">Manage your 3D models and explore with AI-powered insights.</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-electric-blue">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-glass-white border border-glass-border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-electric-blue"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 bg-glass-white border border-glass-border rounded-xl text-white focus:outline-none focus:border-electric-blue"
            >
              <option value="all">All Categories</option>
              <option value="automotive">Automotive</option>
              <option value="medical">Medical</option>
              <option value="aerospace">Aerospace</option>
              <option value="mechanical">Mechanical</option>
            </select>

            <div className="flex items-center border border-glass-border rounded-xl overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="primary"
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Upload Model
            </Button>
          </div>
        </div>

        {/* Models Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ModelCard
                model={model}
                viewMode={viewMode}
                onSelect={() => handleModelSelect(model)}
                onDelete={() => console.log('Delete', model.id)}
                onDownload={() => console.log('Download', model.id)}
                onShare={() => console.log('Share', model.id)}
              />
            </motion.div>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-16">
            <GlassCard className="max-w-md mx-auto p-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No models found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Upload your first 3D model to get started.'
                }
              </p>
              {!searchQuery && selectedFilter === 'all' && (
                <Button
                  variant="primary"
                  onClick={() => setShowUploadModal(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Model
                </Button>
              )}
            </GlassCard>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <GlassCard className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Upload 3D Model</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  ×
                </Button>
              </div>

              <UploadZone
                onUpload={(files) => {
                  console.log('Files uploaded:', files);
                  setShowUploadModal(false);
                }}
                maxSize={subscriptionTier === 'free' ? 50 : 100}
                acceptedFormats={['.glb', '.gltf', '.fbx']}
              />

              <div className="mt-6 text-center text-sm text-gray-400">
                <p>Supported formats: GLB, GLTF, FBX</p>
                <p>Maximum size: {subscriptionTier === 'free' ? '50MB' : '100MB'} 
                  {subscriptionTier === 'free' && (
                    <span className="text-electric-blue ml-1">
                      (Upgrade for 100MB)
                    </span>
                  )}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;