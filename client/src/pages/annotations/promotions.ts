import { AnnotationConfig } from '../../components/ProductAnnotation'

export const promotionsAnnotations: AnnotationConfig = {
  pageName: '促销活动',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'promotion-search', type: 'function', title: '促销查询', details: { functionName: '促销活动检索' } },
    { id: 'anno-002', target: 'promotion-table', type: 'data', title: '促销列表', details: { dataSource: '促销活动数据' } },
    { id: 'anno-003', target: 'join-promotion-btn', type: 'interaction', title: '参与活动', details: { trigger: '参与促销活动' } },
  ],
}
