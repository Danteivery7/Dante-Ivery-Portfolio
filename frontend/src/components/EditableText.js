import React, { useState, useRef, useEffect } from 'react';
import { useEdit } from '../context/EditContext';
import { toast } from 'sonner';

const EditableText = ({ contentId, as: Component = 'p', className = '', children, ...props }) => {
  const { isEditMode, content, updateContentValue } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const editRef = useRef(null);

  const currentValue = content[contentId] || children || '';

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  const handleSave = async () => {
    if (value !== currentValue) {
      const result = await updateContentValue(contentId, value);
      if (result.success) {
        toast.success('Content updated successfully');
      } else {
        toast.error(result.message || 'Failed to update content');
        setValue(currentValue);
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && Component !== 'textarea') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setValue(currentValue);
      setIsEditing(false);
    }
  };

  if (isEditMode && !isEditing) {
    return (
      <Component
        className={`${className} cursor-pointer hover:outline hover:outline-2 hover:outline-[#D4AF37] hover:outline-offset-2 transition-all relative group`}
        onClick={() => setIsEditing(true)}
        data-testid={`editable-${contentId}`}
        {...props}
      >
        {currentValue}
        <span className="absolute -top-6 left-0 text-xs text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
          Click to edit
        </span>
      </Component>
    );
  }

  if (isEditMode && isEditing) {
    if (Component === 'textarea' || currentValue.length > 100) {
      return (
        <div className="relative">
          <textarea
            ref={editRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`${className} bg-[#151920] border-2 border-[#D4AF37] rounded-lg p-3 w-full min-h-[100px]`}
            autoFocus
            data-testid={`editing-${contentId}`}
          />
          <div className="text-xs text-[#A1A1AA] mt-1">Press Escape to cancel, click outside to save</div>
        </div>
      );
    }

    return (
      <Component
        ref={editRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${className} bg-[#151920] border-2 border-[#D4AF37] rounded px-2 outline-none`}
        data-testid={`editing-${contentId}`}
        {...props}
      >
        {value}
      </Component>
    );
  }

  return (
    <Component className={className} data-testid={contentId} {...props}>
      {currentValue}
    </Component>
  );
};

export default EditableText;
