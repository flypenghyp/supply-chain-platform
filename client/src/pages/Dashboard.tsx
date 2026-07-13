import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, List, Button, Badge, Avatar, Divider, Progress, Tag, message, Empty, Result } from 'antd';
import {
  ShoppingOutlined,
  TruckOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  GiftOutlined,
  SafetyOutlined,
  BankOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MessageOutlined,
  BellOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ESIGN_CONFIG } from '../config/esign';
import PersonalAuthModal from './components/PersonalAuthModal';

interface Announcement {
  id: string;
  title: string;
  type: 'notice' | 'announcement';
  content: string;
  is_important: boolean;
  is_published: boolean;
  expired_at: string;
  created_at: string;
  created_by: string;
  is_read?: boolean;
  attachments?: string[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [personalAuthVisible, setPersonalAuthVisible] = useState(false);

  const mockAnnouncements: Announcement[] = [
    {
      id: '1',
      title: '2024年春节放假通知',
      type: 'notice',
      content: '春节放假时间为2024年2月9日至2月17日，共9天。请各供应商提前做好备货安排。',
      is_important: true,
      is_published: true,
      expired_at: '2024-02-20',
      created_at: '2024-01-20',
      created_by: 'admin',
    },
    {
      id: '2',
      title: '新供应商入驻流程调整公告',
      type: 'announcement',
      content: '自2024年2月1日起，新供应商入驻需提供完整的资质证明文件，包括营业执照、食品经营许可证等。',
      is_important: false,
      is_published: true,
      expired_at: '2024-02-18',
      created_at: '2024-01-18',
      created_by: 'admin',
    },
    {
      id: '3',
      title: '1月份结算时间安排',
      type: 'notice',
      content: '1月份对账结算时间为2024年2月5日至2月8日，请各供应商按时提交对账单据。',
      is_important: true,
      is_published: true,
      expired_at: '2024-02-15',
      created_at: '2024-01-15',
      created_by: 'admin',
    },
    {
      id: '4',
      title: '关于规范商品标签的公告',
      type: 'announcement',
      content: '为进一步规范商品管理，自2024年2月起，所有商品必须使用统一格式的标签，包含商品名称、规格、保质期、生产批号等信息。',
      is_important: false,
      is_published: true,
      expired_at: '2024-03-01',
      created_at: '2024-01-12',
      created_by: 'admin',
      attachments: ['商品标签模板.pdf'],
    },
    {
      id: '5',
      title: '年度供应商大会通知',
      type: 'notice',
      content: '2024年度供应商大会将于2024年3月15日在上海国际会议中心召开，请各供应商派代表参加。',
      is_important: true,
      is_published: true,
      expired_at: '2024-03-10',
      created_at: '2024-01-10',
      created_by: 'admin',
      attachments: ['大会议程.docx', '参会回执.xlsx'],
    },
    {
      id: '6',
      title: '春节后订货需求统计',
      type: 'notice',
      content: '请各供应商于2024年2月20日前提交春节后的订货需求预测，以便我们做好库存规划。',
      is_important: false,
      is_published: true,
      expired_at: '2024-02-20',
      created_at: '2024-01-08',
      created_by: 'admin',
    },
  ];

  const loadAnnouncements = () => {
    const readIds = JSON.parse(localStorage.getItem('read_announcements') || '[]');
    const data = mockAnnouncements.map(a => ({
      ...a,
      is_read: readIds.includes(a.id)
    }));
    setAnnouncements(data);
  };

  useEffect(() => {
    loadAnnouncements();

    const handleStorageChange = () => {
      loadAnnouncements();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadAnnouncements, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 模拟数据 - 实际应该从API获取
  const urgentTodos = [
    { id: 1, type: '订单确认', title: '2个订单待确认 (超过24小时)', count: 2, priority: 'urgent' },
    { id: 2, type: '发货预警', title: '1个订单发货超时', count: 1, priority: 'urgent' },
    { id: 3, type: '对账确认', title: '本月对账单待确认', count: 1, priority: 'urgent' },
  ];

  const normalTodos = [
    { id: 4, type: '质量回复', title: '1个质量问题待回复', count: 1, priority: 'normal' },
    { id: 5, type: '促销查看', title: '促销效果待查看', count: 1, priority: 'normal' },
    { id: 6, type: '证照提醒', title: '1个证照即将过期', count: 1, priority: 'normal' },
  ];

  const keyMetrics = [
    {
      title: '本月订单金额',
      value: '¥1,250,000',
      change: '+15%',
      trend: 'up',
      icon: <ShoppingOutlined style={{ color: '#1890ff' }} />
    },
    {
      title: '发货准时率',
      value: '95.2%',
      change: '+2.1%',
      trend: 'up',
      icon: <TruckOutlined style={{ color: '#52c41a' }} />
    },
    {
      title: '库存周转天数',
      value: '28天',
      change: '-3天',
      trend: 'down',
      icon: <FileDoneOutlined style={{ color: '#faad14' }} />
    },
    {
      title: '应收账款',
      value: '¥580,000',
      change: '+8.5%',
      trend: 'up',
      icon: <BankOutlined style={{ color: '#f5222d' }} />
    },
  ];

  const salesTrendData = [
    { date: '01-12', sales: 85000 },
    { date: '01-13', sales: 92000 },
    { date: '01-14', sales: 88000 },
    { date: '01-15', sales: 105000 },
    { date: '01-16', sales: 98000 },
    { date: '01-17', sales: 112000 },
    { date: '01-18', sales: 125000 },
  ];

  const quickActions = [
    { key: 'orders', label: '确认订单', icon: <FileTextOutlined />, path: '/orders', color: '#1890ff' },
    { key: 'shipments', label: '发货管理', icon: <TruckOutlined />, path: '/shipments', color: '#52c41a' },
    { key: 'reconciliation', label: '对账查询', icon: <FileDoneOutlined />, path: '/reconciliation', color: '#faad14' },
    { key: 'sales', label: '销售数据', icon: <ShoppingOutlined />, path: '/sales', color: '#13c2c2' },
    { key: 'finance', label: '申请融资', icon: <BankOutlined />, path: '/finance', color: '#722ed1' },
    { key: 'invoices', label: '开票申请', icon: <FileTextOutlined />, path: '/invoices', color: '#eb2f96' },
    { key: 'quality', label: '质量问题', icon: <SafetyOutlined />, path: '/quality', color: '#fa8c16' },
    { key: 'promotions', label: '促销申报', icon: <GiftOutlined />, path: '/promotions', color: '#52c41a' },
  ];

  const messages = [
    { id: 1, type: '订单', title: '新订单PO20260118001已推送', time: '10:30', unread: true },
    { id: 2, type: '发货', title: '订单PO20260118002已发货完成', time: '09:15', unread: false },
    { id: 3, type: '对账', title: '1月份对账单已生成，请确认', time: '昨天', unread: true },
    { id: 4, type: '付款', title: '收到付款¥125,000', time: '昨天', unread: false },
    { id: 5, type: '质量', title: '质量问题QC20260118001待处理', time: '前天', unread: true },
    { id: 6, type: '促销', title: '春节促销活动已开始', time: '前天', unread: false },
  ];

  const handleTodoClick = (todo: any) => {
    // 根据待办事项类型跳转到相应页面
    switch (todo.type) {
      case '订单确认':
        navigate('/orders');
        break;
      case '发货预警':
        navigate('/shipments');
        break;
      case '对账确认':
        navigate('/reconciliation');
        break;
      case '质量回复':
        navigate('/quality');
        break;
      case '促销查看':
        navigate('/promotions');
        break;
      case '证照提醒':
        navigate('/account');
        break;
      default:
        break;
    }
  };

  const handleQuickAction = (action: any) => {
    navigate(action.path);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Row gutter={[24, 24]}>
        {/* 待办事项区 */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                <span>待办事项</span>
              </div>
            }
            style={{ height: '100%' }}
          >
            {/* 紧急待办 */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', color: '#f5222d', marginBottom: '8px' }}>
                🔴 紧急待办
              </div>
              <List
                size="small"
                dataSource={urgentTodos}
                renderItem={(item) => (
                  <List.Item
                    style={{ padding: '8px 0', cursor: 'pointer' }}
                    onClick={() => handleTodoClick(item)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span>{item.title}</span>
                      <Badge count={item.count} style={{ backgroundColor: '#f5222d' }} />
                    </div>
                  </List.Item>
                )}
              />
            </div>

            <Divider />

            {/* 普通待办 */}
            <div>
              <div style={{ fontWeight: 'bold', color: '#faad14', marginBottom: '8px' }}>
                🟡 普通待办
              </div>
              <List
                size="small"
                dataSource={normalTodos}
                renderItem={(item) => (
                  <List.Item
                    style={{ padding: '8px 0', cursor: 'pointer' }}
                    onClick={() => handleTodoClick(item)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span>{item.title}</span>
                      <Badge count={item.count} />
                    </div>
                  </List.Item>
                )}
              />
            </div>

            {/* 电签权限状态 */}
            <Divider style={{ margin: '12px 0' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <SafetyCertificateOutlined style={{ color: '#1890ff', fontSize: 14 }} />
                <strong style={{ fontSize: 13 }}>电签权限</strong>
              </div>
              {(() => {
                const userInfo = JSON.parse(localStorage.getItem('supplier_userInfo') || '{}');
                const hasEsign = userInfo?.esign_permission?.enabled && userInfo?.esign_permission?.verified;
                const isPersonalVerified = userInfo?.personal_verified;
                if (hasEsign) {
                  return (
                    <div style={{ padding: '8px', background: '#f6ffed', borderRadius: '4px', border: '1px solid #b7eb8f' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <span style={{ fontSize: 12, color: '#389e0d' }}>已开通</span>
                        <Button type="link" size="small" style={{ padding: 0, marginLeft: 'auto' }} onClick={() => navigate('/account')}>管理</Button>
                      </div>
                    </div>
                  );
                }
                if (isPersonalVerified) {
                  return (
                    <div style={{ padding: '8px', background: '#fffbe6', borderRadius: '4px', border: '1px solid #ffe58f' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ClockCircleOutlined style={{ color: '#faad14' }} />
                        <span style={{ fontSize: 12, color: '#d48806' }}>等待授权</span>
                      </div>
                    </div>
                  );
                }
                return (
                  <div style={{ padding: '8px', background: '#fff2f0', borderRadius: '4px', border: '1px solid #ffccc7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: '#cf1322' }}>
                        <ExclamationCircleOutlined style={{ marginRight: 4 }} />未认证
                      </span>
                      <Button type="primary" size="small" onClick={() => setPersonalAuthVisible(true)}>
                        去认证
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </Card>
        </Col>

        {/* 数据看板区 */}
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            {/* 关键指标 */}
            {keyMetrics.map((metric, index) => (
              <Col xs={24} sm={12} key={index}>
                <Card style={{ height: '120px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>{metric.title}</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{metric.value}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {metric.trend === 'up' ? (
                          <ArrowUpOutlined style={{ color: '#52c41a' }} />
                        ) : (
                          <ArrowDownOutlined style={{ color: '#f5222d' }} />
                        )}
                        <span style={{ color: metric.trend === 'up' ? '#52c41a' : '#f5222d', fontSize: '12px' }}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '32px' }}>{metric.icon}</div>
                  </div>
                </Card>
              </Col>
            ))}

            {/* 销售趋势图 */}
            <Col xs={24}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingOutlined />
                    <span>销售趋势图 (最近7天)</span>
                  </div>
                }
                style={{ height: '320px' }}
              >
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`¥${value}`, '销售额']} />
                    <Area type="monotone" dataKey="sales" stroke="#1890ff" fill="#1890ff" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 公告通知 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BellOutlined style={{ color: '#faad14' }} />
                <span>公告通知</span>
                <Badge count={announcements.filter(a => !a.is_read).length} />
              </div>
            }
            extra={<Button type="link" onClick={() => navigate('/announcements')}>查看全部</Button>}
            style={{ height: '100%' }}
          >
            {announcements.length === 0 ? (
              <Empty description="暂无公告" style={{ padding: '20px 0' }} />
            ) : (
              <List
                size="small"
                dataSource={announcements.slice(0, 5)}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      padding: '12px 0',
                      cursor: 'pointer',
                      backgroundColor: item.is_read ? 'transparent' : '#f0f9ff'
                    }}
                    onClick={() => navigate('/announcements')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          {item.is_important && <Tag color="red">重要</Tag>}
                          <Tag color={item.type === 'notice' ? 'blue' : 'green'}>
                            {item.type === 'notice' ? '通知' : '公告'}
                          </Tag>
                          {!item.is_read && <Badge dot />}
                        </div>
                        <div style={{ fontSize: '14px', marginBottom: '2px' }}>{item.title}</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>{item.created_at}</div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* 消息中心 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageOutlined style={{ color: '#1890ff' }} />
                <span>消息中心</span>
              </div>
            }
            style={{ height: '100%' }}
          >
            <List
              size="small"
              dataSource={messages}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: '12px 0',
                    cursor: 'pointer',
                    backgroundColor: item.unread ? '#f0f9ff' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Tag color={item.type === '订单' ? 'blue' : item.type === '发货' ? 'green' : item.type === '对账' ? 'orange' : item.type === '付款' ? 'purple' : item.type === '质量' ? 'red' : 'cyan'}>
                          {item.type}
                        </Tag>
                        {item.unread && <Badge dot />}
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '2px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{item.time}</div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Button type="link">查看全部消息</Button>
            </div>
          </Card>
        </Col>
      </Row>

      <PersonalAuthModal
        visible={personalAuthVisible}
        onCancel={() => setPersonalAuthVisible(false)}
        onSuccess={() => {
          setPersonalAuthVisible(false);
          message.success('认证成功');
          const userInfo = JSON.parse(localStorage.getItem('supplier_userInfo') || '{}');
          localStorage.setItem('supplier_userInfo', JSON.stringify({ ...userInfo, personal_verified: true }));
        }}
      />
    </div>
  );
};

export default Dashboard;
