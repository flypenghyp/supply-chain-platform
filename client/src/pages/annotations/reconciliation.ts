import { AnnotationConfig } from '../../components/ProductAnnotation'

export const reconciliationAnnotations: AnnotationConfig = {
  pageName: '财务对账',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'recon-search', type: 'function', title: '对账单查询', details: { functionName: '对账单搜索' } },
    { id: 'anno-002', target: 'recon-table', type: 'data', title: '对账单列表', details: { dataSource: '对账单数据', fields: [{ name: 'reconNo', type: 'string', description: '对账单号' }, { name: 'reconStatus', type: 'string', description: '对账状态' }] } },
    { id: 'anno-003', target: 'confirm-recon-btn', type: 'interaction', title: '确认对账', details: { trigger: '供应商确认对账单' } },
    { id: 'anno-004', target: 'recon-detail-drawer', type: 'function', title: '对账明细', details: { functionName: '查看对账明细' } },
  ],
}
