import { AnnotationConfig } from '../components/ProductAnnotation'

export const qualityManagementAnnotations: AnnotationConfig = {
  pageName: '质量管理',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    {
      id: 'anno-001', target: 'flow-alert', type: 'business',
      title: '质量管理流程说明',
      description: '零售商发起质量问题单后，系统自动生成质量违约函推送给供应商签章；供应商反馈整改后，零售商审核并生成违约扣款单，供应商再次签章完成闭环。',
      details: {
        businessRule: '1. 零售商发起质量问题单；2. 系统生成质量违约函推送给供应商签章；3. 供应商反馈整改；4. 零售商审核；5. 生成违约扣款单；6. 供应商签章完成闭环',
        statusFlow: ['created', 'letter_sent', 'supplier_signed', 'rectified', 'audit_approved', 'penalty_issued', 'closed'],
      },
      communicationNote: '2026-07-14 沟通：质量管理流程补充计划，含两端口设计',
    },
    {
      id: 'anno-002', target: 'search-filter', type: 'function',
      title: '高级搜索筛选',
      description: '质量问题单的多条件搜索',
      details: { functionName: '质量问题单搜索', entryPath: '/quality', priority: 'P0' },
    },
    {
      id: 'anno-003', target: 'btn-create', type: 'interaction',
      title: '新建质量问题单',
      description: '创建新的质量问题单',
      details: { trigger: '点击「新建质量问题单」', feedback: '右侧滑出创建表单 Drawer' },
    },
    {
      id: 'anno-004', target: 'quality-table', type: 'function',
      title: '质量问题单列表',
      description: '展示所有质量问题单',
      details: { functionName: '质量问题单列表', priority: 'P0' },
    },
    {
      id: 'anno-005', target: 'col-issue-no', type: 'data',
      title: '问题单编号',
      description: '质量问题单唯一编号',
      details: { dataSource: 'issue.issueNo', fields: [{ name: 'issueNo', type: 'string', description: 'QI+日期+序号' }] },
    },
    {
      id: 'anno-006', target: 'col-problem-type', type: 'business',
      title: '问题类型',
      description: '质量问题的分类，决定问题性质',
      details: { businessRule: '问题类型与处理流程关联', dataSource: 'issue.problemType' },
    },
    {
      id: 'anno-007', target: 'col-severity', type: 'business',
      title: '严重程度',
      description: '问题的严重程度分级',
      details: { businessRule: '轻微/一般/严重/特别严重 4 级，影响审批权限' },
    },
    {
      id: 'anno-008', target: 'col-status', type: 'business',
      title: '问题单状态',
      description: '问题单的状态流转：待处理 → 违约函签章中 → 待整改 → 整改中 → 审核中 → 已完成',
      details: { statusFlow: ['pending', 'letter_signing', 'rectifying', 'auditing', 'completed', 'closed'] },
    },
    {
      id: 'anno-009', target: 'col-action', type: 'interaction',
      title: '表格操作列',
      description: '查看、编辑、审核、签章、关闭等行操作',
      details: { trigger: '点击行内操作按钮' },
    },
    {
      id: 'anno-010', target: 'btn-view', type: 'interaction',
      title: '查看详情',
      description: '查看质量问题单的完整信息',
      details: { trigger: '点击「详情」', feedback: '右侧滑出详情 Drawer' },
    },
    {
      id: 'anno-011', target: 'btn-edit', type: 'interaction',
      title: '编辑问题单',
      description: '编辑未提交的问题单',
      details: { businessRule: '仅 pending 状态可编辑' },
    },
    {
      id: 'anno-012', target: 'btn-audit', type: 'business',
      title: '审核问题单',
      description: '审核供应商的整改结果',
      details: {
        businessRule: '仅 auditing 状态可审核；通过后生成违约扣款单',
        permission: '需质量管理审核权限',
        statusFlow: ['auditing', 'completed'],
      },
    },
    {
      id: 'anno-013', target: 'btn-sign', type: 'business',
      title: '签章违约函',
      description: '对质量违约函进行电签',
      details: {
        businessRule: '需电签功能支持；签章后状态变为待整改',
        statusFlow: ['letter_signing', 'rectifying'],
      },
    },
    {
      id: 'anno-014', target: 'btn-close', type: 'interaction',
      title: '关闭问题单',
      description: '关闭已完成或异常的问题单',
      details: { trigger: '点击「关闭」', feedback: '弹出确认 Modal' },
    },
    {
      id: 'anno-015', target: 'drawer-create', type: 'function',
      title: '创建问题单抽屉',
      description: '创建质量问题单的表单抽屉',
      details: { functionName: '创建问题单' },
    },
    {
      id: 'anno-016', target: 'drawer-detail', type: 'function',
      title: '问题单详情抽屉',
      description: '展示问题单的完整信息',
      details: { functionName: '问题单详情' },
    },
    {
      id: 'anno-017', target: 'drawer-audit', type: 'function',
      title: '审核抽屉',
      description: '审核供应商整改的抽屉',
      details: { functionName: '审核整改' },
    },
    {
      id: 'anno-018', target: 'drawer-edit', type: 'function',
      title: '编辑抽屉',
      description: '编辑问题单信息的抽屉',
      details: { functionName: '编辑问题单' },
    },
    {
      id: 'anno-019', target: 'modal-close', type: 'interaction',
      title: '关闭确认弹窗',
      description: '关闭问题单的二次确认',
      details: { trigger: '点击「确认关闭」', feedback: '问题单状态变更为已关闭' },
    },
  ],
}
