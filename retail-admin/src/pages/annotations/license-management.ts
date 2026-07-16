import { AnnotationConfig } from '../components/ProductAnnotation'

export const licenseManagementAnnotations: AnnotationConfig = {
  pageName: '证照管理',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'search-filter', type: 'function', title: '高级搜索' },
    { id: 'anno-002', target: 'license-table', type: 'function', title: '证照列表' },
    { id: 'anno-003', target: 'col-status', type: 'business', title: '证照状态', details: { statusFlow: ['valid', 'expiring', 'expired', 'renewing'] } },
    { id: 'anno-004', target: 'col-action', type: 'interaction', title: '操作列' },
    { id: 'anno-005', target: 'btn-view', type: 'interaction', title: '查看证照' },
    { id: 'anno-006', target: 'btn-renew', type: 'business', title: '延期申请', details: { businessRule: '需证照管理权限' } },
    { id: 'anno-007', target: 'btn-tree', type: 'interaction', title: '树形筛选', details: { trigger: '点击树形选择' } },
  ],
}
