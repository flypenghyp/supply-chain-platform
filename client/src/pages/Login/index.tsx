import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import './styles/index.scss'

interface LoginProps {
  onLoginSuccess: () => void
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate()
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipMessage, setTipMessage] = useState('')

  const handleShowTip = (message: string) => {
    setTipMessage(message)
    setShowTipModal(true)
  }

  return (
    <div className="login-page">
      {/* 背景装饰 */}
      <div className="login-page__bg-decoration">
        <div className="login-page__bg-decoration__circle login-page__bg-decoration__circle--1"></div>
        <div className="login-page__bg-decoration__circle login-page__bg-decoration__circle--2"></div>
        <div className="login-page__bg-decoration__circle login-page__bg-decoration__circle--3"></div>
        <div className="login-page__bg-decoration__line login-page__bg-decoration__line--1"></div>
        <div className="login-page__bg-decoration__line login-page__bg-decoration__line--2"></div>
      </div>

      {/* Logo 区域 */}
      <div className="login-page__logo">
        <div className="login-page__logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
              fill="#1677FF"
            />
          </svg>
        </div>
        <span className="login-page__logo-text">天虹智协</span>
      </div>

      {/* 登录卡片 */}
      <div className="login-page__card">
        <div className="login-page__card-header">
          <h1 className="login-page__card-title">欢迎登录</h1>
          <p className="login-page__card-subtitle">
            天虹零售商协同平台
          </p>
        </div>

        <LoginForm onLoginSuccess={onLoginSuccess} onShowTip={handleShowTip} />
      </div>

      {/* 温馨提示弹窗 */}
      <Modal
        title={null}
        open={showTipModal}
        footer={null}
        centered
        closable={false}
        width={400}
      >
        <div className="tip-modal-content">
          <div className="tip-modal-content-icon">
            <InfoCircleOutlined style={{ color: '#1677FF', fontSize: 48 }} />
          </div>
          <h3 className="tip-modal-content-title">温馨提示</h3>
          <p className="tip-modal-content-desc">{tipMessage}</p>
          <Button
            type="primary"
            block
            size="large"
            onClick={() => setShowTipModal(false)}
          >
            我知道了
          </Button>
        </div>
      </Modal>

      {/* 底部版权信息 */}
      <div className="login-page__footer">
        <span>© 2024 天虹智协 版权所有</span>
        <span className="login-page__footer-divider">|</span>
        <span>技术支持：天虹数字化团队</span>
      </div>
    </div>
  )
}

export default Login
