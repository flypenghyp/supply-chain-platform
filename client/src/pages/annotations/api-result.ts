import { AnnotationConfig } from '../../components/ProductAnnotation'

export const apiResultAnnotations: AnnotationConfig = {
  pageName: '结果页',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'result-icon', type: 'data', title: '结果状态', details: { dataSource: '操作结果' } },
    { id: 'anno-002', target: 'result-message', type: 'data', title: '结果文案', details: { dataSource: '结果描述' } },
    { id: 'anno-003', target: 'result-action-btn', type: 'interaction', title: '结果操作', details: { trigger: '点击继续操作' } },
  ],
}
