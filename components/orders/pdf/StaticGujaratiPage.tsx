// components/orders/pdf/StaticGujaratiPage.tsx
import { Page, Text, View } from "@react-pdf/renderer"
import { styles } from "./pdfStyles"

const StaticGujaratiPage = () => {
  const checklistItemsCol1 = [
    "ચુલો",
    "બકડીયુ નાનુ/મોટુ",
    "બકડીયુ ફુલ મોટુ",
    "તેલ ડબ્બા",
    "લચ્છા લોટ",
    "પુરીનો લોટ",
    "કુંભણિયાનો લોટ",
    "રતાળુ પુરીનો લોટ",
    "મકાઈ પેટી",
    "થાલા નાનુ/મોટુ",
    "મોદી ચોકી સ્ટીલ",
    "જરાની ચોકી",
    "ભજીયા ના તપેલા",
    "બાઉલ",
    "સ્ટીલ ડોલ",
    "એલ્યુમિનિયમ કુંડુ",
    "સ્ટીલ કિટલો",
  ]
  const checklistItemsCol2 = [
    "જારાનો ઘેલો",
    "છાસ પવાલી",
    "છાસ",
    "ગ્લાસ - નાસ્તા ડીસ",
    "ડીસ - સાદીડીસ",
    "વાટકી",
    "વજન કાંટો",
    "ખજુર ચટણી",
    "કઢી",
    "ટમેટાપુરીની ચટણી",
    "ટમેટાનું સલાડ",
    "કાંદાનું સલાડ",
    "મરચાના ટુકડા",
    "લસણ",
    "મરચી ધોયેલી",
    "પુરીના બટેકા",
    "પનીર ભજીયા",
    "પકોડા",
  ]
  const checklistItemsCol3 = [
    "ભરેલા મરચા",
    "બટાકા પુરી",
    "મકાઈ ધાણા",
    "મેથી",
    "પટ્ટી - મરચા રીંગ",
    "બટાકાવડા",
    "લીંબુ વડા",
    "રતાળુપુરી",
    "ટમેટા પુરી",
    "સેન્ડવીચ પુરી",
    "કાચા કેળાપુરી",
    "ભરેલા ટમેટા",
    "કુંભણીયા",
    "રતાળુવડા",
    "દાળવડા",
    "કાચા કેળાના વડા",
    "કાંદાના ભજીયા",
  ]

  const extraItems = [
    "જારો",
    "ડાયરી",
    "કિટલો",
    "ગેસની નળીની પેટી",
    "સ્ટીલ જગ",
    "જારી",
    "બોલપેન",
    "તેલનો ગરણો",
    "રતાળુ પુરી મશીન",
    "સ્ટીલ ડીસ",
    "મસ્તી",
    "મકાઈ લોટ",
    "બટેકા પુરી મશીન",
    "રીંગણપુરીના મસાલા",
    "ડુંગા",
    "મરી",
    "વાટકી",
    "પાટલો/કાતો",
    "ધાણાજીરૂ પાવડર",
    "મીઠું",
    "મરચા મસાલા",
    "ધાણા ફાડા",
    "ગાભા",
    "લાઈટર",
    "સ્ટોકના મરચા",
    "સલાડનો ચમચો",
  ]

  // ✅ FIX: only one line per row (text + stretching line)
  const renderItemWithLine = (item: string, i: number) => (
    <View key={i} style={styles.checklistRow}>
      <Text style={[styles.checklistItem, styles.gujarati]}>• {item}</Text>
      <View style={styles.fillLine} />
    </View>
  )

  return (
    <Page size="A4" style={styles.page}>
      {/* Header fields */}
      <View style={styles.headerTop}>
        <View style={styles.headerRow}>
          <Text style={[styles.gujarati, { fontSize: 10 }]}>સવાર □ સાંજ □</Text>
          <Text style={[styles.gujarati, { fontSize: 10 }]}>તારીખ : _____________</Text>
          <Text style={[styles.gujarati, { fontSize: 10 }]}>ક્લાસ : _____________</Text>
          <Text style={[styles.gujarati, { fontSize: 10 }]}>ભોજન : _____________</Text>
          <Text style={[styles.gujarati, { fontSize: 10 }]}>પાર્ટી : _____________</Text>
        </View>
      </View>

      <Text style={[styles.staticPageTitle, styles.gujarati]}>અન્ય આવશ્યક વસ્તુઓ</Text>

      {/* 3-column checklist */}
      <View style={styles.row}>
        <View style={styles.col}>{checklistItemsCol1.map(renderItemWithLine)}</View>
        <View style={styles.col}>{checklistItemsCol2.map(renderItemWithLine)}</View>
        <View style={styles.col}>{checklistItemsCol3.map(renderItemWithLine)}</View>
      </View>

      {/* Extra section */}
      <Text style={[styles.staticPageTitle, styles.gujarati, { marginTop: 20 }]}>વધારાની ચીજો</Text>
      <View style={styles.row}>
        {[0, 1, 2].map((colIndex) => (
          <View style={styles.col} key={colIndex}>
            {extraItems.filter((_, i) => i % 3 === colIndex).map(renderItemWithLine)}
          </View>
        ))}
      </View>

      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        fixed
      />
    </Page>
  )
}

export { StaticGujaratiPage }
