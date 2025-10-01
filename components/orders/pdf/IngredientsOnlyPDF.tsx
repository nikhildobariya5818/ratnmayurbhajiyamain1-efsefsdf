import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { Order } from "@/lib/types"
import { scaleIngredients, scaleIngredientsWithDualValues } from "@/lib/database"
import "./pdfStyles"
import { detectTextScript } from "@/lib/language-detection"

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 25,
    fontSize: 10,
    fontFamily: "NotoSans",
    backgroundColor: "#fff",
  },
  header: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheader: {
    textAlign: "center",
    fontSize: 10,
    color: "#555",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    paddingVertical: 6,
  },
  colName: { flex: 1, fontSize: 10 },
  colQty: { width: 100, textAlign: "right", fontSize: 10 },
  colUnit: { width: 60, textAlign: "center", fontSize: 10 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 6,
    fontWeight: "bold",
    marginBottom: 4,
  },
  gujarati: { fontFamily: "NotoSansGujarati" },
  hindi: { fontFamily: "NotoSansDevanagari" },
  english: { fontFamily: "NotoSans" },
})

function getScriptStyle(text: string) {
  const script = detectTextScript(text || "")
  switch (script) {
    case "gujarati":
      return styles.gujarati
    case "devanagari":
      return styles.hindi
    case "latin":
      return styles.english
    default:
      return styles.gujarati // default to Gujarati for mixed/unknown to preserve glyphs
  }
}

export function IngredientsOnlyPDF({ order }: { order: Order }) {
  const hasDualValues = order.menuItems.some((item) =>
    item.ingredients.some((ing) => ing.singleItems && ing.multiItems),
  )

  const items = hasDualValues
    ? scaleIngredientsWithDualValues(order.menuItems, order.numberOfPeople)
    : scaleIngredients(order.menuItems, order.numberOfPeople)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Ingredient Requirements</Text>
        <Text style={styles.subheader}>
          People: {order.numberOfPeople} • Date: {new Date(order.orderDate).toLocaleDateString()}
        </Text>

        <View style={styles.tableHeader}>
          <Text style={styles.colName}>Ingredient</Text>
          <Text style={styles.colQty}>Quantity</Text>
          <Text style={styles.colUnit}>Unit</Text>
        </View>

        {items.map((ing, idx) => (
          <View key={`${ing.ingredientId}-${idx}`} style={styles.row}>
            <Text style={[styles.colName, getScriptStyle(ing.ingredientName)]}>{ing.ingredientName}</Text>
            <Text style={styles.colQty}>{ing.totalQuantity}</Text>
            <Text style={styles.colUnit}>{ing.unit}</Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}
