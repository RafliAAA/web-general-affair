import api from "@/lib/axios";
import { supabase } from "@/lib/supabase"; // Import supabase client

export interface ProfileData {
  user_id: string;
  email: string;
  role: string;
  profile: {
    name: string | null;
    photo: string | null;
  } | null;
}

export interface UpdateProfilePayload {
  name?: string;
  photo?: File | null;
}

export const getMyProfile = async (): Promise<ProfileData> => {
  const res = await api.get("/profile");
  return res.data.data;
};

export const updateMyProfile = async (payload: UpdateProfilePayload): Promise<ProfileData> => {
  let photoUrl: string | null | undefined = undefined;

  if (payload.photo instanceof File) {
    // Upload ke Supabase kalau tipenya File
    const file = payload.photo;
    const fileExt = file.name.split(".").pop();
    const fileName = `profile-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from("photo-profile").upload(fileName, file);
    if (error) throw error;

    const { data } = supabase.storage.from("photo-profile").getPublicUrl(fileName);
    photoUrl = data.publicUrl;
  } else if (payload.photo === null) {
    photoUrl = null;
  }

  const body: any = { name: payload.name };
  if (photoUrl !== undefined) {
    body.photo = photoUrl;
  }

  const res = await api.patch("/profile", body);
  return res.data.data;
};
