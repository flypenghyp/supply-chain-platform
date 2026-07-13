import React, { useState } from 'react';
import { Button } from 'antd';
import { CloseCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/index.scss';

interface ErrorPageProps {
  title?: string;
  description?: string;
  errorType?: 'network' | 'server' | 'business' | 'unknown';
  icon?: React.ReactNode;
  showErrorDetail?: boolean;
  errorDetail?: string;
  onRetry?: () => void;
  onBack?: () => void;
  buttons?: Array<{
    text: string;
    type?: 'primary' | 'default' | 'link';
    onClick?: () => void;
    href?: string;
  }>;
}

const ErrorPage: React.FC<ErrorPageProps> = (props) => {
  const {
    title = '操作失败',
    description = '操作未能完成，请稍后重试',
    errorType = 'unknown',
    icon,
    showErrorDetail = false,
    errorDetail,
    onRetry,
    onBack,
    buttons
  } = props;

  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(showErrorDetail);

  const getErrorIcon = () => {
    if (icon) return icon;

    switch (errorType) {
      case 'network':
        return <ExclamationCircleFilled />;
      case 'server':
        return <CloseCircleFilled />;
      case 'business':
        return <ExclamationCircleFilled />;
      default:
        return <CloseCircleFilled />;
    }
  };

  const handleButtonClick = (button: NonNullable<ErrorPageProps['buttons']>[0]) => {
    if (button.onClick) {
      button.onClick();
    } else if (button.href) {
      navigate(button.href);
    }
  };

  const defaultButtons = buttons || [];

  if (onRetry && !defaultButtons.find(b => b.text === '重试')) {
    defaultButtons.push({
      text: '重试',
      type: 'primary',
      onClick: onRetry
    });
  }

  if (onBack && !defaultButtons.find(b => b.text === '返回')) {
    defaultButtons.push({
      text: '返回',
      type: 'default',
      onClick: onBack || (() => navigate(-1))
    });
  }

  return (
    <div className="api-result-page">
      <div className="api-result-page__container">
        <div className={`api-result-page__icon api-result-page__icon--error`}>
          {getErrorIcon()}
        </div>

        <h2 className="api-result-page__title">{title}</h2>

        <p className="api-result-page__description">{description}</p>

        {errorDetail && (
          <div>
            <span
              className="api-result-page__error-detail-toggle"
              onClick={() => setShowDetail(!showDetail)}
            >
              {showDetail ? '收起错误详情' : '查看错误详情'}
            </span>

            {showDetail && (
              <div className="api-result-page__error-detail">
                {errorDetail}
              </div>
            )}
          </div>
        )}

        {defaultButtons.length > 0 && (
          <div className="api-result-page__actions">
            {defaultButtons.map((button, index) => (
              <Button
                key={index}
                type={button.type || 'default'}
                onClick={() => handleButtonClick(button)}
              >
                {button.text}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
