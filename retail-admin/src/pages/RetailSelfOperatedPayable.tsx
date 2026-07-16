import { useState, useEffect } from 'react'
import {
  Table,
  Card,
  Row,
  Col,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Drawer,
  Descriptions,
  Typography,
  Divider,
  message,
  Modal,
  Alert,
} from 'antd'
import {
  FileTextOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import ProductAnnotation from '../components/ProductAnnotation'
import { retailSelfOperatedPayableAnnotations } from './annotations/retail-self-operated-payable'

const { Text } = Typography
const { Option } = Select

interface PayableItem {
  id: string
  payable_no: string
  supplier_code: string
  supplier_name: string
  legal_person_code: string
  accounting_period: string
  document_date: string
  total_amount: number
  unpaid_amount: number
  paid_amount: number
  status: 'pending' | 'confirmed' | 'settled' | 'invoiced' | 'completed'
  settlement_no?: string
  invoice_status?: 'pending' | 'submitted' | 'verified'
  remark: string
  is_hidden?: boolean
  created_at: string
}

const RetailSelfOperatedPayable: React.FC = () => {
  const [data, setData] = useState<PayableItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [filters, setFilters] = useState({
    period: '',
    status: '',
    payable_no: '',
    supplier_name: '',
    visibility: ''
  })
  const [selectedRecord, setSelectedRecord] = useState<PayableItem | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    setLoading(true)
    setTimeout(() => {
      const mockData: PayableItem[] = [
        {
          id: '1',
          payable_no: 'ZC202603001',
          supplier_code: 'SUP001',
          supplier_name: '农夫山泉股份有限公司',
          legal_person_code: 'LP001',
          accounting_period: '202603',
          document_date: '2026-03-01',
          total_amount: 119300,
          unpaid_amount: 119300,
          paid_amount: 0,
          status: 'pending',
          remark: '2026年3月自营应付',
          is_hidden: false,
          created_at: '2026-03-01 10:00'
        },
        {
          id: '2',
          payable_no: 'ZC202603002',
          supplier_code: 'SUP001',
          supplier_name: '农夫山泉股份有限公司',
          legal_person_code: 'LP001',
          accounting_period: '202603',
          document_date: '2026-03-05',
          total_amount: -5000,
          unpaid_amount: -5000,
          paid_amount: 0,
          status: 'pending',
          remark: '退货扣款',
          is_hidden: false,
          created_at: '2026-03-05 14:30'
        },
        {
          id: '3',
          payable_no: 'ZC202602001',
          supplier_code: 'SUP001',
          supplier_name: '农夫山泉股份有限公司',
          legal_person_code: 'LP001',
          accounting_period: '202602',
          document_date: '2026-02-01',
          total_amount: 98000,
          unpaid_amount: 0,
          paid_amount: 98000,
          status: 'completed',
          settlement_no: 'ST202602001',
          invoice_status: 'verified',
          remark: '2026年2月已结算',
          is_hidden: false,
          created_at: '2026-02-01 09:00'
        }
      ]
      setData(mockData)
      setLoading(false)
    }, 500)
  }

  const handleBatchToggleHidden = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一个单据')
      return
    }
    Modal.confirm({
      title: '确认隐藏',
      content: `确定要隐藏选中的 ${selectedRowKeys.length} 个单据吗？隐藏后供应商将无法看到这些单据。`,
      okText: '确认隐藏',
      cancelText: '取消',
      onOk: () => {
        message.success(`已隐藏 ${selectedRowKeys.length} 个单据`)
        setSelectedRowKeys([])
      }
    })
  }

  const handleBatchToggleVisible = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一个单据')
      return
    }
    Modal.confirm({
      title: '确认显示',
      content: `确定要显示选中的 ${selectedRowKeys.length} 个单据吗？显示后供应商将可以看到这些单据。`,
      okText: '确认显示',
      cancelText: '取消',
      onOk: () => {
        message.success(`已显示 ${selectedRowKeys.length} 个单据`)
        setSelectedRowKeys([])
      }
    })
  }

  const handleToggleSingleVisible = (record: PayableItem) => {
    const action = record.is_hidden ? '显示' : '隐藏'
    Modal.confirm({
      title: `确认${action}`,
      content: `确定要${action}该单据吗？${record.is_hidden ? '显示' : '隐藏'}后供应商将${record.is_hidden ? '可以' : '无法'}看到此单据。`,
      okText: `确认${action}`,
      cancelText: '取消',
      onOk: () => {
        message.success(`已${action}该单据`)
      }
    })
  }

  const columns: ColumnsType<PayableItem> = [
    {
      title: '单据编号',
      dataIndex: 'payable_no',
      key: 'payable_no',
      width: 120,
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 150,
      ellipsis: true
    },
    {
      title: '会计期间',
      dataIndex: 'accounting_period',
      key: 'accounting_period',
      width: 90,
      render: (period: string) => period
    },
    {
      title: '单据日期',
      dataIndex: 'document_date',
      key: 'document_date',
      width: 100,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: '单据金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 110,
      align: 'right',
      render: (amount: number) => (
        <Text strong style={{ color: amount >= 0 ? '#1890ff' : '#f5222d' }}>
          ¥{amount.toLocaleString()}
        </Text>
      )
    },
    {
      title: '未付金额',
      dataIndex: 'unpaid_amount',
      key: 'unpaid_amount',
      width: 110,
      align: 'right',
      render: (amount: number) => `¥${amount.toLocaleString()}`
    },
    {
      title: '可见性',
      dataIndex: 'is_hidden',
      key: 'is_hidden',
      width: 80,
      render: (isHidden?: boolean) => (
        <Tag color={isHidden ? 'red' : 'green'}>
          {isHidden ? '隐藏' : '可见'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => {
        const statusMap: any = {
          pending: { color: 'orange', text: '待确认' },
          confirmed: { color: 'blue', text: '已确认' },
          settled: { color: 'purple', text: '已结算' },
          invoiced: { color: 'cyan', text: '已开票' },
          completed: { color: 'green', text: '已完成' }
        }
        const config = statusMap[status] || { color: 'default', text: status }
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: '发票状态',
      dataIndex: 'invoice_status',
      key: 'invoice_status',
      width: 90,
      render: (status?: string) => {
        if (!status) return '-'
        const statusMap: any = {
          pending: { color: 'orange', text: '待提交' },
          submitted: { color: 'blue', text: '已提交' },
          verified: { color: 'green', text: '已核验' }
        }
        const config = statusMap[status]
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: '关联结算单',
      dataIndex: 'settlement_no',
      key: 'settlement_no',
      width: 120,
      render: (no?: string) => no || '-'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 120,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: PayableItem) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => setSelectedRecord(record)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            size="small"
            danger={record.is_hidden}
            onClick={() => handleToggleSingleVisible(record)}
          >
            {record.is_hidden ? '显示' : '隐藏'}
          </Button>
        </Space>
      )
    }
  ]

  return (
    <ProductAnnotation config={retailSelfOperatedPayableAnnotations}>
    <div>
      <Card style={{ marginBottom: 16 }}>
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
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input
                placeholder="单据编号"
                value={filters.payable_no}
                onChange={(e) => setFilters({ ...filters, payable_no: e.target.value })}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input
                placeholder="供应商名称"
                value={filters.supplier_name}
                onChange={(e) => setFilters({ ...filters, supplier_name: e.target.value })}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input
                placeholder="会计期间"
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="可见性"
                value={filters.visibility || undefined}
                onChange={(value) => setFilters({ ...filters, visibility: value })}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="visible">可见</Option>
                <Option value="hidden">隐藏</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="状态"
                value={filters.status || undefined}
                onChange={(value) => setFilters({ ...filters, status: value })}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="pending">待确认</Option>
                <Option value="confirmed">已确认</Option>
                <Option value="settled">已结算</Option>
                <Option value="completed">已完成</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Space style={{ float: 'right' }}>
                <Button type="primary" onClick={fetchData} style={{ height: 32, width: 80 }}>
                  查询
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </Card>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button>导出</Button>
            <Button onClick={handleBatchToggleVisible}>
              批量显示
            </Button>
            <Button danger onClick={handleBatchToggleHidden}>
              批量隐藏
            </Button>
          </Space>
          <Text type="secondary">
            已选择 {selectedRowKeys.length} 个单据
          </Text>
        </div>
        <Alert
          message="业务规则提示"
          description="1. 按会计期间合并正负金额单据生成结算申请；2. 负金额单据为必勾项；3. 结算单生成后可选择是否立即开具发票；4. 数据来源于 ERP 系统自动同步"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 1400 }}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true
          }}
        />
      </Card>

      <Drawer
        title="单据详情"
        placement="right"
        width={720}
        open={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      >
        {selectedRecord && (
          <div>
            <Descriptions title="基本信息" bordered column={2} size="small">
              <Descriptions.Item label="单据编号">
                {selectedRecord.payable_no}
              </Descriptions.Item>
              <Descriptions.Item label="供应商名称">
                {selectedRecord.supplier_name}
              </Descriptions.Item>
              <Descriptions.Item label="法人编码">
                {selectedRecord.legal_person_code}
              </Descriptions.Item>
              <Descriptions.Item label="会计期间">
                {selectedRecord.accounting_period}
              </Descriptions.Item>
              <Descriptions.Item label="单据日期">
                {dayjs(selectedRecord.document_date).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label="单据金额">
                <Text strong style={{ color: selectedRecord.total_amount >= 0 ? '#1890ff' : '#f5222d' }}>
                  ¥{selectedRecord.total_amount.toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="未付金额">
                ¥{selectedRecord.unpaid_amount.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="已付金额">
                ¥{selectedRecord.paid_amount?.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {selectedRecord.status === 'pending' && <Tag color="orange">待确认</Tag>}
                {selectedRecord.status === 'confirmed' && <Tag color="blue">已确认</Tag>}
                {selectedRecord.status === 'settled' && <Tag color="purple">已结算</Tag>}
                {selectedRecord.status === 'invoiced' && <Tag color="cyan">已开票</Tag>}
                {selectedRecord.status === 'completed' && <Tag color="green">已完成</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="发票状态">
                {selectedRecord.invoice_status === 'pending' && <Tag color="orange">待提交</Tag>}
                {selectedRecord.invoice_status === 'submitted' && <Tag color="blue">已提交</Tag>}
                {selectedRecord.invoice_status === 'verified' && <Tag color="green">已核验</Tag>}
              </Descriptions.Item>
              {selectedRecord.settlement_no && (
                <Descriptions.Item label="关联结算单">
                  {selectedRecord.settlement_no}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="创建时间">
                {selectedRecord.created_at}
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>
                {selectedRecord.remark}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
    </ProductAnnotation>
  )
}

export default RetailSelfOperatedPayable
