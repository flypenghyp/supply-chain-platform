export type AnnotationType = 'function' | 'interaction' | 'business' | 'data'

export interface AnnotationField {
  name: string
  type: string
  description: string
}

export interface AnnotationDetails {
  functionName?: string
  entryPath?: string
  priority?: 'P0' | 'P1' | 'P2' | 'P3'

  trigger?: string
  feedback?: string
  stateChange?: string
  exceptionHandling?: string

  businessRule?: string
  validation?: string
  permission?: string
  statusFlow?: string[]

  dataSource?: string
  apiEndpoint?: string
  fields?: AnnotationField[]
}

export interface AnnotationItem {
  id: string
  target: string
  type: AnnotationType
  title: string
  description?: string
  details: AnnotationDetails
  communicationNote?: string
}

export interface AnnotationConfig {
  pageName: string
  version: string
  lastUpdated: string
  annotations: AnnotationItem[]
}

export const ANNOTATION_TYPE_META: Record<AnnotationType, { label: string; color: string }> = {
  function: { label: '功能', color: '#1890ff' },
  interaction: { label: '交互', color: '#52c41a' },
  business: { label: '业务', color: '#fa8c16' },
  data: { label: '数据', color: '#722ed1' },
}
