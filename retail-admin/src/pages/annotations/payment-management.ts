import { AnnotationConfig } from '../components/ProductAnnotation'

export const paymentManagementAnnotations: AnnotationConfig = {
  pageName: '付款管理',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'search-filter', type: 'function', title: '高级搜索', details: { functionName: '付款单搜索' } },
    { id: 'anno-002', target: 'btn-create', type: 'interaction', title: '创建付款单', details: { trigger: '点击「创建付款单」' } },
    { id: 'anno-003', target: 'payment-table', type: 'function', title: '付款单列表' },
    { id: 'anno-004', target: 'col-status', type: 'business', title: '付款状态', details: { statusFlow: ['pending', 'processing', 'completed', 'failed'] } },
    { id: 'anno-005', target: 'col-action', type: 'interaction', title: '操作列' },
    { id: 'anno-006', target: 'btn-view', type: 'interaction', title: '查看付款' },
    { id: 'anno-007', target: 'btn-process', type: 'business', title: '处理付款', details: { businessRule: '需付款处理权限' } },
    { id: 'anno-008', target: 'drawer-detail', type: 'function', title: '付款详情' },
  ],
}
