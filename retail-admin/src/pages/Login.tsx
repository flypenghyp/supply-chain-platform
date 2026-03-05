import { useState } from 'react'
import { Form, Input, Button, Card, message, Space, Typography } from 'antd'
import { ShopOutlined, UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { login } from '@/services/auth'
import { usePermission } from '@/contexts/PermissionContext'

const { Title, Text } = Typography

interface LoginProps {
  onLoginSuccess: () => void
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setPermission } = usePermission()

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const permission = await login(values.username, values.password)
      localStorage.setItem('token', permission.token)
      localStorage.setItem('userPermission', JSON.stringify(permission))
      setPermission(permission)
      message.success('登录成功')
      onLoginSuccess()
      navigate('/')
    } catch (error) {
      message.error('登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <Space direction="vertical" align="center" style={{ width: '100%', marginBottom: 24 }}>
          <ShopOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          <Title level={3} style={{ margin: 0 }}>零售商后台管理系统</Title>
          <Text type="secondary">按品类维度的供应商管理平台</Text>
        </Space>

        <Form onFinish={handleSubmit} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ 
          padding: 12, 
          background: '#f6ffed', 
          borderRadius: 4,
          fontSize: 12
        }}>
          <Text strong>测试账号：</Text>
          <div>管理员：admin / admin123</div>
          <div>品类经理：manager / manager123</div>
        </div>
      </Card>
    </div>
  )
}

export default Login
