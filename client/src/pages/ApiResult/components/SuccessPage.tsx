import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/index.scss';

interface SuccessPageProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  showCountdown?: boolean;
  countdown?: number;
  redirectUrl?: string;
  buttons?: Array<{
    text: string;
    type?: 'primary' | 'default' | 'link';
    onClick?: () => void;
    href?: string;
  }>;
}

const SuccessPage: React.FC<SuccessPageProps> = (props) => {
  const {
    title = '操作成功',
    description = '您的操作已成功完成',
    icon,
    showCountdown = false,
    countdown = 5,
    redirectUrl = '/',
    buttons
  } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const [count, setCount] = useState(countdown);

  useEffect(() => {
    if (!showCountdown) return;

    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          navigate(redirectUrl);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showCountdown, countdown, redirectUrl, navigate]);

  const handleButtonClick = (button: NonNullable<SuccessPageProps['buttons']>[0]) => {
    if (button.onClick) {
      button.onClick();
    } else if (button.href) {
      navigate(button.href);
    }
  };

  return (
    <div className="api-result-page">
      <div className="api-result-page__container">
        <div className={`api-result-page__icon api-result-page__icon--success`}>
          {icon || <CheckCircleFilled />}
        </div>

        <h2 className="api-result-page__title">{title}</h2>

        <p className="api-result-page__description">{description}</p>

        {buttons && buttons.length > 0 && (
          <div className="api-result-page__actions">
            {buttons.map((button, index) => (
              <Button
                key={index}
                type={button.type || 'primary'}
                onClick={() => handleButtonClick(button)}
              >
                {button.text}
              </Button>
            ))}
          </div>
        )}

        {showCountdown && count > 0 && (
          <div className="api-result-page__countdown">
            {count} 秒后自动跳转...
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
