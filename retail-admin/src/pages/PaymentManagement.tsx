import { useState } from 'react'
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Drawer,
  Descriptions,
  Typography,
  Select,
  Row,
  Col,
  Input,
  message,
} from 'antd'
import {
  DollarOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter'
import type { ColumnsType } from 'antd/es/table'
import ProductAnnotation from '../components/ProductAnnotation'
import { paymentManagementAnnotations } from './annotations/payment-management'

const { Title, Text } = Typography

interface Payment {
  id: string
  paymentNo: string
  supplierName: string
  amount: number
  paymentMethod: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  applyTime: string
  completeTime?: string
}

const PaymentManagement = () => {
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [filters, setFilters] = useState({
    paymentNo: '',
    supplierName: '',
    status: ''
  })

  const payments: Payment[] = [
    {
      id: '1',
      paymentNo: 'PAY202601001',
      supplierName: '统一企业食品有限公司',
      amount: 400000,
      paymentMethod: '银行转账',
      status: 'completed',
      applyTime: '2026-02-04',
      completeTime: '2026-02-05',
    },
    {
      id: '2',
      paymentNo: 'PAY202601002',
      supplierName: '伊利乳业股份有限公司',
      amount: 78000,
      paymentMethod: '银行转账',
      status: 'completed',
      applyTime: '2026-02-03',
      completeTime: '2026-02-03',
    },
    {
      id: '3',
      paymentNo: 'PAY202601003',
      supplierName: '好利来食品有限公司',
      amount: 35000,
      paymentMethod: '银行转账',
      status: 'processing',
      applyTime: '2026-02-06',
    },
  ]

  const getPaymentStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; text: string }> = {
      pending: { color: 'default', text: '待处理' },
      processing: { color: 'processing', text: '处理中' },
      completed: { color: 'success', text: '已完成' },
      failed: { color: 'error', text: '失败' },
    }
    return configs[status] || { color: 'default', text: status }
  }

  const columns: ColumnsType<Payment> = [
    { title: '付款单号', dataIndex: 'paymentNo', key: 'paymentNo' },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName' },
    {
      title: '付款金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    { title: '付款方式', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getPaymentStatusConfig(status)
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime' },
    { title: '完成时间', dataIndex: 'completeTime', render: (time?: string) => time || '-' },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
        </Space>
      ),
    },
  ]

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const handleSearch = () => {
    message.success('查询成功')
  }

  const handleReset = () => {
    setFilters({
      paymentNo: '',
      supplierName: '',
      status: ''
    })
    message.info('已重置筛选条件')
  }

  const handleViewDetail = (record: Payment) => {
    setSelectedPayment(record)
    setDetailVisible(true)
  }

  const handleExport = () => {
    message.success('导出成功')
  }

  return (
    <ProductAnnotation config={paymentManagementAnnotations}>
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
      <Card>
        <AdvancedSearchFilter
          fields={[
            { key: 'paymentNo', label: '付款单号', type: 'input', placeholder: '请输入付款单号' },
            { key: 'supplierName', label: '供应商名称', type: 'input', placeholder: '请输入名称' },
            { key: 'status', label: '状态', type: 'select', placeholder: '请选择',
              options: [{ label: '待付款', value: 'unpaid' }, { label: '部分付款', value: 'partial' }, { label: '已付款', value: 'paid' }]
            }
          ]}
          values={filters} onChange={(k,v)=>handleFilterChange({...filters,[k]:v})} onSearch={handleSearch} onReset={handleReset}
          extraActions={<Button onClick={handleExport}>导出</Button>}
        />
        <Table
          data-annotation-id="payment-table"
          rowKey="id"
          columns={columns}
          dataSource={payments}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Drawer
        title={`付款单详情 - ${selectedPayment?.paymentNo || ''}`}
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
        {selectedPayment && (
          <>
            <Title level={5} style={{ marginBottom: '16px' }}>基本信息</Title>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="付款单号">{selectedPayment.paymentNo}</Descriptions.Item>
              <Descriptions.Item label="供应商">{selectedPayment.supplierName}</Descriptions.Item>
              <Descriptions.Item label="付款方式">{selectedPayment.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getPaymentStatusConfig(selectedPayment.status).color}>
                  {getPaymentStatusConfig(selectedPayment.status).text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="申请时间">{selectedPayment.applyTime}</Descriptions.Item>
              <Descriptions.Item label="完成时间">{selectedPayment.completeTime || '-'}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginBottom: '16px' }}>金额信息</Title>
            <Card size="small" style={{ marginBottom: '24px', backgroundColor: '#f6ffed' }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="付款金额">
                  <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                    ¥{selectedPayment.amount.toLocaleString()}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </>
        )}
      </Drawer>
    </div>
    </ProductAnnotation>
  )
}

export default PaymentManagement
