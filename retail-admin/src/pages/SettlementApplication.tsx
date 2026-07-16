import { useState } from 'react'
import { Card, Tabs, message } from 'antd'
import RetailSelfOperatedPayable from './RetailSelfOperatedPayable'
import RetailLeaseCounterPayable from './RetailLeaseCounterPayable'
import ProductAnnotation from '../components/ProductAnnotation'
import { settlementApplicationAnnotations } from './annotations/settlement-application'

const SettlementApplication = () => {
  const [activeTab, setActiveTab] = useState('self')

  const tabItems = [
    {
      key: 'self',
      label: '自营应付登记',
      children: <RetailSelfOperatedPayable />,
    },
    {
      key: 'lease',
      label: '专柜应付登记',
      children: <RetailLeaseCounterPayable />,
    },
  ]

  return (
    <ProductAnnotation config={settlementApplicationAnnotations}>
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card>
        <Tabs
          data-annotation-id="tabs"
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="card"
        />
      </Card>
    </div>
    </ProductAnnotation>
  )
}

export default SettlementApplication
