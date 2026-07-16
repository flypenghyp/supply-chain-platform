import React, { useState, useEffect } from 'react'
import {
  Modal, Tabs, Button, Form, Input, Upload, message, Tag, Space, Empty,
  Card, Row, Col, Descriptions, Statistic, Alert,
} from 'antd'
import { UploadOutlined, CheckOutlined, CloseOutlined, FilePdfOutlined } from '@ant-design/icons'
import type { Authorization } from '@/types/phase1'
import { usePermission } from '@/contexts/PermissionContext'

interface Props {
  open: boolean
  userId: string
  userName: string
  onClose: () => void
}

const { TextArea } = Input

const AuthorizationLetterModal: React.FC<Props> = ({ open, userId, userName, onClose }) => {
  const { isAdmin } = usePermission()
  const [list, setList] = useState<Authorization[]>([])
  const [active, setActive] = useState<Authorization | null>(null)
  const [rejecting, setRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitForm] = Form.useForm()

  // Mock - 加载当前用户的授权书
  useEffect(() => {
    if (!open) return
    setList([
      {
        id: '1', supplier_code: 'NFS001', submitter_user_id: userId, submitter_name: userName,
        submitter_phone: '13800138000', file_url: '/mock/auth_001.pdf', file_type: 'pdf',
        auth_no: 'AUTH2026001', authorizer_name: 'A 有限公司', authorizee_name: userName,
        status: 'pending', created_at: '2026-07-15 10:23:12', updated_at: '2026-07-15 10:23:12',
      },
      {
        id: '2', supplier_code: 'NFS001', submitter_user_id: userId, submitter_name: userName,
        submitter_phone: '13800138000', file_url: '/mock/auth_002.pdf', file_type: 'pdf',
        auth_no: 'AUTH2026002', authorizer_name: 'A 有限公司', authorizee_name: userName,
        status: 'approved', reviewer_name: '系统管理员', review_time: '2026-07-10 14:30:00',
        created_at: '2026-07-10 10:23:12', updated_at: '2026-07-10 14:30:00',
      },
      {
        id: '3', supplier_code: 'NFS001', submitter_user_id: userId, submitter_name: userName,
        submitter_phone: '13800138000', file_url: '/mock/auth_003.pdf', file_type: 'pdf',
        auth_no: 'AUTH2026003', authorizer_name: 'A 有限公司', authorizee_name: userName,
        status: 'rejected', reject_reason: '授权书印章不清晰，请重新上传',
        reviewer_name: '系统管理员', review_time: '2026-07-08 16:42:00',
        created_at: '2026-07-08 10:23:12', updated_at: '2026-07-08 16:42:00',
      },
    ])
  }, [open, userId, userName])

  const handleApprove = () => {
    if (!active) return
    message.success('已通过审核')
    setActive({ ...active, status: 'approved', reviewer_name: '当前用户', review_time: new Date().toLocaleString() })
  }

  const handleReject = () => {
    if (!active) return
    if (!rejectReason.trim()) {
      message.error('驳回原因必填')
      return
    }
    message.success('已驳回')
    setActive({ ...active, status: 'rejected', reject_reason: rejectReason, reviewer_name: '当前用户', review_time: new Date().toLocaleString() })
    setRejecting(false)
    setRejectReason('')
  }

  const handleSubmit = async () => {
    try {
      const values = await submitForm.validateFields()
      message.success('授权委托书已提交，请等待审核')
      submitForm.resetFields()
      setUploading(false)
    } catch (e) {}
  }

  const statusMap: any = {
    pending: { color: 'processing', text: '待审核' },
    approved: { color: 'success', text: '已通过' },
    rejected: { color: 'error', text: '已驳回' },
  }

  return (
    <Modal
      title={`授权委托书管理 - ${userName}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose
    >
      <Tabs
        defaultActiveKey="list"
        items={[
          {
            key: 'list',
            label: '授权书列表',
            children: (
              <Row gutter={16}>
                <Col span={10}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {list.length === 0 ? (
                      <Empty description="暂无授权委托书" />
                    ) : (
                      list.map(item => (
                        <Card
                          key={item.id}
                          size="small"
                          hoverable
                          onClick={() => setActive(item)}
                          style={{ borderColor: active?.id === item.id ? '#1890ff' : undefined }}
                        >
                          <Space>
                            <FilePdfOutlined style={{ color: '#f5222d', fontSize: 18 }} />
                            <div>
                              <div style={{ fontWeight: 500 }}>{item.auth_no}</div>
                              <div style={{ fontSize: 12, color: '#999' }}>
                                {item.created_at} · {item.authorizer_name} → {item.authorizee_name}
                              </div>
                            </div>
                            <Tag color={statusMap[item.status]?.color}>{statusMap[item.status]?.text}</Tag>
                          </Space>
                        </Card>
                      ))
                    )}
                  </Space>
                </Col>
                <Col span={14}>
                  {active ? (
                    <Card
                      title={
                        <Space>
                          <span>{active.auth_no}</span>
                          <Tag color={statusMap[active.status]?.color}>{statusMap[active.status]?.text}</Tag>
                        </Space>
                      }
                      extra={
                        isAdmin && active.status === 'pending' && !rejecting && (
                          <Space>
                            <Button
                              type="primary"
                              icon={<CheckOutlined />}
                              onClick={handleApprove}
                            >
                              通过
                            </Button>
                            <Button
                              danger
                              icon={<CloseOutlined />}
                              onClick={() => setRejecting(true)}
                            >
                              驳回
                            </Button>
                          </Space>
                        )
                      }
                    >
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="授权人">{active.authorizer_name}</Descriptions.Item>
                        <Descriptions.Item label="被授权人">{active.authorizee_name}</Descriptions.Item>
                        <Descriptions.Item label="授权书编号">{active.auth_no}</Descriptions.Item>
                        <Descriptions.Item label="提交时间">{active.created_at}</Descriptions.Item>
                        {active.reviewer_name && (
                          <Descriptions.Item label="审核人">{active.reviewer_name}</Descriptions.Item>
                        )}
                        {active.review_time && (
                          <Descriptions.Item label="审核时间">{active.review_time}</Descriptions.Item>
                        )}
                        {active.reject_reason && (
                          <Descriptions.Item label="驳回原因">
                            <Alert type="error" message={active.reject_reason} />
                          </Descriptions.Item>
                        )}
                      </Descriptions>

                      <div style={{ marginTop: 16, padding: 16, background: '#fafafa', textAlign: 'center' }}>
                        <FilePdfOutlined style={{ fontSize: 48, color: '#f5222d' }} />
                        <div style={{ marginTop: 8 }}>PDF 预览区域</div>
                        <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                          {active.file_url}
                        </div>
                      </div>

                      {rejecting && (
                        <div style={{ marginTop: 16 }}>
                          <Alert type="warning" message="驳回原因必填" style={{ marginBottom: 8 }} />
                          <TextArea
                            rows={3}
                            placeholder="请说明驳回原因（必填）"
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                          />
                          <Space style={{ marginTop: 8 }}>
                            <Button type="primary" danger onClick={handleReject}>确认驳回</Button>
                            <Button onClick={() => { setRejecting(false); setRejectReason('') }}>取消</Button>
                          </Space>
                        </div>
                      )}
                    </Card>
                  ) : (
                    <Empty description="请选择左侧授权委托书查看详情" />
                  )}
                </Col>
              </Row>
            ),
          },
          {
            key: 'submit',
            label: '提交新授权书',
            children: (
              <Card>
                <Form form={submitForm} layout="vertical">
                  <Form.Item
                    label="授权方"
                    name="authorizer_name"
                    rules={[{ required: true, message: '请输入授权方' }]}
                  >
                    <Input placeholder="如：A 有限公司" />
                  </Form.Item>
                  <Form.Item
                    label="被授权方"
                    name="authorizee_name"
                    initialValue={userName}
                    rules={[{ required: true }]}
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    label="授权书编号"
                    name="auth_no"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="如：AUTH2026004" />
                  </Form.Item>
                  <Form.Item
                    label="上传授权书（PDF/图片）"
                    name="file"
                    rules={[{ required: true, message: '请上传文件' }]}
                  >
                    <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.jpeg,.png">
                      <Button icon={<UploadOutlined />}>选择文件</Button>
                    </Upload>
                  </Form.Item>
                  <Button type="primary" onClick={handleSubmit}>提交审核</Button>
                </Form>
              </Card>
            ),
          },
        ]}
      />
    </Modal>
  )
}

export default AuthorizationLetterModal
