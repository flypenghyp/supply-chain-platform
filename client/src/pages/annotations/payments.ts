import { AnnotationConfig } from '../../components/ProductAnnotation'

export const paymentsAnnotations: AnnotationConfig = {
  pageName: '交款管理',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'payment-search', type: 'function', title: '交款查询', details: { functionName: '交款单检索' } },
    { id: 'anno-002', target: 'payment-table', type: 'data', title: '交款列表', details: { dataSource: '交款数据', fields: [{ name: 'paymentNo', type: 'string', description: '交款单号' }, { name: 'paymentAmount', type: 'number', description: '交款金额' }] } },
    { id: 'anno-003', target: 'create-payment-btn', type: 'interaction', title: '新建交款', details: { trigger: '创建交款单' } },
  ],
}
