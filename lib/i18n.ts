export type Language = "en" | "hi" | "gu"

export interface Translations {
  // Navigation
  dashboard: string
  clients: string
  ingredients: string
  menuItems: string
  orders: string
  reports: string
  settings: string

  // Dashboard
  cateringManagementSystem: string
  ratnMayurBhajiya: string
  manageCateringBusiness: string
  manageClientInfo: string
  manageIngredients: string
  manageBhajiyaVarieties: string
  createManageOrders: string
  generatePDFReports: string
  systemSettings: string

  // Common
  add: string
  edit: string
  delete: string
  save: string
  cancel: string
  close: string
  confirm: string
  search: string
  actions: string
  name: string
  description: string
  quantity: string
  unit: string
  price: string
  total: string
  date: string
  status: string

  // Menu Item Types
  onlyDish: string
  onlyDishWithChart: string
  dishWithoutChart: string
  dishWithChart: string

  // Settings
  language: string
  selectLanguage: string
  english: string
  hindi: string
  gujarati: string

  // Form Labels
  clientName: string
  contactNumber: string
  address: string
  ingredientName: string
  menuItemName: string
  orderDate: string
  deliveryDate: string

  // Messages
  deleteConfirmation: string
  itemDeleted: string
  itemSaved: string
  errorOccurred: string

  // Client Management
  clientManagement: string
  addClient: string
  searchClients: string
  totalClients: string
  searchResults: string
  withReferences: string
  noClientsFound: string
  tryAdjustingSearch: string
  getStartedAddClient: string

  // Ingredient Management
  ingredientManagement: string
  addIngredient: string
  searchIngredients: string
  allUnits: string
  totalIngredients: string
  weightUnits: string
  volumeUnits: string
  noIngredientsFound: string
  getStartedAddIngredient: string

  // Additional common terms
  loading: string
  retry: string
  added: string

  // Menu Item Management
  menuItemManagement: string
  addMenuItem: string
  searchMenuItems: string
  totalMenuItems: string
  noMenuItemsFound: string
  getStartedAddMenuItem: string
  category: string
  type: string
  defaultType: string

  // Order Management
  orderManagement: string
  createOrder: string
  searchOrders: string
  totalOrders: string
  noOrdersFound: string
  getStartedCreateOrder: string
  numberOfPeople: string
  orderType: string
  orderTime: string
  eventAddress: string
  menuSelection: string
  additionalInfo: string
  basicInfo: string
  existingClient: string
  newClient: string
  selectClient: string
  newClientInfo: string
  phone: string
  reference: string
  notes: string
  vehicleOwnerName: string
  vehiclePhoneNumber: string
  chefName: string
  chefPhoneNumber: string
  vehicleNumber: string
  additionalHelper: string

  // Report Management
  reportManagement: string
  generateReport: string
  searchReports: string
  totalReports: string
  downloaded: string
  thisMonth: string
  noReportsFound: string
  getStartedGenerateReport: string
  preview: string
  downloadPDF: string
  generated: string
  generatedOn: string

  // Order Types
  wedding: string
  birthdayParty: string
  corporateEvent: string
  religiousFunction: string
  anniversary: string
  festival: string
  other: string

  // Units
  gram: string
  kilogram: string
  milliliter: string
  liter: string
  piece: string

  // Time and Date
  today: string
  yesterday: string
  tomorrow: string
  thisWeek: string
  lastWeek: string
  nextWeek: string

  // Status and States
  active: string
  inactive: string
  pending: string
  completed: string
  cancelled: string
  confirmed: string

  // Validation Messages
  required: string
  invalidEmail: string
  invalidPhone: string
  minimumLength: string
  maximumLength: string
  mustBePositive: string
  mustBeGreaterThanZero: string

  // Success Messages
  clientCreated: string
  clientUpdated: string
  clientDeleted: string
  ingredientCreated: string
  ingredientUpdated: string
  ingredientDeleted: string
  menuItemCreated: string
  menuItemUpdated: string
  menuItemDeleted: string
  orderCreated: string
  orderUpdated: string
  orderDeleted: string
  reportGenerated: string

