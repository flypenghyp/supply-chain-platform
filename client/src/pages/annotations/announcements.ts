import { AnnotationConfig } from '../../components/ProductAnnotation'

export const announcementsAnnotations: AnnotationConfig = {
  pageName: '公告通知',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'announcement-search', type: 'function', title: '公告查询', details: { functionName: '公告检索' } },
    { id: 'anno-002', target: 'announcement-list', type: 'data', title: '公告列表', details: { dataSource: '公告数据', fields: [{ name: 'title', type: 'string', description: '公告标题' }, { name: 'publishTime', type: 'date', description: '发布时间' }] } },
    { id: 'anno-003', target: 'announcement-type-col', type: 'data', title: '公告类型', details: { fields: [{ name: 'announcementType', type: 'string', description: '公告类型' }] } },
  ],
}
