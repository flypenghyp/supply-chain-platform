import { AnnotationConfig } from '../../components/ProductAnnotation'

export const productsAnnotations: AnnotationConfig = {
  pageName: '商品管理',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'product-search', type: 'function', title: '商品搜索', details: { functionName: '商品查询' } },
    { id: 'anno-002', target: 'product-table', type: 'data', title: '商品列表', details: { dataSource: '商品列表数据' } },
    { id: 'anno-003', target: 'product-edit-btn', type: 'interaction', title: '编辑商品', details: { trigger: '编辑商品信息' } },
  ],
}
