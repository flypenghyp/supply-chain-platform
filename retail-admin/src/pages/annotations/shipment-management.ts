import { AnnotationConfig } from '../components/ProductAnnotation'

export const shipmentManagementAnnotations: AnnotationConfig = {
  pageName: '发货管理',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'search-filter', type: 'function', title: '高级搜索', details: { functionName: '发货单搜索' } },
    { id: 'anno-002', target: 'btn-export', type: 'interaction', title: '导出发货单', details: { trigger: '点击「导出」' } },
    { id: 'anno-003', target: 'shipment-table', type: 'function', title: '发货单列表' },
    { id: 'anno-004', target: 'col-status', type: 'business', title: '发货状态', details: { statusFlow: ['pending', 'shipped', 'in_transit', 'delivered', 'received'] } },
    { id: 'anno-005', target: 'col-action', type: 'interaction', title: '操作列' },
    { id: 'anno-006', target: 'btn-view', type: 'interaction', title: '查看发货' },
    { id: 'anno-007', target: 'btn-confirm', type: 'business', title: '确认收货' },
    { id: 'anno-008', target: 'drawer-detail', type: 'function', title: '发货详情' },
  ],
}
