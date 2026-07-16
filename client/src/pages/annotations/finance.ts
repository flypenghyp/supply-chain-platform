import { AnnotationConfig } from '../../components/ProductAnnotation'

export const financeAnnotations: AnnotationConfig = {
  pageName: '供应链金融',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'finance-overview', type: 'data', title: '金融概览', details: { dataSource: '授信数据', fields: [{ name: 'creditLimit', type: 'number', description: '授信额度' }, { name: 'usedCredit', type: 'number', description: '已用额度' }] } },
    { id: 'anno-002', target: 'apply-finance-btn', type: 'interaction', title: '申请融资', details: { trigger: '申请供应链融资' } },
    { id: 'anno-003', target: 'finance-product-list', type: 'data', title: '金融产品', details: { dataSource: '可申请的金融产品' } },
  ],
}
