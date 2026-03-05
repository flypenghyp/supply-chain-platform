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
  Form,
  Input,
  Select,
  Avatar,
  List,
  Tree,
  message,
  Modal,
  Row,
  Col,
} from 'antd'
import {
  BankOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  SafetyOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

interface Department {
  id: string
  name: string
  parentId?: string
  manager?: string
  employeeCount: number
}

interface Employee {
  id: string
  name: string
  department: string
  position: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  roles: string[]
}

interface CompanyInfo {
  name: string
  shortName: string
  creditCode: string
  address: string
  phone: string
  email: string
  bankName: string
  bankAccount: string
  legalPerson: string
}

const EnterpriseCenter = () => {
  const [activeTab, setActiveTab] = useState('info')
  const [employeeDrawerVisible, setEmployeeDrawerVisible] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [addEmployeeModalVisible, setAddEmployeeModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Mock data
  const companyInfo: CompanyInfo = {
    name: '永辉超市股份有限公司',
    shortName: '永辉超市',
    creditCode: '91350100315612345X',
    address: '福建省福州市鼓楼区五四路137号',
    phone: '0591-87654321',
    email: 'contact@yonghui.cn',
    bankName: '中国建设银行福州分行',
    bankAccount: '35001876400051234567',
    legalPerson: '张轩松',
  }

  const departments: Department[] = [
    { id: '1', name: '采购部', employeeCount: 45 },
    { id: '2', name: '财务部', employeeCount: 20 },
    { id: '3', name: '物流部', employeeCount: 80 },
    { id: '4', name: '质量部', employeeCount: 15 },
    { id: '5', name: '信息部', employeeCount: 25 },
    { id: '1-1', name: '饮料采购组', parentId: '1', employeeCount: 12 },
    { id: '1-2', name: '零食采购组', parentId: '1', employeeCount: 10 },
    { id: '1-3', name: '乳制品采购组', parentId: '1', employeeCount: 8 },
  ]

  const employees: Employee[] = [
    {
      id: '1',
      name: '张经理',
      department: '采购部',
      position: '采购经理',
      email: 'zhang@yonghui.cn',
      phone: '13800138001',
      status: 'active',
      roles: ['采购审批', '供应商管理', '合同管理'],
    },
    {
      id: '2',
      name: '李主管',
      department: '饮料采购组',
      position: '采购主管',
      email: 'li@yonghui.cn',
      phone: '13800138002',
      status: 'active',
      roles: ['订单管理', '供应商查看'],
    },
    {
      id: '3',
      name: '王会计',
      department: '财务部',
      position: '财务专员',
      email: 'wang@yonghui.cn',
      phone: '13800138003',
      status: 'active',
      roles: ['对账管理', '付款审批'],
    },
  ]

  const departmentTree = [
    {
      title: '永辉超市',
      key: 'root',
      children: [
        {
          title: '采购部 (45人)',
          key: '1',
          children: [
            { title: '饮料采购组 (12人)', key: '1-1' },
            { title: '零食采购组 (10人)', key: '1-2' },
            { title: '乳制品采购组 (8人)', key: '1-3' },
          ],
        },
        { title: '财务部 (20人)', key: '2' },
        { title: '物流部 (80人)', key: '3' },
        { title: '质量部 (15人)', key: '4' },
        { title: '信息部 (25人)', key: '5' },
      ],
    },
  ]

  const handleViewEmployee = (record: Employee) => {
    setSelectedEmployee(record)
    setEmployeeDrawerVisible(true)
  }

  const handleAddEmployee = () => {
    form.resetFields()
    setAddEmployeeModalVisible(true)
  }

  const handleSubmitEmployee = () => {
    form.validateFields().then(() => {
      message.success('员工添加成功')
      setAddEmployeeModalVisible(false)
    })
  }

  const employeeColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      render: (text: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {text}
        </Space>
      ),
    },
    { title: '部门', dataIndex: 'department', render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: '职位', dataIndex: 'position' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '电话', dataIndex: 'phone' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '在职' : '离职'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: Employee) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewEmployee(record)}>查看</Button>
          <Button type="link" size="small">编辑</Button>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'info',
            label: '企业信息',
            icon: <BankOutlined />,
            children: (
              <>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="企业名称">{companyInfo.name}</Descriptions.Item>
                  <Descriptions.Item label="简称">{companyInfo.shortName}</Descriptions.Item>
                  <Descriptions.Item label="统一社会信用代码">{companyInfo.creditCode}</Descriptions.Item>
                  <Descriptions.Item label="法定代表人">{companyInfo.legalPerson}</Descriptions.Item>
                  <Descriptions.Item label="注册地址" span={2}>{companyInfo.address}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{companyInfo.phone}</Descriptions.Item>
                  <Descriptions.Item label="电子邮箱">{companyInfo.email}</Descriptions.Item>
                  <Descriptions.Item label="开户银行">{companyInfo.bankName}</Descriptions.Item>
                  <Descriptions.Item label="银行账号">{companyInfo.bankAccount}</Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: 16 }}>
                  <Button icon={<EditOutlined />}>编辑企业信息</Button>
                </div>
              </>
            ),
          },
          {
            key: 'organization',
            label: '组织架构',
            icon: <TeamOutlined />,
            children: (
              <Row gutter={24}>
                <Col span={8}>
                  <Card title="部门结构" size="small" extra={<Button type="link" icon={<PlusOutlined />}>新增部门</Button>}>
                    <Tree
                      treeData={departmentTree}
                      defaultExpandAll
                      selectable
                    />
                  </Card>
                </Col>
                <Col span={16}>
                  <Card title="部门详情" size="small">
                    <Descriptions column={2} size="small">
                      <Descriptions.Item label="部门名称">采购部</Descriptions.Item>
                      <Descriptions.Item label="部门负责人">张经理</Descriptions.Item>
                      <Descriptions.Item label="员工人数">45人</Descriptions.Item>
                      <Descriptions.Item label="上级部门">总部</Descriptions.Item>
                    </Descriptions>
                    <Divider />
                    <Title level={5}>部门职能</Title>
                    <Text type="secondary">负责公司各类商品的采购工作，包括供应商开发、价格谈判、合同签订、订单管理等工作。</Text>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'employees',
            label: '员工管理',
            icon: <UserOutlined />,
            children: (
              <>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                  <Space>
                    <Input.Search placeholder="搜索员工姓名" style={{ width: 200 }} />
                    <Select style={{ width: 150 }} placeholder="选择部门" allowClear />
                    <Select style={{ width: 120 }} placeholder="状态" allowClear>
                      <Select.Option value="active">在职</Select.Option>
                      <Select.Option value="inactive">离职</Select.Option>
                    </Select>
                  </Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEmployee}>添加员工</Button>
                </div>
                <Table
                  rowKey="id"
                  columns={employeeColumns}
                  dataSource={employees}
                  pagination={{ pageSize: 10 }}
                />
              </>
            ),
          },
          {
            key: 'roles',
            label: '角色权限',
            icon: <SafetyOutlined />,
            children: (
              <Row gutter={24}>
                <Col span={8}>
                  <Card title="角色列表" size="small">
                    <List
                      dataSource={[
                        { name: '系统管理员', count: 2 },
                        { name: '采购经理', count: 5 },
                        { name: '采购专员', count: 20 },
                        { name: '财务经理', count: 3 },
                        { name: '财务专员', count: 8 },
                      ]}
                      renderItem={(item) => (
                        <List.Item
                          actions={[<a key="edit">编辑</a>]}
                          style={{ cursor: 'pointer' }}
                        >
                          <Space>
                            <Tag color="blue">{item.name}</Tag>
                            <Text type="secondary">({item.count}人)</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                    <Button type="dashed" block icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                      新增角色
                    </Button>
                  </Card>
                </Col>
                <Col span={16}>
                  <Card title="角色权限配置" size="small">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="角色名称">采购经理</Descriptions.Item>
                      <Descriptions.Item label="角色描述">负责采购部门的管理工作，具有审批权限</Descriptions.Item>
                    </Descriptions>
                    <Divider />
                    <Title level={5}>功能权限</Title>
                    <Tree
                      treeData={[
                        {
                          title: '订单管理',
                          key: 'order',
                          children: [
                            { title: '查看订单', key: 'order-view' },
                            { title: '创建订单', key: 'order-create' },
                            { title: '审批订单', key: 'order-approve' },
                          ],
                        },
                        {
                          title: '供应商管理',
                          key: 'supplier',
                          children: [
                            { title: '查看供应商', key: 'supplier-view' },
                            { title: '编辑供应商', key: 'supplier-edit' },
                          ],
                        },
                        {
                          title: '合同管理',
                          key: 'contract',
                          children: [
                            { title: '查看合同', key: 'contract-view' },
                            { title: '创建合同', key: 'contract-create' },
                            { title: '审批合同', key: 'contract-approve' },
                          ],
                        },
                      ]}
                      checkable
                      defaultExpandedKeys={['order', 'supplier', 'contract']}
                      defaultCheckedKeys={['order-view', 'order-create', 'order-approve', 'supplier-view', 'contract-view', 'contract-approve']}
                    />
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />

      {/* 员工详情抽屉 */}
      <Drawer
        title="员工详情"
        placement="right"
        width={560}
        onClose={() => setEmployeeDrawerVisible(false)}
        open={employeeDrawerVisible}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setEmployeeDrawerVisible(false)}>关闭</Button>
            <Button type="primary">编辑</Button>
          </Space>
        }
      >
        {selectedEmployee && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={80} icon={<UserOutlined />} />
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>{selectedEmployee.name}</Title>
              <Text type="secondary">{selectedEmployee.position}</Text>
            </div>

            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label={<><UserOutlined /> 姓名</>}>{selectedEmployee.name}</Descriptions.Item>
              <Descriptions.Item label={<><TeamOutlined /> 部门</>}>
                <Tag color="blue">{selectedEmployee.department}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="职位">{selectedEmployee.position}</Descriptions.Item>
              <Descriptions.Item label={<><MailOutlined /> 邮箱</>}>{selectedEmployee.email}</Descriptions.Item>
              <Descriptions.Item label={<><PhoneOutlined /> 电话</>}>{selectedEmployee.phone}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={selectedEmployee.status === 'active' ? 'green' : 'default'}>
                  {selectedEmployee.status === 'active' ? '在职' : '离职'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>角色权限</Title>
            <Space wrap>
              {selectedEmployee.roles.map((role) => (
                <Tag key={role} color="blue">{role}</Tag>
              ))}
            </Space>
          </>
        )}
      </Drawer>

      {/* 添加员工弹窗 */}
      <Modal
        title="添加员工"
        open={addEmployeeModalVisible}
        onCancel={() => setAddEmployeeModalVisible(false)}
        onOk={handleSubmitEmployee}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
                <Input placeholder="请输入员工姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="department" label="部门" rules={[{ required: true }]}>
                <Select placeholder="选择部门">
                  {departments.filter(d => !d.parentId).map(d => (
                    <Select.Option key={d.id} value={d.name}>{d.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="position" label="职位" rules={[{ required: true }]}>
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="电话" rules={[{ required: true }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>
          <Form.Item name="roles" label="角色">
            <Select mode="multiple" placeholder="选择角色">
              <Select.Option value="order">订单管理</Select.Option>
              <Select.Option value="supplier">供应商管理</Select.Option>
              <Select.Option value="finance">财务管理</Select.Option>
              <Select.Option value="contract">合同管理</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default EnterpriseCenter
