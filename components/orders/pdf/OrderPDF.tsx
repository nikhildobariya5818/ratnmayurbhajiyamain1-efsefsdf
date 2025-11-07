import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import type { Order } from "@/lib/types"
import { scaleIngredientsWithMenuItems } from "@/lib/database"
import { StaticGujaratiPage } from "./StaticGujaratiPage"
import { detectTextScript } from "@/lib/language-detection"
import { formatQuantityWithUnit } from "@/lib/format-quantity"

const styles = StyleSheet.create({
  page: {
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 25,
    fontSize: 9,
    fontFamily: "NotoSans",
    lineHeight: 1.3,
    backgroundColor: "#fff",
  },
  headerWrap: {
    position: "absolute",
    top: 15,
    left: 25,
    right: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#dc2626",
    paddingBottom: 6,
  },
  brand: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#dc2626", // red color for static brand
  },
  subBrand: {
    fontSize: 10,
    color: "#dc2626", // red color for static sub-brand
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 25,
    right: 25,
    textAlign: "center",
    fontSize: 8,
    color: "#777",
    borderTopWidth: 1,
    borderTopColor: "#dc2626",
    paddingTop: 4,
  },
  row: {
    flexDirection: "row",
    gap: 15,
  },
  col: { flex: 1 },
  section: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#dc2626",
    borderRadius: 4,
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: "#f2f2f2",
    padding: "4px 6px",
    borderBottomWidth: 1,
    borderBottomColor: "#dc2626",
  },
  sectionHeaderText: { fontSize: 10, fontWeight: "bold" },
  sectionBody: { padding: 6 },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  label: { fontSize: 9, color: "#555" },
  value: { fontSize: 9, fontWeight: "bold", textAlign: "right", maxWidth: 150 },
  menuItem: {
    borderWidth: 1,
    borderColor: "#dc2626",
    borderRadius: 3,
    padding: 4,
    marginBottom: 4,
    backgroundColor: "#fff",
  },
  ingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: "#dc2626",
  },
  ingName: {
    flex: 1,
    fontFamily: "NotoSansGujarati",
    fontSize: 9,
  },
  ingQty: {
    width: 100,
    textAlign: "right",
    fontFamily: "NotoSansGujarati",
    fontSize: 9,
  },
  gujarati: {
    fontFamily: "NotoSansGujarati",
    fontSize: 9,
  },
  hindi: {
    fontFamily: "NotoSansDevanagari",
    fontSize: 9,
  },
  english: {
    fontFamily: "NotoSans",
    fontSize: 9,
  },
  staticPageTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "NotoSansGujarati",
  },
  checklistItem: {
    marginBottom: 4,
    fontFamily: "NotoSansGujarati",
    fontSize: 10,
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
  headerTop: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#dc2626",
    paddingBottom: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "NotoSansGujarati",
    fontSize: 10,
  },
  multilingualText: {
    fontFamily: "NotoSansDevanagari",
  },
  formSection: {
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: "#dc2626",
    borderRadius: 8,
    padding: 6,
    backgroundColor: "#fff",
  },
  formHeader: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily: "NotoSansGujarati",
    color: "#dc2626", // red color for static headers
  },
  formLabel: {
    fontSize: 8,
    fontFamily: "NotoSansGujarati",
    marginRight: 3,
    color: "#dc2626", // red color for static labels
  },
  formUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: "#dc2626",
    flex: 1,
    paddingBottom: 1,
    marginLeft: 2,
    marginRight: 6,
    minHeight: 12,
  },
  formValue: {
    fontSize: 8,
    fontFamily: "NotoSansGujarati",
    color: "#000000", // black color for dynamic values
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#dc2626",
    marginRight: 4,
  },
  twoColumnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  columnItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuGridItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  menuNumber: {
    fontSize: 8,
    fontFamily: "NotoSansGujarati",
    marginRight: 3,
    width: 16,
    color: "#dc2626", // red color for static menu numbers
  },
  menuItemName: {
    fontSize: 8,
    fontFamily: "NotoSansGujarati",
    marginRight: 3,
    color: "#dc2626", // red color for static menu item names
  },
  religiousHeader: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 2,
    fontFamily: "NotoSansGujarati",
    color: "#dc2626", // red color for static religious text
  },
  dynamicDate: {
    fontSize: 10,
    color: "#000000", // black color for dynamic date
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 100,
    height: 100,
  },
  brandContainer: {
    flexDirection: "column",
  },
})

function getAppropriateFont(text: string): any {
  const script = detectTextScript(text)
  switch (script) {
    case "devanagari":
      return styles.hindi
    case "gujarati":
      return styles.gujarati
    case "latin":
      return styles.english
    case "mixed":
      return styles.multilingualText
    default:
      return styles.multilingualText
  }
}

