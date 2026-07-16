import { AnnotationConfig } from '../../components/ProductAnnotation'

export const salesAnnotations: AnnotationConfig = {
  pageName: '销售数据',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'sales-date-range', type: 'function', title: '日期范围', details: { functionName: '销售日期筛选' } },
    { id: 'anno-002', target: 'sales-summary', type: 'data', title: '销售汇总', details: { dataSource: '销售统计', fields: [{ name: 'totalSales', type: 'number', description: '总销售额' }, { name: 'orderCount', type: 'number', description: '订单数' }] } },
    { id: 'anno-003', target: 'sales-chart', type: 'data', title: '销售趋势图', details: { dataSource: '按日销售趋势' } },
    { id: 'anno-004', target: 'sales-product-ranking', type: 'data', title: '商品销量排名', details: { dataSource: '商品销量Top10' } },
  ],
}
