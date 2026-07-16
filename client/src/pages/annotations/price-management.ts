import { AnnotationConfig } from '../../components/ProductAnnotation'

export const priceManagementAnnotations: AnnotationConfig = {
  pageName: '价格管理',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'price-search', type: 'function', title: '价格查询', details: { functionName: '价格检索' } },
    { id: 'anno-002', target: 'price-table', type: 'data', title: '价格列表', details: { dataSource: '商品价格数据', fields: [{ name: 'productName', type: 'string', description: '商品名称' }, { name: 'price', type: 'number', description: '当前价格' }] } },
    { id: 'anno-003', target: 'price-adjustment-link', type: 'interaction', title: '价格调整', details: { trigger: '跳转到价格调整申请' } },
  ],
}
