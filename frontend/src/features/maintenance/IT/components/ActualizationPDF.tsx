import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

import logo from "@/assets/LogoSyaamil.png";
import type { ActualizationForm, Maintenance } from "@/types/maintenance";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#09090b", 
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "column",
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.5, 
    color: "#09090b",
  },
  logo: {
    width: 90,
    height: 35,
    objectFit: "contain",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    marginBottom: 20,
  },


  infoGrid: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e4e4e7", 
    borderRadius: 6, 
    padding: 12,
    backgroundColor: "#fafafa", 
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 3,
  },
  infoLabel: {
    width: 70, 
    color: "#71717a", 
    fontWeight: "bold",
  },
  infoColon: {
    width: 12,
    color: "#a1a1aa", // zinc-400
  },
  infoValue: {
    flex: 1,
    color: "#18181b", // zinc-900
  },

  // TEXT AREAS / SECTIONS
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#09090b",
    marginBottom: 6,
    marginTop: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  box: {
    borderWidth: 1,
    borderColor: "#e4e4e7", 
    borderRadius: 6, 
    padding: 10,
    minHeight: 60, 
    backgroundColor: "#ffffff",
  },
  boxText: {
    color: "#27272a", 
    lineHeight: 1.4,
  },
});

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}:00`;
};

interface Props {
  form: ActualizationForm;
  maintenance: Maintenance;
}

const ActualizationPDF = ({ form, maintenance }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Form Aktualisasi</Text>
        </View>
        <Image src={logo} style={styles.logo} />
      </View>

      <View style={styles.divider} />

      <View style={styles.infoGrid}>
        {[
          ["Nomor", form.form_number],
          ["User", form.user_name],
          ["Tanggal", formatDate(form.form_date)],
          ["Durasi", formatDuration(form.duration_minutes)],
          ["Aset", maintenance.asset.asset_name],
        ].map(([label, value]) => (
          <View style={styles.infoRow} key={label}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoColon}>:</Text>
            <Text style={styles.infoValue}>{String(value)}</Text>
          </View>
        ))}
      </View>

      {/* Keterangan */}
      <Text style={styles.sectionTitle}>Keterangan</Text>
      <View style={styles.box}>
        <Text style={styles.boxText}>{form.description || "-"}</Text>
      </View>

      {/* Kendala */}
      <Text style={styles.sectionTitle}>Kendala</Text>
      <View style={styles.box}>
        <Text style={styles.boxText}>{form.issue || "-"}</Text>
      </View>

      {/* Penanganan */}
      <Text style={styles.sectionTitle}>Penanganan</Text>
      <View style={styles.box}>
        <Text style={styles.boxText}>{form.handling || "-"}</Text>
      </View>

      {/* Rekomendasi */}
      <Text style={styles.sectionTitle}>Rekomendasi</Text>
      <View style={styles.box}>
        <Text style={styles.boxText}>{form.recommendation || "-"}</Text>
      </View>
    </Page>
  </Document>
);

export default ActualizationPDF;
