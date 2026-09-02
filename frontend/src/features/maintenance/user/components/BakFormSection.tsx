import { useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import {
  FileText,
  Download,
  Eye,
  Save,
  CheckCircle2,
  FileUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// 🌟 IMPORT LOGO (Sesuaikan path relatifnya dengan struktur folder Anda)
import LogoSyaamil from "../../../../assets/LogoSyaamil.png";

interface Props {
  maintenance: any;
  onUpdate: (data: any) => void;
  isReadOnly?: boolean; // 🌟 Prop untuk mode Admin (Read-Only)
}

// 🌟 STYLING UNTUK PDF (Gaya Shadcn: Minimalis, Hitam Putih, Clean)
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#0f172a",
    lineHeight: 1.6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "1px solid #e2e8f0",
  },
  logo: {
    width: 120,
    height: 120,
    objectFit: "contain",
  },
  headerTitle: {
    textAlign: "right",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#000000",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#64748b",
    marginBottom: 10,
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: 140,
    color: "#64748b",
    fontSize: 10,
  },
  value: {
    flex: 1,
    fontWeight: "medium",
    fontSize: 11,
    color: "#0f172a",
  },
  paragraph: {
    textAlign: "justify",
    marginBottom: 12,
    color: "#334155",
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
  },
  signatureCol: {
    width: "30%",
    textAlign: "center",
  },
  signatureName: {
    marginTop: 40,
    fontWeight: "bold",
    fontSize: 10,
    borderTop: "1px solid #000000",
    paddingTop: 6,
  },
});

