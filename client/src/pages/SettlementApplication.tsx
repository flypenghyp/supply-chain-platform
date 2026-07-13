import React, { useEffect, useState } from 'react';
import { Card, Tabs, message } from 'antd';
import SelfOperatedPayable from './SelfOperatedPayable';
import LeaseCounterPayable from './LeaseCounterPayable';

const SettlementApplication: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('self');
  const [supplierType, setSupplierType] = useState<'self' | 'lease'>('self');

  useEffect(() => {
    // 模拟获取当前供应商类型
    // 实际项目中应该从用户信息或 API 获取
    const currentSupplierType = localStorage.getItem('supplier_type') || 'self';
    setSupplierType(currentSupplierType as 'self' | 'lease');
    
    // 根据供应商类型设置默认 tab
    setActiveTab(currentSupplierType);
  }, []);

  const tabItems = [
    {
      key: 'self',
      label: '自营应付登记',
      children: <SelfOperatedPayable />,
    },
    {
      key: 'lease',
      label: '专柜应付登记',
      children: <LeaseCounterPayable />,
    },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card style={{ marginBottom: '16px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="card"
        />
      </Card>
    </div>
  );
};

export default SettlementApplication;
