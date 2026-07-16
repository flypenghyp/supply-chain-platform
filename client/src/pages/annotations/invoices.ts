import { AnnotationConfig } from '../../components/ProductAnnotation'

export const invoicesAnnotations: AnnotationConfig = {
  pageName: '发票管理',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'invoice-search', type: 'function', title: '发票查询', details: { functionName: '发票检索' } },
    { id: 'anno-002', target: 'invoice-table', type: 'data', title: '发票列表', details: { dataSource: '发票数据', fields: [{ name: 'invoiceNo', type: 'string', description: '发票号' }, { name: 'invoiceAmount', type: 'number', description: '发票金额' }] } },
    { id: 'anno-003', target: 'apply-invoice-btn', type: 'interaction', title: '申请发票', details: { trigger: '提交发票申请' } },
    { id: 'anno-004', target: 'invoice-status-col', type: 'data', title: '开票状态', details: { fields: [{ name: 'invoiceStatus', type: 'string', description: '开票状态' }] } },
  ],
}
