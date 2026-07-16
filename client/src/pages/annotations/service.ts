import { AnnotationConfig } from '../../components/ProductAnnotation'

export const serviceAnnotations: AnnotationConfig = {
  pageName: '服务中心',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'ticket-search', type: 'function', title: '工单查询', details: { functionName: '工单检索' } },
    { id: 'anno-002', target: 'ticket-table', type: 'data', title: '工单列表', details: { dataSource: '工单数据', fields: [{ name: 'ticketNo', type: 'string', description: '工单号' }, { name: 'ticketStatus', type: 'string', description: '处理状态' }] } },
    { id: 'anno-003', target: 'create-ticket-btn', type: 'interaction', title: '新建工单', details: { trigger: '提交新工单' } },
    { id: 'anno-004', target: 'faq-list', type: 'data', title: '常见问题', details: { dataSource: 'FAQ列表' } },
  ],
}
