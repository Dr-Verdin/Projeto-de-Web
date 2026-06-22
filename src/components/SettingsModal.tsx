import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { SettingsView } from "./SettingsView";
import { DeleteConfirmView } from "./DeleteConfirmView";
import type { User } from "../types/User";

type SettingsModalProps = {
  user: User;
  open: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
  onDeleteProfile: () => void;
};

export function SettingsModal({ user, open, onClose, onSave, onDeleteProfile }: SettingsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (updatedUser: User) => {
    setIsSaving(true);
    try {
      await onSave(updatedUser);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) { setShowDeleteConfirm(false); onClose(); } }}>
      {/* max-w-3xl define uma largura ideal padrão do Tailwind, sem travar valores manuais */}
      <DialogContent className="sm:max-w-3xl w-full rounded-3xl border-none bg-white shadow-2xl overflow-hidden max-h-[90vh] p-0">
        
        {showDeleteConfirm ? (
          <DeleteConfirmView 
            onCancel={() => setShowDeleteConfirm(false)} 
            onConfirm={() => { onDeleteProfile(); onClose(); }} 
          />
        ) : (
          <SettingsView 
            user={user} 
            isSaving={isSaving}
            onSave={handleSave} 
            onDeleteClick={() => setShowDeleteConfirm(true)} 
          />
        )}
        
      </DialogContent>
    </Dialog>
  );
}