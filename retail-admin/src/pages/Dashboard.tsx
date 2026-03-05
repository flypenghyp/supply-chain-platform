import { useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Badge, Button, Modal, List } from 'antd'
import {
  ShoppingOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  RiseOutlined,
  HistoryOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons'
import { usePermission } from '@/contexts/PermissionContext'
import type { HideRecord } from '@/types'

const Dashboard = () => {
  const { permission, getManagedCategories, isAdmin } = usePermission()
  const [hideRecordVisible, setHideRecordVisible] = useState(false)

  const hideRecords: HideRecord[] = [
    {
      id: '1',
      documentType: 'order',
      documentNo: 'PO20260118004',
      documentTitle: '统一老坛酸菜牛肉面订单',
      categoryId: 'CAT001',
      categoryName: '饮料类',
      supplierName: '统一企业食品有限公司',
      hidden: true,
      operator: '张经理',
      operateTime: '2026-01-19 15:30',
      reason: '供应商价格争议，暂停合作',
    },
  ]

  const pendingTasks = [
    { type: '订单审批', title: '新订单待审批：PO20260120001', priority: 'urgent' },
    { type: '对账确认', title: '1月份对账单待确认', priority: 'normal' },
    { type: '发货确认', title: '好利来发货单待确认', priority: 'normal' },
  ]

  const categoryStats = [
    { categoryName: '饮料类', orderCount: 45, amount: 1250000, growth: 12.5 },
    { categoryName: '零食类', orderCount: 32, amount: 890000, growth: -5.2 },
    { categoryName: '乳制品', orderCount: 28, amount: 1680000, growth: 8.7 },
  ]

  const recentSuppliers = [
    { id: '1', name: '统一企业食品有限公司', category: '饮料类', status: 'active' },
    { id: '2', name: '好利来食品有限公司', category: '零食类', status: 'active' },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'success',
      inactive: 'default',
      pending: 'warning',
    }
    return colors[status] || 'default'
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      active: '合作中',
      inactive: '已停用',
      pending: '待审核',
    }
    return texts[status] || status
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="本月订单总额"
              value={3820000}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <RiseOutlined style={{ color: '#52c41a' }} />
              <span style={{ color: '#52c41a', marginLeft: 4 }}>+15.2%</span>
              <span style={{ color: '#999', marginLeft: 8 }}>较上月</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审批订单"
              value={5}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8 }}>
              <ClockCircleOutlined style={{ color: '#faad14' }} />
              <span style={{ color: '#999', marginLeft: 4 }}>需要及时处理</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃供应商"
              value={24}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <span style={{ color: '#999', marginLeft: 4 }}>合作稳定</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="订单准时率"
              value={95.2}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <RiseOutlined style={{ color: '#52c41a' }} />
              <span style={{ color: '#52c41a', marginLeft: 4 }}>+2.1%</span>
              <span style={{ color: '#999', marginLeft: 8 }}>较上月</span>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="待办事项">
            <List
              dataSource={pendingTasks}
              renderItem={(item) => (
                <List.Item
                  actions={[<a key="action">处理</a>]}
                >
                  <div>
                    <Badge status={item.priority === 'urgent' ? 'error' : 'warning'} />
                    <Tag size="small">{item.type}</Tag>
                    <span style={{ marginLeft: 8 }}>{item.title}</span>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="品类订单统计">
            <Table
              dataSource={categoryStats}
              pagination={false}
              size="small"
              rowKey="categoryName"
              columns={[
                { title: '品类', dataIndex: 'categoryName' },
                { title: '订单数', dataIndex: 'orderCount', align: 'right' },
                { 
                  title: '金额', 
                  dataIndex: 'amount', 
                  align: 'right',
                  render: (val: number) => `¥${(val / 10000).toFixed(1)}万`
                },
                { 
                  title: '增长率', 
                  dataIndex: 'growth', 
                  align: 'right',
                  render: (val: number) => (
                    <span style={{ color: val > 0 ? '#52c41a' : '#f5222d' }}>
                      {val > 0 ? '+' : ''}{val}%
                    </span>
                  )
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="最近供应商" 
        style={{ marginTop: 16 }}
        extra={
          <Button 
            icon={<HistoryOutlined />} 
            onClick={() => setHideRecordVisible(true)}
          >
            <EyeInvisibleOutlined /> 隐藏记录
          </Button>
        }
      >
        <Table
          dataSource={recentSuppliers}
          pagination={false}
          rowKey="id"
          columns={[
            { title: '供应商名称', dataIndex: 'name', render: (text: string) => <a>{text}</a> },
            { title: '品类', dataIndex: 'category', render: (text: string) => <Tag color="blue">{text}</Tag> },
            { 
              title: '状态', 
              dataIndex: 'status', 
              render: (status: string) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
            },
          ]}
        />
      </Card>

      <Modal
        title={<><HistoryOutlined /> 隐藏/显示操作记录</>}
        open={hideRecordVisible}
        onCancel={() => setHideRecordVisible(false)}
        footer={null}
        width={1000}
      >
        <Table
          dataSource={hideRecords}
          rowKey="id"
          columns={[
            { title: '单据类型', dataIndex: 'documentType', render: (type: string) => <Tag>{type === 'order' ? '订单' : type}</Tag> },
            { title: '单据编号', dataIndex: 'documentNo' },
            { title: '品类', dataIndex: 'categoryName', render: (text: string) => <Tag color="blue">{text}</Tag> },
            { title: '供应商', dataIndex: 'supplierName' },
            { title: '状态', dataIndex: 'hidden', render: (hidden: boolean) => <Tag color={hidden ? 'red' : 'green'}>{hidden ? '已隐藏' : '已显示'}</Tag> },
            { title: '操作人', dataIndex: 'operator' },
            { title: '操作时间', dataIndex: 'operateTime' },
            { title: '原因', dataIndex: 'reason', ellipsis: true },
          ]}
        />
      </Modal>
    </div>
  )
}

export default Dashboard
