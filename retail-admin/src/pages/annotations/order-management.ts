import { AnnotationConfig } from '../components/ProductAnnotation'

export const orderManagementAnnotations: AnnotationConfig = {
  pageName: '订单管理',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    {
      id: 'anno-001', target: 'search-filter', type: 'function',
      title: '高级搜索筛选',
      description: '订单的多条件搜索筛选',
      details: { functionName: '订单搜索', entryPath: '/orders', priority: 'P0' },
    },
    {
      id: 'anno-002', target: 'btn-export', type: 'interaction',
      title: '导出订单',
      description: '导出当前筛选结果为 Excel',
      details: { trigger: '点击「导出」按钮', feedback: '下载 Excel 文件' },
    },
    {
      id: 'anno-003', target: 'order-table', type: 'function',
      title: '订单列表',
      description: '展示所有订单，支持行操作',
      details: { functionName: '订单列表', priority: 'P0' },
    },
    {
      id: 'anno-004', target: 'col-order-no', type: 'data',
      title: '订单编号',
      description: '订单唯一编号，点击查看详情',
      details: { dataSource: 'order.orderNo', fields: [{ name: 'orderNo', type: 'string', description: 'PO+日期+序号' }] },
    },
    {
      id: 'anno-005', target: 'col-category', type: 'business',
      title: '品类',
      description: '订单所属品类，决定可审批人',
      details: {
        businessRule: '品类与审批人权限绑定，非该品类的审批人无法审批',
        permission: '需品类管理权限',
      },
    },
    {
      id: 'anno-006', target: 'col-order-status', type: 'business',
      title: '订单状态',
      description: '订单状态流转：待确认 → 已确认 → 配送中 → 已完成/已取消',
      details: { statusFlow: ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'] },
    },
    {
      id: 'anno-007', target: 'col-action', type: 'interaction',
      title: '表格操作列',
      description: '查看、审批、拒绝、隐藏等行操作',
      details: { trigger: '点击行内操作按钮' },
    },
    {
      id: 'anno-008', target: 'btn-view', type: 'interaction',
      title: '查看订单',
      description: '查看订单详情，含单头和单身明细',
      details: { trigger: '点击「查看」按钮', feedback: '右侧滑出订单详情 Drawer' },
    },
    {
      id: 'anno-009', target: 'btn-approve', type: 'business',
      title: '审批订单',
      description: '将订单状态从「待确认」改为「已确认」',
      details: {
        businessRule: '仅 pending 状态可审批；需当前用户有该品类审批权限',
        permission: '需品类审批权限',
        statusFlow: ['pending', 'confirmed'],
      },
    },
    {
      id: 'anno-010', target: 'btn-reject', type: 'business',
      title: '拒绝订单',
      description: '将订单状态改为「已取消」',
      details: { businessRule: '仅 pending 状态可拒绝', statusFlow: ['pending', 'cancelled'] },
    },
    {
      id: 'anno-011', target: 'switch-hide', type: 'business',
      title: '订单隐藏开关',
      description: '切换订单的显示/隐藏状态',
      details: {
        businessRule: '隐藏后供应商端无法看到此订单；切换为显示时立即恢复',
        permission: '需品类隐藏权限',
      },
    },
    {
      id: 'anno-012', target: 'drawer-detail', type: 'function',
      title: '订单详情抽屉',
      description: '展示订单的完整信息，含单头信息和单身明细',
      details: { functionName: '订单详情', entryPath: '/orders → 查看' },
    },
    {
      id: 'anno-013', target: 'order-header', type: 'function',
      title: '订单基本信息',
      description: '订单单头信息，含编号、供应商、品类、日期、状态、金额',
      details: {
        dataSource: 'order.*',
        fields: [
          { name: 'orderNo', type: 'string', description: '订单编号' },
          { name: 'supplierName', type: 'string', description: '供应商' },
          { name: 'categoryName', type: 'string', description: '品类' },
          { name: 'totalAmount', type: 'number', description: '订单金额' },
        ],
      },
    },
    {
      id: 'anno-014', target: 'order-items', type: 'data',
      title: '订单明细',
      description: '订单的商品明细列表',
      details: {
        dataSource: 'order.items[]',
        fields: [
          { name: 'productName', type: 'string', description: '商品名称' },
          { name: 'quantity', type: 'number', description: '数量' },
          { name: 'unitPrice', type: 'number', description: '单价' },
          { name: 'amount', type: 'number', description: '金额' },
        ],
      },
    },
    {
      id: 'anno-015', target: 'drawer-hide', type: 'function',
      title: '确认隐藏订单',
      description: '隐藏订单的二次确认抽屉',
      details: { functionName: '隐藏确认', businessRule: '隐藏原因必填' },
    },
  ],
}
