import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Affix, Button, Avatar, Dropdown, Input, Typography } from 'antd';

const { Title } = Typography;
import {
  DashboardOutlined,
  ShoppingOutlined,
  ProductOutlined,
  FileTextOutlined,
  MenuOutlined,
  TruckOutlined,
  BarChartOutlined,
  GiftOutlined,
  SafetyOutlined,
  MoneyCollectOutlined,
  FileDoneOutlined,
  CreditCardOutlined,
  BankOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  BellOutlined,
  MessageOutlined,
  DollarOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Shipments from './pages/Shipments';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import BidManagement from './pages/BidManagement';
import PriceManagement from './pages/PriceManagement';
import Quality from './pages/Quality';
import Reconciliation from './pages/Reconciliation';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Fees from './pages/Fees';
import Finance from './pages/Finance';
import Account from './pages/Account';
import Service from './pages/Service';
import ProductManagement from './pages/ProductManagement';
import Contracts from './pages/Contracts';
import './styles/App.css';

const { Header, Sider, Content, Footer } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({
    code: 'NFS001',
    name: '农夫山泉股份有限公司'
  });
  const [availableSuppliers, setAvailableSuppliers] = useState([
    { code: 'NFS001', name: '农夫山泉股份有限公司' },
    { code: 'NFS002', name: '农夫山泉北京分公司' },
    { code: 'NFS003', name: '农夫山泉上海分公司' }
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = (path: string) => {
    const titles: any = {
      '/': '工作台',
      '/orders': '订单管理',
      '/shipments': '发货管理',
      '/inventory': '库存查询',
      '/sales': '销售数据',
      '/bid-management': '竞价管理',
      '/price-management': '价格管理',
      '/quality': '质量管理',
      '/reconciliation': '财务对账',
      '/invoices': '发票管理',
      '/payments': '收款管理',
      '/fees': '费用单管理',
      '/finance': '供应链金融',
      '/account/company': '企业信息管理',
      '/account/certificates': '供应商资质证照',
      '/account/users': '人员管理',
      '/service': '服务中心',
      '/product-management': '商品管理',
      '/contracts': '合同管理',
    };
    return titles[path] || '供应商协同平台';
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '工作台',
      onClick: () => navigate('/'),
    },
    {
      type: 'divider',
    },
    {
      key: 'business',
      icon: <ShoppingOutlined />,
      label: '业务中心',
      children: [
        {
          key: '/orders',
          icon: <FileTextOutlined />,
          label: '订单管理',
          onClick: () => navigate('/orders'),
        },
        {
          key: '/shipments',
          icon: <TruckOutlined />,
          label: '发货管理',
          onClick: () => navigate('/shipments'),
        },
        {
          key: '/inventory',
          icon: <BarChartOutlined />,
          label: '库存查询',
          onClick: () => navigate('/inventory'),
        },
        {
          key: '/sales',
          icon: <BarChartOutlined />,
          label: '销售数据',
          onClick: () => navigate('/sales'),
        },
        {
          key: '/bid-management',
          icon: <ShoppingOutlined />,
          label: '竞价管理',
          onClick: () => navigate('/bid-management'),
        },
        {
          key: '/price-management',
          icon: <DollarOutlined />,
          label: '价格管理',
          onClick: () => navigate('/price-management'),
        },
        {
          key: '/quality',
          icon: <SafetyOutlined />,
          label: '质量管理',
          onClick: () => navigate('/quality'),
        },
        {
          key: '/product-management',
          icon: <ProductOutlined />,
          label: '商品管理',
          onClick: () => navigate('/product-management'),
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: 'financial',
      icon: <MoneyCollectOutlined />,
      label: '财务中心',
      children: [
        {
          key: '/reconciliation',
          icon: <FileDoneOutlined />,
          label: '财务对账',
          onClick: () => navigate('/reconciliation'),
        },
        {
          key: '/invoices',
          icon: <FileDoneOutlined />,
          label: '发票管理',
          onClick: () => navigate('/invoices'),
        },
        {
          key: '/payments',
          icon: <CreditCardOutlined />,
          label: '收款管理',
          onClick: () => navigate('/payments'),
        },
        {
          key: '/fees',
          icon: <FileDoneOutlined />,
          label: '费用单管理',
          onClick: () => navigate('/fees'),
        },
        {
          key: '/finance',
          icon: <BankOutlined />,
          label: '供应链金融',
          onClick: () => navigate('/finance'),
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: 'enterprise',
      icon: <UserOutlined />,
      label: '企业中心',
      children: [
        {
          key: '/account/company',
          label: '企业信息管理',
          onClick: () => navigate('/account/company'),
        },
        {
          key: '/account/certificates',
          label: '供应商资质证照',
          onClick: () => navigate('/account/certificates'),
        },
        {
          key: '/account/users',
          label: '人员管理',
          onClick: () => navigate('/account/users'),
        },
      ],
    },
    {
      key: '/contracts',
      icon: <FileDoneOutlined />,
      label: '合同管理',
      onClick: () => navigate('/contracts'),
    },
    {
      type: 'divider',
    },
    {
      key: '/service',
      icon: <CustomerServiceOutlined />,
      label: '服务中心',
      onClick: () => navigate('/service'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={200}
        style={{ backgroundColor: '#001529' }}
      >
        <div style={{ padding: '20px', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          {!collapsed && '供应链平台'}
        </div>

        {/* 供应商切换区域 */}
        {!collapsed ? (
          <div style={{ padding: '0 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '8px' }}>
              当前供应商
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', flex: 1 }}>
                {currentSupplier.name}
              </div>
              <Dropdown
                menu={{
                  items: availableSuppliers.map(supplier => ({
                    key: supplier.code,
                    label: supplier.name,
                    onClick: () => setCurrentSupplier(supplier)
                  }))
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<UserOutlined />}
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    marginLeft: '8px'
                  }}
                />
              </Dropdown>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' }}>
              代码: {currentSupplier.code}
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Dropdown
              menu={{
                items: availableSuppliers.map(supplier => ({
                  key: supplier.code,
                  label: supplier.name,
                  onClick: () => setCurrentSupplier(supplier)
                }))
              }}
              placement="right"
              trigger={['click']}
            >
              <Button
                type="text"
                size="small"
                icon={<UserOutlined />}
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
                title={`当前供应商: ${currentSupplier.name}`}
              />
            </Dropdown>
          </div>
        )}

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px' }}
            />
            <h1 style={{ marginLeft: '16px', marginBottom: 0, color: '#1890ff' }}>{getPageTitle(location.pathname)}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* AI智能助手悬浮按钮 */}
            <Affix style={{ position: 'fixed', top: '50%', right: aiAssistantVisible ? '420px' : '20px', zIndex: 1000 }}>
              <Button
                type="primary"
                shape="circle"
                size="large"
                icon={<MessageOutlined />}
                onClick={() => setAiAssistantVisible(!aiAssistantVisible)}
                style={{
                  backgroundColor: aiAssistantVisible ? '#f5222d' : '#1890ff',
                  boxShadow: '0 4px 12px rgba(24,144,255,0.3)',
                  animation: aiAssistantVisible ? 'none' : 'pulse 2s infinite',
                  transition: 'all 0.3s ease'
                }}
                title={aiAssistantVisible ? "关闭AI助手" : "AI智能助手"}
              />
            </Affix>

            {/* 消息通知 */}
            <Button
              type="text"
              icon={<BellOutlined />}
              size="large"
              style={{ color: '#666' }}
              title="消息通知"
            />

            {/* 用户头像下拉菜单 */}
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: '个人资料',
                  },
                  {
                    key: 'settings',
                    icon: <UserOutlined />,
                    label: '账号设置',
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'logout',
                    label: '退出登录',
                    danger: true,
                  },
                ],
              }}
              placement="bottomRight"
            >
              <Avatar
                size="large"
                style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>

        <Content style={{ background: '#f0f2f5', overflow: 'initial' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/bid-management" element={<BidManagement />} />
            <Route path="/price-management" element={<PriceManagement />} />
            <Route path="/quality" element={<Quality />} />
            <Route path="/reconciliation" element={<Reconciliation />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/company" element={<Account />} />
            <Route path="/account/certificates" element={<Account />} />
            <Route path="/account/users" element={<Account />} />
            <Route path="/service" element={<Service />} />
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/contracts" element={<Contracts />} />
          </Routes>
        </Content>

        <Footer style={{ textAlign: 'center', backgroundColor: '#001529', color: '#fff' }}>
          Supply Chain Collaboration Platform © 2024
        </Footer>
      </Layout>

      {/* AI智能助手侧边面板 */}
      {aiAssistantVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          height: '100vh',
          backgroundColor: '#fff',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.15)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease',
          transform: aiAssistantVisible ? 'translateX(0)' : 'translateX(100%)'
        }}>
          {/* AI助手头部 */}
          <div style={{
            backgroundColor: '#1890ff',
            color: '#fff',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MessageOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
              <span style={{ fontWeight: 'bold' }}>AI智能助手</span>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setAiAssistantVisible(false)}
              style={{ color: '#fff' }}
            />
          </div>

          {/* 助手内容区域 */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflow: 'auto',
            backgroundColor: '#f8f9fa'
          }}>
            {/* 欢迎消息 */}
            <div style={{
              backgroundColor: '#e6f7ff',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #91d5ff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Avatar size={24} style={{ backgroundColor: '#1890ff', marginRight: '8px' }}>
                  AI
                </Avatar>
                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>AI助手</span>
              </div>
              <p style={{ margin: 0, color: '#666' }}>
                您好！我是您的AI智能助手，可以帮您解答各类业务问题、提供数据分析建议。
                有什么可以帮您的吗？
              </p>
            </div>

            {/* 快捷功能 */}
            <div style={{ marginBottom: '16px' }}>
              <Title level={5}>快捷功能</Title>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Button type="default" size="small" icon={<BarChartOutlined />}>
                  销售分析
                </Button>
                <Button type="default" size="small" icon={<DollarOutlined />}>
                  价格建议
                </Button>
                <Button type="default" size="small" icon={<SafetyOutlined />}>
                  质量检查
                </Button>
                <Button type="default" size="small" icon={<FileDoneOutlined />}>
                  对账帮助
                </Button>
              </div>
            </div>

            {/* 常见问题 */}
            <div>
              <Title level={5}>常见问题</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button type="text" style={{ textAlign: 'left', padding: '8px 12px' }}>
                  📦 如何处理紧急订单？
                </Button>
                <Button type="text" style={{ textAlign: 'left', padding: '8px 12px' }}>
                  📊 库存预警如何设置？
                </Button>
                <Button type="text" style={{ textAlign: 'left', padding: '8px 12px' }}>
                  💰 申请供应链金融需要什么条件？
                </Button>
                <Button type="text" style={{ textAlign: 'left', padding: '8px 12px' }}>
                  🔄 质量问题处理流程是什么？
                </Button>
              </div>
            </div>
          </div>

          {/* 输入区域 */}
          <div style={{
            borderTop: '1px solid #e8e8e8',
            padding: '16px',
            backgroundColor: '#fff'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input
                placeholder="输入您的问题..."
                style={{ flex: 1 }}
              />
              <Button type="primary" icon={<MessageOutlined />}>
                发送
              </Button>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999', textAlign: 'center' }}>
              AI助手7x24小时在线服务
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
