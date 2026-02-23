
import loginBg from "@/assets/image_9511ea24.png";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
 
  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={loginBg}
          alt="Inventory workspace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/30" />
        
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-6 md:p-12">
        <RegisterForm />
      </div>
    </div>
  );
}
