import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PermissionProvider, usePermission } from './contexts/PermissionContext'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FinancialReconciliation from './pages/FinancialReconciliation'
import SettlementApplication from './pages/SettlementApplication'
import InvoiceManagement from './pages/InvoiceManagement'
import PaymentManagement from './pages/PaymentManagement'
import FeeManagement from './pages/FeeManagement'
import SupplyChainFinance from './pages/SupplyChainFinance'
import ContractManagement from './pages/ContractManagement'
import OrderManagement from './pages/OrderManagement'
import ShipmentManagement from './pages/ShipmentManagement'
import SupplierManagement from './pages/SupplierManagement'
import QualityManagement from './pages/QualityManagement'
import EsignAuthorizationApproval from './pages/EsignAuthorizationApproval'
import AnnouncementManagement from './pages/AnnouncementManagement'
// Phase 1 新增
import LicenseManagement from './pages/LicenseManagement'
import UserManagement from './pages/UserManagement'
import SuperAdminConfig from './pages/SuperAdminConfig'

// 默认管理员权限
const DEFAULT_PERMISSION = {
  user: {
    id: '1',
    username: 'admin',
    realName: '系统管理员',
    department: '采购部',
    position: '管理员',
  },
  categories: [
    {
      categoryId: 'CAT001',
      categoryName: '饮料类',
      categoryCode: 'DRINK',
      permissions: ['view', 'edit', 'approve', 'hide'],
    },
    {
      categoryId: 'CAT002',
      categoryName: '零食类',
      categoryCode: 'SNACK',
      permissions: ['view', 'edit', 'approve', 'hide'],
    },
    {
      categoryId: 'CAT003',
      categoryName: '乳制品',
      categoryCode: 'DAIRY',
      permissions: ['view', 'edit', 'approve', 'hide'],
    },
  ],
  roles: ['admin'],
  token: 'default_token',
}

// 外部链接跳转组件
const ExternalRedirect = ({ url }: { url: string }) => {
  useEffect(() => {
    window.location.href = url
  }, [url])
  return null
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(true) // 默认已登录
  const { setPermission, refresh: refreshPermission } = usePermission()

  useEffect(() => {
    // 初始化默认权限
    if (!localStorage.getItem('userPermission')) {
      localStorage.setItem('userPermission', JSON.stringify(DEFAULT_PERMISSION))
      localStorage.setItem('token', DEFAULT_PERMISSION.token)
    }
    const stored = localStorage.getItem('userPermission')
    if (stored) {
      const p = JSON.parse(stored)
      setPermission(p)
      // Phase 1: 同步初始化 retail_userInfo（双层权限）
      if (!localStorage.getItem('retail_userInfo')) {
        const retailUserInfo = {
          id: p.user?.id || '1',
          phone: p.user?.phone || '',
          name: p.user?.realName || p.user?.username || '系统用户',
          supplier_code: p.user?.supplier_code || 'NFS001',
          roles: p.roles || ['super_admin'],
          data_scope_type: 'all',
          data_scope_ids: [],
          categories: p.categories,
        }
        localStorage.setItem('retail_userInfo', JSON.stringify(retailUserInfo))
      }
      refreshPermission()
    }
  }, [setPermission, refreshPermission])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    refreshPermission()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userPermission')
    localStorage.removeItem('retail_userInfo')  // Phase 1
    setIsAuthenticated(false)
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
            <Navigate to="/" /> : 
            <Login onLoginSuccess={handleLoginSuccess} />
        } 
      />
      <Route 
        path="/*" 
        element={
          isAuthenticated ? (
            <MainLayout onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/finance/reconciliation" element={<FinancialReconciliation />} />
                <Route path="/finance/settlement-application" element={<SettlementApplication />} />
                <Route path="/finance/invoices" element={<InvoiceManagement />} />
                <Route path="/finance/payments" element={<PaymentManagement />} />
                <Route path="/finance/fees" element={<FeeManagement />} />
                <Route path="/finance/finance" element={<SupplyChainFinance />} />
                <Route path="/contracts" element={<ContractManagement />} />
                <Route path="/orders" element={<OrderManagement />} />
                <Route path="/shipments" element={<ShipmentManagement />} />
                <Route path="/suppliers" element={<SupplierManagement />} />
                <Route path="/quality" element={<QualityManagement />} />
                <Route path="/licenses" element={<LicenseManagement />} />
                <Route path="/esign-approval" element={<EsignAuthorizationApproval />} />
                <Route path="/announcements" element={<AnnouncementManagement />} />
                {/* Phase 1 新增路由 */}
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/authorization-letters" element={<UserManagement />} />
                <Route path="/operation-logs" element={<UserManagement />} />
                <Route path="/super-admin-config" element={<SuperAdminConfig />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
    </Routes>
  )
}

function App() {
  return (
    <PermissionProvider>
      <AppContent />
    </PermissionProvider>
  )
}

export default App
