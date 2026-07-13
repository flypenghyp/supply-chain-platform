/**
 * 供应商违约函/处罚单主数据
 * 对应零售商端 QualityIssue，两端字段需保持同名同义
 */
export interface ViolationNotice {
  // --- 头部基础信息 (Header) ---
  id: string;
  noticeNo: string; // e.g., "VN20250001" 中的序号部分
  supplierCode: string; // e.g., "600583"
  supplierName: string; // e.g., "深圳市礼悦食品有限公司"
  occurrenceDate: string; // 发生日期, e.g., "2025-05-09"
  orgName: string; // 组织架构名称
  inspectionType: 'Internal' | 'External'; // 检查类型: 内部检查/外部检查
  violationRegulation: string; // 违反条例: 食品安全法

  // --- 违规详情 (重点关注红框内容) ---
  // 对应图中第一个红框：详细描述不合格内容，包括生产批次、问题描述（粘不牢、脱落）、条码错误等
  violationContent: string;

  // --- 处理与定级 ---
  handlingAction: string; // 撤柜退货、自查自纠
  problemScope: 'Batch' | 'Individual'; // 问题范围: 批量/个别
  problemType: string; // 问题类型: 商品标识不合格-标识
  severity: 'General' | 'Low' | 'High'; // 严重程度
  penaltyPoints: number; // 违约扣分: 3

  // --- 关联商品列表 (Table Data) ---
  items: ViolationItem[];

  // --- 整改与反馈 (供应商填写) ---
  supplierAnalysis?: string; // 供应商原因分析
  rectificationMeasures?: string; // 整改措施
  supplierRepName?: string; // 供应商负责人
  supplierRepPhone?: string; // 手机号码
  supplierSubmitTime?: string; // 供应商提交时间

  // --- 审核结果 (零售商填写) ---
  auditOpinion?: string; // 天虹审核意见
  penaltyAmount?: number; // 违约金
  penaltyStatus?: 'pending' | 'deducted'; // 扣分状态
  rejectReason?: string; // 驳回原因

  // 供应商不同意违约函原因
  supplierDisagreeReason?: string;
  supplierDisagreedAt?: string;

  // 流程状态
  status: 'pending' | 'supplier_disagreed' | 'processing' | 'rejected' | 'deduction_pending' | 'completed' | 'closed';

  // --- 违约函签章信息 ---
  breachSignStatus?: 'pending' | 'signed';
  breachSignFlowId?: string;
  breachSignedAt?: string;
  breachSigner?: string;

  // --- 扣款单签章信息 ---
  deductionSignStatus?: 'pending' | 'signed';
  deductionSignFlowId?: string;
  deductionSignedAt?: string;
  deductionSigner?: string;

  // --- 元数据 ---
  createTime: string;
  updateTime?: string;
}

/**
 * 违规商品明细
 */
export interface ViolationItem {
  storeCode: string; // 60014
  storeName: string; // sp@ce新安优城店
  barcode: string; // 6942536578049
  productName: string; // 天口味迷你虎皮瑞士卷蛋糕
}
