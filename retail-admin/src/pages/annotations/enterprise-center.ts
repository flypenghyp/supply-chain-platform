import { AnnotationConfig } from '../components/ProductAnnotation'

export const enterpriseCenterAnnotations: AnnotationConfig = {
  pageName: '企业中心',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'card-profile', type: 'function', title: '企业资料', details: { functionName: '查看/编辑企业信息' } },
    { id: 'anno-002', target: 'card-license', type: 'function', title: '证照信息' },
    { id: 'anno-003', target: 'card-bank', type: 'data', title: '银行账户', details: { dataSource: 'enterprise.bankAccounts' } },
    { id: 'anno-004', target: 'btn-edit', type: 'interaction', title: '编辑资料', details: { trigger: '点击「编辑」' } },
    { id: 'anno-005', target: 'btn-save', type: 'business', title: '保存修改', details: { businessRule: '需企业管理员权限' } },
  ],
}
