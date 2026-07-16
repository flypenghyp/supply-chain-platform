import { AnnotationConfig } from '../../components/ProductAnnotation'

export const qualityAnnotations: AnnotationConfig = {
  pageName: '质量管理',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'quality-alert', type: 'data', title: '质量预警', details: { dataSource: '质量问题统计' } },
    { id: 'anno-002', target: 'quality-search', type: 'function', title: '质量查询', details: { functionName: '质量问题检索' } },
    { id: 'anno-003', target: 'quality-table', type: 'data', title: '质量问题列表', details: { dataSource: '质量问题数据', fields: [{ name: 'issueType', type: 'string', description: '问题类型' }, { name: 'severity', type: 'string', description: '严重程度' }] } },
    { id: 'anno-004', target: 'quality-status-col', type: 'data', title: '处理状态', details: { fields: [{ name: 'handleStatus', type: 'string', description: '处理状态' }] } },
  ],
}
