import { AnnotationConfig } from '../../components/ProductAnnotation'

export const productManagementAnnotations: AnnotationConfig = {
  pageName: '商品管理',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'product-search', type: 'function', title: '商品查询', details: { functionName: '商品搜索' } },
    { id: 'anno-002', target: 'product-table', type: 'data', title: '商品列表', details: { dataSource: '商品数据', fields: [{ name: 'productName', type: 'string', description: '商品名称' }, { name: 'productCode', type: 'string', description: '商品编码' }, { name: 'productStatus', type: 'string', description: '商品状态' }] } },
    { id: 'anno-003', target: 'add-product-btn', type: 'interaction', title: '新增商品', details: { trigger: '提交新商品' } },
    { id: 'anno-004', target: 'product-status-col', type: 'data', title: '商品状态', details: { fields: [{ name: 'productStatus', type: 'string', description: '商品上下架状态' }] } },
  ],
}
