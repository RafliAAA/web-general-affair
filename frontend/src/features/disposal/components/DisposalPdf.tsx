import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface DisposalItem {
  disposal_item_id: string;
  asset_id: string;
  method: string;
  notes: string | null;
  asset: {
    asset_name: string;
    asset_code: string;
    asset_type: string;
  };
}

interface DisposalData {
  memo_number: string;
  memo_date: string;
  subject: string;
  description: string | null;
  items?: DisposalItem[];
}

interface Props {
  disposal: DisposalData;
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 45,
    paddingVertical: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#09090b",
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingBottom: 12,
  },
  metaLabel: {
    fontSize: 9,
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: -0.5,
    color: "#09090b",
  },
  infoGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#fafafa",
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 2,
  },
  infoCellLabel: {
    width: 80,
    color: "#71717a",
  },
  infoCellValue: {
    flex: 1,
    color: "#18181b",
    fontWeight: "bold",
  },
  descText: {
    color: "#27272a",
    lineHeight: 1.4,
  },
  paragraph: {
    lineHeight: 0.6,
    color: "#27272a",
    marginBottom: 6,
    textAlign: "justify",
  },
  bulletList: {
    paddingLeft: 12,
    marginBottom: 6,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 4,
    lineHeight: 0.6,
    color: "#27272a",
  },
  bulletPrefix: {
    width: 15,
  },
  bulletContent: {
    flex: 1,
  },
  boldText: {
    fontWeight: "bold",
    color: "#09090b",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#09090b",
    marginTop: 8,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  table: {
    width: "100%",
    marginTop: 4,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: "#09090b",
    paddingBottom: 5,
    marginBottom: 3,
  },
  headerCell: {
    color: "#71717a",
    fontWeight: "bold",
    fontSize: 8,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    paddingVertical: 6,
    alignItems: "center",
  },
  cellName: { width: "25%", paddingRight: 6, fontWeight: "bold" },
  cellCode: { width: "20%", paddingRight: 6, color: "#52525b" },
  cellCategory: { width: "18%", paddingRight: 6 },
  cellMethod: { width: "15%", paddingRight: 6 },
  cellNotes: { width: "22%", color: "#71717a" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 45,
    right: 45,
    textAlign: "center",
    color: "#a1a1aa",
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 12,
  },
});

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const DisposalPdf = ({ disposal }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.metaLabel}>INTERNAL MEMORANDUM DISPOSAL ASET</Text>
        <Text style={styles.title}>{disposal.subject}</Text>
      </View>

      {/* Info Grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoCellLabel}>Nomor Memo</Text>
            <Text style={styles.infoCellValue}>: {disposal.memo_number}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoCellLabel}>Tanggal Memo</Text>
            <Text style={styles.infoCellValue}>
              : {formatDate(disposal.memo_date)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoCellLabel}>Total Aset</Text>
            <Text style={styles.infoCellValue}>
              : {disposal.items?.length ?? 0} Item
            </Text>
          </View>
        </View>

      
      </View>

      {/* Kalimat Pembuka & Pengantar Surat */}
      <Text style={styles.paragraph}>
        Assalamu'alaikum Warahmatullah Wabarakatuh.
      </Text>
      <Text style={styles.paragraph}>
        Alhamdulillahirabbil’alamin untuk semua nikmat yang Allah berikan.
        Shalawat dan salam semoga atas Rasulullah Muhammad SAW, teladan seluruh
        umat sepanjang zaman.
      </Text>
      <Text style={styles.paragraph}>
        Berdasarkan informasi dari Mitra SDI Makassar terhadap aset perusahaan,
        terdapat beberapa aset dengan kondisi baik dan rusak. Beberapa aset
        tidak dapat dimanfaatkan, sementara lainnya masih dapat digunakan untuk
        operasional di Holding. Terlampir daftar aset dimaksud :
      </Text>

      {/* Items Section */}
      <Text style={styles.sectionTitle}>Daftar Aset Yang Didisposal</Text>

      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.cellName, styles.headerCell]}>Nama Aset</Text>
          <Text style={[styles.cellCode, styles.headerCell]}>Kode</Text>
          <Text style={[styles.cellCategory, styles.headerCell]}>Kategori</Text>
          <Text style={[styles.cellMethod, styles.headerCell]}>Metode</Text>
          <Text style={[styles.cellNotes, styles.headerCell]}>Catatan</Text>
        </View>

        {/* Table Body */}
        {disposal.items && disposal.items.length > 0 ? (
          disposal.items.map((item) => (
            <View key={item.disposal_item_id} style={styles.row}>
              <Text style={styles.cellName}>{item.asset.asset_name}</Text>
              <Text style={styles.cellCode}>{item.asset.asset_code}</Text>
              <Text style={styles.cellCategory}>{item.asset.asset_type}</Text>
              <Text style={styles.cellMethod}>{item.method}</Text>
              <Text style={styles.cellNotes}>{item.notes || "—"}</Text>
            </View>
          ))
        ) : (
          <View style={{ paddingVertical: 16, textAlign: "center" }}>
            <Text style={{ color: "#71717a" }}>
              Belum ada data aset didalam berkas ini.
            </Text>
          </View>
        )}
      </View>

      {/* Kalimat Kebijakan & Penjelasan Metode */}
      <Text style={styles.paragraph}>
        Untuk optimalisasi manajemen aset serta efisiensi biaya pengiriman,
        penyimpanan, dan perawatan, kami mengusulkan pelaksanaan disposal aset
        melalui tiga metode berikut :
      </Text>

      <View style={styles.bulletList}>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletPrefix}>1.</Text>
          <Text style={styles.bulletContent}>
            <Text style={styles.boldText}>Jual</Text> : Dilakukan melalui
            penawaran langsung atau lelang kepada pihak ketiga dengan prinsip
            transparansi dan kepatuhan terhadap regulasi.
          </Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletPrefix}>2.</Text>
          <Text style={styles.bulletContent}>
            <Text style={styles.boldText}>Hibah</Text> : Dialokasikan kepada
            pihak yang membutuhkan.
          </Text>
        </View>
        <View style={styles.bulletItem}>
          <Text style={styles.bulletPrefix}>3.</Text>
          <Text style={styles.bulletContent}>
            <Text style={styles.boldText}>Kirim</Text> : Aset yang masih layak
            digunakan akan dikirim ke Kantor Pusat Syaamil Qur'an di Bandung.
          </Text>
        </View>
      </View>

      {/* Kalimat Penutup Surat */}
      <Text style={styles.paragraph}>
        Demikian IM ini dibuat untuk diketahui dan dilaksanakan sebagaimana
        mestinya, apabila di kemudian hari ada kekeliruan maka akan dilakukan
        perbaikan seperlunya. Atas perhatian Bapak/Ibu kami ucapkan terima
        kasih.
      </Text>
      <Text style={styles.paragraph}>
        Wassalamu'alaikum Warahmatullah Wabarakatuh.
      </Text>

      {/* Footer */}
      <Text style={styles.footer}>
        Dokumen ini dibuat otomatis melalui Sistem Manajemen Aset & Disposal
        Perusahaan.
      </Text>
    </Page>
  </Document>
);

export default DisposalPdf;
