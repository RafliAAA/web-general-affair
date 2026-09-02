import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// 🌟 PERBAIKAN INTERFACE: Hanya menerima maintenance dan formData
interface Props {
  maintenance: any;
  formData: any;
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica", lineHeight: 1.5 },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1px solid #ccc",
    paddingBottom: 10,
  },
  row: { flexDirection: "row", marginBottom: 5 },
  label: { width: 120, fontWeight: "bold" },
  value: { flex: 1 },
  sectionTitle: { marginTop: 15, marginBottom: 5, fontWeight: "bold" },
  paragraph: { textAlign: "justify", marginBottom: 10 },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
  },
  signatureCol: { width: "30%", textAlign: "center" },
  signatureName: { marginTop: 40, fontWeight: "bold" },
});

const BakPdfDocument = ({ maintenance, formData }: Props) => {
  // 🌟 PENGAMAN: Jika data belum terload, jangan langsung baca propertinya
  const safeMaintenance = maintenance || {};
  const safeForm = formData || {};

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
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>BERITA ACARA KEJADIAN (BAK)</Text>

        <View style={styles.header}>
          <View style={styles.row}>
            <Text style={styles.label}>Nomor BAK:</Text>
            <Text style={styles.value}>
              {safeMaintenance.bak_number || "-"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Hari / Tanggal:</Text>
            <Text style={styles.value}>
              {formatDate(safeForm.bak_incident_date)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lokasi Kejadian:</Text>
            <Text style={styles.value}>{safeForm.bak_location || "-"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Yang Membuat Berita Acara:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nama Pelapor:</Text>
          <Text style={styles.value}>
            {safeMaintenance.reporter?.profile?.name || "-"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Aset Terkait:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nama Aset:</Text>
          <Text style={styles.value}>
            {safeMaintenance.asset?.asset_name || "-"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kode Aset:</Text>
          <Text style={styles.value}>
            {safeMaintenance.asset?.asset_code || "-"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Kronologi Kejadian:</Text>
        <Text style={styles.paragraph}>{safeForm.bak_chronology || "-"}</Text>

        <Text style={styles.sectionTitle}>Penyebab Kerusakan:</Text>
        <Text style={styles.paragraph}>{safeForm.bak_cause || "-"}</Text>

        <Text style={styles.sectionTitle}>Tindakan yang Diambil:</Text>
        <Text style={styles.paragraph}>{safeForm.bak_action || "-"}</Text>

        <Text style={{ marginTop: 20, textAlign: "justify" }}>
          Demikian berita acara ini dibuat dengan sebenarnya untuk dapat
          dipergunakan sebagaimana mestinya.
        </Text>

        <View style={styles.signatureRow}>
          <View style={styles.signatureCol}>
            <Text>Dibuat oleh,</Text>
            <Text style={styles.signatureName}>
              {safeMaintenance.reporter?.profile?.name ||
                "...................."}
            </Text>
          </View>
          <View style={styles.signatureCol}>
            <Text>Saksi I,</Text>
            <Text style={styles.signatureName}>
              {safeForm.bak_witness_1 || "...................."}
            </Text>
          </View>
          <View style={styles.signatureCol}>
            <Text>Saksi II,</Text>
            <Text style={styles.signatureName}>
              {safeForm.bak_witness_2 || "...................."}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BakPdfDocument;
