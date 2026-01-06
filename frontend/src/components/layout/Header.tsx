import { Menu, Bell } from "lucide-react";
import LogoSyaamil from "../../assets/LogoSyaamil.png";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

const Header = ({ toggleSidebar, title }: HeaderProps) => {
  return (
    <header className="sticky top-0 flex items-center border-b bg-primary-foreground p-3">
      <div className="flex items-center h-10 px-3 py-3 justify-between w-full">
        <div className="flex gap-3 items-center">
          <Button
            variant="ghost"
            onClick={toggleSidebar} 
            className="hover:bg-[#F1F5F9] cursor-pointer p-2 rounded lg:hidden"
          >
            <Menu className="w-4 h-4 font-medium" />
          </Button>
          <div className="text-xl font-medium">{title}</div>
        </div>

        <div className="flex gap-3 items-center">
          <button className="relative hover:bg-[#F1F5F9] cursor-pointer p-1 rounded">
            <Bell className="w-4.5 h-full font-medium" />
            <Badge
              variant="destructive"
              className="absolute right-1 top-0 w-3 h-3 rounded-full p-0"
            >
              <h1 className="text-[10px]">1</h1>
            </Badge>
          </button>
          <div className="flex items-center gap-2 hover:bg-[#F1F5F9] rounded p-2">
            <img
              className="rounded-xl border h-5 w-5 object-contain"
              src={LogoSyaamil}
              alt="Logo"
            />
            <h1 className="text-xs font-medium">Hi, Admin</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
