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
  Divider,
  DatePicker,
  Select,
  Row,
  Col,
  Statistic,
  Badge,
  Input,
  message,
  Modal,
  Alert,
} from 'antd'
import {
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExportOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
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
  isDeduction: boolean
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
  const location = useLocation()
  const navigate = useNavigate()
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedStatement, setSelectedStatement] = useState<Statement | null>(null)
  const [selectedStatementIds, setSelectedStatementIds] = useState<React.Key[]>([])
  const [filters, setFilters] = useState({
    statementNo: '',
    supplierName: '',
    period: '',
    status: ''
  });

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
      isDeduction: false,
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
      isDeduction: true,
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
      isDeduction: false,
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

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    message.success('查询成功');
  };

  const handleReset = () => {
    setFilters({
      statementNo: '',
      supplierName: '',
      period: '',
      status: ''
    });
    message.success('已重置查询条件');
  };

  const handleViewStatement = (record: Statement) => {
    setSelectedStatement(record)
    setDetailVisible(true)
  }

  const handleConfirm = (id: string) => {
    message.success('对账单已确认')
  }

  const handleBatchExport = () => {
    if (selectedStatementIds.length === 0) {
      message.warning('请至少选择一个对账单');
      return;
    }

    const selectedRecords = statements.filter(item =>
      selectedStatementIds.includes(item.id)
    );

    message.success(`成功导出 ${selectedRecords.length} 个对账单`);
    console.log('导出数据:', selectedRecords);
  }

  const statementColumns: ColumnsType<Statement> = [
    { title: '对账单号', dataIndex: 'statementNo', width: 160, render: (text: string) => <a>{text}</a> },
    { title: '供应商', dataIndex: 'supplierName', width: 180 },
    { title: '账期', dataIndex: 'period', width: 100 },
    { 
      title: '总金额', 
      dataIndex: 'totalAmount', 
      width: 120,
      align: 'right',
      render: (val: number) => `¥${val.toLocaleString()}`
    },
    { 
      title: '已付金额', 
      dataIndex: 'paidAmount', 
      width: 120,
      align: 'right',
      render: (val: number) => <span style={{ color: '#52c41a' }}>¥{val.toLocaleString()}</span>
    },
    { 
      title: '未付金额', 
      dataIndex: 'unpaidAmount', 
      width: 120,
      align: 'right',
      render: (val: number) => <span style={{ color: val > 0 ? '#f5222d' : '#52c41a' }}>¥{val.toLocaleString()}</span>
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => {
        const config = getStatementStatusConfig(status)
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '是否账扣',
      dataIndex: 'isDeduction',
      width: 100,
      render: (isDeduction: boolean) => (
        <Tag color={isDeduction ? 'red' : 'default'}>
          {isDeduction ? '是' : '否'}
        </Tag>
      )
    },
    { title: '创建时间', dataIndex: 'createTime', width: 140 },
    { title: '确认时间', dataIndex: 'confirmTime', width: 140, render: (time?: string) => time || '-' },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
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
    { title: '完成时间', dataIndex: 'completeTime', render: (time?: string) => time || '-' },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => <Button type="link" size="small">详情</Button>,
    },
  ]

  const renderContent = () => {
    return (
      <div>
        <div
          style={{
            marginBottom: '24px',
            padding: '20px',
            backgroundColor: '#fafafa',
            borderRadius: '4px',
            border: '1px solid #e8e8e8'
          }}
        >
          <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Input
              placeholder="对账单号"
              allowClear
              value={filters.statementNo}
              onChange={(e) => handleFilterChange({ ...filters, statementNo: e.target.value })}
              onPressEnter={() => handleSearch()}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Input
              placeholder="供应商名称"
              allowClear
              value={filters.supplierName}
              onChange={(e) => handleFilterChange({ ...filters, supplierName: e.target.value })}
              onPressEnter={() => handleSearch()}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Select
              placeholder="会计期间"
              style={{ width: '100%' }}
              allowClear
              value={filters.period}
              onChange={(value) => handleFilterChange({ ...filters, period: value })}
            >
              <Select.Option value="2026年1月">2026年1月</Select.Option>
              <Select.Option value="2026年2月">2026年2月</Select.Option>
              <Select.Option value="2026年3月">2026年3月</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Select
              placeholder="状态"
              style={{ width: '100%' }}
              allowClear
              value={filters.status}
              onChange={(value) => handleFilterChange({ ...filters, status: value })}
            >
              <Select.Option value="pending">待确认</Select.Option>
              <Select.Option value="confirmed">已确认</Select.Option>
              <Select.Option value="paid">已付款</Select.Option>
              <Select.Option value="disputed">有异议</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Space style={{ float: 'right' }}>
              <Button type="primary" onClick={() => handleSearch()} style={{ height: 32, width: 80 }}>
                查询
              </Button>
              <Button onClick={() => handleReset()} style={{ height: 32, width: 80 }}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
        </div>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button type="primary" onClick={handleBatchExport} style={{ height: 32 }}>导出</Button>
          </Space>
        </div>
        <Table
          rowKey="id"
          columns={statementColumns}
          dataSource={statements}
          rowSelection={{
            selectedRowKeys: selectedStatementIds,
            onChange: (selectedKeys) => setSelectedStatementIds(selectedKeys),
          }}
          pagination={{ pageSize: 10 }}
        />
      </div>
    )
  }

  return (
    <ProductAnnotation config={financeCenterAnnotations}>
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
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

        <Card>
          {renderContent()}
        </Card>

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
            <Title level={5} style={{ marginBottom: '16px' }}>基本信息</Title>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: '24px' }}>
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

            <Title level={5} style={{ marginBottom: '16px' }}>金额汇总</Title>
            <Card size="small" style={{ marginBottom: '24px', backgroundColor: '#f6ffed' }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="对账总额">
                  <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                    ¥{selectedStatement.totalAmount.toLocaleString()}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="已付金额">
                  <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                    ¥{selectedStatement.paidAmount.toLocaleString()}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="未付金额">
                  <span style={{ color: selectedStatement.unpaidAmount > 0 ? '#f5222d' : '#52c41a', fontWeight: 'bold' }}>
                    ¥{selectedStatement.unpaidAmount.toLocaleString()}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Title level={5} style={{ marginBottom: '16px' }}>关联发票</Title>
            <Table
              rowKey="id"
              columns={invoiceColumns}
              dataSource={invoices.filter(inv => inv.statementNo === selectedStatement.statementNo)}
              pagination={false}
              size="small"
              style={{ marginBottom: '24px' }}
            />

            <Title level={5} style={{ marginBottom: '16px' }}>付款记录</Title>
            <Table
              rowKey="id"
              columns={paymentColumns}
              dataSource={payments.filter(pay => pay.supplierName === selectedStatement.supplierName)}
              pagination={false}
              size="small"
            />
          </>
        )}
      </Drawer>
    </div>
    </ProductAnnotation>
  )
}

export default FinanceCenter
