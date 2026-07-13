import { Layout, Menu, Avatar, Dropdown, Badge, Space, Typography } from 'antd'
import {
  DashboardOutlined,
  ShoppingOutlined,
  CarOutlined,
  TeamOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  DollarOutlined,
  BankOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  MessageOutlined,
  FileDoneOutlined,
  CreditCardOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { usePermission } from '@/contexts/PermissionContext'
import { useState } from 'react'
import './MainLayout.scss'

const { Header, Sider, Content } = Layout
const { Text } = Typography

interface MainLayoutProps {
  children: React.ReactNode
  onLogout: () => void
}

const MainLayout = ({ children, onLogout }: MainLayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { permission, getManagedCategories } = usePermission()
  const [selectedModule, setSelectedModule] = useState<string>(() => {
    if (location.pathname.startsWith('/finance')) return 'finance'
    if (location.pathname.startsWith('/contracts')) return 'contracts'
    if (location.pathname.startsWith('/orders')) return 'orders'
    if (location.pathname.startsWith('/shipments')) return 'shipments'
    if (location.pathname.startsWith('/suppliers')) return 'suppliers'
    if (location.pathname.startsWith('/quality')) return 'quality'
    if (location.pathname.startsWith('/licenses')) return 'licenses'
    if (location.pathname.startsWith('/announcements')) return 'announcements'
    return 'finance'
  })
  const [subMenuOpen, setSubMenuOpen] = useState<boolean>(true)

  // 一级菜单（左侧 80px 固定 Sider）
  const primaryMenuItems: MenuProps['items'] = [
    { key: 'finance', icon: <DollarOutlined />, label: '财务中心' },
    { key: 'contracts', icon: <FileTextOutlined />, label: '合同管理' },
    { key: 'orders', icon: <ShoppingOutlined />, label: '订单管理' },
    { key: 'shipments', icon: <CarOutlined />, label: '发货管理' },
    { key: 'suppliers', icon: <TeamOutlined />, label: '供应商管理' },
    { key: 'quality', icon: <SafetyOutlined />, label: '质量管理' },
    { key: 'licenses', icon: <SafetyCertificateOutlined />, label: '证照管理' },
    { key: 'announcements', icon: <MessageOutlined />, label: '公告管理' },
  ]

  // 二级菜单（按一级菜单 key 索引，点击一级菜单时切换显示）
  const subMenuMap: Record<string, { name: string; items: MenuProps['items'] }> = {
    finance: {
      name: '财务中心',
      items: [
        { key: '/finance/reconciliation', icon: <FileDoneOutlined />, label: '财务对账' },
        { key: '/finance/settlement-application', icon: <FileTextOutlined />, label: '对账申请' },
        { key: '/finance/invoices', icon: <FileDoneOutlined />, label: '发票管理' },
        { key: '/finance/payments', icon: <CreditCardOutlined />, label: '交款管理' },
        { key: '/finance/fees', icon: <FileDoneOutlined />, label: '费用单管理' },
        { key: '/finance/finance', icon: <BankOutlined />, label: '供应链金融' },
      ],
    },
    contracts: {
      name: '合同管理',
      items: [
        { key: '/contracts', icon: <FileTextOutlined />, label: '合同列表' },
      ],
    },
    orders: {
      name: '订单管理',
      items: [
        { key: '/orders', icon: <ShoppingOutlined />, label: '订单列表' },
      ],
    },
    shipments: {
      name: '发货管理',
      items: [
        { key: '/shipments', icon: <CarOutlined />, label: '发货列表' },
      ],
    },
    suppliers: {
      name: '供应商管理',
      items: [
        { key: '/suppliers', icon: <TeamOutlined />, label: '供应商列表' },
      ],
    },
    quality: {
      name: '质量管理',
      items: [
        { key: '/quality', icon: <SafetyOutlined />, label: '质量问题单' },
      ],
    },
    licenses: {
      name: '证照管理',
      items: [
        { key: '/licenses', icon: <SafetyCertificateOutlined />, label: '证照列表' },
        { key: '/esign-approval', icon: <FileTextOutlined />, label: '授权书审批' },
      ],
    },
    announcements: {
      name: '公告管理',
      items: [
        { key: '/announcements', icon: <MessageOutlined />, label: '公告列表' },
      ],
    },
  }

  // 根据当前选中的一级菜单获取二级菜单内容
  const currentSubMenu = subMenuMap[selectedModule] || subMenuMap.finance

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: '个人信息' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: onLogout },
  ]

  const categories = getManagedCategories()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左侧一级菜单（80px 固定 Sider） */}
      <Sider width={80} className="primary-sider">
        <div className="primary-logo">
          <Avatar size={40} style={{ backgroundColor: '#FFD700', color: '#000', fontWeight: 'bold' }}>Z</Avatar>
        </div>
        <Menu
          mode="vertical"
          selectedKeys={[selectedModule]}
          items={primaryMenuItems}
          onClick={({ key }) => {
            if (key === selectedModule) {
              setSubMenuOpen(!subMenuOpen)
            } else {
              setSelectedModule(key as string)
              setSubMenuOpen(true)
            }
          }}
          className="primary-menu"
        />
      </Sider>

      {/* 左侧二级菜单（可收起，根据选中的一级菜单动态显示） */}
      <Sider
        width={200}
        collapsedWidth={0}
        collapsed={!subMenuOpen}
        className="secondary-sider"
      >
        <div className="secondary-title">{currentSubMenu.name}</div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={currentSubMenu.items}
          onClick={({ key }) => navigate(key)}
          className="secondary-menu"
        />
        {categories.length > 0 && (
          <div className="secondary-footer">
            <Text type="secondary" style={{ fontSize: 12 }}>管理品类</Text>
            <div style={{ marginTop: 8 }}>
              {categories.map(cat => (
                <div key={cat.categoryId} className="category-tag">
                  {cat.categoryName}
                </div>
              ))}
            </div>
          </div>
        )}
      </Sider>

      <Layout>
        <Header className="top-header">
          <Text strong style={{ fontSize: 18 }}>
            供应链协同平台 - 零售商端
          </Text>
          <Space size={24}>
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: 20 }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <Text>{permission?.user.realName}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
