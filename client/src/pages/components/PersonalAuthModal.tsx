import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Alert,
  message,
  Steps
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import axios from 'axios';

interface PersonalAuthModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const PersonalAuthModal: React.FC<PersonalAuthModalProps> = ({
  visible,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (visible) {
      const userInfo = JSON.parse(localStorage.getItem('supplier_userInfo') || '{}');
      form.setFieldsValue({
        real_name: userInfo.name || '',
        phone: userInfo.phone || '',
        id_card: '',
      });
    }
  }, [visible, form]);

  const validateIdCard = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('请输入身份证号');
    }

    const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
    if (!idCardRegex.test(value)) {
      return Promise.reject('请输入正确的18位身份证号');
    }

    return Promise.resolve();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // 获取当前用户ID（从localStorage或其他地方）
      const userInfo = JSON.parse(localStorage.getItem('supplier_userInfo') || '{}');
      const userId = userInfo.id || userInfo.username;

      if (!userId) {
        message.error('无法获取用户信息，请重新登录');
        return;
      }

      const res = await axios.post('/api/supplier/esign/verify', {
        user_id: userId,
        real_name: values.real_name,
        phone: values.phone,
        id_card: values.id_card
      });

      if (res.data.code === 200) {
        message.success('个人认证成功');
        setCurrentStep(1); // 进入成功步骤

        // 2秒后关闭弹窗
        setTimeout(() => {
          form.resetFields();
          setCurrentStep(0);
          onSuccess();
        }, 2000);
      } else {
        message.error(res.data.message || '认证失败，请重试');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      }
      // 表单验证失败时不显示错误信息
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setCurrentStep(0);
    onCancel();
  };

  return (
    <Modal
      title="个人认证"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      maskClosable={false}
    >
      <Steps current={currentStep} size="small" style={{ marginBottom: 24 }}>
        <Steps.Step title="填写信息" />
        <Steps.Step title="认证成功" />
      </Steps>

      {currentStep === 0 && (
        <>
          <Alert
            message="认证说明"
            description={
              <div>
                <p>个人认证需要提供以下信息：</p>
                <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                  <li>真实姓名（需与身份证一致）</li>
                  <li>手机号（用于接收验证信息）</li>
                  <li>身份证号（用于身份验证）</li>
                </ul>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="real_name"
              label="真实姓名"
              rules={[
                { required: true, message: '请输入真实姓名' },
                { min: 2, message: '姓名至少2个字符' },
                { max: 20, message: '姓名最多20个字符' }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="请输入真实姓名"
                maxLength={20}
                disabled
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
              ]}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="请输入手机号"
                maxLength={11}
              />
            </Form.Item>

            <Form.Item
              name="id_card"
              label="身份证号"
              rules={[
                { required: true, message: '请输入身份证号' },
                { validator: validateIdCard }
              ]}
            >
              <Input
                prefix={<IdcardOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="请输入18位身份证号"
                maxLength={18}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交认证
              </Button>
            </Form.Item>
          </Form>

          <Alert
            message="隐私保护声明"
            description="您的个人信息将严格保密，仅用于身份认证，不会用于其他用途。"
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        </>
      )}

      {currentStep === 1 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }}>✓</div>
          <h3>认证成功！</h3>
          <p style={{ color: '#999' }}>您已获得电签权限，可以执行相关业务操作</p>
        </div>
      )}
    </Modal>
  );
};

export default PersonalAuthModal;
