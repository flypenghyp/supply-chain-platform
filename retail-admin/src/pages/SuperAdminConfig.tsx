import React, { useState, useEffect } from 'react'
import {
  Card, Form, Input, Button, message, Modal, Space, Tag, Alert,
  Steps, Row, Col, Statistic, Descriptions,
} from 'antd'
import {
  UserOutlined, MobileOutlined, SafetyOutlined, CheckCircleOutlined,
  SwapOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons'
import { usePermission } from '@/contexts/PermissionContext'

const { confirm } = Modal

const SuperAdminConfig: React.FC = () => {
  const { isAdmin, user } = usePermission()

  // 当前超管
  const [currentAdmin, setCurrentAdmin] = useState<any>(null)
  // 配置新超管表单
  const [configForm] = Form.useForm()
  // 验证码倒计时
  const [countdown, setCountdown] = useState(0)
  // 当前步骤：0=未配置/未转让；1=已发送验证码；2=已验证
  const [step, setStep] = useState(0)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)

  // 加载当前超管
  useEffect(() => {
    if (user) {
      setCurrentAdmin({
        id: user.id,
        name: user.name,
        phone: user.phone,
        role_name: '超管',
        appointed_at: '2026-01-01 10:00:00',
      })
      // 如果当前用户是超管，step=0 表示可操作
      setStep(isAdmin ? 0 : 0)
    }
  }, [user, isAdmin])

  // 发送验证码
  const handleSendCode = async () => {
    try {
      const values = await configForm.validateFields(['new_phone', 'new_name'])
      const phone = values.new_phone
      // 校验：与当前超管不同
      if (currentAdmin && currentAdmin.phone === phone) {
        message.error('新手机号不能与当前超管手机号相同')
        return
      }
      // 模拟发送
      message.success('验证码已发送（演示：123456）')
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) { clearInterval(timer); return 0 }
          return c - 1
        })
      }, 1000)
      setStep(1)
    } catch (e) {}
  }

  // 验证
  const handleVerify = async () => {
    try {
      const values = await configForm.validateFields(['verify_code'])
      if (values.verify_code !== '123456') {
        message.error('验证码错误（演示码：123456）')
        return
      }
      setVerified(true)
      setStep(2)
      message.success('验证成功')
    } catch (e) {}
  }

  // 确认更换/配置
  const handleConfirm = () => {
    confirm({
      title: '确认更换超管？',
      icon: <ExclamationCircleOutlined />,
      content: '更换后您将失去超管权限，请谨慎操作',
      okText: '确认更换',
      okType: 'danger',
      onOk: () => {
        const values = configForm.getFieldsValue()
        message.success('超管配置成功')
        setCurrentAdmin({
          id: 'new_' + Date.now(),
          name: values.new_name,
          phone: values.new_phone,
          role_name: '超管',
          appointed_at: new Date().toLocaleString(),
        })
        setStep(0)
        setVerified(false)
        configForm.resetFields()
      },
    })
  }

  // 脱敏手机号
  const maskPhone = (p: string) => p?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        <Col span={10}>
          <Card title={<Space><UserOutlined />当前超管信息</Space>}>
            {currentAdmin ? (
              <Descriptions column={1} size="small">
                <Descriptions.Item label="姓名">
                  <Space><UserOutlined />{currentAdmin.name}</Space>
                </Descriptions.Item>
                <Descriptions.Item label="手机号">
                  <Space><MobileOutlined />{maskPhone(currentAdmin.phone)}</Space>
                </Descriptions.Item>
                <Descriptions.Item label="角色">
                  <Tag color="red">{currentAdmin.role_name}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="任命时间">
                  {currentAdmin.appointed_at}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Alert
                type="warning"
                message="该供应商尚未配置超管"
                description="请在右侧配置首位超管"
                showIcon
              />
            )}
          </Card>

          <Card title="操作日志" style={{ marginTop: 16 }} size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ fontSize: 13 }}>
                <Tag color="blue">2026-07-10 14:30</Tag>
                <span>张经理 → 王经理（转让）</span>
              </div>
              <div style={{ fontSize: 13 }}>
                <Tag color="blue">2026-05-01 09:00</Tag>
                <span>初始化超管（张经理）</span>
              </div>
            </Space>
          </Card>
        </Col>

        <Col span={14}>
          <Card title={
            <Space>
              {currentAdmin ? <SwapOutlined /> : <SafetyOutlined />}
              {currentAdmin ? '更换超管' : '配置超管'}
            </Space>
          }>
            {!isAdmin && currentAdmin && (
              <Alert
                type="error"
                message="仅超管可操作此功能"
                style={{ marginBottom: 16 }}
                showIcon
              />
            )}

            <Steps
              current={step}
              size="small"
              style={{ marginBottom: 24 }}
              items={[
                { title: '填写信息' },
                { title: '验证码' },
                { title: '完成' },
              ]}
            />

            <Form form={configForm} layout="vertical" disabled={!isAdmin}>
              <Form.Item
                label="新超管姓名"
                name="new_name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="新超管的真实姓名" />
              </Form.Item>
              <Form.Item
                label="新超管手机号"
                name="new_phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' },
                ]}
              >
                <Input placeholder="11 位手机号" maxLength={11} />
              </Form.Item>
              <Form.Item
                label="邮箱"
                name="new_email"
                rules={[{ type: 'email', message: '邮箱格式错误' }]}
              >
                <Input placeholder="可选" />
              </Form.Item>

              <Form.Item
                label="短信验证码"
                name="verify_code"
                rules={[{ required: true, message: '请输入验证码' }]}
                extra={step === 0 ? '请先点击右侧按钮发送验证码' : '演示验证码：123456'}
              >
                <Input
                  placeholder="6 位验证码"
                  maxLength={6}
                  addonAfter={
                    <Button
                      type="link"
                      onClick={handleSendCode}
                      disabled={countdown > 0}
                      style={{ padding: 0 }}
                    >
                      {countdown > 0 ? `${countdown}s 后重试` : '发送验证码'}
                    </Button>
                  }
                />
              </Form.Item>

              <Form.Item label="转让原因" name="reason">
                <Input.TextArea rows={2} placeholder="例如：原超管离职 / 权限交接" />
              </Form.Item>

              <Space>
                {step < 2 && (
                  <Button type="primary" onClick={handleVerify} disabled={!isAdmin}>
                    验证并完成
                  </Button>
                )}
                {step === 2 && (
                  <Button type="primary" danger onClick={handleConfirm} disabled={!isAdmin}>
                    确认{currentAdmin ? '更换' : '配置'}超管
                  </Button>
                )}
                {step > 0 && (
                  <Button onClick={() => { setStep(0); setVerified(false) }}>
                    重置
                  </Button>
                )}
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SuperAdminConfig
