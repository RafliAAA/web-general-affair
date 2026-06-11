import { clsx, type ClassValue } from "clsx"
import { Camera, Car, Laptop,  Smartphone } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const categoryIconMap = {
  Laptop: Laptop,
  Handphone: Smartphone,
  Kamera: Camera,
  Mobil: Car,
} as const;

export const conditionVariant = (condition: string) => {
  switch (condition) {
    case "Baik":
      return "success";
    case "Cukup":
      return "outline";
    default:
      return "destructive";
  }
};
