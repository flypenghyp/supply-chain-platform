import { AnnotationConfig } from '../../components/ProductAnnotation'

export const bidManagementAnnotations: AnnotationConfig = {
  pageName: '竞价管理',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'bid-search', type: 'function', title: '竞价查询', details: { functionName: '竞价活动检索' } },
    { id: 'anno-002', target: 'bid-table', type: 'data', title: '竞价列表', details: { dataSource: '竞价活动数据', fields: [{ name: 'bidName', type: 'string', description: '竞价名称' }, { name: 'bidStatus', type: 'string', description: '竞价状态' }] } },
    { id: 'anno-003', target: 'participate-bid-btn', type: 'interaction', title: '参与竞价', details: { trigger: '参与指定竞价活动' } },
  ],
}
