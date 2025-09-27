// pdfStyles.ts
import { StyleSheet, Font } from "@react-pdf/renderer"

Font.register({
  family: "NotoSansGujarati",
  src: "/fonts/NotoSansGujarati.ttf", // Make sure this path is correct
})

// Register a dedicated font for Hindi/Devanagari text
Font.register({
  family: "NotoSansDevanagari",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
})

Font.register({
  family: "NotoSans",
  src: "/fonts/NotoSans-Regular.ttf",
})

export const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "NotoSans", // Use NotoSans as default with fallbacks
    fontSize: 12,
    lineHeight: 1.5,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
  },
  gujarati: {
    fontFamily: "NotoSansGujarati",
    fontSize: 12,
  },
  hindi: {
    fontFamily: "NotoSansDevanagari",
    fontSize: 12,
  },
  multilingual: {
    fontFamily: "NotoSansGujarati", // Use Gujarati as primary since most content is Gujarati
    fontSize: 12,
  },
  checklistRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  fillLine: {
    flex: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: "#dc2626",
    marginLeft: 6,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  col: {
    flex: 1,
    marginRight: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#dc2626",
    paddingBottom: 4,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#dc2626",
  },
  staticPageTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "NotoSansGujarati",
    color: "#dc2626",
  },
  checklistItem: {
    marginBottom: 4,
    fontFamily: "NotoSansGujarati",
    fontSize: 10,
    color: "#dc2626",
  },
})
