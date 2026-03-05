import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Drawer,
  Tabs,
  Timeline,
  message,
  Tooltip,
  Switch,
  Descriptions,
  Divider,
  Typography,
  Input,
} from 'antd'
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  CarOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  TruckOutlined,
} from '@ant-design/icons'
import { usePermission } from '@/contexts/PermissionContext'
import type { Shipment, ShipmentItem } from '@/types'

const { Title, Text } = Typography

// 扩展 ShipmentItem 类型
interface ShipmentItemExt {
  id: string
  productId: string
  productName: string
  quantity: number
  unit: string
}

const ShipmentManagement = () => {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [hideDrawerVisible, setHideDrawerVisible] = useState(false)
  const [hideReason, setHideReason] = useState('')
  const [currentHideShipment, setCurrentHideShipment] = useState<Shipment | null>(null)

  const { canHide, getManagedCategories } = usePermission()
  const categories = getManagedCategories()

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = async () => {
    setLoading(true)
    const mockShipments: Shipment[] = [
      {
        id: '1',
        shipmentNo: 'SP20260120001',
        orderNo: 'PO20260118002',
        supplierId: 'SUP002',
        supplierName: '好利来食品有限公司',
        categoryId: 'CAT002',
        categoryName: '零食类',
        status: 'in_transit',
        shipmentDate: '2026-01-20',
        estimatedArrival: '2026-01-22',
        actualArrival: undefined,
        totalAmount: 35000,
        logisticsCompany: '顺丰速运',
        trackingNo: 'SF1234567890',
        hidden: false,
      },
      {
        id: '2',
        shipmentNo: 'SP20260119001',
        orderNo: 'PO20260117003',
        supplierId: 'SUP003',
        supplierName: '伊利乳业股份有限公司',
        categoryId: 'CAT003',
        categoryName: '乳制品',
        status: 'delivered',
        shipmentDate: '2026-01-19',
        estimatedArrival: '2026-01-19',
        actualArrival: '2026-01-19 14:30',
        totalAmount: 78000,
        logisticsCompany: '京东物流',
        trackingNo: 'JD9876543210',
        hidden: false,
      },
      {
        id: '3',
        shipmentNo: 'SP20260118001',
        orderNo: 'PO20260118001',
        supplierId: 'SUP001',
        supplierName: '统一企业食品有限公司',
        categoryId: 'CAT001',
        categoryName: '饮料类',
        status: 'pending',
        shipmentDate: '2026-01-21',
        estimatedArrival: '2026-01-23',
        actualArrival: undefined,
        totalAmount: 50000,
        logisticsCompany: '德邦物流',
        trackingNo: 'DB1122334455',
        hidden: false,
      },
    ]
    setShipments(mockShipments)
    setLoading(false)
  }

  const handleViewDetail = (record: Shipment) => {
    setSelectedShipment(record)
    setDetailVisible(true)
  }

  const handleHideToggle = (record: Shipment) => {
    if (!canHide(record.categoryId)) {
      message.error('您没有权限隐藏此发货单')
      return
    }
    if (record.hidden) {
      setShipments(shipments.map(s => s.id === record.id ? { ...s, hidden: false } : s))
      message.success('发货单已显示')
    } else {
      setCurrentHideShipment(record)
      setHideDrawerVisible(true)
    }
  }

  const confirmHide = () => {
    if (!hideReason.trim()) {
      message.warning('请填写隐藏原因')
      return
    }
    if (currentHideShipment) {
      setShipments(shipments.map(s => s.id === currentHideShipment.id ? { ...s, hidden: true } : s))
      message.success('发货单已隐藏')
    }
    setHideDrawerVisible(false)
    setHideReason('')
    setCurrentHideShipment(null)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'warning',
      in_transit: 'processing',
      delivered: 'blue',
      completed: 'success',
    }
    return colors[status] || 'default'
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: '待发货',
      in_transit: '运输中',
      delivered: '已送达',
      completed: '已完成',
    }
    return texts[status] || status
  }

  const filteredShipments = shipments.filter(s => {
    if (activeTab === 'all') return true
    return s.status === activeTab
  })

  // 发货明细
  const shipmentItems: ShipmentItemExt[] = selectedShipment ? [
    { id: '1', productId: 'P001', productName: '商品A', quantity: 100, unit: '箱' },
    { id: '2', productId: 'P002', productName: '商品B', quantity: 200, unit: '箱' },
    { id: '3', productId: 'P003', productName: '商品C', quantity: 150, unit: '箱' },
  ] : []

  const itemColumns = [
    { title: '序号', key: 'index', width: 60, render: (_: unknown, __: unknown, index: number) => index + 1 },
    { title: '商品编码', dataIndex: 'productId', key: 'productId', width: 100 },
    { title: '商品名称', dataIndex: 'productName', key: 'productName' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity', align: 'right' as const, render: (val: number) => val.toLocaleString() },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
  ]

  const columns = [
    { title: '发货单号', dataIndex: 'shipmentNo', key: 'shipmentNo', render: (text: string, record: Shipment) => (
      <Space>
        {record.hidden && <Tooltip title="已隐藏"><EyeInvisibleOutlined style={{ color: '#999' }} /></Tooltip>}
        <a onClick={() => handleViewDetail(record)}>{text}</a>
      </Space>
    )},
    { title: '关联订单', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName' },
    { title: '品类', dataIndex: 'categoryName', key: 'categoryName', render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: '发货日期', dataIndex: 'shipmentDate', key: 'shipmentDate' },
    { title: '预计到达', dataIndex: 'estimatedArrival', key: 'estimatedArrival' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag> },
    { title: '操作', key: 'action', width: 150, render: (_: unknown, record: Shipment) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看</Button>
        {canHide(record.categoryId) && (
          <Tooltip title={record.hidden ? '显示' : '隐藏'}>
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
    )},
  ]

  return (
    <Card>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
        { key: 'all', label: '全部' },
        { key: 'pending', label: '待发货' },
        { key: 'in_transit', label: '运输中' },
        { key: 'delivered', label: '已送达' },
        { key: 'completed', label: '已完成' },
      ]} />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredShipments}
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
      />

      {/* 发货详情抽屉 */}
      <Drawer
        title={`发货详情 - ${selectedShipment?.shipmentNo || ''}`}
        placement="right"
        width={720}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setDetailVisible(false)}>关闭</Button>
          </Space>
        }
      >
        {selectedShipment && (
          <>
            {/* 单头信息 */}
            <Title level={5}><TruckOutlined /> 发货基本信息</Title>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="发货单号" span={2}>
                <Text strong>{selectedShipment.shipmentNo}</Text>
                {selectedShipment.hidden && <Tag color="red" style={{ marginLeft: 8 }}>已隐藏</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="关联订单">{selectedShipment.orderNo}</Descriptions.Item>
              <Descriptions.Item label="供应商">{selectedShipment.supplierName}</Descriptions.Item>
              <Descriptions.Item label="品类"><Tag color="blue">{selectedShipment.categoryName}</Tag></Descriptions.Item>
              <Descriptions.Item label="发货状态">
                <Tag color={getStatusColor(selectedShipment.status)}>{getStatusText(selectedShipment.status)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="发货日期">{selectedShipment.shipmentDate}</Descriptions.Item>
              <Descriptions.Item label="预计到达">{selectedShipment.estimatedArrival}</Descriptions.Item>
              {selectedShipment.actualArrival && (
                <Descriptions.Item label="实际到达" span={2}>{selectedShipment.actualArrival}</Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            {/* 物流信息 */}
            <Title level={5}>物流信息</Title>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="物流公司">{selectedShipment.logisticsCompany}</Descriptions.Item>
              <Descriptions.Item label="运单号">{selectedShipment.trackingNo}</Descriptions.Item>
            </Descriptions>

            {/* 物流轨迹 */}
            <Title level={5}>物流轨迹</Title>
            <Timeline style={{ marginTop: 16, marginLeft: 16 }}>
              <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
                订单确认 - 2026-01-18 10:30
              </Timeline.Item>
              <Timeline.Item dot={<CarOutlined style={{ color: '#1890ff' }} />}>
                发货出库 - {selectedShipment.shipmentDate} 09:15
              </Timeline.Item>
              {selectedShipment.status !== 'pending' && (
                <Timeline.Item dot={<EnvironmentOutlined style={{ color: '#faad14' }} />}>
                  运输中 - {selectedShipment.shipmentDate} 14:20
                </Timeline.Item>
              )}
              {selectedShipment.status === 'delivered' && selectedShipment.actualArrival && (
                <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
                  已送达 - {selectedShipment.actualArrival}
                </Timeline.Item>
              )}
            </Timeline>

            <Divider />

            {/* 发货明细 */}
            <Title level={5}>发货明细</Title>
            <Table
              rowKey="id"
              columns={itemColumns}
              dataSource={shipmentItems}
              pagination={false}
              size="small"
            />
          </>
        )}
      </Drawer>

      {/* 隐藏原因抽屉 */}
      <Drawer
        title="确认隐藏发货单"
        placement="right"
        width={480}
        onClose={() => { setHideDrawerVisible(false); setHideReason(''); setCurrentHideShipment(null) }}
        open={hideDrawerVisible}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => { setHideDrawerVisible(false); setHideReason(''); setCurrentHideShipment(null) }}>取消</Button>
            <Button type="primary" danger onClick={confirmHide}>确认隐藏</Button>
          </Space>
        }
      >
        {currentHideShipment && (
          <>
            <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="发货单号">{currentHideShipment.shipmentNo}</Descriptions.Item>
              <Descriptions.Item label="供应商">{currentHideShipment.supplierName}</Descriptions.Item>
              <Descriptions.Item label="物流公司">{currentHideShipment.logisticsCompany}</Descriptions.Item>
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
              <Text type="warning">⚠️ 隐藏后，供应商将无法看到此发货单</Text>
            </div>
          </>
        )}
      </Drawer>
    </Card>
  )
}

export default ShipmentManagement
