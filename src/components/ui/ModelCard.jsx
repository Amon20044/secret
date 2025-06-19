import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Download, 
  Share2, 
  Trash2, 
  Calendar, 
  FileText, 
  Layers3,
  MoreVertical
} from 'lucide-react';
import GlassCard from './GlassCard';
import Button from './Button';

const ModelCard = ({ 
  model, 
  viewMode = 'grid', 
  onSelect, 
  onDelete, 
  onDownload, 
  onShare 
}) => {
  if (viewMode === 'list') {
    return (
      <GlassCard className="p-4 hover:bg-white/5 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <img
              src={model.thumbnail}
              alt={model.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {model.name}
            </h3>
            <p className="text-gray-400 text-sm truncate">
              {model.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {model.format}
              </span>
              <span className="flex items-center gap-1">
                <Layers3 className="w-3 h-3" />
                {model.layers} layers
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {model.created}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 mr-4">
              {model.size}
            </span>
            
            <Button variant="ghost" size="sm" onClick={onSelect}>
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onDownload}>
              <Download className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onShare}>
              <Share2 className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard className="overflow-hidden group hover:bg-white/5 transition-all duration-300">
        <div className="relative">
          <img
            src={model.thumbnail}
            alt={model.name}
            className="w-full h-48 object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="flex gap-2">
                <Button variant="glass" size="sm" onClick={onSelect}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="glass" size="sm" onClick={onDownload}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="glass" size="sm" onClick={onShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              
              <Button variant="glass" size="sm" onClick={onDelete}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          </div>
          
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
              {model.format}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2 truncate">
            {model.name}
          </h3>
          
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {model.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Layers3 className="w-3 h-3" />
                {model.layers}
              </span>
              <span>{model.size}</span>
            </div>
            
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {model.created}
            </span>
          </div>
          
          <div className="mt-3 pt-3 border-t border-glass-border">
            <Button
              variant="primary"
              className="w-full"
              onClick={onSelect}
            >
              Open in 3D Viewer
            </Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default ModelCard;