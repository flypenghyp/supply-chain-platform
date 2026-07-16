import { AnnotationConfig } from '../../components/ProductAnnotation'

export const reconciliationSimpleAnnotations: AnnotationConfig = {
  pageName: '财务对账（简化）',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'simple-search', type: 'function', title: '对账查询', details: { functionName: '简化对账检索' } },
    { id: 'anno-002', target: 'simple-table', type: 'data', title: '对账列表', details: { dataSource: '简化对账数据' } },
  ],
}
