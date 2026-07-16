import { AnnotationConfig } from '../../components/ProductAnnotation'

export const feesAnnotations: AnnotationConfig = {
  pageName: '费用单管理',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'fee-search', type: 'function', title: '费用单查询', details: { functionName: '费用单检索' } },
    { id: 'anno-002', target: 'fee-table', type: 'data', title: '费用单列表', details: { dataSource: '费用单数据', fields: [{ name: 'feeType', type: 'string', description: '费用类型' }, { name: 'feeAmount', type: 'number', description: '费用金额' }] } },
    { id: 'anno-003', target: 'confirm-fee-btn', type: 'interaction', title: '确认费用', details: { trigger: '供应商确认费用单' } },
  ],
}
