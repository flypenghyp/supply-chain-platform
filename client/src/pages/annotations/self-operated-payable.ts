import { AnnotationConfig } from '../../components/ProductAnnotation'

export const selfOperatedPayableAnnotations: AnnotationConfig = {
  pageName: '自营应付',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'selfop-search', type: 'function', title: '自营查询', details: { functionName: '自营应付检索' } },
    { id: 'anno-002', target: 'selfop-table', type: 'data', title: '自营列表', details: { dataSource: '自营应付数据' } },
    { id: 'anno-003', target: 'confirm-selfop-btn', type: 'interaction', title: '确认应付', details: { trigger: '供应商确认自营应付' } },
  ],
}
