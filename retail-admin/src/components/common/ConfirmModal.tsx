import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmModalProps {
  title?: string;
  content: string | React.ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  open?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title = '确认操作',
  content,
  okText = '确定',
  cancelText = '取消',
  onOk,
  onCancel,
  icon = <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 24 }} />,
  danger = false,
  open = true
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger }}
      icon={icon}
      width={278}
    >
      {content}
    </Modal>
  );
};

export default ConfirmModal;
