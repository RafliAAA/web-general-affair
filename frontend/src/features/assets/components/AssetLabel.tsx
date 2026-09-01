import { forwardRef } from "react";
import type { Asset } from "../../../types/inventory";

interface Props {
  asset: Asset;
}

const AssetLabel = forwardRef<HTMLDivElement, Props>(({ asset }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white text-black flex flex-col border-2 border-black overflow-hidden"
      style={{ width: "4in", height: "2in", boxSizing: "border-box" }}
    >
      {/* 🌟 BODY LABEL */}
      <div className="flex-1 px-3 py-2 flex flex-col justify-center gap-2">
        {/* Bagian Atas: Kode Aset (SUPER BESAR) */}
        <div>
          <p className="text-[8px] text-gray-500 uppercase tracking-wide mb-0.5">
            Kode Aset
          </p>
          <p className="text-xl font-mono font-extrabold tracking-wider leading-none">
            {asset.asset_code}
          </p>
        </div>

        {/* Garis Pemisah */}
        <div className="border-t-2 border-dashed border-gray-300"></div>

        {/* Bagian Bawah: Nama Aset & SN */}
        <div>
          <p className="text-[8px] text-gray-500 uppercase tracking-wide mb-0.5">
            Nama Aset
          </p>
          <p className="text-sm font-bold leading-tight truncate uppercase">
            {asset.asset_name}
          </p>

          <p className="text-[8px] text-gray-500 uppercase tracking-wide mt-1.5 mb-0.5">
            Serial Number
          </p>
          <p className="text-[10px] font-mono text-gray-800 truncate">
            {asset.serial_number || "—"}
          </p>
        </div>
      </div>
    </div>
  );
});

export default AssetLabel;
