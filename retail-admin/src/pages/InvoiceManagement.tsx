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
  FileTextOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter'
import type { ColumnsType } from 'antd/es/table'
import ProductAnnotation from '../components/ProductAnnotation'
import { invoiceManagementAnnotations } from './annotations/invoice-management'

const { Title, Text } = Typography

interface Invoice {
  id: string
  invoiceNo: string
  statementNo: string
  supplierName: string
  amount: number
  taxAmount: number
  status: 'pending' | 'received' | 'verified' | 'archived'
  receiveTime?: string
  verifyTime?: string
}

const InvoiceManagement = () => {
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [filters, setFilters] = useState({
    invoiceNo: '',
    supplierName: '',
    status: ''
  })

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
      verifyTime: '2026-02-06',
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
    {
      id: '3',
      invoiceNo: 'INV202601003',
      statementNo: 'STM202601001',
      supplierName: '统一企业食品有限公司',
      amount: 168000,
      taxAmount: 21840,
      status: 'pending',
    },
    {
      id: '4',
      invoiceNo: 'INV202601004',
      statementNo: 'STM202601002',
      supplierName: '好利来食品有限公司',
      amount: 35000,
      taxAmount: 4550,
      status: 'archived',
      receiveTime: '2026-02-02',
      verifyTime: '2026-02-03',
    },
  ]

  const getInvoiceStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; text: string }> = {
      pending: { color: 'default', text: '待收票' },
      received: { color: 'processing', text: '已收票' },
      verified: { color: 'success', text: '已核验' },
      archived: { color: 'default', text: '已归档' },
    }
    return configs[status] || { color: 'default', text: status }
  }

  const columns: ColumnsType<Invoice> = [
    { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo' },
    { title: '对账单号', dataIndex: 'statementNo', key: 'statementNo' },
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
        const config = getInvoiceStatusConfig(status)
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    { title: '收票时间', dataIndex: 'receiveTime', render: (time?: string) => time || '-' },
    { title: '核验时间', dataIndex: 'verifyTime', render: (time?: string) => time || '-' },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
          {record.status === 'received' && (
            <Button type="link" size="small" onClick={() => handleVerify(record.id)}>
              核验
            </Button>
          )}
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
      invoiceNo: '',
      supplierName: '',
      status: ''
    })
    message.info('已重置筛选条件')
  }

  const handleViewDetail = (record: Invoice) => {
    setSelectedInvoice(record)
    setDetailVisible(true)
  }

  const handleVerify = (id: string) => {
    message.success('核验成功')
  }

  const handleExport = () => {
    message.success('导出成功')
  }

  return (
    <ProductAnnotation config={invoiceManagementAnnotations}>
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
      <Card>
        <AdvancedSearchFilter
          fields={[
            { key: 'invoiceNo', label: '发票号码', type: 'input', placeholder: '请输入发票号码' },
            { key: 'supplierName', label: '供应商名称', type: 'input', placeholder: '请输入名称' },
            { key: 'status', label: '状态', type: 'select', placeholder: '请选择',
              options: [{ label: '待核验', value: 'received' }, { label: '已核验', value: 'verified' }, { label: '已驳回', value: 'rejected' }]
            }
          ]}
          values={filters} onChange={(k,v)=>handleFilterChange({...filters,[k]:v})} onSearch={handleSearch} onReset={handleReset}
          extraActions={<Button onClick={handleExport}>导出</Button>}
        />
        <Table
          data-annotation-id="invoice-table"
          rowKey="id"
          columns={columns}
          dataSource={invoices}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Drawer
        title={`发票详情 - ${selectedInvoice?.invoiceNo || ''}`}
        placement="right"
        width={720}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setDetailVisible(false)}>关闭</Button>
            {selectedInvoice?.status === 'received' && (
              <Button type="primary" onClick={() => handleVerify(selectedInvoice.id)}>核验</Button>
            )}
          </Space>
        }
      >
        {selectedInvoice && (
          <>
            <Title level={5} style={{ marginBottom: '16px' }}>基本信息</Title>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="发票号码">{selectedInvoice.invoiceNo}</Descriptions.Item>
              <Descriptions.Item label="对账单号">{selectedInvoice.statementNo}</Descriptions.Item>
              <Descriptions.Item label="供应商">{selectedInvoice.supplierName}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getInvoiceStatusConfig(selectedInvoice.status).color}>
                  {getInvoiceStatusConfig(selectedInvoice.status).text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="收票时间">{selectedInvoice.receiveTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="核验时间">{selectedInvoice.verifyTime || '-'}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginBottom: '16px' }}>金额信息</Title>
            <Card size="small" style={{ marginBottom: '24px', backgroundColor: '#f6ffed' }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="发票金额">
                  <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                    ¥{selectedInvoice.amount.toLocaleString()}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="税额">
                  <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    ¥{selectedInvoice.taxAmount.toLocaleString()}
                  </span>
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

export default InvoiceManagement
