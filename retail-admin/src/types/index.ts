// 用户信息
export interface UserInfo {
  id: string
  username: string
  realName: string
  department: string
  position: string
  avatar?: string
}

// 品类权限
export interface CategoryPermission {
  categoryId: string
  categoryName: string
  categoryCode: string
  permissions: string[] // ['view', 'edit', 'approve', 'hide']
}

// 用户权限信息
export interface UserPermission {
  user: UserInfo
  categories: CategoryPermission[]
  roles: string[]
  token: string
}

// 订单
export interface Order {
  id: string
  orderNo: string
  supplierId: string
  supplierName: string
  categoryId: string
  categoryName: string
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled'
  totalAmount: number
  orderDate: string
  expectedDeliveryDate: string
  items: OrderItem[]
  hidden: boolean
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  amount: number
}

// 发货单
export interface Shipment {
  id: string
  shipmentNo: string
  orderNo: string
  supplierId: string
  supplierName: string
  categoryId: string
  categoryName: string
  status: 'pending' | 'in_transit' | 'delivered' | 'completed'
  shipmentDate: string
  estimatedArrival: string
  actualArrival?: string
  totalAmount: number
  logisticsCompany: string
  trackingNo: string
  hidden: boolean
  items?: ShipmentItem[]
}

// 发货明细
export interface ShipmentItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unit: string
}

// 隐藏记录
export interface HideRecord {
  id: string
  documentType: string
  documentNo: string
  documentTitle: string
  categoryId: string
  categoryName: string
  supplierName: string
  hidden: boolean
  operator: string
  operateTime: string
  reason: string
}
