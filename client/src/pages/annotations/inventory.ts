import { AnnotationConfig } from '../../components/ProductAnnotation'

export const inventoryAnnotations: AnnotationConfig = {
  pageName: '库存查询',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'inventory-search', type: 'function', title: '库存搜索', details: { functionName: '库存查询' } },
    { id: 'anno-002', target: 'inventory-table', type: 'data', title: '库存列表', details: { dataSource: '库存数据', fields: [{ name: 'productName', type: 'string', description: '商品名称' }, { name: 'availableQty', type: 'number', description: '可用库存' }] } },
    { id: 'anno-003', target: 'stock-warning', type: 'data', title: '库存预警', details: { dataSource: '库存预警', fields: [{ name: 'warningThreshold', type: 'number', description: '预警阈值' }] } },
  ],
}
