import React, { useEffect, useState, useRef } from 'react';
import {
  Table,
  Card,
  Row,
  Col,
  Tag,
  Statistic,
  Button,
  Space,
  Input,
  Select,
  message,
  Modal,
  Form,
  Radio,
  Upload,
  Descriptions,
  Typography,
  Alert,
  Checkbox,
  Progress,
  Image,
  Drawer,
  Steps
} from 'antd';
import {
  WalletOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  ExportOutlined,
  EyeOutlined,
  PayCircleOutlined,
  UploadOutlined,
  AiOutlineOutlined,
  DollarOutlined,
  CreditCardOutlined,
  ScanOutlined,
  DeleteOutlined,
  WechatOutlined,
  AlipayCircleOutlined,
  BankOutlined,
  MobileOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import { PAYMENT_CONFIG } from '../config/payment';
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter';

const { Title, Text } = Typography;
const { Option } = Select;

interface PaymentOrder {
  id: string;
  payment_no: string;
  supplier_code: string;
  supplier_name: string;
  period: string;
  legal_entity: string;
  settlement_no: string;
  total_fee_amount: number;
  unpaid_amount: number;
  paid_amount: number;
  status: 'unpaid' | 'partial' | 'paid';
  remark: string;
  created_at: string;
  fee_details: FeeDetail[];
}

interface FeeDetail {
  id: string;
  fee_no: string;
  fee_name: string;
  counter_code: string;
  counter_name: string;
  amount: number;
}

interface PaymentModalData {
  payment_method: 'online' | 'offline';
  amount: number;
  voucher_image?: string;
  transaction_id?: string;
  remark: string;
}

const Payments: React.FC = () => {
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filters, setFilters] = useState({
    payment_no: '',
    period: '',
    status: '',
    supplier_code: ''
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PaymentOrder | null>(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentForm] = Form.useForm();
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const [aiRecognizing, setAiRecognizing] = useState(false);
  const [paymentDrawerVisible, setPaymentDrawerVisible] = useState(false);
  const [batchPaymentDrawerVisible, setBatchPaymentDrawerVisible] = useState(false);
  // 支付方式状态（用于控制表单差异化展示）
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  // 线上支付状态（paying-支付中 | paid-支付成功 | failed-支付失败）
  const [onlinePaymentStatus, setOnlinePaymentStatus] = useState<string>('');
  // 批量交款支付方式状态
  const [batchPaymentMethod, setBatchPaymentMethod] = useState<'online' | 'offline'>('online');
  // 批量线上支付状态
  const [batchOnlinePaymentStatus, setBatchOnlinePaymentStatus] = useState<string>('');
  // 支付轮询定时器
  const paymentPollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPaymentOrders();
  }, []);

  const fetchPaymentOrders = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData: PaymentOrder[] = [
        {
          id: '1',
          payment_no: 'JS20260101001',
          supplier_code: 'SUP001',
          supplier_name: '广东太古可口可乐有限公司深圳营业部',
          period: '202601',
          legal_entity: '深圳天虹商场有限公司',
          settlement_no: 'D13-99926010600012',
          total_fee_amount: 5300,
          unpaid_amount: 5300,
          paid_amount: 0,
          status: 'unpaid',
          remark: '2026 年 1 月费用交款单',
          created_at: '2026-01-20 10:00:00',
          fee_details: [
            {
              id: 'F1',
              fee_no: 'FY20260101001',
              fee_name: '促销服务费',
              counter_code: 'CL001',
              counter_name: '饮料专柜',
              amount: 5300
            }
          ]
        },
        {
          id: '2',
          payment_no: 'JS20260101002',
          supplier_code: 'SUP002',
          supplier_name: '农夫山泉股份有限公司',
          period: '202601',
          legal_entity: '深圳天虹商场有限公司',
          settlement_no: 'D13-99926010600015',
          total_fee_amount: 700,
          unpaid_amount: 350,
          paid_amount: 350,
          status: 'partial',
          remark: '2026 年 1 月质量扣款',
          created_at: '2026-01-22 14:30:00',
          fee_details: [
            {
              id: 'F2',
              fee_no: 'FY20260101002',
              fee_name: '质量扣款',
              counter_code: 'CL002',
              counter_name: '饮用水专柜',
              amount: 700
            }
          ]
        },
        {
          id: '3',
          payment_no: 'JS20260201003',
          supplier_code: 'SUP003',
          supplier_name: '深圳天虹商场有限公司',
          period: '202602',
          legal_entity: '深圳天虹商场有限公司',
          settlement_no: 'D13-99926020600023',
          total_fee_amount: 3180,
          unpaid_amount: 0,
          paid_amount: 3180,
          status: 'paid',
          remark: '2026 年 2 月春节促销费用',
          created_at: '2026-02-15 09:00:00',
          fee_details: [
            {
              id: 'F3',
              fee_no: 'FY20260201003',
              fee_name: '促销服务费',
              counter_code: 'CL003',
              counter_name: '食品专柜',
              amount: 3180
            }
          ]
        },
        {
          id: '4',
          payment_no: 'JS20260201004',
          supplier_code: 'SUP004',
          supplier_name: '华润万家超市有限公司',
          period: '202602',
          legal_entity: '华润万家有限公司',
          settlement_no: 'D13-99926020600025',
          total_fee_amount: 1500,
          unpaid_amount: 1500,
          paid_amount: 0,
          status: 'unpaid',
          remark: '2026 年 2 月延期扣款',
          created_at: '2026-02-18 11:00:00',
          fee_details: [
            {
              id: 'F4',
              fee_no: 'FY20260201004',
              fee_name: '延期扣款',
              counter_code: 'CL004',
              counter_name: '百货专柜',
              amount: 1500
            }
          ]
        },
        {
          id: '5',
          payment_no: 'JS20260201005',
          supplier_code: 'SUP005',
          supplier_name: '娄底市天虹百货有限公司',
          period: '202602',
          legal_entity: '娄底市天虹百货有限公司',
          settlement_no: 'D13-99926020600028',
          total_fee_amount: 1924.82,
          unpaid_amount: 962.41,
          paid_amount: 962.41,
          status: 'partial',
          remark: 'clmp316 自动生成，2026-02-01 至 2026-02-28',
          created_at: '2026-02-20 16:00:00',
          fee_details: [
            {
              id: 'F5',
              fee_no: 'FY20260201005',
              fee_name: '租赁管理费',
              counter_code: 'CL005',
              counter_name: '租赁专柜',
              amount: 1924.82
            }
          ]
        },
        {
          id: '6',
          payment_no: 'JS20260301006',
          supplier_code: 'SUP001',
          supplier_name: '广东太古可口可乐有限公司深圳营业部',
          period: '202603',
          legal_entity: '深圳天虹商场有限公司',
          settlement_no: 'D13-99926030600035',
          total_fee_amount: 8480,
          unpaid_amount: 8480,
          paid_amount: 0,
          status: 'unpaid',
          remark: '315 促销活动费用',
          created_at: '2026-03-05 10:00:00',
          fee_details: [
            {
              id: 'F6',
              fee_no: 'FY20260301006',
              fee_name: '促销服务费',
              counter_code: 'CL001',
              counter_name: '饮料专柜',
              amount: 8480
            }
          ]
        },
        {
          id: '7',
          payment_no: 'JS20260301007',
          supplier_code: 'SUP002',
          supplier_name: '农夫山泉股份有限公司',
          period: '202603',
          legal_entity: '深圳天虹商场有限公司',
          settlement_no: 'D13-99926030600038',
          total_fee_amount: 1272,
          unpaid_amount: 0,
          paid_amount: 1272,
          status: 'paid',
          remark: '2 月消杀服务费用',
          created_at: '2026-03-08 14:30:00',
          fee_details: [
            {
              id: 'F7',
              fee_no: 'FY20260301007',
              fee_name: '服务费',
              counter_code: 'CL002',
              counter_name: '饮用水专柜',
              amount: 1272
            }
          ]
        }
      ];
      setPaymentOrders(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleFilter = () => {
    message.info('筛选功能已实现，实际项目中调用 API');
    console.log('筛选条件:', filters);
  };

  const handleReset = () => {
    setFilters({
      payment_no: '',
      period: '',
      status: '',
      supplier_code: ''
    });
    message.info('筛选条件已重置');
  };

  const handleExport = (record?: PaymentOrder) => {
    if (record) {
      message.success(`已导出交款单 ${record.payment_no} 的明细`);
    } else {
      message.success('导出成功！已下载交款单报表.xlsx');
      console.log('导出数据:', paymentOrders);
    }
  };

  const handleBatchExport = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择需要导出的交款单');
      return;
    }
    message.success(`已导出 ${selectedRowKeys.length} 个交款单`);
    setSelectedRowKeys([]);
  };

  const handleViewDetail = (record: PaymentOrder) => {
    setSelectedOrder(record);
    setDetailModalVisible(true);
  };

  const handlePayment = (record?: PaymentOrder) => {
    if (record) {
      setSelectedOrder(record);
      paymentForm.setFieldsValue({
        payment_method: 'online',
        amount: record.unpaid_amount,
        remark: ''
      });
      setPaymentDrawerVisible(true);
    } else if (selectedRowKeys.length > 0) {
      setBatchPaymentDrawerVisible(true);
    } else {
      message.warning('请选择需要交款的交款单');
    }
  };

  const handleBatchPayment = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择需要交款的交款单');
      return;
    }
    setBatchPaymentDrawerVisible(true);
  };

  const handleSubmitPayment = async () => {
    try {
      const values = await paymentForm.validateFields();
      if (values.payment_method === 'offline' && uploadFileList.length === 0) {
        message.warning('请上传转账凭证');
        return;
      }

      message.success('交款成功！');
      setPaymentDrawerVisible(false);
      paymentForm.resetFields();
      setUploadFileList([]);
      fetchPaymentOrders();
    } catch (error) {
      console.error('交款失败:', error);
    }
  };

  const handleBatchSubmitPayment = async () => {
    try {
      const values = await paymentForm.validateFields();
      if (values.payment_method === 'offline' && uploadFileList.length === 0) {
        message.warning('请上传转账凭证');
        return;
      }

      message.success(`批量交款成功！共处理 ${selectedRowKeys.length} 个交款单`);
      setBatchPaymentDrawerVisible(false);
      paymentForm.resetFields();
      setUploadFileList([]);
      setSelectedRowKeys([]);
      fetchPaymentOrders();
    } catch (error) {
      console.error('批量交款失败:', error);
    }
  };

  const handleAIRecognize = async () => {
    if (uploadFileList.length === 0) {
      message.warning('请先上传转账凭证图片');
      return;
    }

    setAiRecognizing(true);
    setTimeout(() => {
      paymentForm.setFieldsValue({
        transaction_id: 'TR20260308001234567890',
        amount: selectedOrder?.unpaid_amount || 0
      });
      message.success('AI 识别成功！已自动填充转账信息');
      setAiRecognizing(false);
    }, 2000);
  };

  // 前往支付平台（单个交款）
  const handleGoToPayPlatform = () => {
    if (!selectedOrder) return;

    const payData = {
      payment_no: selectedOrder.payment_no,
      supplier_code: selectedOrder.supplier_code,
      supplier_name: selectedOrder.supplier_name,
      amount: selectedOrder.unpaid_amount,
      settlement_no: selectedOrder.settlement_no,
      business_type: 'supplier_payment',
      timestamp: Date.now()
    };

    const params = new URLSearchParams({
      business_type: payData.business_type,
      data: JSON.stringify(payData)
    });

    const url = `${PAYMENT_CONFIG.GATEWAY_URL}?${params.toString()}`;
    window.open(url, '_blank');

    setOnlinePaymentStatus('paying');
    message.success('正在跳转至支付平台，请在新窗口完成支付...');
    startPaymentPolling('single');
  };

  // 前往支付平台（批量交款）
  const handleGoToBatchPayPlatform = () => {
    const selectedOrders = paymentOrders.filter(item => selectedRowKeys.includes(item.id));
    if (selectedOrders.length === 0) return;

    const totalAmount = selectedOrders.reduce((sum, item) => sum + item.unpaid_amount, 0);

    const payData = {
      batch_payment_no: `BATCH-${Date.now()}`,
      payment_nos: selectedOrders.map(o => o.payment_no),
      supplier_codes: [...new Set(selectedOrders.map(o => o.supplier_code))],
      total_amount: totalAmount,
      settlement_nos: selectedOrders.map(o => o.settlement_no),
      business_type: 'supplier_batch_payment',
      timestamp: Date.now()
    };

    const params = new URLSearchParams({
      business_type: payData.business_type,
      data: JSON.stringify(payData)
    });

    const url = `${PAYMENT_CONFIG.GATEWAY_URL}?${params.toString()}`;
    window.open(url, '_blank');

    setBatchOnlinePaymentStatus('paying');
    message.success(`正在跳转至支付平台，共 ${selectedOrders.length} 笔订单，合计 ¥${totalAmount.toLocaleString()}...`);
    startPaymentPolling('batch');
  };

  // 启动支付结果轮询
  const startPaymentPolling = (mode: 'single' | 'batch') => {
    stopPaymentPolling();
    // Demo环境：仅做日志输出，实际项目应调用 PAYMENT_CONFIG.QUERY_URL 查询支付状态
    const timer = setInterval(() => {
      console.log('查询支付结果中...', mode);
    }, 5000);
    paymentPollingTimerRef.current = timer;
  };

  // 停止支付结果轮询
  const stopPaymentPolling = () => {
    if (paymentPollingTimerRef.current) {
      clearInterval(paymentPollingTimerRef.current);
      paymentPollingTimerRef.current = null;
    }
  };

  // Demo环境：模拟单个交款支付完成回调
  const handleSimulatePaymentComplete = () => {
    stopPaymentPolling();
    setOnlinePaymentStatus('paid');
    message.success('支付成功！交款单状态已更新');
    setTimeout(() => {
      handlePaymentDrawerClose();
      fetchPaymentOrders();
    }, 1500);
  };

  // Demo环境：模拟批量交款支付完成回调
  const handleBatchSimulatePaymentComplete = () => {
    stopPaymentPolling();
    setBatchOnlinePaymentStatus('paid');
    message.success(`批量支付成功！共处理 ${selectedRowKeys.length} 个交款单`);
    setTimeout(() => {
      handleBatchPaymentDrawerClose();
      fetchPaymentOrders();
    }, 1500);
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setUploadFileList(fileList);
  };

  const handleDetailModalClose = () => {
    setDetailModalVisible(false);
    setSelectedOrder(null);
  };

  const handlePaymentDrawerClose = () => {
    stopPaymentPolling();
    setPaymentDrawerVisible(false);
    setSelectedOrder(null);
    paymentForm.resetFields();
    setUploadFileList([]);
    setPaymentMethod('online');
    setOnlinePaymentStatus('');
  };

  const handleBatchPaymentDrawerClose = () => {
    stopPaymentPolling();
    setBatchPaymentDrawerVisible(false);
    paymentForm.resetFields();
    setUploadFileList([]);
    setBatchPaymentMethod('online');
    setBatchOnlinePaymentStatus('');
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      unpaid: { color: 'orange', text: '未交款' },
      partial: { color: 'blue', text: '部分交款' },
      paid: { color: 'green', text: '已交款' }
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  const columns = [
    {
      title: '交款汇总单号',
      dataIndex: 'payment_no',
      key: 'payment_no',
      width: 160,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '供应商编号',
      dataIndex: 'supplier_code',
      key: 'supplier_code',
      width: 120
    },
    {
      title: '供应商名称',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 200,
      ellipsis: true
    },
    {
      title: '会计期间',
      dataIndex: 'period',
      key: 'period',
      width: 100,
      render: (period: string) => (
        <Tag color="geekblue">{period}</Tag>
      )
    },
    {
      title: '签订法人',
      dataIndex: 'legal_entity',
      key: 'legal_entity',
      width: 150,
      ellipsis: true
    },
    {
      title: '关联结算单号',
      dataIndex: 'settlement_no',
      key: 'settlement_no',
      width: 160,
      render: (text: string) => (
        <Text copyable style={{ color: '#1890ff' }}>{text}</Text>
      )
    },
    {
      title: '费用金额合计',
      dataIndex: 'total_fee_amount',
      key: 'total_fee_amount',
      width: 130,
      align: 'right' as const,
      render: (amount: number) => (
        <Text>¥{amount?.toLocaleString()}</Text>
      )
    },
    {
      title: '未交金额合计',
      dataIndex: 'unpaid_amount',
      key: 'unpaid_amount',
      width: 130,
      align: 'right' as const,
      render: (amount: number) => (
        <Text strong style={{ color: '#f5222d' }}>¥{amount?.toLocaleString()}</Text>
      )
    },
    {
      title: '已交金额合计',
      dataIndex: 'paid_amount',
      key: 'paid_amount',
      width: 130,
      align: 'right' as const,
      render: (amount: number) => (
        <Text strong style={{ color: '#52c41a' }}>¥{amount?.toLocaleString()}</Text>
      )
    },
    {
      title: '交款状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: getStatusTag
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: PaymentOrder) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<PayCircleOutlined />}
            disabled={record.status === 'paid'}
            onClick={() => handlePayment(record)}
          >
            交款
          </Button>
          <Button
            type="link"
            size="small"
            icon={<ExportOutlined />}
            onClick={() => handleExport(record)}
          >
            导出
          </Button>
        </Space>
      )
    }
  ];

  const totalUnpaidAmount = paymentOrders.reduce((sum, item) => sum + item.unpaid_amount, 0);
  const totalPaidAmount = paymentOrders.reduce((sum, item) => sum + item.paid_amount, 0);
  const unpaidCount = paymentOrders.filter(item => item.status === 'unpaid').length;
  const partialCount = paymentOrders.filter(item => item.status === 'partial').length;
  const paidCount = paymentOrders.filter(item => item.status === 'paid').length;

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card>
        <Alert
          message="交款单管理"
          description="管理供应商费用交款，支持线上支付和线下转账，AI 智能识别转账凭证。"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="待交款总额"
                value={totalUnpaidAmount}
                prefix="¥"
                precision={2}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="已交款总额"
                value={totalPaidAmount}
                prefix="¥"
                precision={2}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="未交款"
                value={unpaidCount}
                suffix="单"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="部分交款"
                value={partialCount}
                suffix="单"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="已交款"
                value={paidCount}
                suffix="单"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 筛选区域 */}
        <AdvancedSearchFilter
          fields={[
            { key: 'payment_no', label: '交款单号', type: 'input', placeholder: '请输入交款单号' },
            { key: 'period', label: '会计期间', type: 'input', placeholder: '请输入会计期间' },
            { key: 'status', label: '交款状态', type: 'select', placeholder: '请选择',
              options: [{ label: '未交款', value: 'unpaid' }, { label: '部分交款', value: 'partial' }, { label: '已交款', value: 'paid' }]
            },
            { key: 'supplier_code', label: '供应商编号', type: 'input', placeholder: '请输入供应商编号' }
          ]}
          values={filters}
          onChange={(k, v) => setFilters({ ...filters, [k]: v })}
          onSearch={handleFilter}
          onReset={handleReset}
          extraActions={
            <Button icon={<ExportOutlined />} onClick={handleBatchExport} disabled={selectedRowKeys.length === 0} style={{ height: 32 }}>批量导出</Button>
          }
        />

        {/* 操作按钮 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col>
            <Button
              icon={<PayCircleOutlined />}
              onClick={handleBatchPayment}
              disabled={selectedRowKeys.length === 0}
              style={{
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                fontWeight: 'bold',
                padding: '4px 20px',
                color: '#fff'
              }}
            >
              批量交款
            </Button>
          </Col>
        </Row>

        {/* 交款单列表 */}
        <Table
          columns={columns}
          dataSource={paymentOrders}
          loading={loading}
          rowKey="id"
          rowSelection={rowSelection}
          scroll={{ x: 1600 }}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />
      </Card>

      {/* 详情模态框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FileTextOutlined style={{ marginRight: '8px', fontSize: '20px', color: '#1890ff' }} />
            <span>交款单详情</span>
          </div>
        }
        open={detailModalVisible}
        onCancel={handleDetailModalClose}
        width={1000}
        footer={[
          <Button key="close" onClick={handleDetailModalClose}>
            关闭
          </Button>,
          <Button
            key="export"
            icon={<ExportOutlined />}
            onClick={() => selectedOrder && handleExport(selectedOrder)}
          >
            导出
          </Button>,
          <Button
            key="pay"
            type="primary"
            icon={<PayCircleOutlined />}
            disabled={selectedOrder?.status === 'paid'}
            onClick={() => {
              handleDetailModalClose();
              selectedOrder && handlePayment(selectedOrder);
            }}
          >
            立即交款
          </Button>
        ]}
      >
        {selectedOrder && (
          <div>
            {/* 基本信息 */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}>基本信息</Title>
              <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: '4px' }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Descriptions.Item label="交款汇总单号" span={2}>
                      <Text strong style={{ color: '#1890ff' }}>{selectedOrder.payment_no}</Text>
                    </Descriptions.Item>
                  </Col>
                  <Col span={8}>
                    <Descriptions.Item label="会计期间">
                      <Tag color="geekblue">{selectedOrder.period}</Tag>
                    </Descriptions.Item>
                  </Col>
                  <Col span={8}>
                    <Descriptions.Item label="交款状态">
                      {getStatusTag(selectedOrder.status)}
                    </Descriptions.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Descriptions.Item label="供应商" span={2}>
                      {selectedOrder.supplier_name}
                    </Descriptions.Item>
                  </Col>
                  <Col span={12}>
                    <Descriptions.Item label="供应商编号">
                      {selectedOrder.supplier_code}
                    </Descriptions.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Descriptions.Item label="签订法人" span={2}>
                      {selectedOrder.legal_entity}
                    </Descriptions.Item>
                  </Col>
                  <Col span={12}>
                    <Descriptions.Item label="关联结算单号">
                      <Text copyable style={{ color: '#1890ff' }}>{selectedOrder.settlement_no}</Text>
                    </Descriptions.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={24}>
                    <Descriptions.Item label="备注" span={2}>
                      {selectedOrder.remark || '无'}
                    </Descriptions.Item>
                  </Col>
                </Row>
              </div>
            </div>

            {/* 费用明细 */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}>费用明细</Title>
              <Table
                dataSource={selectedOrder.fee_details}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: '费用单号',
                    dataIndex: 'fee_no',
                    key: 'fee_no',
                    width: 150,
                    render: (text: string) => (
                      <Text strong style={{ color: '#1890ff' }}>{text}</Text>
                    )
                  },
                  {
                    title: '费用名称',
                    dataIndex: 'fee_name',
                    key: 'fee_name',
                    width: 150
                  },
                  {
                    title: '专柜编码',
                    dataIndex: 'counter_code',
                    key: 'counter_code',
                    width: 100
                  },
                  {
                    title: '专柜名称',
                    dataIndex: 'counter_name',
                    key: 'counter_name',
                    width: 150
                  },
                  {
                    title: '费用金额',
                    dataIndex: 'amount',
                    key: 'amount',
                    width: 120,
                    align: 'right',
                    render: (amount: number) => (
                      <Text strong style={{ color: '#f5222d' }}>¥{amount?.toLocaleString()}</Text>
                    )
                  }
                ]}
              />
            </div>

            {/* 金额汇总 */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}>金额汇总</Title>
              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
                    <Statistic
                      title="费用金额合计"
                      value={selectedOrder.total_fee_amount}
                      prefix="¥"
                      precision={2}
                      valueStyle={{ fontSize: '20px' }}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
                    <Statistic
                      title="未交金额"
                      value={selectedOrder.unpaid_amount}
                      prefix="¥"
                      precision={2}
                      valueStyle={{ color: '#f5222d', fontSize: '20px' }}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                    <Statistic
                      title="已交金额"
                      value={selectedOrder.paid_amount}
                      prefix="¥"
                      precision={2}
                      valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                    />
                  </div>
                </Col>
              </Row>
              {selectedOrder.status === 'partial' && (
                <div style={{ marginTop: '16px' }}>
                  <Progress
                    percent={(selectedOrder.paid_amount / selectedOrder.total_fee_amount) * 100}
                    status="active"
                    format={(percent: number) => `${percent.toFixed(1)}% 已交款`}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* 交款抽屉（单个） */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PayCircleOutlined style={{ marginRight: '8px', fontSize: '20px', color: '#1890ff' }} />
            <span>交款 - {selectedOrder?.payment_no}</span>
          </div>
        }
        placement="right"
        width={600}
        open={paymentDrawerVisible}
        onClose={handlePaymentDrawerClose}
        footer={[
          <Button key="cancel" onClick={handlePaymentDrawerClose}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmitPayment}
            style={{
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              border: 'none'
            }}
          >
            确认交款
          </Button>
        ]}
      >
        {selectedOrder && (
          <Form form={paymentForm} layout="vertical" initialValues={{ payment_method: 'online' }}>
            <Alert
              message={`本单应交金额：¥${selectedOrder.unpaid_amount.toLocaleString()}`}
              description="请选择支付方式并完成交款操作"
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <Form.Item
              name="payment_method"
              label="支付方式"
              rules={[{ required: true, message: '请选择支付方式' }]}
            >
              <Radio.Group
                buttonStyle="solid"
                style={{ width: '100%' }}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Radio.Button value="online" style={{ width: '50%', textAlign: 'center' }}>
                  <CreditCardOutlined /> 线上支付
                </Radio.Button>
                <Radio.Button value="offline" style={{ width: '50%', textAlign: 'center' }}>
                  <WalletOutlined /> 线下转账
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {paymentMethod === 'online' ? (
              // ====== 线上支付 UI ======
              <div className="payment-online-section">
                {/* 金额确认卡片 */}
                <div style={{
                  background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  border: '1px solid #91d5ff'
                }}>
                  <Row align="middle">
                    <Col span={12}>
                      <Text type="secondary">应付金额</Text>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f5222d', marginTop: '4px' }}>
                        ¥{selectedOrder.unpaid_amount.toLocaleString()}
                      </div>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <SafetyCertificateOutlined style={{ fontSize: '40px', color: '#1890ff', opacity: 0.3 }} />
                    </Col>
                  </Row>
                </div>

                {/* 支付渠道选择 */}
                <div style={{ marginBottom: '24px' }}>
                  <Text strong style={{ marginBottom: '12px', display: 'block' }}>选择支付渠道</Text>
                  <Row gutter={[12, 12]}>
                    {[
                      { icon: <WechatOutlined />, name: '微信支付', color: '#07c160', bg: '#f6ffed' },
                      { icon: <AlipayCircleOutlined />, name: '支付宝', color: '#1677ff', bg: '#e6f7ff' },
                      { icon: <BankOutlined />, name: '银联支付', color: '#e03997', bg: '#fff0f6' }
                    ].map((channel) => (
                      <Col span={8} key={channel.name}>
                        <div
                          style={{
                            padding: '16px 12px',
                            textAlign: 'center',
                            backgroundColor: channel.bg,
                            border: `2px solid ${channel.color}30`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.border = `2px solid ${channel.color}`;
                            e.currentTarget.style.boxShadow = `0 2px 8px ${channel.color}30`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.border = `2px solid ${channel.color}30`;
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{ fontSize: '28px', color: channel.color, marginBottom: '8px' }}>{channel.icon}</div>
                          <Text strong style={{ fontSize: '13px' }}>{channel.name}</Text>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* 前往支付平台按钮 */}
                <Button
                  type="primary"
                  size="large"
                  icon={<MobileOutlined />}
                  onClick={handleGoToPayPlatform}
                  disabled={onlinePaymentStatus === 'paying'}
                  block
                  style={{
                    height: '52px',
                    fontSize: '17px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    background: onlinePaymentStatus === 'paying'
                      ? '#d9d9d9'
                      : 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    border: 'none'
                  }}
                >
                  {onlinePaymentStatus === 'paying' ? '等待支付中...' : '前往支付平台'}
                </Button>

                {/* 支付状态进度 */}
                {onlinePaymentStatus && (
                  <div style={{ marginBottom: '20px' }}>
                    <Steps
                      size="small"
                      current={onlinePaymentStatus === 'paying' ? 1 : onlinePaymentStatus === 'paid' ? 2 : 0}
                      status={onlinePaymentStatus === 'failed' ? 'error' : 'process'}
                      items={[
                        { title: '待支付' },
                        { title: '支付中', icon: onlinePaymentStatus === 'paying' ? <PayCircleOutlined spin /> : undefined },
                        { title: onlinePaymentStatus === 'paid' ? '已完成' : '已完成' }
                      ]}
                    />
                  </div>
                )}

                {/* Demo环境：模拟支付完成 */}
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: '#fffbe6',
                  border: '1px dashed #ffe58f',
                  borderRadius: '8px'
                }}>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                    Demo 演示环境（实际生产环境将自动接收支付平台回调）
                  </Text>
                  <Button
                    icon={<CheckCircleOutlined />}
                    onClick={handleSimulatePaymentComplete}
                    disabled={onlinePaymentStatus === 'paid'}
                    block
                    style={{ borderColor: '#faad14', color: '#faad14' }}
                  >
                    {onlinePaymentStatus === 'paid' ? '已模拟支付成功' : '模拟支付完成'}
                  </Button>
                </div>

                {/* 费用明细（线上支付也展示） */}
                {selectedOrder.fee_details && selectedOrder.fee_details.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <Title level={5} style={{ marginBottom: '12px' }}>费用明细</Title>
                    <Table
                      dataSource={selectedOrder.fee_details}
                      rowKey="id"
                      pagination={false}
                      size="small"
                      columns={[
                        {
                          title: '费用单号',
                          dataIndex: 'fee_no',
                          key: 'fee_no',
                          width: 120
                        },
                        {
                          title: '费用名称',
                          dataIndex: 'fee_name',
                          key: 'fee_name',
                          width: 120
                        },
                        {
                          title: '金额',
                          dataIndex: 'amount',
                          key: 'amount',
                          width: 100,
                          align: 'right',
                          render: (amount: number) => `¥${amount.toLocaleString()}`
                        }
                      ]}
                    />
                  </div>
                )}
              </div>
            ) : (
              // ====== 线下转账 UI（保持原有逻辑） ======
              <div className="payment-offline-section">
                <Form.Item
                  name="amount"
                  label="交款金额"
                  rules={[{ required: true, message: '请输入交款金额' }]}
                >
                  <Input
                    prefix="¥"
                    type="number"
                    max={selectedOrder.unpaid_amount}
                    style={{ fontSize: '16px', fontWeight: 'bold' }}
                  />
                </Form.Item>

                <Form.Item
                  name="transaction_id"
                  label="交易流水号"
                  rules={[{ required: false }]}
                >
                  <Input placeholder="请输入交易流水号" />
                </Form.Item>

                <Form.Item
                  name="remark"
                  label="备注说明"
                  rules={[{ required: false }]}
                >
                  <Input.TextArea rows={3} placeholder="请输入备注说明" />
                </Form.Item>

                <Form.Item
                  label="转账凭证"
                  extra="支持 JPG、PNG 格式，大小不超过 2MB"
                >
                  <Upload
                    listType="picture-card"
                    fileList={uploadFileList}
                    onChange={handleUploadChange}
                    maxCount={1}
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                        message.error('只能上传图片文件！');
                        return false;
                      }
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!isLt2M) {
                        message.error('图片大小不能超过 2MB！');
                        return false;
                      }
                      return true;
                    }}
                  >
                    {uploadFileList.length < 1 && (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>上传凭证</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>

                {uploadFileList.length > 0 && (
                  <Form.Item label="AI 识别">
                    <Button
                      icon={<ScanOutlined />}
                      loading={aiRecognizing}
                      onClick={handleAIRecognize}
                      style={{ width: '100%' }}
                    >
                      AI 识别转账凭证
                    </Button>
                  </Form.Item>
                )}

                {selectedOrder.fee_details && selectedOrder.fee_details.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <Title level={5} style={{ marginBottom: '12px' }}>费用明细</Title>
                    <Table
                      dataSource={selectedOrder.fee_details}
                      rowKey="id"
                      pagination={false}
                      size="small"
                      columns={[
                        {
                          title: '费用单号',
                          dataIndex: 'fee_no',
                          key: 'fee_no',
                          width: 120
                        },
                        {
                          title: '费用名称',
                          dataIndex: 'fee_name',
                          key: 'fee_name',
                          width: 120
                        },
                        {
                          title: '金额',
                          dataIndex: 'amount',
                          key: 'amount',
                          width: 100,
                          align: 'right',
                          render: (amount: number) => `¥${amount.toLocaleString()}`
                        }
                      ]}
                    />
                  </div>
                )}
              </div>
            )}
          </Form>
        )}
      </Drawer>

      {/* 批量交款抽屉 */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PayCircleOutlined style={{ marginRight: '8px', fontSize: '20px', color: '#1890ff' }} />
            <span>批量交款</span>
          </div>
        }
        placement="right"
        width={600}
        open={batchPaymentDrawerVisible}
        onClose={handleBatchPaymentDrawerClose}
        footer={[
          <Button key="cancel" onClick={handleBatchPaymentDrawerClose}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleBatchSubmitPayment}
            style={{
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              border: 'none'
            }}
          >
            确认批量交款
          </Button>
        ]}
      >
        <Alert
          message={`已选择 ${selectedRowKeys.length} 个交款单`}
          description="请确认交款信息并完成批量交款操作"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Form form={paymentForm} layout="vertical" initialValues={{ payment_method: 'online' }}>
          <Form.Item
            name="payment_method"
            label="支付方式"
            rules={[{ required: true, message: '请选择支付方式' }]}
          >
            <Radio.Group
              buttonStyle="solid"
              style={{ width: '100%' }}
              onChange={(e) => setBatchPaymentMethod(e.target.value)}
            >
              <Radio.Button value="online" style={{ width: '50%', textAlign: 'center' }}>
                <CreditCardOutlined /> 线上支付
              </Radio.Button>
              <Radio.Button value="offline" style={{ width: '50%', textAlign: 'center' }}>
                <WalletOutlined /> 线下转账
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {batchPaymentMethod === 'online' ? (
            // ====== 批量线上支付 UI ======
            <div className="batch-payment-online-section">
              {/* 批量金额确认卡片 */}
              <div style={{
                background: 'linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '24px',
                border: '1px solid #ffd591'
              }}>
                <Row align="middle">
                  <Col span={12}>
                    <Text type="secondary">批量应付总额</Text>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f5222d', marginTop: '4px' }}>
                      ¥{paymentOrders
                        .filter(item => selectedRowKeys.includes(item.id))
                        .reduce((sum, item) => sum + item.unpaid_amount, 0)
                        .toLocaleString()}
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      共 {selectedRowKeys.length} 笔交款单
                    </Text>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <SafetyCertificateOutlined style={{ fontSize: '40px', color: '#fa8c16', opacity: 0.3 }} />
                  </Col>
                </Row>
              </div>

              {/* 支付渠道 */}
              <div style={{ marginBottom: '24px' }}>
                <Text strong style={{ marginBottom: '12px', display: 'block' }}>选择支付渠道</Text>
                <Row gutter={[12, 12]}>
                  {[
                    { icon: <WechatOutlined />, name: '微信支付', color: '#07c160', bg: '#f6ffed' },
                    { icon: <AlipayCircleOutlined />, name: '支付宝', color: '#1677ff', bg: '#e6f7ff' },
                    { icon: <BankOutlined />, name: '银联支付', color: '#e03997', bg: '#fff0f6' }
                  ].map((channel) => (
                    <Col span={8} key={channel.name}>
                      <div
                        style={{
                          padding: '16px 12px',
                          textAlign: 'center',
                          backgroundColor: channel.bg,
                          border: `2px solid ${channel.color}30`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = `2px solid ${channel.color}`;
                          e.currentTarget.style.boxShadow = `0 2px 8px ${channel.color}30`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.border = `2px solid ${channel.color}30`;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ fontSize: '28px', color: channel.color, marginBottom: '8px' }}>{channel.icon}</div>
                        <Text strong style={{ fontSize: '13px' }}>{channel.name}</Text>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* 前往支付平台按钮 */}
              <Button
                type="primary"
                size="large"
                icon={<MobileOutlined />}
                onClick={handleGoToBatchPayPlatform}
                disabled={batchOnlinePaymentStatus === 'paying'}
                block
                style={{
                  height: '52px',
                  fontSize: '17px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  background: batchOnlinePaymentStatus === 'paying'
                    ? '#d9d9d9'
                    : 'linear-gradient(135deg, #fa8c16 0%, #d48806 100%)',
                  border: 'none'
                }}
              >
                {batchOnlinePaymentStatus === 'paying' ? '批量支付中...' : '前往支付平台（批量支付）'}
              </Button>

              {/* 支付状态进度 */}
              {batchOnlinePaymentStatus && (
                <div style={{ marginBottom: '20px' }}>
                  <Steps
                    size="small"
                    current={batchOnlinePaymentStatus === 'paying' ? 1 : batchOnlinePaymentStatus === 'paid' ? 2 : 0}
                    status={batchOnlinePaymentStatus === 'failed' ? 'error' : 'process'}
                    items={[
                      { title: '待支付' },
                      { title: '支付中', icon: batchOnlinePaymentStatus === 'paying' ? <PayCircleOutlined spin /> : undefined },
                      { title: batchOnlinePaymentStatus === 'paid' ? '已完成' : '已完成' }
                    ]}
                  />
                </div>
              )}

              {/* Demo环境：模拟批量支付完成 */}
              <div style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: '#fffbe6',
                border: '1px dashed #ffe58f',
                borderRadius: '8px'
              }}>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                  Demo 演示环境（实际生产环境将自动接收支付平台回调）
                </Text>
                <Button
                  icon={<CheckCircleOutlined />}
                  onClick={handleBatchSimulatePaymentComplete}
                  disabled={batchOnlinePaymentStatus === 'paid'}
                  block
                  style={{ borderColor: '#faad14', color: '#faad14' }}
                >
                  {batchOnlinePaymentStatus === 'paid' ? '已模拟支付成功' : '模拟批量支付完成'}
                </Button>
              </div>
            </div>
          ) : (
            // ====== 批量线下转账 UI（保持原有逻辑） ======
            <div className="batch-payment-offline-section">
              <Form.Item
                name="transaction_id"
                label="交易流水号"
                rules={[{ required: false }]}
              >
                <Input placeholder="请输入交易流水号" />
              </Form.Item>

              <Form.Item
                name="remark"
                label="备注说明"
                rules={[{ required: false }]}
              >
                <Input.TextArea rows={3} placeholder="请输入备注说明" />
              </Form.Item>

              <Form.Item
                label="转账凭证"
                extra="支持 JPG、PNG 格式，大小不超过 2MB"
              >
                <Upload
                  listType="picture-card"
                  fileList={uploadFileList}
                  onChange={handleUploadChange}
                  maxCount={1}
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/');
                    if (!isImage) {
                      message.error('只能上传图片文件！');
                      return false;
                    }
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      message.error('图片大小不能超过 2MB！');
                      return false;
                    }
                    return true;
                  }}
                >
                  {uploadFileList.length < 1 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>上传凭证</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              {uploadFileList.length > 0 && (
                <Form.Item label="AI 识别">
                  <Button
                    icon={<ScanOutlined />}
                    loading={aiRecognizing}
                    onClick={handleAIRecognize}
                    style={{ width: '100%' }}
                  >
                    AI 识别转账凭证
                  </Button>
                </Form.Item>
              )}
            </div>
          )}
        </Form>

        <div style={{ marginTop: '24px' }}>
          <Title level={5} style={{ marginBottom: '12px' }}>已选交款单</Title>
          <Table
            dataSource={paymentOrders.filter(item => selectedRowKeys.includes(item.id))}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ y: 300 }}
            columns={[
              {
                title: '交款单号',
                dataIndex: 'payment_no',
                key: 'payment_no',
                width: 140
              },
              {
                title: '供应商',
                dataIndex: 'supplier_name',
                key: 'supplier_name',
                ellipsis: true
              },
              {
                title: '未交金额',
                dataIndex: 'unpaid_amount',
                key: 'unpaid_amount',
                width: 100,
                align: 'right',
                render: (amount: number) => (
                  <Text strong style={{ color: '#f5222d' }}>¥{amount.toLocaleString()}</Text>
                )
              }
            ]}
          />
          <div style={{ marginTop: '16px', textAlign: 'right', padding: '12px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
            <Text strong>合计金额：</Text>
            <Text strong style={{ color: '#f5222d', fontSize: '18px' }}>
              ¥{paymentOrders
                .filter(item => selectedRowKeys.includes(item.id))
                .reduce((sum, item) => sum + item.unpaid_amount, 0)
                .toLocaleString()}
            </Text>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Payments;
