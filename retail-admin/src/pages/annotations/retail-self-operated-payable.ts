import { AnnotationConfig } from '../components/ProductAnnotation'

export const retailSelfOperatedPayableAnnotations: AnnotationConfig = {
  pageName: '自营应付',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'search-filter', type: 'function', title: '高级搜索' },
    { id: 'anno-002', target: 'btn-create', type: 'interaction', title: '创建应付' },
    { id: 'anno-003', target: 'payable-table', type: 'function', title: '应付列表' },
    { id: 'anno-004', target: 'col-status', type: 'business', title: '应付状态', details: { statusFlow: ['pending', 'confirmed', 'paid'] } },
    { id: 'anno-005', target: 'col-action', type: 'interaction', title: '操作列' },
    { id: 'anno-006', target: 'btn-view', type: 'interaction', title: '查看应付' },
    { id: 'anno-007', target: 'btn-confirm', type: 'business', title: '确认应付' },
    { id: 'anno-008', target: 'drawer-detail', type: 'function', title: '应付详情' },
  ],
}
