import { Info } from "lucide-react";

const InfoCard = () => {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
      <Info className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="text-xs space-y-1">
        <p className="font-semibold">Cara Pemesanan:</p>
        <p>1. Pilih tanggal dan ruangan di sebelah kiri.</p>
        <p>
          2. Klik slot jam yang berwarna biru (Tersedia) untuk membuat pengajuan
          baru.
        </p>
        <p>
          3. Klik slot kuning untuk membatalkan pengajuan Anda yang masih
          menunggu persetujuan.
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
