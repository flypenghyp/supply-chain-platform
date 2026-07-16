import React, { useState, useEffect } from 'react'
import {
  Table, Button, Space, Tag, Modal, Form, Input, Select, message, Popconfirm,
  Card, Row, Col, Statistic, Tabs, Empty, Alert,
} from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  UserOutlined, FileTextOutlined, ReloadOutlined,
} from '@ant-design/icons'
import { usePermission } from '@/contexts/PermissionContext'
import type { SupplierUser, Role, DataScopeType, OperationLog } from '@/types/phase1'
import { roleApi, operationLogApi } from '@/services/phase1'
import OperationLogModal from './OperationLogModal'
import AuthorizationLetterModal from './AuthorizationLetterModal'

const { Option } = Select

// 手机号脱敏
const maskPhone = (phone: string) => phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || '-'

const UserManagement: React.FC = () => {
  const { isAdmin, hasAnyRole } = usePermission()

  // 数据
  const [users, setUsers] = useState<SupplierUser[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)

  // 弹窗
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<SupplierUser | null>(null)
  const [logModalOpen, setLogModalOpen] = useState(false)
  const [logUserId, setLogUserId] = useState<string>('')
  const [logUserName, setLogUserName] = useState<string>('')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authUserId, setAuthUserId] = useState<string>('')

  const [form] = Form.useForm()

  // 加载数据（mock 数据 - 后端 API 已有，前端用 mock 演示）
  const loadData = async () => {
    setLoading(true)
    try {
      // 真实 API 调用（后端已实现）
      // const res = await roleApi.list()
      // setRoles((res as any).data || [])

      // Mock 数据（一期前端先行）
      setRoles([
        { id: '1', code: 'super_admin', name: '超管', type: 'system', permissions: ['*'], status: 'active', created_at: '', updated_at: '' },
        { id: '2', code: 'area_manager', name: '区域管理员', type: 'system', permissions: ['user:read', 'user:write'], status: 'active', created_at: '', updated_at: '' },
        { id: '3', code: 'store_manager', name: '店长', type: 'system', permissions: ['user:read'], status: 'active', created_at: '', updated_at: '' },
        { id: '4', code: 'staff', name: '店员', type: 'system', permissions: ['view'], status: 'active', created_at: '', updated_at: '' },
        { id: '5', code: 'finance', name: '财务', type: 'system', permissions: ['view', 'finance:read'], status: 'active', created_at: '', updated_at: '' },
      ])
      setUsers([
        { id: '1', supplier_code: 'NFS001', name: '张三', phone: '13800138000', email: 'zhang@example.com', role: 'super_admin', role_name: '超管', role_type: 'system', status: 'active', data_scope_type: 'all', data_scope_ids: [], created_at: '2026-07-01', updated_at: '2026-07-01' },
        { id: '2', supplier_code: 'NFS001', name: '李四', phone: '13800138001', role: 'area_manager', role_name: '区域管理员', role_type: 'system', status: 'active', data_scope_type: 'region', data_scope_ids: ['R001', 'R002'], created_at: '2026-07-02', updated_at: '2026-07-02' },
        { id: '3', supplier_code: 'NFS001', name: '王五', phone: '13800138002', role: 'store_manager', role_name: '店长', role_type: 'system', status: 'active', data_scope_type: 'store', data_scope_ids: ['store_001'], created_at: '2026-07-03', updated_at: '2026-07-03' },
        { id: '4', supplier_code: 'NFS001', name: '赵六', phone: '13800138003', role: 'staff', role_name: '店员', role_type: 'system', status: 'active', data_scope_type: 'store', data_scope_ids: ['store_001'], created_at: '2026-07-04', updated_at: '2026-07-04' },
        { id: '5', supplier_code: 'NFS001', name: '钱七', phone: '13800138004', role: 'finance', role_name: '财务', role_type: 'system', status: 'active', data_scope_type: 'all', data_scope_ids: [], created_at: '2026-07-05', updated_at: '2026-07-05' },
      ])
    } catch (e) {
      message.error('加载失败：' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // 编辑
  const openEdit = (user: SupplierUser | null) => {
    setEditingUser(user)
    if (user) {
      form.setFieldsValue({
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        data_scope_type: user.data_scope_type,
        data_scope_ids: user.data_scope_ids,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ data_scope_type: 'store', data_scope_ids: [] })
    }
    setEditModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      // 业务规则：仅超管可授予超管角色
      if (values.role === 'super_admin' && !isAdmin) {
        message.error('仅超管可授予超管角色')
        return
      }
      // 业务规则：仅超管可使用「全部数据」
      if (values.data_scope_type === 'all' && !isAdmin) {
        message.error('仅超管可授予「全部数据」权限')
        return
      }
      message.success(editingUser ? '修改成功' : '新增成功')
      setEditModalOpen(false)
      loadData()
    } catch (e) {
      // antd 校验失败
    }
  }

  // 删除
  const handleDelete = async (user: SupplierUser) => {
    if (user.role === 'super_admin') {
      message.error('超管不可删除')
      return
    }
    message.success('删除成功')
    loadData()
  }

  // 操作日志
  const openLog = (user: SupplierUser) => {
    setLogUserId(user.id)
    setLogUserName(user.name)
    setLogModalOpen(true)
  }

  // 授权委托书
  const openAuth = (user: SupplierUser) => {
    setAuthUserId(user.id)
    setAuthModalOpen(true)
  }

  // 表格列
  const columns = [
    {
      title: '姓名', dataIndex: 'name', key: 'name', width: 100,
      render: (name: string) => <Space><UserOutlined />{name}</Space>,
    },
    {
      title: '手机号', dataIndex: 'phone', key: 'phone', width: 140,
      render: (phone: string) => maskPhone(phone),
    },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 180, render: (e: string) => e || '-' },
    {
      title: '角色', dataIndex: 'role_name', key: 'role_name', width: 120,
      render: (roleName: string, record: SupplierUser) => (
        <Tag color={record.role_type === 'system' ? 'blue' : 'default'}>
          {roleName}
        </Tag>
      ),
    },
    {
      title: '数据权限', dataIndex: 'data_scope_type', key: 'data_scope_type', width: 200,
      render: (type: DataScopeType, record: SupplierUser) => {
        if (type === 'all') return <Tag color="green">全部数据</Tag>
        if (type === 'none') return <Tag>无</Tag>
        const map: any = { region: '区域', store: '门店', counter: '专柜' }
        return (
          <span>
            <Tag color="orange">{map[type]}</Tag>
            <span style={{ fontSize: 12, color: '#999' }}>{record.data_scope_ids?.length || 0} 个</span>
          </span>
        )
      },
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作', key: 'action', width: 280, fixed: 'right' as const,
      render: (_: any, record: SupplierUser) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => openAuth(record)}
          >
            授权委托书
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openLog(record)}
          >
            操作日志
          </Button>
          {isAdmin && (
            <>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => openEdit(record)}
                disabled={record.role === 'super_admin' && record.id !== '1'}
              >
                编辑
              </Button>
              <Popconfirm
                title="确定删除？"
                description="删除后不可恢复"
                onConfirm={() => handleDelete(record)}
              >
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={record.role === 'super_admin'}
                >
                  删除
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Statistic title="总用户数" value={users.length} prefix={<UserOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="超管" value={users.filter(u => u.role === 'super_admin').length} />
          </Col>
          <Col span={6}>
            <Statistic title="活跃" value={users.filter(u => u.status === 'active').length} valueStyle={{ color: '#3f8600' }} />
          </Col>
          <Col span={6}>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={loadData}>刷新</Button>
              {isAdmin && (
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openEdit(null)}>
                  添加用户
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        {!isAdmin && (
          <Alert
            type="warning"
            showIcon
            message="您当前为非超管角色，仅可查看用户列表，无法进行增删改操作"
            style={{ marginBottom: 16 }}
          />
        )}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          scroll={{ x: 1100 }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 编辑弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={editModalOpen}
        onOk={handleSubmit}
        onCancel={() => setEditModalOpen(false)}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="手机号"
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' },
                ]}
              >
                <Input placeholder="11 位手机号" maxLength={11} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="邮箱" name="email">
            <Input placeholder="可选" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
            extra="超管角色仅超管可分配"
          >
            <Select placeholder="请选择角色">
              {roles.map(r => {
                // 非超管隐藏超管角色
                if (r.code === 'super_admin' && !isAdmin) return null
                return <Option key={r.id} value={r.code}>{r.name}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="数据权限"
            name="data_scope_type"
            rules={[{ required: true, message: '请选择数据权限类型' }]}
          >
            <Select placeholder="请选择">
              <Option value="all" disabled={!isAdmin}>全部数据（仅超管）</Option>
              <Option value="region">区域</Option>
              <Option value="store">门店</Option>
              <Option value="counter">专柜</Option>
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.data_scope_type !== curr.data_scope_type}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('data_scope_type')
              if (!type || type === 'all') return null
              return (
                <Form.Item
                  label={`数据范围（${type === 'region' ? '区域' : type === 'store' ? '门店' : '专柜'} ID）`}
                  name="data_scope_ids"
                >
                  <Select mode="tags" placeholder="输入 ID 后回车">
                    <Option value="store_001">store_001 示例门店</Option>
                  </Select>
                </Form.Item>
              )
            }}
          </Form.Item>
        </Form>
      </Modal>

      {/* 操作日志弹窗 */}
      <OperationLogModal
        open={logModalOpen}
        userId={logUserId}
        userName={logUserName}
        onClose={() => setLogModalOpen(false)}
      />

      {/* 授权委托书弹窗 */}
      <AuthorizationLetterModal
        open={authModalOpen}
        userId={authUserId}
        userName={editingUser?.name || ''}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  )
}

export default UserManagement
