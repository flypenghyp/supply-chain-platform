import { AnnotationConfig } from '../../components/ProductAnnotation'

export const contractsAnnotations: AnnotationConfig = {
  pageName: '合同管理',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'contract-search', type: 'function', title: '合同查询', details: { functionName: '合同检索' } },
    { id: 'anno-002', target: 'contract-table', type: 'data', title: '合同列表', details: { dataSource: '合同数据', fields: [{ name: 'contractNo', type: 'string', description: '合同编号' }, { name: 'contractStatus', type: 'string', description: '合同状态' }] } },
    { id: 'anno-003', target: 'view-contract-btn', type: 'interaction', title: '查看合同', details: { trigger: '查看合同详情' } },
    { id: 'anno-004', target: 'esign-contract-btn', type: 'interaction', title: '电签合同', details: { trigger: '使用电子签章签署合同' } },
  ],
}