  // Error Messages
  failedToLoad: string
  failedToCreate: string
  failedToUpdate: string
  failedToDelete: string
  networkError: string
  serverError: string
  unknownError: string

  // Additional translations
  toggleMenu: string
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    clients: "Clients",
    ingredients: "Ingredients",
    menuItems: "Menu Items",
    orders: "Orders",
    reports: "Reports",
    settings: "Settings",

    // Dashboard
    cateringManagementSystem: "Catering Management System",
    ratnMayurBhajiya: "Ratn Mayur Bhajiya",
    manageCateringBusiness: "Manage your catering business with ease - from clients to orders to reports",
    manageClientInfo: "Manage client information and contacts",
    manageIngredients: "Manage ingredients and units",
    manageBhajiyaVarieties: "Manage bhajiya varieties and recipes",
    createManageOrders: "Create and manage catering orders",
    generatePDFReports: "Generate PDF reports and analytics",
    systemSettings: "System settings and configuration",

    // Common
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    confirm: "Confirm",
    search: "Search",
    actions: "Actions",
    name: "Name",
    description: "Description",
    quantity: "Quantity",
    unit: "Unit",
    price: "Price",
    total: "Total",
    date: "Date",
    status: "Status",

    // Menu Item Types
    onlyDish: "Only bhajiya (KG)",
    onlyDishWithChart: "Dish with Only bhajiya",
    dishWithoutChart: "Dish have no Chart",
    dishWithChart: "Dish have Chart & Bhajiya",

    // Settings
    language: "Language",
    selectLanguage: "Select Language",
    english: "English",
    hindi: "हिंदी",
    gujarati: "ગુજરાતી",

    // Form Labels
    clientName: "Client Name",
    contactNumber: "Contact Number",
    address: "Address",
    ingredientName: "Ingredient Name",
    menuItemName: "Menu Item Name",
    orderDate: "Order Date",
    deliveryDate: "Delivery Date",

    // Messages
    deleteConfirmation: "Are you sure you want to delete this item?",
    itemDeleted: "Item deleted successfully",
    itemSaved: "Item saved successfully",
    errorOccurred: "An error occurred",

    // Client Management
    clientManagement: "Client Management",
    addClient: "Add Client",
    searchClients: "Search clients...",
    totalClients: "Total Clients",
    searchResults: "Search Results",
    withReferences: "With References",
    noClientsFound: "No clients found",
    tryAdjustingSearch: "Try adjusting your search terms",
    getStartedAddClient: "Get started by adding your first client",

    // Ingredient Management
    ingredientManagement: "Ingredient Management",
    addIngredient: "Add Ingredient",
    searchIngredients: "Search ingredients...",
    allUnits: "All Units",
    totalIngredients: "Total Ingredients",
    weightUnits: "Weight Units",
    volumeUnits: "Volume Units",
    noIngredientsFound: "No ingredients found",
    getStartedAddIngredient: "Get started by adding your first ingredient",

    // Additional common terms
    loading: "Loading",
    retry: "Retry",
    added: "Added",

    // Menu Item Management
    menuItemManagement: "Menu Item Management",
    addMenuItem: "Add Menu Item",
    searchMenuItems: "Search menu items...",
    totalMenuItems: "Total Menu Items",
    noMenuItemsFound: "No menu items found",
    getStartedAddMenuItem: "Get started by adding your first menu item",
    category: "Category",
    type: "Type",
    defaultType: "Default Type",

    // Order Management
    orderManagement: "Order Management",
    createOrder: "Create Order",
    searchOrders: "Search orders...",
    totalOrders: "Total Orders",
    noOrdersFound: "No orders found",
    getStartedCreateOrder: "Get started by creating your first order",
    numberOfPeople: "Number of People",
    orderType: "Order Type",
    orderTime: "Order Time",
    eventAddress: "Event Address",
    menuSelection: "Menu Selection",
    additionalInfo: "Additional Info",
    basicInfo: "Basic Info",
    existingClient: "Existing Client",
    newClient: "New Client",
    selectClient: "Select Client",
    newClientInfo: "New Client Information",
    phone: "Phone",
    reference: "Reference",
    notes: "Notes",
    vehicleOwnerName: "Vehicle Owner Name",
    vehiclePhoneNumber: "Vehicle Phone Number",
    chefName: "Chef Name",
    chefPhoneNumber: "Chef Phone Number",
    vehicleNumber: "Vehicle Number",
    additionalHelper: "Additional Helper",

