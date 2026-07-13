/**
 * 支付平台外部配置
 * 所有支付相关的跳转URL统一在此配置
 */
export const PAYMENT_CONFIG = {
  /** 支付网关地址（发起支付请求） */
  GATEWAY_URL: 'https://payment-platform.example.com/pay',
  /** 支付结果查询地址 */
  QUERY_URL: 'https://payment-platform.example.com/query',
  /** 支付回调通知地址（后端配置） */
  CALLBACK_URL: '/api/payment/callback',
};
