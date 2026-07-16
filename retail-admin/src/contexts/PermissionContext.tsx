import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

// ============== 双层权限体系 ==============
// 1. 角色权限 (Role-based): super_admin | area_manager | store_manager | staff | finance
// 2. 数据权限 (Data-scope): all | region | store | counter

export type UserRole = 'super_admin' | 'area_manager' | 'store_manager' | 'staff' | 'finance'
export type DataScopeType = 'all' | 'region' | 'store' | 'counter' | 'none'

export interface RetailUserInfo {
  id: string
  phone: string
  name: string
  supplier_code: string
  roles: UserRole[]
  data_scope_type: DataScopeType
  data_scope_ids: string[]
  // 旧字段保留（品类权限）- 兼容
  categories?: Array<{
    categoryId: string
    categoryName: string
    categoryCode: string
    permissions: string[]
  }>
}

interface PermissionContextType {
  user: RetailUserInfo | null
  setUser: (user: RetailUserInfo | null) => void
  refresh: () => void

  // 旧 API 兼容
  permission: RetailUserInfo | null
  setPermission: (u: any) => void
  getManagedCategories: () => any[]

  // 角色相关
  isAdmin: boolean
  isSuperAdmin: boolean
  isAreaManager: boolean
  isStoreManager: boolean
  isStaff: boolean
  isFinance: boolean
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean

  // 数据权限
  hasDataScope: (storeId: string) => boolean
  dataScopeType: DataScopeType
  dataScopeIds: string[]

  // 旧 API（兼容）
  hasPermission: (categoryId: string, action: string) => boolean
  canView: (categoryId: string) => boolean
  canEdit: (categoryId: string) => boolean
  canApprove: (categoryId: string) => boolean
}

const STORAGE_KEY = 'retail_userInfo'

const PermissionContext = createContext<PermissionContextType>({
  user: null,
  setUser: () => {},
  refresh: () => {},
  permission: null,
  setPermission: () => {},
  getManagedCategories: () => [],
  isAdmin: false,
  isSuperAdmin: false,
  isAreaManager: false,
  isStoreManager: false,
  isStaff: false,
  isFinance: false,
  hasRole: () => false,
  hasAnyRole: () => false,
  hasDataScope: () => false,
  dataScopeType: 'none',
  dataScopeIds: [],
  hasPermission: () => false,
  canView: () => false,
  canEdit: () => false,
  canApprove: () => false,
})

// 解析 userInfo，兼容旧格式
function parseUserInfo(): RetailUserInfo | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  try {
    const parsed = JSON.parse(stored)
    // 兼容旧 userPermission 格式
    if (parsed && !parsed.roles && parsed.user) {
      return {
        id: parsed.user.id || '1',
        phone: parsed.user.phone || '',
        name: parsed.user.realName || parsed.user.username || '系统用户',
        supplier_code: parsed.user.supplier_code || 'NFS001',
        roles: (parsed.roles as UserRole[]) || ['super_admin'],
        data_scope_type: 'all',
        data_scope_ids: [],
        categories: parsed.categories,
      }
    }
    return parsed
  } catch {
    return null
  }
}

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<RetailUserInfo | null>(() => parseUserInfo())

  // 刷新 userInfo（从 localStorage 重读）
  const refresh = useCallback(() => {
    setUserState(parseUserInfo())
  }, [])

  // 写回 localStorage
  const setUser = useCallback((u: RetailUserInfo | null) => {
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    setUserState(u)
  }, [])

  // 跨 tab 同步
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh()
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [refresh])

  const roles = user?.roles || []
  const isAdmin = roles.includes('super_admin')
  const isSuperAdmin = isAdmin
  const isAreaManager = roles.includes('area_manager')
  const isStoreManager = roles.includes('store_manager')
  const isStaff = roles.includes('staff')
  const isFinance = roles.includes('finance')

  const hasRole = (role: UserRole) => roles.includes(role)
  const hasAnyRole = (allowedRoles: UserRole[]) => allowedRoles.some(r => roles.includes(r))

  const dataScopeType = user?.data_scope_type || 'none'
  const dataScopeIds = user?.data_scope_ids || []
  const hasDataScope = (storeId: string) => {
    if (isAdmin || dataScopeType === 'all') return true
    if (dataScopeType === 'none' || !dataScopeIds.length) return false
    return dataScopeIds.includes(storeId)
  }

  // 旧 API（兼容品类权限）
  const hasPermission = (categoryId: string, action: string): boolean => {
    if (isAdmin) return true
    const category = user?.categories?.find(c => c.categoryId === categoryId)
    return category?.permissions.includes(action) || false
  }
  const canView = (categoryId: string) => hasPermission(categoryId, 'view')
  const canEdit = (categoryId: string) => hasPermission(categoryId, 'edit')
  const canApprove = (categoryId: string) => hasPermission(categoryId, 'approve')
  const getManagedCategories = () => user?.categories || []

  return (
    <PermissionContext.Provider
      value={{
        user,
        setUser,
        // 旧 API 兼容
        permission: user,
        setPermission: (u: any) => {
          if (!u) {
            setUser(null)
            return
          }
          if (u.user && !u.roles) {
            setUser({
              id: u.user.id,
              phone: u.user.phone,
              name: u.user.realName || u.user.username,
              supplier_code: u.user.supplier_code,
              roles: u.roles || ['super_admin'],
              data_scope_type: 'all',
              data_scope_ids: [],
              categories: u.categories,
            })
          } else {
            setUser(u)
          }
        },
        refresh,
        isAdmin,
        isSuperAdmin,
        isAreaManager,
        isStoreManager,
        isStaff,
        isFinance,
        hasRole,
        hasAnyRole,
        hasDataScope,
        dataScopeType,
        dataScopeIds,
        hasPermission,
        canView,
        canEdit,
        canApprove,
        getManagedCategories,
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermission = () => useContext(PermissionContext)
