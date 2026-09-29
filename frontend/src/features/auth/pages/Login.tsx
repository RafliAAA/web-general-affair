import loginBg from "@/assets/logo-syaamil.jpg";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Bagian Kiri - Gambar & Branding */}
      <div className="relative hidden lg:flex flex-col bg-muted">
        <img
          src={loginBg}
          alt="Inventory workspace"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5]"
        />
        {/* Gradient Overlay agar gambar tidak menyilaukan dan teks terbaca */}
        <div className="absolute inset-0 bg-linear-10 from-black/50 via-black/30 to-transparent" />

        {/* Konten di atas gambar (Branding) */}
        <div className="relative z-20 flex  h-full flex-col justify-end p-12 text-white">
          {/* 🌟 Jika ada logo, taruh di sini (justify-start atau pakai absolute top-12) */}
          {/* <img src={LogoSyaamil} alt="Logo" className="h-10 w-auto mb-6 brightness-0 invert" /> */}
        </div>
      </div>

      {/* Bagian Kanan - Form Login */}
      <div className="flex min-h-screen items-center justify-center bg-background p-6 md:p-12">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo untuk tampilan mobile (di atas form) */}
          <div className="flex justify-center mb-8 lg:hidden">
            {/* Ganti dengan logo Anda jika ada */}
            <p className="text-2xl font-bold text-primary">Syaamil</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
