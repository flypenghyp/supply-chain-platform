/**
 * 零售商端质量问题单主数据
 * 对应供应商端 ViolationNotice，两端字段需保持同名同义
 */
export interface QualityIssue {
  id: string;
  noticeNo: string; // e.g., "20250001"
  supplierCode: string;
  supplierName: string;
  occurrenceDate: string;
  orgName: string;
  inspectionType: 'Internal' | 'External';
  violationRegulation: string;
  violationContent: string;
  handlingAction: string;
  problemScope: 'Batch' | 'Individual';
  problemType: string;
  severity: 'Low' | 'General' | 'High';
  penaltyPoints: number;
  items: QualityItem[];

  // 供应商填写
  supplierAnalysis?: string;
  rectificationMeasures?: string;
  supplierRepName?: string;
  supplierRepPhone?: string;
  supplierSubmitTime?: string;

  // 零售商填写
  auditOpinion?: string;
  penaltyAmount?: number;
  penaltyStatus?: 'pending' | 'deducted';
  rejectReason?: string;

  // 供应商不同意违约函原因
  supplierDisagreeReason?: string;
  supplierDisagreedAt?: string;

  // 流程状态
  status: 'pending' | 'supplier_disagreed' | 'processing' | 'rejected' | 'deduction_pending' | 'completed' | 'closed';

  // 违约函签章信息
  breachSignStatus?: 'pending' | 'signed';
  breachSignFlowId?: string;
  breachSignedAt?: string;
  breachSigner?: string;

  // 扣款单签章信息
  deductionSignStatus?: 'pending' | 'signed';
  deductionSignFlowId?: string;
  deductionSignedAt?: string;
  deductionSigner?: string;

  // 元数据
  createTime: string;
  updateTime?: string;
}

export interface QualityItem {
  storeCode: string;
  storeName: string;
  barcode: string;
  productName: string;
}
