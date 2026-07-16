import { AnnotationConfig } from '../../components/ProductAnnotation'

export const shipmentsAnnotations: AnnotationConfig = {
  pageName: '发货管理',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'shipment-search', type: 'function', title: '发货单查询', details: { functionName: '发货单搜索' } },
    { id: 'anno-002', target: 'shipment-table', type: 'data', title: '发货单列表', details: { dataSource: '发货单数据', fields: [{ name: 'shipmentNo', type: 'string', description: '发货单号' }, { name: 'deliveryStatus', type: 'string', description: '配送状态' }] } },
    { id: 'anno-003', target: 'create-shipment-btn', type: 'interaction', title: '新建发货单', details: { trigger: '创建新发货单' } },
    { id: 'anno-004', target: 'logistics-info', type: 'data', title: '物流信息', details: { dataSource: '物流轨迹', fields: [{ name: 'logisticsCompany', type: 'string', description: '物流公司' }, { name: 'trackingNo', type: 'string', description: '运单号' }] } },
  ],
}