function needsMultilingualFont(text: string): boolean {
  const script = detectTextScript(text)
  return script === "devanagari" || script === "gujarati" || script === "mixed"
}

export function OrderPDF({ order }: { order: Order }) {
  const client = order.client || order.clientSnapshot

  const scaledIngredients = scaleIngredientsWithMenuItems(
    order.menuItems.map((item) => ({
      menuItemId: item._id,
      name: item.name,
      selectedType: item.selectedType || item.type,
      ingredients: item.ingredients,
    })),
    order.numberOfPeople,
  )

  const ingredientData =
    scaledIngredients && scaledIngredients.length > 0
      ? scaledIngredients.map((ing) => ({
          name: ing.ingredientName,
          quantity: formatQuantityWithUnit(ing.totalQuantity).value,
          unit: "",
        }))
      : [
          { name: "કંદાના (Sweet Potato)", quantity: "15 kg", unit: "" },
          { name: "આદુ", quantity: "2 kg and 500 gm", unit: "" },
          { name: "મરચા", quantity: "2 kg and 500 gm", unit: "" },
          { name: "લસણ", quantity: "1 kg and 250 gm", unit: "" },
          { name: "મેથી", quantity: "2 kg and 500 gm", unit: "" },
          { name: "મરચી", quantity: "630 gm", unit: "" },
          { name: "ભજીયા નો લોટ", quantity: "7 kg and 500 gm", unit: "" },
          { name: "ટમેટા પૂરી (Sweet Tomato Puri)", quantity: "17 kg and 500 gm", unit: "" },
        ]

  console.log("Scaled Ingredients:", scaledIngredients) // Added debug logging

  function formatDateDDMMYYYY(dateInput: string | Date) {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <Document>
      {/* PAGE 1: FULL Order Report */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerWrap} fixed>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} src="/images/ratn-mayur-logo.jpg" />
              {/* <View style={styles.brandContainer}>
                <Text style={styles.brand}>Ratn Mayur Bhajiya</Text>
                <Text style={styles.subBrand}>Catering Order Report</Text>
              </View> */}
            </View>
            {/* <Text style={styles.dynamicDate}>{new Date(order.orderDate).toLocaleDateString()}</Text> */}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.religiousHeader}>|| શ્રી ગણેશાય નમઃ ||</Text>
          <Text style={styles.religiousHeader}>|| આઈ શ્રી ખોડિયાર માં ||</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.twoColumnRow}>
            <View style={styles.columnItem}>
              <View style={styles.checkbox}></View>
              <Text style={styles.formLabel}>સાવાર</Text>
              <View style={styles.checkbox}></View>
              <Text style={styles.formLabel}>સાંજ</Text>
            </View>
            <View style={styles.columnItem}>
              <Text style={styles.formLabel}>તારીખ :</Text>
              <View style={styles.formUnderline}>
                <Text style={styles.formValue}>{formatDateDDMMYYYY(order.orderDate)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.columnItem}>
              <Text style={styles.formLabel}>સવાર</Text>
              <View style={styles.formUnderline}>
                <Text style={styles.formValue}></Text>
              </View>
            </View>
            <View style={styles.columnItem}>
              <Text style={styles.formLabel}>બપોર</Text>
              <View style={styles.formUnderline}>
                <Text style={styles.formValue}></Text>
              </View>
            </View>
            <View style={styles.columnItem}>
              <Text style={styles.formLabel}>સાંજ</Text>
              <View style={styles.formUnderline}>
                <Text style={styles.formValue}></Text>
              </View>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>નામ :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}>{client?.name || ""}</Text>
            </View>
            <Text style={styles.formLabel}>મો. :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}>{client?.phone || ""}</Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>સરનામું :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}>{client?.address || order.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>કેટરસનું નામ :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}></Text>
            </View>
            <Text style={styles.formLabel}>ડીશ :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}></Text>
            </View>
            <Text style={styles.formLabel}>નેટ વજન :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}></Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>જૈન :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}></Text>
            </View>
            <Text style={styles.formLabel}>કંદમુળ વગરનું જૈન</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}></Text>
            </View>
            <Text style={styles.formLabel}>ચાર્ટર નથી / ચાર્ટર છે.</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>ટેમ્પો ચાલકનું નામ :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}>{order.vehicleOwnerName || ""}</Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>ટેમ્પો ચાલક મોબાઈલ નંબર :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}>{order.phoneNumber || ""}</Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>ટેમ્પો નંબર :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}>{order.vehicleNumberPlaceholder || ""}</Text>
            </View>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.columnItem}>
              <Text style={styles.formLabel}>ટેમ્પો નો સમય :</Text>
              <View style={styles.formUnderline}>
                <Text style={styles.formValue}></Text>
              </View>
            </View>
            <View style={styles.columnItem}>
              <Text style={styles.formLabel}>ઓર્ડર આપવાનો સમય :</Text>
              <View style={styles.formUnderline}>
                <Text style={styles.formValue}>{order.orderTime}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formHeader}>મેનુ આઇટમ્સ - Menu Items</Text>
          {order.menuItems && order.menuItems.length > 0 ? (
            <View style={styles.twoColumnRow}>
              <View style={styles.col}>
                {order.menuItems.slice(0, Math.ceil(order.menuItems.length / 2)).map((item, index) => (
                  <View key={index} style={styles.formRow}>
                    <Text style={styles.menuNumber}>{String(index + 1).padStart(2, "0")})</Text>
                    <Text style={styles.formLabel}>{item.name}</Text>
                    <View style={styles.formUnderline}></View>
                  </View>
                ))}
              </View>
              <View style={styles.col}>
                {order.menuItems.slice(Math.ceil(order.menuItems.length / 2)).map((item, index) => (
                  <View key={index} style={styles.formRow}>
                    <Text style={styles.menuNumber}>
                      {String(Math.ceil(order.menuItems.length / 2) + index + 1).padStart(2, "0")})
                    </Text>
                    <Text style={styles.formLabel}>{item.name}</Text>
                    <View style={styles.formUnderline}></View>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.formLabel}>No menu items selected</Text>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formHeader}>સામગ્રી આવશ્યકતાઓ - Ingredient Requirements</Text>
          <View style={styles.twoColumnRow}>
            <View style={styles.col}>
              {ingredientData.slice(0, Math.ceil(ingredientData.length / 2)).map((ingredient, index) => (
                <View key={index} style={styles.formRow}>
                  <Text style={styles.formLabel}>{ingredient.name}</Text>
                  <View style={styles.formUnderline}>
                    <Text style={styles.formValue}>{ingredient.quantity}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.col}>
              {ingredientData.slice(Math.ceil(ingredientData.length / 2)).map((ingredient, index) => (
                <View key={index} style={styles.formRow}>
                  <Text style={styles.formLabel}>{ingredient.name}</Text>
                  <View style={styles.formUnderline}>
                    <Text style={styles.formValue}>{ingredient.quantity}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.twoColumnRow}>
            <View style={styles.col}>
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>ખજુર ચટણી કિ. :</Text>
                <View style={styles.formUnderline}>
                  <Text style={styles.formValue}></Text>
                </View>
                <Text style={styles.formLabel}>જગ :</Text>
                <View style={styles.formUnderline}>
                  <Text style={styles.formValue}></Text>
                </View>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>કઢી :</Text>
                <View style={styles.formUnderline}>
                  <Text style={styles.formValue}></Text>
                </View>
                <Text style={styles.formLabel}>વજન કાંટો:</Text>
                <View style={styles.formUnderline}>
                  <Text style={styles.formValue}></Text>
                </View>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>ટમેટાપુરી ની ચટણી :</Text>
                <View style={styles.formUnderline}>
                  <Text style={styles.formValue}></Text>
                </View>
                <Text style={styles.formLabel}>રાજકોટ ની ચટણી :</Text>
                <View style={styles.formUnderline}>
                  <Text style={styles.formValue}></Text>
                </View>
                <Text style={styles.formLabel}>વાટકી :</Text>
                <View style={styles.formUnderline}>
                  <Text style={styles.formValue}></Text>
                </View>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>નાસ્તા ડીસ :</Text>
                <View style={styles.formUnderline}>
                  <Text style={styles.formValue}></Text>
                </View>
                <Text style={styles.formLabel}>ડીસ :</Text>
                <View style={styles.formUnderline}>
                  <Text style={styles.formValue}></Text>
                </View>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>ગ્લાસ :</Text>
                <View style={styles.formUnderline}>
                  <Text style={styles.formValue}></Text>
                </View>
                <Text style={styles.formLabel}>છાસ :</Text>
                <View style={styles.formUnderline}>
                  <Text style={styles.formValue}></Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>કારીગરનું નામ :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}>{order.chefName || ""}</Text>
            </View>
            <Text style={styles.formLabel}>કારીગર મોબાઈલ નંબર :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}>{order.chefPhoneNumber || ""}</Text>
            </View>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}></Text>
            </View>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}></Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>નામ :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}></Text>
            </View>
            <Text style={styles.formLabel}>મો. :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}></Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.formLabel}>સ્ટાફ :</Text>
            <View style={styles.formUnderline}>
              <Text style={styles.formValue}></Text>
            </View>
          </View>
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>

      <StaticGujaratiPage />
    </Document>
  )
}
