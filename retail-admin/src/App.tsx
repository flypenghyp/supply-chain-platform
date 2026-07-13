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
  const { setPermission } = usePermission()

  useEffect(() => {
    // 初始化默认权限
    if (!localStorage.getItem('userPermission')) {
      localStorage.setItem('userPermission', JSON.stringify(DEFAULT_PERMISSION))
      localStorage.setItem('token', DEFAULT_PERMISSION.token)
    }
    const stored = localStorage.getItem('userPermission')
    if (stored) {
      setPermission(JSON.parse(stored))
    }
  }, [setPermission])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userPermission')
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
                <Route path="/licenses" element={<ExternalRedirect url="https://hlj.rainbowcn.com/oep-manage/business/supplier/daily-manage/certificate/list" />} />
                <Route path="/esign-approval" element={<EsignAuthorizationApproval />} />
                <Route path="/announcements" element={<AnnouncementManagement />} />
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
