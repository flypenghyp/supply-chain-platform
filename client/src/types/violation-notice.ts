/**
 * 供应商违约函/处罚单主数据
 */
export interface ViolationNotice {
  // --- 头部基础信息 (Header) ---
  id?: string;
  supplierCode: string; // e.g., "600583"
  supplierName: string; // e.g., "深圳市礼悦食品有限公司"
  occurrenceDate: string; // 发生日期, e.g., "2025-05-09"
  orgName: string; // 组织架构名称
  inspectionType: 'Internal' | 'External'; // 检查类型: 内部检查
  violationRegulation: string; // 违反条例: 食品安全法

  // --- 违规详情 (重点关注红框内容) ---
  // 对应图中第一个红框：详细描述不合格内容，包括生产批次、问题描述（粘不牢、脱落）、条码错误等
  violationContent: string;
  
  // --- 处理与定级 ---
  handlingAction: string; // 撤柜退货、自查自纠
  problemScope: 'Batch' | 'Individual'; // 问题范围: 批量
  problemType: string; // 问题类型: 商品标识不合格-标识
  severity: 'General' | 'Low' | 'High'; // 严重程度
  penaltyPoints: number; // 违约扣分: 3
  
  // --- 关联商品列表 (Table Data) ---
  items: ViolationItem[];

  // --- 整改与反馈 ---
  supplierAnalysis: string; // 供应商原因分析
  rectificationMeasures: string; // 整改措施 (由供应商填写)
  
  // --- 签署信息 (重点关注第二个红框) ---
  supplierRepName: string; // 供应商负责人: 赖宇翔
  supplierRepPhone: string; // 手机号码: 13534131731
  
  // --- 审核结果 ---
  auditOpinion: string; // 天虹审核意见 (罚款金额等)
  penaltyAmount: number; // 违约金: 10000
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
