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
  Tabs,
  DatePicker,
  Select,
  Input,
  Timeline,
  Progress,
  message,
  Modal,
  Form,
  Row,
  Col,
  Upload,
} from 'antd'
import {
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  UploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

interface Contract {
  id: string
  contractNo: string
  title: string
  supplierId: string
  supplierName: string
  categoryId: string
  categoryName: string
  type: 'purchase' | 'framework' | 'annual'
  status: 'draft' | 'pending' | 'approved' | 'active' | 'expired' | 'terminated'
  startDate: string
  endDate: string
  totalAmount: number
  signedAmount: number
  signDate?: string
  creator: string
  createTime: string
  approveTime?: string
}

interface ContractDetail extends Contract {
  content: string
  attachments: { name: string; url: string }[]
  milestones: { name: string; date: string; status: string }[]
}

const ContractManagement = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedContract, setSelectedContract] = useState<ContractDetail | null>(null)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Mock data
  const contracts: Contract[] = [
    {
      id: '1',
      contractNo: 'CT2026001',
      title: '统一企业2026年度饮料采购框架合同',
      supplierId: 'SUP001',
      supplierName: '统一企业食品有限公司',
      categoryId: 'CAT001',
      categoryName: '饮料类',
      type: 'framework',
      status: 'active',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      totalAmount: 5000000,
      signedAmount: 850000,
      signDate: '2025-12-20',
      creator: '张经理',
      createTime: '2025-12-15',
      approveTime: '2025-12-18',
    },
    {
      id: '2',
      contractNo: 'CT2026002',
      title: '好利来零食采购合同',
      supplierId: 'SUP002',
      supplierName: '好利来食品有限公司',
      categoryId: 'CAT002',
      categoryName: '零食类',
      type: 'purchase',
      status: 'pending',
      startDate: '2026-02-01',
      endDate: '2026-07-31',
      totalAmount: 500000,
      signedAmount: 0,
      creator: '李主管',
      createTime: '2026-01-20',
    },
    {
      id: '3',
      contractNo: 'CT2026003',
      title: '伊利乳业年度合作协议',
      supplierId: 'SUP003',
      supplierName: '伊利乳业股份有限公司',
      categoryId: 'CAT003',
      categoryName: '乳制品',
      type: 'annual',
      status: 'approved',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      totalAmount: 3000000,
      signedAmount: 0,
      signDate: '2025-12-25',
      creator: '张经理',
      createTime: '2025-12-10',
      approveTime: '2025-12-22',
    },
    {
      id: '4',
      contractNo: 'CT2025015',
      title: '2025年饮料采购合同',
      supplierId: 'SUP001',
      supplierName: '统一企业食品有限公司',
      categoryId: 'CAT001',
      categoryName: '饮料类',
      type: 'annual',
      status: 'expired',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      totalAmount: 4500000,
      signedAmount: 4320000,
      signDate: '2024-12-15',
      creator: '张经理',
      createTime: '2024-12-01',
      approveTime: '2024-12-10',
    },
  ]

  const contractDetail: ContractDetail = {
    id: '1',
    contractNo: 'CT2026001',
    title: '统一企业2026年度饮料采购框架合同',
    supplierId: 'SUP001',
    supplierName: '统一企业食品有限公司',
    categoryId: 'CAT001',
    categoryName: '饮料类',
    type: 'framework',
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    totalAmount: 5000000,
    signedAmount: 850000,
    signDate: '2025-12-20',
    creator: '张经理',
    createTime: '2025-12-15',
    approveTime: '2025-12-18',
    content: '本合同为永辉超市股份有限公司与统一企业食品有限公司签订的2026年度饮料采购框架合同，约定了双方在合同期内的采购品种、价格机制、交货方式、结算方式等条款。',
    attachments: [
      { name: '采购框架合同.pdf', url: '#' },
      { name: '价格补充协议.pdf', url: '#' },
    ],
    milestones: [
      { name: '合同起草', date: '2025-12-15', status: 'completed' },
      { name: '内部审批', date: '2025-12-18', status: 'completed' },
      { name: '供应商确认', date: '2025-12-19', status: 'completed' },
      { name: '正式签订', date: '2025-12-20', status: 'completed' },
      { name: '合同生效', date: '2026-01-01', status: 'completed' },
    ],
  }

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
      draft: { color: 'default', text: '草稿', icon: <EditOutlined /> },
      pending: { color: 'orange', text: '待审批', icon: <ClockCircleOutlined /> },
      approved: { color: 'blue', text: '已审批', icon: <CheckCircleOutlined /> },
      active: { color: 'green', text: '生效中', icon: <SyncOutlined spin /> },
      expired: { color: 'red', text: '已过期', icon: <CloseCircleOutlined /> },
      terminated: { color: 'default', text: '已终止', icon: <CloseCircleOutlined /> },
    }
    return configs[status] || { color: 'default', text: status, icon: null }
  }

  const getTypeConfig = (type: string) => {
    const configs: Record<string, { color: string; text: string }> = {
      purchase: { color: 'blue', text: '采购合同' },
      framework: { color: 'purple', text: '框架合同' },
      annual: { color: 'cyan', text: '年度协议' },
    }
    return configs[type] || { color: 'default', text: type }
  }

  const handleViewDetail = (record: Contract) => {
    setSelectedContract(contractDetail)
    setDetailVisible(true)
  }

  const handleApprove = (id: string) => {
    Modal.confirm({
      title: '确认审批',
      content: '确定要审批通过该合同吗？',
      onOk: () => message.success('合同审批通过'),
    })
  }

  const handleCreate = () => {
    form.validateFields().then(() => {
      message.success('合同创建成功')
      setCreateModalVisible(false)
      form.resetFields()
    })
  }

  const filteredContracts = contracts.filter(c => {
    if (activeTab === 'all') return true
    return c.status === activeTab
  })

  const columns: ColumnsType<Contract> = [
    { title: '合同编号', dataIndex: 'contractNo', render: (text: string) => <a onClick={() => handleViewDetail(contracts.find(c => c.contractNo === text)!)}>{text}</a> },
    { 
      title: '合同名称', 
      dataIndex: 'title', 
      width: 280,
      ellipsis: true,
    },
    { title: '供应商', dataIndex: 'supplierName' },
    { title: '品类', dataIndex: 'categoryName', render: (text: string) => <Tag color="blue">{text}</Tag> },
    {
      title: '类型',
      dataIndex: 'type',
      render: (type: string) => {
        const config = getTypeConfig(type)
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status)
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>
      },
    },
    { 
      title: '合同金额', 
      dataIndex: 'totalAmount', 
      align: 'right',
      render: (val: number) => `¥${(val / 10000).toFixed(0)}万`
    },
    { title: '有效期', dataIndex: 'startDate', render: (_: unknown, record: Contract) => `${record.startDate} ~ ${record.endDate}` },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看</Button>
          {record.status === 'pending' && (
            <Button type="link" size="small" onClick={() => handleApprove(record.id)}>审批</Button>
          )}
          {record.status === 'draft' && (
            <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text type="secondary">生效中合同</Text>
                <Title level={2} style={{ margin: 0, color: '#52c41a' }}>12</Title>
              </div>
              <CheckCircleOutlined style={{ fontSize: 40, color: '#52c41a' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text type="secondary">待审批合同</Text>
                <Title level={2} style={{ margin: 0, color: '#faad14' }}>3</Title>
              </div>
              <ClockCircleOutlined style={{ fontSize: 40, color: '#faad14' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text type="secondary">即将到期</Text>
                <Title level={2} style={{ margin: 0, color: '#f5222d' }}>2</Title>
              </div>
              <CloseCircleOutlined style={{ fontSize: 40, color: '#f5222d' }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text type="secondary">合同总金额</Text>
                <Title level={2} style={{ margin: 0 }}>¥850万</Title>
              </div>
              <FileTextOutlined style={{ fontSize: 40, color: '#1890ff' }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 合同列表 */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
              新建合同
            </Button>
          }
          items={[
            { key: 'all', label: '全部合同' },
            { key: 'draft', label: '草稿' },
            { key: 'pending', label: '待审批' },
            { key: 'active', label: '生效中' },
            { key: 'expired', label: '已过期' },
          ].map(tab => ({
            key: tab.key,
            label: tab.label,
          }))}
        />

        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input.Search placeholder="搜索合同名称/编号" style={{ width: 250 }} />
            <Select style={{ width: 150 }} placeholder="供应商" allowClear />
            <Select style={{ width: 120 }} placeholder="合同类型" allowClear>
              <Select.Option value="purchase">采购合同</Select.Option>
              <Select.Option value="framework">框架合同</Select.Option>
              <Select.Option value="annual">年度协议</Select.Option>
            </Select>
            <RangePicker placeholder={['开始日期', '结束日期']} />
            <Button icon={<SearchOutlined />}>查询</Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredContracts}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
        />
      </Card>

      {/* 合同详情抽屉 */}
      <Drawer
        title={`合同详情 - ${selectedContract?.contractNo || ''}`}
        placement="right"
        width={720}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setDetailVisible(false)}>关闭</Button>
            {selectedContract?.status === 'active' && (
              <Button icon={<DownloadOutlined />}>下载合同</Button>
            )}
          </Space>
        }
      >
        {selectedContract && (
          <>
            {/* 基本信息 */}
            <Title level={5}><FileTextOutlined /> 合同基本信息</Title>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="合同编号">{selectedContract.contractNo}</Descriptions.Item>
              <Descriptions.Item label="合同名称" span={2}>{selectedContract.title}</Descriptions.Item>
              <Descriptions.Item label="供应商">{selectedContract.supplierName}</Descriptions.Item>
              <Descriptions.Item label="品类">
                <Tag color="blue">{selectedContract.categoryName}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="合同类型">
                <Tag color={getTypeConfig(selectedContract.type).color}>
                  {getTypeConfig(selectedContract.type).text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getStatusConfig(selectedContract.status).color}>
                  {getStatusConfig(selectedContract.status).text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="有效期起">{selectedContract.startDate}</Descriptions.Item>
              <Descriptions.Item label="有效期止">{selectedContract.endDate}</Descriptions.Item>
              <Descriptions.Item label="合同金额">¥{selectedContract.totalAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="已执行金额">¥{selectedContract.signedAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="签订日期">{selectedContract.signDate || '-'}</Descriptions.Item>
              <Descriptions.Item label="创建人">{selectedContract.creator}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedContract.createTime}</Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* 执行进度 */}
            <Title level={5}>执行进度</Title>
            <div style={{ marginBottom: 8 }}>
              <Text>合同执行率</Text>
              <Progress 
                percent={Math.round((selectedContract.signedAmount / selectedContract.totalAmount) * 100)} 
                status="active"
              />
            </div>

            <Divider />

            {/* 合同里程碑 */}
            <Title level={5}>合同里程碑</Title>
            <Timeline
              items={selectedContract.milestones.map(m => ({
                color: m.status === 'completed' ? 'green' : 'gray',
                children: (
                  <>
                    <Text strong>{m.name}</Text>
                    <br />
                    <Text type="secondary">{m.date}</Text>
                  </>
                ),
              }))}
            />

            <Divider />

            {/* 附件 */}
            <Title level={5}>合同附件</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              {selectedContract.attachments.map((file, idx) => (
                <Button key={idx} icon={<DownloadOutlined />} block>
                  {file.name}
                </Button>
              ))}
            </Space>
          </>
        )}
      </Drawer>

      {/* 新建合同弹窗 */}
      <Modal
        title="新建合同"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={handleCreate}
        okText="提交"
        cancelText="取消"
        width={640}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="合同名称" rules={[{ required: true }]}>
                <Input placeholder="请输入合同名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="合同类型" rules={[{ required: true }]}>
                <Select placeholder="选择合同类型">
                  <Select.Option value="purchase">采购合同</Select.Option>
                  <Select.Option value="framework">框架合同</Select.Option>
                  <Select.Option value="annual">年度协议</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="supplierId" label="供应商" rules={[{ required: true }]}>
                <Select placeholder="选择供应商">
                  <Select.Option value="SUP001">统一企业食品有限公司</Select.Option>
                  <Select.Option value="SUP002">好利来食品有限公司</Select.Option>
                  <Select.Option value="SUP003">伊利乳业股份有限公司</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="categoryId" label="品类" rules={[{ required: true }]}>
                <Select placeholder="选择品类">
                  <Select.Option value="CAT001">饮料类</Select.Option>
                  <Select.Option value="CAT002">零食类</Select.Option>
                  <Select.Option value="CAT003">乳制品</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startDate" label="开始日期" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="结束日期" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="totalAmount" label="合同金额" rules={[{ required: true }]}>
            <Input type="number" placeholder="请输入合同金额" prefix="¥" />
          </Form.Item>
          <Form.Item name="content" label="合同摘要">
            <Input.TextArea rows={4} placeholder="请输入合同摘要内容" />
          </Form.Item>
          <Form.Item name="attachments" label="上传合同文件">
            <Upload>
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ContractManagement
