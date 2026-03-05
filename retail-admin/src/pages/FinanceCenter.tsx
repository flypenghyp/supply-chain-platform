import { useState } from 'react'
import {
  Card,
  Tabs,
  Table,
  Tag,
  Button,
  Space,
  Drawer,
  Descriptions,
  Typography,
  Divider,
  DatePicker,
  Select,
  Row,
  Col,
  Statistic,
  Badge,
  Input,
  message,
} from 'antd'
import {
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExportOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

interface Statement {
  id: string
  statementNo: string
  supplierId: string
  supplierName: string
  period: string
  totalAmount: number
  paidAmount: number
  unpaidAmount: number
  status: 'pending' | 'confirmed' | 'paid' | 'disputed'
  createTime: string
  confirmTime?: string
}

interface Invoice {
  id: string
  invoiceNo: string
  statementNo: string
  supplierName: string
  amount: number
  taxAmount: number
  status: 'pending' | 'received' | 'verified' | 'archived'
  receiveTime?: string
}

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

const FinanceCenter = () => {
  const [activeTab, setActiveTab] = useState('statements')
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedStatement, setSelectedStatement] = useState<Statement | null>(null)

  // Mock data
  const statements: Statement[] = [
    {
      id: '1',
      statementNo: 'STM202601001',
      supplierId: 'SUP001',
      supplierName: '统一企业食品有限公司',
      period: '2026年1月',
      totalAmount: 568000,
      paidAmount: 400000,
      unpaidAmount: 168000,
      status: 'confirmed',
      createTime: '2026-02-01',
      confirmTime: '2026-02-03',
    },
    {
      id: '2',
      statementNo: 'STM202601002',
      supplierId: 'SUP002',
      supplierName: '好利来食品有限公司',
      period: '2026年1月',
      totalAmount: 35000,
      paidAmount: 0,
      unpaidAmount: 35000,
      status: 'pending',
      createTime: '2026-02-01',
    },
    {
      id: '3',
      statementNo: 'STM202601003',
      supplierId: 'SUP003',
      supplierName: '伊利乳业股份有限公司',
      period: '2026年1月',
      totalAmount: 78000,
      paidAmount: 78000,
      unpaidAmount: 0,
      status: 'paid',
      createTime: '2026-02-01',
      confirmTime: '2026-02-02',
    },
  ]

  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNo: 'INV202601001',
      statementNo: 'STM202601001',
      supplierName: '统一企业食品有限公司',
      amount: 568000,
      taxAmount: 73840,
      status: 'verified',
      receiveTime: '2026-02-05',
    },
    {
      id: '2',
      invoiceNo: 'INV202601002',
      statementNo: 'STM202601003',
      supplierName: '伊利乳业股份有限公司',
      amount: 78000,
      taxAmount: 10140,
      status: 'received',
      receiveTime: '2026-02-04',
    },
  ]

  const payments: Payment[] = [
    {
      id: '1',
      paymentNo: 'PAY202601001',
      supplierName: '伊利乳业股份有限公司',
      amount: 78000,
      paymentMethod: '银行转账',
      status: 'completed',
      applyTime: '2026-02-03',
      completeTime: '2026-02-03 14:30',
    },
    {
      id: '2',
      paymentNo: 'PAY202601002',
      supplierName: '统一企业食品有限公司',
      amount: 400000,
      paymentMethod: '银行转账',
      status: 'processing',
      applyTime: '2026-02-04',
    },
  ]

  const getStatementStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; text: string }> = {
      pending: { color: 'orange', text: '待确认' },
      confirmed: { color: 'blue', text: '已确认' },
      paid: { color: 'green', text: '已付款' },
      disputed: { color: 'red', text: '有异议' },
    }
    return configs[status] || { color: 'default', text: status }
  }

  const getInvoiceStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; text: string }> = {
      pending: { color: 'orange', text: '待收票' },
      received: { color: 'blue', text: '已收票' },
      verified: { color: 'green', text: '已核验' },
      archived: { color: 'default', text: '已归档' },
    }
    return configs[status] || { color: 'default', text: status }
  }

  const getPaymentStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; text: string }> = {
      pending: { color: 'orange', text: '待处理' },
      processing: { color: 'blue', text: '处理中' },
      completed: { color: 'green', text: '已完成' },
      failed: { color: 'red', text: '失败' },
    }
    return configs[status] || { color: 'default', text: status }
  }

  const handleViewStatement = (record: Statement) => {
    setSelectedStatement(record)
    setDetailVisible(true)
  }

  const handleConfirm = (id: string) => {
    message.success('对账单已确认')
  }

  const statementColumns: ColumnsType<Statement> = [
    { title: '对账单号', dataIndex: 'statementNo', render: (text: string) => <a>{text}</a> },
    { title: '供应商', dataIndex: 'supplierName' },
    { title: '账期', dataIndex: 'period' },
    { 
      title: '总金额', 
      dataIndex: 'totalAmount', 
      align: 'right',
      render: (val: number) => `¥${val.toLocaleString()}`
    },
    { 
      title: '已付金额', 
      dataIndex: 'paidAmount', 
      align: 'right',
      render: (val: number) => <span style={{ color: '#52c41a' }}>¥{val.toLocaleString()}</span>
    },
    { 
      title: '未付金额', 
      dataIndex: 'unpaidAmount', 
      align: 'right',
      render: (val: number) => <span style={{ color: val > 0 ? '#f5222d' : '#52c41a' }}>¥{val.toLocaleString()}</span>
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: string) => {
        const config = getStatementStatusConfig(status)
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    { title: '创建时间', dataIndex: 'createTime' },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewStatement(record)}>查看</Button>
          {record.status === 'pending' && (
            <Button type="link" size="small" onClick={() => handleConfirm(record.id)}>确认</Button>
          )}
        </Space>
      ),
    },
  ]

  const invoiceColumns: ColumnsType<Invoice> = [
    { title: '发票号码', dataIndex: 'invoiceNo', render: (text: string) => <a>{text}</a> },
    { title: '关联对账单', dataIndex: 'statementNo' },
    { title: '供应商', dataIndex: 'supplierName' },
    { 
      title: '金额', 
      dataIndex: 'amount', 
      align: 'right',
      render: (val: number) => `¥${val.toLocaleString()}`
    },
    { 
      title: '税额', 
      dataIndex: 'taxAmount', 
      align: 'right',
      render: (val: number) => `¥${val.toLocaleString()}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: string) => {
        const config = getInvoiceStatusConfig(status)
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    { title: '收票时间', dataIndex: 'receiveTime' },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: () => (
        <Space>
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">核验</Button>
        </Space>
      ),
    },
  ]

  const paymentColumns: ColumnsType<Payment> = [
    { title: '付款单号', dataIndex: 'paymentNo', render: (text: string) => <a>{text}</a> },
    { title: '供应商', dataIndex: 'supplierName' },
    { 
      title: '付款金额', 
      dataIndex: 'amount', 
      align: 'right',
      render: (val: number) => `¥${val.toLocaleString()}`
    },
    { title: '付款方式', dataIndex: 'paymentMethod' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: string) => {
        const config = getPaymentStatusConfig(status)
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    { title: '申请时间', dataIndex: 'applyTime' },
    { title: '完成时间', dataIndex: 'completeTime' },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => <Button type="link" size="small">详情</Button>,
    },
  ]

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月应付总额"
              value={681000}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已付款金额"
              value={478000}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待确认对账单"
              value={3}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待收发票"
              value={5}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 功能标签页 */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'statements',
              label: '对账管理',
              icon: <FileTextOutlined />,
              children: (
                <>
                  <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                      <RangePicker placeholder={['开始日期', '结束日期']} />
                      <Select style={{ width: 150 }} placeholder="供应商" allowClear />
                      <Select style={{ width: 120 }} placeholder="状态" allowClear>
                        <Select.Option value="pending">待确认</Select.Option>
                        <Select.Option value="confirmed">已确认</Select.Option>
                        <Select.Option value="paid">已付款</Select.Option>
                      </Select>
                      <Button icon={<SearchOutlined />}>查询</Button>
                    </Space>
                    <Button icon={<ExportOutlined />}>导出</Button>
                  </div>
                  <Table
                    rowKey="id"
                    columns={statementColumns}
                    dataSource={statements}
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
            {
              key: 'invoices',
              label: '发票管理',
              icon: <FileTextOutlined />,
              children: (
                <>
                  <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                      <Input.Search placeholder="搜索发票号" style={{ width: 200 }} />
                      <Select style={{ width: 120 }} placeholder="状态" allowClear />
                      <Button icon={<SearchOutlined />}>查询</Button>
                    </Space>
                    <Button icon={<ExportOutlined />}>导出</Button>
                  </div>
                  <Table
                    rowKey="id"
                    columns={invoiceColumns}
                    dataSource={invoices}
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
            {
              key: 'payments',
              label: '付款管理',
              icon: <DollarOutlined />,
              children: (
                <>
                  <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                      <RangePicker placeholder={['开始日期', '结束日期']} />
                      <Select style={{ width: 120 }} placeholder="状态" allowClear />
                      <Button icon={<SearchOutlined />}>查询</Button>
                    </Space>
                    <Space>
                      <Button type="primary">申请付款</Button>
                      <Button icon={<ExportOutlined />}>导出</Button>
                    </Space>
                  </div>
                  <Table
                    rowKey="id"
                    columns={paymentColumns}
                    dataSource={payments}
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* 对账单详情抽屉 */}
      <Drawer
        title={`对账单详情 - ${selectedStatement?.statementNo || ''}`}
        placement="right"
        width={720}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setDetailVisible(false)}>关闭</Button>
            {selectedStatement?.status === 'pending' && (
              <Button type="primary" onClick={() => handleConfirm(selectedStatement.id)}>确认对账单</Button>
            )}
          </Space>
        }
      >
        {selectedStatement && (
          <>
            <Title level={5}>基本信息</Title>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="对账单号">{selectedStatement.statementNo}</Descriptions.Item>
              <Descriptions.Item label="账期">{selectedStatement.period}</Descriptions.Item>
              <Descriptions.Item label="供应商">{selectedStatement.supplierName}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getStatementStatusConfig(selectedStatement.status).color}>
                  {getStatementStatusConfig(selectedStatement.status).text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedStatement.createTime}</Descriptions.Item>
              <Descriptions.Item label="确认时间">{selectedStatement.confirmTime || '-'}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>金额明细</Title>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="对账总额">¥{selectedStatement.totalAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="已付金额">
                <span style={{ color: '#52c41a' }}>¥{selectedStatement.paidAmount.toLocaleString()}</span>
              </Descriptions.Item>
              <Descriptions.Item label="未付金额">
                <span style={{ color: selectedStatement.unpaidAmount > 0 ? '#f5222d' : '#52c41a' }}>
                  ¥{selectedStatement.unpaidAmount.toLocaleString()}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  )
}

export default FinanceCenter
