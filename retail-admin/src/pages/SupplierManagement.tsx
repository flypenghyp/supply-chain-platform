import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Rate,
  Tabs,
  Descriptions,
  message,
} from 'antd'
import {
  PlusOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { usePermission } from '@/contexts/PermissionContext'

const { TabPane } = Tabs

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)

  const { canEdit, getManagedCategories } = usePermission()
  const categories = getManagedCategories()

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    setLoading(true)
    const mockSuppliers = [
      {
        id: '1',
        code: 'SUP001',
        name: '统一企业食品有限公司',
        status: 'active',
        categoryIds: ['CAT001'],
        categoryNames: ['饮料类'],
        contractStatus: 'signed',
        rating: 4.5,
        contactPerson: '张经理',
        phone: '13800138001',
        email: 'zhang@tongyi.com',
        address: '北京市朝阳区xx路xx号',
        cooperationDate: '2020-01-15',
        totalOrders: 156,
        totalAmount: 2500000,
      },
      {
        id: '2',
        code: 'SUP002',
        name: '好利来食品有限公司',
        status: 'active',
        categoryIds: ['CAT002'],
        categoryNames: ['零食类'],
        contractStatus: 'signed',
        rating: 4.8,
        contactPerson: '李经理',
        phone: '13800138002',
        email: 'li@haolilai.com',
        address: '上海市浦东新区xx路xx号',
        cooperationDate: '2019-06-20',
        totalOrders: 128,
        totalAmount: 1800000,
      },
      {
        id: '3',
        code: 'SUP003',
        name: '伊利乳业股份有限公司',
        status: 'active',
        categoryIds: ['CAT003'],
        categoryNames: ['乳制品'],
        contractStatus: 'signed',
        rating: 4.9,
        contactPerson: '王经理',
        phone: '13800138003',
        email: 'wang@yili.com',
        address: '内蒙古自治区呼和浩特市xx路xx号',
        cooperationDate: '2018-03-10',
        totalOrders: 200,
        totalAmount: 3500000,
      },
    ]
    setSuppliers(mockSuppliers)
    setLoading(false)
  }

  const handleViewDetail = (record: any) => {
    setSelectedSupplier(record)
    setDetailVisible(true)
  }

  const handleApproveSupplier = (record: any) => {
    message.success(`供应商 ${record.name} 审核通过`)
    setSuppliers(suppliers.map(s => s.id === record.id ? { ...s, status: 'active' } : s))
  }

  const handleRejectSupplier = (record: any) => {
    message.success(`供应商 ${record.name} 审核拒绝`)
    setSuppliers(suppliers.map(s => s.id === record.id ? { ...s, status: 'inactive' } : s))
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'success',
      inactive: 'default',
      pending: 'warning',
    }
    return colors[status] || 'default'
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      active: '合作中',
      inactive: '已停用',
      pending: '待审核',
    }
    return texts[status] || status
  }

  const columns = [
    { title: '供应商编码', dataIndex: 'code', key: 'code' },
    { title: '供应商名称', dataIndex: 'name', key: 'name', render: (text: string) => <a>{text}</a> },
    { title: '品类', dataIndex: 'categoryNames', key: 'categoryNames', render: (categories: string[]) => categories.map(c => <Tag key={c} color="blue">{c}</Tag>) },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag> },
    { title: '合同状态', dataIndex: 'contractStatus', key: 'contractStatus', render: (status: string) => <Tag color={status === 'signed' ? 'success' : 'warning'}>{status === 'signed' ? '已签约' : '待签约'}</Tag> },
    { title: '评分', dataIndex: 'rating', key: 'rating', render: (rating: number) => <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} /> },
    { title: '订单数', dataIndex: 'totalOrders', key: 'totalOrders', align: 'right' as const },
    { title: '交易总额', dataIndex: 'totalAmount', key: 'totalAmount', align: 'right' as const, render: (val: number) => `¥${(val / 10000).toFixed(1)}万` },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: any) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看</Button>
          {record.status === 'pending' && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} style={{ color: '#52c41a' }} onClick={() => handleApproveSupplier(record)}>通过</Button>
              <Button type="link" size="small" icon={<CloseCircleOutlined />} style={{ color: '#f5222d' }} onClick={() => handleRejectSupplier(record)}>拒绝</Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input placeholder="供应商名称" style={{ width: 200 }} />
          <Select placeholder="选择品类" style={{ width: 150 }} options={categories.map(c => ({ label: c.categoryName, value: c.categoryId }))} />
          <Button type="primary">查询</Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />}>添加供应商</Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={suppliers}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="供应商详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedSupplier && (
          <Tabs defaultActiveKey="basic">
            <TabPane tab="基本信息" key="basic">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="供应商编码">{selectedSupplier.code}</Descriptions.Item>
                <Descriptions.Item label="供应商名称">{selectedSupplier.name}</Descriptions.Item>
                <Descriptions.Item label="品类">{selectedSupplier.categoryNames.join(', ')}</Descriptions.Item>
                <Descriptions.Item label="状态"><Tag color={getStatusColor(selectedSupplier.status)}>{getStatusText(selectedSupplier.status)}</Tag></Descriptions.Item>
                <Descriptions.Item label="联系人">{selectedSupplier.contactPerson}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{selectedSupplier.phone}</Descriptions.Item>
                <Descriptions.Item label="邮箱">{selectedSupplier.email}</Descriptions.Item>
                <Descriptions.Item label="合作日期">{selectedSupplier.cooperationDate}</Descriptions.Item>
                <Descriptions.Item label="地址" span={2}>{selectedSupplier.address}</Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="合作数据" key="data">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="总订单数">{selectedSupplier.totalOrders}</Descriptions.Item>
                <Descriptions.Item label="交易总额">¥{selectedSupplier.totalAmount.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="评分"><Rate disabled defaultValue={selectedSupplier.rating} /></Descriptions.Item>
                <Descriptions.Item label="合同状态"><Tag color={selectedSupplier.contractStatus === 'signed' ? 'success' : 'warning'}>{selectedSupplier.contractStatus === 'signed' ? '已签约' : '待签约'}</Tag></Descriptions.Item>
              </Descriptions>
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </Card>
  )
}

export default SupplierManagement
