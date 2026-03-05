import dayjs, { Dayjs } from 'dayjs';
import type { EarlySettlementCalculation } from '../types/early-settlement';

/**
 * 提前结算核心计算函数
 * 
 * @param totalAmount - 结算单总金额
 * @param originalDueDate - 原合同预计付款日 (YYYY-MM-DD)
 * @param expectedPayDate - 期望付款日 (Dayjs 对象)
 * @returns 计算结果对象
 * 
 * @example
 * const result = calculateEarlySettlement(100000, '2026-02-01', dayjs('2026-01-20'));
 * // result = {
 * //   days_diff: 12,
 * //   daily_rate: 0.00025,
 * //   discount_fee: 300,
 * //   net_amount: 99700,
 * //   discount_rate: '0.300'
 * // }
 */
export function calculateEarlySettlement(
  totalAmount: number,
  originalDueDate: string,
  expectedPayDate: Dayjs
): EarlySettlementCalculation {
  const originalDate = dayjs(originalDueDate).startOf('day');
  const expectedDate = expectedPayDate.startOf('day');
  
  // 计算提前付款天数
  const daysDiff = originalDate.diff(expectedDate, 'day');
  
  // 边界检查：期望付款日不能晚于原付款日
  if (daysDiff < 0) {
    throw new Error('期望付款日不能晚于原合同付款日');
  }
  
  // 边界检查：期望付款日不能早于今天
  const today = dayjs().startOf('day');
  if (expectedDate.isBefore(today)) {
    throw new Error('期望付款日不能早于今天');
  }
  
  // 固定日折扣率：0.025% = 0.00025
  const dailyRate = 0.00025;
  
  // 计算商业折扣/服务费
  const discountFee = totalAmount * dailyRate * daysDiff;
  
  // 计算实付金额
  const netAmount = totalAmount - discountFee;
  
  // 计算折扣比例 (用于展示)
  const discountRate = (dailyRate * daysDiff * 100).toFixed(3);
  
  return {
    days_diff: daysDiff,
    daily_rate: dailyRate,
    discount_fee: Math.round(discountFee * 100) / 100, // 保留两位小数
    net_amount: Math.round(netAmount * 100) / 100, // 保留两位小数
    discount_rate: discountRate
  };
}

/**
 * 批量计算多个结算单的提前结算
 * 
 * @param settlements - 结算单数组
 * @param expectedPayDate - 统一的期望付款日
 * @returns 批量计算结果
 */
export function calculateBatchEarlySettlement(
  settlements: Array<{ id: string; recon_no: string; payable_amount: number; period: string }>,
  expectedPayDate: Dayjs
) {
  // 计算总金额
  const totalOriginalAmount = settlements.reduce((sum, item) => sum + item.payable_amount, 0);
  
  // 找出最晚的付款日
  const latestDueDate = settlements.reduce((latest, item) => {
    const dueDate = dayjs(item.period + '-01');
    return dueDate.isAfter(latest) ? dueDate : latest;
  }, dayjs(settlements[0].period + '-01'));
  
  // 使用最晚付款日计算
  const calculation = calculateEarlySettlement(
    totalOriginalAmount,
    latestDueDate.format('YYYY-MM-DD'),
    expectedPayDate
  );
  
  return {
    ...calculation,
    total_original_amount: totalOriginalAmount,
    settlement_count: settlements.length
  };
}

/**
 * 获取默认期望付款日（T+1）
 */
export function getDefaultExpectedPayDate(): Dayjs {
  return dayjs().add(1, 'day');
}

/**
 * 计算日期范围限制
 * 
 * @param originalDueDate - 原付款日
 * @returns 最小和最大可选日期
 */
export function getDatePickerConstraints(originalDueDate: string) {
  const minDate = dayjs().startOf('day'); // 今天
  const maxDate = dayjs(originalDueDate).endOf('day').subtract(1, 'day'); // 原付款日前一天
  
  return {
    minDate,
    maxDate,
    disabledDate: (current: Dayjs) => {
      return current && (current.isBefore(minDate) || current.isAfter(maxDate));
    }
  };
}

/**
 * 格式化货币金额
 */
export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * 生成补充协议内容
 */
export function generateAgreementContent(
  supplierName: string,
  reconNo: string,
  originalDueDate: string,
  expectedPayDate: string,
  calculation: EarlySettlementCalculation
): string {
  return `提前结算补充协议

甲方（采购方）：采购方
乙方（供货方）：${supplierName}

一、乙方自愿申请提前结算对账单 ${reconNo}。

二、原合同预计付款日为 ${originalDueDate}，乙方申请提前至 ${expectedPayDate}。

三、提前付款天数为 ${calculation.days_diff} 天，日折扣率为 ${(calculation.daily_rate * 100).toFixed(3)}%。

四、商业折扣/服务费为 ${formatCurrency(calculation.discount_fee)}，预计实付金额为 ${formatCurrency(calculation.net_amount)}。

五、本协议自签署之日起生效。`;
}

/**
 * 批量结算协议内容
 */
export function generateBatchAgreementContent(
  supplierName: string,
  settlements: Array<{ recon_no: string; period: string; payable_amount: number }>,
  expectedPayDate: string,
  calculation: any
): string {
  const settlementList = settlements.map((s, idx) => 
    `${idx + 1}、${s.recon_no}（${s.period}月）- ${formatCurrency(s.payable_amount)}`
  ).join('\n');
  
  return `提前结算补充协议

甲方（采购方）：采购方
乙方（供货方）：${supplierName}

一、乙方自愿申请提前结算 ${settlements.length} 个对账单，合计金额 ${formatCurrency(calculation.total_original_amount)}。

二、包含的对账单如下：
${settlementList}

三、原合同最晚付款日为 ${calculation.original_due_date}，乙方申请提前至 ${expectedPayDate}。

四、提前付款天数为 ${calculation.days_diff} 天，日折扣率为 ${(calculation.daily_rate * 100).toFixed(3)}%。

五、商业折扣/服务费为 ${formatCurrency(calculation.discount_fee)}，预计实付金额为 ${formatCurrency(calculation.net_amount)}。

六、本协议自签署之日起生效。`;
}
