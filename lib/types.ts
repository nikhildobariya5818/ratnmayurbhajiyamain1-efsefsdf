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
  isDefault: boolean
  defaultValue?: number // Default value is 12 kg for default ingredients
  incrementThreshold?: number // Number of menu items before increment starts (e.g., 3 for Bhajiya, 2 for Dhana)
  incrementAmount?: number // How much to add per extra menu item (e.g., 3 kg for Bhajiya, 2 kg for Dhana)
  createdAt: Date
  updatedAt: Date
}

export interface MenuItemIngredient {
  ingredientId: string
  ingredient?: Ingredient
  isDefaultIngredient: boolean // Whether this is a default ingredient for this menu item
  // Quantities for different menu item types (per 100 people)
  quantities: {
    onlyBhajiyaKG: number // Only bhajiya (KG)
    dishWithOnlyBhajiya: number // Dish with Only bhajiya
    dishHaveNoChart: number // Dish have no Chart
    dishHaveChartAndBhajiya: number // Dish have Chart & Bhajiya
  }
}

export interface MenuItem {
  _id?: string
  name: string
  category: string
  type: "only_bhajiya_kg" | "dish_with_only_bhajiya" | "dish_have_no_chart" | "dish_have_chart_bhajiya"
  ingredients: MenuItemIngredient[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderMenuItem {
  menuItemId: string
  menuItem?: MenuItem
  name: string
  category: string
  type: string
  // Snapshot of ingredients at order time
  ingredients: {
    ingredientId: string
    ingredientName: string
    unit: string
    isDefaultIngredient: boolean
    quantityPer100: number // Quantity for 100 people
  }[]
}

export interface Order {
  _id?: string
  clientId?: string
  client?: Client
  clientSnapshot?: {
    name: string
    phone: string
    address: string
    reference?: string
  }
  orderNumber: string
  numberOfPeople: number
  address: string
  orderType: string
  orderDate: Date
  orderTime: string
  menuItems: OrderMenuItem[]
  // Admin fields for delivery
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

// Summary for orders showing final ingredient quantities
export interface OrderSummary {
  orderDetails: Order
  ingredientSummary: {
    ingredientId: string
    ingredientName: string
    unit: string
    totalQuantity: number
    formattedValue: string // Added formattedValue to store quantity with unit type (e.g., "12 kg", "500 ml")
    isDefault: boolean
  }[]
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
  isDefault: boolean
  defaultValue?: number
}

export interface MenuItemFormData {
  name: string
  category: string
  type: "only_bhajiya_kg" | "dish_with_only_bhajiya" | "dish_have_no_chart" | "dish_have_chart_bhajiya"
  ingredients: {
    ingredientId: string
    isDefaultIngredient: boolean
    quantities: {
      onlyBhajiyaKG: number
      dishWithOnlyBhajiya: number
      dishHaveNoChart: number
      dishHaveChartAndBhajiya: number
    }
  }[]
}

export interface OrderFormData {
  orderNumber: string
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
