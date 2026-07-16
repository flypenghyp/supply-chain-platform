import { AnnotationConfig } from '../../components/ProductAnnotation'

export const leaseCounterPayableAnnotations: AnnotationConfig = {
  pageName: '租赁柜台应付',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'lease-search', type: 'function', title: '租赁查询', details: { functionName: '租赁柜台对账检索' } },
    { id: 'anno-002', target: 'lease-table', type: 'data', title: '租赁列表', details: { dataSource: '租赁柜台应付数据' } },
    { id: 'anno-003', target: 'confirm-lease-btn', type: 'interaction', title: '确认应付', details: { trigger: '供应商确认租赁柜台应付' } },
  ],
}
