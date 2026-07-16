import React, { useState, useEffect } from 'react'
import {
  Card, Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker,
  message, Row, Col, Statistic, Upload, Alert, Radio, Tooltip, Empty, Spin,
} from 'antd'
import {
  PlusOutlined, ReloadOutlined, RobotOutlined, CameraOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons'
import type { License, LicenseType } from '@/types/phase1'
import { LICENSE_TYPES } from '@/types/phase1'
import { usePermission } from '@/contexts/PermissionContext'

const { Option } = Select
const { RangePicker } = DatePicker

const LicenseManagement: React.FC = () => {
  const { isAdmin } = usePermission()

  // 数据
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // 编辑弹窗
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<License | null>(null)
  const [form] = Form.useForm()
  const [isPermanent, setIsPermanent] = useState(false)
  const [aiRecognizing, setAiRecognizing] = useState(false)
  const [aiResult, setAiResult] = useState<any>(null)

  // 加载
  const loadData = () => {
    setLoading(true)
    // Mock 数据
    setTimeout(() => {
      setLicenses([
        {
          id: '1', supplier_code: 'NFS001', store_id: 'store_001',
          license_type: 'business_license', license_name: '营业执照',
          license_no: '91110000X12345678X', issue_date: '2020-01-01', expire_date: '2030-12-31',
          is_permanent: false, issuing_authority: '北京市市场监督管理局',
          ai_recognized: true, status: 'active', version: 1,
          created_at: '2026-01-15 10:00:00', updated_at: '2026-01-15 10:00:00',
        },
        {
          id: '2', supplier_code: 'NFS001', store_id: 'store_001',
          license_type: 'food_license', license_name: '食品经营许可证',
          license_no: 'JY11100001234', issue_date: '2021-03-15', expire_date: '2027-03-14',
          is_permanent: false, issuing_authority: '北京市食品药品监督管理局',
          ai_recognized: false, status: 'active', version: 1,
          created_at: '2026-01-15 10:00:00', updated_at: '2026-01-15 10:00:00',
        },
        {
          id: '3', supplier_code: 'NFS001', store_id: 'store_002',
          license_type: 'health_license', license_name: '卫生许可证',
          license_no: 'WS-2024-001', issue_date: '2024-01-01', expire_date: '2029-12-31',
          is_permanent: false, issuing_authority: '北京市卫生局',
          ai_recognized: false, status: 'active', version: 1,
          created_at: '2026-01-15 10:00:00', updated_at: '2026-01-15 10:00:00',
        },
        {
          id: '4', supplier_code: 'NFS001',
          license_type: 'trademark_certificate', license_name: '商标注册证',
          license_no: 'TM-2024-001', issue_date: '2024-06-01', expire_date: null,
          is_permanent: true, issuing_authority: '国家知识产权局',
          ai_recognized: false, status: 'active', version: 1,
          created_at: '2026-01-15 10:00:00', updated_at: '2026-01-15 10:00:00',
        },
        {
          id: '5', supplier_code: 'NFS001', store_id: 'store_001',
          license_type: 'production_license', license_name: '生产许可证（旧）',
          license_no: 'SC-2020-001', issue_date: '2020-01-01', expire_date: '2024-12-31',
          is_permanent: false, issuing_authority: '北京市质量技术监督局',
          ai_recognized: false, status: 'expired', version: 1,
          created_at: '2020-01-15 10:00:00', updated_at: '2024-12-31 23:59:59',
        },
      ])
      setLoading(false)
    }, 300)
  }

  useEffect(() => { loadData() }, [])

  // 打开编辑
  const openEdit = (license: License | null) => {
    setEditing(license)
    setAiResult(null)
    if (license) {
      form.setFieldsValue({
        license_type: license.license_type,
        license_name: license.license_name,
        license_no: license.license_no,
        issue_date: license.issue_date,
        expire_date: license.expire_date,
        is_permanent: license.is_permanent,
        issuing_authority: license.issuing_authority,
        store_id: license.store_id,
      })
      setIsPermanent(license.is_permanent)
    } else {
      form.resetFields()
      form.setFieldsValue({ is_permanent: false })
      setIsPermanent(false)
    }
    setEditOpen(true)
  }

  // AI 识别
  const handleAiRecognize = async (file: File) => {
    setAiRecognizing(true)
    // 模拟 AI 识别（生产环境调 /api/ai/recognize）
    setTimeout(() => {
      const mockResult = {
        success: true,
        data: {
          license_type: 'business_license',
          license_name: '营业执照（AI 识别）',
          license_no: '91110000AI' + Math.floor(Math.random() * 1000000),
          issuing_authority: '北京市市场监督管理局（AI）',
          issue_date: '2020-01-01',
          expire_date: '2030-12-31',
          confidence: 0.95,
        },
      }
      form.setFieldsValue(mockResult.data)
      setAiResult(mockResult.data)
      setIsPermanent(false)
      setAiRecognizing(false)
      message.success('AI 识别完成，请核对信息后保存')
    }, 1500)
    return false  // 阻止自动上传
  }

  // 提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      message.success(editing ? '修改成功' : '新增成功')
      setEditOpen(false)
      loadData()
    } catch (e) {}
  }

  // 延期
  const handleRenew = (license: License) => {
    Modal.confirm({
      title: '证照延期',
      content: `确认对「${license.license_name}」进行延期？将生成新版本关联原证照`,
      onOk: () => {
        message.success('延期成功，新版本已生成')
        loadData()
      },
    })
  }

  // 删除
  const handleDelete = (license: License) => {
    Modal.confirm({
      title: '确认删除？',
      content: `将删除「${license.license_name}」`,
      okType: 'danger',
      onOk: () => {
        message.success('删除成功')
        loadData()
      },
    })
  }

  // 过滤
  const filtered = licenses.filter(l => {
    if (filterType !== 'all' && l.license_type !== filterType) return false
    if (filterStatus !== 'all' && l.status !== filterStatus) return false
    return true
  })

  // 状态映射
  const statusMap: any = {
    active: { color: 'success', text: '有效' },
    expired: { color: 'default', text: '已过期' },
    pending: { color: 'processing', text: '待审核' },
    rejected: { color: 'error', text: '已驳回' },
  }

  // 表格列
  const columns = [
    {
      title: '证照类型', dataIndex: 'license_type', key: 'license_type', width: 200,
      render: (code: string) => {
        const t = LICENSE_TYPES.find(x => x.code === code)
        return (
          <Space>
            <Tag color={t?.enabled ? 'blue' : 'default'}>{t?.name || code}</Tag>
            {!t?.enabled && <Tag color="warning">二期</Tag>}
          </Space>
        )
      },
    },
    { title: '证照名称', dataIndex: 'license_name', key: 'license_name' },
    { title: '编号', dataIndex: 'license_no', key: 'license_no', width: 180 },
    {
      title: '门店/专柜', dataIndex: 'store_id', key: 'store_id', width: 120,
      render: (s: string) => s || <Tag>全供应商</Tag>,
    },
    {
      title: '有效期', key: 'period', width: 240,
      render: (_: any, r: License) => {
        if (r.is_permanent) return <Tag color="green">长期有效</Tag>
        return (
          <span style={{ fontSize: 12 }}>
            {r.issue_date?.slice(0, 10)} ~ {r.expire_date?.slice(0, 10) || '-'}
          </span>
        )
      },
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: string) => <Tag color={statusMap[s]?.color}>{statusMap[s]?.text}</Tag>,
    },
    {
      title: '来源', dataIndex: 'ai_recognized', key: 'ai_recognized', width: 80,
      render: (ai: boolean) => ai ? <Tag icon={<RobotOutlined />} color="purple">AI</Tag> : <Tag>手动</Tag>,
    },
    {
      title: '版本', dataIndex: 'version', key: 'version', width: 60,
      render: (v: number) => <Tag>v{v}</Tag>,
    },
    {
      title: '操作', key: 'action', width: 220, fixed: 'right' as const,
      render: (_: any, r: License) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => openEdit(r)}>查看/编辑</Button>
          {r.status === 'active' && !r.is_permanent && (
            <Button type="link" size="small" onClick={() => handleRenew(r)}>延期</Button>
          )}
          {isAdmin && (
            <Button type="link" size="small" danger onClick={() => handleDelete(r)}>删除</Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={5}>
            <Statistic title="证照总数" value={licenses.length} />
          </Col>
          <Col span={5}>
            <Statistic
              title="有效"
              value={licenses.filter(l => l.status === 'active').length}
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={5}>
            <Statistic
              title="已过期"
              value={licenses.filter(l => l.status === 'expired').length}
              valueStyle={{ color: '#cf1322' }}
            />
          </Col>
          <Col span={9}>
            <Space>
              <Select
                style={{ width: 160 }}
                placeholder="证照类型"
                value={filterType}
                onChange={setFilterType}
              >
                <Option value="all">全部类型</Option>
                {LICENSE_TYPES.map(t => (
                  <Option key={t.code} value={t.code} disabled={!t.enabled}>
                    {t.name}{!t.enabled && '（二期）'}
                  </Option>
                ))}
              </Select>
              <Select
                style={{ width: 120 }}
                placeholder="状态"
                value={filterStatus}
                onChange={setFilterStatus}
              >
                <Option value="all">全部状态</Option>
                <Option value="active">有效</Option>
                <Option value="expired">已过期</Option>
                <Option value="pending">待审核</Option>
                <Option value="rejected">已驳回</Option>
              </Select>
              <Button icon={<ReloadOutlined />} onClick={loadData}>刷新</Button>
              {isAdmin && (
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openEdit(null)}>
                  新增证照
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description="暂无证照数据" /> }}
        />
      </Card>

      {/* 编辑弹窗 */}
      <Modal
        title={editing ? `证照详情 - ${editing.license_name}` : '新增证照'}
        open={editOpen}
        onOk={handleSubmit}
        onCancel={() => setEditOpen(false)}
        width={700}
        destroyOnClose
      >
        {!editing && (
          <Alert
            type="info"
            message="提示：可上传证照图片，AI 自动识别回填表单"
            icon={<RobotOutlined />}
            style={{ marginBottom: 16 }}
          />
        )}

        {!editing && (
          <Upload.Dragger
            accept="image/*,.pdf"
            beforeUpload={handleAiRecognize}
            showUploadList={false}
            disabled={aiRecognizing}
            style={{ marginBottom: 16 }}
          >
            <Spin spinning={aiRecognizing}>
              <p className="ant-upload-drag-icon">
                <CameraOutlined style={{ fontSize: 36, color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">
                {aiRecognizing ? 'AI 识别中...' : '点击或拖拽上传证照图片'}
              </p>
              <p className="ant-upload-hint">
                支持 JPG/PNG/PDF，AI 自动识别 17 类证照
              </p>
            </Spin>
          </Upload.Dragger>
        )}

        {aiResult && (
          <Alert
            type="success"
            message={`AI 识别完成（置信度 ${(aiResult.confidence * 100).toFixed(0)}%）`}
            description="请核对识别结果后保存"
            style={{ marginBottom: 16 }}
            closable
            onClose={() => setAiResult(null)}
            showIcon
          />
        )}

        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="证照类型"
                name="license_type"
                rules={[{ required: true, message: '请选择证照类型' }]}
              >
                <Select
                  showSearch
                  placeholder="支持模糊搜索"
                  optionFilterProp="label"
                  options={LICENSE_TYPES.map(t => ({
                    value: t.code,
                    label: t.name,
                    disabled: !t.enabled,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="门店/专柜"
                name="store_id"
                extra="留空表示全供应商通用"
              >
                <Select allowClear placeholder="选择门店">
                  <Option value="store_001">门店 001 - 北京旗舰店</Option>
                  <Option value="store_002">门店 002 - 上海分店</Option>
                  <Option value="store_003">门店 003 - 广州分店</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="证照名称"
            name="license_name"
            rules={[{ required: true, message: '请输入证照名称' }]}
          >
            <Input placeholder="如：营业执照" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="证照编号"
                name="license_no"
              >
                <Input placeholder="统一社会信用代码等" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="颁发机构"
                name="issuing_authority"
              >
                <Input placeholder="如：北京市市场监督管理局" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="有效期类型" name="is_permanent">
            <Radio.Group onChange={e => setIsPermanent(e.target.value)}>
              <Radio value={false}>固定有效期</Radio>
              <Radio value={true}>长期有效</Radio>
            </Radio.Group>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="生效日期"
                name="issue_date"
                rules={[{ required: true, message: '请选择生效日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              {!isPermanent && (
                <Form.Item
                  label="到期日期"
                  name="expire_date"
                  rules={[{ required: !isPermanent, message: '请选择到期日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default LicenseManagement
