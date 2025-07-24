export interface Product {
  id: string
  name: string
  category: string
  unit: string
}

export interface PriceData {
  productId: string
  productName: string
  department: string
  city: string
  market: string
  price: number
  unit: string
  date: string
  latitude?: number
  longitude?: number
}

export interface DepartmentData {
  name: string
  code: string
  latitude: number
  longitude: number
  averagePrice?: number
  priceData?: PriceData[]
}

export interface ApiResponse {
  success: boolean
  data: any[]
  message?: string
}
