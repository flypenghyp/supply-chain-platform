import { AnnotationConfig } from '../components/ProductAnnotation'

export const announcementManagementAnnotations: AnnotationConfig = {
  pageName: '公告管理',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'search-filter', type: 'function', title: '高级搜索' },
    { id: 'anno-002', target: 'btn-create', type: 'interaction', title: '发布公告', details: { trigger: '点击「发布公告」' } },
    { id: 'anno-003', target: 'announcement-table', type: 'function', title: '公告列表' },
    { id: 'anno-004', target: 'col-status', type: 'business', title: '公告状态', details: { statusFlow: ['draft', 'published', 'archived'] } },
    { id: 'anno-005', target: 'col-action', type: 'interaction', title: '操作列' },
    { id: 'anno-006', target: 'btn-view', type: 'interaction', title: '查看公告' },
    { id: 'anno-007', target: 'btn-edit', type: 'business', title: '编辑公告' },
    { id: 'anno-008', target: 'drawer-detail', type: 'function', title: '公告详情' },
  ],
}
