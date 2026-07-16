import { AnnotationConfig } from '../components/ProductAnnotation'

export const contractManagementAnnotations: AnnotationConfig = {
  pageName: '合同管理',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'search-filter', type: 'function', title: '高级搜索', details: { functionName: '合同搜索' } },
    { id: 'anno-002', target: 'btn-create', type: 'interaction', title: '创建合同', details: { trigger: '点击「创建合同」' } },
    { id: 'anno-003', target: 'contract-table', type: 'function', title: '合同列表' },
    { id: 'anno-004', target: 'col-status', type: 'business', title: '合同状态', details: { statusFlow: ['draft', 'pending', 'signed', 'active', 'expired', 'terminated'] } },
    { id: 'anno-005', target: 'col-action', type: 'interaction', title: '操作列' },
    { id: 'anno-006', target: 'btn-view', type: 'interaction', title: '查看合同' },
    { id: 'anno-007', target: 'btn-sign', type: 'business', title: '电签合同', details: { businessRule: '需电签功能' } },
    { id: 'anno-008', target: 'btn-terminate', type: 'business', title: '终止合同' },
    { id: 'anno-009', target: 'drawer-detail', type: 'function', title: '合同详情' },
  ],
}
