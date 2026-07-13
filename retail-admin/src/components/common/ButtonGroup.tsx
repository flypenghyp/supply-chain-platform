import React from 'react';
import { Button, Space } from 'antd';

interface ButtonGroupProps {
  onSave?: () => void;
  onCancel?: () => void;
  saveText?: string;
  cancelText?: string;
  saveLoading?: boolean;
  showCancel?: boolean;
  position?: 'left' | 'center' | 'right';
  saveDisabled?: boolean;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  onSave,
  onCancel,
  saveText = '保存',
  cancelText = '取消',
  saveLoading = false,
  showCancel = true,
  position = 'center',
  saveDisabled = false
}) => {
  const justifyMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end'
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: justifyMap[position],
        padding: '24px 0',
        borderTop: '1px solid #f0f0f0',
        marginTop: 24
      }}
    >
      <Space>
        <Button type="primary" onClick={onSave} loading={saveLoading} disabled={saveDisabled} style={{ height: 32 }}>
          {saveText}
        </Button>
        {showCancel && (
          <Button onClick={onCancel} style={{ height: 32 }}>
            {cancelText}
          </Button>
        )}
      </Space>
    </div>
  );
};

export default ButtonGroup;
