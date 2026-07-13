import React from 'react';
import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface ActionButtonProps {
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  size?: 'small' | 'middle' | 'large';
  danger?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  type = 'primary',
  size = 'middle',
  danger = false,
  icon,
  children,
  onClick,
  loading = false,
  disabled = false,
  block = false
}) => {
  return (
    <Button
      type={type}
      size={size}
      danger={danger}
      icon={icon}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      block={block}
      style={{ height: size === 'small' ? 24 : size === 'large' ? 40 : 32 }}
    >
      {children}
    </Button>
  );
};

export const PrimaryButton: React.FC<Omit<ActionButtonProps, 'type'>> = (props) => (
  <ActionButton type="primary" {...props} />
);

export const DefaultButton: React.FC<Omit<ActionButtonProps, 'type'>> = (props) => (
  <ActionButton type="default" {...props} />
);

export const DangerButton: React.FC<Omit<ActionButtonProps, 'type' | 'danger'>> = (props) => (
  <ActionButton type="primary" danger {...props} />
);

export const AddButton: React.FC<{ onClick?: () => void; children?: React.ReactNode }> = ({ onClick, children }) => (
  <ActionButton type="primary" icon={<PlusOutlined />} onClick={onClick}>
    {children || '新增'}
  </ActionButton>
);

export default ActionButton;
