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
  Statistic,
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
} from '@ant-design/icons'
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter'
import type { ColumnsType } from 'antd/es/table'
import ProductAnnotation from '../components/ProductAnnotation'
import { financialReconciliationAnnotations } from './annotations/financial-reconciliation'

const { Title, Text } = Typography

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

const FinancialReconciliation = () => {
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
      receiveTime: '2026-02-03',
    },
  ]

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
  ]

  const getStatementStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; text: string }> = {
      pending: { color: 'warning', text: '待确认' },
      confirmed: { color: 'processing', text: '已确认' },
      paid: { color: 'success', text: '已付款' },
      disputed: { color: 'error', text: '有异议' },
    }
    return configs[status] || { color: 'default', text: status }
  }

  const statementColumns: ColumnsType<Statement> = [
    { title: '对账单号', dataIndex: 'statementNo', key: 'statementNo' },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName' },
    { title: '账期', dataIndex: 'period', key: 'period' },
    {
      title: '对账总额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '已付金额',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '未付金额',
      dataIndex: 'unpaidAmount',
      key: 'unpaidAmount',
      render: (amount: number) => (
        <span style={{ color: amount > 0 ? '#f5222d' : '#52c41a', fontWeight: 'bold' }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      onCell: () => ({ 'data-annotation-id': 'col-statement-status' } as any),
      render: (status: string) => {
        const config = getStatementStatusConfig(status)
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '操作',
      key: 'action',
      width: 150,
      onCell: () => ({ 'data-annotation-id': 'col-action' } as any),
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" data-annotation-id="btn-view-detail" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
          {record.status === 'pending' && (
            <Button type="link" size="small" data-annotation-id="btn-confirm-statement" onClick={() => handleConfirm(record.id)}>
              确认
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const invoiceColumns: ColumnsType<Invoice> = [
    { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo' },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName' },
    {
      title: '发票金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '税额',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const configs: Record<string, { color: string; text: string }> = {
          pending: { color: 'default', text: '待收票' },
          received: { color: 'processing', text: '已收票' },
          verified: { color: 'success', text: '已核验' },
          archived: { color: 'default', text: '已归档' },
        }
        const config = configs[status] || { color: 'default', text: status }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    { title: '收票时间', dataIndex: 'receiveTime', render: (time?: string) => time || '-' },
  ]

  const paymentColumns: ColumnsType<Payment> = [
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
        const configs: Record<string, { color: string; text: string }> = {
          pending: { color: 'default', text: '待处理' },
          processing: { color: 'processing', text: '处理中' },
          completed: { color: 'success', text: '已完成' },
          failed: { color: 'error', text: '失败' },
        }
        const config = configs[status] || { color: 'default', text: status }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime' },
    { title: '完成时间', dataIndex: 'completeTime', render: (time?: string) => time || '-' },
  ]

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const handleSearch = () => {
    message.success('查询成功')
  }

  const handleReset = () => {
    setFilters({
      statementNo: '',
      supplierName: '',
      period: '',
      status: ''
    })
    message.info('已重置筛选条件')
  }

  const handleViewDetail = (record: Statement) => {
    setSelectedStatement(record)
    setDetailVisible(true)
  }

  const handleConfirm = (id: string) => {
    Modal.confirm({
      title: '确认对账单',
      content: '确认后将对账单状态改为已确认，是否继续？',
      onOk: () => {
        message.success('确认成功')
      },
    })
  }

  const handleBatchConfirm = (ids: React.Key[]) => {
    if (ids.length === 0) {
      message.warning('请先选择要确认的对账单')
      return
    }
    Modal.confirm({
      title: '批量确认对账单',
      content: `确认后将 ${ids.length} 条对账单状态改为已确认，是否继续？`,
      onOk: () => {
        message.success(`成功确认 ${ids.length} 条对账单`)
        setSelectedStatementIds([])
      },
    })
  }

  const handleBatchExport = () => {
    message.success('导出成功')
  }

  return (
    <ProductAnnotation config={financialReconciliationAnnotations}>
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card data-annotation-id="stat-payable">
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
        <Alert
          data-annotation-id="alert-rule"
          message="业务规则提示"
          description="1. 按会计期间合并正负金额单据生成结算申请；2. 负金额单据为必勾项；3. 结算单生成后可选择是否立即开具发票。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <AdvancedSearchFilter
          fields={[
            { key: 'statementNo', label: '对账单号', type: 'input', placeholder: '请输入对账单号' },
            { key: 'supplierName', label: '供应商名称', type: 'input', placeholder: '请输入名称' },
            { key: 'period', label: '会计期间', type: 'input', placeholder: '请输入期间' },
            { key: 'status', label: '状态', type: 'select', placeholder: '请选择',
              options: [{ label: '待确认', value: 'pending' }, { label: '已确认', value: 'confirmed' }, { label: '已完成', value: 'completed' }]
            }
          ]}
          values={filters} onChange={(k,v)=>handleFilterChange({...filters,[k]:v})} onSearch={handleSearch} onReset={handleReset}
          extraActions={<Button type="primary" onClick={handleBatchConfirm} disabled={!selectedStatementIds.length}>批量确认</Button>}
        />
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button type="primary" data-annotation-id="btn-batch-confirm" onClick={() => handleBatchConfirm(selectedStatementIds)} style={{ height: 32 }}>批量确认</Button>
            <Button type="primary" data-annotation-id="btn-export" onClick={handleBatchExport} style={{ height: 32 }}>导出</Button>
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
              data-annotation-id="related-invoices"
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

export default FinancialReconciliation