    // Report Management
    reportManagement: "Report Management",
    generateReport: "Generate Report",
    searchReports: "Search reports...",
    totalReports: "Total Reports",
    downloaded: "Downloaded",
    thisMonth: "This Month",
    noReportsFound: "No reports found",
    getStartedGenerateReport: "Get started by generating your first report",
    preview: "Preview",
    downloadPDF: "Download PDF",
    generated: "Generated",
    generatedOn: "Generated on",

    // Order Types
    wedding: "Wedding",
    birthdayParty: "Birthday Party",
    corporateEvent: "Corporate Event",
    religiousFunction: "Religious Function",
    anniversary: "Anniversary",
    festival: "Festival",
    other: "Other",

    // Units
    gram: "Gram",
    kilogram: "Kilogram",
    milliliter: "Milliliter",
    liter: "Liter",
    piece: "Piece",

    // Time and Date
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    thisWeek: "This Week",
    lastWeek: "Last Week",
    nextWeek: "Next Week",

    // Status and States
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    completed: "Completed",
    cancelled: "Cancelled",
    confirmed: "Confirmed",

    // Validation Messages
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    invalidPhone: "Please enter a valid phone number",
    minimumLength: "Minimum length required",
    maximumLength: "Maximum length exceeded",
    mustBePositive: "Value must be positive",
    mustBeGreaterThanZero: "Value must be greater than zero",

    // Success Messages
    clientCreated: "Client created successfully",
    clientUpdated: "Client updated successfully",
    clientDeleted: "Client deleted successfully",
    ingredientCreated: "Ingredient created successfully",
    ingredientUpdated: "Ingredient updated successfully",
    ingredientDeleted: "Ingredient deleted successfully",
    menuItemCreated: "Menu item created successfully",
    menuItemUpdated: "Menu item updated successfully",
    menuItemDeleted: "Menu item deleted successfully",
    orderCreated: "Order created successfully",
    orderUpdated: "Order updated successfully",
    orderDeleted: "Order deleted successfully",
    reportGenerated: "Report generated successfully",

    // Error Messages
    failedToLoad: "Failed to load data",
    failedToCreate: "Failed to create item",
    failedToUpdate: "Failed to update item",
    failedToDelete: "Failed to delete item",
    networkError: "Network connection error",
    serverError: "Server error occurred",
    unknownError: "An unknown error occurred",

