import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tooltip,
  Switch,
  Descriptions,
  Divider,
  Typography,
  Row,
  Col,
} from 'antd'
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeInvisibleOutlined,
  DownloadOutlined,
  ShopOutlined,
  CalendarOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { usePermission } from '@/contexts/PermissionContext'
import type { Order, OrderItem } from '@/types'

const { RangePicker } = DatePicker
const { Title, Text } = Typography

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [hideDrawerVisible, setHideDrawerVisible] = useState(false)
  const [hideReason, setHideReason] = useState('')
  const [currentHideOrder, setCurrentHideOrder] = useState<Order | null>(null)

  const { canApprove, canHide, getManagedCategories } = usePermission()
  const categories = getManagedCategories()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    // 模拟数据（包含订单明细）
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNo: 'PO20260118001',
        supplierId: 'SUP001',
        supplierName: '统一企业食品有限公司',
        categoryId: 'CAT001',
        categoryName: '饮料类',
        status: 'pending',
        totalAmount: 50000,
        orderDate: '2026-01-18',
        expectedDeliveryDate: '2026-01-20',
        hidden: false,
        items: [
          { id: '1', productId: 'P001', productName: '统一绿茶500ml', quantity: 1000, unitPrice: 3.5, amount: 3500 },
          { id: '2', productId: 'P002', productName: '统一红茶500ml', quantity: 2000, unitPrice: 3.5, amount: 7000 },
          { id: '3', productId: 'P003', productName: '统一冰红茶1L', quantity: 1500, unitPrice: 6.0, amount: 9000 },
          { id: '4', productId: 'P004', productName: '统一鲜橙多500ml', quantity: 3000, unitPrice: 3.8, amount: 11400 },
          { id: '5', productId: 'P005', productName: '统一阿萨姆奶茶500ml', quantity: 2000, unitPrice: 5.5, amount: 11000 },
          { id: '6', productId: 'P006', productName: '统一绿茶2L', quantity: 810, unitPrice: 10.0, amount: 8100 },
        ],
      },
      {
        id: '2',
        orderNo: 'PO20260118002',
        supplierId: 'SUP002',
        supplierName: '好利来食品有限公司',
        categoryId: 'CAT002',
        categoryName: '零食类',
        status: 'confirmed',
        totalAmount: 35000,
        orderDate: '2026-01-18',
        expectedDeliveryDate: '2026-01-22',
        hidden: false,
        items: [
          { id: '1', productId: 'P101', productName: '好利来半熟芝士原味', quantity: 500, unitPrice: 28.0, amount: 14000 },
          { id: '2', productId: 'P102', productName: '好利来半熟芝士抹茶味', quantity: 300, unitPrice: 30.0, amount: 9000 },
          { id: '3', productId: 'P103', productName: '好利来蜂蜜蛋糕', quantity: 400, unitPrice: 15.0, amount: 6000 },
          { id: '4', productId: 'P104', productName: '好利来蛋黄酥', quantity: 200, unitPrice: 30.0, amount: 6000 },
        ],
      },
      {
        id: '3',
        orderNo: 'PO20260118003',
        supplierId: 'SUP003',
        supplierName: '伊利乳业股份有限公司',
        categoryId: 'CAT003',
        categoryName: '乳制品',
        status: 'shipped',
        totalAmount: 78000,
        orderDate: '2026-01-17',
        expectedDeliveryDate: '2026-01-19',
        hidden: false,
        items: [
          { id: '1', productId: 'P201', productName: '伊利纯牛奶250ml*24', quantity: 500, unitPrice: 65.0, amount: 32500 },
          { id: '2', productId: 'P202', productName: '伊利安慕希原味205g*12', quantity: 300, unitPrice: 55.0, amount: 16500 },
          { id: '3', productId: 'P203', productName: '伊利金典有机奶250ml*12', quantity: 200, unitPrice: 78.0, amount: 15600 },
          { id: '4', productId: 'P204', productName: '伊利舒化奶250ml*12', quantity: 200, unitPrice: 42.0, amount: 8400 },
          { id: '5', productId: 'P205', productName: '伊利优酸乳250ml*24', quantity: 100, unitPrice: 50.0, amount: 5000 },
        ],
      },
    ]
    setOrders(mockOrders)
    setLoading(false)
  }

  const handleViewDetail = (record: Order) => {
    setSelectedOrder(record)
    setDetailVisible(true)
  }

  const handleApprove = (record: Order) => {
    if (!canApprove(record.categoryId)) {
      message.error('您没有权限审批此订单')
      return
    }
    message.success(`订单 ${record.orderNo} 已审批通过`)
    setOrders(orders.map(o => o.id === record.id ? { ...o, status: 'confirmed' as const } : o))
  }

  const handleReject = (record: Order) => {
    message.success(`订单 ${record.orderNo} 已拒绝`)
    setOrders(orders.map(o => o.id === record.id ? { ...o, status: 'cancelled' as const } : o))
  }

  const handleHideToggle = (record: Order) => {
    if (!canHide(record.categoryId)) {
      message.error('您没有权限隐藏此订单')
      return
    }
    if (record.hidden) {
      setOrders(orders.map(o => o.id === record.id ? { ...o, hidden: false } : o))
      message.success('订单已显示')
    } else {
      setCurrentHideOrder(record)
      setHideDrawerVisible(true)
    }
  }

  const confirmHide = () => {
    if (!hideReason.trim()) {
      message.warning('请填写隐藏原因')
      return
    }
    if (currentHideOrder) {
      setOrders(orders.map(o => o.id === currentHideOrder.id ? { ...o, hidden: true } : o))
      message.success('订单已隐藏')
    }
    setHideDrawerVisible(false)
    setHideReason('')
    setCurrentHideOrder(null)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'warning',
      confirmed: 'processing',
      shipped: 'blue',
      completed: 'success',
      cancelled: 'default',
    }
    return colors[status] || 'default'
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: '待确认',
      confirmed: '已确认',
      shipped: '配送中',
      completed: '已完成',
      cancelled: '已取消',
    }
    return texts[status] || status
  }

  // 订单明细表格列
  const itemColumns = [
    { title: '序号', key: 'index', width: 60, render: (_: unknown, __: unknown, index: number) => index + 1 },
    { title: '商品编码', dataIndex: 'productId', key: 'productId', width: 100 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity', align: 'right' as const, render: (val: number) => val.toLocaleString() },
    { title: '单价(元)', dataIndex: 'unitPrice', key: 'unitPrice', align: 'right' as const, render: (val: number) => `¥${val.toFixed(2)}` },
    { title: '金额(元)', dataIndex: 'amount', key: 'amount', align: 'right' as const, render: (val: number) => `¥${val.toLocaleString()}` },
  ]

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text: string, record: Order) => (
        <Space>
          {record.hidden && (
            <Tooltip title="已隐藏">
              <EyeInvisibleOutlined style={{ color: '#999' }} />
            </Tooltip>
          )}
          <a onClick={() => handleViewDetail(record)}>{text}</a>
        </Space>
      ),
    },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName' },
    { title: '品类', dataIndex: 'categoryName', key: 'categoryName', render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: '订单金额', dataIndex: 'totalAmount', key: 'totalAmount', align: 'right' as const, render: (val: number) => `¥${val.toLocaleString()}` },
    { title: '订单日期', dataIndex: 'orderDate', key: 'orderDate' },
    { title: '交货日期', dataIndex: 'expectedDeliveryDate', key: 'expectedDeliveryDate' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: Order) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看</Button>
          {record.status === 'pending' && canApprove(record.categoryId) && (
            <>
              <Button type="link" size="small" icon={<CheckOutlined />} style={{ color: '#52c41a' }} onClick={() => handleApprove(record)}>审批</Button>
              <Button type="link" size="small" icon={<CloseOutlined />} style={{ color: '#f5222d' }} onClick={() => handleReject(record)}>拒绝</Button>
            </>
          )}
          {canHide(record.categoryId) && (
            <Tooltip title={record.hidden ? '点击显示' : '点击隐藏'}>
              <Switch
                size="small"
                checked={!record.hidden}
                onChange={() => handleHideToggle(record)}
                checkedChildren="显"
                unCheckedChildren="隐"
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input placeholder="订单编号" style={{ width: 200 }} />
          <Select placeholder="选择品类" style={{ width: 150 }} options={categories.map(c => ({ label: c.categoryName, value: c.categoryId }))} />
          <RangePicker />
          <Button type="primary">查询</Button>
        </Space>
        <Button icon={<DownloadOutlined />}>导出</Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={orders}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
      />

      {/* 订单详情抽屉 - 单头 + 单身 */}
      <Drawer
        title={`订单详情 - ${selectedOrder?.orderNo || ''}`}
        placement="right"
        width={720}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
        footer={
          selectedOrder?.status === 'pending' && canApprove(selectedOrder?.categoryId || '') && (
            <Space style={{ float: 'right' }}>
              <Button onClick={() => setDetailVisible(false)}>关闭</Button>
              <Button type="primary" icon={<CheckOutlined />} onClick={() => { handleApprove(selectedOrder!); setDetailVisible(false) }}>审批通过</Button>
              <Button danger icon={<CloseOutlined />} onClick={() => { handleReject(selectedOrder!); setDetailVisible(false) }}>拒绝订单</Button>
            </Space>
          )
        }
      >
        {selectedOrder && (
          <>
            {/* 单头信息 */}
            <Title level={5}><ShopOutlined /> 订单基本信息</Title>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="订单编号" span={2}>
                <Text strong>{selectedOrder.orderNo}</Text>
                {selectedOrder.hidden && <Tag color="red" style={{ marginLeft: 8 }}>已隐藏</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="供应商">{selectedOrder.supplierName}</Descriptions.Item>
              <Descriptions.Item label="品类"><Tag color="blue">{selectedOrder.categoryName}</Tag></Descriptions.Item>
              <Descriptions.Item label="订单日期"><CalendarOutlined /> {selectedOrder.orderDate}</Descriptions.Item>
              <Descriptions.Item label="交货日期"><CalendarOutlined /> {selectedOrder.expectedDeliveryDate}</Descriptions.Item>
              <Descriptions.Item label="订单状态">
                <Tag color={getStatusColor(selectedOrder.status)}>{getStatusText(selectedOrder.status)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="订单金额">
                <Text strong style={{ color: '#f5222d', fontSize: 16 }}><DollarOutlined /> ¥{selectedOrder.totalAmount.toLocaleString()}</Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* 单身明细 */}
            <Title level={5}>订单明细</Title>
            <Table
              rowKey="id"
              columns={itemColumns}
              dataSource={selectedOrder.items}
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={5} align="right">
                    <Text strong>合计</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <Text strong style={{ color: '#f5222d' }}>
                      ¥{selectedOrder.items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </>
        )}
      </Drawer>

      {/* 隐藏原因抽屉 */}
      <Drawer
        title="确认隐藏订单"
        placement="right"
        width={480}
        onClose={() => { setHideDrawerVisible(false); setHideReason(''); setCurrentHideOrder(null) }}
        open={hideDrawerVisible}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => { setHideDrawerVisible(false); setHideReason(''); setCurrentHideOrder(null) }}>取消</Button>
            <Button type="primary" danger onClick={confirmHide}>确认隐藏</Button>
          </Space>
        }
      >
        {currentHideOrder && (
          <>
            <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="订单编号">{currentHideOrder.orderNo}</Descriptions.Item>
              <Descriptions.Item label="供应商">{currentHideOrder.supplierName}</Descriptions.Item>
              <Descriptions.Item label="订单金额">¥{currentHideOrder.totalAmount.toLocaleString()}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Text type="danger">隐藏原因（必填）：</Text>
            <Input.TextArea
              value={hideReason}
              onChange={(e) => setHideReason(e.target.value)}
              rows={4}
              placeholder="请输入隐藏原因..."
              style={{ marginTop: 8 }}
            />
            <div style={{ padding: 12, background: '#fff7e6', borderRadius: 4, marginTop: 16 }}>
              <Text type="warning">⚠️ 隐藏后，供应商将无法看到此订单</Text>
            </div>
          </>
        )}
      </Drawer>
    </Card>
  )
}

export default OrderManagement
