import { AnnotationConfig } from '../components/ProductAnnotation'

export const financeCenterAnnotations: AnnotationConfig = {
  pageName: '财务中心',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'stat-overview', type: 'data', title: '财务概览', details: { dataSource: 'finance.overview' } },
    { id: 'anno-002', target: 'card-account', type: 'function', title: '账户信息' },
    { id: 'anno-003', target: 'card-statement', type: 'function', title: '对账单' },
    { id: 'anno-004', target: 'card-invoice', type: 'function', title: '发票' },
    { id: 'anno-005', target: 'btn-detail', type: 'interaction', title: '查看详情', details: { trigger: '点击「详情」' } },
  ],
}