    // Additional translations
    toggleMenu: "Toggle menu",
  },

  hi: {
    // Navigation
    dashboard: "डैशबोर्ड",
    clients: "ग्राहक",
    ingredients: "सामग्री",
    menuItems: "मेनू आइटम",
    orders: "ऑर्डर",
    reports: "रिपोर्ट",
    settings: "सेटिंग्स",

    // Dashboard
    cateringManagementSystem: "कैटरिंग प्रबंधन प्रणाली",
    ratnMayurBhajiya: "रत्न मयूर भजिया",
    manageCateringBusiness: "अपने कैटरिंग व्यवसाय को आसानी से प्रबंधित करें - ग्राहकों से ऑर्डर तक रिपोर्ट तक",
    manageClientInfo: "ग्राहक जानकारी और संपर्क प्रबंधित करें",
    manageIngredients: "सामग्री और इकाइयों का प्रबंधन करें",
    manageBhajiyaVarieties: "भजिया किस्मों और व्यंजनों का प्रबंधन करें",
    createManageOrders: "कैटरिंग ऑर्डर बनाएं और प्रबंधित करें",
    generatePDFReports: "पीडीएफ रिपोर्ट और एनालिटिक्स जेनरेट करें",
    systemSettings: "सिस्टम सेटिंग्स और कॉन��फ़िगरेशन",

    // Common
    add: "जोड़ें",
    edit: "संपादित करें",
    delete: "हटाएं",
    save: "सेव करें",
    cancel: "रद्द करें",
    close: "बंद करें",
    confirm: "पुष्टि करें",
    search: "खोजें",
    actions: "क्रियाएं",
    name: "नाम",
    description: "विवरण",
    quantity: "मात्रा",
    unit: "इकाई",
    price: "कीमत",
    total: "कुल",
    date: "तारीख",
    status: "स्थिति",

    // Menu Item Types
    onlyDish: "केवल भजिया (किलो)",
    onlyDishWithChart: "केवल भजिया वाला व्यंजन",
    dishWithoutChart: "डिश में चार्ट नहीं है",
    dishWithChart: "इस डिश में चार्ट और भजिया भी है",

    // Settings
    language: "भाषा",
    selectLanguage: "भाषा चुनें",
    english: "English",
    hindi: "हिंदी",
    gujarati: "ગુજરાતી",

    // Form Labels
    clientName: "ग्राहक का नाम",
    contactNumber: "संपर्क नंबर",
    address: "पता",
    ingredientName: "सामग्री का नाम",
    menuItemName: "मेनू आइटम का नाम",
    orderDate: "ऑर्डर की तारीख",
    deliveryDate: "डिलीवरी की तारीख",

    // Messages
    deleteConfirmation: "क्या आप वाकई इस आइटम को हटाना चाहते हैं?",
    itemDeleted: "आइटम सफलतापूर्वक हटा दिया गया",
    itemSaved: "आइटम सफलतापूर्वक सेव किया गया",
    errorOccurred: "एक त्रुटि हुई",

    // Client Management
    clientManagement: "ग्राहक प्रबंधन",
    addClient: "ग्राहक जोड़ें",
    searchClients: "ग्राहक खोजें...",
    totalClients: "कुल ग्राहक",
    searchResults: "खोज परिणाम",
    withReferences: "संदर्भ के साथ",
    noClientsFound: "कोई ग्राहक नहीं मिला",
    tryAdjustingSearch: "अपने खोज शब्दों को समायोजित करने का प्रयास करें",
    getStartedAddClient: "अपना पहला ग्राहक जोड़कर शुरुआत करें",

    // Ingredient Management
    ingredientManagement: "सामग्री प्रबंधन",
    addIngredient: "सामग्री जोड़ें",
    searchIngredients: "सामग्री खोजें...",
    allUnits: "सभी इकाइयां",
    totalIngredients: "कुल सामग्री",
    weightUnits: "वजन इकाइयां",
    volumeUnits: "आयतन इकाइयां",
    noIngredientsFound: "कोई सामग्री नहीं मिली",
    getStartedAddIngredient: "अपनी पहली सामग्री जोड़कर शुरुआत करें",

    // Additional common terms
    loading: "लोड हो रहा है",
    retry: "पुनः प्रयास करें",
    added: "जोड़ा गया",

    // Menu Item Management
    menuItemManagement: "मेनू आइटम प्रबंधन",
    addMenuItem: "मेनू आइटम जोड़ें",
    searchMenuItems: "मेनू आइटम खोजें...",
    totalMenuItems: "कुल मेनू आइटम",
    noMenuItemsFound: "कोई मेनू आइटम नहीं मिला",
    getStartedAddMenuItem: "अपना पहला मेनू आइटम जोड़कर शुरुआत करें",
    category: "श्रेणी",
    type: "प्रकार",
    defaultType: "डिफ़ॉल्ट प्रकार",

    // Order Management
    orderManagement: "ऑर्डर प्रबंधन",
    createOrder: "ऑर्डर बनाएं",
    searchOrders: "ऑर्डर खोजें...",
    totalOrders: "कुल ऑर्डर",
    noOrdersFound: "कोई ऑર्डर नहीं मिला",
    getStartedCreateOrder: "अपना पहला ऑર्डर बनाकर शुरुआत करें",
    numberOfPeople: "लोगों की संख्या",
    orderType: "ऑर्डर प्रकार",
    orderTime: "ऑर्डर समय",
    eventAddress: "कार्यक्रम का पता",
    menuSelection: "मेनू चयन",
    additionalInfo: "अतिरिक्त जानकारी",
    basicInfo: "बुनियादी जानकारी",
    existingClient: "मौजूदा ग्राहक",
    newClient: "नया ग्राहक",
    selectClient: "ग्राहक चुनें",
    newClientInfo: "नए ग्राहक की जानकारी",
    phone: "फोन",
    reference: "संदर्भ",
    notes: "नोट्स",
    vehicleOwnerName: "वाहन मालिक का नाम",
    vehiclePhoneNumber: "वाहन फोन नंबर",
    chefName: "રसोइया का नाम",
    chefPhoneNumber: "રसोइया फोन नंबर",
    vehicleNumber: "वाहन नंबर",
    additionalHelper: "अतिरिक्त सहायक",

    // Report Management
    reportManagement: "रिपोर्ट प्रबंधन",
    generateReport: "रिपोर्ट जेनरेट करें",
    searchReports: "रिपोर्ट खोजें...",
    totalReports: "कुल रिपोर्ट",
    downloaded: "डाउनलोड किया गया",
    thisMonth: "इस महीने",
    noReportsFound: "कोई रिपोर्ट नहीं मिली",
    getStartedGenerateReport: "अपनी पहली रिपोर्ट जेनरेट करके शुरुआत करें",
    preview: "पूर्वावलोकन",
    downloadPDF: "पीडीएफ डाउनलोड करें",
    generated: "जेनरेट किया गया",
    generatedOn: "जेनरेट किया गया",

    // Order Types
    wedding: "शादी",
    birthdayParty: "जन्मदिन पार्टी",
    corporateEvent: "कॉर्पोरेट इवेंट",
    religiousFunction: "धार्मिक समारोह",
    anniversary: "वર्षगांठ",
    festival: "त्योहार",
    other: "अन्य",

    // Units
    gram: "ग्राम",
    kilogram: "किलोग्राम",
    milliliter: "मिलीलीटर",
    liter: "लीटर",
    piece: "टुकड़ा",

    // Time and Date
    today: "आज",
    yesterday: "कल",
    tomorrow: "कल",
    thisWeek: "इस सप्ताह",
    lastWeek: "पिछले सप्ताह",
    nextWeek: "अगले सप्ताह",

    // Status and States
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    pending: "लंबित",
    completed: "पूर्ण",
    cancelled: "रद्द",
    confirmed: "पुष्ट",

    // Validation Messages
    required: "यह फील्ड आवश्यक है",
    invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
    invalidPhone: "कृपया एक वैध फोन नंबर दर्ज करें",
    minimumLength: "न्यूनतम लंबाई आवश्यक",
    maximumLength: "अधिकतम लंबाई पार हो गई",
    mustBePositive: "मान सकारात्मक होना चाहिए",
    mustBeGreaterThanZero: "मान शून्य से अधिक होना चाहिए",

    // Success Messages
    clientCreated: "ग्राहक सफलतापूर्वक बनाया गया",
    clientUpdated: "ग्राहक सफलतापूर्वक अपडेट किया गया",
    clientDeleted: "ग्राहक सफलतापूर्वक हटाया गया",
    ingredientCreated: "सामग्री सफलतापूर्वक बनाई गई",
    ingredientUpdated: "सामग्री सफलतापूर्वक अपडेट की गई",
    ingredientDeleted: "सामग्री सफलतापूर्वक हटाई गई",
    menuItemCreated: "मेनू आइटम सफलतापूर्वक बनाया गया",
    menuItemUpdated: "मेनू आइटम सफलतापूर्वक अपडेट किया गया",
    menuItemDeleted: "मेनू आइटम सफलतापूर्वक हटाया गया",
    orderCreated: "ऑर्डर सफलतापूर्वक बनाया गया",
    orderUpdated: "ऑર्डर सफलतापूर्वक अपडेट किया गया",
    orderDeleted: "ऑર्डर सफलतापूર्वक हटाया गया",
    reportGenerated: "रिपोर्ट सफलतापूर्वक जेनरेट की गई",

    // Error Messages
    failedToLoad: "डेटा लोड करने में विफल",
    failedToCreate: "आइटम बनाने में विफल",
    failedToUpdate: "आइटम अपडेट करने में विफल",
    failedToDelete: "आइटम हटाने में विफल",
    networkError: "नेटवર्क कनेक्शन त्रुटि",
    serverError: "सर्वर त्रुटि हुई",
    unknownError: "एक अज्ञात त्रुटि हुई",

    // Additional translations
    toggleMenu: "मेनू टॉगल करें",
  },

  gu: {
    // Navigation
    dashboard: "ડેશબોર્ડ",
    clients: "ગ્રાહકો",
    ingredients: "સામગ્રી",
    menuItems: "મેનુ આઇટમ્સ",
    orders: "ઓર્ડર",
    reports: "રિપોર્ટ્સ",
    settings: "સેટિંગ્સ",

    // Dashboard
    cateringManagementSystem: "કેટરિંગ મેનેજમેન્ટ સિસ્ટમ",
    ratnMayurBhajiya: "રત્ન મયૂર ભજિયા",
    manageCateringBusiness: "તમારા કેટરિંગ બિઝનેસને સરળતાથી મેનેજ કરો - ગ્રાહકોથી ઓર્ડર સુધી રિપોર્ટ્સ સુધી",
    manageClientInfo: "ગ્રાહક માહિતી અને સંપર્કો મેનેજ કરો",
    manageIngredients: "સામગ્રી અને એકમો મેનેજ કરો",
    manageBhajiyaVarieties: "ભજિયા પ્રકારો અને રેસિપીઓ મેનેજ કરો",
    createManageOrders: "કેટરિંગ ઓર્ડર બનાવો અને મેનેજ કરો",
    generatePDFReports: "પીડીએફ રિપોર્ટ્સ અને એનાલિટિક્સ જનરેટ કરો",
    systemSettings: "સિસ્ટમ સેટિંગ્સ અને કોન્ફિગરેશન",

    // Common
    add: "ઉમેરો",
    edit: "સંપાદિત કરો",
    delete: "કાઢી નાખો",
    save: "સેવ કરો",
    cancel: "રદ કરો",
    close: "બંધ કરો",
    confirm: "પુષ્ટિ કરો",
    search: "શોધો",
    actions: "ક્રિયાઓ",
    name: "નામ",
    description: "વર્ણન",
    quantity: "માત્રા",
    unit: "એકમ",
    price: "કિંમત",
    total: "કુલ",
    date: "તારીખ",
    status: "સ્થિતિ",

    // Menu Item Types
    onlyDish: "ફક્ત ભજીયા (કિલો)",
    onlyDishWithChart: "ફક્ત ભજીયા સાથેની વાનગી",
    dishWithoutChart: "ડીશમાં ચાર્ટ નથી",
    dishWithChart: "વાનગીમાં ચાર્ટ અને ભજીયા છે",

    // Settings
    language: "ભાષા",
    selectLanguage: "ભાષા પસંદ કરો",
    english: "English",
    hindi: "हिंदी",
    gujarati: "ગુજરાતી",

    // Form Labels
    clientName: "ગ્રાહકનું નામ",
    contactNumber: "સંપર્ક નંબર",
    address: "સરનામું",
    ingredientName: "સામગ્રીનું નામ",
    menuItemName: "મેનુ આઇટમનું નામ",
    orderDate: "ઓર્ડરની તારીખ",
    deliveryDate: "ડિલિવરીની તારીખ",

    // Messages
    deleteConfirmation: "શું તમે ખરેખર આ આઇટમને કાઢી નાખવા માંગો છો?",
    itemDeleted: "આઇટમ સફળતાપૂર્વક કાઢી નાખવામાં આવ્યું",
    itemSaved: "આઇટમ સફળતાપૂર્વક સેવ થયું",
    errorOccurred: "એક ભૂલ આવી",

    // Client Management
    clientManagement: "ગ્રાહક મેનેજમેન્ટ",
    addClient: "ગ્રાહક ઉમેરો",
    searchClients: "ગ્રાહકો શોધો...",
    totalClients: "કુલ ગ્રાહકો",
    searchResults: "શોધ પરિણામો",
    withReferences: "સંદર્ભો સાથે",
    noClientsFound: "કોઈ ગ્રાહકો મળ્યા નથી",
    tryAdjustingSearch: "તમારા શોધ શબ્દોને સમાયોજિત કરવાનો પ્રયાસ કરો",
    getStartedAddClient: "તમારા પ્રથમ ગ્રાહકને ઉમેરીને શરૂઆત કરો",

    // Ingredient Management
    ingredientManagement: "સામગ્રી મેનેજમેન્ટ",
    addIngredient: "સામગ્રી ઉમેરો",
    searchIngredients: "સામગ્રી શોધો...",
    allUnits: "બધા એકમો",
    totalIngredients: "કુલ સામગ્રી",
    weightUnits: "વજન એકમો",
    volumeUnits: "વોલ્યુમ એકમો",
    noIngredientsFound: "કોઈ સામગ્રી મળી નથી",
    getStartedAddIngredient: "તમારી પ્રથમ સામગ્રી ઉમેરીને શરૂઆત કરો",

    // Additional common terms
    loading: "લોડ થઈ રહ્યું છે",
    retry: "ફરી પ્રયાસ કરો",
    added: "ઉમેર્યું",

    // Menu Item Management
    menuItemManagement: "મેનુ આઇટમ મેનેજમેન્ટ",
    addMenuItem: "મેનુ આઇટમ ઉમેરો",
    searchMenuItems: "મેનુ આઇટમ્સ શોધો...",
    totalMenuItems: "કુલ મેનુ આઇટમ્સ",
    noMenuItemsFound: "કોઈ મેનુ આઇટમ્સ મળ્યા નથી",
    getStartedAddMenuItem: "તમારું પ્રથમ મેનુ આઇટમ ઉમેરીને શરૂઆત કરો",
    category: "કેટેગરી",
    type: "પ્રકાર",
    defaultType: "ડિફોલ્ટ પ્રકાર",

    // Order Management
    orderManagement: "ઓર્ડર મેનેજમેન્ટ",
    createOrder: "ઓર્ડર બનાવો",
    searchOrders: "ઓર્ડર શોધો...",
    totalOrders: "કુલ ઓર્ડર",
    noOrdersFound: "કોઈ ઓર્ડર મળ્યા નથી",
    getStartedCreateOrder: "તમારો પ્રથમ ઓર્ડર બનાવીને શરૂઆત કરો",
    numberOfPeople: "લોકોની સંખ્યા",
    orderType: "ઓર્ડર પ્રકાર",
    orderTime: "ઓર્ડર સમય",
    eventAddress: "ઇવેન્ટનું સરનામું",
    menuSelection: "મેનુ પસંદગી",
    additionalInfo: "વધારાની માહિતી",
    basicInfo: "મૂળભૂત માહિતી",
    existingClient: "હાલનો ગ્રાહક",
    newClient: "નવો ગ્રાહક",
    selectClient: "ગ્રાહક પસંદ કરો",
    newClientInfo: "નવા ગ્રાહકની માહિતી",
    phone: "ફોન",
    reference: "સંદર્ભ",
    notes: "નોંધો",
    vehicleOwnerName: "વાહન માલિકનું નામ",
    vehiclePhoneNumber: "વાહન ફોન નંબર",
    chefName: "રસોઇયાનું નામ",
    chefPhoneNumber: "રસોઇયા ફોન નંબર",
    vehicleNumber: "વાહન નંબર",
    additionalHelper: "વધારાનો સહાયક",

    // Report Management
    reportManagement: "રિપોર્ટ મેનેજમેન્ટ",
    generateReport: "રિપોર્ટ જનરેટ કરો",
    searchReports: "રિપોર્ટ્સ શોધો...",
    totalReports: "કુલ રિપોર્ટ્સ",
    downloaded: "ડાઉનલોડ થયેલ",
    thisMonth: "આ મહિને",
    noReportsFound: "કોઈ રિપોર્ટ્સ મળ્યા નથી",
    getStartedGenerateReport: "તમારી પ્રથમ રિપોર્ટ જનરેટ કરીને શરૂઆત કરો",
    preview: "પૂર્વાવલોકન",
    downloadPDF: "પીડીએફ ડાઉનલોડ કરો",
    generated: "જનરેટ થયેલ",
    generatedOn: "જનરેટ થયેલ",

    // Order Types
    wedding: "લગ્ન",
    birthdayParty: "જન્મદિવસ પાર્ટી",
    corporateEvent: "કોર્પોરેટ ઇવેન્ટ",
    religiousFunction: "ધાર્મિક કાર્ય",
    anniversary: "વર્ષગાંઠ",
    festival: "તહેવાર",
    other: "અન્ય",

    // Units
    gram: "ગ્રામ",
    kilogram: "કિલોગ્રામ",
    milliliter: "મિલીલીટર",
    liter: "લીટર",
    piece: "ટુકડો",

    // Time and Date
    today: "આજે",
    yesterday: "ગઈકાલે",
    tomorrow: "આવતીકાલે",
    thisWeek: "આ અઠવાડિયે",
    lastWeek: "ગયા અઠવાડિયે",
    nextWeek: "આવતા અઠવાડિયે",

    // Status and States
    active: "સક્રિય",
    inactive: "નિષ્ક્રિય",
    pending: "બાકી",
    completed: "પૂર્ણ",
    cancelled: "રદ",
    confirmed: "પુષ્ટિ",

    // Validation Messages
    required: "આ ફીલ્ડ આવશ્યક છે",
    invalidEmail: "કૃપા કર��ને માન્ય ઈમેલ સરનામું દાખલ કરો",
    invalidPhone: "કૃપા કરીને માન્ય ફોન નંબર દાખલ કરો",
    minimumLength: "ન્યૂનતમ લંબાઈ આવશ્યક",
    maximumLength: "મહત્તમ લંબાઈ વટાવી",
    mustBePositive: "મૂલ્ય હકારાત્મક હોવું જોઈએ",
    mustBeGreaterThanZero: "મૂલ્ય શૂન્ય કરતાં વધારે હોવું જોઈએ",

    // Success Messages
    clientCreated: "ગ્રાહક સફળતાપૂર્વક બનાવ્યો",
    clientUpdated: "ગ્રાહક સફળતાપૂર્વક અપડેટ થયો",
    clientDeleted: "ગ્રાહક સફળતાપૂર્વક કાઢી નાખ્યો",
    ingredientCreated: "સામગ્રી સફળતાપૂર્વક બનાવી",
    ingredientUpdated: "સામગ્રી સફળતાપૂર્વક અપડેટ થઈ",
    ingredientDeleted: "સામગ્રી સફળતાપૂર્વક કાઢી નાખી",
    menuItemCreated: "મેનુ આઇટમ સફળતાપૂર્વક બનાવ્યું",
    menuItemUpdated: "મેનુ આઇટમ સફળતાપૂર્વક અપડેટ થયું",
    menuItemDeleted: "મેનુ આઇટમ સફળતાપૂર્વક કાઢી નાખ્યું",
    orderCreated: "ઓર્ડર સફળતાપૂર્વક બનાવ્યો",
    orderUpdated: "ઓર્ડર સફળતાપૂર્વક અપડેટ થયો",
    orderDeleted: "ઓર્ડર સફળતાપૂર્વક કાઢી નાખ્યો",
    reportGenerated: "રિપોર્ટ સફળતાપૂર્વક જનરેટ થઈ",

    // Error Messages
    failedToLoad: "ડેટા લોડ કરવામાં નિષ્ફળ",
    failedToCreate: "આઇટમ બનાવવામાં નિષ્ફળ",
    failedToUpdate: "આઇટમ અપડેટ કરવામાં નિષ્ફળ",
    failedToDelete: "આઇટમ કાઢી નાખવામાં નિષ્ફળ",
    networkError: "નેટવર્ક કનેક્શન ભૂલ",
    serverError: "સર્વર ભૂલ આવી",
    unknownError: "એક અજાણી ભૂલ આવી",

    // Additional translations
    toggleMenu: "મેનુ ટૉગલ કરો",
  },
}

export function getTranslation(language: Language): Translations {
  return translations[language] || translations.en
}
