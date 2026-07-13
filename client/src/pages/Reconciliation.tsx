import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, Tabs, Descriptions, List,
  Avatar, Progress, Statistic, DatePicker, InputNumber, Checkbox, Drawer, Collapse
} from 'antd';
import {
  FileDoneOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  SettingOutlined,
  ExportOutlined,
  SearchOutlined,
  ReloadOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  SignatureOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { EarlySettlementApplication, EarlySettlementCalculation } from '../types/early-settlement';
import { ESIGN_CONFIG } from '../config/esign';
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const Reconciliation: React.FC = () => {
  const [reconciliations, setReconciliations] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [disputeModalVisible, setDisputeModalVisible] = useState(false);
  const [earlySettlementModalVisible, setEarlySettlementModalVisible] = useState(false);
  const [batchEarlySettlementModalVisible, setBatchEarlySettlementModalVisible] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [signContractModalVisible, setSignContractModalVisible] = useState(false);
  const [selectedSettlementData, setSelectedSettlementData] = useState<any>(null);
  const [contractSigned, setContractSigned] = useState(false);
  const [batchContractSigned, setBatchContractSigned] = useState(false);
  const [earlySettlementLoading, setEarlySettlementLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [selectedReconciliationIds, setSelectedReconciliationIds] = useState<React.Key[]>([]);
  const [activeTab, setActiveTab] = useState('list');
  const [filters, setFilters] = useState({
    period: '',
    status: ''
  });
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [columnFilterVisible, setColumnFilterVisible] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailModalType, setDetailModalType] = useState<'进货' | '退货' | '费用' | '扣款' | '专柜' | '合同扣款' | '促销扣款' | '价外扣款' | '开票汇总'>('进货');
  const [salesCostModalVisible, setSalesCostModalVisible] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'recon_no',
    'period',
    'settlement_type',
    'status',
    'esign_status',
    'is_deduction',
    'payable_amount',
    'actual_amount'
  ]);

  // 电签相关状态
  const [esignConfirmVisible, setEsignConfirmVisible] = useState(false);
  const [esignAgreed, setEsignAgreed] = useState(false);
  const [esignSubmitting, setEsignSubmitting] = useState(false);
  const [esignDocList, setEsignDocList] = useState<any[]>([]);
  const [esignFileDrawerVisible, setEsignFileDrawerVisible] = useState(false);
  const [esignFileRecord, setEsignFileRecord] = useState<any>(null);

  const [disputeForm] = Form.useForm();
  const navigate = useNavigate();

  // 模拟数据
  useEffect(() => {
    fetchReconciliations();
  }, []);

  const fetchReconciliations = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          id: '1',
          recon_no: 'D13-99926030600055',
          period: '202603',
          supplier_name: '广东太古可口可乐有限公司深圳营业部',
          supplier_type: '自营供应商',
          settlement_type: '购销结算对账单',
          legal_person: '天虹数科商业股份有限公司',
          settlement_method: '购销一月结',
          tax_rate: 0.13,
          status: 'pending',
          esign_status: 'pending',
          invoice_status: 'pending',
          is_deduction: false,
          payment_date: '',
          payment_amount: 1428538.72,
          purchase_amount: 1264193.56,
          tax_amount: 164345.16,
          payable_amount: 1428538.72,
          deduction_amount: 0,
          actual_amount: 1428538.72,
          created_at: '2026-03-01 10:00',
          items: [
            { type: '本期进货金额 (不含税)', amount: 1264193.56, count: 382, countType: '份' },
            { type: '本期退货金额 (不含税)', amount: 0, count: 0, countType: '份' },
            { type: '本期价内费用 (不含税)', amount: 0, count: 0, countType: '条' },
            { type: '本期价外扣款金额', amount: 0, count: 0, countType: '条' }
          ]
        },
        {
          id: '2',
          recon_no: 'D13-99926030600056',
          period: '202603',
          supplier_name: '农夫山泉股份有限公司',
          supplier_type: '自营供应商',
          settlement_type: '购销结算对账单',
          legal_person: '天虹数科商业股份有限公司',
          settlement_method: '购销一月结',
          tax_rate: 0.13,
          status: 'confirmed',            // 已核验 ✅ 可勾选
          esign_status: 'pending',        // 未电签 ← 核心演示状态
          invoice_status: 'pending',      // 未录入发票
          is_deduction: false,
          payment_date: '',
          payment_amount: 119300,
          purchase_amount: 105000,
          tax_amount: 14300,
          payable_amount: 119300,
          deduction_amount: 0,
          actual_amount: 119300,
          confirmed_at: '2026-03-10 14:30',
          created_at: '2026-03-01 10:00',
          items: [
            { type: '本期进货金额 (不含税)', amount: 105000, count: 280, countType: '份' },
            { type: '本期退货金额 (不含税)', amount: 0, count: 0, countType: '份' },
            { type: '本期价内费用 (不含税)', amount: 0, count: 0, countType: '条' },
            { type: '本期价外扣款金额', amount: 0, count: 0, countType: '条' }
          ]
        },
        {
          id: '3',
          recon_no: 'D13-99926030600057',
          period: '202603',
          supplier_name: '华润万家超市有限公司',
          supplier_type: '代销供应商',
          settlement_type: '代销结算对账单',
          legal_person: '天虹数科商业股份有限公司',
          settlement_method: '代销一月结',
          tax_rate: 0.13,
          status: 'confirmed',            // 已核验 ✅ 可勾选（原为 pending）
          esign_status: 'pending',        // 未电签 ← 用于合并电签演示
          invoice_status: 'pending',      // 未录入发票
          is_deduction: true,
          early_settlement_status: undefined,
          payment_date: '',
          payment_amount: 85600,
          purchase_amount: 75752.21,
          tax_amount: 9847.79,
          payable_amount: 85600,
          deduction_amount: 500,
          actual_amount: 85100,
          created_at: '2026-03-01 10:00',
          items: [
            { type: '本期进货金额 (不含税)', amount: 75752.21, count: 156, countType: '份' },
            { type: '本期退货金额 (不含税)', amount: 0, count: 0, countType: '份' },
            { type: '本期价内费用 (不含税)', amount: 0, count: 0, countType: '条' },
            { type: '本期价外扣款金额', amount: 500, count: 0, countType: '条' }
          ]
        },
        {
          id: '4',
          recon_no: 'D13-99926030600058',
          period: '202602',
          supplier_name: '屈臣氏化妆品有限公司',
          supplier_type: '专柜供应商',
          settlement_type: '专柜结算对账单',
          legal_person: '天虹数科商业股份有限公司',
          settlement_method: '专柜一月结',
          tax_rate: 0.13,
          status: 'confirmed',
          esign_status: 'completed',      // 已电签
          invoice_status: 'pending',      // 未录入发票 ← 关键：卡住提前结算
          is_deduction: false,
          payment_date: '',                // 尚未付款
          payment_amount: 125000,
          purchase_amount: 110619.47,
          tax_amount: 14380.53,
          payable_amount: 125000,
          deduction_amount: 0,
          actual_amount: 125000,
          confirmed_at: '2026-03-05 14:30',
          created_at: '2026-03-01 10:00',
          esign_completed_at: '2026-03-12 10:20:00',
          esign_file_no: 'ESIGN-1740001234568',
          esign_signer: '李四',
          esign_batch_no: 'BATCH-202603120001',   // 独立批次号
          sales_amount: 1696557.10,
          contract_deduction: -93627.92,
          promotion_deduction: -874463.75,
          items: [
            { type: '本期销售金额', amount: 1696557.10, count: 6, countType: '个' },
            { type: '合同扣款 (含税)', amount: -93627.92, count: 6, countType: '条' },
            { type: '促销扣款 (含税)', amount: -874463.75, count: 6, countType: '条' },
            { type: '本期价外扣款金额', amount: 44394.49, count: 12, countType: '条' }
          ]
        },
        {
          id: '5',
          recon_no: 'D13-99926030600059',
          period: '202602',
          supplier_name: '娄底市天虹百货有限公司',
          supplier_code: '7383800162',
          supplier_type: '租赁供应商',
          settlement_type: '租赁结算对账单',
          legal_person: '娄底市天虹百货有限公司',
          settlement_method: '租赁一月结',
          tax_rate: 0.09,
          status: 'confirmed',            // 已核验 ✅（原为 pending）
          esign_status: 'completed',      // 已电签
          invoice_status: 'entered',      // 已录入发票 ✅
          is_deduction: false,
          payment_date: '',
          payment_amount: 146057.34,
          sales_amount: 176589.00,
          rental_amount: 19449.79,
          other_amount: 11081.87,
          purchase_amount: 146057.34,
          tax_amount: 13145.16,
          payable_amount: 146057.34,
          deduction_amount: 0,
          actual_amount: 146057.34,
          created_at: '2026-03-01 10:00',
          esign_completed_at: '2026-03-10 16:45:00',
          esign_file_no: 'ESIGN-1740001234569',
          esign_signer: '王五',
          esign_batch_no: 'BATCH-202603100002',
          counter_count: 1,
          rental_fee_count: 2,
          other_fee_count: 15,
          items: [
            { type: '本期代收销货款', amount: 176589.00, count: 1, countType: '个' },
            { type: '本期应收费用总金额', amount: 30531.66, count: 17, countType: '条' },
            { type: '其中租金费用', amount: 19449.79, count: 2, countType: '条' },
            { type: '其中其他费用', amount: 11081.87, count: 15, countType: '条' }
          ],
          rental_details: [
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '浮动租金', amount: 19424.79, remark: 'clmp316 自动生成' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '浮动租金 M', amount: 25.00, remark: '1.29-2.28YHQ,E' }
          ],
          other_details: [
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '预付卡交易手续费', amount: 944.08, remark: '202602 月储值卡在线消费金额 188...' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '促销服务费', amount: 500.00, remark: '春节促销，EXCEL 导入' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '服务管理费', amount: 15.00, remark: '2 月消杀，EXCEL 导入' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '电费', amount: 1457.78, remark: '专柜自用水电费：2026020300110...' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '水费', amount: 80.00, remark: '2026 年 2 月份水费，EXCEL 导入' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '电费', amount: 200.00, remark: '2026 年 2 月份专柜空调费，EXCEL 导入' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '促销服务费', amount: 200.00, remark: '会员日促销，EXCEL 导入' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '第三方交易手续费 (含银行卡)', amount: 158.31, remark: '202602 月信用卡在线消费金额 316...' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '租赁柜 VIP 卡积分分摊手续费', amount: 1053.23, remark: 'clmp316 自动生成，2026-02-01 至 202...' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '第三方交易手续费 (含银行卡)', amount: 401.65, remark: 'clmp316 自动生成，2026-02-01 至 202...' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '租赁管理费', amount: 1765.89, remark: 'clmp316 自动生成，2026-02-01 至 202...' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '预付卡交易手续费', amount: 1573.53, remark: 'clmp316 自动生成，2026-02-01 至 202...' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '设备使用费 (增)', amount: 50.00, remark: 'clmp316 自动生成，2026-03-01 至 202...' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '平台服务费 (增)', amount: 50.00, remark: 'clmp316 自动生成，2026-03-01 至 202...' },
            { store: '娄底天虹', counter_code: '0300110105', counter_name: '沙驰箱包娄底天虹店', fee_name: '管理费', amount: 2626.40, remark: 'clmp316 自动生成，2026-03-01 至 202...' }
          ]
        },
      ];
      setReconciliations(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    let filtered = [...reconciliations];
    
    if (newFilters.period) {
      filtered = filtered.filter(item => item.period === newFilters.period);
    }
    
    if (newFilters.status) {
      filtered = filtered.filter(item => item.status === newFilters.status);
    }
    
    setFilteredData(filtered);
  };

  const handleSearch = () => {
    message.success('查询成功');
  };

  const handleReset = () => {
    setFilters({
      period: '',
      status: ''
    });
    setFilteredData(reconciliations);
    message.success('已重置查询条件');
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailDrawerVisible(true);
  };

  const handleViewDetailItem = (item: any, type: '进货' | '退货' | '费用' | '扣款' | '专柜' | '合同扣款' | '促销扣款' | '价外扣款' | '开票汇总') => {
    setSelectedDetailItem(item);
    setDetailModalType(type as any);
    setDetailModalVisible(true);
  };

  const handleViewSalesCost = (record: any) => {
    setSalesCostModalVisible(true);
  };

  const handleDisputeReconciliation = (record: any) => {
    setSelectedRecord(record);
    setDisputeModalVisible(true);
  };

  const handleOpenEarlySettlement = (record: any) => {
    setSelectedRecord(record);
    setSelectedReconciliationIds([]); // 清空批量选择
    setEarlySettlementModalVisible(true);
  };

  const handleBatchEarlySettlement = () => {
    if (selectedReconciliationIds.length === 0) {
      message.warning('请至少选择一个已确认的结算单');
      return;
    }

    const confirmedRecords = filteredData.filter(item =>
      selectedReconciliationIds.includes(item.id) && item.status === 'confirmed'
    );

    if (confirmedRecords.length === 0) {
      message.warning('请选择已确认状态的结算单');
      return;
    }

    setSelectedRecord(null);
    setBatchContractSigned(false);
    setBatchEarlySettlementModalVisible(true);
  };

  const handleBatchExport = () => {
    if (selectedReconciliationIds.length === 0) {
      message.warning('请至少选择一个结算单');
      return;
    }

    // 获取选中的结算单数据
    const selectedRecords = filteredData.filter(item =>
      selectedReconciliationIds.includes(item.id)
    );

    // 模拟导出功能
    message.success(`成功导出 ${selectedRecords.length} 个结算单`);

    // 实际项目中这里应该调用导出API
    console.log('导出数据:', selectedRecords);
  };

  // ========== 电签相关方法 ==========

  // 打开电签确认抽屉
  const handleOpenEsignConfirm = () => {
    // 过滤出选中的未电签记录
    const unsignedRecords = filteredData.filter(item =>
      selectedReconciliationIds.includes(item.id) && item.esign_status !== 'completed'
    );

    if (unsignedRecords.length === 0) {
      message.warning('没有需要电签的结算单');
      return;
    }

    // 构造关联单据数据（入库单、退厂单 mock 数据）
    const docList = unsignedRecords.map(record => ({
      ...record,
      related_docs: [
        { type: '入库单', docs: Array.from({ length: 3 }, (_, i) => ({ id: `IN${record.id}-${i}`, no: `REC${String(i + 1).padStart(14, '0')}`, amount: Math.random() * 10000 })) },
        { type: '退厂单', docs: Array.from({ length: 2 }, (_, i) => ({ id: `OUT${record.id}-${i}`, no: `RET${String(i + 1).padStart(14, '0')}`, amount: -Math.random() * 1000 })) }
      ]
    }));

    setEsignDocList(docList);
    setEsignAgreed(false);
    setEsignConfirmVisible(true);
  };

  // 前往电签平台签署
  const handleGoToEsign = () => {
    if (!esignAgreed) {
      message.warning('请先同意协议条款');
      return;
    }

    // 构造 signData
    const settlement_ids = esignDocList.map(doc => doc.id);
    const files = esignDocList.map(doc => ({
      id: doc.id,
      recon_no: doc.recon_no,
      supplier_name: doc.supplier_name,
      payable_amount: doc.payable_amount
    }));

    const signData = {
      business_type: 'settlement',
      settlement_ids,
      files,
      timestamp: Date.now()
    };

    // 构造 URL 参数并跳转
    const params = new URLSearchParams({
      business_type: signData.business_type,
      data: JSON.stringify(signData)
    });

    const url = `${ESIGN_CONFIG.PLATFORM_URL}?${params.toString()}`;
    window.open(url, '_blank');

    message.success('正在跳转至电签平台...');
  };

  // 模拟电签完成回调
  const handleEsignComplete = () => {
    setEsignSubmitting(true);
    const batchNo = `BATCH-${Date.now()}`;   // 生成批次号，同批结算单共享

    setTimeout(() => {
      const updatedData = reconciliations.map(item => {
        if (esignDocList.some(doc => doc.id === item.id)) {
          return {
            ...item,
            esign_status: 'completed',
            esign_completed_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            esign_file_no: `ESIGN-${Date.now()}-${item.id}`,
            esign_signer: '当前用户',
            esign_batch_no: batchNo,
            invoice_status: item.invoice_status || 'pending'  // 保留原发票状态
          };
        }
        return item;
      });

      setReconciliations(updatedData);
      setFilteredData(updatedData.filter(item =>
        (filters.period ? item.period === filters.period : true) &&
        (filters.status ? item.status === filters.status : true)
      ));

      setEsignSubmitting(false);
      setEsignConfirmVisible(false);
      message.success(`成功完成 ${esignDocList.length} 个结算单的电签`);
    }, 1500);
  };

  // 查看电签文件
  const handleViewEsignFile = (record: any) => {
    setEsignFileRecord(record);
    setEsignFileDrawerVisible(true);
  };

  // 发起发票（改造后跳转到申请页面）— 必须所有选中项均已完成电签
  const handleBatchInvoice = () => {
    if (selectedReconciliationIds.length === 0) {
      message.warning('请至少选择一个结算单');
      return;
    }

    // 再次确认所有选中项均已完成电签（防御性校验）
    const unsignedItems = filteredData.filter(item =>
      selectedReconciliationIds.includes(item.id) && item.esign_status !== 'completed'
    );
    if (unsignedItems.length > 0) {
      message.error(`还有 ${unsignedItems.length} 个结算单未完成电签，无法发起发票`);
      return;
    }

    // 跳转到发票管理页面，传递已选记录
    const completedRecords = filteredData.filter(item =>
      selectedReconciliationIds.includes(item.id)
    );
    navigate('/invoices', { state: { source: 'reconciliation', records: completedRecords } });
  };

  const handleReconciliationRowSelection = {
    selectedRowKeys: selectedReconciliationIds,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedReconciliationIds(selectedKeys);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.status !== 'confirmed',
    }),
  };

  const handleEarlySettlementSubmit = async (values: any) => {
    // 检查发票录入状态
    if (values === null) {
      // 批量模式：检查所有选中记录
      const batchRecords = filteredData.filter(item => selectedReconciliationIds.includes(item.id));
      const unentered = batchRecords.filter(r => r.invoice_status !== 'entered');
      if (unentered.length > 0) {
        message.error(`还有 ${unentered.length} 个结算单未完成发票录入，无法申请提前结算`);
        return;
      }
    } else {
      // 单个模式：检查当前记录
      const record = values?.id ? values : selectedRecord;
      if (record && record.invoice_status !== 'entered') {
        message.error('请先完成该结算单的发票录入，再申请提前结算');
        return;
      }
    }

    setEarlySettlementLoading(true);
    
    // 模拟 API 调用
    setTimeout(() => {
      const application: EarlySettlementApplication = {
        id: 'ES' + Date.now(),
        recon_no: values.settlementId,
        supplier_id: 'SUP001',
        supplier_name: selectedRecord?.supplier_name || '',
        original_amount: selectedRecord?.payable_amount || 0,
        discount_fee: values.calculation.discount_fee,
        net_amount: values.calculation.net_amount,
        original_due_date: selectedRecord?.period + '-01' || '',
        expected_pay_date: values.expectedPayDate.format('YYYY-MM-DD'),
        application_date: dayjs().format('YYYY-MM-DD'),
        days_diff: values.calculation.days_diff,
        daily_rate: values.calculation.daily_rate,
        contact_person: values.contactPerson,
        contact_phone: values.contactPhone,
        agreement_content: values.agreementContent,
        agreement_accepted: values.agreementAccepted,
        status: 'pending_signature',
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
      
      console.log('提前结算申请已提交:', application);
      message.success('提前结算申请已提交成功！');
      setEarlySettlementLoading(false);
      setEarlySettlementModalVisible(false);
      
      // 更新结算单的提前结算状态
      const updatedData = reconciliations.map(item => 
        item.id === selectedRecord?.id 
          ? { ...item, early_settlement_status: 'pending' as const }
          : item
      );
      setReconciliations(updatedData);
      
      // 刷新列表
      fetchReconciliations();
    }, 2000);
  };

  const handleConfirmSubmit = async (values: any) => {
    try {
      // 模拟API调用
      message.success('对账确认成功');
      setConfirmModalVisible(false);
      fetchReconciliations();
    } catch (error) {
      message.error('确认失败');
    }
  };

  const handleDisputeSubmit = async (values: any) => {
    try {
      // 模拟API调用
      message.success('异议申诉已提交');
      setDisputeModalVisible(false);
      fetchReconciliations();
    } catch (error) {
      message.error('提交失败');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'confirmed': return 'green';
      case 'disputed': return 'red';
      case 'settled': return 'blue';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '未核验';
      case 'confirmed': return '已核验';
      case 'settled': return '已结算';
      default: return status;
    }
  };

  const allColumns = [
    { key: 'supplier_name', title: '供应商', dataIndex: 'supplier_name', width: 200 },
    { key: 'recon_no', title: '结算单号', dataIndex: 'recon_no', width: 160 },
    { key: 'period', title: '会计期间', dataIndex: 'period', width: 100 },
    { key: 'settlement_type', title: '结算单类型', dataIndex: 'settlement_type', width: 150 },
    { key: 'status', title: '结算状态', dataIndex: 'status', width: 100 },
    { key: 'early_settlement_status', title: '提前结算', dataIndex: 'early_settlement_status', width: 100 },
    { key: 'esign_status', title: '电子签章', dataIndex: 'esign_status', width: 100 },
    { key: 'is_deduction', title: '是否账扣', dataIndex: 'is_deduction', width: 100 },
    { key: 'purchase_amount', title: '价款', dataIndex: 'purchase_amount', width: 120 },
    { key: 'tax_amount', title: '税额', dataIndex: 'tax_amount', width: 120 },
    { key: 'payable_amount', title: '价税合计', dataIndex: 'payable_amount', width: 120 },
    { key: 'deduction_amount', title: '价外扣款', dataIndex: 'deduction_amount', width: 120 },
    { key: 'actual_amount', title: '实付金额', dataIndex: 'actual_amount', width: 120 },
    { key: 'created_at', title: '创建时间', dataIndex: 'created_at', width: 140 },
    { key: 'confirmed_at', title: '确认时间', dataIndex: 'confirmed_at', width: 140 },
  ];

  const columns = allColumns
    .filter(col => visibleColumns.includes(col.key))
    .map((col: any) => {
      if (col.dataIndex === 'recon_no') {
        return {
          ...col,
          render: (text: string) => (
            <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
          )
        };
      }
      if (col.dataIndex === 'status') {
        return {
          ...col,
          render: (status: string) => (
            <Tag color={getStatusColor(status)}>
              {getStatusText(status)}
            </Tag>
          )
        };
      }
      if (col.dataIndex === 'early_settlement_status') {
        return {
          ...col,
          render: (esStatus: string) => {
            if (!esStatus) return '-';
            const statusMap: any = {
              pending: { color: 'orange', text: '申请中' },
              approved: { color: 'green', text: '已批准' },
              financing: { color: 'blue', text: '已融资' },
              rejected: { color: 'red', text: '已拒绝' }
            };
            const config = statusMap[esStatus] || { color: 'default', text: esStatus };
            return <Tag color={config.color}>{config.text}</Tag>;
          }
        };
      }
      if (col.dataIndex === 'esign_status') {
        return {
          ...col,
          render: (esignStatus: string, record: any) => (
            <span>
              <Tag color={esignStatus === 'completed' ? 'green' : 'orange'}>
                {esignStatus === 'completed' ? '已完成' : '未完成'}
              </Tag>
              {esignStatus === 'completed' && (
                <Button
                  type="link"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => {}}
                />
              )}
            </span>
          )
        };
      }
      if (col.dataIndex === 'is_deduction') {
        return {
          ...col,
          render: (isDeduction: boolean) => (
            <Tag color={isDeduction ? 'red' : 'default'}>
              {isDeduction ? '是' : '否'}
            </Tag>
          )
        };
      }
      if (col.dataIndex === 'payable_amount' || col.dataIndex === 'actual_amount') {
        return {
          ...col,
          render: (amount: number) => (
            <div style={{ fontWeight: 'bold', color: '#f5222d', fontSize: '16px' }}>
              ¥{amount.toLocaleString()}
            </div>
          )
        };
      }
      if (['purchase_amount', 'tax_amount', 'deduction_amount'].includes(col.dataIndex)) {
        return {
          ...col,
          render: (amount: number) => `¥${amount?.toLocaleString()}`
        };
      }
      if (col.dataIndex === 'created_at' || col.dataIndex === 'confirmed_at') {
        return {
          ...col,
          render: (date: string) => date ? dayjs(date).format('MM-DD HH:mm') : '-'
        };
      }
      return col;
    });

  // 添加操作列（固定显示）
  const actionColumn = {
    title: '操作',
    key: 'actions',
    width: 160,
    fixed: 'right' as const,
    render: (_: any, record: any) => (
      <Space size="small">
        <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
          查看
        </Button>
        {record.esign_status === 'completed' && (
          <Button type="link" size="small" onClick={() => {}}>
            电签文件
          </Button>
        )}
      </Space>
    )
  };

  const tableColumns = [...columns, actionColumn];

  // 电签相关计算属性
  // 是否有待电签的选中项
  const hasUnsignedEsign = selectedReconciliationIds.some(id => {
    const r = filteredData.find(item => item.id === id);
    return r && r.esign_status !== 'completed';
  });
  // 所有选中项是否都已完成电签
  const allEsignCompleted = selectedReconciliationIds.length > 0 &&
    selectedReconciliationIds.every(id => {
      const r = filteredData.find(item => item.id === id);
      return r && r.esign_status === 'completed';
    });
  // 需要电签的数量
  const needEsignCount = selectedReconciliationIds.filter(id => {
    const r = filteredData.find(item => item.id === id);
    return r && r.esign_status !== 'completed';
  }).length;

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col xs={24} sm={12} lg={4}>
          <Card size="small">
            <Statistic
              title="未核验结算单"
              value={filteredData.filter(item => item.status === 'pending').length}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card size="small">
            <Statistic
              title="已核验结算单"
              value={filteredData.filter(item => item.status === 'confirmed').length}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="本月应付总额"
              value={filteredData
                .filter(item => item.period === '202603' && item.status !== 'settled')
                .reduce((sum, item) => sum + item.payable_amount, 0)}
            prefix="¥"
            valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主卡片 */}
      <Card>
        {/* 筛选条件 */}
        <AdvancedSearchFilter
          fields={[
            { key: 'period', label: '会计期间', type: 'select', placeholder: '请选择期间',
              options: [
                { label: '2026年3月', value: '202603' },
                { label: '2026年2月', value: '202602' }
              ]
            },
            { key: 'status', label: '结算状态', type: 'select', placeholder: '请选择状态',
              options: [
                { label: '未核验', value: 'pending' },
                { label: '已核验', value: 'confirmed' },
                { label: '已结算', value: 'settled' }
              ]
            },
            { key: 'settlement_no', label: '结算单号', type: 'input', placeholder: '请输入结算单号' },
            { key: 'supplier_name', label: '供应商名称', type: 'input', placeholder: '请输入供应商名称' }
          ]}
          values={filters}
          onChange={(k, v) => handleFilterChange({ ...filters, [k]: v })}
          onSearch={() => handleSearch()}
          onReset={() => handleReset()}
        />

        {/* 操作按钮 */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={handleBatchEarlySettlement}
              disabled={selectedReconciliationIds.length === 0}
              style={{ height: 32 }}
            >
              提前结算 {selectedReconciliationIds.length > 0 ? `(${selectedReconciliationIds.length})` : ''}
            </Button>

            {/* 互斥逻辑：未电签 → 显示电签确认；全部已电签 → 显示发起发票 */}
            {selectedReconciliationIds.length > 0 && hasUnsignedEsign ? (
              <Button type="primary" icon={<SignatureOutlined />} onClick={handleOpenEsignConfirm} style={{ height: 32 }}>
                电签确认{needEsignCount > 0 ? `(${needEsignCount})` : ''}
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={handleBatchInvoice}
                disabled={selectedReconciliationIds.length === 0}
                style={{ height: 32 }}
              >
                发起发票 {selectedReconciliationIds.length > 0 ? `(${selectedReconciliationIds.length})` : ''}
              </Button>
            )}

            <Button icon={<FileTextOutlined />} onClick={handleBatchExport} style={{ height: 32 }}>
              导出
            </Button>
          </Space>
          <Space>
            <Button icon={<SettingOutlined />} onClick={() => setColumnFilterVisible(true)} style={{ height: 32 }}>
              列设置
            </Button>
          </Space>
        </div>

        {/* 未电签提示 Alert */}
        {selectedReconciliationIds.length > 0 && hasUnsignedEsign && (
          <Alert
            message="所选结算单中存在未电签记录，请先完成电签确认后再发起发票"
            type="warning"
            showIcon
            closable
            style={{ marginBottom: 16 }}
          />
        )}

        {/* 数据表格 */}
        <Table
          columns={tableColumns}
          dataSource={filteredData}
          loading={loading}
          rowKey="id"
          rowSelection={handleReconciliationRowSelection}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 字段筛选抽屉 */}
      <Drawer
        title="列设置"
        placement="right"
        width={320}
        onClose={() => setColumnFilterVisible(false)}
        open={columnFilterVisible}
      >
        <div style={{ marginBottom: '16px' }}>
          <Text strong>选择要显示的字段</Text>
        </div>
        <Checkbox.Group
          value={visibleColumns}
          onChange={(checkedValues) => setVisibleColumns(checkedValues as string[])}
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          {allColumns.map((col: any) => (
            <Checkbox key={col.key} value={col.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>{col.title}</span>
                <span style={{ color: '#999', fontSize: '12px' }}>{col.dataIndex}</span>
              </div>
            </Checkbox>
          ))}
        </Checkbox.Group>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            size="small"
            onClick={() => {
              setVisibleColumns(allColumns.map(col => col.key));
            }}
          >
            全选
          </Button>
          <Button
            size="small"
            onClick={() => {
              setVisibleColumns(['supplier_name', 'recon_no', 'period', 'status', 'esign_status', 'payable_amount', 'actual_amount']);
            }}
          >
            只显示重要字段
          </Button>
          <Button
            size="small"
            onClick={() => {
              setVisibleColumns([
                'supplier_name',
                'recon_no',
                'period',
                'settlement_type',
                'status',
                'esign_status',
                'is_deduction',
                'payable_amount',
                'actual_amount'
              ]);
            }}
          >
            恢复默认
          </Button>
        </div>
      </Drawer>

      {/* 对账单详情抽屉 */}
      <Drawer
        title={`结算单详情 - ${selectedRecord?.recon_no}`}
        placement="right"
        width={720}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
      >
        {selectedRecord && (
          <div>
            <Title level={5} style={{ marginBottom: '16px' }}>基本信息</Title>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="供应商">{selectedRecord.supplier_name}</Descriptions.Item>
              <Descriptions.Item label="供应商类型">{selectedRecord.supplier_type}</Descriptions.Item>
              <Descriptions.Item label="结算单号">{selectedRecord.recon_no}</Descriptions.Item>
              <Descriptions.Item label="结算单类型">{selectedRecord.settlement_type}</Descriptions.Item>
              <Descriptions.Item label="签订法人">{selectedRecord.legal_person}</Descriptions.Item>
              <Descriptions.Item label="结算方式">{selectedRecord.settlement_method}</Descriptions.Item>
              <Descriptions.Item label="会计期间">{selectedRecord.period}</Descriptions.Item>
              <Descriptions.Item label="税率">{(selectedRecord.tax_rate * 100).toFixed(0)}%</Descriptions.Item>
              <Descriptions.Item label="结算状态">
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {getStatusText(selectedRecord.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="电子签章">
                <span>
                  <Tag color={selectedRecord.esign_status === 'completed' ? 'green' : 'orange'}>
                    {selectedRecord.esign_status === 'completed' ? '已完成' : '未完成'}
                  </Tag>
                  {selectedRecord.esign_status === 'completed' && (
                    <Button type="link" size="small" onClick={() => {}}>
                      查看文件
                    </Button>
                  )}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="付款日期">
                {selectedRecord.payment_date || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="付款金额">
                ¥{selectedRecord.payment_amount?.toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginBottom: '16px' }}>金额信息</Title>
            <Card size="small" style={{ marginBottom: '24px' }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="价款">
                  <Text strong style={{ color: '#1890ff', fontSize: '14px' }}>
                    ¥{selectedRecord.purchase_amount?.toLocaleString() || '0.00'}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="税额">
                  ¥{selectedRecord.tax_amount?.toLocaleString() || '0.00'}
                </Descriptions.Item>
                <Descriptions.Item label="价税合计">
                  <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                    ¥{selectedRecord.payable_amount?.toLocaleString() || '0.00'}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="价外扣款">
                  ¥{selectedRecord.deduction_amount?.toLocaleString() || '0.00'}
                </Descriptions.Item>
                <Descriptions.Item label="实付金额">
                  <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                    ¥{selectedRecord.actual_amount?.toLocaleString() || '0.00'}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Title level={5} style={{ marginBottom: '16px' }}>对账明细</Title>
            <Card size="small" style={{ marginBottom: '24px' }}>
              {selectedRecord.settlement_type === '租赁结算对账单' ? (
                // 租赁结算对账单样式 - 统一表格布局
                <div>
                  {/* 表头 */}
                  <Row gutter={16} style={{ marginBottom: '12px', alignItems: 'center', borderBottom: '1px solid #e8e8e8', paddingBottom: '8px' }}>
                    <Col span={8}>
                      <Text strong>项目名称</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong>金额</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong>数量</Text>
                    </Col>
                    <Col span={6}>
                      <Text strong>操作</Text>
                    </Col>
                  </Row>
                  
                  {/* 本期代收销货款 */}
                  <Row gutter={16} style={{ marginBottom: '12px', alignItems: 'center' }}>
                    <Col span={8}>
                      <Text>本期代收销货款</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong style={{ color: '#1890ff' }}>¥{selectedRecord.sales_amount?.toLocaleString()}</Text>
                    </Col>
                    <Col span={5}>
                      <Text>销售专柜共 {selectedRecord.counter_count || 1} 个</Text>
                    </Col>
                    <Col span={6}>
                      <Button type="link" size="small" onClick={() => handleViewDetailItem({ type: '销售专柜' }, '专柜')}>
                        查看明细
                      </Button>
                    </Col>
                  </Row>

                  {/* 本期应收费用总金额 */}
                  <Row gutter={16} style={{ marginBottom: '12px', alignItems: 'center' }}>
                    <Col span={8}>
                      <Text strong>本期应收费用总金额</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong style={{ color: '#1890ff' }}>¥{(selectedRecord.rental_amount + selectedRecord.other_amount)?.toLocaleString()}</Text>
                    </Col>
                    <Col span={5}>
                      <Text>包含费用共 {(selectedRecord.rental_fee_count || 0) + (selectedRecord.other_fee_count || 0)} 条</Text>
                    </Col>
                    <Col span={6}>
                      <Text>-</Text>
                    </Col>
                  </Row>

                  {/* 其中租金费用 */}
                  <Row gutter={16} style={{ marginBottom: '12px', alignItems: 'center' }}>
                    <Col span={8}>
                      <Text>其中租金费用</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong style={{ color: '#1890ff' }}>¥{selectedRecord.rental_amount?.toLocaleString()}</Text>
                    </Col>
                    <Col span={5}>
                      <Text>包含费用共 {selectedRecord.rental_fee_count || 2} 条</Text>
                    </Col>
                    <Col span={6}>
                      <Button type="link" size="small" onClick={() => handleViewDetailItem({ type: '租金费用' }, '费用')}>
                        查看明细
                      </Button>
                    </Col>
                  </Row>

                  {/* 其中其他费用 */}
                  <Row gutter={16} style={{ marginBottom: '12px', alignItems: 'center', borderTop: '1px solid #e8e8e8', paddingTop: '12px' }}>
                    <Col span={8}>
                      <Text>其中其他费用</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong style={{ color: '#1890ff' }}>¥{selectedRecord.other_amount?.toLocaleString()}</Text>
                    </Col>
                    <Col span={5}>
                      <Text>包含费用共 {selectedRecord.other_fee_count || 15} 条</Text>
                    </Col>
                    <Col span={6}>
                      <Button type="link" size="small" onClick={() => handleViewDetailItem({ type: '其他费用' }, '费用')}>
                        查看明细
                      </Button>
                    </Col>
                  </Row>
                </div>
              ) : selectedRecord.settlement_type === '专柜结算对账单' ? (
                // 专柜结算对账单样式 - 使用表格布局
                <div>
                  {/* 顶部汇总按钮 */}
                  <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                    <Button type="primary" size="small" onClick={() => handleViewDetailItem({ type: '开票汇总' }, '开票汇总')}>
                      查看开票汇总
                    </Button>
                  </div>

                  {/* 表头 */}
                  <Row gutter={16} style={{ marginBottom: '12px', alignItems: 'center', borderBottom: '1px solid #e8e8e8', paddingBottom: '8px' }}>
                    <Col span={8}>
                      <Text strong>项目名称</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong>金额</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong>数量</Text>
                    </Col>
                    <Col span={6}>
                      <Text strong>操作</Text>
                    </Col>
                  </Row>
                  
                  <Row gutter={16} style={{ marginBottom: '12px', alignItems: 'center' }}>
                    <Col span={8}>
                      <Text>本期销售金额</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong style={{ color: '#1890ff' }}>¥{selectedRecord.sales_amount?.toLocaleString()}</Text>
                    </Col>
                    <Col span={5}>
                      <Text>销售专柜共 {selectedRecord.items?.find((i: any) => i.type.includes('销售金额'))?.count || 0} 个</Text>
                    </Col>
                    <Col span={6}>
                      <Button type="link" size="small" onClick={() => handleViewDetailItem({ type: '销售金额' }, '专柜')}>
                        查看明细
                      </Button>
                    </Col>
                  </Row>

                  <Row gutter={16} style={{ marginBottom: '12px', alignItems: 'center' }}>
                    <Col span={8}>
                      <Text>合同扣款 (含税)</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong style={{ color: '#f5222d' }}>¥{selectedRecord.contract_deduction?.toLocaleString()}</Text>
                    </Col>
                    <Col span={5}>
                      <Text>包含费用共 {selectedRecord.items?.find((i: any) => i.type.includes('合同扣款'))?.count || 0} 条</Text>
                    </Col>
                    <Col span={6}>
                      <Button type="link" size="small" onClick={() => handleViewDetailItem({ type: '合同扣款' }, '合同扣款')}>
                        查看明细
                      </Button>
                    </Col>
                  </Row>

                  <Row gutter={16} style={{ marginBottom: '12px', alignItems: 'center' }}>
                    <Col span={8}>
                      <Text>促销扣款 (含税)</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong style={{ color: '#f5222d' }}>¥{selectedRecord.promotion_deduction?.toLocaleString()}</Text>
                    </Col>
                    <Col span={5}>
                      <Text>包含费用共 {selectedRecord.items?.find((i: any) => i.type.includes('促销扣款'))?.count || 0} 条</Text>
                    </Col>
                    <Col span={6}>
                      <Button type="link" size="small" onClick={() => handleViewDetailItem({ type: '促销扣款' }, '促销扣款')}>
                        查看明细
                      </Button>
                    </Col>
                  </Row>

                  <Row gutter={16} style={{ marginBottom: '12px', alignItems: 'center', borderTop: '1px solid #e8e8e8', paddingTop: '12px' }}>
                    <Col span={8}>
                      <Text strong>本期价外扣款金额</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong style={{ color: '#f5222d' }}>¥{selectedRecord.deduction_amount?.toLocaleString()}</Text>
                    </Col>
                    <Col span={5}>
                      <Text>包含费用共 {selectedRecord.items?.find((i: any) => i.type.includes('价外扣款'))?.count || 0} 条</Text>
                    </Col>
                    <Col span={6}>
                      <Button type="link" size="small" onClick={() => handleViewDetailItem({ type: '价外扣款' }, '价外扣款')}>
                        查看明细
                      </Button>
                    </Col>
                  </Row>
                </div>
              ) : (
                // 其他类型结算单样式 - 统一采用表格布局（专柜样式）
                <div>
                  {/* 表头 */}
                  <Row gutter={16} style={{ marginBottom: '12px', alignItems: 'center', borderBottom: '1px solid #e8e8e8', paddingBottom: '8px' }}>
                    <Col span={8}>
                      <Text strong>项目名称</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong>金额</Text>
                    </Col>
                    <Col span={5}>
                      <Text strong>数量</Text>
                    </Col>
                    <Col span={6}>
                      <Text strong>操作</Text>
                    </Col>
                  </Row>
                  
                  {/* 进货/退货项目 */}
                  {selectedRecord.items?.filter((item: any) => item.type.includes('进货') || item.type.includes('退货')).map((item: any, index: number) => {
                    let detailType: '进货' | '退货' = item.type.includes('进货') ? '进货' : '退货';
                    return (
                      <Row key={index} gutter={16} style={{ marginBottom: '12px', alignItems: 'center' }}>
                        <Col span={8}>
                          <Text>{item.type}</Text>
                        </Col>
                        <Col span={5}>
                          <Text strong style={{ color: '#1890ff' }}>¥{item.amount.toLocaleString()}</Text>
                        </Col>
                        <Col span={5}>
                          <Text>{item.countType === '份' ? `${item.count} 份` : item.countType === '个' ? `${item.count} 个` : `${item.count} 条`}</Text>
                        </Col>
                        <Col span={6}>
                          <Button type="link" size="small" onClick={() => handleViewDetailItem(item, detailType)}>
                            查看明细
                          </Button>
                        </Col>
                      </Row>
                    );
                  })}
                  
                  {/* 费用/扣款项目 */}
                  {selectedRecord.items?.filter((item: any) => item.type.includes('费用') || item.type.includes('扣款')).map((item: any, index: number) => {
                    let detailType: '费用' | '扣款' = item.type.includes('费用') ? '费用' : '扣款';
                    return (
                      <Row key={index} gutter={16} style={{ marginBottom: '12px', alignItems: 'center' }}>
                        <Col span={8}>
                          <Text>{item.type}</Text>
                        </Col>
                        <Col span={5}>
                          <Text strong style={{ color: item.amount < 0 ? '#f5222d' : '#1890ff' }}>¥{item.amount.toLocaleString()}</Text>
                        </Col>
                        <Col span={5}>
                          <Text>{item.countType === '份' ? `${item.count} 份` : item.countType === '个' ? `${item.count} 个` : `${item.count} 条`}</Text>
                        </Col>
                        <Col span={6}>
                          <Button type="link" size="small" onClick={() => handleViewDetailItem(item, detailType)}>
                            查看明细
                          </Button>
                        </Col>
                      </Row>
                    );
                  })}
                  
                  {/* 销售成本 - 仅代销供应商显示 */}
                  {selectedRecord.settlement_type === '代销结算对账单' && (
                    <Row gutter={16} style={{ marginBottom: '12px', alignItems: 'center', borderTop: '1px solid #e8e8e8', paddingTop: '12px' }}>
                      <Col span={8}>
                        <Text strong>本期销售成本</Text>
                      </Col>
                      <Col span={5}>
                        <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                          ¥{(selectedRecord.purchase_amount * 0.85).toLocaleString()}
                        </Text>
                      </Col>
                      <Col span={5}>
                        <Text>-</Text>
                      </Col>
                      <Col span={6}>
                        <Button type="primary" size="small" onClick={() => handleViewSalesCost(selectedRecord)}>
                          销售商品
                        </Button>
                      </Col>
                    </Row>
                  )}
                </div>
              )}
              
              {/* 销售商品按钮 - 仅代销供应商显示 */}
              {selectedRecord.settlement_type === '代销结算对账单' && (
                <Divider style={{ margin: '16px 0 8px 0' }} />
              )}
              {selectedRecord.settlement_type === '代销结算对账单' && (
                <Row gutter={16} style={{ alignItems: 'center', padding: '8px 0' }}>
                  <Col span={8}>
                    <Text strong>本期销售成本</Text>
                  </Col>
                  <Col span={8}>
                    <Text strong style={{ float: 'right', fontSize: '16px', color: '#1890ff' }}>
                      ¥{(selectedRecord.purchase_amount * 0.85).toLocaleString()}
                    </Text>
                  </Col>
                  <Col span={8}>
                    <Button type="primary" size="small" onClick={() => handleViewSalesCost(selectedRecord)}>
                      销售商品
                    </Button>
                  </Col>
                </Row>
              )}
            </Card>

            <Title level={5} style={{ marginBottom: '16px' }}>开票信息</Title>
            <Card size="small" style={{ marginBottom: '24px' }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="法人">{selectedRecord.legal_person}</Descriptions.Item>
                <Descriptions.Item label="税号">91440300618842912J</Descriptions.Item>
                <Descriptions.Item label="开户行">招商银行深圳福田支行</Descriptions.Item>
                <Descriptions.Item label="银行账号">813586367610001</Descriptions.Item>
                <Descriptions.Item label="地址" span={2}>
                  深圳市南山区中心路（深圳湾段）3018 号天虹大厦 9-14 楼、17-20 楼
                </Descriptions.Item>
                <Descriptions.Item label="联系电话">0755-23652812</Descriptions.Item>
              </Descriptions>
            </Card>

            <Title level={5} style={{ marginBottom: '16px' }}>备注</Title>
            <Input.TextArea
              rows={3}
              placeholder="暂无备注"
              readOnly
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </div>
        )}
      </Drawer>

      {/* 对账异议弹窗 */}
      <Modal
        title="提出对账异议"
        open={disputeModalVisible}
        onCancel={() => setDisputeModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form onFinish={handleDisputeSubmit} layout="vertical">
          {selectedRecord && (
            <>
              <Alert
                message="异议申诉"
                description={`对对账单 ${selectedRecord.recon_no} 提出异议，请详细说明理由`}
                type="warning"
                showIcon
                style={{ marginBottom: '16px' }}
              />

              <Form.Item
                name="dispute_type"
                label="异议类型"
                rules={[{ required: true, message: '请选择异议类型' }]}
              >
                <Select placeholder="选择异议类型">
                  <Select.Option value="amount_error">金额错误</Select.Option>
                  <Select.Option value="item_missing">项目遗漏</Select.Option>
                  <Select.Option value="calculation_error">计算错误</Select.Option>
                  <Select.Option value="other">其他</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="dispute_reason"
                label="异议理由"
                rules={[{ required: true, message: '请详细说明异议理由' }]}
              >
                <Input.TextArea rows={4} placeholder="请详细说明异议的具体原因和依据" />
              </Form.Item>

              <Form.Item
                name="expected_amount"
                label="期望金额"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="如果有具体金额，请填写"
                  prefix="¥"
                />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                  <Button onClick={() => setDisputeModalVisible(false)}>取消</Button>
                  <Button type="primary" htmlType="submit">
                    提交异议
                  </Button>
                </Space>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* 查看明细弹窗 */}
      <Modal
        title={
          detailModalType === '进货' ? '本期进货明细' :
          detailModalType === '退货' ? '本期退货明细' :
          detailModalType === '费用' ? '本期费用明细' :
          detailModalType === '扣款' ? '本期扣款明细' :
          detailModalType === '专柜' ? '销售专柜明细' :
          detailModalType === '开票汇总' ? '专柜开票汇总明细' :
          detailModalType === '合同扣款' ? '合同扣款费用明细' :
          detailModalType === '促销扣款' ? '促销扣款费用明细' :
          detailModalType === '价外扣款' ? '价外扣款明细' :
          '费用明细'
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1000}
      >
        {selectedDetailItem && (
          <div>
            <div style={{ marginBottom: '16px', textAlign: 'right' }}>
              <Space>
                <Button icon={<ExportOutlined />} onClick={() => message.success('导出明细成功')}>
                  导出
                </Button>
                <Button onClick={() => setDetailModalVisible(false)}>
                  关闭
                </Button>
              </Space>
            </div>

            <Table
              columns={
                detailModalType === '费用' && selectedRecord?.settlement_type === '租赁结算对账单' ? [
                  {
                    title: '门店名称',
                    dataIndex: 'store',
                    width: 150,
                    fixed: 'left',
                  },
                  {
                    title: '专柜编码',
                    dataIndex: 'counter_code',
                    width: 120,
                  },
                  {
                    title: '专柜名称',
                    dataIndex: 'counter_name',
                    width: 200,
                  },
                  {
                    title: '费用名称',
                    dataIndex: 'fee_name',
                    width: 150,
                  },
                  {
                    title: '总金额',
                    dataIndex: 'amount',
                    width: 120,
                    align: 'right',
                    render: (val: number) => `¥${val?.toFixed(2)}`
                  },
                  {
                    title: '备注',
                    dataIndex: 'remark',
                    width: 300,
                  },
                  {
                    title: '电签状态',
                    dataIndex: 'esign_status',
                    width: 100,
                    render: () => '待签署'
                  },
                ] : detailModalType === '进货' ? [
                  {
                    title: '入库单号',
                    dataIndex: 'docNo',
                    width: 180,
                  },
                  {
                    title: '入库单位',
                    dataIndex: 'unitName',
                    width: 200,
                  },
                  {
                    title: '进价金额',
                    dataIndex: 'amount',
                    width: 120,
                    align: 'right',
                    render: (val: number) => `¥${val?.toFixed(2)}`
                  },
                  {
                    title: '电签状态',
                    dataIndex: 'esignStatus',
                    width: 100,
                  },
                ] : detailModalType === '退货' ? [
                  {
                    title: '退厂单号',
                    dataIndex: 'docNo',
                    width: 180,
                  },
                  {
                    title: '退厂单位',
                    dataIndex: 'unitName',
                    width: 200,
                  },
                  {
                    title: '退货金额',
                    dataIndex: 'amount',
                    width: 120,
                    align: 'right',
                    render: (val: number) => `¥${val?.toFixed(2)}`
                  },
                  {
                    title: '电签状态',
                    dataIndex: 'esignStatus',
                    width: 100,
                  },
                ] : detailModalType === '专柜' ? [
                  {
                    title: '门店',
                    dataIndex: 'storeName',
                    width: 150,
                  },
                  {
                    title: '专柜编码',
                    dataIndex: 'counterCode',
                    width: 120,
                  },
                  {
                    title: '专柜名称',
                    dataIndex: 'counterName',
                    width: 200,
                  },
                  {
                    title: '本期销售金额',
                    dataIndex: 'salesAmount',
                    width: 120,
                    align: 'right',
                    render: (val: number) => `¥${val?.toFixed(2)}`
                  },
                  {
                    title: '合同扣款',
                    dataIndex: 'contractDeduction',
                    width: 120,
                    align: 'right',
                    render: (val: number) => `¥${val?.toFixed(2)}`
                  },
                  {
                    title: '促销扣款',
                    dataIndex: 'promotionDeduction',
                    width: 120,
                    align: 'right',
                    render: (val: number) => `¥${val?.toFixed(2)}`
                  },
                ] : detailModalType === '开票汇总' ? [
                  {
                    title: '门店',
                    dataIndex: 'storeName',
                    width: 150,
                    fixed: 'left',
                  },
                  {
                    title: '专柜编码',
                    dataIndex: 'counterCode',
                    width: 120,
                  },
                  {
                    title: '专柜名称',
                    dataIndex: 'counterName',
                    width: 200,
                  },
                  {
                    title: '本期销售金额',
                    dataIndex: 'salesAmount',
                    width: 120,
                    align: 'right',
                    render: (val: number) => `¥${val?.toFixed(2)}`
                  },
                  {
                    title: '合同扣款',
                    dataIndex: 'contractDeduction',
                    width: 120,
                    align: 'right',
                    render: (val: number) => `¥${val?.toFixed(2)}`
                  },
                  {
                    title: '促销扣款',
                    dataIndex: 'promotionDeduction',
                    width: 120,
                    align: 'right',
                    render: (val: number) => `¥${val?.toFixed(2)}`
                  },
                ] : detailModalType === '合同扣款' ? [
                  {
                    title: '门店名称',
                    dataIndex: 'storeName',
                    width: 150,
                  },
                  {
                    title: '专柜编码',
                    dataIndex: 'counterCode',
                    width: 120,
                  },
                  {
                    title: '专柜名称',
                    dataIndex: 'counterName',
                    width: 200,
                  },
                  {
                    title: '费用名称',
                    dataIndex: 'feeName',
                    width: 150,
                  },
                  {
                    title: '费用金额',
                    dataIndex: 'amount',
                    width: 120,
                    align: 'right',
                    render: (val: number) => `¥${val?.toFixed(2)}`
                  },
                  {
                    title: '备注',
                    dataIndex: 'remark',
                    width: 150,
                  },
                ] : detailModalType === '促销扣款' ? [
                  {
                    title: '门店名称',
                    dataIndex: 'storeName',
                    width: 150,
                  },
                  {
                    title: '专柜编码',
                    dataIndex: 'counterCode',
                    width: 120,
                  },
                  {
                    title: '专柜名称',
                    dataIndex: 'counterName',
                    width: 200,
                  },
                  {
                    title: '费用名称',
                    dataIndex: 'feeName',
                    width: 150,
                  },
                  {
                    title: '费用金额',
                    dataIndex: 'amount',
                    width: 120,
                    align: 'right',
                    render: (val: number) => `¥${val?.toFixed(2)}`
                  },
                  {
                    title: '备注',
                    dataIndex: 'remark',
                    width: 150,
                  },
                ] : detailModalType === '价外扣款' ? [
                  {
                    title: '门店名称',
                    dataIndex: 'storeName',
                    width: 150,
                  },
                  {
                    title: '费用名称',
                    dataIndex: 'feeName',
                    width: 150,
                  },
                  {
                    title: '总金额',
                    dataIndex: 'amount',
                    width: 120,
                    align: 'right',
                    render: (val: number) => `¥${val?.toFixed(2)}`
                  },
                  {
                    title: '备注',
                    dataIndex: 'remark',
                    width: 300,
                  },
                ] : [
                  {
                    title: '单号',
                    dataIndex: 'docNo',
                    width: 180,
                  },
                  {
                    title: '门店名称',
                    dataIndex: 'storeName',
                    width: 200,
                  },
                  {
                    title: '费用名称',
                    dataIndex: 'feeName',
                    width: 150,
                  },
                  {
                    title: '总金额',
                    dataIndex: 'amount',
                    width: 120,
                    align: 'right',
                    render: (val: number) => `¥${val?.toFixed(2)}`
                  },
                  {
                    title: '备注',
                    dataIndex: 'remark',
                    width: 300,
                  },
                ]
              }
              dataSource={
                detailModalType === '费用' && selectedRecord?.settlement_type === '租赁结算对账单' ? (
                  selectedDetailItem?.type === '租金费用' ? selectedRecord.rental_details?.map((item: any, index: number) => ({
                    key: index,
                    ...item,
                    esign_status: '待签署'
                  })) || [] : selectedRecord.other_details?.map((item: any, index: number) => ({
                    key: index,
                    ...item,
                    esign_status: '待签署'
                  })) || []
                ) : detailModalType === '进货' ? Array.from({ length: 20 }, (_, i) => ({
                  key: i,
                  docNo: `REC${String(i + 1).padStart(14, '0')}`,
                  unitName: i % 2 === 0 ? '深圳东门天虹' : '深圳创业天虹',
                  amount: Math.random() * 10000,
                  esignStatus: '待签署'
                })) : detailModalType === '退货' ? Array.from({ length: 10 }, (_, i) => ({
                  key: i,
                  docNo: `RET${String(i + 1).padStart(14, '0')}`,
                  unitName: i % 2 === 0 ? 'sp@ce 东莞东坑店' : '赣州天虹 (N)',
                  amount: -Math.random() * 1000,
                  esignStatus: '待签署'
                })) : detailModalType === '专柜' ? Array.from({ length: 6 }, (_, i) => ({
                  key: i,
                  storeName: '长沙芙蓉天虹',
                  counterCode: `015011005${i + 1}`,
                  counterName: '周大福黄金珠宝芙蓉天虹店',
                  salesAmount: Math.random() * 1000000 + 100000,
                  contractDeduction: -Math.random() * 50000 - 10000,
                  promotionDeduction: -Math.random() * 500000 - 50000
                })) : detailModalType === '开票汇总' ? Array.from({ length: 7 }, (_, i) => ({
                  key: i,
                  storeName: i < 6 ? '长沙芙蓉天虹' : '合计',
                  counterCode: i < 6 ? `015011005${i + 1}` : '',
                  counterName: i < 6 ? '周大福黄金珠宝芙蓉天虹店' : '',
                  salesAmount: i < 6 ? Math.random() * 1000000 + 100000 : 1696557.10,
                  contractDeduction: i < 6 ? -Math.random() * 50000 - 10000 : -93627.92,
                  promotionDeduction: i < 6 ? -Math.random() * 500000 - 50000 : -874463.75
                })) : detailModalType === '合同扣款' ? Array.from({ length: 6 }, (_, i) => ({
                  key: i,
                  storeName: '长沙芙蓉天虹',
                  counterCode: `015011005${i + 1}`,
                  counterName: '周大福黄金珠宝芙蓉天虹店',
                  feeName: '基本销售提成',
                  amount: -Math.random() * 30000 - 1000,
                  remark: '自动生成'
                })) : detailModalType === '促销扣款' ? Array.from({ length: 6 }, (_, i) => ({
                  key: i,
                  storeName: '长沙芙蓉天虹',
                  counterCode: `015011005${i + 1}`,
                  counterName: '周大福黄金珠宝芙蓉天虹店',
                  feeName: '促销活动扣款',
                  amount: -Math.random() * 100000 - 30000,
                  remark: '自动生成'
                })) : detailModalType === '价外扣款' ? Array.from({ length: 3 }, (_, i) => ({
                  key: i,
                  storeName: '东南区-R3',
                  feeName: '促销服务费',
                  amount: 8.07,
                  remark: '202602 天虹到家优惠券营销活动...'
                })) : Array.from({ length: 3 }, (_, i) => ({
                  key: i,
                  docNo: `DED${String(i + 1).padStart(14, '0')}`,
                  storeName: '东南区-R3',
                  feeName: '促销服务费',
                  amount: 8.07,
                  remark: '202602 天虹到家优惠券营销活动...'
                }))
              }
              pagination={{ pageSize: 10 }}
              scroll={{ y: 400 }}
              size="small"
            />
          </div>
        )}
      </Modal>

      {/* 销售成本明细弹窗 */}
      <Modal
        title="销售商品明细"
        open={salesCostModalVisible}
        onCancel={() => setSalesCostModalVisible(false)}
        footer={null}
        width={1000}
      >
        <div style={{ marginBottom: '16px', textAlign: 'right' }}>
          <Space>
            <Button icon={<ExportOutlined />} onClick={() => message.success('导出明细成功')}>
              导出
            </Button>
            <Button onClick={() => setSalesCostModalVisible(false)}>
              关闭
            </Button>
          </Space>
        </div>

        <Table
          columns={[
            {
              title: '商品编码',
              dataIndex: 'productCode',
              width: 120,
              fixed: 'left',
            },
            {
              title: '商品名称',
              dataIndex: 'productName',
              width: 200,
              fixed: 'left',
            },
            {
              title: '规格',
              dataIndex: 'spec',
              width: 100,
            },
            {
              title: '单位',
              dataIndex: 'unit',
              width: 80,
            },
            {
              title: '数量',
              dataIndex: 'quantity',
              width: 100,
              align: 'right',
              render: (val: number) => val?.toFixed(2)
            },
          ]}
          dataSource={Array.from({ length: 30 }, (_, i) => ({
            key: i,
            productCode: `000${i + 1}`.padStart(8, '0'),
            productName: i % 5 === 0 ? '卡洛塔妮调制羊乳粉' : i % 5 === 1 ? 'A2 浓溶全脂调制乳粉' : i % 5 === 2 ? '营养时光益生菌溶豆' : i % 5 === 3 ? 'a2 至初婴儿配方奶粉' : 'a2 至初较大婴儿配方奶粉',
            spec: i % 5 === 0 ? '400g' : i % 5 === 1 ? '1Kg' : i % 5 === 2 ? '17g' : i % 5 === 3 ? '400g' : '850g',
            unit: i % 5 === 0 ? '罐' : i % 5 === 1 ? '袋' : i % 5 === 2 ? '瓶' : i % 5 === 3 ? '罐' : '罐',
            quantity: Math.floor(Math.random() * 300) + 20
          }))}
          pagination={{ pageSize: 15 }}
          scroll={{ y: 400, x: 800 }}
          size="small"
        />
      </Modal>

      {/* 提前结算申请抽屉（单个） */}
      <Drawer
        title="提前结算申请明细"
        placement="right"
        width={1200}
        open={earlySettlementModalVisible}
        onClose={() => {
          setEarlySettlementModalVisible(false);
          setSelectedRecord(null);
          setContractSigned(false);
        }}
        extra={
          <Space>
            <Button onClick={() => {
              setEarlySettlementModalVisible(false);
              setSelectedRecord(null);
              setContractSigned(false);
            }}>
              关闭
            </Button>
          </Space>
        }
      >
        {selectedRecord && (
          <div>
            {/* 发票状态检查 */}
            {selectedRecord.invoice_status !== 'entered' && (
              <Alert
                message="该结算单尚未完成发票录入"
                description="请先在财务对账中完成电签确认并发起发票录入后，再申请提前结算"
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            {selectedRecord.invoice_status === 'entered' && (
              <Alert
                message="发票录入已完成，可以进行提前结算申请"
                type="success"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            {/* 顶部操作区 */}
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <Space>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleEarlySettlementSubmit(selectedRecord)}
                  disabled={!contractSigned || selectedRecord.invoice_status !== 'entered'}
                >
                  提交
                </Button>
                {!contractSigned ? (
                  <Button 
                    type="default" 
                    icon={<FileTextOutlined />} 
                    onClick={() => setSignContractModalVisible(true)}
                  >
                    签署合同
                  </Button>
                ) : (
                  <Button 
                    type="default" 
                    icon={<EyeOutlined />} 
                    onClick={() => setContractModalVisible(true)}
                  >
                    查看合同
                  </Button>
                )}
              </Space>
              {!contractSigned && (
                <Alert
                  message="请先签署合同后再提交申请"
                  type="warning"
                  showIcon
                  style={{ marginTop: '16px' }}
                />
              )}
            </div>

            {/* 基本信息 */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}>基本信息</Title>
              <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: '4px' }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="申请单号" labelCol={{ span: 24 }}>
                      <Input value="TQJS-2603080001" readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="提交人" labelCol={{ span: 24 }}>
                      <Input value="管理员" readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="申请日" labelCol={{ span: 24 }}>
                      <Input value={dayjs().format('YYYY-MM-DD HH:mm')} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="业务状态" labelCol={{ span: 24 }}>
                      <Tag color="blue">草稿</Tag>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="供应商名称" labelCol={{ span: 24 }}>
                      <Input value={selectedRecord.supplier_name} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="合同电签状态" labelCol={{ span: 24 }}>
                      <Tag color={contractSigned ? 'green' : 'orange'}>
                        {contractSigned ? '已签署' : '未签署'}
                      </Tag>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="提前结算总金额" labelCol={{ span: 24 }}>
                      <Input 
                        value={selectedRecord.payable_amount.toFixed(2)} 
                        readOnly 
                        style={{ textAlign: 'right', fontWeight: 'bold' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="预计服务费" labelCol={{ span: 24 }}>
                      <Input 
                        value={(selectedRecord.payable_amount * 0.00025).toFixed(2)} 
                        readOnly 
                        style={{ textAlign: 'right', color: '#f5222d' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item 
                      label={<span><span style={{ color: 'red' }}>*</span>期望付款日</span>} 
                      labelCol={{ span: 24 }}
                    >
                      <DatePicker style={{ width: '100%' }} defaultValue={dayjs().add(7, 'day')} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item 
                      label={<span><span style={{ color: 'red' }}>*</span>联系人</span>} 
                      labelCol={{ span: 24 }}
                    >
                      <Input defaultValue="王晓" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item 
                      label={<span><span style={{ color: 'red' }}>*</span>联系电话</span>} 
                      labelCol={{ span: 24 }}
                    >
                      <Input defaultValue="13666123446" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="预付付款总金额" labelCol={{ span: 24 }}>
                      <Input 
                        value={selectedRecord.payable_amount.toFixed(2)} 
                        readOnly 
                        style={{ textAlign: 'right', fontWeight: 'bold' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item label="备注" labelCol={{ span: 24 }}>
                      <Input.TextArea rows={2} placeholder="请输入备注" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>

            {/* 结算单明细表格 */}
            <div>
              <Title level={5} style={{ marginBottom: '16px' }}>结算单明细</Title>
              <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                <div style={{ padding: '8px 16px', backgroundColor: '#fafafa', borderBottom: '1px solid #d9d9d9' }}>
                  <Space>
                    <Text type="secondary">已选择 {1} 个结算单</Text>
                  </Space>
                </div>
                <Table
                  columns={[
                    {
                      title: '结算单号',
                      dataIndex: 'recon_no',
                      width: 150,
                    },
                    {
                      title: '结算单类型',
                      dataIndex: 'settlement_type',
                      width: 120,
                    },
                    {
                      title: '价税合计',
                      dataIndex: 'payable_amount',
                      width: 100,
                      align: 'right',
                      render: (val: number) => `¥${val.toFixed(2)}`
                    },
                    {
                      title: '价外扣款',
                      dataIndex: 'deduction_amount',
                      width: 100,
                      align: 'right',
                      render: (val: number) => `¥${val.toFixed(2)}`
                    },
                    {
                      title: '实付金额',
                      dataIndex: 'actual_amount',
                      width: 100,
                      align: 'right',
                      render: (val: number) => `¥${val.toFixed(2)}`
                    },
                    {
                      title: '原合同预计付款日',
                      dataIndex: 'contract_payment_date',
                      width: 120,
                      render: () => '2026-03-20'
                    },
                    {
                      title: '预计提前结算',
                      dataIndex: 'early_settlement_date',
                      width: 120,
                      render: () => dayjs().format('YYYY-MM-DD')
                    },
                    {
                      title: '服务费/商业折扣',
                      dataIndex: 'service_fee',
                      width: 120,
                      align: 'right',
                      render: (_: any, record: any) => (record.payable_amount * 0.00025).toFixed(2)
                    },
                    {
                      title: '预计付款金额',
                      dataIndex: 'payment_amount',
                      width: 100,
                      align: 'right',
                      render: (_: any, record: any) => record.payable_amount.toFixed(2)
                    },
                    {
                      title: '日服务费率',
                      dataIndex: 'daily_rate',
                      width: 100,
                      align: 'right',
                      render: () => '0.00025'
                    },
                  ]}
                  dataSource={[selectedRecord]}
                  pagination={false}
                  scroll={{ x: 1200 }}
                  size="small"
                />
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* 签署合同弹窗 */}
      <Modal
        title="提前结算补充协议 - 在线签署"
        open={signContractModalVisible}
        onCancel={() => setSignContractModalVisible(false)}
        footer={null}
        width={900}
      >
        <div style={{ padding: '24px' }}>
          <Alert
            message="合同签署"
            description="请仔细阅读合同条款，确认无误后点击同意并签署按钮。"
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          
          <div style={{ maxHeight: '500px', overflow: 'auto', border: '1px solid #d9d9d9', padding: '24px', marginBottom: '16px' }}>
            <Title level={4} style={{ textAlign: 'center', marginBottom: '24px' }}>
              提前结算补充协议
            </Title>
            
            <div style={{ lineHeight: '2', fontSize: '14px' }}>
              <p><strong>甲方：</strong>天虹数科商业股份有限公司</p>
              <p><strong>乙方：</strong>{selectedRecord?.supplier_name || '供应商名称'}</p>
              
              <p style={{ textIndent: '24px' }}>
                基于前期甲乙双方前期签署了<strong>采购合同</strong>及其附件，合同编号：<strong>D12-010240620000003</strong>（以下简称"原合同"）。现经甲、乙双方协商，对原合同补充如下：
              </p>
              
              <p style={{ textIndent: '24px' }}>
                现基于乙方经营需求，向甲方申请货款提前结算{selectedReconciliationIds.length > 0 ? '（批量结算单号：' + filteredData.filter(item => selectedReconciliationIds.includes(item.id)).map(item => item.recon_no).join('、') + '）' : '（结算单号：<strong>' + (selectedRecord?.recon_no || 'D13-999260302000001') + '</strong>）'}，提前结算具体金额以甲方客户端网络信息平台展示为准。乙方同意对提前结算的货款给予一定商业折扣，并作为次月价内费用扣除，商业折扣金额详见甲方客户端网络信息平台展示。
              </p>

              <Title level={5} style={{ marginTop: '24px' }}>一、提前结算的商业折扣标准如下：</Title>
              <p style={{ textIndent: '24px' }}>（1）日折扣率为 <strong>0.025%</strong>；</p>
              <p style={{ textIndent: '24px' }}>（2）商业折扣=提前结算金额×日折扣率×提前付款天数。</p>
              <p style={{ textIndent: '24px' }}>（3）提前付款天数=原合同预计付款日 - 提前付款日</p>

              <Title level={5} style={{ marginTop: '24px' }}>二、提前结算票据要求：</Title>
              <p style={{ textIndent: '24px' }}>
                签署本协议后，乙方应尽快寄出票据，并及时在甲方客户端网络信息平台录入票据信息。
              </p>

              <Title level={5} style={{ marginTop: '24px' }}>三、其他条款：</Title>
              <p style={{ textIndent: '24px' }}>
                本协议为原合同不可分割的一部分，具同等法律效力。
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Space size="large">
              <Button onClick={() => setSignContractModalVisible(false)}>
                暂不签署
              </Button>
              <Button 
                type="primary" 
                icon={<CheckOutlined />}
                onClick={() => {
                  if (selectedReconciliationIds.length > 0) {
                    setBatchContractSigned(true);
                  } else {
                    setContractSigned(true);
                  }
                  setSignContractModalVisible(false);
                  message.success('合同签署成功');
                }}
              >
                同意并签署
              </Button>
            </Space>
          </div>
        </div>
      </Modal>

      {/* 查看合同弹窗 */}
      <Modal
        title="提前结算补充协议"
        open={contractModalVisible}
        onCancel={() => setContractModalVisible(false)}
        footer={null}
        width={900}
      >
        <div style={{ padding: '24px', backgroundColor: '#fff' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
            提前结算补充协议
          </Title>
          
          <div style={{ lineHeight: '2', fontSize: '14px' }}>
            <p><strong>甲方：</strong>天虹数科商业股份有限公司</p>
            <p><strong>乙方：</strong>{selectedRecord?.supplier_name || '供应商名称'}</p>
            
            <p style={{ textIndent: '24px' }}>
              基于前期甲乙双方前期签署了<strong>采购合同</strong>及其附件，合同编号：<strong>D12-010240620000003</strong>（以下简称"原合同"）。现经甲、乙双方协商，对原合同补充如下：
            </p>
            
            <p style={{ textIndent: '24px' }}>
              现基于乙方经营需求，向甲方申请货款提前结算（结算单号：<strong>{selectedRecord?.recon_no || 'D13-999260302000001'}</strong>），提前结算具体金额以甲方客户端网络信息平台展示为准。乙方同意对提前结算的货款给予一定商业折扣，并作为次月价内费用扣除，商业折扣金额详见甲方客户端网络信息平台展示。
            </p>

            <Title level={5} style={{ marginTop: '24px' }}>一、提前结算的商业折扣标准如下：</Title>
            <p style={{ textIndent: '24px' }}>（1）日折扣率为 <strong>0.025%</strong>；</p>
            <p style={{ textIndent: '24px' }}>（2）商业折扣=提前结算金额（即结算单的实付金额）*日折扣率*提前付款天数。</p>
            <p style={{ textIndent: '24px' }}>（3）提前付款天数=原合同预计付款日 - 提前付款日</p>
            <p style={{ textIndent: '24px' }}>其中自营月结的"原合同预计付款日"以原合同约定的付款日计算逻辑为准，上述处理天数等时间具体以原合同约定为准。</p>
            <p style={{ textIndent: '24px' }}>（4）甲方提前付款后，乙方将商业折扣同次月的销售与其他价内费用一起合计开票。</p>

            <Title level={5} style={{ marginTop: '24px' }}>二、提前结算票据要求：</Title>
            <p style={{ textIndent: '24px' }}>
              签署本协议后，乙方应尽快寄出票据，并及时在甲方客户端网络信息平台录入票据信息（申请提前结算前已录入票据则无需重复录入），确保甲方在期望付款日期前两到三个工作日收到票据。
            </p>

            <Title level={5} style={{ marginTop: '24px' }}>三、乙方知晓并同意，签署本协议，并不代表甲方确认为乙方提前结算。</Title>

            <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '45%' }}>
                <p><strong>甲方（盖章）：</strong></p>
                <div style={{ height: '100px', border: '1px dashed #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                  天虹数科商业股份有限公司
                </div>
                <p>代表（签字）：</p>
                <p>日期：</p>
              </div>
              <div style={{ width: '45%' }}>
                <p><strong>乙方（盖章）：</strong></p>
                <div style={{ height: '100px', border: '1px dashed #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                  {selectedRecord?.supplier_name || '供应商名称'}
                </div>
                <p>代表（签字）：</p>
                <p>日期：</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* 批量提前结算申请抽屉 */}
      <Drawer
        title="提前结算申请明细（批量）"
        placement="right"
        width={1200}
        open={batchEarlySettlementModalVisible}
        onClose={() => {
          setBatchEarlySettlementModalVisible(false);
          setSelectedReconciliationIds([]);
          setBatchContractSigned(false);
        }}
        extra={
          <Space>
            <Button onClick={() => {
              setBatchEarlySettlementModalVisible(false);
              setSelectedReconciliationIds([]);
              setBatchContractSigned(false);
            }}>
              关闭
            </Button>
          </Space>
        }
      >
        {selectedReconciliationIds.length > 0 && (
          <div>
            {/* 批量发票状态检查 */}
            {(() => {
              const batchRecords = filteredData.filter(item => selectedReconciliationIds.includes(item.id));
              const allInvoiceEntered = batchRecords.every(r => r.invoice_status === 'entered');
              const unenteredCount = batchRecords.filter(r => r.invoice_status !== 'entered').length;
              if (!allInvoiceEntered) {
                return (
                  <Alert
                    message={`有 ${unenteredCount} 个结算单尚未完成发票录入`}
                    description="请先在财务对账中完成电签确认并发起发票录入后，再申请提前结算"
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                );
              }
              return (
                <Alert
                  message="所有选中结算单均已完成发票录入，可以进行提前结算申请"
                  type="success"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              );
            })()}

            {/* 顶部操作区 */}
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <Space>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleEarlySettlementSubmit(null)}
                  disabled={!batchContractSigned || !filteredData.filter(item => selectedReconciliationIds.includes(item.id)).every(r => r.invoice_status === 'entered')}
                >
                  提交
                </Button>
                {!batchContractSigned ? (
                  <Button 
                    type="default" 
                    icon={<FileTextOutlined />} 
                    onClick={() => setSignContractModalVisible(true)}
                  >
                    签署合同
                  </Button>
                ) : (
                  <Button 
                    type="default" 
                    icon={<EyeOutlined />} 
                    onClick={() => setContractModalVisible(true)}
                  >
                    查看合同
                  </Button>
                )}
              </Space>
              {!batchContractSigned && (
                <Alert
                  message="请先签署合同后再提交申请"
                  type="warning"
                  showIcon
                  style={{ marginTop: '16px' }}
                />
              )}
            </div>

            {/* 基本信息 */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}>基本信息</Title>
              <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: '4px' }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="申请单号" labelCol={{ span: 24 }}>
                      <Input value="TQJS-2603080002" readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="提交人" labelCol={{ span: 24 }}>
                      <Input value="管理员" readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="申请日" labelCol={{ span: 24 }}>
                      <Input value={dayjs().format('YYYY-MM-DD HH:mm')} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="业务状态" labelCol={{ span: 24 }}>
                      <Tag color="blue">草稿</Tag>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="合同电签状态" labelCol={{ span: 24 }}>
                      <Tag color={batchContractSigned ? 'green' : 'orange'}>
                        {batchContractSigned ? '已签署' : '未签署'}
                      </Tag>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="提前结算总金额" labelCol={{ span: 24 }}>
                      <Input 
                        value={filteredData
                          .filter(item => selectedReconciliationIds.includes(item.id))
                          .reduce((sum, item) => sum + item.payable_amount, 0).toFixed(2)} 
                        readOnly 
                        style={{ textAlign: 'right', fontWeight: 'bold' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="预计提前结算总服务费" labelCol={{ span: 24 }}>
                      <Input 
                        value={(filteredData
                          .filter(item => selectedReconciliationIds.includes(item.id))
                          .reduce((sum, item) => sum + item.payable_amount, 0) * 0.00025).toFixed(2)} 
                        readOnly 
                        style={{ textAlign: 'right', color: '#f5222d' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item 
                      label={<span><span style={{ color: 'red' }}>*</span>期望付款日</span>} 
                      labelCol={{ span: 24 }}
                    >
                      <DatePicker style={{ width: '100%' }} defaultValue={dayjs().add(7, 'day')} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item 
                      label={<span><span style={{ color: 'red' }}>*</span>联系人</span>} 
                      labelCol={{ span: 24 }}
                    >
                      <Input defaultValue="王晓" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item 
                      label={<span><span style={{ color: 'red' }}>*</span>联系电话</span>} 
                      labelCol={{ span: 24 }}
                    >
                      <Input defaultValue="13666123446" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="预付付款总金额" labelCol={{ span: 24 }}>
                      <Input 
                        value={filteredData
                          .filter(item => selectedReconciliationIds.includes(item.id))
                          .reduce((sum, item) => sum + item.payable_amount, 0).toFixed(2)} 
                        readOnly 
                        style={{ textAlign: 'right', fontWeight: 'bold' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item label="备注" labelCol={{ span: 24 }}>
                      <Input.TextArea rows={2} placeholder="请输入备注" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>

            {/* 结算单明细表格 */}
            <div>
              <Title level={5} style={{ marginBottom: '16px' }}>结算单明细</Title>
              <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                <div style={{ padding: '8px 16px', backgroundColor: '#fafafa', borderBottom: '1px solid #d9d9d9' }}>
                  <Space>
                    <Button size="small" icon={<DeleteOutlined />} danger>
                      删除
                    </Button>
                  </Space>
                </div>
                <Table
                  columns={[
                    {
                      title: '结算单号',
                      dataIndex: 'recon_no',
                      width: 150,
                    },
                    {
                      title: '结算单类型',
                      dataIndex: 'settlement_type',
                      width: 120,
                    },
                    {
                      title: '价税合计',
                      dataIndex: 'payable_amount',
                      width: 100,
                      align: 'right',
                      render: (val: number) => `¥${val.toFixed(2)}`
                    },
                    {
                      title: '价外扣款',
                      dataIndex: 'deduction_amount',
                      width: 100,
                      align: 'right',
                      render: (val: number) => `¥${val.toFixed(2)}`
                    },
                    {
                      title: '实付金额',
                      dataIndex: 'actual_amount',
                      width: 100,
                      align: 'right',
                      render: (val: number) => `¥${val.toFixed(2)}`
                    },
                    {
                      title: '原合同预计付款日',
                      dataIndex: 'contract_payment_date',
                      width: 120,
                      render: () => '2026-03-20'
                    },
                    {
                      title: '预计提前结算',
                      dataIndex: 'early_settlement_date',
                      width: 120,
                      render: () => dayjs().format('YYYY-MM-DD')
                    },
                    {
                      title: '服务费/商业折扣',
                      dataIndex: 'service_fee',
                      width: 120,
                      align: 'right',
                      render: (_: any, record: any) => (record.payable_amount * 0.00025).toFixed(2)
                    },
                    {
                      title: '预计付款金额',
                      dataIndex: 'payment_amount',
                      width: 100,
                      align: 'right',
                      render: (_: any, record: any) => record.payable_amount.toFixed(2)
                    },
                    {
                      title: '日服务费率',
                      dataIndex: 'daily_rate',
                      width: 100,
                      align: 'right',
                      render: () => '0.00025'
                    },
                  ]}
                  dataSource={filteredData.filter(item => selectedReconciliationIds.includes(item.id))}
                  pagination={false}
                  scroll={{ x: 1200 }}
                  size="small"
                />
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* ========== 电签确认 Drawer A ========== */}
      <Drawer
        title="电签确认"
        placement="right"
        width={1000}
        open={esignConfirmVisible}
        onClose={() => setEsignConfirmVisible(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button onClick={() => setEsignConfirmVisible(false)}>
              取消
            </Button>
            <Space>
              {/* Demo 环境：模拟签署完成 */}
              <Button
                icon={<CheckCircleOutlined />}
                onClick={handleEsignComplete}
                disabled={!esignAgreed || esignSubmitting}
                loading={esignSubmitting}
              >
                模拟签署完成
              </Button>
              {/* 生产环境：跳转真实电签平台 */}
              <Button
                type="primary"
                icon={<SignatureOutlined />}
                onClick={handleGoToEsign}
                disabled={!esignAgreed || esignSubmitting}
              >
                前往电签平台签署
              </Button>
            </Space>
          </div>
        }
      >
        {esignDocList.length > 0 && (
          <div>
            {/* Alert 提示 */}
            <Alert
              message="电签确认"
              description={`您即将对以下 ${esignDocList.length} 个结算单进行电子签章，请确认信息无误后点击"前往电签平台签署"按钮。`}
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            {/* 合并电签汇总 — 多选时显示 */}
            {esignDocList.length > 1 && (
              <Card size="small" style={{ marginBottom: '24px', background: '#e6f7ff', border: '1px solid #91d5ff' }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic title="结算单数量" value={esignDocList.length} suffix="个" />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="合计应付金额"
                      value={esignDocList.reduce((sum, d) => sum + (d.payable_amount || 0), 0)}
                      prefix="¥"
                      precision={2}
                    />
                  </Col>
                  <Col span={5}>
                    <Statistic
                      title="关联入库单"
                      value={esignDocList.reduce((sum, d) => sum + (d.related_docs?.[0]?.docs?.length || 0), 0)}
                      suffix="个"
                    />
                  </Col>
                  <Col span={5}>
                    <Statistic
                      title="关联退厂单"
                      value={esignDocList.reduce((sum, d) => sum + (d.related_docs?.[1]?.docs?.length || 0), 0)}
                      suffix="个"
                    />
                  </Col>
                </Row>
              </Card>
            )}

            {/* 待签结算单 Table */}
            <Title level={5} style={{ marginBottom: '16px' }}>待签结算单</Title>
            <Table
              columns={[
                { title: '结算单号', dataIndex: 'recon_no', width: 200 },
                { title: '供应商名称', dataIndex: 'supplier_name', width: 250 },
                {
                  title: '应付金额',
                  dataIndex: 'payable_amount',
                  width: 150,
                  align: 'right',
                  render: (val: number) => `¥${val?.toLocaleString()}`
                }
              ]}
              dataSource={esignDocList}
              pagination={false}
              size="small"
              style={{ marginBottom: '24px' }}
            />

            {/* 关联业务单据 Collapse */}
            <Title level={5} style={{ marginBottom: '16px' }}>关联业务单据</Title>
            <Collapse defaultActiveKey={['1', '2']} style={{ marginBottom: '24px' }}>
              {esignDocList.map((doc, index) => (
                <Collapse.Panel header={`结算单：${doc.recon_no}`} key={`doc-${index}`}>
                  <Collapse defaultActiveKey={['in', 'out']}>
                    <Collapse.Panel header={`入库单（${doc.related_docs?.[0]?.docs?.length || 0} 个）`} key="in">
                      <Table
                        columns={[
                          { title: '入库单号', dataIndex: 'no', width: 200 },
                          { title: '金额', dataIndex: 'amount', width: 150, align: 'right', render: (v: number) => `¥${v?.toFixed(2)}` }
                        ]}
                        dataSource={doc.related_docs?.[0]?.docs || []}
                        pagination={false}
                        size="small"
                      />
                    </Collapse.Panel>
                    <Collapse.Panel header={`退厂单（${doc.related_docs?.[1]?.docs?.length || 0} 个）`} key="out">
                      <Table
                        columns={[
                          { title: '退厂单号', dataIndex: 'no', width: 200 },
                          { title: '金额', dataIndex: 'amount', width: 150, align: 'right', render: (v: number) => `¥${v?.toFixed(2)}` }
                        ]}
                        dataSource={doc.related_docs?.[1]?.docs || []}
                        pagination={false}
                        size="small"
                      />
                    </Collapse.Panel>
                  </Collapse>
                </Collapse.Panel>
              ))}
            </Collapse>

            {/* 协议条款滚动区 */}
            <Title level={5} style={{ marginBottom: '16px' }}>协议条款</Title>
            <div style={{ maxHeight: '300px', overflow: 'auto', border: '1px solid #d9d9d9', padding: '16px', borderRadius: '4px', backgroundColor: '#fafafa', marginBottom: '24px' }}>
              <div style={{ lineHeight: '2', fontSize: '14px' }}>
                <p><strong>电子签章服务协议</strong></p>
                <p>欢迎使用电子签章服务。在使用本服务前，请仔细阅读以下条款：</p>
                <p style={{ textIndent: '24px' }}>1. 本服务基于合法有效的电子签名技术，具有与手写签名同等的法律效力。</p>
                <p style={{ textIndent: '24px' }}>2. 用户应对其账户和密码的安全负责，因用户保管不当造成的损失由用户自行承担。</p>
                <p style={{ textIndent: '24px' }}>3. 用户应确保所签署文件的真实性、合法性和有效性，如因文件内容引起的法律纠纷，由用户自行承担责任。</p>
                <p style={{ textIndent: '24px' }}>4. 本平台将妥善保管用户的签署记录和相关数据，但不对因不可抗力导致的数据丢失承担责任。</p>
                <p style={{ textIndent: '24px' }}>5. 用户有权随时查看已签署的电子文件，并可申请下载或打印。</p>
                <p style={{ textIndent: '24px' }}>6. 如对本协议有任何疑问，请联系客服咨询。</p>
              </div>
            </div>

            {/* Checkbox 同意 */}
            <Checkbox checked={esignAgreed} onChange={(e) => setEsignAgreed(e.target.checked)}>
              我已阅读并同意以上协议条款
            </Checkbox>
          </div>
        )}
      </Drawer>

      {/* ========== 电签文件查看 Drawer B ========== */}
      <Drawer
        title="电签文件详情"
        placement="right"
        width={900}
        open={esignFileDrawerVisible}
        onClose={() => setEsignFileDrawerVisible(false)}
        extra={
          <Space>
            <Button icon={<DownloadOutlined />} onClick={() => message.success('下载成功')}>
              下载
            </Button>
            <Button onClick={() => window.open(ESIGN_CONFIG.FILE_VIEW_URL, '_blank')}>
              查看原文件
            </Button>
          </Space>
        }
      >
        {esignFileRecord && (
          <div>
            {/* 基本信息 Descriptions */}
            <Title level={5} style={{ marginBottom: '16px' }}>基本信息</Title>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="编号">{esignFileRecord.esign_file_no || '-'}</Descriptions.Item>
              <Descriptions.Item label="结算单号">{esignFileRecord.recon_no}</Descriptions.Item>
              <Descriptions.Item label="签署时间">{esignFileRecord.esign_completed_at || '-'}</Descriptions.Item>
              <Descriptions.Item label="签署人">{esignFileRecord.esign_signer || '-'}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color="green">已完成</Tag>
              </Descriptions.Item>
              {esignFileRecord.esign_batch_no && (
                <Descriptions.Item label="电签批次号">
                  <Tag color="blue">{esignFileRecord.esign_batch_no}</Tag>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 已签单据汇总 Table */}
            <Title level={5} style={{ marginBottom: '16px' }}>已签单据汇总</Title>
            <Table
              columns={[
                { title: '结算单号', dataIndex: 'recon_no', width: 200 },
                { title: '供应商名称', dataIndex: 'supplier_name', width: 250 },
                {
                  title: '应付金额',
                  dataIndex: 'payable_amount',
                  width: 150,
                  align: 'right',
                  render: (val: number) => `¥${val?.toLocaleString()}`
                },
                { title: '签署时间', dataIndex: 'esign_completed_at', width: 180 }
              ]}
              dataSource={[esignFileRecord]}
              pagination={false}
              size="small"
              style={{ marginBottom: '24px' }}
            />

            {/* 各单据明细 Collapse */}
            <Title level={5} style={{ marginBottom: '16px' }}>单据明细</Title>
            <Collapse defaultActiveKey={['detail-in', 'detail-out']}>
              <Collapse.Panel header="入库单明细" key="detail-in">
                <Table
                  columns={[
                    { title: '入库单号', dataIndex: 'no', width: 200 },
                    { title: '金额', dataIndex: 'amount', width: 150, align: 'right', render: (v: number) => `¥${v?.toFixed(2)}` },
                    { title: '状态', dataIndex: 'status', width: 100, render: () => <Tag color="green">已签署</Tag> }
                  ]}
                  dataSource={Array.from({ length: 3 }, (_, i) => ({
                    key: i,
                    no: `REC${String(i + 1).padStart(14, '0')}`,
                    amount: Math.random() * 10000,
                    status: 'signed'
                  }))}
                  pagination={false}
                  size="small"
                />
              </Collapse.Panel>
              <Collapse.Panel header="退厂单明细" key="detail-out">
                <Table
                  columns={[
                    { title: '退厂单号', dataIndex: 'no', width: 200 },
                    { title: '金额', dataIndex: 'amount', width: 150, align: 'right', render: (v: number) => `¥${v?.toFixed(2)}` },
                    { title: '状态', dataIndex: 'status', width: 100, render: () => <Tag color="green">已签署</Tag> }
                  ]}
                  dataSource={Array.from({ length: 2 }, (_, i) => ({
                    key: i,
                    no: `RET${String(i + 1).padStart(14, '0')}`,
                    amount: -Math.random() * 1000,
                    status: 'signed'
                  }))}
                  pagination={false}
                  size="small"
                />
              </Collapse.Panel>
            </Collapse>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Reconciliation;