const BakFormSection = ({ maintenance, onUpdate, isReadOnly = false }: Props) => {
  const [formData, setFormData] = useState({
    bak_incident_date: maintenance?.bak_incident_date
      ? maintenance.bak_incident_date.split("T")[0]
      : "",
    bak_location: maintenance?.bak_location || "",
    bak_chronology: maintenance?.bak_chronology || "",
    bak_cause: maintenance?.bak_cause || "",
    bak_action: maintenance?.bak_action || "",
    bak_witness_1: maintenance?.bak_witness_1 || "",
    bak_witness_2: maintenance?.bak_witness_2 || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);

  const handleChange = (field: string, value: string) => {
    if (isReadOnly) return; // Mencegah perubahan jika read-only
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveBak = async () => {
    if (isReadOnly) return;
    setIsSaving(true);
    try {
      const res = await api.patch(
        `/maintenance/${maintenance.maintenance_id}/bak-data`,
        formData,
      );
      onUpdate(res.data.data);
      toast.success("Data BAK berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan data BAK");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadSigned = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `bak-${maintenance.maintenance_id}.${fileExt}`;

      const { error } = await supabase.storage
        .from("Berita-acara-kejadian")
        .upload(fileName, file, { 
          cacheControl: "3600", 
          upsert: true 
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("Berita-acara-kejadian")
        .getPublicUrl(fileName);

      const fileUrl = publicUrlData.publicUrl;

      await api.patch(`/maintenance/${maintenance.maintenance_id}/upload-bak`, {
        url: fileUrl,
      });
      
      onUpdate({ ...maintenance, signed_bak_url: fileUrl });
      toast.success("File berhasil diperbarui di Supabase!");
      setIsReplacing(false);
    } catch (error: any) {
      toast.error(error.message || "Gagal upload file");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = ""; 
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="border-b bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
              Berita Acara Kejadian (BAK)
            </CardTitle>
            <CardDescription className="mt-1 text-slate-500">
              {isReadOnly 
                ? "Dokumen BAK yang dibuat oleh karyawan." 
                : "Isi data kejadian dengan benar untuk dijadikan dokumen resmi."}
            </CardDescription>
          </div>
          {maintenance.bak_number && (
            <span className="text-xs font-mono bg-white px-3 py-1 rounded-md border border-slate-200 text-slate-600 shadow-sm">
              {maintenance.bak_number}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="bak_incident_date" className="text-slate-600">
              Tanggal Kejadian
            </Label>
            <Input
              id="bak_incident_date"
              type="date"
              disabled={isReadOnly}
              value={formData.bak_incident_date}
              onChange={(e) => handleChange("bak_incident_date", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bak_location" className="text-slate-600">
              Lokasi Kejadian
            </Label>
            <Input
              id="bak_location"
              placeholder="Contoh: Ruang Server Lt. 2"
              disabled={isReadOnly}
              value={formData.bak_location}
              onChange={(e) => handleChange("bak_location", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bak_chronology" className="text-slate-600">
            Kronologi Kejadian
          </Label>
          <Textarea
            id="bak_chronology"
            placeholder="Jelaskan kronologi kejadian secara detail..."
            rows={3}
            disabled={isReadOnly}
            value={formData.bak_chronology}
            onChange={(e) => handleChange("bak_chronology", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="bak_cause" className="text-slate-600">
              Penyebab Kerusakan
            </Label>
            <Input
              id="bak_cause"
              placeholder="Contoh: Terkena air hujan"
              disabled={isReadOnly}
              value={formData.bak_cause}
              onChange={(e) => handleChange("bak_cause", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bak_action" className="text-slate-600">
              Tindakan yang Diambil
            </Label>
            <Input
              id="bak_action"
              placeholder="Contoh: Diamkan sementara"
              disabled={isReadOnly}
              value={formData.bak_action}
              onChange={(e) => handleChange("bak_action", e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="bak_witness_1" className="text-slate-600">
              Nama Saksi I
            </Label>
            <Input
              id="bak_witness_1"
              placeholder="Nama lengkap saksi 1"
              disabled={isReadOnly}
              value={formData.bak_witness_1}
              onChange={(e) => handleChange("bak_witness_1", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bak_witness_2" className="text-slate-600">
              Nama Saksi II
            </Label>
            <Input
              id="bak_witness_2"
              placeholder="Nama lengkap saksi 2"
              disabled={isReadOnly}
              value={formData.bak_witness_2}
              onChange={(e) => handleChange("bak_witness_2", e.target.value)}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-4 border-t bg-slate-50/50 py-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Tombol Simpan hanya muncul untuk User (bukan Read-Only) */}
          {!isReadOnly && (
            <Button
              onClick={handleSaveBak}
              disabled={isSaving}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Menyimpan..." : "Simpan Data BAK"}
            </Button>
          )}

          {maintenance.bak_number && (
            <Button variant="secondary" className={isReadOnly ? "w-full" : "flex-1"} asChild>
              <PDFDownloadLink
                document={
                  <Document>
                    <Page size="A4" style={styles.page}>
                      <View style={styles.header}>
                        <Image style={styles.logo} src={LogoSyaamil} />
                        <View style={styles.headerTitle}>
                          <Text style={styles.title}>
                            Berita Acara Kejadian
                          </Text>
                          <Text style={styles.subtitle}>
                            Nomor: {maintenance.bak_number || "-"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                          Keterangan Pihak & Aset
                        </Text>
                        <View style={styles.row}>
                          <Text style={styles.label}>Hari / Tanggal</Text>
                          <Text style={styles.value}>
                            : {formatDate(formData.bak_incident_date)}
                          </Text>
                        </View>
                        <View style={styles.row}>
                          <Text style={styles.label}>Lokasi Kejadian</Text>
                          <Text style={styles.value}>
                            : {formData.bak_location || "-"}
                          </Text>
                        </View>
                        <View style={styles.row}>
                          <Text style={styles.label}>Nama Pelapor</Text>
                          <Text style={styles.value}>
                            : {maintenance.reporter?.profile?.name || "-"}
                          </Text>
                        </View>
                        <View style={styles.row}>
                          <Text style={styles.label}>Nama Aset</Text>
                          <Text style={styles.value}>
                            : {maintenance.asset?.asset_name || "-"}
                          </Text>
                        </View>
                        <View style={styles.row}>
                          <Text style={styles.label}>Kode Aset</Text>
                          <Text style={styles.value}>
                            : {maintenance.asset?.asset_code || "-"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Uraian Kejadian</Text>
                        <Text style={styles.paragraph}>
                          {formData.bak_chronology || "-"}
                        </Text>

                        <Text style={{ ...styles.sectionTitle, marginTop: 10 }}>
                          Penyebab Kerusakan
                        </Text>
                        <Text style={styles.paragraph}>
                          {formData.bak_cause || "-"}
                        </Text>

                        <Text style={{ ...styles.sectionTitle, marginTop: 10 }}>
                          Tindakan yang Diambil
                        </Text>
                        <Text style={styles.paragraph}>
                          {formData.bak_action || "-"}
                        </Text>
                      </View>

                      <Text
                        style={{
                          marginTop: 10,
                          textAlign: "justify",
                          fontSize: 10,
                          color: "#64748b",
                        }}
                      >
                        Demikian berita acara ini dibuat dengan sebenarnya untuk
                        dapat dipergunakan sebagaimana mestinya.
                      </Text>

                      <View style={styles.signatureRow}>
                        <View style={styles.signatureCol}>
                          <Text>Dibuat oleh,</Text>
                          <Text style={styles.signatureName}>
                            {maintenance.reporter?.profile?.name || ".................."}
                          </Text>
                        </View>
                        <View style={styles.signatureCol}>
                          <Text>Saksi I,</Text>
                          <Text style={styles.signatureName}>
                            {formData.bak_witness_1 || ".................."}
                          </Text>
                        </View>
                        <View style={styles.signatureCol}>
                          <Text>Saksi II,</Text>
                          <Text style={styles.signatureName}>
                            {formData.bak_witness_2 || ".................."}
                          </Text>
                        </View>
                      </View>
                    </Page>
                  </Document>
                }
                fileName={`${maintenance.bak_number || "BAK"}.pdf`}
              >
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </PDFDownloadLink>
            </Button>
          )}
        </div>

        {maintenance.bak_number && (
          <>
            <Separator />

            {maintenance.signed_bak_url && !isReplacing ? (
              <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertTitle className="text-emerald-900">
                  BAK Sudah Ditandatangani
                </AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span className="text-emerald-700">
                    File scan telah diunggah ke sistem.
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-slate-50"
                      asChild
                    >
                      <a
                        href={maintenance.signed_bak_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Eye className="h-4 w-4 mr-2" /> Lihat File
                      </a>
                    </Button>
                    {!isReadOnly && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-slate-50"
                        onClick={() => setIsReplacing(true)}
                      >
                        <FileUp className="h-4 w-4 mr-2" /> Ganti File
                      </Button>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ) : !isReadOnly ? (
              <div className="space-y-2 rounded-lg border border-dashed border-slate-300 p-4 bg-white">
                <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FileUp className="h-4 w-4 text-slate-500" />
                  {maintenance.signed_bak_url ? "Unggah Ulang Hasil Scan" : "Unggah Hasil Scan Tanda Tangan"}
                </Label>
                <p className="text-xs text-slate-500">
                  1. Download PDF di atas.<br />
                  2. Cetak dan tandatangani secara basah oleh Pelapor dan kedua Saksi.<br />
                  3. Scan file tersebut dan unggah hasilnya di sini:
                </p>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleUploadSigned}
                    disabled={isUploading}
                    className="bg-white"
                  />
                  {maintenance.signed_bak_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsReplacing(false)}
                      disabled={isUploading}
                    >
                      Batal
                    </Button>
                  )}
                </div>
                {isUploading && (
                  <p className="text-xs text-slate-500 mt-1">Mengunggah...</p>
                )}
              </div>
            ) : (
              <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                <FileUp className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-900">Menunggu Upload BAK</AlertTitle>
                <AlertDescription>
                  Menunggu karyawan mengunggah hasil scan tanda tangan basah.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default BakFormSection;