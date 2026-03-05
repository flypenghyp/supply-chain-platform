import { createContext, useContext, useState, ReactNode } from 'react'
import type { UserPermission, CategoryPermission } from '@/types'

interface PermissionContextType {
  permission: UserPermission | null
  setPermission: (permission: UserPermission | null) => void
  hasPermission: (categoryId: string, action: string) => boolean
  canView: (categoryId: string) => boolean
  canEdit: (categoryId: string) => boolean
  canApprove: (categoryId: string) => boolean
  canHide: (categoryId: string) => boolean
  getManagedCategories: () => CategoryPermission[]
  isAdmin: () => boolean
}

const PermissionContext = createContext<PermissionContextType>({
  permission: null,
  setPermission: () => {},
  hasPermission: () => false,
  canView: () => false,
  canEdit: () => false,
  canApprove: () => false,
  canHide: () => false,
  getManagedCategories: () => [],
  isAdmin: () => false,
})

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const [permission, setPermission] = useState<UserPermission | null>(() => {
    const stored = localStorage.getItem('userPermission')
    return stored ? JSON.parse(stored) : null
  })

  const isAdmin = () => {
    return permission?.roles.includes('admin') || false
  }

  const hasPermission = (categoryId: string, action: string): boolean => {
    if (!permission) return false
    if (isAdmin()) return true
    
    const category = permission.categories.find((c) => c.categoryId === categoryId)
    return category?.permissions.includes(action) || false
  }

  const canView = (categoryId: string): boolean => hasPermission(categoryId, 'view')
  const canEdit = (categoryId: string): boolean => hasPermission(categoryId, 'edit')
  const canApprove = (categoryId: string): boolean => hasPermission(categoryId, 'approve')
  const canHide = (categoryId: string): boolean => hasPermission(categoryId, 'hide')

  const getManagedCategories = (): CategoryPermission[] => {
    return permission?.categories || []
  }

  return (
    <PermissionContext.Provider
      value={{
        permission,
        setPermission,
        hasPermission,
        canView,
        canEdit,
        canApprove,
        canHide,
        getManagedCategories,
        isAdmin,
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermission = () => useContext(PermissionContext)
