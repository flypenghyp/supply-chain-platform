import { AnnotationConfig } from '../../components/ProductAnnotation'

export const suppliersAnnotations: AnnotationConfig = {
  pageName: '供应商信息',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'supplier-info-card', type: 'data', title: '供应商信息', details: { dataSource: '当前供应商信息' } },
    { id: 'anno-002', target: 'supplier-stat', type: 'data', title: '业务统计', details: { dataSource: '供应商业务汇总' } },
  ],
}
