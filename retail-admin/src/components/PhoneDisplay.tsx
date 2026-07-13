import { useState } from 'react'
import { Tooltip } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

interface PhoneDisplayProps {
  phone: string
  mask?: boolean
  style?: React.CSSProperties
}

const PhoneDisplay: React.FC<PhoneDisplayProps> = ({
  phone,
  mask = true,
  style,
}) => {
  const [visible, setVisible] = useState(!mask)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setVisible(!visible)
  }

  if (!phone) {
    return <span style={style}>-</span>
  }

  const maskedPhone =
    phone.length === 11
      ? `${phone.substring(0, 3)}****${phone.substring(7)}`
      : phone

  const displayPhone = visible ? phone : maskedPhone

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', ...style }}>
      <span>{displayPhone}</span>
      <Tooltip title={visible ? '隐藏号码' : '显示号码'}>
        <span
          onClick={handleToggle}
          style={{
            marginLeft: 6,
            cursor: 'pointer',
            color: visible ? '#1890ff' : '#999',
            fontSize: 14,
          }}
        >
          {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </span>
      </Tooltip>
    </span>
  )
}

export default PhoneDisplay
