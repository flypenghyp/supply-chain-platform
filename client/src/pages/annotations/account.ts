import { AnnotationConfig } from '../../components/ProductAnnotation'

export const accountAnnotations: AnnotationConfig = {
  pageName: '账户管理',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'company-info-card', type: 'data', title: '企业信息', details: { dataSource: '供应商企业信息', fields: [{ name: 'companyName', type: 'string', description: '企业名称' }, { name: 'unifiedCode', type: 'string', description: '统一社会信用代码' }] } },
    { id: 'anno-002', target: 'cert-card', type: 'data', title: '资质证照', details: { dataSource: '企业资质列表', fields: [{ name: 'license', type: 'string', description: '营业执照' }, { name: 'expireDate', type: 'date', description: '到期时间' }] } },
    { id: 'anno-003', target: 'users-card', type: 'function', title: '人员管理', details: { functionName: '子账号管理' } },
    { id: 'anno-004', target: 'esign-step', type: 'interaction', title: '电签授权步骤', details: { trigger: '显示当前授权状态' } },
    { id: 'anno-005', target: 'esign-apply-btn', type: 'interaction', title: '电签授权书申请', details: { trigger: '点击申请或重新提交电签授权' } },
  ],
}
