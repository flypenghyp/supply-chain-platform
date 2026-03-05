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
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { usePermission } from '@/contexts/PermissionContext'

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

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '工作台',
    },
    {
      key: '/finance',
      icon: <DollarOutlined />,
      label: '财务中心',
    },
    {
      key: '/enterprise',
      icon: <BankOutlined />,
      label: '企业中心',
    },
    {
      key: '/contracts',
      icon: <FileTextOutlined />,
      label: '合同管理',
    },
    { type: 'divider' },
    {
      key: '/orders',
      icon: <ShoppingOutlined />,
      label: '订单管理',
    },
    {
      key: '/shipments',
      icon: <CarOutlined />,
      label: '发货管理',
    },
    {
      key: '/suppliers',
      icon: <TeamOutlined />,
      label: '供应商管理',
    },
  ]

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: onLogout,
    },
  ]

  const categories = getManagedCategories()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={220}>
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Text strong style={{ fontSize: 16 }}>零售商后台</Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
        <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>管理品类</Text>
          <div style={{ marginTop: 8 }}>
            {categories.map(cat => (
              <div key={cat.categoryId} style={{ 
                padding: '4px 8px', 
                background: '#f6ffed',
                borderRadius: 4,
                marginBottom: 4,
                fontSize: 12
              }}>
                {cat.categoryName}
              </div>
            ))}
          </div>
        </div>
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
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
