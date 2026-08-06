import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, Upload, Trash2 } from "lucide-react";
import type {
  ProfileData,
  UpdateProfilePayload,
} from "../services/profileService";

interface ProfileFormProps {
  profile: ProfileData;
  isSubmitting: boolean;
  onSubmit: (payload: UpdateProfilePayload) => Promise<void>;
}

const ProfileForm = ({ profile, isSubmitting, onSubmit }: ProfileFormProps) => {
  const [name, setName] = useState(profile.profile?.name || "");

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    profile.profile?.photo || null,
  );
  const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateProfilePayload = { name };

    if (photoFile) {
      payload.photo = photoFile;
    } else if (isPhotoRemoved) {
      payload.photo = null;
    }

    await onSubmit(payload);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setIsPhotoRemoved(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsPhotoRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "U";
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Informasi Dasar</CardTitle>
        <CardDescription>
          Perbarui foto profil dan nama lengkap Anda di sini.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
          {/* KIRI: Preview Foto & Upload Button */}
          <div className="flex flex-col items-center gap-4 md:col-span-1">
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden ring-2 ring-border shadow-sm bg-muted flex items-center justify-center group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Foto Profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-semibold text-muted-foreground/80">
                  {getInitials(name)}
                </span>
              )}

              {/* Overlay Camera saat di-hover */}
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Ubah</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Tombol Pilih Foto & Hapus (Sejajar Horizontal) */}
            <div className="flex items-center gap-2 w-full max-w-50">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" />
                Pilih Foto
              </Button>
              {photoPreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRemovePhoto}
                  className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
                  title="Hapus Foto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center max-w-50">
              Format: JPG atau PNG. Maksimal 2MB.
            </p>
          </div>

          {/* KANAN: Input Detail */}
          <div className="space-y-5 md:col-span-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nama Lengkap
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted/40 cursor-not-allowed text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Email tidak dapat diubah.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-30"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
