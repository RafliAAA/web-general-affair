import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { getProcurementById } from "../services/ProcurementService";
import ProcurementPDF from "../components/ProcurementPDF";
import type { Procurement } from "../../../types/procurement";
import { createElement } from "react";

export const useProcurementDetail = (id: string | undefined) => {
  const [procurement, setProcurement] = useState<Procurement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // 1. BUAT FUNGSI INI AGAR BISA DIPANGGIL UNTUK REFRESH DATA
  const fetchProcurement = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getProcurementById(id);
      setProcurement(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. PANGGIL SAAT PERTAMA KALI HALAMAN DIBUKA
  useEffect(() => {
    fetchProcurement();
  }, [id]);

  const handleUpdate = (updated: Procurement) => {
    setProcurement(updated);
  };

  const handleExport = async () => {
    if (!procurement) return;
    try {
      setExporting(true);

      const blob = await pdf(
        createElement(ProcurementPDF, { procurement }),
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${procurement.pr_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export PDF", err);
    } finally {
      setExporting(false);
    }
  };

  // 3. KEMBALIKAN fetchProcurement DI SINI
  return {
    procurement,
    loading,
    error,
    exporting,
    handleUpdate,
    handleExport,
    fetchProcurement,
  };
};
