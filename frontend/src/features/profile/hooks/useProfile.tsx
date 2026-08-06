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

  // UBAH INI: dari setUser menjadi updateUser
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

      // UBAH INI: panggil updateUser, bukan setUser
      if (updateUser) {
        updateUser(updatedData);
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
