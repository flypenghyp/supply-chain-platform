import { AnnotationConfig } from '../components/ProductAnnotation'

export const supplyChainFinanceAnnotations: AnnotationConfig = {
  pageName: '供应链金融',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'search-filter', type: 'function', title: '高级搜索' },
    { id: 'anno-002', target: 'btn-apply', type: 'interaction', title: '申请融资', details: { trigger: '点击「申请融资」' } },
    { id: 'anno-003', target: 'finance-table', type: 'function', title: '融资申请列表' },
    { id: 'anno-004', target: 'col-status', type: 'business', title: '融资状态', details: { statusFlow: ['applying', 'reviewing', 'approved', 'rejected', 'disbursed'] } },
    { id: 'anno-005', target: 'col-action', type: 'interaction', title: '操作列' },
    { id: 'anno-006', target: 'btn-view', type: 'interaction', title: '查看融资' },
    { id: 'anno-007', target: 'btn-approve', type: 'business', title: '审批融资', details: { businessRule: '需金融审批权限' } },
    { id: 'anno-008', target: 'drawer-detail', type: 'function', title: '融资详情' },
  ],
}
