import { Dialog, DialogContent } from "./ui/dialog";
import { ProfileEditor } from "./ProfileEditor";
import type { User } from "../types/User";

type ProfileEditorModalProps = {
  user: User;
  open: boolean;
  onSave: (updatedUser: User) => void;
  onClose: () => void;
};

export function ProfileEditorModal({ user, open, onSave, onClose }: ProfileEditorModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent
        className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl"
        overlayClassName="bg-black/40 backdrop-blur-sm"
      >
        <ProfileEditor
          user={user}
          onSave={(updatedUser) => {
            onSave(updatedUser);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
