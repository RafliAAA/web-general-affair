import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Asset } from "@/types/inventory";
import LogoSyaamil from "../../../assets/LogoSyaamil.png";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#000000",
  },

  // KOP SURAT (1 Kolom Vertikal)
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    paddingBottom: 12,
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 70,
    objectFit: "contain",
    marginBottom: 2
  },
  headerText: {
    flexDirection: "column",
    alignItems: "center",
    marginTop:-10
  },
  company: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  companySub: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
  },
  companyAddress: {
    fontSize: 9,
    marginTop: 4,
    color: "#333333",
    textAlign: "center",
  },

  // JUDUL SURAT
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },

  // NARASI / TEKS PENGANTAR
  introText: {
    fontSize: 10,
    textAlign: "justify",
    marginBottom: 16,
    lineHeight: 1.5,
  },

  // TABEL (Gaya Shadcn UI)
  table: {
    width: "100%",
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f4f4f5",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    fontWeight: "bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    fontSize: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    alignItems: "center",
  },
  cell: {
    padding: 8,
  },

  // Lebar Kolom (Total 100%)
  cellNo: { width: "5%" },
  cellCode: { width: "15%" },
  cellName: { width: "20%", fontWeight: "bold" },
  cellCategory: { width: "15%" },
  cellUser: { width: "20%" },
  cellCondition: { width: "12%" },
  cellStatus: { width: "13%" },

  // TANDA TANGAN
  signatureContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signatureBlock: {
    width: "40%",
    textAlign: "center",
  },
  signatureText: {
    fontSize: 10,
    marginBottom: 40,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: "bold",
    textDecoration: "underline",
  },
});

interface Props {
  assets: Asset[];
}

const getCurrentUser = (asset: Asset): string => {
  if (asset.borrow && asset.borrow.length > 0) {
    const activeBorrow = asset.borrow[0];
    return activeBorrow.user?.profile?.name ?? "—";
  }

  if (asset.handoverItems && asset.handoverItems.length > 0) {
    const activeHandover = asset.handoverItems[0];
    return activeHandover.handover?.receiver?.profile?.name ?? "—";
  }

  return "—";
};

const AssetsPdf = ({ assets }: Props) => {
  const totalAsset = assets.length;
  const availableAsset = assets.filter((a) => a.status === "Tersedia").length;
  const borrowedAsset = assets.filter((a) => a.status === "Dipinjam").length;
  const maintenanceAsset = assets.filter(
    (a) => a.status === "Diperbaiki",
  ).length;

  const today = format(new Date(), "dd MMMM yyyy", { locale: id });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* KOP SURAT (Vertikal) */}
        <View style={styles.headerContainer}>
          <Image style={styles.logo} src={LogoSyaamil} />

          <View style={styles.headerText}>
            <Text style={styles.company}>SYAAMIL GROUP</Text>
            <Text style={styles.companySub}>GENERAL AFFAIR</Text>
            <Text style={styles.companyAddress}>
              Jl. Babakan Sari No.71, Babakan Sari, Kec. Kiaracondong, Kota
              Bandung, Jawa Barat 40283
            </Text>
          </View>
        </View>

        {/* JUDUL SURAT */}
        <Text style={styles.title}>Laporan Data Aset Perusahaan</Text>

        {/* NARASI PENGANTAR */}
        <Text style={styles.introText}>
          Berdasarkan data yang ada pada sistem manajemen aset per tanggal{" "}
          {today}, terdapat sebanyak {totalAsset} total aset yang terdaftar.
          Rincian status aset tersebut meliputi {availableAsset} aset dalam
          status tersedia, {borrowedAsset} aset sedang dipinjam, dan{" "}
          {maintenanceAsset} aset dalam masa perbaikan. Berikut adalah daftar
          lengkap aset perusahaan:
        </Text>

        {/* TABEL ASET */}
        <View style={styles.table}>
          {/* Header Tabel */}
          <View style={styles.tableHeader}>
            <View style={[styles.cell, styles.cellNo]}>
              <Text>No</Text>
            </View>
            <View style={[styles.cell, styles.cellCode]}>
              <Text>Kode Aset</Text>
            </View>
            <View style={[styles.cell, styles.cellName]}>
              <Text>Nama Aset</Text>
            </View>
            <View style={[styles.cell, styles.cellCategory]}>
              <Text>Kategori</Text>
            </View>
            <View style={[styles.cell, styles.cellUser]}>
              <Text>Pengguna Saat Ini</Text>
            </View>
            <View style={[styles.cell, styles.cellCondition]}>
              <Text>Kondisi</Text>
            </View>
            <View style={[styles.cell, styles.cellStatus]}>
              <Text>Status</Text>
            </View>
          </View>

          {/* Body Tabel */}
          {assets.map((asset, index) => (
            <View
              key={asset.asset_id}
              style={styles.tableRow}
              break={index > 0 && index % 25 === 0}
            >
              <View style={[styles.cell, styles.cellNo]}>
                <Text>{index + 1}</Text>
              </View>
              <View style={[styles.cell, styles.cellCode]}>
                <Text>{asset.asset_code}</Text>
              </View>
              <View style={[styles.cell, styles.cellName]}>
                <Text>{asset.asset_name}</Text>
              </View>
              <View style={[styles.cell, styles.cellCategory]}>
                <Text>{asset.asset_category?.category_name ?? "—"}</Text>
              </View>
              <View style={[styles.cell, styles.cellUser]}>
                <Text>{getCurrentUser(asset)}</Text>
              </View>
              <View style={[styles.cell, styles.cellCondition]}>
                <Text>{asset.condition}</Text>
              </View>
              <View style={[styles.cell, styles.cellStatus]}>
                <Text>{asset.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* BLOK TANDA TANGAN */}
        <View style={styles.signatureContainer}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureText}>Bandung, {today}</Text>
            <Text style={styles.signatureText}>Mengetahui,</Text>
            <Text style={styles.signatureText}>Head of General Affair</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default AssetsPdf;
