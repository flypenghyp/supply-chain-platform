import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, List, Button, Badge, Avatar, Divider, Progress, Tag, message, Empty } from 'antd';
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
  BellOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

        {/* 快捷入口区 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleOutlined style={{ color: '#1890ff' }} />
                <span>快捷入口</span>
              </div>
            }
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
              {quickActions.map((action) => (
                <Button
                  key={action.key}
                  type="default"
                  size="large"
                  style={{
                    height: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: `2px solid ${action.color}20`,
                    backgroundColor: `${action.color}05`
                  }}
                  onClick={() => handleQuickAction(action)}
                >
                  <div style={{ fontSize: '24px', color: action.color }}>{action.icon}</div>
                  <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>{action.label}</div>
                </Button>
              ))}
            </div>
          </Card>
        </Col>

        {/* 消息中心 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BellOutlined style={{ color: '#faad14' }} />
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
    </div>
  );
};

export default Dashboard;
