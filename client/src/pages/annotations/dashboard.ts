import { AnnotationConfig } from '../../components/ProductAnnotation'

export const dashboardAnnotations: AnnotationConfig = {
  pageName: '供应商工作台',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'welcome-card', type: 'data', title: '欢迎卡片', details: { dataSource: '当前供应商信息', fields: [{ name: 'supplierName', type: 'string', description: '供应商名称' }, { name: 'supplierCode', type: 'string', description: '供应商编码' }] } },
    { id: 'anno-002', target: 'stat-orders', type: 'data', title: '待处理订单', details: { dataSource: '订单状态统计', fields: [{ name: 'pendingCount', type: 'number', description: '待确认订单数' }] } },
    { id: 'anno-003', target: 'stat-shipments', type: 'data', title: '待发货数', details: { dataSource: '发货状态统计', fields: [{ name: 'toShipCount', type: 'number', description: '待发货数' }] } },
    { id: 'anno-004', target: 'stat-revenue', type: 'data', title: '本月销售额', details: { dataSource: '销售汇总', fields: [{ name: 'monthRevenue', type: 'number', description: '本月销售额' }] } },
    { id: 'anno-005', target: 'shortcut-orders', type: 'interaction', title: '订单快捷入口', details: { trigger: '点击跳转到订单管理' } },
  ],
}
