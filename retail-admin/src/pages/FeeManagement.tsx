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
  DatePicker,
  message,
} from 'antd'
import {
  DollarOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter'
import type { ColumnsType } from 'antd/es/table'
import ProductAnnotation from '../components/ProductAnnotation'
import { feeManagementAnnotations } from './annotations/fee-management'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

interface Fee {
  id: string
  feeNo: string
  feeType: string
  supplierName: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  applyTime: string
  approveTime?: string
  remark?: string
}

const FeeManagement = () => {
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null)
  const [filters, setFilters] = useState({
    feeNo: '',
    supplierName: '',
    feeType: '',
    status: ''
  })

  const fees: Fee[] = [
    {
      id: '1',
      feeNo: 'FEE202601001',
      feeType: '仓储费',
      supplierName: '统一企业食品有限公司',
      amount: 5000,
      status: 'approved',
      applyTime: '2026-02-01',
      approveTime: '2026-02-02',
      remark: '1月份仓储费用',
    },
    {
      id: '2',
      feeNo: 'FEE202601002',
      feeType: '运输费',
      supplierName: '伊利乳业股份有限公司',
      amount: 8000,
      status: 'pending',
      applyTime: '2026-02-03',
      remark: '2月份运输费用',
    },
    {
      id: '3',
      feeNo: 'FEE202601003',
      feeType: '服务费',
      supplierName: '好利来食品有限公司',
      amount: 3000,
      status: 'rejected',
      applyTime: '2026-02-04',
      remark: '费用明细不清晰',
    },
  ]

  const getFeeStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; text: string }> = {
      pending: { color: 'warning', text: '待审核' },
      approved: { color: 'success', text: '已通过' },
      rejected: { color: 'error', text: '已拒绝' },
    }
    return configs[status] || { color: 'default', text: status }
  }

  const columns: ColumnsType<Fee> = [
    { title: '费用单号', dataIndex: 'feeNo', key: 'feeNo' },
    { title: '费用类型', dataIndex: 'feeType', key: 'feeType' },
    { title: '供应商', dataIndex: 'supplierName', key: 'supplierName' },
    {
      title: '费用金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getFeeStatusConfig(status)
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime' },
    { title: '审核时间', dataIndex: 'approveTime', render: (time?: string) => time || '-' },
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
      feeNo: '',
      supplierName: '',
      feeType: '',
      status: ''
    })
    message.info('已重置筛选条件')
  }

  const handleViewDetail = (record: Fee) => {
    setSelectedFee(record)
    setDetailVisible(true)
  }

  const handleApprove = (id: string) => {
    message.success('审核成功')
  }

  const handleExport = () => {
    message.success('导出成功')
  }

  return (
    <ProductAnnotation config={feeManagementAnnotations}>
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
      <Card>
        <AdvancedSearchFilter
          fields={[
            { key: 'feeNo', label: '费用单号', type: 'input', placeholder: '请输入费用单号' },
            { key: 'supplierName', label: '供应商名称', type: 'input', placeholder: '请输入名称' },
            { key: 'feeType', label: '费用类型', type: 'select', placeholder: '请选择' },
            { key: 'status', label: '状态', type: 'select', placeholder: '请选择',
              options: [{ label: '待审核', value: 'pending' }, { label: '已通过', value: 'approved' }, { label: '已驳回', value: 'rejected' }]
            }
          ]}
          values={filters} onChange={(k,v)=>handleFilterChange({...filters,[k]:v})} onSearch={handleSearch} onReset={handleReset}
          extraActions={<><Button onClick={handleApprove} disabled>审核</Button><Button onClick={handleExport}>导出</Button></>}
        />
        <Table
          data-annotation-id="fee-table"
          rowKey="id"
          columns={columns}
          dataSource={fees}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Drawer
        title={`费用单详情 - ${selectedFee?.feeNo || ''}`}
        placement="right"
        width={720}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setDetailVisible(false)}>关闭</Button>
            {selectedFee?.status === 'pending' && (
              <Button type="primary" onClick={() => handleApprove(selectedFee.id)}>审核</Button>
            )}
          </Space>
        }
      >
        {selectedFee && (
          <>
            <Title level={5} style={{ marginBottom: '16px' }}>基本信息</Title>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="费用单号">{selectedFee.feeNo}</Descriptions.Item>
              <Descriptions.Item label="费用类型">{selectedFee.feeType}</Descriptions.Item>
              <Descriptions.Item label="供应商">{selectedFee.supplierName}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getFeeStatusConfig(selectedFee.status).color}>
                  {getFeeStatusConfig(selectedFee.status).text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="申请时间">{selectedFee.applyTime}</Descriptions.Item>
              <Descriptions.Item label="审核时间">{selectedFee.approveTime || '-'}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginBottom: '16px' }}>金额信息</Title>
            <Card size="small" style={{ marginBottom: '24px', backgroundColor: '#f6ffed' }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="费用金额">
                  <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                    ¥{selectedFee.amount.toLocaleString()}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Title level={5} style={{ marginBottom: '16px' }}>备注信息</Title>
            <Card size="small">
              <Text>{selectedFee.remark || '无'}</Text>
            </Card>
          </>
        )}
      </Drawer>
    </div>
    </ProductAnnotation>
  )
}

export default FeeManagement
