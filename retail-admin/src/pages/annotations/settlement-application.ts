import { AnnotationConfig } from '../components/ProductAnnotation'

export const settlementApplicationAnnotations: AnnotationConfig = {
  pageName: '结算申请',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'search-filter', type: 'function', title: '高级搜索', details: { functionName: '结算申请搜索', entryPath: '/finance/settlement-application' } },
    { id: 'anno-002', target: 'btn-create', type: 'interaction', title: '创建结算申请', details: { trigger: '点击「创建结算申请」', feedback: '弹出创建表单' } },
    { id: 'anno-003', target: 'settlement-table', type: 'function', title: '结算申请列表', details: { functionName: '结算申请列表' } },
    { id: 'anno-004', target: 'col-status', type: 'business', title: '结算状态', details: { statusFlow: ['draft', 'submitted', 'approved', 'paid'] } },
    { id: 'anno-005', target: 'col-action', type: 'interaction', title: '操作列', details: { trigger: '点击行内操作' } },
    { id: 'anno-006', target: 'btn-view', type: 'interaction', title: '查看结算', details: { trigger: '点击查看' } },
    { id: 'anno-007', target: 'btn-approve', type: 'business', title: '审批结算', details: { businessRule: '需审批权限', statusFlow: ['submitted', 'approved'] } },
    { id: 'anno-008', target: 'drawer-detail', type: 'function', title: '结算详情' },
  ],
}
