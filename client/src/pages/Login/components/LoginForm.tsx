import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Alert, Typography } from 'antd'
import { MobileOutlined } from '@ant-design/icons'
import { message } from 'antd'
import axios from 'axios'
import services from '../services'

const { Text } = Typography

interface LoginFormProps {
  onLoginSuccess: () => void
  onShowTip: (message: string) => void
}

// 演示用：预设的模拟账号列表
const DEMO_ACCOUNTS = [
  '13800138001',
  '13800138002',
  '13800138003',
  '13900139001',
  '13900139002',
]

// 演示模式开关（生产环境请设为 false）
const DEMO_MODE = true

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onShowTip }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // 演示模式登录
  const handleDemoLogin = (phone: string) => {
    setLoading(true)

    // 模拟网络延迟
    setTimeout(() => {
      const token = `demo_token_${Date.now()}`
      const userInfo = {
        phone,
        name: '演示用户',
        role: 'supplier',
        loginTime: new Date().toISOString(),
        supplier_roles: [
          {
            supplier_code: 'NFS001',
            supplier_name: '农夫山泉股份有限公司',
            roles: ['admin'],
            role_names: ['超管'],
          },
        ],
      }

      localStorage.setItem('supplier_token', token)
      localStorage.setItem('supplier_phone', phone)
      localStorage.setItem('supplier_userInfo', JSON.stringify(userInfo))

      setLoading(false)
      message.success('登录成功（演示模式）')
      onLoginSuccess()
    }, 800)
  }

  const handleGetSmsCode = async () => {
    try {
      const phoneValue = form.getFieldValue('phone')
      if (!phoneValue) {
        form.validateFields(['phone'])
        return
      }

      // 演示模式：直接显示成功提示，不调用接口
      if (DEMO_MODE) {
        form.validateFields(['phone']).then(() => {
          message.success(`验证码已发送至 ${phoneValue}（演示模式）`)
          setCountdown(60)
        })
        return
      }

      // 正式环境：调用后端接口
      form.validateFields(['phone']).then(async () => {
        const response = await axios.post(services.sendSmsCode, {
          phone: phoneValue,
        })

        if (response.data.code === 200) {
          message.success('验证码已发送')
          setCountdown(60)
        } else {
          message.error(response.data.message || '发送失败')
        }
      })
    } catch (error) {
      message.error('网络错误，请重试')
    }
  }

  const handleLogin = async (values: { phone: string; captcha: string }) => {
    setLoading(true)
    setErrorMsg('')

    try {
      // 演示模式：本地校验
      if (DEMO_MODE) {
        // 校验手机号格式
        const phoneRegex = /^1[3-9]\d{9}$/
        if (!phoneRegex.test(values.phone)) {
          setErrorMsg('请输入正确的11位手机号')
          message.error('请输入正确的11位手机号')
          setLoading(false)
          return
        }

        // 校验验证码长度（演示模式：任意6位数字即可）
        if (!values.captcha || values.captcha.length !== 6) {
          setErrorMsg('请输入6位验证码')
          message.error('请输入6位验证码')
          setLoading(false)
          return
        }

        // 检查是否是模拟账号（可选提示）
        if (!DEMO_ACCOUNTS.includes(values.phone)) {
          onShowTip(
            `该手机号 ${values.phone} 未在系统中注册。演示模式下仍可登录体验，正式环境请联系管理员开通权限。`
          )
        }

        // 执行演示登录
        handleDemoLogin(values.phone)
        return
      }

      // 正式环境：调用后端接口
      const response = await axios.post(services.loginBySms, {
        phone: values.phone,
        code: values.captcha,
      })

      if (response.data.code === 200) {
        const { token, userInfo } = response.data.data

        localStorage.setItem('supplier_token', token)
        localStorage.setItem('supplier_phone', values.phone)
        if (userInfo) {
          localStorage.setItem('supplier_userInfo', JSON.stringify(userInfo))
        }

        message.success('登录成功')
        onLoginSuccess()
      } else {
        const errorMsg =
          response.data.message || '手机号或验证码错误，请重新输入'
        setErrorMsg(errorMsg)
        message.error(errorMsg)

        if (response.data.code === 403) {
          onShowTip('您的账号尚未激活，请联系管理员开通权限')
        }
      }
    } catch (error) {
      setErrorMsg('网络错误，请重试')
      message.error('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {errorMsg && (
        <Alert
          message={errorMsg}
          type="error"
          showIcon
          closable
          onClose={() => setErrorMsg('')}
          className="login-error-alert"
        />
      )}

      <Form
        form={form}
        onFinish={handleLogin}
        layout="vertical"
        size="large"
        autoComplete="off"
      >
        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入正确的11位手机号',
            },
          ]}
        >
          <Input
            placeholder="请输入11位手机号"
            maxLength={11}
            prefix={<MobileOutlined style={{ color: '#bfbfbf' }} />}
          />
        </Form.Item>

        <Form.Item
          name="captcha"
          label="验证码"
          rules={[{ required: true, message: '请输入验证码' }]}
        >
          <div className="login-page__captcha-wrapper">
            <Input
              placeholder="请输入验证码"
              maxLength={6}
              className="captcha-input"
            />
            <Button
              type="link"
              className="get-captcha-btn"
              disabled={countdown > 0}
              onClick={handleGetSmsCode}
            >
              {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
            </Button>
          </div>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="login-page__submit-btn"
          >
            登录
          </Button>
        </Form.Item>

        {/* 演示模式提示 */}
        {DEMO_MODE && (
          <div style={{
            marginTop: 16,
            padding: 12,
            background: '#f6ffed',
            borderRadius: 4,
            border: '1px solid #b7eb8f',
          }}>
            <Text strong style={{ color: '#52c41a', fontSize: 12 }}>💡 演示模式</Text>
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                输入手机号 + 任意6位数字验证码即可登录
              </Text>
            </div>
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                推荐使用：
              </Text>
              {DEMO_ACCOUNTS.slice(0, 3).map((account) => (
                <Text
                  key={account}
                  copyable={{ text: account }}
                  style={{ fontSize: 12, color: '#1677ff', marginLeft: 8 }}
                >
                  {account}
                </Text>
              ))}
            </div>
          </div>
        )}
      </Form>
    </div>
  )
}

export default LoginForm
