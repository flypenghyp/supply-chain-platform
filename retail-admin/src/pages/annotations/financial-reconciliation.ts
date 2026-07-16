import { AnnotationConfig } from '../components/ProductAnnotation'

export const financialReconciliationAnnotations: AnnotationConfig = {
  pageName: '财务对账',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    {
      id: 'anno-001', target: 'stat-payable', type: 'data',
      title: '本月应付总额',
      description: '当前会计周期内所有对账单的应付金额合计',
      details: {
        dataSource: '后端聚合所有 statement.totalAmount',
        apiEndpoint: 'GET /finance/statements/summary?period=current',
        businessRule: '仅统计已确认（confirmed）和已付款（paid）状态对账单',
      },
      communicationNote: '2026-07-14 沟通：按会计期间合并正负金额单据生成结算申请',
    },
    {
      id: 'anno-002', target: 'stat-confirmed', type: 'data',
      title: '已付款金额',
      description: '已完成的付款金额合计',
      details: { dataSource: 'payment.completed 状态数据聚合' },
    },
    {
      id: 'anno-003', target: 'stat-pending', type: 'business',
      title: '待确认对账单',
      description: '当前需要零售商确认的对账单数量',
      details: { businessRule: '状态为 pending 时进入此统计', statusFlow: ['pending', 'confirmed', 'paid'] },
    },
    {
      id: 'anno-004', target: 'stat-invoice', type: 'data',
      title: '待收发票',
      description: '对账单已确认但发票未收齐的数量',
      details: { dataSource: 'invoice.status = received 状态数据' },
    },
    {
      id: 'anno-005', target: 'alert-rule', type: 'business',
      title: '业务规则提示',
      description: '对账单生成和处理的核心业务规则',
      details: {
        businessRule: '1. 按会计期间合并正负金额单据生成结算申请；2. 负金额单据为必勾项；3. 结算单生成后可选择是否立即开具发票',
        permission: '需财务对账权限',
      },
    },
    {
      id: 'anno-006', target: 'search-filter', type: 'function',
      title: '高级搜索筛选',
      description: '对账单的多条件搜索筛选',
      details: { functionName: '对账单搜索', entryPath: '/finance/reconciliation', priority: 'P0' },
    },
    {
      id: 'anno-007', target: 'btn-batch-confirm', type: 'interaction',
      title: '批量确认对账单',
      description: '批量确认选中的对账单',
      details: {
        trigger: '勾选多条对账单后点击「批量确认」',
        feedback: '弹出确认对话框，点击确认后批量修改状态',
        exceptionHandling: '未勾选时按钮置灰',
      },
    },
    {
      id: 'anno-008', target: 'btn-export', type: 'interaction',
      title: '导出对账单',
      description: '导出当前筛选结果为 Excel',
      details: { trigger: '点击「导出」按钮', feedback: '显示「导出成功」消息提示' },
    },
    {
      id: 'anno-009', target: 'statement-table', type: 'function',
      title: '对账单列表',
      description: '展示所有对账单，支持勾选和行操作',
      details: { functionName: '对账单列表', priority: 'P0' },
    },
    {
      id: 'anno-010', target: 'col-statement-status', type: 'business',
      title: '对账单状态',
      description: '对账单的状态流转：待确认 → 已确认 → 已付款/有异议',
      details: {
        statusFlow: ['pending', 'confirmed', 'paid', 'disputed'],
        businessRule: '仅 pending 状态可进行确认操作',
      },
    },
    {
      id: 'anno-011', target: 'col-action', type: 'interaction',
      title: '表格操作列',
      description: '查看详情、确认对账单等行操作',
      details: { trigger: '点击行内操作按钮', feedback: '弹出 Drawer 或确认对话框' },
    },
    {
      id: 'anno-012', target: 'btn-view-detail', type: 'interaction',
      title: '查看对账单详情',
      description: '查看对账单的完整信息、关联发票和付款记录',
      details: { trigger: '点击「详情」按钮', feedback: '右侧滑出对账单详情 Drawer' },
    },
    {
      id: 'anno-013', target: 'btn-confirm-statement', type: 'business',
      title: '确认对账单',
      description: '将对账单状态从「待确认」修改为「已确认」',
      details: {
        businessRule: '仅 pending 状态可确认；确认后触发后续发票和付款流程',
        permission: '需财务对账权限',
        statusFlow: ['pending', 'confirmed'],
      },
    },
    {
      id: 'anno-014', target: 'drawer-detail', type: 'function',
      title: '对账单详情抽屉',
      description: '展示对账单的完整信息，含基本信息、金额汇总、关联发票、付款记录',
      details: { functionName: '对账单详情', entryPath: '/finance/reconciliation → 详情' },
    },
    {
      id: 'anno-015', target: 'related-invoices', type: 'function',
      title: '关联发票',
      description: '展示该对账单关联的所有发票',
      details: {
        dataSource: 'invoice.statementNo = 当前对账单号',
        businessRule: '同一对账单可关联多张发票',
      },
    },
    {
      id: 'anno-016', target: 'payment-records', type: 'function',
      title: '付款记录',
      description: '展示该供应商的所有付款记录',
      details: {
        dataSource: 'payment.supplierName = 当前对账单供应商',
        statusFlow: ['pending', 'processing', 'completed', 'failed'],
      },
    },
  ],
}
