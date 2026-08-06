import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import LogoSyaamil from "../../../assets/LogoSyaamil.png"; // sesuaikan path import dengan lokasi logo di project-mu

interface DisposalItem {
  disposal_item_id: string;
  asset_id: string;
  method: string;
  notes: string | null;
  asset: {
    asset_name: string;
    asset_code: string;
    asset_category?: {
      category_name: string
    } | null
  };

}

interface DisposalData {
  memo_number: string;
  memo_date: string;
  subject: string;
  description: string | null;
  to: string;
  from: string;
  cc: string | null;
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
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingBottom: 12,
  },
  logoImage: {
    width: 100,
    height: 50,
    objectFit: "contain",
    marginBottom: 10,
  },
  titleWrap: {
    alignItems: "center",
  },
  title: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: -0.5,
    color: "#09090b",
    textAlign: "center",
  },
  memoNumber: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "bold",
    color: "#09090b",
    textAlign: "center",
  },
  totalAsetLine: {
    textAlign: "right",
    color: "#71717a",
    marginBottom: 6,
  },
  memoTable: {
    borderWidth: 1,
    borderColor: "#09090b",
    marginBottom: 16,
  },
  memoRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#09090b",
  },
  memoRowLast: {
    flexDirection: "row",
  },
  memoLabel: {
    width: 90,
    padding: 6,
    fontWeight: "bold",
    color: "#09090b",
  },
  memoColon: {
    width: 12,
    padding: 6,
    fontWeight: "bold",
    color: "#09090b",
  },
  memoValue: {
    flex: 1,
    padding: 6,
    fontWeight: "bold",
    color: "#09090b",
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
  signatureDate: {
    textAlign: "left",
    color: "#27272a",
    marginTop: 24,
  },
  signatureSection: {
    flexDirection: "row",
    marginTop: 12,
  },
  signatureBox: {
    width: "45%",
    textAlign: "center",
  },
  signatureRole: {
    color: "#71717a",
    marginBottom: 40,
  },
  signatureName: {
    fontWeight: "bold",
    color: "#09090b",
    textDecoration: "underline",
    paddingTop: 8,
  },
  signatureNameRole: {
    fontWeight: "semibold",
    color: "#09090b",
  },
});

const formatSignatureDate = (dateStr: string) => {
  if (!dateStr) return "Bandung, —";
  const formatted = new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `Bandung, ${formatted}`;
};

// Master descriptions for each disposal method — only rendered when at
// least one item in the memo actually uses that method.
const METHOD_DESCRIPTIONS: Record<string, { label: string; text: string }> = {
  Jual: {
    label: "Jual",
    text: "Dilakukan melalui penawaran langsung atau lelang kepada pihak ketiga dengan prinsip transparansi dan kepatuhan terhadap regulasi.",
  },
  Hibah: {
    label: "Hibah",
    text: "Dialokasikan kepada pihak yang membutuhkan.",
  },
  Kirim: {
    label: "Kirim",
    text: "Aset yang masih layak digunakan akan dikirim ke Kantor Pusat Syaamil Qur'an di Bandung.",
  },
};

