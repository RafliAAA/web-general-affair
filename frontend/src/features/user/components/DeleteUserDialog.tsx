import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { User } from "../services/userService";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  user: User | null;
  isDeleting: boolean;
}

const DeleteUserDialog = ({
  open,
  onClose,
  onConfirm,
  user,
  isDeleting,
}: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus user ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus user{" "}
            <strong>{user?.profile?.name || user?.email}</strong>? Tindakan ini
            tidak dapat dibatalkan. User yang memiliki riwayat transaksi tidak
            dapat dihapus.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
