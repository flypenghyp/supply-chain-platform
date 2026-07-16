import { AnnotationConfig } from '../components/ProductAnnotation'

export const invoiceManagementAnnotations: AnnotationConfig = {
  pageName: '发票管理',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    {
      id: 'anno-001', target: 'search-filter', type: 'function',
      title: '高级搜索筛选',
      description: '发票的多条件搜索筛选',
      details: { functionName: '发票搜索', entryPath: '/finance/invoices', priority: 'P0' },
    },
    {
      id: 'anno-002', target: 'btn-export', type: 'interaction',
      title: '导出发票',
      description: '导出当前筛选结果为 Excel',
      details: { trigger: '点击「导出」按钮', feedback: '显示「导出成功」消息提示' },
    },
    {
      id: 'anno-003', target: 'invoice-table', type: 'function',
      title: '发票列表',
      description: '展示所有发票记录',
      details: { functionName: '发票列表', priority: 'P0' },
    },
    {
      id: 'anno-004', target: 'col-invoice-status', type: 'business',
      title: '发票状态',
      description: '发票的状态流转：待收票 → 已收票 → 已核验 → 已归档',
      details: {
        statusFlow: ['pending', 'received', 'verified', 'archived'],
        businessRule: '仅已收票（received）状态可进行核验操作',
      },
    },
    {
      id: 'anno-005', target: 'col-action', type: 'interaction',
      title: '表格操作列',
      description: '查看详情、核验等行操作',
      details: { trigger: '点击行内操作按钮', feedback: '弹出 Drawer 或成功提示' },
    },
    {
      id: 'anno-006', target: 'btn-view-detail', type: 'interaction',
      title: '查看发票详情',
      description: '查看发票的完整信息',
      details: { trigger: '点击「详情」按钮', feedback: '右侧滑出发票详情 Drawer' },
    },
    {
      id: 'anno-007', target: 'btn-verify', type: 'business',
      title: '核验发票',
      description: '将发票状态从「已收票」修改为「已核验」',
      details: {
        businessRule: '仅已收票（received）状态可核验；核验后状态不可回退',
        permission: '需发票管理权限',
        statusFlow: ['received', 'verified'],
      },
    },
    {
      id: 'anno-008', target: 'drawer-detail', type: 'function',
      title: '发票详情抽屉',
      description: '展示发票的完整信息，含基本信息和金额信息',
      details: { functionName: '发票详情', entryPath: '/finance/invoices → 详情' },
    },
    {
      id: 'anno-009', target: 'invoice-amount', type: 'data',
      title: '发票金额信息',
      description: '发票的金额和税额信息',
      details: {
        dataSource: 'invoice.amount + invoice.taxAmount',
        fields: [
          { name: 'amount', type: 'number', description: '发票金额（不含税）' },
          { name: 'taxAmount', type: 'number', description: '税额' },
        ],
      },
    },
    {
      id: 'anno-010', target: 'rejected-info', type: 'business',
      title: '发票驳回原因',
      description: '当发票被驳回时显示驳回原因',
      details: {
        businessRule: '核验不通过时显示驳回原因，方便供应商修改后重新提交',
      },
      communicationNote: '2026-07-14 沟通：发票驳回原因展示位置优化，便于供应商查看',
    },
  ],
}
