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
  Statistic,
} from 'antd'
import {
  BankOutlined,
  DollarOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

interface Finance {
  id: string
  financeNo: string
  supplierName: string
  amount: number
  interestRate: number
  term: number
  status: 'pending' | 'approved' | 'rejected' | 'repaid'
  applyTime: string
  approveTime?: string
  repayTime?: string
}

const SupplyChainFinance = () => {
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedFinance, setSelectedFinance] = useState<Finance | null>(null)
  const [filters, setFilters] = useState({
    financeNo: '',
    supplierName: '',
    status: ''
  })

  const finances: Finance[] = [
    {
      id: '1',
      financeNo: 'FIN202601001',
      supplierName: '统一企业食品有限公司',
      amount: 500000,
      interestRate: 4.5,
      term: 90,
      status: 'approved',
      applyTime: '2026-02-01',
      approveTime: '2026-02-02',
    },
    {
      id: '2',
      financeNo: 'FIN202601002',
      supplierName: '伊利乳业股份有限公司',
      amount: 300000,
      interestRate: 4.2,
      term: 60,
      status: 'pending',
      applyTime: '2026-02-03',
    },
    {
      id: '3',
      financeNo: 'FIN202601003',
      supplierName: '好利来食品有限公司',
      amount: 200000,
      interestRate: 4.8,
      term: 30,
      status: 'repaid',
      applyTime: '2026-01-15',
      approveTime: '2026-01-16',
      repayTime: '2026-02-14',
    },
  ]

  const getFinanceStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; text: string }> = {
      pending: { color: 'warning', text: '待审核' },
      approved: { color: 'processing', text: '已通过' },
      rejected: { color: 'error', text: '已拒绝' },
      repaid: { color: 'success', text: '已还款' },
    }
    return configs[status] || { color: 'default', text: status }
  }

  const columns: ColumnsType<Finance> = [
    { title: '融资单号', dataIndex: 'financeNo', key: 'financeNo' },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName' },
    {
      title: '融资金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '利率',
      dataIndex: 'interestRate',
      key: 'interestRate',
      render: (rate: number) => `${rate}%`,
    },
    { title: '期限(天)', dataIndex: 'term', key: 'term' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getFinanceStatusConfig(status)
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime' },
    { title: '审核时间', dataIndex: 'approveTime', render: (time?: string) => time || '-' },
    { title: '还款时间', dataIndex: 'repayTime', render: (time?: string) => time || '-' },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
          {record.status === 'pending' && (
            <Button type="link" size="small" onClick={() => handleApprove(record.id)}>
              审核
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
      financeNo: '',
      supplierName: '',
      status: ''
    })
    message.info('已重置筛选条件')
  }

  const handleViewDetail = (record: Finance) => {
    setSelectedFinance(record)
    setDetailVisible(true)
  }

  const handleApprove = (id: string) => {
    message.success('审核成功')
  }

  const handleExport = () => {
    message.success('导出成功')
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="累计融资金额"
              value={1000000}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待审核申请"
              value={5}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已通过申请"
              value={12}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已还款金额"
              value={800000}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <AdvancedSearchFilter
          fields={[
            { key: 'financeNo', label: '融资单号', type: 'input', placeholder: '请输入融资单号' },
            { key: 'supplierName', label: '供应商名称', type: 'input', placeholder: '请输入名称' },
            { key: 'status', label: '状态', type: 'select', placeholder: '请选择',
              options: [{ label: '待审核', value: 'pending' }, { label: '已批准', value: 'approved' }, { label: '已驳回', value: 'rejected' }]
            }
          ]}
          values={filters} onChange={(k,v)=>handleFilterChange({...filters,[k]:v})} onSearch={handleSearch} onReset={handleReset}
          extraActions={<><Button onClick={handleApprove} disabled>审核</Button><Button onClick={handleExport}>导出</Button></>}
        />
        <Table
          rowKey="id"
          columns={columns}
          dataSource={finances}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Drawer
        title={`融资单详情 - ${selectedFinance?.financeNo || ''}`}
        placement="right"
        width={720}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setDetailVisible(false)}>关闭</Button>
            {selectedFinance?.status === 'pending' && (
              <Button type="primary" onClick={() => handleApprove(selectedFinance.id)}>审核</Button>
            )}
          </Space>
        }
      >
        {selectedFinance && (
          <>
            <Title level={5} style={{ marginBottom: '16px' }}>基本信息</Title>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="融资单号">{selectedFinance.financeNo}</Descriptions.Item>
              <Descriptions.Item label="供应商">{selectedFinance.supplierName}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getFinanceStatusConfig(selectedFinance.status).color}>
                  {getFinanceStatusConfig(selectedFinance.status).text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="期限">{selectedFinance.term} 天</Descriptions.Item>
              <Descriptions.Item label="申请时间">{selectedFinance.applyTime}</Descriptions.Item>
              <Descriptions.Item label="审核时间">{selectedFinance.approveTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="还款时间">{selectedFinance.repayTime || '-'}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginBottom: '16px' }}>金额信息</Title>
            <Card size="small" style={{ marginBottom: '24px', backgroundColor: '#f6ffed' }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="融资金额">
                  <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                    ¥{selectedFinance.amount.toLocaleString()}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="利率">
                  <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    {selectedFinance.interestRate}%
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </>
        )}
      </Drawer>
    </div>
  )
}

export default SupplyChainFinance
