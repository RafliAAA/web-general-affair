import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Asset } from "@/types/inventory";

// Palet warna Shadcn UI (Zinc/Slate theme)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9, // Sedikit lebih kecil khas Shadcn yang compact
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#09090b", // zinc-950 (foreground)
  },

  // HEADER SECTION
  header: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7", // zinc-200 (border)
    paddingBottom: 16,
  },
  company: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#71717a", // zinc-500 (muted-foreground)
    textTransform: "uppercase",
  },
  title: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: -0.5, // khas font Geist/Inter di Shadcn
    color: "#09090b", // zinc-950
  },
  subtitle: {
    marginTop: 4,
    color: "#71717a", // zinc-500
    fontSize: 9,
  },

  // SUMMARY CARDS (Grid-like layout)
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e4e4e7", // zinc-200
    borderRadius: 6, // shadcn default radius
    padding: 12,
    backgroundColor: "#ffffff",
  },
  summaryLabel: {
    color: "#71717a", // zinc-500
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#09090b",
  },

  // TABLE STYLING (Shadcn Table component style)
  table: {
    width: "100%",
    // Di Shadcn, table biasanya tidak dibungkus border luar penuh, tapi per baris
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#09090b", // zinc-950 accent line atau zinc-200
    paddingBottom: 8,
    marginBottom: 4,
  },
  headerCell: {
    color: "#71717a", // zinc-500 (muted)
    fontWeight: "bold",
    fontSize: 8,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5", // zinc-100 (muted border)
    paddingVertical: 8,
    alignItems: "center",
  },

  // COLUMN WIDTHS & ALIGNMENT
  cellNo: { width: "6%", paddingRight: 4 },
  cellName: { width: "28%", paddingRight: 8, fontWeight: "bold" }, // Nama aset dibuat semi-bold
  cellCode: { width: "20%", paddingRight: 8, color: "#52525b" }, // zinc-600
  cellCategory: { width: "18%", paddingRight: 8 },
  cellCondition: { width: "14%", paddingRight: 8 },
  cellStatus: { width: "14%" },

  // FOOTER
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#a1a1aa", // zinc-400
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 12,
  },
});

interface Props {
  assets: Asset[];
}

const AssetsPdf = ({ assets }: Props) => {
  const totalAsset = assets.length;
  const availableAsset = assets.filter((a) => a.status === "Tersedia").length;
  const borrowedAsset = assets.filter((a) => a.status === "Dipinjam").length;
  const maintenanceAsset = assets.filter((a) => a.status === "Diperbaiki").length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.company}>General Affair</Text>
          <Text style={styles.title}>Laporan Data Aset Perusahaan</Text>
          <Text style={styles.subtitle}>
            Dicetak pada {format(new Date(), "dd MMMM yyyy", { locale: id })}
          </Text>
        </View>

        {/* SUMMARY CARDS */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Asset</Text>
            <Text style={styles.summaryValue}>{totalAsset}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tersedia</Text>
            <Text style={styles.summaryValue}>{availableAsset}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Dipinjam</Text>
            <Text style={styles.summaryValue}>{borrowedAsset}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Diperbaiki</Text>
            <Text style={styles.summaryValue}>{maintenanceAsset}</Text>
          </View>
        </View>

        {/* TABLE */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.cellNo, styles.headerCell]}>No</Text>
            <Text style={[styles.cellName, styles.headerCell]}>Nama Asset</Text>
            <Text style={[styles.cellCode, styles.headerCell]}>Kode</Text>
            <Text style={[styles.cellCategory, styles.headerCell]}>Kategori</Text>
            <Text style={[styles.cellCondition, styles.headerCell]}>Kondisi</Text>
            <Text style={[styles.cellStatus, styles.headerCell]}>Status</Text>
          </View>

          {/* Table Body */}
          {assets.map((asset, index) => (
            <View key={asset.asset_id} style={styles.row}>
              <Text style={styles.cellNo}>{index + 1}</Text>
              <Text style={styles.cellName}>{asset.asset_name}</Text>
              <Text style={styles.cellCode}>{asset.asset_code}</Text>
              <Text style={styles.cellCategory}>{asset.asset_type}</Text>
              <Text style={styles.cellCondition}>{asset.condition}</Text>
              <Text style={styles.cellStatus}>{asset.status}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default AssetsPdf;