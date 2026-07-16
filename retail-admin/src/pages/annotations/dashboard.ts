import { AnnotationConfig } from '../components/ProductAnnotation'

export const dashboardAnnotations: AnnotationConfig = {
  pageName: '仪表盘',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'stat-overview', type: 'data', title: '核心指标', details: { dataSource: '聚合统计数据', fields: [{ name: 'totalOrders', type: 'number', description: '订单总数' }] } },
    { id: 'anno-002', target: 'chart-trend', type: 'function', title: '趋势图表', details: { functionName: '业务趋势图' } },
    { id: 'anno-003', target: 'card-shortcut', type: 'interaction', title: '快捷入口', details: { trigger: '点击快捷卡片' } },
  ],
}
