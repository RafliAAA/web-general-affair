import { Calendar, Car, LayoutDashboard, Package, Users } from "lucide-react";
import LogoSyaamil from "../../assets/LogoSyaamil.png";

const Sidebar = () => {
  return (
    <aside className="fixed w-64 h-screen border-r border-slate-300 bg-[#FFFFFF]">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-3 text-2xl border-b border-slate-300 flex items-center text-center">
          <img className="w-45 h-14 object-contain" src={LogoSyaamil} alt="" />
        </div>

        {/* Navigasi */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <ul className="space-y-1">
            <li>
              <div className="flex gap-3 items-center px-3 py-2.5 hover:bg-[#F1F5F9] hover:text-[#2194F6] hover:rounded-lg">
                <a href="/" className=" flex gap-2 items-center">
                  <LayoutDashboard className="w-5 h-5 font-medium" />
                  <h1 className="font-medium text-base ">Dashboard</h1>
                </a>
              </div>
            </li>

            <li>
              <div className="flex gap-3 items-center px-3 py-2.5 hover:bg-[#F1F5F9] hover:text-[#2194F6] hover:rounded-lg">
                <a href="/" className=" flex gap-2 items-center">
                  <Package className="w-5 h-5 font-medium" />
                  <h1 className="font-medium text-base ">Aset Perusahaan</h1>
                </a>
              </div>
            </li>
            <li>
              <div className="flex gap-3 items-center px-3 py-2.5 hover:bg-[#F1F5F9] hover:text-[#2194F6] hover:rounded-lg">
                <a href="/" className=" flex gap-2 items-center">
                  <Users className="w-5 h-5 font-medium" />
                  <h1 className="font-medium text-base ">Aset Karyawan</h1>
                </a>
              </div>
            </li>
            <li>
              <div className="flex gap-3 items-center px-3 py-2.5 hover:bg-[#F1F5F9] hover:text-[#2194F6] hover:rounded-lg">
                <a href="/" className=" flex gap-2 items-center">
                  <Car className="w-5 h-5 font-medium" />
                  <h1 className="font-medium text-base ">Kendaraan</h1>
                </a>
              </div>
            </li>
            <li>
              <div className="flex gap-3 items-center px-3 py-2.5 hover:bg-[#F1F5F9] hover:text-[#2194F6] hover:rounded-lg">
                <a href="/" className=" flex gap-2 items-center">
                  <Calendar className="w-5 h-5 font-medium" />
                  <h1 className="font-medium text-base ">Ruangan</h1>
                </a>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
