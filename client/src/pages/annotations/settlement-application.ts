import { AnnotationConfig } from '../../components/ProductAnnotation'

export const settlementApplicationAnnotations: AnnotationConfig = {
  pageName: '对账申请',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'settlement-search', type: 'function', title: '结算查询', details: { functionName: '结算单检索' } },
    { id: 'anno-002', target: 'settlement-table', type: 'data', title: '结算列表', details: { dataSource: '结算单数据', fields: [{ name: 'settlementNo', type: 'string', description: '结算单号' }, { name: 'settlementAmount', type: 'number', description: '结算金额' }] } },
    { id: 'anno-003', target: 'apply-settlement-btn', type: 'interaction', title: '申请对账', details: { trigger: '提交对账申请' } },
  ],
}
