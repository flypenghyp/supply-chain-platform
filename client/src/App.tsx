import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Breadcrumb, Affix, Button, Avatar, Dropdown, Input, Typography, Modal, Radio, Space, message } from 'antd';

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
  CloseOutlined,
  SwapOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { HashRouter, MemoryRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

const isFileProtocol = typeof window !== 'undefined' && window.location?.protocol === 'file:';
// file:// 用 MemoryRouter 避免 HashRouter 在静态文件下的报错
const Router = isFileProtocol ? MemoryRouter : HashRouter;
import Dashboard from './pages/Dashboard';
import Login from './pages/Login/index';
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
import Announcements from './pages/Announcements';
import SettlementApplication from './pages/SettlementApplication';
import Promotions from './pages/Promotions';
import PriceAdjustments from './pages/PriceAdjustments';
import LeaseCounterPayable from './pages/LeaseCounterPayable';
import SelfOperatedPayable from './pages/SelfOperatedPayable';
import ApiResult from './pages/ApiResult';
import AnnotationFloatButton from './components/AnnotationFloatButton/AnnotationFloatButton';
import AnnotatedRoute from './components/AnnotatedRoute';
import './styles/App.css';

const { Header, Sider, Content, Footer } = Layout;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('supplier_token'));
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
  const [supplierModalVisible, setSupplierModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<typeof currentSupplier | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 双 Sider 导航状态
  const getInitialModule = () => {
    const path = location.pathname;
    if (path.startsWith('/orders') || path.startsWith('/shipments') || path.startsWith('/inventory') ||
        path.startsWith('/sales') || path.startsWith('/bid-management') || path.startsWith('/price-management') ||
        path.startsWith('/quality') || path.startsWith('/product-management')) return 'business';
    if (path.startsWith('/reconciliation') || path.startsWith('/settlement-application') ||
        path.startsWith('/invoices') || path.startsWith('/payments') || path.startsWith('/fees') || path.startsWith('/finance')) return 'financial';
    if (path.startsWith('/account')) return 'enterprise';
    return 'business';
  };
  const [selectedModule, setSelectedModule] = useState<string>(getInitialModule);
  const [subMenuOpen, setSubMenuOpen] = useState<boolean>(true);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('supplier_token'));
  }, []);

  // 当前用户是否为超管（读 supplier_userInfo.supplier_roles）
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const refreshIsAdmin = useCallback(() => {
    try {
      const raw = localStorage.getItem('supplier_userInfo');
      if (!raw) { setIsAdmin(false); return; }
      const info = JSON.parse(raw);
      const ok = !!info?.supplier_roles?.some((sr: any) => Array.isArray(sr.roles) && sr.roles.includes('admin'));
      setIsAdmin(ok);
    } catch { setIsAdmin(false); }
  }, []);
  useEffect(() => {
    refreshIsAdmin();
  }, [isLoggedIn, location.pathname, refreshIsAdmin]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    refreshIsAdmin();
  };

  const handleLogout = () => {
    localStorage.removeItem('supplier_token');
    localStorage.removeItem('supplier_phone');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const handleOpenSupplierModal = () => {
    setSelectedSupplier(null);
    setSupplierModalVisible(true);
  };

  const handleSwitchSupplier = () => {
    if (selectedSupplier && selectedSupplier.code !== currentSupplier.code) {
      setCurrentSupplier(selectedSupplier);
      setSupplierModalVisible(false);
      message.success(`已切换至 ${selectedSupplier.name}`);
    }
  };

  // 不要在这里再包一层 Router，AppWrapper 已提供 Router，嵌套会报错
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

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
      '/settlement-application': '对账申请',
      '/invoices': '发票管理',
      '/payments': '交款管理',
      '/fees': '费用单管理',
      '/finance': '供应链金融',
      '/account/company': '企业信息管理',
      '/account/certificates': '供应商资质证照',
      '/account/users': '人员管理',
      '/service': '服务中心',
      '/product-management': '商品管理',
      '/contracts': '合同管理',
      '/announcements': '公告通知',
    };
    return titles[path] || '供应商协同平台';
  };

  // 一级菜单（左侧 80px 固定 Sider）
  const primaryMenuItems = [
    { key: '/', icon: <DashboardOutlined />, label: '工作台' },
    { key: 'business', icon: <ShoppingOutlined />, label: '业务中心' },
    { key: 'financial', icon: <MoneyCollectOutlined />, label: '财务中心' },
    { key: 'enterprise', icon: <UserOutlined />, label: '企业中心' },
    { key: '/contracts', icon: <FileDoneOutlined />, label: '合同管理' },
    { key: '/service', icon: <CustomerServiceOutlined />, label: '服务中心' },
    { key: '/announcements', icon: <BellOutlined />, label: '公告通知' },
  ];

  // 二级菜单映射（按一级菜单 key 索引）
  const subMenuMap: Record<string, { name: string; items: any[] }> = {
    business: {
      name: '业务中心',
      items: [
        { key: '/orders', icon: <FileTextOutlined />, label: '订单管理' },
        { key: '/shipments', icon: <TruckOutlined />, label: '发货管理' },
        { key: '/inventory', icon: <BarChartOutlined />, label: '库存查询' },
        { key: '/sales', icon: <BarChartOutlined />, label: '销售数据' },
        { key: '/bid-management', icon: <ShoppingOutlined />, label: '竞价管理' },
        { key: '/price-management', icon: <DollarOutlined />, label: '价格管理' },
        { key: '/quality', icon: <SafetyOutlined />, label: '质量管理' },
        { key: '/product-management', icon: <ProductOutlined />, label: '商品管理' },
      ],
    },
    financial: {
      name: '财务中心',
      items: [
        { key: '/reconciliation', icon: <FileDoneOutlined />, label: '财务对账' },
        { key: '/settlement-application', icon: <FileTextOutlined />, label: '对账申请' },
        { key: '/invoices', icon: <FileDoneOutlined />, label: '发票管理' },
        { key: '/payments', icon: <CreditCardOutlined />, label: '交款管理' },
        { key: '/fees', icon: <FileDoneOutlined />, label: '费用单管理' },
        { key: '/finance', icon: <BankOutlined />, label: '供应链金融' },
      ],
    },
    enterprise: {
      name: '企业中心',
      items: [
        { key: '/account/company', icon: <UserOutlined />, label: '企业信息管理' },
        { key: '/account/certificates', icon: <SafetyOutlined />, label: '供应商资质证照' },
        ...(isAdmin ? [{ key: '/account/users', icon: <TeamOutlined />, label: '人员管理' }] : []),
      ],
    },
  };

  // 一级菜单点击逻辑
  const handlePrimaryMenuClick = (key: string) => {
    if (subMenuMap[key]) {
      // 有子菜单
      if (key === selectedModule) {
        setSubMenuOpen(!subMenuOpen);
      } else {
        setSelectedModule(key);
        setSubMenuOpen(true);
      }
    } else {
      // 无子菜单，直接导航
      navigate(key);
      setSubMenuOpen(false);
    }
  };

  const currentSubMenu = subMenuMap[selectedModule] || subMenuMap.business;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左侧一级菜单（80px 固定 Sider） */}
      <Sider width={80} className="primary-sider">
        <div className="primary-logo">供</div>
        <Menu
          theme="dark"
          mode="vertical"
          selectedKeys={[selectedModule]}
          items={primaryMenuItems}
          onClick={({ key }) => handlePrimaryMenuClick(key)}
          className="primary-menu"
        />
      </Sider>

      {/* 左侧二级菜单（200px，可收起） */}
      <Sider
        width={200}
        collapsedWidth={0}
        collapsed={!subMenuOpen || !subMenuMap[selectedModule]}
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
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ marginLeft: '16px', marginBottom: 0, color: '#1890ff' }}>{getPageTitle(location.pathname)}</h1>

            {/* 当前供应商信息 */}
            <div style={{
              marginLeft: '20px',
              padding: '4px 12px',
              backgroundColor: '#e6f7ff',
              border: '1px solid #91d5ff',
              borderRadius: '4px',
              fontSize: '13px',
              color: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontWeight: '500' }}>{currentSupplier.name}</span>
              <span style={{ color: '#bfbfbf' }}>|</span>
              <span>{currentSupplier.code}</span>
            </div>
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

            {/* 切换供应商按钮 */}
            <Button
              type="default"
              icon={<SwapOutlined />}
              onClick={handleOpenSupplierModal}
              style={{
                color: '#1890ff',
                borderColor: '#1890ff',
                borderRadius: '4px',
              }}
            >
              切换供应商
            </Button>

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
                    onClick: handleLogout,
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
            <Route path="/" element={<AnnotatedRoute pageKey="/"><Dashboard /></AnnotatedRoute>} />
            <Route path="/suppliers" element={<AnnotatedRoute pageKey="/suppliers"><Suppliers /></AnnotatedRoute>} />
            <Route path="/products" element={<AnnotatedRoute pageKey="/products"><Products /></AnnotatedRoute>} />
            <Route path="/orders" element={<AnnotatedRoute pageKey="/orders"><Orders /></AnnotatedRoute>} />
            <Route path="/shipments" element={<AnnotatedRoute pageKey="/shipments"><Shipments /></AnnotatedRoute>} />
            <Route path="/inventory" element={<AnnotatedRoute pageKey="/inventory"><Inventory /></AnnotatedRoute>} />
            <Route path="/sales" element={<AnnotatedRoute pageKey="/sales"><Sales /></AnnotatedRoute>} />
            <Route path="/bid-management" element={<AnnotatedRoute pageKey="/bid-management"><BidManagement /></AnnotatedRoute>} />
            <Route path="/price-management" element={<AnnotatedRoute pageKey="/price-management"><PriceManagement /></AnnotatedRoute>} />
            <Route path="/quality" element={<AnnotatedRoute pageKey="/quality"><Quality /></AnnotatedRoute>} />
            <Route path="/reconciliation" element={<AnnotatedRoute pageKey="/reconciliation"><Reconciliation /></AnnotatedRoute>} />
            <Route path="/invoices" element={<AnnotatedRoute pageKey="/invoices"><Invoices /></AnnotatedRoute>} />
            <Route path="/payments" element={<AnnotatedRoute pageKey="/payments"><Payments /></AnnotatedRoute>} />
            <Route path="/fees" element={<AnnotatedRoute pageKey="/fees"><Fees /></AnnotatedRoute>} />
            <Route path="/finance" element={<AnnotatedRoute pageKey="/finance"><Finance /></AnnotatedRoute>} />
            <Route path="/account" element={<AnnotatedRoute pageKey="/account"><Account /></AnnotatedRoute>} />
            <Route path="/account/company" element={<AnnotatedRoute pageKey="/account/company"><Account /></AnnotatedRoute>} />
            <Route path="/account/certificates" element={<AnnotatedRoute pageKey="/account/certificates"><Account /></AnnotatedRoute>} />
            <Route path="/account/users" element={<AnnotatedRoute pageKey="/account/users"><Account /></AnnotatedRoute>} />
            <Route path="/service" element={<AnnotatedRoute pageKey="/service"><Service /></AnnotatedRoute>} />
            <Route path="/product-management" element={<AnnotatedRoute pageKey="/product-management"><ProductManagement /></AnnotatedRoute>} />
            <Route path="/contracts" element={<AnnotatedRoute pageKey="/contracts"><Contracts /></AnnotatedRoute>} />
            <Route path="/announcements" element={<AnnotatedRoute pageKey="/announcements"><Announcements /></AnnotatedRoute>} />
            <Route path="/settlement-application" element={<AnnotatedRoute pageKey="/settlement-application"><SettlementApplication /></AnnotatedRoute>} />
            <Route path="/promotions" element={<AnnotatedRoute pageKey="/promotions"><Promotions /></AnnotatedRoute>} />
            <Route path="/price-adjustments" element={<AnnotatedRoute pageKey="/price-adjustments"><PriceAdjustments /></AnnotatedRoute>} />
            <Route path="/lease-counter-payable" element={<AnnotatedRoute pageKey="/lease-counter-payable"><LeaseCounterPayable /></AnnotatedRoute>} />
            <Route path="/self-operated-payable" element={<AnnotatedRoute pageKey="/self-operated-payable"><SelfOperatedPayable /></AnnotatedRoute>} />
            <Route path="/api-result/success" element={<AnnotatedRoute pageKey="/api-result/success"><ApiResult /></AnnotatedRoute>} />
            <Route path="/api-result/error" element={<AnnotatedRoute pageKey="/api-result/error"><ApiResult /></AnnotatedRoute>} />
          </Routes>
        </Content>

        <Footer style={{ textAlign: 'center', backgroundColor: '#001529', color: '#fff' }}>
          Supply Chain Collaboration Platform © 2024
        </Footer>
      </Layout>

      {/* 产品标注浮动入口（仅登录后显示） */}
      {isLoggedIn && <AnnotationFloatButton />}

      {/* 切换供应商弹窗 */}
      <Modal
        title="切换供应商"
        open={supplierModalVisible}
        onCancel={() => setSupplierModalVisible(false)}
        footer={null}
        width={560}
      >
        <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>当前供应商</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{currentSupplier.name}</div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>代码: {currentSupplier.code}</div>
        </div>

        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>请选择要切换的供应商</div>
        <Radio.Group
          value={selectedSupplier?.code}
          onChange={(e) => {
            const supplier = availableSuppliers.find(s => s.code === e.target.value);
            setSelectedSupplier(supplier);
          }}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {availableSuppliers.map(supplier => (
              <Radio key={supplier.code} value={supplier.code} style={{ display: 'block' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{supplier.name}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>代码: {supplier.code}</div>
                </div>
              </Radio>
            ))}
          </Space>
        </Radio.Group>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <Space>
            <Button onClick={() => setSupplierModalVisible(false)}>
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleSwitchSupplier}
              disabled={!selectedSupplier || selectedSupplier.code === currentSupplier.code}
            >
              确认切换
            </Button>
          </Space>
        </div>
      </Modal>

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
