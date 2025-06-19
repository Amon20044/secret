import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import GlassCard from './GlassCard';
import Button from './Button';

const UploadZone = ({ 
  onUpload, 
  maxSize = 100, 
  acceptedFormats = ['.glb', '.gltf', '.fbx'],
  multiple = false 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const validFiles = [];
    const errors = [];

    Array.from(fileList).forEach(file => {
      // Check file format
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      if (!acceptedFormats.includes(extension)) {
        errors.push(`${file.name}: Unsupported format. Use ${acceptedFormats.join(', ')}`);
        return;
      }

      // Check file size (convert MB to bytes)
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name}: File too large. Maximum size is ${maxSize}MB`);
        return;
      }

      validFiles.push({
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'pending' // pending, uploading, success, error
      });
    });

    if (errors.length > 0) {
      console.error('Upload errors:', errors);
      // Show error toast or modal
    }

    if (validFiles.length > 0) {
      setFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    }
  };

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const startUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    
    // Simulate upload process
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading' } : f
      ));

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ));
      }

      // Mark as success
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'success', progress: 100 } : f
      ));
    }

    setUploading(false);
    
    // Call onUpload callback
    if (onUpload) {
      onUpload(files.map(f => f.file));
    }

    // Clear files after successful upload
    setTimeout(() => {
      setFiles([]);
    }, 2000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'uploading':
        return <div className="w-5 h-5 border-2 border-electric-blue border-t-transparent rounded-full animate-spin" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-electric-blue bg-electric-blue/10'
            : 'border-glass-border hover:border-electric-blue/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        animate={{
          scale: dragActive ? 1.02 : 1,
          borderColor: dragActive ? '#667eea' : 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedFormats.join(',')}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-glass-white flex items-center justify-center">
            <Upload className={`w-8 h-8 ${dragActive ? 'text-electric-blue' : 'text-gray-400'}`} />
          </div>

          <div>
            <p className="text-lg font-semibold mb-2">
              {dragActive ? 'Drop files here' : 'Drag & drop your 3D models'}
            </p>
            <p className="text-gray-400 text-sm">
              or <span className="text-electric-blue cursor-pointer">browse files</span>
            </p>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Supported formats: {acceptedFormats.join(', ')}</p>
            <p>Maximum file size: {maxSize}MB</p>
          </div>
        </div>
      </motion.div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Selected Files</h4>
          
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-glass-white rounded-xl border border-glass-border"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(file.status)}
                
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {file.status === 'uploading' && (
                  <div className="w-24">
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-electric-blue h-1 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {file.status === 'pending' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}

          {files.some(f => f.status === 'pending') && (
            <Button
              variant="primary"
              onClick={startUpload}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadZone;