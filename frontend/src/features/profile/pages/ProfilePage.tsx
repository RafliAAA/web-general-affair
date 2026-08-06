import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useProfile } from "../hooks/useProfile";
import ProfileForm from "../components/ProfileForm";
// Import tipe data dari service
import type { UpdateProfilePayload } from "../services/profileService";

const ProfilePage = () => {
  const { profile, loading, isSubmitting, updateProfile } = useProfile();

  const handleUpdate = async (payload: UpdateProfilePayload) => {
    try {
      await updateProfile(payload);
      toast.success("Profile berhasil diperbarui!");
    } catch (error) {
      toast.error("Gagal memperbarui profile");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Gagal memuat data profile.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium">Profile Saya</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola informasi akun Anda di sini.
        </p>
      </div>

      <ProfileForm
        profile={profile}
        isSubmitting={isSubmitting}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default ProfilePage;
