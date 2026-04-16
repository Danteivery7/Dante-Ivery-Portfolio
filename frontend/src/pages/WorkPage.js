import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, X, Smartphone, Globe, Upload } from 'lucide-react';
import { useEdit } from '../context/EditContext';
import { toast } from 'sonner';
import * as api from '../services/api';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

const DeviceFrame = ({ project, onClick }) => {
  const isApp = project.project_type === 'app';

  if (isApp) {
    // Phone Frame
    return (
      <motion.div
        whileHover={{ y: -8 }}
        onClick={onClick}
        className="cursor-pointer group"
        data-testid={`project-${project.project_id}`}
      >
        <div className="relative mx-auto" style={{ width: '280px' }}>
          {/* Phone Shell */}
          <div className="relative bg-[#1E232B] rounded-[48px] p-3 border-4 border-[#0B0F14] shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-[#0B0F14] rounded-b-3xl z-10"></div>
            
            {/* Screen */}
            <div className="relative bg-black rounded-[36px] overflow-hidden" style={{ aspectRatio: '9/16' }}>
              <video
                src={project.video_url}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                style={{ pointerEvents: 'none' }}
                onError={(e) => console.error('Video error:', e)}
              />
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                  <p className="text-sm font-semibold">View Details</p>
                </div>
              </div>
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-[#D4AF37]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
        </div>
      </motion.div>
    );
  } else {
    // Browser Frame
    return (
      <motion.div
        whileHover={{ y: -8 }}
        onClick={onClick}
        className="cursor-pointer group"
        data-testid={`project-${project.project_id}`}
      >
        <div className="relative">
          {/* Browser Window */}
          <div className="bg-[#1E232B] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Browser Header */}
            <div className="bg-[#0B0F14] px-4 py-3 flex items-center space-x-2 border-b border-white/10">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 bg-[#151920] rounded px-3 py-1 text-xs text-[#A1A1AA]">
                {project.title}.com
              </div>
            </div>
            
            {/* Browser Content */}
            <div className="relative bg-black" style={{ aspectRatio: '16/10' }}>
              <video
                src={project.video_url}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                style={{ pointerEvents: 'none' }}
                onError={(e) => console.error('Video error:', e)}
              />
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                  <p className="text-sm font-semibold">View Details</p>
                </div>
              </div>
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-[#D4AF37]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
        </div>
      </motion.div>
    );
  }
};

const ProjectDetailModal = ({ project, isOpen, onClose, onEdit, onDelete, canEdit }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!project) return null;

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);
    await onDelete(project.project_id);
  };

  const handleZoomClick = (e) => {
    e.stopPropagation();
    setIsZoomed(true);
  };

  const handleZoomClose = () => {
    setIsZoomed(false);
  };

  const DevicePreview = ({ showHoverText = true }) => (
    <div 
      className={`${showHoverText ? 'cursor-pointer group' : ''}`}
      onClick={showHoverText ? handleZoomClick : undefined}
    >
      {project.project_type === 'app' ? (
        <div className="relative mx-auto" style={{ width: '280px' }}>
          <div className="relative bg-[#1E232B] rounded-[48px] p-3 border-4 border-[#0B0F14] shadow-2xl">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-[#0B0F14] rounded-b-3xl z-10"></div>
            <div className="relative bg-black rounded-[36px] overflow-hidden" style={{ aspectRatio: '9/16' }}>
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="metadata"
                className="w-full h-full object-cover" 
                style={{ pointerEvents: 'none' }}
              >
                <source src={project.video_url} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
              </video>
              {showHoverText && (
                <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                    <p className="text-sm font-semibold">View App</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="bg-[#1E232B] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-[#0B0F14] px-4 py-3 flex items-center space-x-2 border-b border-white/10">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 bg-[#151920] rounded px-3 py-1 text-xs text-[#A1A1AA]">{project.title}.com</div>
            </div>
            <div className="relative bg-black" style={{ aspectRatio: '16/10' }}>
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="metadata"
                className="w-full h-full object-cover" 
                style={{ pointerEvents: 'none' }}
              >
                <source src={project.video_url} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
              </video>
              {showHoverText && (
                <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                    <p className="text-sm font-semibold">View Website</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Dialog open={isOpen && !isZoomed} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl bg-[#151920] border border-white/10 text-white" data-testid="project-detail-modal">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-heading font-bold text-white mb-2">
                  {project.title}
                </DialogTitle>
                <div className="flex items-center space-x-2 text-sm text-[#A1A1AA]">
                  {project.project_type === 'app' ? (
                    <><Smartphone className="w-4 h-4" /> <span>Mobile App</span></>
                  ) : (
                    <><Globe className="w-4 h-4" /> <span>Website</span></>
                  )}
                </div>
              </div>
              {canEdit && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(project)}
                    type="button"
                    className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
                    data-testid="edit-project-btn"
                    title="Edit project"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    type="button"
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    data-testid="delete-project-btn"
                    title="Delete project"
                  >
                    <X className="w-6 h-6 font-bold" strokeWidth={3} />
                  </button>
                </div>
              )}
            </div>
          </DialogHeader>

          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 rounded-lg">
              <div className="bg-[#0B0F14] p-6 rounded-xl border-2 border-red-500 max-w-md">
                <h3 className="text-xl font-bold text-white mb-3">Delete Project?</h3>
                <p className="text-[#A1A1AA] mb-6">
                  Are you sure you want to permanently delete "{project.title}"? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 bg-red-500 text-white py-2.5 px-4 rounded-full font-semibold hover:bg-red-600 transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-[#151920] text-white py-2.5 px-4 rounded-full font-semibold hover:bg-[#1E232B] transition-colors border border-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div className="flex items-center justify-center">
              <DevicePreview showHoverText={true} />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[#D4AF37] mb-2">Description</h3>
                <p className="text-[#A1A1AA] leading-relaxed">{project.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#D4AF37] mb-2">Full Details</h3>
                <p className="text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                  {project.full_description}
                </p>
              </div>

              {project.seo_keywords && project.seo_keywords.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#D4AF37] mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.seo_keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-sm border border-[#D4AF37]/20"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-8"
            onClick={handleZoomClose}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: project.project_type === 'app' ? 1.8 : 0.6 }}
              exit={{ scale: 0.5 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <DevicePreview showHoverText={false} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const AddProjectModal = ({ isOpen, onClose, onSubmit, editingProject }) => {
  const [projectType, setProjectType] = useState(editingProject?.project_type || null);
  const [uploadMethod, setUploadMethod] = useState('url');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    full_description: '',
    video_url: '',
    seo_keywords: '',
  });
  const videoInputRef = useRef(null);

  // Update form data when editingProject changes
  useEffect(() => {
    if (editingProject) {
      setProjectType(editingProject.project_type);
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        full_description: editingProject.full_description || '',
        video_url: editingProject.video_url || '',
        seo_keywords: editingProject.seo_keywords?.join(', ') || '',
      });
    } else {
      setProjectType(null);
      setFormData({
        title: '',
        description: '',
        full_description: '',
        video_url: '',
        seo_keywords: '',
      });
    }
  }, [editingProject, isOpen]);

  const handleVideoUpload = async (file) => {
    if (!file || !file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }

    try {
      setIsUploadingVideo(true);
      toast.info('Uploading video...');
      const response = await api.createProjectVideoUpload(file.name, file.type);
      const { upload_url, upload_headers, video_url } = response.data;

      const uploadResponse = await fetch(upload_url, {
        method: 'PUT',
        headers: upload_headers || {},
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Video upload failed with status ${uploadResponse.status}`);
      }

      setFormData((current) => ({ ...current, video_url }));
      toast.success('Video uploaded');
    } catch (error) {
      const message = error.response?.data?.detail || error.message || 'Failed to upload video';
      toast.error(message);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleVideoUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectType) {
      toast.error('Please select a project type');
      return;
    }

    if (!formData.video_url.trim()) {
      toast.error('Please upload a video or enter a video URL');
      return;
    }

    const keywords = formData.seo_keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k);

    onSubmit({
      ...formData,
      project_type: projectType,
      seo_keywords: keywords,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#151920] border border-white/10 text-white" data-testid="add-project-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-white">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4 pb-4">
          {/* Project Type Selection - Only show if creating new */}
          {!editingProject && (
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-3">Project Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setProjectType('app')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    projectType === 'app'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  data-testid="select-app-type"
                >
                  <Smartphone className={`w-8 h-8 mx-auto mb-2 ${projectType === 'app' ? 'text-[#D4AF37]' : 'text-[#A1A1AA]'}`} />
                  <div className={`font-semibold ${projectType === 'app' ? 'text-[#D4AF37]' : 'text-white'}`}>
                    Mobile App
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setProjectType('website')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    projectType === 'website'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  data-testid="select-website-type"
                >
                  <Globe className={`w-8 h-8 mx-auto mb-2 ${projectType === 'website' ? 'text-[#D4AF37]' : 'text-[#A1A1AA]'}`} />
                  <div className={`font-semibold ${projectType === 'website' ? 'text-[#D4AF37]' : 'text-white'}`}>
                    Website
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div>
            <label htmlFor="title" className="block text-sm text-[#A1A1AA] mb-2">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
              placeholder="My Awesome App"
              data-testid="project-title-input"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm text-[#A1A1AA] mb-2">
              Short Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="2"
              className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37] resize-none"
              placeholder="A brief description..."
              data-testid="project-description-input"
            />
          </div>

          <div>
            <label htmlFor="full_description" className="block text-sm text-[#A1A1AA] mb-2">
              Full Description
            </label>
            <textarea
              id="full_description"
              value={formData.full_description}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              required
              rows="4"
              className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37] resize-none"
              placeholder="Detailed project information..."
              data-testid="project-full-description-input"
            />
          </div>

          <div>
            <label htmlFor="video_url" className="block text-sm text-[#A1A1AA] mb-2">
              Video
            </label>
            
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setUploadMethod('url')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
                  uploadMethod === 'url'
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-[#0B0F14] text-white border border-white/10'
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod('upload')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
                  uploadMethod === 'upload'
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-[#0B0F14] text-white border border-white/10'
                }`}
              >
                Upload File
              </button>
            </div>

            {uploadMethod === 'url' ? (
              <>
                <input
                  type="url"
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  required
                  className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
                  placeholder="https://example.com/video.mp4"
                  data-testid="project-video-input"
                />
                <p className="text-xs text-[#A1A1AA] mt-2">Enter a direct video URL (mp4, webm)</p>
              </>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-[#D4AF37]/50 rounded-lg p-8 text-center cursor-pointer hover:border-[#D4AF37] transition-colors"
                onClick={() => videoInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-3 text-[#D4AF37]" />
                <p className="text-white mb-2">Drop video here or click to upload</p>
                <p className="text-xs text-[#A1A1AA]">MP4, WEBM, MOV</p>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files[0] && handleVideoUpload(e.target.files[0])}
                  className="hidden"
                />
                {isUploadingVideo && (
                  <p className="text-[#D4AF37] text-sm mt-3">Uploading...</p>
                )}
                {!isUploadingVideo && formData.video_url && (
                  <p className="text-[#D4AF37] text-sm mt-3">✓ Video uploaded</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="seo_keywords" className="block text-sm text-[#A1A1AA] mb-2">
              SEO Keywords (comma separated)
            </label>
            <input
              type="text"
              id="seo_keywords"
              value={formData.seo_keywords}
              onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
              className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
              placeholder="react, mobile, ecommerce"
              data-testid="project-keywords-input"
            />
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              className="flex-1 bg-[#D4AF37] text-[#0B0F14] hover:bg-[#F5C542]"
              data-testid="save-project-btn"
            >
              {editingProject ? 'Update Project' : 'Add Project'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
              data-testid="cancel-project-btn"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const WorkPage = () => {
  const { portfolio, isEditMode, isLoadingPortfolio, addProject, updateProjectData, removeProject } = useEdit();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleAddProject = async (projectData) => {
    try {
      if (editingProject) {
        await updateProjectData(editingProject.project_id, projectData);
        toast.success('Project updated successfully');
      } else {
        await addProject(projectData);
        toast.success('Project added successfully');
      }
      setShowAddModal(false);
      setEditingProject(null);
    } catch (error) {
      toast.error(error.message || 'Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setSelectedProject(null);
    setShowAddModal(true);
  };

  const handleDelete = async (projectId) => {
    try {
      await removeProject(projectId);
      setSelectedProject(null);
      toast.success('Project permanently deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] pt-32 pb-24" data-testid="work-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-4 tracking-tight">
                My Work
              </h1>
              <p className="text-xl text-[#A1A1AA]">
                A showcase of apps and websites I've built
              </p>
            </div>

            {isEditMode && (
              <Button
                onClick={() => {
                  setEditingProject(null);
                  setShowAddModal(true);
                }}
                className="bg-[#D4AF37] text-[#0B0F14] hover:bg-[#F5C542]"
                data-testid="add-project-btn"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Project
              </Button>
            )}
          </div>
        </motion.div>

        {/* Projects Grid */}
        {isLoadingPortfolio ? (
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full mb-4"
              />
              <p className="text-[#D4AF37] text-lg font-semibold">Loading Projects...</p>
            </motion.div>
          </div>
        ) : portfolio.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#A1A1AA] text-lg">No projects yet. {isEditMode && 'Click "Add Project" to get started.'}</p>
          </div>
        ) : (
          <>
            {/* Apps Section */}
            {portfolio.filter(p => p.project_type === 'app').length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-heading font-bold text-white mb-8">Mobile Apps</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
                  {portfolio
                    .filter(p => p.project_type === 'app')
                    .map((project, index) => (
                      <motion.div
                        key={project.project_id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <DeviceFrame
                          project={project}
                          onClick={() => setSelectedProject(project)}
                        />
                        <div className="mt-6 text-center">
                          <h3 className="text-xl font-heading font-semibold text-white mb-2">
                            {project.title}
                          </h3>
                          <p className="text-[#A1A1AA] text-sm leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}

            {/* Websites Section */}
            {portfolio.filter(p => p.project_type === 'website').length > 0 && (
              <div>
                <h2 className="text-3xl font-heading font-bold text-white mb-8">Websites</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
                  {portfolio
                    .filter(p => p.project_type === 'website')
                    .map((project, index) => (
                      <motion.div
                        key={project.project_id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <DeviceFrame
                          project={project}
                          onClick={() => setSelectedProject(project)}
                        />
                        <div className="mt-6 text-center">
                          <h3 className="text-xl font-heading font-semibold text-white mb-2">
                            {project.title}
                          </h3>
                          <p className="text-[#A1A1AA] text-sm leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={isEditMode}
      />

      <AddProjectModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingProject(null);
        }}
        onSubmit={handleAddProject}
        editingProject={editingProject}
      />
    </div>
  );
};

export default WorkPage;
