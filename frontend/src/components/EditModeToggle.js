import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { useEdit } from '../context/EditContext';
import { toast } from 'sonner';

const EditModeToggle = () => {
  const { isEditMode, logout } = useEdit();

  if (!isEditMode) {
    return null;
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => {
        logout();
        toast.info('Edit mode disabled');
      }}
      className="fixed bottom-6 right-6 z-40 bg-[#D4AF37] text-[#0B0F14] px-4 py-3 rounded-full font-semibold shadow-xl hover:bg-[#F5C542] transition-colors flex items-center gap-2"
      data-testid="edit-mode-exit-btn"
      type="button"
    >
      <Save className="w-4 h-4" />
      Exit Edit Mode
    </motion.button>
  );
};

export default EditModeToggle;
