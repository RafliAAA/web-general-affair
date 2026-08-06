import profileRepository from "./profile.repository";
import { UpdateProfileDTO } from "./profile.dto";

const getMyProfile = async (user_id: string) => {
  const result = await profileRepository.getProfileByUserId(user_id);
  if (!result) throw new Error("User profile not found");
  return result;
};

const updateMyProfile = async (user_id: string, data: UpdateProfileDTO) => {
  const result = await profileRepository.updateProfile(user_id, data);
  if (!result) throw new Error("Failed to update profile");
  return result;
};

export default {
  getMyProfile,
  updateMyProfile,
};