const DisposalPdf = ({ disposal }: Props) => {
  const usedMethods = new Set(
    (disposal.items ?? []).map((item) => item.method),
  );
  const activeMethodDescriptions = Object.values(METHOD_DESCRIPTIONS).filter(
    (m) => usedMethods.has(m.label),
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header — logo di kiri atas, berdiri sendiri di baris pertama;
            judul + nomor memo di baris terpisah di bawahnya, center */}
        <View style={styles.header}>
          <Image src={LogoSyaamil} style={styles.logoImage} />
          <View style={styles.titleWrap}>
            <Text style={styles.title}>INTERNAL MEMO</Text>
            <Text style={styles.memoNumber}>{disposal.memo_number}</Text>
          </View>
        </View>

        {/* TO / FROM / CC / RE */}
        <View style={styles.memoTable}>
          <View style={styles.memoRow}>
            <Text style={styles.memoLabel}>TO</Text>
            <Text style={styles.memoColon}>:</Text>
            <Text style={styles.memoValue}>{disposal.to}</Text>
          </View>
          <View style={styles.memoRow}>
            <Text style={styles.memoLabel}>FROM</Text>
            <Text style={styles.memoColon}>:</Text>
            <Text style={styles.memoValue}>{disposal.from}</Text>
          </View>
          <View style={styles.memoRow}>
            <Text style={styles.memoLabel}>CC</Text>
            <Text style={styles.memoColon}>:</Text>
            <Text style={styles.memoValue}>{disposal.cc || "—"}</Text>
          </View>
          <View style={styles.memoRowLast}>
            <Text style={styles.memoLabel}>RE</Text>
            <Text style={styles.memoColon}>:</Text>
            <Text style={styles.memoValue}>{disposal.subject}</Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          Assalamu'alaikum Warahmatullah Wabarakatuh.
        </Text>
        <Text style={styles.paragraph}>
          Alhamdulillahirabbil’alamin untuk semua nikmat yang Allah berikan.
          Shalawat dan salam semoga atas Rasulullah Muhammad SAW, teladan
          seluruh umat sepanjang zaman.
        </Text>
        <Text style={styles.paragraph}>
          Berdasarkan informasi dari {disposal.description} terhadap aset
          perusahaan, terdapat beberapa aset dengan kondisi baik dan rusak.
          Beberapa aset tidak dapat dimanfaatkan, sementara lainnya masih dapat
          digunakan untuk operasional di Holding. Terlampir daftar aset dimaksud
          :
        </Text>

        {/* Items Section */}
        <Text style={styles.sectionTitle}>Daftar Aset Yang Didisposal</Text>
        <Text style={styles.totalAsetLine}>
          Total Aset: {disposal.items?.length ?? 0} Item
        </Text>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.cellName, styles.headerCell]}>Nama Aset</Text>
            <Text style={[styles.cellCode, styles.headerCell]}>Kode</Text>
            <Text style={[styles.cellCategory, styles.headerCell]}>
              Kategori
            </Text>
            <Text style={[styles.cellMethod, styles.headerCell]}>Metode</Text>
            <Text style={[styles.cellNotes, styles.headerCell]}>Catatan</Text>
          </View>

          {/* Table Body */}
          {disposal.items && disposal.items.length > 0 ? (
            disposal.items.map((item) => (
              <View key={item.disposal_item_id} style={styles.row}>
                <Text style={styles.cellName}>{item.asset.asset_name}</Text>
                <Text style={styles.cellCode}>{item.asset.asset_code}</Text>
                <Text style={styles.cellCategory}>{item.asset.asset_category?.category_name}</Text>
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

        {/* Kalimat Kebijakan & Penjelasan Metode — hanya metode yang
            benar-benar dipakai pada daftar aset di atas yang ditampilkan */}
        {activeMethodDescriptions.length > 0 && (
          <>
            <Text style={styles.paragraph}>
              Untuk optimalisasi manajemen aset serta efisiensi biaya
              pengiriman, penyimpanan, dan perawatan, kami mengusulkan
              pelaksanaan disposal aset melalui metode berikut :
            </Text>

            <View style={styles.bulletList}>
              {activeMethodDescriptions.map((method, index) => (
                <View key={method.label} style={styles.bulletItem}>
                  <Text style={styles.bulletPrefix}>{index + 1}.</Text>
                  <Text style={styles.bulletContent}>
                    <Text style={styles.boldText}>{method.label}</Text> :{" "}
                    {method.text}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

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

        {/* Tanggal memo — ditaruh tepat di atas tanda tangan */}
        <Text style={styles.signatureDate}>
          {formatSignatureDate(disposal.memo_date)}
        </Text>

        {/* Signatures — FROM (pembuat memo) & TO (penerima/mengetahui) */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureRole}>Mengetahui,</Text>
            <Text style={styles.signatureName}>{disposal.from}</Text>
            <Text style={styles.signatureNameRole}>General Affair Manager</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureRole}>Menyetujui,</Text>
            <Text style={styles.signatureName}>{disposal.to}</Text>
            <Text style={styles.signatureNameRole}>Chief Operating Office</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default DisposalPdf;