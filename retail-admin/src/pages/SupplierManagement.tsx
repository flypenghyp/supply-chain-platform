import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Drawer,
  Input,
  Select,
  Descriptions,
  message,
  Modal,
  Row,
  Col,
  Alert,
  Tabs,
  Typography,
  Upload,
  Progress,
  Steps,
  Statistic,
  Badge,
  Empty,
  Form,
} from 'antd'
import dayjs from 'dayjs'
import ChangeSuperAdminModal from './components/ChangeSuperAdminModal'
import PhoneDisplay from '../components/PhoneDisplay'
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter'

const { Text, Paragraph } = Typography
const { Dragger } = Upload
const { Title } = Typography

interface OperationLog {
  id: string
  supplier_code: string
  supplier_name: string
  operator_id: string
  operator_name: string
  operator_role: string
  operation_type: string
  operation_type_label: string
  operation_content: string
  target_user_id?: string
  target_user_name?: string
  target_user_phone?: string
  change_detail?: {
    field: string
    old_value?: string
    new_value?: string
  }
  extra?: {
    success_count?: number
    failed_count?: number
  }
  operation_time: string
  ip_address?: string
  result: 'success' | 'failed'
  related_batch_id?: string
}

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [configVisible, setConfigVisible] = useState(false)
  const [userManageVisible, setUserManageVisible] = useState(false)
  const [userDetailVisible, setUserDetailVisible] = useState(false)
  const [changeAdminVisible, setChangeAdminVisible] = useState(false)
  const [selectedAdminForChange, setSelectedAdminForChange] = useState<any>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userEsignAuthVisible, setUserEsignAuthVisible] = useState(false)
  const [userEsignAuthRejecting, setUserEsignAuthRejecting] = useState(false)
  const [userEsignAuthForm] = Form.useForm()
  const [configForm, setConfigForm] = useState({
    phone: '',
  })
  const [activeTab, setActiveTab] = useState('users')
  const [filters, setFilters] = useState({
    supplierKeyword: '',
    creditCode: '',
    supplierType: '',
    businessCategory: '',
    managementStyle: '',
    categoryType: '',
  })

  const [batchImportVisible, setBatchImportVisible] = useState(false)
  const [importFileList, setImportFileList] = useState<any[]>([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<{
    success: number
    failed: number
    errors: Array<{ row: number; supplier_code: string; reason: string }>
  } | null>(null)

  const [operationLogs, setOperationLogs] = useState<OperationLog[]>([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [logFilter, setLogFilter] = useState({
    type: '',
  })

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    setLoading(true)
    const mockSuppliers = [
      {
        id: '1',
        code: '302066',
        name: '宝洁（中国）有限公司',
        auth_status: '已认证',
        supplier_type: '公司',
        credit_code: '91440101618420138P',
        business_category_code: 'CAT001',
        business_category_name: '日化用品',
        tax_rate: '13%',
        management_style: '直营',
        category_type: '自采',
        supplier_type_detail: '超市自营供应商',
        login_status: 'normal',
        has_config_person: true,
        config_person_phone: '13900139001',
        config_person_role: 'admin',
        config_by_supplier: true,
        persons: [
          {
            id: '1',
            name: '张经理',
            phone: '13900139001',
            role: 'admin',
            role_names: ['超管', '财务'],
            role_type: 'system',
            status: 'active',
            permissions: {
              business: ['订单管理', '发货管理', '商品管理', '销售数据', '库存查询', '竞价管理', '价格管理', '质量管理'],
              finance: ['财务对账', '对账申请', '发票管理', '交款管理', '费用单管理', '供应链金融'],
              enterprise: ['企业信息管理', '供应商资质证照', '员工管理'],
              cooperation: ['合同管理'],
              system: ['公告通知', '服务中心']
            },
            data_scope: {
              type: 'all',
              label: '全部门店',
              detail: ['华南区-全部门店', '华东区-全部门店']
            },
            created_by: 'supplier',
            platform: 'pc',
            created_at: '2024-01-15 10:30:00',
            bind_status: '绑定',
            bind_time: '2024-01-15 10:30:00',
            last_login_time: '2024-01-20 14:30:00',
            login_records: [
              { time: '2024-01-20 14:30:25', ip: '192.168.1.100', method: 'PC端登录', result: '成功' },
              { time: '2024-01-19 16:20:10', ip: '192.168.1.105', method: 'PC端登录', result: '成功' },
              { time: '2024-01-18 09:15:30', ip: '10.10.1.23', method: 'APP端登录', result: '成功' },
            ],
            esign_auth: {
              status: 'pending',
              submit_time: '2024-07-01 10:00:00',
              file_url: '/mock/esign-auth/zhangjingli-20240701.pdf',
              auth_no: '',
              expire_time: '',
              reject_reason: '',
              reviewer: '',
              review_time: '',
            }
          },
          {
            id: '3',
            name: '李助理',
            phone: '13800138005',
            role: 'operator',
            role_names: ['操作员'],
            role_type: 'custom',
            status: 'active',
            permissions: {
              business: ['订单管理', '发货管理', '销售数据'],
              finance: ['财务对账', '发票管理'],
              enterprise: [],
              cooperation: [],
              system: ['公告通知']
            },
            data_scope: {
              type: 'store',
              label: '特定门店',
              detail: ['华南区-广州门店']
            },
            created_by: 'supplier',
            platform: 'pc',
            created_at: '2024-02-20 11:20:00',
            bind_status: '绑定',
            bind_time: '2024-02-20 11:20:00',
            last_login_time: '2024-03-18 10:15:00',
            login_records: [],
            esign_auth: {
              status: 'approved',
              submit_time: '2024-06-28 14:30:00',
              file_url: '/mock/esign-auth/lizhuli-20240628.pdf',
              auth_no: 'AUTH20240628001',
              expire_time: '2025-06-27 23:59:59',
              reject_reason: '',
              reviewer: '零售审核员',
              review_time: '2024-06-29 09:15:00',
            }
          }
        ],
      },
      {
        id: '2',
        code: '303300',
        name: '好利来食品有限公司',
        auth_status: '已认证',
        supplier_type: '公司',
        credit_code: '91310000987654321Y',
        business_category_code: 'CAT002',
        business_category_name: '零食类',
        tax_rate: '13%',
        management_style: '联营',
        category_type: '自采',
        supplier_type_detail: '超市自营供应商',
        login_status: 'abnormal',
        has_config_person: false,
        config_person_phone: '',
        config_person_role: '',
        config_by_supplier: false,
        persons: [],
      },
      {
        id: '3',
        code: '592000222',
        name: '厦门商贸集团有限公司',
        auth_status: '认证中',
        supplier_type: '公司',
        credit_code: '91350200135792468B',
        business_category_code: 'CAT003',
        business_category_name: '综合类',
        tax_rate: '13%',
        management_style: '直营',
        category_type: '代销',
        supplier_type_detail: '专柜供应商',
        login_status: 'temporary_open',
        has_config_person: true,
        config_person_phone: '13900139003',
        config_person_role: 'admin',
        config_by_supplier: false,
        persons: [
          {
            id: '2',
            name: '王经理',
            phone: '13900139003',
            role: 'admin',
            role_names: ['超管'],
            role_type: 'system',
            status: 'active',
            permissions: {
              business: ['订单管理', '发货管理', '商品管理', '销售数据', '库存查询'],
              finance: ['财务对账', '对账申请', '发票管理', '费用单管理'],
              enterprise: ['企业信息管理', '供应商资质证照', '员工管理'],
              cooperation: ['合同管理'],
              system: ['公告通知', '服务中心']
            },
            data_scope: {
              type: 'region',
              label: '特定区域',
              detail: ['华东区-全部门店']
            },
            created_by: 'retailer',
            created_at: '2024-03-10 09:15:00',
            bind_status: '绑定',
            bind_time: '2024-03-10 09:15:00',
            last_login_time: '2024-03-15 16:20:00',
            login_records: [
              { time: '2024-03-15 16:20:25', ip: '192.168.2.10', method: 'PC端登录', result: '成功' },
              { time: '2024-03-14 11:30:00', ip: '192.168.2.15', method: 'APP端登录', result: '成功' },
            ],
            esign_auth: {
              status: 'rejected',
              submit_time: '2024-06-25 11:20:00',
              file_url: '/mock/esign-auth/wangjingli-20240625.pdf',
              auth_no: '',
              expire_time: '',
              reject_reason: '授权书盖章不清晰，请重新上传',
              reviewer: '零售审核员',
              review_time: '2024-06-26 10:00:00',
            }
          }
        ],
      },
    ]
    setSuppliers(mockSuppliers)
    setLoading(false)
  }

  const generateMockOperationLogs = (supplierCode: string): OperationLog[] => {
    return [
      {
        id: 'log_001',
        supplier_code: supplierCode,
        supplier_name: selectedSupplier?.name || '',
        operator_id: 'op_001',
        operator_name: '张系统管理员',
        operator_role: '系统管理员',
        operation_type: 'change_phone',
        operation_type_label: '修改超管手机号',
        operation_content: '',
        target_user_id: 'user_001',
        target_user_name: '张经理',
        target_user_phone: '139****9001',
        change_detail: {
          field: 'phone',
          old_value: '139****9001',
          new_value: '138****8000',
        },
        operation_time: '2024-01-20T15:30:25',
        ip_address: '192.168.1.100',
        result: 'success',
      },
      {
        id: 'log_002',
        supplier_code: supplierCode,
        supplier_name: selectedSupplier?.name || '',
        operator_id: 'op_001',
        operator_name: '张系统管理员',
        operator_role: '系统管理员',
        operation_type: 'config_admin',
        operation_type_label: '配置管理员',
        operation_content: '',
        target_user_id: 'user_001',
        target_user_name: '张经理',
        target_user_phone: '139****9001',
        operation_time: '2024-01-19T14:22:18',
        ip_address: '192.168.1.100',
        result: 'success',
      },
      {
        id: 'log_003',
        supplier_code: supplierCode,
        supplier_name: selectedSupplier?.name || '',
        operator_id: 'op_002',
        operator_name: '李运营专员',
        operator_role: '运营专员',
        operation_type: 'batch_import',
        operation_type_label: '批量导入超管',
        operation_content: '',
        extra: { success_count: 45, failed_count: 2 },
        related_batch_id: 'batch_20240118_001',
        operation_time: '2024-01-18T09:05:33',
        ip_address: '192.168.1.105',
        result: 'success',
      },
    ]
  }

  const recordOperationLog = (logData: Partial<OperationLog>) => {
    const newLog: OperationLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      supplier_code: selectedSupplier?.code || '',
      supplier_name: selectedSupplier?.name || '',
      operator_id: 'current_user_001',
      operator_name: '当前操作员',
      operator_role: '系统管理员',
      operation_time: new Date().toISOString(),
      ip_address: '-',
      result: 'success',
      ...logData,
    }

    setOperationLogs(prev => [newLog, ...prev])
  }

  const loadOperationLogs = (supplierCode: string) => {
    setLogsLoading(true)

    setTimeout(() => {
      const logs = generateMockOperationLogs(supplierCode)
      setOperationLogs(logs)
      setLogsLoading(false)
    }, 500)
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handleSearch = () => {
    setLoading(true)
    setTimeout(() => {
      const filtered = suppliers.filter((supplier: any) => {
        if (filters.supplierKeyword) {
          const kw = filters.supplierKeyword
          const matchCode = supplier.code && supplier.code.includes(kw)
          const matchName = supplier.name && supplier.name.includes(kw)
          if (!matchCode && !matchName) return false
        }
        if (filters.creditCode && supplier.credit_code && !supplier.credit_code.includes(filters.creditCode)) return false
        if (filters.supplierType && supplier.supplier_type) {
          const typeMap: Record<string, string> = { company: '公司', personal: '个人' }
          if (supplier.supplier_type !== typeMap[filters.supplierType]) return false
        }
        if (filters.businessCategory && supplier.business_category_name && !supplier.business_category_name.includes(filters.businessCategory)) return false
        if (filters.managementStyle && supplier.management_style && !supplier.management_style.includes(filters.managementStyle)) return false
        if (filters.categoryType && supplier.category_type && !supplier.category_type.includes(filters.categoryType)) return false
        return true
      })
      setSuppliers(filtered)
      setLoading(false)
    }, 300)
  }

  const handleReset = () => {
    setFilters({
      supplierKeyword: '',
      creditCode: '',
      supplierType: '',
      businessCategory: '',
      managementStyle: '',
      categoryType: '',
    })
    fetchSuppliers()
  }



  const handleTemporaryClose = (record: any) => {
    Modal.confirm({
      title: '关闭登录确认',
      content: `确定要关闭供应商"${record.name}"的登录权限吗？`,
      onOk: () => {
        const updatedSupplier = {
          ...record,
          login_status: 'temporary_close',
        }
        setSuppliers(suppliers.map(s => s.id === record.id ? updatedSupplier : s))
        message.success('已关闭登录权限')
      },
    })
  }

  const handleTemporaryOpen = (record: any) => {
    Modal.confirm({
      title: '启用登录确认',
      content: `确定要启用供应商"${record.name}"的登录权限吗？`,
      onOk: () => {
        const updatedSupplier = {
          ...record,
          login_status: 'normal',
        }
        setSuppliers(suppliers.map(s => s.id === record.id ? updatedSupplier : s))
        message.success('已启用登录权限')
      },
    })
  }

  const handleConfigAdmin = (record: any) => {
    setSelectedSupplier(record)
    setConfigForm({
      phone: record.phone || '',
    })
    setConfigVisible(true)
  }

  const handleConfigSubmit = () => {
    if (!configForm.phone) {
      message.error('请填写管理员手机号')
      return
    }

    const updatedSupplier = {
      ...selectedSupplier,
      has_config_person: true,
      config_person_phone: configForm.phone,
      config_person_role: 'admin',
      config_by_supplier: false,
      persons: [
        {
          id: Date.now().toString(),
          phone: configForm.phone,
          role: 'admin',
          status: 'active',
          created_by: 'retailer',
          platform: 'pc',
          created_at: new Date().toLocaleString('zh-CN'),
        },
      ],
    }

    setSuppliers(suppliers.map(s => s.id === selectedSupplier.id ? updatedSupplier : s))
    setConfigVisible(false)

    recordOperationLog({
      operation_type: 'config_admin',
      operation_type_label: '配置管理员',
      target_user_name: '新超管',
      target_user_phone: configForm.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
    })

    message.success('供应商初始管理员配置成功')
  }

  const handleUserManage = (record: any) => {
    setSelectedSupplier(record)
    setUserManageVisible(true)
    setActiveTab('users')
  }

  const handleViewUserDetail = (user: any) => {
    setSelectedUser(user)
    setUserDetailVisible(true)
  }

  const handleToggleUserStatus = (user: any) => {
    Modal.confirm({
      title: user.status === 'active' ? '禁用确认' : '启用确认',
      content: `确定要${user.status === 'active' ? '禁用' : '启用'}用户"${user.name}"吗？`,
      onOk: () => {
        const updatedPersons = (selectedSupplier?.persons || []).map((p: any) =>
          p.id === user.id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
        )
        setSelectedSupplier({ ...selectedSupplier, persons: updatedPersons })

        recordOperationLog({
          operation_type: user.status === 'active' ? 'disable_user' : 'enable_user',
          operation_type_label: user.status === 'active' ? '禁用用户' : '启用用户',
          target_user_name: user.name,
          target_user_phone: user.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        })

        message.success(`已${user.status === 'active' ? '禁用' : '启用'}用户`)
      },
    })
  }

  const handleDeleteUser = (user: any) => {
    Modal.confirm({
      title: '删除确认',
      content: `确定要删除用户"${user.name}"吗？删除后该用户将无法访问系统。`,
      okType: 'danger',
      onOk: () => {
        const updatedPersons = (selectedSupplier?.persons || []).filter((p: any) => p.id !== user.id)
        const hasConfigPerson = updatedPersons.length > 0
        setSelectedSupplier({
          ...selectedSupplier,
          persons: updatedPersons,
          has_config_person: hasConfigPerson
        })

        recordOperationLog({
          operation_type: 'delete_user',
          operation_type_label: '删除用户',
          target_user_name: user.name,
          target_user_phone: user.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        })

        message.success('用户已删除')
      },
    })
  }

  const handleChangeSuperAdmin = (user: any) => {
    const currentAdmin = (selectedSupplier?.persons || []).find((p: any) => p.role === 'admin')
    setSelectedAdminForChange(currentAdmin)
    setChangeAdminVisible(true)
  }

  // 用户授权委托书管理
  const handleEsignAuthUser = (user: any) => {
    setSelectedUser(user)
    setUserEsignAuthVisible(true)
  }

  const handleUserEsignAuthApprove = () => {
    if (!selectedUser || !selectedSupplier) return
    const authNo = `AUTH${Date.now()}`
    const expireTime = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 23:59:59'
    const updatedPersons = (selectedSupplier.persons || []).map((p: any) => {
      if (p.id !== selectedUser.id) return p
      return {
        ...p,
        esign_auth: {
          ...p.esign_auth,
          status: 'approved',
          auth_no: authNo,
          expire_time: expireTime,
          reviewer: '当前审核人',
          review_time: new Date().toLocaleString(),
        }
      }
    })
    setSelectedSupplier({ ...selectedSupplier, persons: updatedPersons })
    setSelectedUser({ ...selectedUser, esign_auth: updatedPersons.find((p: any) => p.id === selectedUser.id)?.esign_auth })
    message.success('授权委托书已通过')
  }

  const handleUserEsignAuthReject = () => {
    userEsignAuthForm.validateFields().then(values => {
      if (!selectedUser || !selectedSupplier) return
      const updatedPersons = (selectedSupplier.persons || []).map((p: any) => {
        if (p.id !== selectedUser.id) return p
        return {
          ...p,
          esign_auth: {
            ...p.esign_auth,
            status: 'rejected',
            reject_reason: values.rejectReason.trim(),
            reviewer: '当前审核人',
            review_time: new Date().toLocaleString(),
          }
        }
      })
      setSelectedSupplier({ ...selectedSupplier, persons: updatedPersons })
      setSelectedUser({ ...selectedUser, esign_auth: updatedPersons.find((p: any) => p.id === selectedUser.id)?.esign_auth })
      setUserEsignAuthRejecting(false)
      userEsignAuthForm.resetFields()
      message.success('授权委托书已驳回')
    })
  }

  const handleChangeAdminSuccess = () => {
    setChangeAdminVisible(false)

    recordOperationLog({
      operation_type: 'change_phone',
      operation_type_label: '修改超管手机号',
      target_user_name: selectedAdminForChange?.name,
      target_user_phone: selectedAdminForChange?.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      change_detail: {
        field: 'phone',
        old_value: selectedAdminForChange?.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        new_value: '新手机号',
      },
    })

    setSelectedAdminForChange(null)
    message.success('超管修改成功')
    fetchSuppliers()
  }

  const handleDownloadTemplate = () => {
    const templateData = [
      ['供应商编码', '超管手机号'],
      ['302066', '13800138000'],
      ['303300', '13900139002'],
      ['592000222', '13700137005'],
    ]

    const csvContent = templateData.map((row) => row.join('\t')).join('\n')

    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '供应商超管导入模板.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    message.success('模板下载成功，请按格式填写后上传')
  }

  const handleBatchImport = async () => {
    if (importFileList.length === 0) {
      message.warning('请先选择要导入的文件')
      return
    }

    Modal.confirm({
      title: '确认批量导入',
      content: (
        <div>
          <p>确定要批量导入超管配置吗？</p>
          <p style={{ color: '#666', fontSize: 12 }}>
            系统将自动校验数据格式并批量创建账号。如某供应商已有超管，将更新其手机号。
          </p>
        </div>
      ),
      okText: '确认导入',
      cancelText: '取消',
      onOk: async () => {
        try {
          setImporting(true)
          setImportProgress(0)

          const progressTimer = setInterval(() => {
            setImportProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressTimer)
                return 90
              }
              return prev + 10
            })
          }, 200)

          await new Promise((resolve) => setTimeout(resolve, 2500))

          clearInterval(progressTimer)
          setImportProgress(100)

          setImportResult({
            success: 45,
            failed: 2,
            errors: [
              { row: 10, supplier_code: 'INVALID', reason: '供应商编码不存在' },
              { row: 25, supplier_code: '303300', reason: '手机号格式错误' },
            ],
          })

          recordOperationLog({
            operation_type: 'batch_import',
            operation_type_label: '批量导入超管',
            extra: {
              success_count: 45,
              failed_count: 2,
            },
            related_batch_id: `batch_${Date.now()}`,
          })

          setImporting(false)
          message.success(`导入完成！成功 45 条，失败 2 条`)

          fetchSuppliers()
        } catch (error: any) {
          setImporting(false)
          message.error(error.response?.data?.message || '导入失败，请重试')
        }
      },
    })
  }

  const renderPermissionTags = (permissions: string[]) => {
    if (!permissions || permissions.length === 0) {
      return <span style={{ color: '#999', fontSize: 12 }}>无此类别权限</span>
    }
    return (
      <div>
        {permissions.map((perm: string) => (
          <Tag key={perm} color="blue" style={{ marginBottom: 4, marginRight: 4 }}>
            {perm}
          </Tag>
        ))}
      </div>
    )
  }

  const userColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 80 },
    { title: '手机号', dataIndex: 'phone', key: 'phone', width: 150, render: (phone: string) => <PhoneDisplay phone={phone} /> },
    { title: '角色', dataIndex: 'role_names', key: 'role_names', width: 160, render: (roleNames: string[] = []) => {
      return (
        <span>
          {roleNames.map((roleName, idx) => (
            <Tag key={idx} color="blue" style={{ margin: '2px 4px 2px 0' }}>{roleName}</Tag>
          ))}
        </span>
      )
    } },
    {
      title: '授权委托书',
      dataIndex: 'esign_auth',
      key: 'esign_auth',
      width: 120,
      render: (esignAuth: any) => {
        const statusMap: Record<string, { label: string; color: string }> = {
          none: { label: '未提交', color: 'default' },
          pending: { label: '待审核', color: 'blue' },
          approved: { label: '已通过', color: 'green' },
          rejected: { label: '已驳回', color: 'red' },
        };
        const config = statusMap[esignAuth?.status || 'none'];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    { title: '状态', dataIndex: 'status', key: 'status', width: 70, render: (status: string) => {
      return <Tag color={status === 'active' ? 'success' : 'default'}>{status === 'active' ? '启用' : '禁用'}</Tag>
    } },
    {
      title: '操作',
      key: 'action',
      width: 260,
      render: (_: unknown, record: any) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleViewUserDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleEsignAuthUser(record)}
          >
            授权书
          </Button>
          <Button 
            type="link" 
            size="small"
            onClick={() => handleToggleUserStatus(record)}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
          {record.role === 'admin' && (
            <Button
              type="link"
              size="small"
              style={{ color: '#fa8c16' }}
              onClick={() => handleChangeSuperAdmin(record)}
            >
              修改超管
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const formatOperationContent = (log: OperationLog): string => {
    switch(log.operation_type) {
      case 'config_admin':
        return `创建超管：${log.target_user_name} (${log.target_user_phone})`

      case 'change_phone':
        if (log.change_detail) {
          return `修改超管手机号：${log.change_detail.old_value} → ${log.change_detail.new_value}`
        }
        return '修改超管手机号'

      case 'batch_import':
        const successCount = log.extra?.success_count || 0
        const failCount = log.extra?.failed_count || 0
        return `批量导入${successCount + failCount}个超管 (成功:${successCount} 失败:${failCount})`

      case 'disable_user':
        return `禁用用户：${log.target_user_name} (${log.target_user_phone})`

      case 'enable_user':
        return `启用用户：${log.target_user_name} (${log.target_user_phone})`

      case 'delete_user':
        return `删除用户：${log.target_user_name} (${log.target_user_phone})`

      default:
        return log.operation_content || '-'
    }
  }

  const operationLogColumns = [
    {
      title: '操作时间',
      dataIndex: 'operation_time',
      key: 'operation_time',
      width: 160,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作类型',
      dataIndex: 'operation_type',
      key: 'operation_type',
      width: 130,
      render: (type: string, record: OperationLog) => {
        const isImportant = ['config_admin', 'change_phone', 'batch_import', 'delete_user'].includes(type)
        return (
          <Tag color={isImportant ? 'red' : 'blue'}>
            {record.operation_type_label}
            {isImportant && <span style={{ marginLeft: 4 }}>🔴</span>}
            {!isImportant && <span style={{ marginLeft: 4 }}>🟡</span>}
          </Tag>
        )
      },
    },
    {
      title: '操作人',
      dataIndex: 'operator_name',
      key: 'operator_name',
      width: 120,
      render: (name: string, record: OperationLog) => (
        <div>
          <div>{name}</div>
          <div style={{ fontSize: 11, color: '#999' }}>{record.operator_role}</div>
        </div>
      ),
    },
    {
      title: '操作内容',
      dataIndex: 'operation_content',
      key: 'operation_content',
      width: 350,
      render: (_: string, record: OperationLog) => formatOperationContent(record),
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      width: 80,
      render: (result: string) => (
        <Tag color={result === 'success' ? 'success' : 'error'}>
          {result === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
  ]

  const columns = [
    { title: '供应商编码', dataIndex: 'code', key: 'code', width: 100, fixed: 'left' as const },
    { title: '供应商名称', dataIndex: 'name', key: 'name', width: 180, fixed: 'left' as const },
    { title: '认证状态', dataIndex: 'auth_status', key: 'auth_status', width: 100 },
    { title: '公司/个人', dataIndex: 'supplier_type', key: 'supplier_type', width: 100 },
    { title: '社会信用统一编码/身份证', dataIndex: 'credit_code', key: 'credit_code', width: 180 },
    { title: '经营小类代码', dataIndex: 'business_category_code', key: 'business_category_code', width: 120 },
    { title: '经营小类名称', dataIndex: 'business_category_name', key: 'business_category_name', width: 120 },
    { title: '税率', dataIndex: 'tax_rate', key: 'tax_rate', width: 80 },
    { title: '管理方式', dataIndex: 'management_style', key: 'management_style', width: 100 },
    { title: '供应商类型', dataIndex: 'supplier_type_detail', key: 'supplier_type_detail', width: 150 },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right' as const,
      render: (_: unknown, record: any) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleUserManage(record)}
            style={{ color: '#1890ff' }}
          >
            用户管理
          </Button>
          {!record.has_config_person && (
            <Button 
              type="link" 
              size="small" 
              onClick={() => handleConfigAdmin(record)}
              style={{ color: '#1890ff' }}
            >
              配置管理员
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <Alert
        message="供应商管理功能说明"
        description={
          <div>
            <p><strong>数据来源：</strong>所有供应商资料均来自供应商管理平台（智引系统）。</p>
            <p><strong>主要功能：</strong></p>
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>查看供应商基本信息、合同状态、经营品类等数据</li>
              <li>管理供应商初始管理员，为供应商配置智协PC端和智协小程序的登录权限</li>
              <li>查看供应商在供应商平台配置的人员信息</li>
              <li>控制供应商平台的登录状态（临时放开/临时关闭）</li>
              <li>查看供应商人员的登录日志</li>
            </ul>
            <p style={{ marginTop: 8, marginBottom: 0 }}><strong>重要提示：</strong>本页面主要用于管理供应商后续在智协PC端和智协小程序上的登录权限，确保供应商人员可以正常访问相关系统。</p>
          </div>
        }
        type="info"
          closable
          style={{ marginBottom: 16 }}
      />

      <AdvancedSearchFilter
        fields={[
          { key: 'supplierKeyword', label: '供应商', type: 'input', placeholder: '请输入供应商编码或名称' },
          { key: 'creditCode', label: '信用代码', type: 'input', placeholder: '请输入信用代码' },
          { key: 'supplierType', label: '类型', type: 'select', placeholder: '请选择',
            options: [{ label: '公司', value: 'company' }, { label: '个人', value: 'personal' }]
          },
          { key: 'businessCategory', label: '经营小类', type: 'input', placeholder: '请输入' },
          { key: 'managementStyle', label: '管理方式', type: 'select', placeholder: '请选择' }
        ]}
        values={filters}
        onChange={(k, v) => handleFilterChange({ ...filters, [k]: v })}
        onSearch={() => handleSearch()}
        onReset={() => handleReset()}
        extraActions={<Button type="primary" onClick={() => setBatchImportVisible(true)} style={{ height: 32 }}>超管导入</Button>}
      />

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          type="primary"
          onClick={() => setBatchImportVisible(true)}
          style={{ height: 32 }}
        >
          超管导入
        </Button>
        <span style={{ fontSize: 14, color: '#666' }}>共 {suppliers.length} 条</span>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={suppliers}
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 1700 }}
      />

      <Drawer
        title="供应商详情"
        placement="right"
        width={720}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
      >
        {selectedSupplier && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="供应商编码">{selectedSupplier.code}</Descriptions.Item>
            <Descriptions.Item label="供应商名称">{selectedSupplier.name}</Descriptions.Item>
            <Descriptions.Item label="认证状态">{selectedSupplier.auth_status}</Descriptions.Item>
            <Descriptions.Item label="供应商类型">{selectedSupplier.supplier_type}</Descriptions.Item>
            <Descriptions.Item label="绑定状态"><Tag color={selectedSupplier.bind_status === '绑定' ? 'success' : 'default'}>{selectedSupplier.bind_status}</Tag></Descriptions.Item>
            <Descriptions.Item label="绑定时间">{selectedSupplier.bind_time}</Descriptions.Item>
            <Descriptions.Item label="是否超管"><Tag color={selectedSupplier.is_admin ? 'blue' : 'default'}>{selectedSupplier.is_admin ? '是' : '否'}</Tag></Descriptions.Item>
            <Descriptions.Item label="姓名">{selectedSupplier.contact_name}</Descriptions.Item>
            <Descriptions.Item label="手机"><PhoneDisplay phone={selectedSupplier.contact_phone} /></Descriptions.Item>
            <Descriptions.Item label="最近登录时间">{selectedSupplier.last_login_time}</Descriptions.Item>
            <Descriptions.Item label="合作区域">{selectedSupplier.cooperation_area}</Descriptions.Item>
            <Descriptions.Item label="经营小类">{selectedSupplier.business_category_name}</Descriptions.Item>
            <Descriptions.Item label="税率">{selectedSupplier.tax_rate}</Descriptions.Item>
            <Descriptions.Item label="地址" span={2}>{selectedSupplier.address}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      <Modal
        title="配置供应商初始管理员"
        open={configVisible}
        onOk={handleConfigSubmit}
        onCancel={() => setConfigVisible(false)}
        width={500}
      >
        {selectedSupplier && (
          <div>
            <p style={{ marginBottom: 16, fontWeight: 'bold' }}>供应商：{selectedSupplier.name} ({selectedSupplier.code})</p>
            <Row gutter={16}>
              <Col span={24}>
                <Input
                  placeholder="管理员手机号"
                  value={configForm.phone}
                  onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
                  style={{ marginBottom: 16 }}
                />
              </Col>
            </Row>
            <p style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
              配置完成后，系统将自动为该管理员创建登录账号，初始密码将发送至填写的手机号。
            </p>
          </div>
        )}
      </Modal>

      <Drawer
        title={`用户管理 - ${selectedSupplier?.name}`}
        placement="right"
        width={900}
        onClose={() => setUserManageVisible(false)}
        open={userManageVisible}
        afterOpenChange={(open) => {
          if (open && selectedSupplier) {
            loadOperationLogs(selectedSupplier.code)
          }
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'users',
              label: '用户列表',
              children: selectedSupplier?.persons && selectedSupplier.persons.length > 0 ? (
                <Table
                  rowKey="id"
                  columns={userColumns}
                  dataSource={selectedSupplier.persons}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                  }}
                  size="small"
                />
              ) : (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
                  暂无用户，请先配置管理员
                </div>
              ),
            },
            {
              key: 'logs',
              label: '操作日志',
              children: (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Space wrap>
                      <Select
                        placeholder="操作类型"
                        allowClear
                        style={{ width: 140 }}
                        value={logFilter.type}
                        onChange={(value) => setLogFilter({ ...logFilter, type: value })}
                        options={[
                          { value: 'config_admin', label: '配置管理员' },
                          { value: 'change_phone', label: '修改超管手机号' },
                          { value: 'batch_import', label: '批量导入' },
                          { value: 'disable_user', label: '禁用用户' },
                          { value: 'enable_user', label: '启用用户' },
                          { value: 'delete_user', label: '删除用户' },
                        ]}
                      />

                      <Button type="primary">
                        查询
                      </Button>
                      <Button onClick={() => setLogFilter({ type: '' })}>
                        重置
                      </Button>
                    </Space>
                  </div>

                  <Table
                    rowKey="id"
                    columns={operationLogColumns}
                    dataSource={logFilter.type ? operationLogs.filter(log => log.operation_type === logFilter.type) : operationLogs}
                    pagination={{
                      pageSize: 10,
                      showTotal: (total) => `共 ${total} 条记录`,
                      showSizeChanger: false,
                    }}
                    size="small"
                    locale={{ emptyText: '暂无操作日志' }}
                    loading={logsLoading}
                  />
                </div>
              ),
            },
          ]}
        />
        <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
            <strong>说明：</strong>
            用户由供应商在供应商端自行配置，包括超管和其他角色。超管拥有所有权限，其他角色权限由超管分配。
            点击用户列表中的"详情"可查看用户的完整信息、功能权限和数据权限范围。
          </p>
        </div>
      </Drawer>

      <Drawer
        title={`用户详情 - ${selectedUser?.name}`}
        placement="right"
        width={800}
        onClose={() => setUserDetailVisible(false)}
        open={userDetailVisible}
      >
        {selectedUser && (
          <>
            <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="姓名">{selectedUser.name}</Descriptions.Item>
                <Descriptions.Item label="手机号"><PhoneDisplay phone={selectedUser.phone} /></Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={selectedUser.status === 'active' ? 'success' : 'default'}>
                    {selectedUser.status === 'active' ? '启用' : '禁用'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">{selectedUser.created_at}</Descriptions.Item>
                <Descriptions.Item label="最后登录" span={2}>{selectedUser.last_login_time || '-'}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="功能权限" size="small" style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <strong>当前角色：</strong>
                {(selectedUser.role_names || []).map((roleName: string, idx: number) => (
                  <Tag key={idx} color="blue" style={{ marginLeft: 8 }}>
                    {roleName}
                  </Tag>
                ))}
                <Tag color={selectedUser.role_type === 'system' ? 'processing' : 'default'} style={{ marginLeft: 4 }}>
                  {selectedUser.role_type === 'system' ? '系统预设' : '自定义角色'}
                </Tag>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={5} style={{ marginBottom: 8 }}>📦 业务经营</Title>
                {renderPermissionTags(selectedUser.permissions?.business || [])}
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={5} style={{ marginBottom: 8 }}>💰 财务结算</Title>
                {renderPermissionTags(selectedUser.permissions?.finance || [])}
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={5} style={{ marginBottom: 8 }}>🏢 企业管理</Title>
                {renderPermissionTags(selectedUser.permissions?.enterprise || [])}
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={5} style={{ marginBottom: 8 }}>🤝 合作与合同</Title>
                {renderPermissionTags(selectedUser.permissions?.cooperation || [])}
              </div>

              <div>
                <Title level={5} style={{ marginBottom: 8 }}>⚙️ 系统与其他</Title>
                {renderPermissionTags(selectedUser.permissions?.system || [])}
              </div>
            </Card>

            <Card title="数据权限范围" size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="权限类型">
                  <Tag>{selectedUser.data_scope?.label}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="详细范围">
                  {selectedUser.data_scope?.detail?.map((item: string) => (
                    <Tag key={item} style={{ marginBottom: 4, marginRight: 4 }}>{item}</Tag>
                  ))}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {selectedUser.login_records && selectedUser.login_records.length > 0 && (
              <Card title="登录记录" size="small">
                <Table
                  size="small"
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                    showTotal: (total) => `共 ${total} 条记录`,
                  }}
                  dataSource={selectedUser.login_records}
                  columns={[
                    { title: '登录时间', dataIndex: 'time', width: 160 },
                    { title: '登录方式/IP', dataIndex: 'method', width: 140 },
                    { title: '登录结果', dataIndex: 'result', width: 80 },
                    { title: 'IP地址', dataIndex: 'ip', width: 120 },
                  ]}
                />
              </Card>
            )}
          </>
        )}
      </Drawer>

      <Drawer
        title={`授权委托书 - ${selectedUser?.name}`}
        placement="right"
        width={560}
        onClose={() => {
          setUserEsignAuthVisible(false)
          setUserEsignAuthRejecting(false)
          userEsignAuthForm.resetFields()
        }}
        open={userEsignAuthVisible}
      >
        {selectedUser?.esign_auth?.status === 'none' && (
          <Empty description="该用户尚未提交授权委托书" />
        )}
        {selectedUser && selectedUser.esign_auth && selectedUser.esign_auth.status !== 'none' && (
          <>
            {!selectedUser.esign_auth.file_url && (
              <Alert
                message="供应商尚未上传授权委托书文件，请等待供应商上传"
                type="warning"
                style={{ marginBottom: 16 }}
              />
            )}

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="用户姓名">{selectedUser?.name}</Descriptions.Item>
              <Descriptions.Item label="手机号"><PhoneDisplay phone={selectedUser?.phone} /></Descriptions.Item>
              <Descriptions.Item label="所属供应商">{selectedSupplier?.name}</Descriptions.Item>
              <Descriptions.Item label="提交时间">{selectedUser?.esign_auth?.submit_time}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {(() => {
                  const statusMap: Record<string, { label: string; color: string }> = {
                    none: { label: '未提交', color: 'default' },
                    pending: { label: '待审核', color: 'blue' },
                    approved: { label: '已通过', color: 'green' },
                    rejected: { label: '已驳回', color: 'red' },
                  };
                  const config = statusMap[selectedUser?.esign_auth?.status || 'none'] || { label: selectedUser?.esign_auth?.status || '未知', color: 'default' };
                  return <Tag color={config.color}>{config.label}</Tag>;
                })()}
              </Descriptions.Item>
              {selectedUser?.esign_auth?.auth_no && (
                <Descriptions.Item label="授权编号">{selectedUser?.esign_auth?.auth_no}</Descriptions.Item>
              )}
              {selectedUser?.esign_auth?.expire_time && (
                <Descriptions.Item label="有效期至">{selectedUser?.esign_auth?.expire_time}</Descriptions.Item>
              )}
              {selectedUser?.esign_auth?.reject_reason && (
                <Descriptions.Item label="驳回原因">{selectedUser?.esign_auth?.reject_reason}</Descriptions.Item>
              )}
              {selectedUser?.esign_auth?.reviewer && (
                <Descriptions.Item label="审核人">{selectedUser?.esign_auth?.reviewer}</Descriptions.Item>
              )}
              {selectedUser?.esign_auth?.review_time && (
                <Descriptions.Item label="审核时间">{selectedUser?.esign_auth?.review_time}</Descriptions.Item>
              )}
            </Descriptions>

            {selectedUser?.esign_auth?.file_url && (
              <div style={{ marginTop: 16 }}>
                <Button onClick={() => window.open(selectedUser.esign_auth.file_url, '_blank')}>
                  查看授权书
                </Button>
              </div>
            )}

            {selectedUser.esign_auth.status === 'pending' && (
              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Space>
                  <Button type="primary" onClick={handleUserEsignAuthApprove}>通过</Button>
                  <Button danger onClick={() => setUserEsignAuthRejecting(true)}>驳回</Button>
                </Space>
              </div>
            )}

            {selectedUser.esign_auth.status === 'rejected' && (
              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Button type="primary" onClick={handleUserEsignAuthApprove}>重新通过</Button>
              </div>
            )}
          </>
        )}

        <Modal
          title="驳回授权委托书"
          open={userEsignAuthRejecting}
          onOk={handleUserEsignAuthReject}
          onCancel={() => {
            setUserEsignAuthRejecting(false)
            userEsignAuthForm.resetFields()
          }}
          okText="确认驳回"
        >
          <Form form={userEsignAuthForm} layout="vertical">
            <Form.Item
              name="rejectReason"
              label="驳回原因"
              rules={[{ required: true, message: '请输入驳回原因' }]}
            >
              <Input.TextArea rows={4} placeholder="请输入驳回原因" />
            </Form.Item>
          </Form>
        </Modal>
      </Drawer>

      <ChangeSuperAdminModal
        visible={changeAdminVisible}
        supplier={selectedSupplier}
        currentAdmin={selectedAdminForChange}
        onCancel={() => {
          setChangeAdminVisible(false)
          setSelectedAdminForChange(null)
        }}
        onSuccess={handleChangeAdminSuccess}
      />

      <Modal
        title="批量导入供应商超管"
        open={batchImportVisible}
        onCancel={() => {
          setBatchImportVisible(false)
          setImportFileList([])
          setImportResult(null)
          setImportProgress(0)
        }}
        width={700}
        footer={[
          <Button key="cancel" onClick={() => setBatchImportVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={importing}
            disabled={importFileList.length === 0}
            onClick={handleBatchImport}
          >
            {importing ? '导入中...' : '开始导入'}
          </Button>
        ]}
      >
        <Steps
          current={importResult ? 2 : importFileList.length > 0 ? 1 : 0}
          style={{ marginBottom: 24 }}
          items={[
            { title: '下载模板' },
            { title: '上传文件' },
            {
              title: '完成导入',
            },
          ]}
        />

        <Alert
          message="操作说明"
          description={
            <div>
              <Paragraph>
                1. <Text strong>下载Excel模板</Text>，获取标准导入格式
              </Paragraph>
              <Paragraph>
                2. <Text strong>填写数据</Text>：在模板中填写供应商编码和对应的超管手机号
              </Paragraph>
              <Paragraph>
                3. <Text strong>上传文件</Text>：选择填写完成的Excel文件（.xlsx / .xls）
              </Paragraph>
              <Paragraph>
                4. <Text strong>开始导入</Text>：系统将自动校验数据并批量创建超管账号
              </Paragraph>
            </div>
          }
          type="info"
          style={{ marginBottom: 16 }}
        />

        {!importResult && (
          <Card size="small" title="步骤1：下载导入模板" style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={handleDownloadTemplate} block>
              下载 Excel 模板 (.xlsx)
            </Button>
            <Paragraph type="secondary" style={{ marginTop: 8, fontSize: 12, marginBottom: 0 }}>
              模板包含以下字段：供应商编码（必填）、超管手机号（必填）
            </Paragraph>
          </Card>
        )}

        {!importResult && (
          <Card size="small" title="步骤2：上传填写好的文件" style={{ marginBottom: 16 }}>
            <Dragger
              fileList={importFileList}
              onChange={(info: any) => {
                if (info.file.status === 'done') {
                  setImportFileList([info.file])
                  message.success(`${info.file.name} 文件上传成功`)
                } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} 文件上传失败`)
                }
              }}
              beforeUpload={(file: any) => {
                const isExcel =
                  file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                  file.type === 'application/vnd.ms-excel' ||
                  file.name.endsWith('.xlsx') ||
                  file.name.endsWith('.xls')
                if (!isExcel) {
                  message.error('仅支持 .xlsx 或 .xls 格式的Excel文件！')
                  return false
                }
                const isLt10M = file.size / 1024 / 1024 < 10
                if (!isLt10M) {
                  message.error('文件大小不能超过 10MB！')
                  return false
                }
                return false
              }}
              multiple={false}
              accept=".xlsx,.xls"
              maxCount={1}
            >
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">支持 .xlsx / .xls 格式，单次最多导入 500 条记录</p>
            </Dragger>
          </Card>
        )}

        {!importResult && (
          <Alert
            message="注意事项"
            description={
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>供应商编码必须已存在于当前供应商列表中</li>
                <li>手机号必须为11位数字（1开头，第二位3-9）</li>
                <li>重复的供应商编码将自动跳过，不会重复创建</li>
                <li>导入成功后，系统将向超管手机号发送短信通知</li>
                <li>如某供应商已有超管，将更新其手机号而非创建新账号</li>
              </ul>
            }
            type="warning"
            style={{ marginBottom: 16 }}
          />
        )}

        {importing && (
          <Card size="small" title="导入进度" style={{ marginBottom: 16 }}>
            <Progress percent={importProgress} status={importProgress === 100 ? 'success' : 'active'} />
            <Paragraph type="secondary" style={{ marginTop: 8, textAlign: 'center', marginBottom: 0 }}>
              {importProgress < 100 ? '正在解析文件并创建账号，请稍候...' : '数据处理完成，正在生成报告...'}
            </Paragraph>
          </Card>
        )}

        {importResult && !importing && (
          <Card
            size="small"
            title={
              <span>
                {importResult.failed > 0 ? (
                  <span style={{ color: '#ff4d4f' }}>⚠ 导入完成（部分失败）</span>
                ) : (
                  <span style={{ color: '#52c41a' }}>✓ 导入成功</span>
                )}
              </span>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="成功导入" value={importResult.success} valueStyle={{ color: '#3f8600' }} />
              </Col>
              <Col span={12}>
                <Statistic
                  title="导入失败"
                  value={importResult.failed}
                  valueStyle={{ color: importResult.failed > 0 ? '#cf1322' : '#3f8600' }}
                />
              </Col>
            </Row>

            {importResult.errors.length > 0 && (
              <Table
                size="small"
                pagination={false}
                dataSource={importResult.errors}
                columns={[
                  { title: '行号', dataIndex: 'row', width: 60 },
                  { title: '供应商编码', dataIndex: 'supplier_code', width: 120 },
                  { title: '失败原因', dataIndex: 'reason' },
                ]}
                style={{ marginTop: 16 }}
              />
            )}

            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Space>
                <Button
                  onClick={() => {
                    setImportResult(null)
                    setImportFileList([])
                  }}
                >
                  重新导入
                </Button>
                <Button type="primary" onClick={() => setBatchImportVisible(false)}>
                  关闭
                </Button>
              </Space>
            </div>
          </Card>
        )}
      </Modal>

    </Card>
  )
}

export default SupplierManagement
