import React from 'react';
import { Modal, Button, message } from 'antd';
import PersonalAuthModal from './PersonalAuthModal';

interface WithEsignPermissionProps {
  businessType: string;
}

const ESIGN_REQUIRED_BUSINESSES = [
  'settlement',
  'contract_sign',
  'invoice_entry',
  'early_settlement',
  'quality_violation',
  'promotion'
];

const BUSINESS_NAME_MAP: { [key: string]: string } = {
  'settlement': '结算业务',
  'contract_sign': '合同签署',
  'invoice_entry': '发票录入',
  'early_settlement': '提前结算',
  'quality_violation': '质量管理违约确认',
  'promotion': '促销协议签署'
};

const checkEsignPermission = (user: any): boolean => {
  if (!user || !user.esign_permission) {
    return false;
  }
  return user.esign_permission.enabled && user.esign_permission.verified;
};

function withEsignPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  businessType: string
): React.FC<P> {
  const WithEsignPermissionComponent: React.FC<P> = (props) => {
    const [authModalVisible, setAuthModalVisible] = React.useState(false);

    const handleClick = (e: React.MouseEvent) => {
      const userInfo = JSON.parse(localStorage.getItem('supplier_userInfo') || '{}');

      if (!checkEsignPermission(userInfo)) {
        e.preventDefault();
        e.stopPropagation();

        Modal.confirm({
          title: '权限提示',
          content: (
            <div>
              <p>您尚未完成个人认证，无法执行【{BUSINESS_NAME_MAP[businessType] || businessType}】操作。</p>
              <p style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
                个人认证需要提供：真实姓名、手机号、身份证号
              </p>
            </div>
          ),
          okText: '立即认证',
          cancelText: '取消',
          onOk: () => {
            setAuthModalVisible(true);
          }
        });

        return;
      }

      if ((props as any).onClick) {
        (props as any).onClick(e);
      }
    };

    return (
      <>
        <WrappedComponent {...props} onClick={handleClick} />

        <PersonalAuthModal
          visible={authModalVisible}
          onCancel={() => setAuthModalVisible(false)}
          onSuccess={() => {
            setAuthModalVisible(false);
            message.success('认证成功，请重新执行操作');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }}
        />
      </>
    );
  };

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithEsignPermissionComponent.displayName = `withEsignPermission(${displayName})`;

  return WithEsignPermissionComponent;
}

export default withEsignPermission;
export { checkEsignPermission, ESIGN_REQUIRED_BUSINESSES, BUSINESS_NAME_MAP };
