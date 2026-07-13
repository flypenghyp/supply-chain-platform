import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Alert,
  Card,
  Descriptions,
  message,
} from 'antd';
import './ChangeSuperAdminModal.scss';

interface ChangeSuperAdminModalProps {
  visible: boolean;
  supplier: any;
  currentAdmin: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const ChangeSuperAdminModal: React.FC<ChangeSuperAdminModalProps> = ({
  visible,
  supplier,
  currentAdmin,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      Modal.confirm({
        title: '确认修改超管',
        content: (
          <div>
            <p>确定要将超管从 <strong>{currentAdmin?.name}</strong> 修改为 <strong>{values.new_name}</strong>（{values.new_phone}）吗？</p>
            <p style={{ color: '#ff4d4f', marginTop: 8 }}>
              ⚠️ 修改后，原超管将变为普通用户
            </p>
          </div>
        ),
        okText: '确认修改',
        cancelText: '取消',
        okType: 'danger',
        onOk: async () => {
          setSubmitting(true);
          try {
            // 模拟接口调用
            await new Promise(resolve => setTimeout(resolve, 800));
            message.success('超管修改成功');
            form.resetFields();
            onSuccess();
          } catch {
            message.error('修改失败，请重试');
          } finally {
            setSubmitting(false);
          }
        }
      });
    }).catch(() => {});
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={`修改超管 - ${supplier?.name} (${supplier?.code})`}
      open={visible}
      onCancel={handleCancel}
      width={600}
      className="change-super-admin-modal"
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={submitting}
          onClick={handleSubmit}
        >
          确认修改
        </Button>
      ]}
    >
      <Alert
        message="修改超管说明"
        description={
          <div>
            <p>修改超管后，原超管将变为普通用户，新超管将获得所有权限。</p>
            <p style={{ marginBottom: 0 }}>请填写新超管的信息后直接提交。</p>
          </div>
        }
        type="warning"
        showIcon
        className="change-super-admin-modal__warning-alert"
      />

      <Card title="当前超管信息" size="small" className="change-super-admin-modal__admin-info-card">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="姓名">
            {currentAdmin?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="手机号">
            {currentAdmin?.phone ? currentAdmin.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="状态" span={2}>
            {currentAdmin?.status === 'active' ? '正常' : '异常'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          new_phone: '',
          new_name: '',
          new_email: ''
        }}
      >
        <Form.Item
          name="new_phone"
          label="新超管手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
          ]}
        >
          <Input
            placeholder="请输入新超管手机号"
            maxLength={11}
          />
        </Form.Item>

        <Form.Item
          name="new_name"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder="请输入新超管姓名" maxLength={20} />
        </Form.Item>

        <Form.Item
          name="new_email"
          label="邮箱"
          rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
        >
          <Input placeholder="请输入新超管邮箱（选填）" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangeSuperAdminModal;
