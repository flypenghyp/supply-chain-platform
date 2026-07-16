import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Drawer,
  Form,
  Input,
  Select,
  Upload,
  message,
  Popconfirm,
  Row,
  Col,
  DatePicker,
  Empty,
  Divider,
  Switch,
  Timeline,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter'
import ProductAnnotation from '../components/ProductAnnotation'
import { announcementManagementAnnotations } from './annotations/announcement-management'
import {
  SendOutlined,
  FileTextOutlined,
  SearchOutlined,
  UploadOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { usePermission } from '@/contexts/PermissionContext'

interface Announcement {
  id: string
  title: string
  type: 'notice' | 'announcement'
  content: string
  target_type?: 'all' | 'category' | 'region' | 'specific'
  target_suppliers?: string[]
  target_categories?: string[]
  target_regions?: string[]
  is_important: boolean
  is_published: boolean
  expired_at: string
  created_at: string
  updated_at: string
  created_by: string
  attachments?: string[]
  is_terminated?: boolean
}

interface AnnouncementFormData {
  title: string
  type: 'notice' | 'announcement'
  content: string
  target_type: 'all' | 'category' | 'region' | 'specific'
  target_suppliers?: string[]
  target_categories?: string[]
  target_regions?: string[]
  is_important: boolean
  is_published: boolean
  expired_at: string
}

const AnnouncementManagement = () => {
  const navigate = useNavigate()
  const { getManagedCategories } = usePermission()
  const categories = getManagedCategories()

  const regions = [
    { label: '全国', value: '全国' },
    { label: '华北地区', value: '华北地区' },
    { label: '华东地区', value: '华东地区' },
    { label: '华南地区', value: '华南地区' },
    { label: '华中地区', value: '华中地区' },
  ]

  const suppliers = [
    { label: '宝洁（中国）有限公司', value: '1', code: '302066' },
    { label: '好利来食品有限公司', value: '2', code: '303300' },
    { label: '厦门商贸集团有限公司', value: '3', code: '592000222' },
  ]

  const mockAnnouncements: Announcement[] = [
    {
      id: '1',
      title: '2024年春节放假通知',
      type: 'notice',
      content: '春节放假时间为2024年2月9日至2月17日，共9天。请各供应商提前做好备货安排。',
      target_type: 'all',
      is_important: true,
      is_published: true,
      expired_at: '2024-02-20',
      created_at: '2024-01-20',
      updated_at: '2024-01-20',
      created_by: 'admin',
    },
    {
      id: '2',
      title: '新供应商入驻流程调整公告',
      type: 'announcement',
      content: '自2024年2月1日起，新供应商入驻需提供完整的资质证明文件，包括营业执照、食品经营许可证等。',
      target_type: 'category',
      target_categories: ['CAT001'],
      is_important: false,
      is_published: true,
      expired_at: '2024-02-18',
      created_at: '2024-01-18',
      updated_at: '2024-01-18',
      created_by: 'admin',
    },
    {
      id: '3',
      title: '1月份结算时间安排',
      type: 'notice',
      content: '1月份对账结算时间为2024年2月5日至2月8日，请各供应商按时提交对账单据。',
      target_type: 'all',
      is_important: true,
      is_published: true,
      expired_at: '2024-02-15',
      created_at: '2024-01-15',
      updated_at: '2024-01-15',
      created_by: 'admin',
    },
  ]

  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create')
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null)
  const [targetType, setTargetType] = useState<'all' | 'category' | 'region' | 'specific'>('all')
  const [form] = Form.useForm()
  const [logVisible, setLogVisible] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [filters, setFilters] = useState({
    title: '',
    type: '',
    is_important: '',
    is_published: '',
    target_type: '',
  })

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'notice' ? 'blue' : 'green'}>
          {type === 'notice' ? '通知' : '公告'}
        </Tag>
      ),
    },
    {
      title: '重要程度',
      dataIndex: 'is_important',
      key: 'is_important',
      width: 100,
      render: (important: boolean) => (
        <Tag color={important ? 'red' : 'default'}>
          {important ? '重要' : '普通'}
        </Tag>
      ),
    },
    {
      title: '发布状态',
      dataIndex: 'is_published',
      key: 'is_published',
      width: 120,
      render: (published: boolean, record: Announcement) => (
        <Space>
          <Tag color={published ? 'success' : 'default'}>
            {published ? '已发布' : '草稿'}
          </Tag>
          {record.is_terminated && (
            <Tag color="error">已终止</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '截至时间',
      dataIndex: 'expired_at',
      key: 'expired_at',
      width: 150,
    },
    {
      title: '发布对象',
      dataIndex: 'target_type',
      key: 'target_type',
      width: 150,
      render: (type: string, record: Announcement) => {
        if (type === 'all') return '全部供应商'
        if (type === 'category') return `品类：${record.target_categories?.join(', ') || '-'}`
        if (type === 'region') return `区域：${record.target_regions?.join(', ') || '-'}`
        if (type === 'specific') return `指定：${record.target_suppliers?.length || 0}家供应商`
        return type
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_: unknown, record: Announcement) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Space size={0}>
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
              查看
            </Button>
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type="link" size="small" icon={<SendOutlined />} onClick={() => handlePublish(record)} disabled={record.is_published}>
              发布
            </Button>
          </Space>
          <Space size={0}>
            {record.is_published && !record.is_terminated && (
              <Button type="link" size="small" danger onClick={() => handleTerminate(record)}>
                终止
              </Button>
            )}
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleViewLogs(record)}>
              查看日志
            </Button>
            <Popconfirm
              title="确定要删除此公告吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ]

  const handleCreate = () => {
    const defaultExpiredDate = dayjs().add(1, 'month')
    
    setModalType('create')
    setCurrentAnnouncement(null)
    setTargetType('all')
    form.resetFields()
    form.setFieldsValue({
      target_type: 'all',
      expired_at: defaultExpiredDate
    })
    setModalVisible(true)
  }

  const handleEdit = (record: Announcement) => {
    setModalType('edit')
    setCurrentAnnouncement(record)
    form.setFieldsValue({
      title: record.title,
      type: record.type,
      content: record.content,
      target_type: record.target_type,
      target_suppliers: record.target_suppliers,
      target_categories: record.target_categories,
      target_regions: record.target_regions,
      is_important: record.is_important,
      is_published: record.is_published,
      expired_at: record.expired_at ? dayjs(record.expired_at) : null,
    })
    setTargetType(record.target_type || 'all')
    setModalVisible(true)
  }

  const handleView = (record: Announcement) => {
    setModalType('view')
    setCurrentAnnouncement(record)
    setTargetType(record.target_type || 'all')
    form.setFieldsValue({
      title: record.title,
      type: record.type,
      content: record.content,
      target_type: record.target_type,
      target_suppliers: record.target_suppliers,
      target_categories: record.target_categories,
      target_regions: record.target_regions,
      is_important: record.is_important,
      is_published: record.is_published,
      expired_at: record.expired_at ? dayjs(record.expired_at) : null,
    })
    setModalVisible(true)
  }

  const handlePublish = (record: Announcement) => {
    Modal.confirm({
      title: '发布确认',
      content: '确定要发布此公告吗？',
      onOk: async () => {
        const updatedAnnouncement = {
          ...record,
          is_published: true,
          updated_at: new Date().toISOString(),
        }
        setAnnouncements(announcements.map(a => a.id === record.id ? updatedAnnouncement : a))
        message.success('公告已发布')
      },
    })
  }

  const handleTerminate = (record: Announcement) => {
    Modal.confirm({
      title: '终止公告',
      content: '确定要终止此公告吗？',
      onOk: async () => {
        const updatedAnnouncement = {
          ...record,
          is_terminated: true,
          updated_at: new Date().toISOString(),
        }
        setAnnouncements(announcements.map(a => a.id === record.id ? updatedAnnouncement : a))
        message.success('公告已终止')
      },
    })
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '删除确认',
      content: '确定要删除此公告吗？',
      onOk: () => {
        setAnnouncements(announcements.filter(a => a.id !== id))
        message.success('公告已删除')
      },
    })
  }

  const handleViewLogs = (record: Announcement) => {
    setSelectedAnnouncement(record)
    setLogVisible(true)
  }

  const handleSearch = () => {
    let filtered = [...announcements]

    if (filters.title) {
      filtered = filtered.filter(item => item.title.includes(filters.title))
    }

    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type)
    }

    if (filters.is_important !== '') {
      const isImportant = filters.is_important === 'true'
      filtered = filtered.filter(item => item.is_important === isImportant)
    }

    if (filters.is_published !== '') {
      const isPublished = filters.is_published === 'true'
      filtered = filtered.filter(item => item.is_published === isPublished)
    }

    if (filters.target_type) {
      filtered = filtered.filter(item => item.target_type === filters.target_type)
    }

    setFilteredAnnouncements(filtered)
    message.success('查询成功')
  }

  const handleReset = () => {
    setFilters({
      title: '',
      type: '',
      is_important: '',
      is_published: '',
      target_type: '',
    })
    setFilteredAnnouncements(announcements)
    message.success('已重置查询条件')
  }

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (modalType === 'create') {
        const newAnnouncement: Announcement = {
          id: Date.now().toString(),
          title: values.title,
          type: values.type,
          content: values.content,
          target_type: values.target_type,
          target_suppliers: values.target_suppliers,
          target_categories: values.target_categories,
          target_regions: values.target_regions,
          is_important: values.is_important,
          is_published: true,
          expired_at: values.expired_at ? values.expired_at.format('YYYY-MM-DD') : '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: 'admin',
        }
        setAnnouncements([...announcements, newAnnouncement])
        message.success('公告发布成功')
      } else if (modalType === 'edit') {
        const updatedAnnouncement = {
          ...currentAnnouncement!,
          title: values.title,
          type: values.type,
          content: values.content,
          target_type: values.target_type,
          target_suppliers: values.target_suppliers,
          target_categories: values.target_categories,
          target_regions: values.target_regions,
          is_important: values.is_important,
          expired_at: values.expired_at ? values.expired_at.format('YYYY-MM-DD') : '',
          updated_at: new Date().toISOString(),
        }
        setAnnouncements(announcements.map(a => a.id === currentAnnouncement!.id ? updatedAnnouncement : a))
        message.success('公告更新成功')
      }
      
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleModalCancel = () => {
    setModalVisible(false)
    form.resetFields()
    setCurrentAnnouncement(null)
  }

  const mockViewLogs = [
    {
      time: '2024-01-15 14:30:25',
      supplier: '宝洁（中国）有限公司',
      code: '302066',
      user: '张经理',
      phone: '13900139001',
      action: '查看公告',
    },
    {
      time: '2024-01-15 10:20:10',
      supplier: '好利来食品有限公司',
      code: '303300',
      user: '李经理',
      phone: '13900139002',
      action: '查看公告',
    },
    {
      time: '2024-01-14 16:45:30',
      supplier: '厦门商贸集团有限公司',
      code: '592000222',
      user: '王经理',
      phone: '13900139003',
      action: '查看公告',
    },
    {
      time: '2024-01-14 09:15:00',
      supplier: '宝洁（中国）有限公司',
      code: '302066',
      user: '张经理',
      phone: '13900139001',
      action: '确认已读',
    },
  ]

  return (
    <ProductAnnotation config={announcementManagementAnnotations}>
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <h2>公告管理</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建公告
          </Button>
        </Space>
      </div>

      <AdvancedSearchFilter
        fields={[
          { key: 'title', label: '标题', type: 'input', placeholder: '请输入标题' },
          { key: 'type', label: '类型', type: 'select', placeholder: '请选择',
            options: [{ label: '通知', value: 'notice' }, { label: '公告', value: 'announcement' }]
          },
          { key: 'is_important', label: '重要程度', type: 'select', placeholder: '请选择',
            options: [{ label: '普通', value: false }, { label: '重要', value: true }]
          },
          { key: 'is_published', label: '发布状态', type: 'select', placeholder: '请选择',
            options: [{ label: '草稿', value: false }, { label: '已发布', value: true }]
          },
          { key: 'target_type', label: '发布对象', type: 'select', placeholder: '请选择',
            options: [{ label: '全部', value: 'all' }, { label: '按品类', value: 'category' }, { label: '按区域', value: 'region' }, { label: '指定', value: 'specific' }]
          }
        ]}
        values={filters} onChange={(k,v)=>setFilters({...filters,[k]:v})} onSearch={handleSearch} onReset={handleReset}
        extraActions={<Button type="primary" onClick={handleCreate}>创建公告</Button>}
      />

      <Table
        data-annotation-id="announcement-table"
        rowKey="id"
        columns={columns}
        dataSource={filteredAnnouncements}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Drawer
        title={modalType === 'create' ? '创建公告' : modalType === 'edit' ? '编辑公告' : '查看公告'}
        placement="right"
        open={modalVisible}
        onClose={handleModalCancel}
        width={800}
        extra={modalType !== 'view' && (
          <Space>
            <Button onClick={handleModalCancel}>取消</Button>
            <Button type="primary" onClick={handleModalSubmit}>发布</Button>
          </Space>
        )}
      >
        <Form
          form={form}
          layout="vertical"
          disabled={modalType === 'view'}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
            disabled={modalType === 'view'}
          >
            <Input placeholder="请输入公告标题" />
          </Form.Item>

          <Form.Item
            label="类型"
            name="type"
            rules={[{ required: true, message: '请选择类型' }]}
            disabled={modalType === 'view'}
          >
            <Select placeholder="请选择类型">
              <Select.Option value="notice">通知</Select.Option>
              <Select.Option value="announcement">公告</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="重要程度"
            name="is_important"
            valuePropName="checked"
            disabled={modalType === 'view'}
          >
            <Switch checkedChildren="重要" unCheckedChildren="普通" />
          </Form.Item>

          <Form.Item
            label="发布对象"
            name="target_type"
            rules={[{ required: true, message: '请选择发布对象' }]}
            disabled={modalType === 'view'}
          >
            <Select 
              placeholder="请选择发布对象" 
              onChange={(value: any) => {
                setTargetType(value)
                form.setFieldsValue({ target_suppliers: undefined, target_categories: undefined, target_regions: undefined })
              }}
            >
              <Select.Option value="all">全部供应商</Select.Option>
              <Select.Option value="category">按品类</Select.Option>
              <Select.Option value="region">按区域</Select.Option>
              <Select.Option value="specific">指定供应商</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="指定供应商"
            name="target_suppliers"
            hidden={targetType !== 'specific'}
            rules={[{ required: true, message: '请选择供应商' }]}
            disabled={modalType === 'view'}
          >
            <Select
              mode="multiple"
              placeholder="请选择供应商（支持代码搜索）"
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) => {
                if (!option) return false;
                const label = option.label as string;
                const code = (option as any).code || '';
                return label.toLowerCase().includes(input.toLowerCase()) || code.includes(input);
              }}
              options={suppliers.map(s => ({
                ...s,
                label: `${s.label} (${s.code})`
              }))}
            />
          </Form.Item>

          <Form.Item
            label="指定品类"
            name="target_categories"
            hidden={targetType !== 'category'}
            rules={[{ required: true, message: '请选择品类' }]}
            disabled={modalType === 'view'}
          >
            <Select
              mode="multiple"
              placeholder="请选择品类"
              options={categories.map(c => ({ label: c.categoryName, value: c.categoryId }))}
            />
          </Form.Item>

          <Form.Item
            label="指定区域"
            name="target_regions"
            hidden={targetType !== 'region'}
            rules={[{ required: true, message: '请选择区域' }]}
            disabled={modalType === 'view'}
          >
            <Select
              mode="multiple"
              placeholder="请选择区域"
              options={regions.map(r => ({ label: r.label, value: r.value }))}
            />
          </Form.Item>

          <Form.Item
            label="截至时间"
            name="expired_at"
            rules={[{ required: true, message: '请选择截至时间' }]}
            disabled={modalType === 'view'}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="请选择截至时间" />
          </Form.Item>

          <Form.Item
            label="公告内容"
            name="content"
            rules={[{ required: true, message: '请输入公告内容' }]}
            disabled={modalType === 'view'}
          >
            <Input.TextArea
              placeholder="请输入公告内容"
              rows={6}
            />
          </Form.Item>

          <Form.Item
            label="附件"
            name="attachments"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e
              }
              return e?.fileList
            }}
            disabled={modalType === 'view'}
          >
            <Upload
              listType="picture"
              maxCount={5}
              beforeUpload={() => {
                return new Promise((resolve) => {
                  setTimeout(() => resolve(true), 0)
                })
              }}
            >
              <Button icon={<UploadOutlined />}>上传附件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title={
          <span>
            <FileTextOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            查看日志 - {selectedAnnouncement?.title}
          </span>
        }
        placement="right"
        width={720}
        onClose={() => setLogVisible(false)}
        open={logVisible}
      >
        <Timeline
          items={mockViewLogs.map(log => ({
            color: log.action === '确认已读' ? 'green' : 'blue',
            children: (
              <div>
                <div style={{ fontWeight: 'bold' }}>{log.time}</div>
                <div>供应商：{log.supplier} ({log.code})</div>
                <div>用户：{log.user} ({log.phone})</div>
                <div>操作：{log.action}</div>
              </div>
            ),
          }))}
        />
      </Drawer>
    </Card>
    </ProductAnnotation>
  )
}

export default AnnouncementManagement