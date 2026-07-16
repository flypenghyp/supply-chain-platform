import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Drawer,
  Form,
  Input,
  Select,
  Descriptions,
  message,
  Popconfirm,
  Row,
  Col,
  DatePicker,
  Upload,
  Modal,
  Alert,
} from 'antd'
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter'
import { useNavigate, useLocation } from 'react-router-dom'
import { usePermission } from '@/contexts/PermissionContext'

const { RangePicker } = DatePicker
const { Option } = Select

// 证照类型
const licenseTypes = [
  { value: 'enterprise', label: '企业资质证照' },
  { value: 'product', label: '产品资质证照' },
  { value: 'circulation', label: '产品流通类证照' },
  { value: 'authorization', label: '授权委托证照' },
  { value: 'store', label: '门店商户租赁证照' },
]

// 证照状态
const licenseStatus = [
  { value: 'normal', label: '正常' },
  { value: 'expired', label: '已过期' },
  { value: 'warning', label: '即将过期' },
  { value: 'invalid', label: '无效' },
]

const LicenseManagement = () => {
  const [licenses, setLicenses] = useState<any[]>([])
  const [filteredLicenses, setFilteredLicenses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [addVisible, setAddVisible] = useState(false)
  const [selectedLicense, setSelectedLicense] = useState<any>(null)
  const [searchForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [addForm] = Form.useForm()
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [rejectingRecord, setRejectingRecord] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [filters, setFilters] = useState<any>({
    supplierCode: undefined,
    supplierName: undefined,
    type: undefined,
    status: undefined,
    approvalStatus: undefined,
  })
  
  const navigate = useNavigate()
  const { canEdit } = usePermission()
  const location = useLocation()

  // 从供应商管理页面传递过来的参数
  const { supplierId, supplierName, supplierCode } = location.state || {}

  // 模拟供应商数据
  useEffect(() => {
    fetchSuppliers()
  }, [])

  // 模拟证照数据
  useEffect(() => {
    fetchLicenses()
  }, [])

  // 当从供应商管理页面跳转过来时，自动过滤显示该供应商的证照
  useEffect(() => {
    if (supplierId) {
      setFilteredLicenses(licenses.filter(l => l.supplierId === supplierId))
    } else {
      setFilteredLicenses(licenses)
    }
  }, [supplierId, licenses])

  const fetchSuppliers = async () => {
    const mockSuppliers = [
      { id: '1', code: '302066', name: '宝洁（中国）有限公司' },
      { id: '2', code: '303300', name: '好利来食品有限公司' },
      { id: '3', code: '592000222', name: '厦门商贸集团有限公司' },
    ]
    setSuppliers(mockSuppliers)
  }

  const fetchLicenses = async () => {
    setLoading(true)
    const mockLicenses = [
      {
        id: '1',
        supplierId: '1',
        supplierName: '宝洁（中国）有限公司',
        supplierCode: '302066',
        type: 'enterprise',
        typeName: '企业资质证照',
        name: '营业执照',
        licenseNo: '91440101618420138P',
        issueDate: '2022-01-01',
        expiryDate: '2027-01-01',
        status: 'invalid',
        statusName: '无效',
        fileUrl: '',
        notes: '企业营业执照',
        submitDate: '2024-01-15',
        submitBy: '张经理',
        approvalStatus: 'approved',
        approvalStatusName: '已审核',
        isMaster: false,
        versionSequence: 1,
        renewedCertId: '7',
      },
      {
        id: '2',
        supplierId: '1',
        supplierName: '宝洁（中国）有限公司',
        supplierCode: '302066',
        type: 'product',
        typeName: '产品资质证照',
        name: '产品检测报告',
        licenseNo: 'PRO2024001',
        issueDate: '2024-01-10',
        expiryDate: '2025-01-10',
        status: 'normal',
        statusName: '正常',
        fileUrl: '',
        notes: '产品质量检测报告',
        submitDate: '2024-01-15',
        submitBy: '张经理',
        approvalStatus: 'approved',
        approvalStatusName: '已审核',
        isMaster: true,
        versionSequence: 1,
      },
      {
        id: '3',
        supplierId: '2',
        supplierName: '好利来食品有限公司',
        supplierCode: '303300',
        type: 'enterprise',
        typeName: '企业资质证照',
        name: '营业执照',
        licenseNo: '91310000987654321Y',
        issueDate: '2021-06-01',
        expiryDate: '2024-05-31',
        status: 'warning',
        statusName: '即将过期',
        fileUrl: '',
        notes: '企业营业执照',
        submitDate: '2024-01-10',
        submitBy: '李经理',
        approvalStatus: 'approved',
        approvalStatusName: '已审核',
        isMaster: true,
        versionSequence: 1,
      },
      {
        id: '4',
        supplierId: '3',
        supplierName: '厦门商贸集团有限公司',
        supplierCode: '592000222',
        type: 'authorization',
        typeName: '授权委托证照',
        name: '品牌授权书',
        licenseNo: 'AUTH2024001',
        issueDate: '2024-01-01',
        expiryDate: '2024-12-31',
        status: 'normal',
        statusName: '正常',
        fileUrl: '',
        notes: '品牌授权书',
        submitDate: '2024-01-05',
        submitBy: '王经理',
        approvalStatus: 'pending',
        approvalStatusName: '待审核',
        isMaster: true,
        versionSequence: 1,
        renewedCertId: '8',
      },
      {
        // 延期申请示例
        id: '5',
        supplierId: '1',
        supplierName: '宝洁（中国）有限公司',
        supplierCode: '302066',
        type: 'enterprise',
        typeName: '企业资质证照',
        name: '营业执照（延期）',
        licenseNo: '91440101618420138P',
        issueDate: '2027-01-01',
        expiryDate: '2032-01-01',
        status: 'normal',
        statusName: '正常',
        fileUrl: '',
        notes: '营业执照延期申请 - 原证照即将到期，申请延长有效期',
        submitDate: '2024-06-22',
        submitBy: '张经理',
        approvalStatus: 'pending',
        approvalStatusName: '待审核',
        operationType: 'renew',
        operationTypeLabel: '延期申请',
        sourceCertId: '1',
        isMaster: false,
        versionSequence: 2,
      },
      {
        id: '6',
        supplierId: '2',
        supplierName: '好利来食品有限公司',
        supplierCode: '303300',
        type: 'enterprise',
        typeName: '企业资质证照',
        name: '营业执照（已过期）',
        licenseNo: '91310000987654321Y',
        issueDate: '2021-06-01',
        expiryDate: '2024-05-31',
        status: 'expired',
        statusName: '已过期',
        fileUrl: '',
        notes: '企业营业执照已过期，尚未申请延期',
        submitDate: '2024-01-10',
        submitBy: '李经理',
        approvalStatus: 'approved',
        approvalStatusName: '已审核',
        operationType: 'add',
        operationTypeLabel: '新增',
        isMaster: true,
        versionSequence: 1,
      },
      {
        id: '7',
        supplierId: '1',
        supplierName: '宝洁（中国）有限公司',
        supplierCode: '302066',
        type: 'enterprise',
        typeName: '企业资质证照',
        name: '营业执照（延期通过）',
        licenseNo: '91440101618420138P',
        issueDate: '2027-01-01',
        expiryDate: '2032-01-01',
        status: 'normal',
        statusName: '正常',
        fileUrl: '',
        notes: '营业执照延期申请已通过，原证照失效',
        submitDate: '2024-06-22',
        submitBy: '张经理',
        approvalStatus: 'approved',
        approvalStatusName: '已审核',
        operationType: 'renew',
        operationTypeLabel: '延期申请',
        sourceCertId: '1',
        isMaster: true,
        versionSequence: 2,
      },
      {
        id: '8',
        supplierId: '3',
        supplierName: '厦门商贸集团有限公司',
        supplierCode: '592000222',
        type: 'authorization',
        typeName: '授权委托证照',
        name: '品牌授权书（延期驳回）',
        licenseNo: 'AUTH2024001',
        issueDate: '2024-01-01',
        expiryDate: '2029-12-31',
        status: 'normal',
        statusName: '正常',
        fileUrl: '',
        notes: '品牌授权书延期申请被驳回',
        submitDate: '2024-06-22',
        submitBy: '王经理',
        approvalStatus: 'rejected',
        approvalStatusName: '审核拒绝',
        operationType: 'renew',
        operationTypeLabel: '延期申请',
        sourceCertId: '4',
        isMaster: false,
        versionSequence: 2,
        rejectReason: '授权范围与原证照不一致，请重新提交',
        auditTime: '2024-06-23 10:00:00',
        auditor: '零售审核员',
      },
    ]
    setLicenses(mockLicenses)
    setLoading(false)
  }

  const handleViewDetail = (record: any) => {
    setSelectedLicense(record)
    setDetailVisible(true)
  }

  const handleEdit = (record: any) => {
    setSelectedLicense(record)
    editForm.setFieldsValue(record)
    setEditVisible(true)
  }

  const handleDelete = (record: any) => {
    setLicenses(licenses.filter(l => l.id !== record.id))
    message.success('证照已删除')
  }

  const handleAdd = () => {
    addForm.resetFields()
    // 当从供应商管理页面跳转过来时，自动填充供应商信息
    if (supplierId) {
      addForm.setFieldsValue({
        supplierId: supplierId
      })
    }
    setAddVisible(true)
  }

  const handleAddSubmit = async () => {
    try {
      const values = await addForm.validateFields()
      const newLicense = {
        id: Date.now().toString(),
        ...values,
        status: 'normal',
        statusName: '正常',
        submitDate: new Date().toISOString().split('T')[0],
        submitBy: '系统管理员',
        approvalStatus: 'pending',
        approvalStatusName: '待审核',
        typeName: licenseTypes.find(t => t.value === values.type)?.label || '',
      }
      setLicenses([...licenses, newLicense])
      message.success('证照添加成功')
      setAddVisible(false)
      addForm.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields()
      const updatedLicense = {
        ...selectedLicense,
        ...values,
        typeName: licenseTypes.find(t => t.value === values.type)?.label || '',
      }
      setLicenses(licenses.map(l => l.id === selectedLicense.id ? updatedLicense : l))
      message.success('证照更新成功')
      setEditVisible(false)
      editForm.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleApprove = (record: any) => {
    setLicenses(prev => {
      const next = prev.map(l => {
        if (l.id === record.id) {
          return {
            ...record,
            approvalStatus: 'approved',
            approvalStatusName: '已审核',
            status: 'normal',
            statusName: '正常',
            isMaster: true,
          }
        }
        // 延期申请通过后，将原证照标记为已归档且不再是主证照
        if (record.operationType === 'renew' && record.sourceCertId && l.id === record.sourceCertId) {
          return {
            ...l,
            status: 'invalid',
            statusName: '无效',
            isMaster: false,
            renewedCertId: record.id,
          }
        }
        return l
      })
      return next
    })
    message.success('证照已审核通过')
  }

  const handleRejectClick = (record: any) => {
    setRejectingRecord(record)
    setRejectReason('')
    setRejectModalVisible(true)
  }

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      message.error('请输入驳回原因')
      return
    }
    setLicenses(prev => prev.map(l => {
      if (l.id === rejectingRecord.id) {
        return {
          ...l,
          approvalStatus: 'rejected',
          approvalStatusName: '审核拒绝',
          rejectReason: rejectReason.trim(),
          auditTime: new Date().toISOString().split('T')[0],
          auditor: '当前审核人',
        }
      }
      return l
    }))
    setRejectModalVisible(false)
    message.success('证照审核已拒绝')
  }

  const handleSearch = () => {
    let filtered = [...licenses]

    if (filters.supplierCode) {
      filtered = filtered.filter(l => 
        l.supplierCode && l.supplierCode.toLowerCase().includes(filters.supplierCode.toLowerCase())
      )
    }

    if (filters.supplierName) {
      filtered = filtered.filter(l => 
        l.supplierName && l.supplierName.toLowerCase().includes(filters.supplierName.toLowerCase())
      )
    }

    if (filters.type) {
      filtered = filtered.filter(l => l.type === filters.type)
    }

    if (filters.status) {
      filtered = filtered.filter(l => l.status === filters.status)
    }

    if (filters.approvalStatus) {
      filtered = filtered.filter(l => l.approvalStatus === filters.approvalStatus)
    }

    setFilteredLicenses(filtered)
  }

  const handleReset = () => {
    setFilters({
      supplierCode: undefined,
      supplierName: undefined,
      type: undefined,
      status: undefined,
      approvalStatus: undefined,
    })
    setFilteredLicenses(licenses)
  }

  const columns = [
    { title: '供应商编码', dataIndex: 'supplierCode', key: 'supplierCode', width: 120 },
    { title: '供应商名称', dataIndex: 'supplierName', key: 'supplierName', width: 180 },
    { 
      title: '证照类型', 
      dataIndex: 'typeName', 
      key: 'typeName', 
      width: 120,
    },
    { title: '证照名称', dataIndex: 'name', key: 'name', width: 150 },
    {
      title: '操作类型',
      dataIndex: 'operationTypeLabel',
      key: 'operationType',
      width: 100,
      render: (text: string) => {
        if (!text) return <span style={{ color: '#999' }}>-</span>;
        const colorMap: Record<string, string> = {
          '延期申请': 'orange',
          '新增': 'blue',
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      }
    },
    {
      title: '延期状态',
      key: 'renewStatus',
      width: 110,
      render: (_: any, record: any) => {
        if (record.status === 'expired' && record.operationType !== 'renew') {
          return <Tag color="error">未延期</Tag>;
        }
        if (record.operationType === 'renew') {
          if (record.approvalStatus === 'pending') return <Tag color="processing">待审核</Tag>;
          if (record.approvalStatus === 'approved') return <Tag color="success">已延期</Tag>;
          if (record.approvalStatus === 'rejected') return <Tag color="warning">已驳回</Tag>;
        }
        return <span style={{ color: '#999' }}>--</span>;
      }
    },
    { title: '证照编号', dataIndex: 'licenseNo', key: 'licenseNo', width: 150 },
    { title: '发证日期', dataIndex: 'issueDate', key: 'issueDate', width: 120 },
    { title: '到期日期', dataIndex: 'expiryDate', key: 'expiryDate', width: 120 },
    { 
      title: '证照状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status: string) => {
        const statusConfig: Record<string, { color: string; text: string }> = {
          normal: { color: 'success', text: '正常' },
          expired: { color: 'error', text: '已过期' },
          warning: { color: 'warning', text: '即将过期' },
          invalid: { color: 'default', text: '无效' },
        }
        const config = statusConfig[status] || { color: 'default', text: status }
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    { 
      title: '审核状态', 
      dataIndex: 'approvalStatus', 
      key: 'approvalStatus', 
      width: 100,
      render: (status: string) => {
        const statusConfig: Record<string, { color: string; text: string }> = {
          pending: { color: 'processing', text: '待审核' },
          approved: { color: 'success', text: '已审核' },
          rejected: { color: 'error', text: '审核拒绝' },
        }
        const config = statusConfig[status] || { color: 'default', text: status }
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    { 
      title: '操作', 
      key: 'action', 
      width: 200,
      render: (_: unknown, record: any) => {
        const isApprovedRenew = record.operationType === 'renew' && record.approvalStatus === 'approved';
        const isRejectedRenew = record.operationType === 'renew' && record.approvalStatus === 'rejected';
        return (
          <Space size="small">
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
              查看
            </Button>
            {!isApprovedRenew && (
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                编辑
              </Button>
            )}
            {!isApprovedRenew && !isRejectedRenew && (
              <Popconfirm
                title="确定要删除此证照吗？"
                onConfirm={() => handleDelete(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
            )}
            {record.approvalStatus === 'pending' && (
              <Space size="small">
                <Button 
                  type="link" 
                  size="small" 
                  style={{ color: '#52c41a' }}
                  onClick={() => handleApprove(record)}
                >
                  审核通过
                </Button>
                <Button 
                  type="link" 
                  size="small" 
                  danger
                  onClick={() => handleRejectClick(record)}
                >
                  审核拒绝
                </Button>
              </Space>
            )}
          </Space>
        );
      },
    },
  ]

  return (
    <ProductAnnotation config={licenseManagementAnnotations}>
    <Card>
      <Alert
        message="证照管理功能说明"
        description={
          <div>
            <p><strong>功能说明：</strong></p>
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>管理供应商提交的各类证照，包括企业资质、产品资质、产品流通、授权委托和门店商户租赁证照</li>
              <li>查看证照详情、编辑证照信息、上传证照文件</li>
              <li>审核供应商提交的新证照</li>
              <li>监控证照过期状态，及时提醒</li>
            </ul>
          </div>
        }
        type="info"
        showIcon
        closable
        style={{ marginBottom: 16 }}
      />

      <AdvancedSearchFilter
        fields={[
          { key: 'supplierCode', label: '供应商编码', type: 'input', placeholder: '请输入编码' },
          { key: 'supplierName', label: '供应商名称', type: 'input', placeholder: '请输入名称' },
          { key: 'type', label: '证照类型', type: 'select', placeholder: '请选择' },
          { key: 'status', label: '证照状态', type: 'select', placeholder: '请选择',
            options: [{ label: '正常', value: 'normal' }, { label: '即将到期', value: 'expiring_soon' }, { label: '已过期', value: 'expired' }]
          },
          { key: 'approvalStatus', label: '审核状态', type: 'select', placeholder: '请选择',
            options: [{ label: '待审核', value: 'pending' }, { label: '已通过', value: 'approved' }, { label: '已驳回', value: 'rejected' }]
          },
          { key: 'operationType', label: '操作类型', type: 'select', placeholder: '请选择',
            options: [{ label: '延期申请', value: 'renew' }, { label: '新增', value: 'add' }]
          }
        ]}
        values={filters} onChange={(k,v)=>handleSearch()} onSearch={handleSearch} onReset={handleReset}
      />

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加证照
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredLicenses}
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 1200 }}
      />

      {/* 证照详情抽屉 */}
      <Drawer
        title="证照详情"
        placement="right"
        width={720}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
      >
        {selectedLicense && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="供应商编码">{selectedLicense.supplierCode}</Descriptions.Item>
            <Descriptions.Item label="供应商名称">{selectedLicense.supplierName}</Descriptions.Item>
            <Descriptions.Item label="证照类型">{selectedLicense.typeName}</Descriptions.Item>
            <Descriptions.Item label="证照名称">{selectedLicense.name}</Descriptions.Item>
            <Descriptions.Item label="证照编号">{selectedLicense.licenseNo}</Descriptions.Item>
            <Descriptions.Item label="发证日期">{selectedLicense.issueDate}</Descriptions.Item>
            <Descriptions.Item label="到期日期">{selectedLicense.expiryDate}</Descriptions.Item>
            <Descriptions.Item label="证照状态">
              <Tag color={
                selectedLicense.status === 'normal' ? 'success' :
                selectedLicense.status === 'expired' ? 'error' :
                selectedLicense.status === 'warning' ? 'warning' : 'default'
              }>
                {selectedLicense.statusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="是否主证照">
              <Tag color={selectedLicense.isMaster ? 'success' : 'default'}>
                {selectedLicense.isMaster ? '主证照' : '历史版本'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="版本序号">V{selectedLicense.versionSequence || 1}</Descriptions.Item>
            <Descriptions.Item label="关联原证照">
              {selectedLicense.sourceCertId
                ? (() => {
                    const parent = licenses.find((l: any) => l.id === selectedLicense.sourceCertId);
                    return parent
                      ? <Button type="link" size="small" onClick={() => { setSelectedLicense(parent); }}>{parent.name}</Button>
                      : selectedLicense.sourceCertId;
                  })()
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="后续延期证照">
              {selectedLicense.renewedCertId
                ? (() => {
                    const child = licenses.find((l: any) => l.id === selectedLicense.renewedCertId);
                    return child
                      ? <Button type="link" size="small" onClick={() => { setSelectedLicense(child); }}>{child.name}</Button>
                      : selectedLicense.renewedCertId;
                  })()
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="审核状态">
              <Tag color={
                selectedLicense.approvalStatus === 'approved' ? 'success' :
                selectedLicense.approvalStatus === 'rejected' ? 'error' : 'processing'
              }>
                {selectedLicense.approvalStatusName}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="驳回原因">{selectedLicense.rejectReason || '-'}</Descriptions.Item>
            <Descriptions.Item label="审核时间">{selectedLicense.auditTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="审核人">{selectedLicense.auditor || '-'}</Descriptions.Item>
            <Descriptions.Item label="提交日期">{selectedLicense.submitDate}</Descriptions.Item>
            <Descriptions.Item label="提交人">{selectedLicense.submitBy}</Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>{selectedLicense.notes || '-'}</Descriptions.Item>
            <Descriptions.Item label="证照文件" span={2}>
              {selectedLicense.fileUrl ? (
                <a href={selectedLicense.fileUrl} target="_blank" rel="noopener noreferrer">
                  查看文件
                </a>
              ) : (
                <span>无文件</span>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      <Modal
        title="驳回原因"
        visible={rejectModalVisible}
        onOk={handleRejectConfirm}
        onCancel={() => setRejectModalVisible(false)}
      >
        <Input.TextArea
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          placeholder="请输入驳回原因"
          rows={4}
        />
      </Modal>

      {/* 添加证照抽屉 */}
      <Drawer
        title="添加证照"
        placement="right"
        width={600}
        open={addVisible}
        onClose={() => {
          setAddVisible(false)
          addForm.resetFields()
        }}
        extra={
          <Space>
            <Button onClick={() => {
              setAddVisible(false)
              addForm.resetFields()
            }}>取消</Button>
            <Button type="primary" onClick={handleAddSubmit}>添加</Button>
          </Space>
        }
      >
        <Form
          form={addForm}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="供应商"
            name="supplierId"
            rules={[{ required: true, message: '请选择供应商' }]}
          >
            <Select placeholder="请选择供应商">
              {suppliers.map(supplier => (
                <Option key={supplier.id} value={supplier.id}>
                  {supplier.code} - {supplier.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="证照类型"
            name="type"
            rules={[{ required: true, message: '请选择证照类型' }]}
          >
            <Select placeholder="请选择证照类型">
              {licenseTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="证照名称"
            name="name"
            rules={[{ required: true, message: '请输入证照名称' }]}
          >
            <Input placeholder="请输入证照名称" />
          </Form.Item>

          <Form.Item
            label="证照编号"
            name="licenseNo"
            rules={[{ required: true, message: '请输入证照编号' }]}
          >
            <Input placeholder="请输入证照编号" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="发证日期"
                name="issueDate"
                rules={[{ required: true, message: '请选择发证日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="到期日期"
                name="expiryDate"
                rules={[{ required: true, message: '请选择到期日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="备注"
            name="notes"
          >
            <Input.TextArea placeholder="请输入备注信息" rows={3} />
          </Form.Item>

          <Form.Item
            label="上传证照文件"
            name="fileUrl"
          >
            <Upload>
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Drawer>

      {/* 编辑证照抽屉 */}
      <Drawer
        title="编辑证照"
        placement="right"
        width={600}
        open={editVisible}
        onClose={() => {
          setEditVisible(false)
          editForm.resetFields()
        }}
        extra={
          <Space>
            <Button onClick={() => {
              setEditVisible(false)
              editForm.resetFields()
            }}>取消</Button>
            <Button type="primary" onClick={handleEditSubmit}>保存</Button>
          </Space>
        }
      >
        <Form
          form={editForm}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="供应商"
            name="supplierId"
            rules={[{ required: true, message: '请选择供应商' }]}
          >
            <Select placeholder="请选择供应商">
              {suppliers.map(supplier => (
                <Option key={supplier.id} value={supplier.id}>
                  {supplier.code} - {supplier.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="证照类型"
            name="type"
            rules={[{ required: true, message: '请选择证照类型' }]}
          >
            <Select placeholder="请选择证照类型">
              {licenseTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="证照名称"
            name="name"
            rules={[{ required: true, message: '请输入证照名称' }]}
          >
            <Input placeholder="请输入证照名称" />
          </Form.Item>

          <Form.Item
            label="证照编号"
            name="licenseNo"
            rules={[{ required: true, message: '请输入证照编号' }]}
          >
            <Input placeholder="请输入证照编号" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="发证日期"
                name="issueDate"
                rules={[{ required: true, message: '请选择发证日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="到期日期"
                name="expiryDate"
                rules={[{ required: true, message: '请选择到期日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="备注"
            name="notes"
          >
            <Input.TextArea placeholder="请输入备注信息" rows={3} />
          </Form.Item>

          <Form.Item
            label="上传证照文件"
            name="fileUrl"
          >
            <Upload>
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Drawer>
    </Card>
  )
}

export default LicenseManagement