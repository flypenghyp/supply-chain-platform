/**
 * 送货预约相关类型定义
 */

import dayjs, { Dayjs } from 'dayjs';

/**
 * 批次证明文件
 */
export interface BatchCertificates {
  factoryReport?: File | string; // 出厂检验报告
  quarantineCertificate?: File | string; // 入境货物检验检疫证明（进口商品）
  customsDeclaration?: File | string; // 报关单（非法定检测商品）
  listingCertificate?: File | string; // 厦门上市凭证等其他证明
}

/**
 * 批次信息
 */
export interface BatchInfo {
  id?: string; // 批次ID（用于前端标识）
  productionDate: Dayjs; // 生产日期（Dayjs对象，用于DatePicker）
  batchNo: string; // 批次号
  quantity: number; // 该批次数量
  certificates?: BatchCertificates; // 批次证明文件
}

/**
 * 商品批次信息
 */
export interface ItemWithBatches {
  id: string; // 商品ID
  orderItemId?: string; // 订单商品ID
  barcode: string; // 商品条码
  productName: string; // 商品名称
  sku: string; // 商品SKU
  totalQuantity: number; // 总数量
  unit: string; // 单位
  batches: BatchInfo[]; // 批次列表
}

/**
 * 司机信息
 */
export interface DriverInfo {
  name: string; // 司机姓名
  phone: string; // 司机电话
  idCard?: string; // 身份证号（可选）
}

/**
 * 车辆信息
 */
export interface VehicleInfo {
  plateNumber: string; // 车牌号
  vehicleType: string; // 车辆类型
  loadCapacity: number; // 载重（吨）
  length?: number; // 车长（米，可选）
}

/**
 * 预约时间信息
 */
export interface ScheduleInfo {
  appointmentDate: Dayjs; // 预约日期（Dayjs对象，用于DatePicker）
  timeSlot: string; // 时段（如 "09:00-12:00"）
  isNoAppointment: boolean; // 是否免预约
}

/**
 * 送货预约表单
 */
export interface AppointmentForm {
  id?: string; // 预约单ID
  orderIds: string[]; // 关联的订单ID列表
  supplierId: string; // 供应商ID
  supplierName: string; // 供应商名称
  isNoAppointmentSupplier: boolean; // 是否为免预约供应商
  items: ItemWithBatches[]; // 商品批次列表
  driver: DriverInfo; // 司机信息
  vehicle: VehicleInfo; // 车辆信息
  schedule: ScheduleInfo; // 排程信息
  notes?: string; // 备注
  status: 'draft' | 'submitted' | 'confirmed' | 'completed'; // 状态
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
}

/**
 * 订单商品信息（原始数据）
 */
export interface OrderItem {
  id: string;
  barcode: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
}
