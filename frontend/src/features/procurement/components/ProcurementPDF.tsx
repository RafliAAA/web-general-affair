import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Procurement } from "../../../types/procurement";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#000",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logoSection: {
    flexDirection: "column",
  },
  logoText: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  logoSubText: {
    fontSize: 8,
    color: "#555",
    fontStyle: "italic",
  },
  titleSection: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  prInfoRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  prInfoLabel: {
    width: 60,
    fontSize: 8,
    color: "#333",
  },
  prInfoColon: {
    width: 10,
    fontSize: 8,
  },
  prInfoValue: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },

  // Divider
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 10,
  },

  // Requested By & Remarks
  bodySection: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 20,
  },
  requestedBySection: {
    flex: 1,
  },
  remarksSection: {
    flex: 2,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 8,
    color: "#333",
    lineHeight: 1.5,
  },
  remarksRow: {
    flexDirection: "row",
  },
  remarksColon: {
    marginRight: 4,
    fontSize: 8,
  },

  // Table
  table: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    minHeight: 20,
  },
  tableRowLast: {
    flexDirection: "row",
    minHeight: 20,
  },

  // Empty rows
  emptyRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    height: 18,
  },
});

const tableStyles = {
  col: (width: number, align: "left" | "center" | "right" = "left") => ({
    width: `${width}%`,
    padding: "4 4",
    fontSize: 8,
    borderRightWidth: 0.5,
    borderRightColor: "#ccc",
    textAlign: align,
  }),
  colLast: (width: number, align: "left" | "center" | "right" = "left") => ({
    width: `${width}%`,
    padding: "4 4",
    fontSize: 8,
    textAlign: align,
  }),
  colHeader: (
    width: number,
    align: "left" | "center" | "right" = "center",
  ) => ({
    width: `${width}%`,
    padding: "4 4",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    borderRightWidth: 0.5,
    borderRightColor: "#999",
    textAlign: align,
  }),
  colHeaderLast: (width: number) => ({
    width: `${width}%`,
    padding: "4 4",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center" as const,
  }),
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GB").replace(/\//g, "/");

interface Props {
  procurement: Procurement;
}

const EMPTY_ROWS = 8;

const ProcurementPDF = ({ procurement }: Props) => {
  const emptyRowsCount = Math.max(
    0,
    EMPTY_ROWS - (procurement.items?.length ?? 0),
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Text style={styles.logoText}>sygma</Text>
            <Text style={styles.logoSubText}>creative media corp.</Text>
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.title}>PURCHASE REQUISITION</Text>
            <View style={styles.prInfoRow}>
              <Text style={styles.prInfoLabel}>PR Number</Text>
              <Text style={styles.prInfoColon}>:</Text>
              <Text style={styles.prInfoValue}>{procurement.pr_number}</Text>
            </View>
            <View style={styles.prInfoRow}>
              <Text style={styles.prInfoLabel}>PR Date</Text>
              <Text style={styles.prInfoColon}>:</Text>
              <Text style={styles.prInfoValue}>
                {formatDate(procurement.pr_date)}
              </Text>
            </View>
            <View style={styles.prInfoRow}>
              <Text style={styles.prInfoLabel}>Print Date</Text>
              <Text style={styles.prInfoColon}>:</Text>
              <Text style={styles.prInfoValue}>
                {formatDate(procurement.print_date)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Requested By & Remarks */}
        <View style={styles.bodySection}>
          <View style={styles.requestedBySection}>
            <Text style={styles.sectionLabel}>Requested By :</Text>
            <Text style={styles.sectionValue}>{procurement.end_user}</Text>
          </View>
          <View style={styles.remarksSection}>
            <View style={styles.remarksRow}>
              <Text style={styles.sectionLabel}>Remarks</Text>
              <Text style={styles.remarksColon}> : </Text>
              <Text style={styles.sectionValue}>
                {procurement.remarks || "—"}
              </Text>
            </View>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={tableStyles.colHeader(5)}>No.</Text>
            <Text style={tableStyles.colHeader(13)}>Part Number</Text>
            <Text style={tableStyles.colHeader(25)}>Description</Text>
            <Text style={tableStyles.colHeader(12)}>Due Date</Text>
            <Text style={tableStyles.colHeader(15)}>End User</Text>
            <Text style={tableStyles.colHeader(17)}>Remarks</Text>
            <Text style={tableStyles.colHeader(7)}>Qty</Text>
            <Text style={tableStyles.colHeaderLast(6)}>UM</Text>
          </View>

          {/* Table Body */}
          {procurement.items?.map((item, index) => (
            <View
              key={item.procurement_item_id}
              style={
                index === (procurement.items?.length ?? 0) - 1 &&
                emptyRowsCount === 0
                  ? styles.tableRowLast
                  : styles.tableRow
              }
            >
              <Text style={tableStyles.col(5, "center")}>{index + 1}</Text>
              <Text style={tableStyles.col(13)}>{item.part_number}</Text>
              <Text style={tableStyles.col(25)}>{item.description}</Text>
              <Text style={tableStyles.col(12, "center")}>
                {formatDate(procurement.due_date)}
              </Text>
              <Text style={tableStyles.col(15)}>{procurement.end_user}</Text>
              <Text style={tableStyles.col(17)}>
                {procurement.remarks || "—"}
              </Text>
              <Text style={tableStyles.col(7, "center")}>{item.quantity}</Text>
              <Text style={tableStyles.colLast(6, "center")}>
                {item.unit_of_measure}
              </Text>
            </View>
          ))}

          {/* Empty rows */}
          {Array.from({ length: emptyRowsCount }).map((_, i) => (
            <View
              key={`empty-${i}`}
              style={
                i === emptyRowsCount - 1 ? styles.tableRowLast : styles.emptyRow
              }
            >
              <Text style={tableStyles.col(5)}> </Text>
              <Text style={tableStyles.col(13)}> </Text>
              <Text style={tableStyles.col(25)}> </Text>
              <Text style={tableStyles.col(12)}> </Text>
              <Text style={tableStyles.col(15)}> </Text>
              <Text style={tableStyles.col(17)}> </Text>
              <Text style={tableStyles.col(7)}> </Text>
              <Text style={tableStyles.colLast(6)}> </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default ProcurementPDF;
