import { AnnotationConfig } from '../components/ProductAnnotation'

export const feeManagementAnnotations: AnnotationConfig = {
  pageName: '费用管理',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'search-filter', type: 'function', title: '高级搜索' },
    { id: 'anno-002', target: 'btn-create', type: 'interaction', title: '创建费用单', details: { trigger: '点击「创建费用单」' } },
    { id: 'anno-003', target: 'fee-table', type: 'function', title: '费用单列表' },
    { id: 'anno-004', target: 'col-status', type: 'business', title: '费用状态', details: { statusFlow: ['draft', 'submitted', 'approved', 'rejected'] } },
    { id: 'anno-005', target: 'col-action', type: 'interaction', title: '操作列' },
    { id: 'anno-006', target: 'btn-view', type: 'interaction', title: '查看费用' },
    { id: 'anno-007', target: 'btn-approve', type: 'business', title: '审批费用' },
    { id: 'anno-008', target: 'drawer-detail', type: 'function', title: '费用详情' },
  ],
}
