// Database Models and Types

export interface Client {
  _id?: string
  name: string
  phone: string
  address: string
  reference?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Ingredient {
  _id?: string
  name: string
  unit: "gram" | "kg" | "ml" | "L" | "piece" | "જબલા"
  createdAt: Date
  updatedAt: Date
}

export interface MenuItemIngredient {
  ingredientId: string
  ingredient?: Ingredient // Populated field
  // Quantities for different menu item types (per 100 people)
  singleItems: {
    onlyDishQuantity: number
    onlyDishWithChartQuantity: number
    dishWithoutChartQuantity: number
    dishWithChartQuantity: number
  }
  multiItems: {
    onlyDishQuantity: number
    onlyDishWithChartQuantity: number
    dishWithoutChartQuantity: number
    dishWithChartQuantity: number
  }
  // Legacy fields for backward compatibility - will be removed later
  onlyDishQuantity: number
  onlyDishWithChartQuantity: number
  dishWithoutChartQuantity: number
  dishWithChartQuantity: number
}

export interface MenuItem {
  _id?: string
  name: string
  category: string
  type: "only_dish" | "only_dish_with_chart" | "dish_without_chart" | "dish_with_chart"
  ingredients: MenuItemIngredient[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderMenuItem {
  menuItemId: string
  menuItem?: MenuItem // Populated field
  selectedType: "only_dish" | "only_dish_with_chart" | "dish_without_chart" | "dish_with_chart"
  // Snapshot of menu item at order time
  name: string
  category: string
  type: string
  ingredients: {
    ingredientId: string
    ingredientName: string
    unit: string
    quantityPer100: number // This will be the quantity for the selected type
  }[]
}

export interface Order {
  _id?: string
  clientId?: string
  client?: Client // Populated field
  // Client snapshot for new clients
  clientSnapshot?: {
    name: string
    phone: string
    address: string
    reference?: string
  }
  numberOfPeople: number
  address: string
  orderType: string
  orderDate: Date
  orderTime: string
  menuItems: OrderMenuItem[]
  // Additional admin fields for PDF
  vehicleOwnerName?: string
  phoneNumber?: string
  vehicleNumberPlaceholder?: string
  time?: string
  chefName?: string
  chefPhoneNumber?: string
  addHelper?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Form Types
export interface ClientFormData {
  name: string
  phone: string
  address: string
  reference?: string
  notes?: string
}

export interface IngredientFormData {
  name: string
  unit: "gram" | "kg" | "ml" | "L" | "piece" | "જબલા"
}

export interface MenuItemFormData {
  name: string
  category: string
  type: "only_dish" | "only_dish_with_chart" | "dish_without_chart" | "dish_with_chart"
  ingredients: {
    ingredientId: string
    singleItems: {
      onlyDishQuantity: number
      onlyDishWithChartQuantity: number
      dishWithoutChartQuantity: number
      dishWithChartQuantity: number
    }
    multiItems: {
      onlyDishQuantity: number
      onlyDishWithChartQuantity: number
      dishWithoutChartQuantity: number
      dishWithChartQuantity: number
    }
    // Legacy fields for backward compatibility
    onlyDishQuantity: number
    onlyDishWithChartQuantity: number
    dishWithoutChartQuantity: number
    dishWithChartQuantity: number
  }[]
}

export interface OrderFormData {
  clientId?: string
  clientSnapshot?: {
    name: string
    phone: string
    address: string
    reference?: string
  }
  numberOfPeople: number
  address: string
  orderType: string
  orderDate: string
  orderTime: string
  menuItems: {
    menuItemId: string
    selectedType: "only_dish" | "only_dish_with_chart" | "dish_without_chart" | "dish_with_chart"
  }[]
  vehicleOwnerName?: string
  phoneNumber?: string
  vehicleNumberPlaceholder?: string
  time?: string
  chefName?: string
  chefPhoneNumber?: string
  addHelper?: string
  notes?: string
}

// Additional types for scaling ingredients
export interface ScaledIngredient {
  ingredientId: string
  ingredientName: string
  unit: string
  totalQuantity: number
}
