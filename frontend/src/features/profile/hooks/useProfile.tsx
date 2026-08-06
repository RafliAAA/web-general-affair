import { useState, useEffect } from "react";
import {
  getMyProfile,
  updateMyProfile,
  type ProfileData,
  type UpdateProfilePayload,
} from "../services/profileService";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateUser = useAuthStore((state) => state.updateUser);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
    } catch (error) {
      console.error("Gagal mengambil profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

   const updateProfile = async (payload: UpdateProfilePayload) => {
    try {
      setIsSubmitting(true);
      const updatedData = await updateMyProfile(payload);
      setProfile(updatedData);

      if (updateUser && updatedData) {
        updateUser({
          id: updatedData.user_id, 
          email: updatedData.email,
          name: updatedData.profile?.name || "", 
          profile: {
            name: updatedData.profile?.name || null,
            photo: updatedData.profile?.photo || null,
          },
        });
      }

      return updatedData;
    } catch (error) {
      console.error("Gagal update profile:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { profile, loading, isSubmitting, updateProfile };
};
