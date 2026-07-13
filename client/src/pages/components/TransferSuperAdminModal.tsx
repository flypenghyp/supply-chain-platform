import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Alert,
  message,
  Select,
  Space,
  Tag
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

interface TransferSuperAdminModalProps {
  visible: boolean;
  userList: any[];
  currentUserId: string;
  onCancel: () => void;
  onSuccess: (targetUserId: string) => void;
}

const TransferSuperAdminModal: React.FC<TransferSuperAdminModalProps> = ({
  visible,
  userList,
  currentUserId,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // 过滤可选的用户列表：排除自己，只保留正常状态的非超管用户
  const availableUsers = userList.filter(user =>
    user.id !== currentUserId &&
    user.status === 'active' &&
    user.role !== 'admin'
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setSelectedUserId('');
      setCountdown(0);
    }
  }, [visible, form]);

  const handleSendCode = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/supplier/super-admin/transfer/send-code', {});

      if (res.data.code === 200) {
        message.success('验证码已发送到您的手机');
        setCountdown(60);
      } else {
        message.error(res.data.message || '发送失败');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '发送失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedUserId) {
      message.warning('请选择要转让给谁');
      return;
    }

    try {
      const values = await form.validateFields();
      setLoading(true);

      const targetUser = availableUsers.find(u => u.id === selectedUserId);

      Modal.confirm({
        title: '确认转让超管权限',
        content: (
          <div>
            <p>确定要将超管权限转让给 <strong>{targetUser?.name}</strong> 吗？</p>
            <p style={{ color: '#666', fontSize: 12 }}>
              手机号：{targetUser?.phone}
            </p>
            <Alert
              message="重要提示"
              description="转让超管后，原超管用户权限均取消，需要新超管登录后配置权限。"
              type="error"
              showIcon
              style={{ marginTop: 12 }}
            />
          </div>
        ),
        okText: '确认转让',
        cancelText: '取消',
        okType: 'danger',
        onOk: async () => {
          try {
            const res = await axios.post('/api/supplier/super-admin/transfer', {
              target_user_id: selectedUserId,
              verify_code: values.verify_code
            });

            if (res.data.code === 200) {
              message.success(`超管权限已转让给${targetUser?.name}，即将退出登录`);
              setTimeout(() => {
                onSuccess(selectedUserId);
              }, 1500);
            } else {
              message.error(res.data.message || '转让失败');
            }
          } catch (error: any) {
            message.error(error.response?.data?.message || '转让失败，请重试');
          }
        }
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedUserId('');
    setCountdown(0);
    onCancel();
  };

  return (
    <Modal
      title="转让超管权限"
      open={visible}
      onCancel={handleCancel}
      width={520}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger
          loading={loading}
          onClick={handleTransfer}
        >
          确认转让
        </Button>
      ]}
    >
      <Alert
        message="重要提示"
        description={
          <div>
            <p style={{ marginBottom: 0 }}>转让超管后，原超管用户权限均取消，需要新超管登录后配置权限。</p>
          </div>
        }
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{ verify_code: '' }}
      >
        <Form.Item
          label="选择接收人"
          required
          extra="请选择要将超管权限转让给哪位用户"
        >
          <Select
            placeholder="请选择要转让给谁"
            size="large"
            value={selectedUserId || undefined}
            onChange={(value) => setSelectedUserId(value)}
            notFoundContent={
              <span style={{ color: '#999' }}>暂无可转让的用户</span>
            }
          >
            {availableUsers.map(user => (
              <Option key={user.id} value={user.id}>
                <Space>
                  <UserOutlined />
                  <span>{user.name}</span>
                  <span style={{ color: '#999' }}>
                    ({user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')})
                  </span>
                  <Tag color="blue" style={{ marginLeft: 8 }}>{user.role_name}</Tag>
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedUserId && (
          <Alert
            message={`已选择：${availableUsers.find(u => u.id === selectedUserId)?.name}`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form.Item
          name="verify_code"
          label="验证码"
          rules={[{ required: true, message: '请输入验证码' }]}
          extra="验证码将发送到您当前登录账号的手机号"
        >
          <Input
            placeholder="请输入6位验证码"
            maxLength={6}
            addonAfter={
              <Button
                type="link"
                size="small"
                disabled={countdown > 0}
                loading={loading}
                onClick={handleSendCode}
                style={{ padding: 0 }}
              >
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </Button>
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransferSuperAdminModal;
