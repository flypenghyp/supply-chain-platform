import { AnnotationConfig } from '../components/ProductAnnotation'

export const esignAuthorizationApprovalAnnotations: AnnotationConfig = {
  pageName: '授权委托书审批',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'search-filter', type: 'function', title: '高级搜索', details: { functionName: '授权书搜索' } },
    { id: 'anno-002', target: 'approval-table', type: 'function', title: '审批列表' },
    { id: 'anno-003', target: 'col-status', type: 'business', title: '审批状态', details: { statusFlow: ['pending', 'approved', 'rejected', 'revoked'] } },
    { id: 'anno-004', target: 'col-action', type: 'interaction', title: '操作列' },
    { id: 'anno-005', target: 'btn-view', type: 'interaction', title: '查看授权书' },
    { id: 'anno-006', target: 'btn-approve', type: 'business', title: '审批通过', details: { businessRule: '需电签审批权限' } },
    { id: 'anno-007', target: 'btn-reject', type: 'business', title: '审批驳回' },
    { id: 'anno-008', target: 'drawer-detail', type: 'function', title: '授权书详情' },
  ],
  communicationNote: '2026-07-14 沟通：新建独立的 /esign-approval 内部审批页面',
}
