import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Badge, List, Tag, Button, Avatar, Statistic, message } from 'antd'
import {
  BellOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  MessageOutlined,
  TeamOutlined,
  AppstoreOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { usePermission } from '@/contexts/PermissionContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const { getManagedCategories } = usePermission()
  const categories = getManagedCategories()

  const handleNotImplemented = (name: string) => {
    message.info(`${name}入口暂未启用`)
  }

  const urgentTasks = [
    { id: '1', title: '商品审核', count: 12, icon: <ShoppingCartOutlined />, color: '#1890ff', route: '/product-audit', implemented: false },
    { id: '2', title: '售后处理', count: 5, icon: <WarningOutlined />, color: '#faad14', route: '/after-sale', implemented: false },
    { id: '3', title: '证照审核', count: 2, icon: <SafetyCertificateOutlined />, color: '#f5222d', route: '/licenses', implemented: true },
  ]

  const normalTasks = [
    { id: '4', title: '对账结算', count: 8, icon: <DollarOutlined />, color: '#52c41a', route: '/reconciliation', implemented: false },
    { id: '5', title: '消息回复', count: 3, icon: <MessageOutlined />, color: '#722ed1', route: '/message', implemented: false },
  ]

  const quickLinks = [
    { id: '1', title: '供应商管理', icon: <TeamOutlined />, color: '#1890ff', route: '/suppliers', implemented: true },
    { id: '2', title: '商品管理', icon: <AppstoreOutlined />, color: '#52c41a', route: '/products', implemented: false },
    { id: '3', title: '订单管理', icon: <ShoppingCartOutlined />, color: '#faad14', route: '/orders', implemented: true },
    { id: '4', title: '证照管理', icon: <SafetyCertificateOutlined />, color: '#f5222d', route: '/licenses', implemented: true },
    { id: '5', title: '公告管理', icon: <FileTextOutlined />, color: '#722ed1', route: '/announcements', implemented: true },
    { id: '6', title: '消息中心', icon: <MessageOutlined />, color: '#13c2c2', route: '/message', implemented: false },
  ]

  const importantReminders = [
    { id: '1', type: 'urgent', title: '食品经营许可证即将到期', supplier: '统一企业食品有限公司', days: 15, route: '/licenses', implemented: true },
    { id: '2', type: 'warning', title: '合同即将到期', supplier: '好利来食品有限公司', days: 45, route: '/contracts', implemented: true },
    { id: '3', type: 'warning', title: '供货异常', supplier: '厦门商贸集团有限公司', desc: '最近7天未按时供货', route: '/suppliers', implemented: true },
  ]

  const announcements = [
    { id: '1', title: '2024年春节放假通知', important: true, time: '2024-01-20' },
    { id: '2', title: '新供应商入驻流程调整公告', important: false, time: '2024-01-18' },
    { id: '3', title: '1月份结算时间安排', important: true, time: '2024-01-15' },
  ]

  const supplierStats = {
    total: 45,
    newThisMonth: 8,
    withoutAdmin: 3,
  }

  const totalUrgent = urgentTasks.reduce((sum, t) => sum + t.count, 0)
  const totalNormal = normalTasks.reduce((sum, t) => sum + t.count, 0)
  const totalPending = totalUrgent + totalNormal

  const handleClick = (route: string, implemented: boolean, name: string) => {
    if (implemented) {
      navigate(route)
    } else {
      handleNotImplemented(name)
    }
  }

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card bordered={false}>
            <Statistic
              title="待办事项"
              value={totalPending}
              suffix="项"
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
              紧急 {totalUrgent} 项需要处理
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ cursor: 'pointer' }} onClick={() => navigate('/suppliers')}>
            <Statistic
              title="管理供应商"
              value={supplierStats.total}
              suffix="家"
              valueStyle={{ color: '#1890ff' }}
              prefix={<TeamOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
              本月新增 {supplierStats.newThisMonth} 家
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ cursor: 'pointer' }} onClick={() => navigate('/suppliers')}>
            <Statistic
              title="待配置管理员"
              value={supplierStats.withoutAdmin}
              suffix="家"
              valueStyle={{ color: '#f5222d' }}
              prefix={<WarningOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
              请及时配置
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <span>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                待办事项
                <Badge count={totalPending} style={{ marginLeft: 8 }} />
              </span>
            }
            bordered={false}
            extra={<a onClick={() => handleNotImplemented('商品审核')}>查看全部</a>}
          >
            <Row gutter={16}>
              {urgentTasks.map(task => (
                <Col xs={24} sm={8} key={task.id}>
                  <Card 
                    hoverable
                    bordered={false}
                    style={{ background: '#fafafa', textAlign: 'center', marginBottom: 16 }}
                    onClick={() => handleClick(task.route, task.implemented, task.title)}
                  >
                    <div style={{ fontSize: 24, color: task.color }}>{task.icon}</div>
                    <div style={{ fontSize: 28, fontWeight: 600, margin: '8px 0' }}>{task.count}</div>
                    <div style={{ color: '#595959' }}>{task.title}</div>
                    <Button type="link" size="small" style={{ padding: '4px 0' }}>
                      {task.implemented ? '去处理' : '暂未启用'}
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
            <Row gutter={16}>
              {normalTasks.map(task => (
                <Col xs={24} sm={12} key={task.id}>
                  <Card 
                    hoverable
                    bordered={false}
                    style={{ background: '#fafafa', marginBottom: 16 }}
                    onClick={() => handleClick(task.route, task.implemented, task.title)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: 20, color: task.color, marginRight: 12 }}>{task.icon}</span>
                        <span style={{ fontSize: 20, fontWeight: 500 }}>{task.count}</span>
                        <span style={{ marginLeft: 8, color: '#8c8c8c' }}>{task.title}</span>
                        {!task.implemented && <Tag color="default" style={{ marginLeft: 8 }}>暂未启用</Tag>}
                      </div>
                      <RightOutlined style={{ color: '#bfbfbf' }} />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={
              <span>
                <WarningOutlined style={{ marginRight: 8 }} />
                重要提醒
              </span>
            }
            bordered={false}
          >
            <List
              dataSource={importantReminders}
              renderItem={(item) => (
                <List.Item 
                  style={{ cursor: 'pointer', padding: '12px 0' }} 
                  onClick={() => handleClick(item.route, item.implemented, item.title)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        size="small"
                        style={{ backgroundColor: item.type === 'urgent' ? '#f5222d' : '#faad14' }}
                        icon={item.type === 'urgent' ? <ExclamationCircleOutlined /> : <WarningOutlined />}
                      />
                    }
                    title={
                      <div>
                        <Tag color={item.type === 'urgent' ? 'red' : 'orange'} style={{ marginRight: 4 }}>
                          {item.type === 'urgent' ? '紧急' : '警告'}
                        </Tag>
                        <span style={{ fontSize: 13 }}>{item.title}</span>
                      </div>
                    }
                    description={
                      <div style={{ fontSize: 12 }}>
                        <div>{item.supplier}</div>
                        {item.days && <span style={{ color: '#f5222d' }}>还有 {item.days} 天到期</span>}
                        {item.desc && <span style={{ color: '#faad14' }}>{item.desc}</span>}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span>
                <AppstoreOutlined style={{ marginRight: 8 }} />
                快捷入口
              </span>
            }
            bordered={false}
          >
            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={quickLinks}
              renderItem={(item) => (
                <List.Item>
                  <Card 
                    hoverable
                    bordered={false}
                    style={{ textAlign: 'center' }}
                    onClick={() => handleClick(item.route, item.implemented, item.title)}
                  >
                    <Avatar size={40} style={{ backgroundColor: item.color, marginBottom: 8 }}>
                      {item.icon}
                    </Avatar>
                    <div style={{ fontSize: 13 }}>{item.title}</div>
                    {!item.implemented && <Tag color="default" style={{ marginTop: 4, fontSize: 10 }}>暂未启用</Tag>}
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={
              <span>
                <BellOutlined style={{ marginRight: 8 }} />
                最新公告
              </span>
            }
            bordered={false}
            extra={<a onClick={() => navigate('/announcements')}>查看全部</a>}
          >
            <List
              dataSource={announcements}
              renderItem={(item) => (
                <List.Item style={{ cursor: 'pointer', padding: '12px 0' }} onClick={() => navigate('/announcements')}>
                  <List.Item.Meta
                    avatar={
                      <Avatar size="small" style={{ backgroundColor: item.important ? '#f5222d' : '#1890ff' }}>
                        <FileTextOutlined />
                      </Avatar>
                    }
                    title={
                      <div>
                        {item.important && <Tag color="red" style={{ marginRight: 4 }}>重要</Tag>}
                        <span style={{ fontSize: 13 }}>{item.title}</span>
                      </div>
                    }
                    description={<span style={{ fontSize: 12, color: '#8c8c8c' }}>{item.time}</span>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard