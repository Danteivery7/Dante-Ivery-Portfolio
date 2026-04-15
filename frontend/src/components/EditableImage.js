import React, { useState, useRef } from 'react';
import { useEdit } from '../context/EditContext';
import { toast } from 'sonner';
import { Upload, X, Link as LinkIcon } from 'lucide-react';

const EditableImage = ({ contentId, alt = '', className = '', fallback }) => {
  const { isEditMode, content, updateContentValue } = useEdit();
  const [showUpload, setShowUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState('url');
  const fileInputRef = useRef(null);

  const currentValue = content[contentId] || fallback || '';

  const handleFileUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      const result = await updateContentValue(contentId, base64String);
      if (result.success) {
        toast.success('Image updated successfully');
        setShowUpload(false);
      } else {
        toast.error(result.message || 'Failed to update image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUrlSave = async () => {
    if (imageUrl && imageUrl !== currentValue) {
      const result = await updateContentValue(contentId, imageUrl);
      if (result.success) {
        toast.success('Image updated successfully');
      } else {
        toast.error(result.message || 'Failed to update image');
      }
    }
    setShowUpload(false);
    setImageUrl('');
  };

  if (isEditMode) {
    return (
      <div className="relative group">
        <img
          src={currentValue}
          alt={alt}
          className={`${className} transition-all`}
          data-testid={`editable-image-${contentId}`}
        />
        
        {!showUpload && (
          <button
            onClick={() => setShowUpload(true)}
            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            data-testid={`edit-image-btn-${contentId}`}
          >
            <div className="text-white text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-[#D4AF37]" />
              <span className="text-sm">Replace Image</span>
            </div>
          </button>
        )}

        {showUpload && (
          <div className="absolute inset-0 bg-black/95 flex items-center justify-center p-4 z-10">
            <div className="bg-[#151920] p-6 rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Update Image</h3>
                <button onClick={() => setShowUpload(false)} className="text-[#A1A1AA] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setUploadMethod('url')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    uploadMethod === 'url'
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-[#0B0F14] text-white border border-white/10'
                  }`}
                >
                  <LinkIcon className="w-4 h-4 inline mr-2" />
                  URL
                </button>
                <button
                  onClick={() => setUploadMethod('upload')}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    uploadMethod === 'upload'
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-[#0B0F14] text-white border border-white/10'
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload
                </button>
              </div>

              {uploadMethod === 'url' ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-white mb-4 outline-none focus:border-[#D4AF37]"
                    data-testid={`image-url-input-${contentId}`}
                  />
                  <button
                    onClick={handleUrlSave}
                    className="w-full bg-[#D4AF37] text-black font-semibold py-2 px-4 rounded-full hover:bg-[#F5C542] transition-colors"
                    data-testid={`save-image-btn-${contentId}`}
                  >
                    Save Image
                  </button>
                </>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-[#D4AF37]/50 rounded-lg p-8 text-center cursor-pointer hover:border-[#D4AF37] transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto mb-3 text-[#D4AF37]" />
                  <p className="text-white mb-2">Drop image here or click to upload</p>
                  <p className="text-xs text-[#A1A1AA]">PNG, JPG, GIF, WEBP up to 10MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={currentValue}
      alt={alt}
      className={className}
      data-testid={`image-${contentId}`}
    />
  );
};

export default EditableImage;
