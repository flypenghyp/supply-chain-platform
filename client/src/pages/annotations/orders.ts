import { AnnotationConfig } from '../../components/ProductAnnotation'

export const ordersAnnotations: AnnotationConfig = {
  pageName: '订单管理',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'search-form', type: 'function', title: '搜索表单', details: { functionName: '订单查询' } },
    { id: 'anno-002', target: 'orders-table', type: 'data', title: '订单列表', details: { dataSource: '订单数据', fields: [{ name: 'orderNo', type: 'string', description: '订单编号' }, { name: 'orderStatus', type: 'string', description: '订单状态' }, { name: 'totalAmount', type: 'number', description: '订单金额' }] } },
    { id: 'anno-003', target: 'order-detail-btn', type: 'interaction', title: '订单详情', details: { trigger: '点击查看订单详情' } },
    { id: 'anno-004', target: 'confirm-receipt-btn', type: 'interaction', title: '确认订单', details: { trigger: '供应商确认订单' } },
  ],
}
