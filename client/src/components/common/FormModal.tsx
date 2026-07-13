import React from 'react';
import { Modal, Form, Button, Space } from 'antd';

interface FormModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  width?: number;
  children: React.ReactNode;
  loading?: boolean;
  destroyOnClose?: boolean;
}

const FormModal: React.FC<FormModalProps> = ({
  title,
  open,
  onCancel,
  onSubmit,
  width = 600,
  children,
  loading = false,
  destroyOnClose = true
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={width}
      footer={
        <Space>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" onClick={handleOk} loading={loading}>
            确定
          </Button>
        </Space>
      }
      destroyOnClose={destroyOnClose}
    >
      <Form form={form} layout="vertical">
        {children}
      </Form>
    </Modal>
  );
};

export default FormModal;
