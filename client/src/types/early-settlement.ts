/**
 * 提前结算申请单状态
 */
export type EarlySettlementStatus = 'draft' | 'pending_signature' | 'signed' | 'approved' | 'rejected' | 'paid';

/**
 * 提前结算申请单
 */
export interface EarlySettlementApplication {
  id: string;
  recon_no: string; // 结算单号
  supplier_id: string;
  supplier_name: string;
  
  // 金额信息
  original_amount: number; // 原始结算金额
  discount_fee: number; // 商业折扣/服务费
  net_amount: number; // 预计实付金额
  
  // 日期信息
  original_due_date: string; // 原合同预计付款日
  expected_pay_date: string; // 期望付款日
  application_date: string; // 申请日期
  
  // 计算参数
  days_diff: number; // 提前付款天数
  daily_rate: number; // 日折扣率 (0.025%)
  
  // 联系信息
  contact_person: string;
  contact_phone: string;
  
  // 协议信息
  agreement_content: string; // 协议正文
  agreement_accepted: boolean;
  signed_at?: string;
  signature_hash?: string;
  
  // 状态
  status: EarlySettlementStatus;
  
  // 审批信息
  approved_at?: string;
  approver?: string;
  remark?: string;
  
  // 支付信息
  paid_at?: string;
  payment_transaction_id?: string;
  
  // 时间戳
  created_at: string;
  updated_at: string;
}

/**
 * 提前结算计算结果
 */
export interface EarlySettlementCalculation {
  days_diff: number; // 提前天数
  daily_rate: number; // 日折扣率
  discount_fee: number; // 商业折扣/服务费
  net_amount: number; // 实付金额
  discount_rate: string; // 折扣比例 (用于展示)
}

/**
 * 提前结算申请表单数据
 */
export interface EarlySettlementForm {
  recon_id: string;
  recon_no: string;
  expected_pay_date: string;
  contact_person: string;
  contact_phone: string;
  agreement_accepted: boolean;
}

/**
 * 批量提前结算申请
 */
export interface BatchEarlySettlementApplication {
  ids: string[]; // 多个结算单ID
  total_original_amount: number; // 合计原始金额
  total_discount_fee: number; // 合计折扣
  total_net_amount: number; // 合计实付
  expected_pay_date: string;
  contact_person: string;
  contact_phone: string;
  agreement_accepted: boolean;
}

/**
 * 提前结算补充协议内容
 */
export interface EarlySettlementAgreement {
  supplier_name: string;
  recon_no: string;
  original_due_date: string;
  expected_pay_date: string;
  days_diff: number;
  daily_rate: number;
  discount_fee: number;
  net_amount: number;
  agreement_date: string;
}
