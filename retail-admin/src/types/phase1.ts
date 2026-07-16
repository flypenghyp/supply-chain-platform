// Phase 1 新增类型 - 用户管理 / 授权委托书 / 证照 / 操作日志

export interface SupplierUser {
  id: string
  supplier_code: string
  name: string
  phone: string
  email?: string
  role: string                  // 'admin' | 'staff' | 'area_manager' 等
  role_name: string
  role_type: 'system' | 'custom'
  status: 'active' | 'inactive'
  permissions?: string[]
  data_scope_type?: DataScopeType
  data_scope_ids?: string[]
  created_by?: string
  created_at: string
  updated_at: string
  last_login_time?: string
}

export interface Role {
  id: string
  code: string
  name: string
  description?: string
  type: 'system' | 'custom'
  permissions: string[]
  status: 'active' | 'inactive'
  created_by?: string
  created_at: string
  updated_at: string
}

export type DataScopeType = 'all' | 'region' | 'store' | 'counter' | 'none'

// 授权委托书
export interface Authorization {
  id: string
  supplier_code: string
  submitter_user_id: string
  submitter_name: string
  submitter_phone?: string
  file_url: string
  file_type?: 'pdf' | 'image'
  file_size?: number
  auth_no?: string
  auth_start_date?: string
  auth_end_date?: string
  authorizer_name?: string
  authorizee_name?: string
  status: 'pending' | 'approved' | 'rejected'
  reject_reason?: string
  reviewer_id?: string
  reviewer_name?: string
  review_time?: string
  created_at: string
  updated_at: string
}

// 证照
export interface License {
  id: string
  supplier_code: string
  store_id?: string
  license_type: string
  license_name: string
  license_no?: string
  issue_date?: string
  expire_date?: string | null
  is_permanent: boolean
  issuing_authority?: string
  image_url?: string
  ai_recognized: boolean
  ai_raw_data?: any
  status: 'active' | 'expired' | 'pending' | 'rejected'
  version: number
  parent_id?: string | null
  reject_reason?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface LicenseType {
  code: string
  name: string
  category: string
  enabled: boolean
}

// 操作日志
export interface OperationLog {
  id: string
  user_id: string
  user_name: string
  supplier_code: string
  module: 'user' | 'license' | 'super_admin' | 'authorization' | 'permission'
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'login' | 'logout'
  target_id?: string
  target_type?: string
  detail?: any
  result: 'success' | 'failed'
  error_message?: string
  ip_address?: string
  user_agent?: string
  operation_time: string
}

// 17 类证照枚举
export const LICENSE_TYPES: LicenseType[] = [
  { code: 'business_license', name: '营业执照', category: '基础证照', enabled: true },
  { code: 'food_license', name: '食品经营许可证', category: '基础证照', enabled: true },
  { code: 'health_license', name: '卫生许可证', category: '基础证照', enabled: true },
  { code: 'tax_registration', name: '税务登记证', category: '基础证照', enabled: true },
  { code: 'organization_code', name: '组织机构代码证', category: '基础证照', enabled: true },
  { code: 'production_license', name: '生产许可证', category: '行业证照', enabled: true },
  { code: 'import_license', name: '进出口许可证', category: '行业证照', enabled: true },
  { code: 'medical_device_license', name: '医疗器械经营许可证', category: '行业证照', enabled: true },
  { code: 'drug_license', name: '药品经营许可证', category: '行业证照', enabled: true },
  { code: 'cosmetic_license', name: '化妆品经营许可证', category: '行业证照', enabled: true },
  { code: 'alcohol_license', name: '酒类批发许可证', category: '行业证照', enabled: false },
  { code: 'tobacco_license', name: '烟草专卖零售许可证', category: '行业证照', enabled: false },
  { code: 'trademark_certificate', name: '商标注册证', category: '知识产权', enabled: false },
  { code: 'patent_certificate', name: '专利证书', category: '知识产权', enabled: false },
  { code: 'quality_certificate', name: '产品质量认证证书', category: '质量认证', enabled: false },
  { code: 'iso_certificate', name: 'ISO 体系认证', category: '质量认证', enabled: false },
  { code: 'inspection_report', name: '检验报告', category: '质量认证', enabled: false },
]

// API 响应格式
export interface ApiResponse<T = any> {
  code: number
  message?: string
  data?: T
}
