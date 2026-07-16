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
  message,
  Descriptions,
  Drawer,
} from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons'
import ProductAnnotation from '../components/ProductAnnotation'
import { esignAuthorizationApprovalAnnotations } from './annotations/esign-authorization-approval'

interface AuthorizationRecord {
  id: string
  supplier_code: string
  supplier_name: string
  submitter: string
  submit_time: string
  status: 'pending' | 'approved' | 'rejected'
  reject_reason?: string
  auth_no?: string
  expire_time?: string
  reviewer?: string
  review_time?: string
}

const EsignAuthorizationApproval = () => {
  const [records, setRecords] = useState<AuthorizationRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<AuthorizationRecord | null>(null)
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [rejectingRecord, setRejectingRecord] = useState<AuthorizationRecord | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [form] = Form.useForm()

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = () => {
    setLoading(true)
    const mockRecords: AuthorizationRecord[] = [
      {
        id: '1',
        supplier_code: 'NFS001',
        supplier_name: '农夫山泉股份有限公司',
        submitter: '张经理',
        submit_time: '2024-07-01 10:00:00',
        status: 'pending',
      },
      {
        id: '2',
        supplier_code: '303300',
        supplier_name: '好利来食品有限公司',
        submitter: '李助理',
        submit_time: '2024-06-28 14:30:00',
        status: 'approved',
        auth_no: 'AUTH20240628001',
        expire_time: '2025-06-27 23:59:59',
        reviewer: '零售审核员',
        review_time: '2024-06-29 09:15:00',
      },
      {
        id: '3',
        supplier_code: '592000222',
        supplier_name: '厦门商贸集团有限公司',
        submitter: '王经理',
        submit_time: '2024-06-25 11:20:00',
        status: 'rejected',
        reject_reason: '授权书盖章不清晰，请重新上传',
        reviewer: '零售审核员',
        review_time: '2024-06-26 10:00:00',
      },
    ]
    setRecords(mockRecords)
    setLoading(false)
  }

  const handleApprove = (record: AuthorizationRecord) => {
    const authNo = `AUTH${Date.now()}`
    const expireTime = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 23:59:59'
    setRecords(prev => prev.map(item => {
      if (item.id === record.id) {
        return {
          ...item,
          status: 'approved',
          auth_no: authNo,
          expire_time: expireTime,
          reviewer: '当前审核人',
          review_time: new Date().toLocaleString(),
        }
      }
      return item
    }))
    message.success('授权委托书已通过')
  }

  const handleRejectClick = (record: AuthorizationRecord) => {
    setRejectingRecord(record)
    setRejectReason('')
    form.resetFields()
    setRejectModalVisible(true)
  }

  const handleRejectConfirm = () => {
    form.validateFields().then(values => {
      if (!rejectingRecord) return
      setRecords(prev => prev.map(item => {
        if (item.id === rejectingRecord.id) {
          return {
            ...item,
            status: 'rejected',
            reject_reason: values.rejectReason.trim(),
            reviewer: '当前审核人',
            review_time: new Date().toLocaleString(),
          }
        }
        return item
      }))
      setRejectModalVisible(false)
      message.success('授权委托书已驳回')
    })
  }

  const handleViewDetail = (record: AuthorizationRecord) => {
    setSelectedRecord(record)
    setDetailVisible(true)
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: '待审核', color: 'blue' },
    approved: { label: '已通过', color: 'green' },
    rejected: { label: '已驳回', color: 'red' },
  }

  const columns = [
    { title: '供应商编码', dataIndex: 'supplier_code', key: 'supplier_code', width: 120 },
    { title: '供应商名称', dataIndex: 'supplier_name', key: 'supplier_name', width: 200 },
    { title: '提交人', dataIndex: 'submitter', key: 'submitter', width: 100 },
    { title: '提交时间', dataIndex: 'submit_time', key: 'submit_time', width: 160 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusMap[status] || { label: status, color: 'default' }
        return <Tag color={config.color}>{config.label}</Tag>
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: AuthorizationRecord) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record)}>
                通过
              </Button>
              <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleRejectClick(record)}>
                驳回
              </Button>
            </>
          )}
          {record.status === 'rejected' && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record)}>
              重新通过
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <ProductAnnotation config={esignAuthorizationApprovalAnnotations}>
    <Card title="授权委托书审批">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={records}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title="驳回授权委托书"
        open={rejectModalVisible}
        onOk={handleRejectConfirm}
        onCancel={() => setRejectModalVisible(false)}
        okText="确认驳回"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="rejectReason"
            label="驳回原因"
            rules={[{ required: true, message: '请输入驳回原因' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入驳回原因"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="授权委托书详情"
        placement="right"
        width={560}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
      >
        {selectedRecord && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="供应商编码">{selectedRecord.supplier_code}</Descriptions.Item>
            <Descriptions.Item label="供应商名称">{selectedRecord.supplier_name}</Descriptions.Item>
            <Descriptions.Item label="提交人">{selectedRecord.submitter}</Descriptions.Item>
            <Descriptions.Item label="提交时间">{selectedRecord.submit_time}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[selectedRecord.status]?.color}>
                {statusMap[selectedRecord.status]?.label}
              </Tag>
            </Descriptions.Item>
            {selectedRecord.auth_no && (
              <Descriptions.Item label="授权编号">{selectedRecord.auth_no}</Descriptions.Item>
            )}
            {selectedRecord.expire_time && (
              <Descriptions.Item label="有效期至">{selectedRecord.expire_time}</Descriptions.Item>
            )}
            {selectedRecord.reject_reason && (
              <Descriptions.Item label="驳回原因">{selectedRecord.reject_reason}</Descriptions.Item>
            )}
            {selectedRecord.reviewer && (
              <Descriptions.Item label="审核人">{selectedRecord.reviewer}</Descriptions.Item>
            )}
            {selectedRecord.review_time && (
              <Descriptions.Item label="审核时间">{selectedRecord.review_time}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Drawer>
    </Card>
    </ProductAnnotation>
  )
}

export default EsignAuthorizationApproval
