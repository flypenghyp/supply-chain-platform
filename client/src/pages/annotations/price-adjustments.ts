import { AnnotationConfig } from '../../components/ProductAnnotation'

export const priceAdjustmentsAnnotations: AnnotationConfig = {
  pageName: '价格调整',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'price-adjust-search', type: 'function', title: '调价查询', details: { functionName: '价格调整检索' } },
    { id: 'anno-002', target: 'price-adjust-table', type: 'data', title: '调价列表', details: { dataSource: '调价单数据' } },
    { id: 'anno-003', target: 'apply-adjust-btn', type: 'interaction', title: '申请调价', details: { trigger: '提交调价申请' } },
  ],
}
