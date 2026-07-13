import React from 'react';
import { Empty, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

interface EmptyStateProps {
  type?: 'noData' | '404' | '403' | '500' | 'networkError';
  description?: string;
  actionText?: string;
  onAction?: () => void;
  image?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'noData',
  description,
  actionText,
  onAction,
  image
}) => {
  const getEmptyConfig = () => {
    if (image) {
      return { image, description: description || '暂无数据' };
    }

    switch (type) {
      case '404':
        return {
          image: 'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXobrRgLeYpYWEV.svg',
          description: description || '抱歉，您访问的页面不存在'
        };
      case '403':
        return {
          image: 'https://gw.alipayobjects.com/zos/rmsportal/RleuxrCBrqNbzgqXJPqr.svg',
          description: description || '抱歉，您没有访问该页面的权限'
        };
      case '500':
        return {
          image: 'https://gw.alipayobjects.com/zos/rmsportal/vAxPqfTmvWSkSMWRiXPDZ.svg',
          description: description || '抱歉，服务器出错了'
        };
      case 'networkError':
        return {
          image: <InboxOutlined style={{ fontSize: 64, color: '#999' }} />,
          description: description || '网络开小差，请检查网络后重试'
        };
      default:
        return {
          image: <InboxOutlined style={{ fontSize: 64, color: '#999' }} />,
          description: description || '暂无数据'
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <Empty
      image={config.image}
      description={config.description}
      style={{
        padding: '60px 0',
        background: '#fff'
      }}
    >
      {actionText && onAction && (
        <Button type="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Empty>
  );
};

export default EmptyState;
