import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Drawer, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, List, Avatar, Descriptions, DatePicker, InputNumber,
  Radio, Alert, Typography, Tooltip, Modal, Steps, Checkbox, Upload
} from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined, EditOutlined, EyeOutlined,
  FileTextOutlined, ClockCircleOutlined, ExclamationCircleOutlined,
  ShoppingOutlined, TruckOutlined, RobotOutlined, BellOutlined, UserOutlined,
  WarningOutlined, InfoCircleOutlined, PlusOutlined, DeleteOutlined,
  CalendarOutlined, CloudUploadOutlined, FilePdfOutlined, PrinterOutlined,
  CheckSquareOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { AppointmentForm, ItemWithBatches, BatchInfo } from '../types/appointment';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Step } = Steps;

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [changeModalVisible, setChangeModalVisible] = useState(false);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [appointmentStep, setAppointmentStep] = useState(0);
  const [appointmentForm] = Form.useForm<AppointmentForm>();
  const [isNoAppointmentSupplier, setIsNoAppointmentSupplier] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: null,
    searchText: ''
  });
  const [orderNotifications, setOrderNotifications] = useState<any[]>([]);
  const [batchEntryModalVisible, setBatchEntryModalVisible] = useState(false);
  const [batchEntryForm] = Form.useForm();

  // 模拟数据 - 实际应该从API获取
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockOrders = [
        {
          id: '1',
          order_no: 'PO20260118001',
          supplier_name: '农夫山泉股份有限公司',
          supplier_id: '302066',
          receiving_unit: '华润万家北京分公司',
          order_date: '2026-01-18 10:30',
          expected_delivery_date: '2026-01-20',
          promised_delivery_date: null,
          total_amount: 50000,
          status: 'pending',
          settlement_type: '购进',
          creator: '张三',
          warehouse: '北京中心仓',
          storage_zone: '北京常温仓',
          items: [
            {
              id: '1',
              name: '农夫山泉550ml',
              barcode: '6901285991221',
              spec: '550ml',
              unit: '瓶',
              pack_size: 24,
              quantity: 480,
              order_cases: 20,
              unit_price: 2.5,
              amount: 1200
            }
          ],
          notes: '春节备货，请优先安排',
          has_changes: false,
          changes: []
        },
        {
          id: '2',
          order_no: 'PO20260118002',
          supplier_name: '蒙牛乳业有限公司',
          supplier_id: '302067',
          receiving_unit: '沃尔玛上海门店',
          order_date: '2026-01-18 11:20',
          expected_delivery_date: '2026-01-21',
          promised_delivery_date: '2026-01-21',
          total_amount: 98000,
          status: 'confirmed',
          settlement_type: '购进',
          creator: '李四',
          warehouse: '上海中心仓',
          storage_zone: '上海冷链仓',
          items: [
            {
              id: '2',
              name: '蒙牛纯牛奶250ml',
              barcode: '6901285991234',
              spec: '250ml',
              unit: '盒',
              pack_size: 24,
              quantity: 480,
              order_cases: 20,
              unit_price: 27.4248,
              amount: 13164
            }
          ],
          notes: '',
          has_changes: true,
          changes: [
            {
              type: 'quantity_change',
              description: '零售商将蒙牛纯牛奶250ml数量从180件调整为200件',
              change_time: '2026-01-18 16:30',
              status: 'unread',
              before_after: {
                before: ['蒙牛纯牛奶250ml × 180件', '单价: ¥27.42', '小计: ¥4,935.60'],
                after: ['蒙牛纯牛奶250ml × 200件', '单价: ¥27.42', '小计: ¥5,484.80']
              }
            }
          ]
        },
        {
          id: '3',
          order_no: 'PO20260118003',
          supplier_name: '好利来食品有限公司',
          supplier_id: '302068',
          receiving_unit: '广州大润发超市',
          order_date: '2026-01-18 14:00',
          expected_delivery_date: '2026-01-22',
          promised_delivery_date: null,
          total_amount: 35000,
          status: 'shipped',
          settlement_type: '购进',
          creator: '王五',
          warehouse: '广州中心仓',
          storage_zone: '广州常温仓',
          items: [
            {
              id: '3',
              name: '好利来面包500g',
              barcode: '6901285991245',
              spec: '500g',
              unit: '袋',
              pack_size: 10,
              quantity: 350,
              order_cases: 35,
              unit_price: 50,
              amount: 17500
            }
          ],
          notes: '',
          has_changes: true,
          changes: [
            {
              type: 'order_cancellation',
              description: '零售商取消了部分订单：好利来面包500g减少20件',
              change_time: '2026-01-19 09:15',
              status: 'unread'
            }
          ]
        },
        {
          id: '4',
          order_no: 'PO20260118004',
          supplier_name: '统一企业食品有限公司',
          supplier_id: '302069',
          receiving_unit: '深圳万宁超市',
          order_date: '2026-01-19 08:30',
          expected_delivery_date: '2026-01-23',
          promised_delivery_date: null,
          total_amount: 120000,
          status: 'pending',
          settlement_type: '购进',
          creator: '赵六',
          warehouse: '深圳中心仓',
          storage_zone: '深圳常温仓',
          items: [
            {
              id: '4',
              name: '统一老坛酸菜牛肉面',
              barcode: '6901285991256',
              spec: '105g',
              unit: '碗',
              pack_size: 12,
              quantity: 3600,
              order_cases: 300,
              unit_price: 4,
              amount: 14400
            }
          ],
          notes: '新品上市，请确保质量',
          has_changes: false,
          changes: []
        }
      ];

      // 模拟订单变更通知
      const mockNotifications = [
        {
          id: '1',
          order_no: 'PO20260118002',
          type: 'quantity_increase',
          message: '沃尔玛上海门店增加了蒙牛纯牛奶250ml的订货数量（+20件）',
          time: '2026-01-18 16:30',
          status: 'unread'
        },
        {
          id: '2',
          order_no: 'PO20260118003',
          type: 'order_cancellation',
          message: '广州大润发超市取消了部分好利来面包500g订单（-20件）',
          time: '2026-01-19 09:15',
          status: 'unread'
        },
        {
          id: '3',
          order_no: 'PO20260118005',
          type: 'date_change',
          message: '北京华联超市调整了农夫山泉550ml的期望到货日期',
          time: '2026-01-19 11:45',
          status: 'read'
        }
      ];

      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setOrderNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'red',
      confirmed: 'green',
      shipped: 'blue',
      completed: 'green',
      cancelled: 'gray'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      pending: '待确认',
      confirmed: '已确认',
      shipped: '配送中',
      completed: '已完成',
      cancelled: '已取消'
    };
    return texts[status] || status;
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    let filtered = [...orders];

    if (newFilters.status) {
      filtered = filtered.filter(order => order.status === newFilters.status);
    }

    if (newFilters.dateRange && newFilters.dateRange.length === 2) {
      const [startDate, endDate] = newFilters.dateRange;
      filtered = filtered.filter(order => {
        const orderDate = dayjs(order.order_date.split(' ')[0]);
        return orderDate.isAfter(startDate.subtract(1, 'day')) && orderDate.isBefore(endDate.add(1, 'day'));
      });
    }

    if (newFilters.searchText) {
      filtered = filtered.filter(order =>
        order.order_no.toLowerCase().includes(newFilters.searchText.toLowerCase()) ||
        order.supplier_name.toLowerCase().includes(newFilters.searchText.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleViewDetail = (order: any) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const handleConfirmOrder = (order: any) => {
    setSelectedOrder(order);
    setConfirmModalVisible(true);
  };

  const handleRejectOrder = (order: any) => {
    Modal.confirm({
      title: '拒绝订单',
      content: '确定要拒绝这个订单吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        message.success('订单已拒绝');
        fetchOrders();
      }
    });
  };

  const handleChangeOrder = (order: any) => {
    setSelectedOrder(order);
    setChangeModalVisible(true);
  };

  const handleConfirmSubmit = async (values: any) => {
    try {
      // 模拟API调用
      message.success('订单确认成功');
      setConfirmModalVisible(false);
      fetchOrders();
    } catch (error) {
      message.error('确认失败');
    }
  };

  const handleChangeSubmit = async (values: any) => {
    try {
      // 模拟API调用
      message.success('变更申请已提交');
      setChangeModalVisible(false);
      fetchOrders();
    } catch (error) {
      message.error('提交失败');
    }
  };

  // 处理批量送货预约
  const handleBatchAppointment = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择需要预约的订单');
      return;
    }

    const selectedOrdersData = filteredOrders.filter(order => selectedRowKeys.includes(order.id));

    // 初始化表单数据
    const items: ItemWithBatches[] = selectedOrdersData.flatMap(order =>
      order.items.map((item: any, index: number) => ({
        id: `${order.id}-${index}`,
        orderItemId: item.id || `${order.id}-${index}`,
        barcode: item.barcode || `690123456789${index}`,
        productName: item.name,
        sku: `SKU${item.id || index}`,
        totalQuantity: item.quantity,
        unit: '件',
        batches: [
          {
            id: `batch-${Date.now()}-${index}`,
            productionDate: dayjs(),
            batchNo: '',
            quantity: item.quantity
          }
        ]
      }))
    );

    // 保存订单IDs到selectedOrder
    setSelectedOrder({
      ...selectedOrdersData[0],
      orderIds: selectedRowKeys as string[]
    });

    appointmentForm.setFieldsValue({
      orderIds: selectedRowKeys as string[],
      supplierId: 'SUP001',
      supplierName: selectedOrdersData[0].supplier_name,
      isNoAppointmentSupplier: false,
      items,
      driver: { name: '', phone: '' },
      vehicle: { plateNumber: '', vehicleType: '', loadCapacity: 5 },
      schedule: {
        appointmentDate: dayjs().add(1, 'day'),
        timeSlot: '09:00-12:00',
        isNoAppointment: false
      },
      notes: ''
    });

    setAppointmentStep(0);
    setAppointmentModalVisible(true);
  };

  // 添加批次
  const handleAddBatch = (itemIndex: number) => {
    const items = appointmentForm.getFieldValue('items');
    const currentItem = items[itemIndex];
    const usedQuantity = currentItem.batches.reduce((sum: number, b: BatchInfo) => sum + b.quantity, 0);
    const remainingQuantity = currentItem.totalQuantity - usedQuantity;

    if (remainingQuantity <= 0) {
      message.warning('已分配完所有数量，无需再添加批次');
      return;
    }

    currentItem.batches.push({
      id: `batch-${Date.now()}`,
      productionDate: dayjs(),
      batchNo: '',
      quantity: remainingQuantity
    });

    appointmentForm.setFieldValue(['items', itemIndex, 'batches'], currentItem.batches);
  };

  // 删除批次
  const handleRemoveBatch = (itemIndex: number, batchIndex: number) => {
    const items = appointmentForm.getFieldValue('items');
    items[itemIndex].batches.splice(batchIndex, 1);
    appointmentForm.setFieldValue(['items', itemIndex, 'batches'], items[itemIndex].batches);
  };

  // 提交送货预约
  const handleAppointmentSubmit = async (values: AppointmentForm) => {
    try {
      // 验证所有批次信息
      const invalidItems = values.items.filter(item => {
        const invalidBatches = item.batches.filter(batch => !batch.batchNo.trim());
        return invalidBatches.length > 0;
      });

      if (invalidItems.length > 0) {
        message.error('请完善所有批次号');
        return;
      }

      // 验证证明文件
      for (const item of values.items) {
        for (const batch of item.batches) {
          if (!batch.certificates?.factoryReport) {
            message.error(`请上传 ${item.productName} 批次 ${batch.batchNo} 的出厂检验报告`);
            return;
          }
        }
      }

      // 验证数量
      for (const item of values.items) {
        const batchQuantity = item.batches.reduce((sum, b) => sum + b.quantity, 0);
        if (Math.abs(batchQuantity - item.totalQuantity) > 0.01) {
          message.error(`商品 ${item.productName} 的批次总数量与订单数量不符`);
          return;
        }
      }

      // 模拟API调用
      message.success('送货预约提交成功！');
      setAppointmentModalVisible(false);
      setSelectedRowKeys([]);
      fetchOrders();
    } catch (error) {
      message.error('提交失败');
    }
  };

  // 打开批次录入（单个订单）
  const handleBatchEntry = (order: any) => {
    setSelectedOrder(order);

    // 初始化表单数据
    const items: ItemWithBatches[] = order.items.map((item: any) => ({
      productId: item.id,
      productName: item.name,
      barcode: item.barcode || '',
      totalQuantity: item.quantity,
      batches: [
        {
          productionDate: dayjs(),
          batchNo: '',
          quantity: item.quantity,
          certificates: {
            factoryReport: null,
            quarantineCertificate: null,
            customsDeclaration: null,
            listingCertificate: null
          }
        }
      ]
    }));

    batchEntryForm.setFieldsValue({ items });
    setBatchEntryModalVisible(true);
  };

  // 批量批次录入
  const handleBatchBatchEntry = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择需要录入批次的订单');
      return;
    }

    const selectedOrdersData = filteredOrders.filter(order => selectedRowKeys.includes(order.id));
    setSelectedOrder(selectedOrdersData[0]);

    // 初始化表单数据
    const items: ItemWithBatches[] = selectedOrdersData.flatMap(order =>
      order.items.map((item: any) => ({
        productId: item.id,
        productName: item.name,
        barcode: item.barcode || '',
        totalQuantity: item.quantity,
        batches: [
          {
            productionDate: dayjs(),
            batchNo: '',
            quantity: item.quantity,
            certificates: {
              factoryReport: null,
              quarantineCertificate: null,
              customsDeclaration: null,
              listingCertificate: null
            }
          }
        ]
      }))
    );

    batchEntryForm.setFieldsValue({ items });
    setBatchEntryModalVisible(true);
  };

  // 批次录入中添加批次
  const handleBatchEntryAddBatch = (itemIndex: number) => {
    const items = batchEntryForm.getFieldValue('items');
    items[itemIndex].batches.push({
      productionDate: dayjs(),
      batchNo: '',
      quantity: items[itemIndex].totalQuantity,
      certificates: {
        factoryReport: null,
        quarantineCertificate: null,
        customsDeclaration: null,
        listingCertificate: null
      }
    });
    batchEntryForm.setFieldValue(['items', itemIndex, 'batches'], items[itemIndex].batches);
  };

  // 批次录入中删除批次
  const handleBatchEntryRemoveBatch = (itemIndex: number, batchIndex: number) => {
    const items = batchEntryForm.getFieldValue('items');
    items[itemIndex].batches.splice(batchIndex, 1);
    batchEntryForm.setFieldValue(['items', itemIndex, 'batches'], items[itemIndex].batches);
  };

  // 提交批次录入
  const handleBatchEntrySubmit = async () => {
    try {
      const values = await batchEntryForm.validateFields();

      // 验证所有批次信息
      const invalidItems = values.items.filter((item: ItemWithBatches) => {
        const invalidBatches = item.batches.filter((batch: BatchInfo) => !batch.batchNo.trim());
        return invalidBatches.length > 0;
      });

      if (invalidItems.length > 0) {
        message.error('请完善所有批次号');
        return;
      }

      // 验证证明文件
      for (const item of values.items) {
        for (const batch of item.batches) {
          if (!batch.certificates?.factoryReport) {
            message.error(`请上传 ${item.productName} 批次 ${batch.batchNo} 的出厂检验报告`);
            return;
          }
        }
      }

      // 验证数量
      for (const item of values.items) {
        const batchQuantity = item.batches.reduce((sum: number, b: BatchInfo) => sum + b.quantity, 0);
        if (Math.abs(batchQuantity - item.totalQuantity) > 0.01) {
          message.error(`商品 ${item.productName} 的批次总数量与订单数量不符`);
          return;
        }
      }

      // 模拟API调用
      message.success('批次信息录入成功！');
      setBatchEntryModalVisible(false);
      setSelectedRowKeys([]);
      fetchOrders();
    } catch (error) {
      message.error('提交失败');
    }
  };

  // 发起送货预约（从订单详情）
  const handleBatchAppointmentWithOrder = () => {
    if (!selectedOrder) {
      message.warning('请选择订单');
      return;
    }

    // 初始化表单数据
    const items: ItemWithBatches[] = (selectedOrder.items || []).map((item: any) => ({
      productId: item.id,
      productName: item.name,
      barcode: item.barcode || '',
      totalQuantity: item.quantity || 0,
      batches: [
        {
          productionDate: dayjs(),
          batchNo: '',
          quantity: item.quantity || 0,
          certificates: {
            factoryReport: null,
            quarantineCertificate: null,
            customsDeclaration: null,
            listingCertificate: null
          }
        }
      ]
    }));

    // 保存订单ID（用于显示合并信息）
    appointmentForm.setFieldsValue({
      orderIds: [selectedOrder.id],
      supplierName: selectedOrder.supplier_name,
      items
    });
    setSelectedOrder({
      ...selectedOrder,
      orderIds: [selectedOrder.id]
    });
    setDetailModalVisible(false);
    setAppointmentStep(0);
    setAppointmentModalVisible(true);
  };

  // 批量导出订单
  const handleBulkExport = () => {
    const selectedOrders = filteredOrders; // 默认导出当前筛选结果
    if (selectedOrders.length === 0) {
      message.warning('没有可导出的订单数据');
      return;
    }

    // 生成CSV数据
    const csvHeaders = [
      '订单编号', '收货单位', '供应商', '商品名称', '数量', '单价', '小计',
      '订单金额', '订单状态', '下单时间', '期望到货', '仓库'
    ];

    const csvData = selectedOrders.map(order => {
      const row = [
        order.order_no,
        order.receiving_unit,
        order.supplier_name,
        order.items.map(item => item.name).join('; '),
        order.items.map(item => item.quantity).join('; '),
        order.items.map(item => item.unit_price).join('; '),
        order.items.map(item => item.amount).join('; '),
        order.total_amount,
        getStatusText(order.status),
        order.order_date,
        order.expected_delivery_date,
        order.warehouse
      ];
      return row;
    });

    // 创建CSV内容
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // 下载CSV文件
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `订单数据_${dayjs().format('YYYY-MM-DD_HH-mm')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success(`成功导出 ${selectedOrders.length} 条订单数据`);
  };

  // 批量确认订单
  const handleBulkConfirm = () => {
    const pendingOrders = filteredOrders.filter(order => order.status === 'pending');
    if (pendingOrders.length === 0) {
      message.warning('没有待确认的订单');
      return;
    }

    Modal.confirm({
      title: '批量确认订单',
      content: `确定要批量确认 ${pendingOrders.length} 个待确认订单吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        // 模拟批量确认
        message.success(`成功确认 ${pendingOrders.length} 个订单`);
        fetchOrders();
      }
    });
  };

  const getAISuggestion = (order: any) => {
    // AI智能推荐承诺发货时间
    const today = dayjs();
    const expectedDate = dayjs(order.expected_delivery_date);
    const daysDiff = expectedDate.diff(today, 'day');

    if (daysDiff >= 3) {
      return { time: expectedDate.format('YYYY-MM-DD'), confidence: '高', reason: '库存充足，可按期交付' };
    } else if (daysDiff >= 1) {
      return { time: expectedDate.subtract(1, 'day').format('YYYY-MM-DD'), confidence: '中', reason: '需加快备货节奏' };
    } else {
      return { time: today.add(2, 'day').format('YYYY-MM-DD'), confidence: '低', reason: '库存紧张，建议协商调整' };
    }
  };

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'order_no',
      key: 'order_no',
      width: 140,
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
            {text}
            {record.has_changes && (
              <Badge dot style={{ marginLeft: '8px' }}>
                <WarningOutlined style={{ color: '#faad14' }} />
              </Badge>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.order_date}</div>
        </div>
      )
    },
    {
      title: '收货单位',
      dataIndex: 'receiving_unit',
      key: 'receiving_unit',
      width: 160,
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
          <div>
            <div>{text}</div>
            {record.has_changes && (
              <div style={{ fontSize: '12px', color: '#faad14' }}>
                有变更通知
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 180,
      render: (text: string) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>联系人：张三</div>
        </div>
      )
    },
    {
      title: '商品',
      dataIndex: 'items',
      key: 'items',
      width: 150,
      render: (items: any[]) => (
        <div>
          {items.map((item, index) => (
            <div key={index} style={{ fontSize: '12px', marginBottom: '2px' }}>
              {item.name} × {item.quantity}
            </div>
          ))}
        </div>
      )
    },
    {
      title: '金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 100,
      render: (amount: number) => (
        <div style={{ fontWeight: 'bold', color: '#f5222d' }}>
          ¥{amount.toLocaleString()}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: any) => {
        const color = getStatusColor(status);
        const text = getStatusText(status);
        const isUrgent = status === 'pending' && dayjs().diff(dayjs(record.order_date.split(' ')[0]), 'hour') > 24;

        return (
          <div>
            <Tag color={color}>
              {isUrgent && <ExclamationCircleOutlined style={{ marginRight: '4px' }} />}
              {text}
            </Tag>
            {isUrgent && <div style={{ fontSize: '10px', color: '#f5222d', marginTop: '2px' }}>超24小时</div>}
          </div>
        );
      }
    },
    {
      title: '期望到货',
      dataIndex: 'expected_delivery_date',
      key: 'expected_delivery_date',
      width: 100,
      render: (date: string) => dayjs(date).format('MM-DD')
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>

          {record.status === 'pending' && (
            <>
              <Tooltip title="确认订单">
                <Button
                  type="text"
                  icon={<CheckCircleOutlined />}
                  size="small"
                  style={{ color: '#52c41a' }}
                  onClick={() => handleConfirmOrder(record)}
                />
              </Tooltip>
              <Tooltip title="拒绝订单">
                <Button
                  type="text"
                  icon={<CloseCircleOutlined />}
                  size="small"
                  style={{ color: '#f5222d' }}
                  onClick={() => handleRejectOrder(record)}
                />
              </Tooltip>
            </>
          )}

          <Tooltip title="申请变更">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleChangeOrder(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      {/* 订单变更通知 */}
      {orderNotifications.filter(n => n.status === 'unread').length > 0 && (
        <Card style={{ marginBottom: '24px', borderColor: '#faad14' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <BellOutlined style={{ fontSize: '20px', color: '#faad14', marginRight: '8px' }} />
            <Text strong style={{ fontSize: '16px' }}>订单变更通知</Text>
            <Badge count={orderNotifications.filter(n => n.status === 'unread').length} style={{ marginLeft: '8px' }} />
          </div>

          <List
            dataSource={orderNotifications.filter(n => n.status === 'unread')}
            renderItem={(notification) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      const order = orders.find(o => o.order_no === notification.order_no);
                      if (order) handleViewDetail(order);
                    }}
                  >
                    查看详情
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: notification.type === 'quantity_increase' ? '#52c41a' :
                                        notification.type === 'order_cancellation' ? '#f5222d' :
                                        '#1890ff'
                      }}
                      icon={
                        notification.type === 'quantity_increase' ? <InfoCircleOutlined /> :
                        notification.type === 'order_cancellation' ? <ExclamationCircleOutlined /> :
                        <ClockCircleOutlined />
                      }
                    />
                  }
                  title={
                    <div>
                      <Text strong>{notification.order_no}</Text>
                      <Text style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                        {dayjs(notification.time).format('MM-DD HH:mm')}
                      </Text>
                    </div>
                  }
                  description={notification.message}
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      <Card style={{ marginBottom: '24px' }}>
        {/* 筛选条件 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="订单状态"
              style={{ width: '100%' }}
              allowClear
              value={filters.status}
              onChange={(value) => handleFilterChange({ ...filters, status: value })}
            >
              <Select.Option value="pending">待确认</Select.Option>
              <Select.Option value="confirmed">已确认</Select.Option>
              <Select.Option value="shipped">配送中</Select.Option>
              <Select.Option value="completed">已完成</Select.Option>
              <Select.Option value="cancelled">已取消</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              style={{ width: '100%' }}
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange({ ...filters, dateRange: dates })}
            />
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <Input
              placeholder="搜索订单号或供应商"
              value={filters.searchText}
              onChange={(e) => handleFilterChange({ ...filters, searchText: e.target.value })}
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Space>
              <Button type="primary" icon={<FileTextOutlined />} onClick={handleBulkExport}>导出订单</Button>
              <Button icon={<FileTextOutlined />} onClick={handleBulkConfirm}>批量确认</Button>
              <Button type="primary" icon={<TruckOutlined />} onClick={handleBatchAppointment}>预约送货</Button>
              <Button type="primary" icon={<FilePdfOutlined />} onClick={handleBatchBatchEntry}>批量录入批次</Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            getCheckboxProps: (record: any) => ({
              disabled: record.status !== 'confirmed'
            })
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 订单详情侧边栏 */}
      <Drawer
        title={`订单详情 - ${selectedOrder?.order_no}`}
        placement="right"
        onClose={() => setDetailModalVisible(false)}
        open={detailModalVisible}
        width={720}
        style={{ maxWidth: '100vw' }}
        bodyStyle={{ padding: '24px' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="订单编号">{selectedOrder.order_no}</Descriptions.Item>
              <Descriptions.Item label="订单状态">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="供应商">
                <div>
                  <div>{selectedOrder.supplier_name}</div>
                  {selectedOrder.supplier_id && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      ID: {selectedOrder.supplier_id}
                    </Text>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="结算方式">
                {selectedOrder.settlement_type || '购进'}
              </Descriptions.Item>
              <Descriptions.Item label="下单时间">{selectedOrder.order_date}</Descriptions.Item>
              <Descriptions.Item label="创建人">{selectedOrder.creator || '-'}</Descriptions.Item>
              <Descriptions.Item label="收货单位/仓库">
                <Text strong style={{ color: '#1890ff', fontSize: '14px' }}>
                  {selectedOrder.warehouse || '-'}
                </Text>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  库区: {selectedOrder.storage_zone || selectedOrder.warehouse || '-'}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="交货期限">
                <Text strong style={{ color: '#faad14', fontSize: '14px' }}>
                  {selectedOrder.expected_delivery_date || '-'}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider>商品明细</Divider>
            <Table
              dataSource={selectedOrder.items || []}
              pagination={false}
              size="small"
              rowKey={(record, index) => index || Math.random()}
              columns={[
                {
                  title: '库区',
                  dataIndex: 'storage_zone',
                  width: 120,
                  render: (text) => (
                    <Tag color="blue">{text || '-'}</Tag>
                  )
                },
                {
                  title: '商品条码',
                  dataIndex: 'barcode',
                  width: 120,
                  ellipsis: true
                },
                {
                  title: '商品名称',
                  dataIndex: 'name',
                  ellipsis: true
                },
                {
                  title: '规格',
                  dataIndex: 'spec',
                  width: 80
                },
                {
                  title: '单位',
                  dataIndex: 'unit',
                  width: 60
                },
                {
                  title: '箱装数',
                  dataIndex: 'pack_size',
                  width: 80,
                  render: (text) => text || '-'
                },
                {
                  title: '订货数量',
                  dataIndex: 'quantity',
                  width: 100,
                  render: (text) => text || 0
                },
                {
                  title: '订货箱数',
                  dataIndex: 'order_cases',
                  width: 100,
                  render: (text, record) => {
                    // 计算箱数 = 订货数量 / 箱装数
                    const cases = record.pack_size && record.quantity
                      ? (record.quantity / record.pack_size).toFixed(2)
                      : (record.order_cases || '-');
                    return <Text strong>{cases}</Text>;
                  }
                },
                {
                  title: '不含税进价',
                  dataIndex: 'unit_price',
                  width: 100,
                  render: (text) => `¥${text?.toFixed(2) || '0.00'}`
                }
              ]}
              scroll={{ x: 1000 }}
            />

            {/* 底部汇总信息 */}
            <Card size="small" style={{ marginTop: '16px', backgroundColor: '#f6ffed' }}>
              <Row gutter={16} align="middle">
                <Col span={8}>
                  <Text type="secondary">总金额：</Text>
                  <Text strong style={{ color: '#f5222d', fontSize: '18px', marginLeft: '8px' }}>
                    ¥{selectedOrder.total_amount?.toLocaleString() || '0'}
                  </Text>
                </Col>
                <Col span={8}>
                  <Text type="secondary">总箱数：</Text>
                  <Text strong style={{ fontSize: '18px', marginLeft: '8px' }}>
                    {(() => {
                      const totalCases = (selectedOrder.items || []).reduce((sum: number, item: any) => {
                        const cases = item.pack_size && item.quantity
                          ? item.quantity / item.pack_size
                          : item.order_cases || 0;
                        return sum + cases;
                      }, 0);
                      return totalCases.toFixed(2);
                    })()}
                  </Text>
                </Col>
                <Col span={8}>
                  <Text type="secondary">总数量：</Text>
                  <Text strong style={{ fontSize: '18px', marginLeft: '8px' }}>
                    {(selectedOrder.items || []).reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)}
                  </Text>
                </Col>
              </Row>
            </Card>

            {selectedOrder.notes && (
              <>
                <Divider>特殊要求</Divider>
                <Paragraph>{selectedOrder.notes}</Paragraph>
              </>
            )}

            {/* 订单变更历史 */}
            {selectedOrder.has_changes && selectedOrder.changes && selectedOrder.changes.length > 0 && (
              <>
                <Divider>订单变更历史</Divider>
                <List
                  dataSource={selectedOrder.changes}
                  renderItem={(change, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor: change.type === 'quantity_change' ? '#1890ff' :
                                             change.type === 'order_cancellation' ? '#f5222d' :
                                             '#52c41a'
                            }}
                            icon={
                              change.type === 'quantity_change' ? <InfoCircleOutlined /> :
                              change.type === 'order_cancellation' ? <ExclamationCircleOutlined /> :
                              <ClockCircleOutlined />
                            }
                          />
                        }
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>
                              {change.type === 'quantity_change' && '数量变更'}
                              {change.type === 'order_cancellation' && '订单取消'}
                              {change.type === 'date_change' && '日期调整'}
                            </span>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {dayjs(change.change_time).format('MM-DD HH:mm')}
                            </Text>
                          </div>
                        }
                        description={
                          <div>
                            <div style={{ marginBottom: '8px' }}>
                              <Text strong>变更详情：</Text>
                              <Paragraph style={{ margin: '4px 0' }}>{change.description}</Paragraph>
                            </div>

                            {/* 变更前后的对比信息 */}
                            {change.before_after && (
                              <div style={{ backgroundColor: '#f6ffed', padding: '12px', borderRadius: '6px', marginTop: '8px' }}>
                                <Text strong style={{ color: '#52c41a' }}>变更对比：</Text>
                                <Row gutter={16} style={{ marginTop: '8px' }}>
                                  <Col span={12}>
                                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
                                      <Text type="secondary" style={{ fontSize: '12px' }}>变更前</Text>
                                      <div style={{ marginTop: '4px' }}>
                                        {change.before_after.before.map((item, idx) => (
                                          <div key={idx} style={{ fontSize: '13px', lineHeight: '1.5' }}>
                                            {item}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </Col>
                                  <Col span={12}>
                                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
                                      <Text type="secondary" style={{ fontSize: '12px' }}>变更后</Text>
                                      <div style={{ marginTop: '4px' }}>
                                        {change.before_after.after.map((item, idx) => (
                                          <div key={idx} style={{ fontSize: '13px', lineHeight: '1.5' }}>
                                            {item}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            )}

                            <div style={{ marginTop: '8px' }}>
                              <Tag color={change.status === 'read' ? 'default' : 'orange'}>
                                {change.status === 'read' ? '已读' : '未读'}
                              </Tag>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </>
            )}

            {/* 底部操作区域 */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e8e8e8', textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
                <Button
                  icon={<PrinterOutlined />}
                  onClick={() => {
                    message.info('打印订单功能开发中...');
                  }}
                >
                  打印订单
                </Button>
                <Button
                  type="primary"
                  icon={<TruckOutlined />}
                  onClick={() => handleBatchAppointmentWithOrder()}
                >
                  发起送货预约
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Drawer>

      {/* 订单确认模态框 */}
      <Modal
        title="确认订单"
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        width={520}
        footer={null}
      >
        <Form onFinish={handleConfirmSubmit} layout="vertical">
          {selectedOrder && (
            <>
              <Alert
                message="订单信息确认"
                description={`订单 ${selectedOrder.order_no} - ${selectedOrder.supplier_name} - 金额 ¥${selectedOrder.total_amount.toLocaleString()}`}
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
              />

              <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <RobotOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                  <Text strong>AI智能推荐</Text>
                </div>
                <div>
                  <Text>建议承诺发货时间: </Text>
                  <Text strong style={{ color: '#1890ff' }}>
                    {getAISuggestion(selectedOrder).time}
                  </Text>
                  <Tag color={getAISuggestion(selectedOrder).confidence === '高' ? 'green' : getAISuggestion(selectedOrder).confidence === '中' ? 'orange' : 'red'} style={{ marginLeft: '8px' }}>
                    置信度{getAISuggestion(selectedOrder).confidence}
                  </Tag>
                </div>
                <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                  {getAISuggestion(selectedOrder).reason}
                </div>
              </div>

              <Form.Item
                name="promised_delivery_date"
                label="承诺发货时间"
                rules={[{ required: true, message: '请选择承诺发货时间' }]}
                initialValue={dayjs(getAISuggestion(selectedOrder).time)}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>

              <Form.Item name="notes" label="备注">
                <Input.TextArea rows={3} placeholder="可填写发货注意事项等" />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                  <Button onClick={() => setConfirmModalVisible(false)}>取消</Button>
                  <Button type="primary" htmlType="submit">
                    确认接单
                  </Button>
                </Space>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* 订单变更模态框 */}
      <Modal
        title="申请订单变更"
        open={changeModalVisible}
        onCancel={() => setChangeModalVisible(false)}
        width={520}
        footer={null}
      >
        <Form onFinish={handleChangeSubmit} layout="vertical">
          {selectedOrder && (
            <>
              <Alert
                message="变更申请"
                description={`订单 ${selectedOrder.order_no} - 请填写变更内容`}
                type="warning"
                showIcon
                style={{ marginBottom: '16px' }}
              />

              <Form.Item
                name="change_type"
                label="变更类型"
                rules={[{ required: true, message: '请选择变更类型' }]}
              >
                <Radio.Group>
                  <Radio value="quantity">数量变更</Radio>
                  <Radio value="price">价格调整</Radio>
                  <Radio value="date">日期调整</Radio>
                  <Radio value="other">其他变更</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="change_reason"
                label="变更原因"
                rules={[{ required: true, message: '请填写变更原因' }]}
              >
                <Input.TextArea rows={3} placeholder="请详细说明变更原因" />
              </Form.Item>

              <Form.Item
                name="change_content"
                label="变更内容"
                rules={[{ required: true, message: '请填写变更内容' }]}
              >
                <Input.TextArea rows={3} placeholder="请详细描述需要变更的内容" />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                  <Button onClick={() => setChangeModalVisible(false)}>取消</Button>
                  <Button type="primary" htmlType="submit">
                    提交变更申请
                  </Button>
                </Space>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* 送货预约模态框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TruckOutlined style={{ marginRight: '8px', fontSize: '20px', color: '#1890ff' }} />
            <span>送货预约</span>
          </div>
        }
        open={appointmentModalVisible}
        onCancel={() => setAppointmentModalVisible(false)}
        width={1200}
        footer={null}
      >
        <Form form={appointmentForm} onFinish={handleAppointmentSubmit} layout="vertical">
          <Steps current={appointmentStep} style={{ marginBottom: '24px' }}>
            <Step title="确认商品与批次" description="录入生产日期和批次号" />
            <Step title="物流与排程" description="填写车辆信息和预约时间" />
          </Steps>

          {appointmentStep === 0 && (
            <>
              <Alert
                message={
                  selectedOrder && selectedOrder.orderIds && selectedOrder.orderIds.length > 1
                    ? `已合并 ${selectedOrder.orderIds.length} 个订单进行送货预约`
                    : '批次录入说明'
                }
                description={
                  selectedOrder && selectedOrder.orderIds && selectedOrder.orderIds.length > 1
                    ? '以下订单的商品已合并，请统一录入批次信息。'
                    : '请为每个商品录入生产日期和批次号。如果一个商品有多个批次，请点击"添加批次"按钮进行拆分。批次总数量必须等于订单数量。'
                }
                type={selectedOrder && selectedOrder.orderIds && selectedOrder.orderIds.length > 1 ? 'warning' : 'info'}
                showIcon
                style={{ marginBottom: '16px' }}
              />

              {/* 合并订单列表 */}
              {selectedOrder && selectedOrder.orderIds && selectedOrder.orderIds.length > 1 && (
                <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#fff7e6', borderColor: '#ffd666' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong style={{ color: '#fa8c16' }}>合并的订单：</Text>
                  </div>
                  <List
                    size="small"
                    dataSource={filteredOrders.filter(order => selectedOrder.orderIds.includes(order.id))}
                    renderItem={(order) => (
                      <List.Item style={{ padding: '8px 0' }}>
                        <List.Item.Meta
                          avatar={<Tag color="blue">{order.order_no}</Tag>}
                          title={
                            <div style={{ fontSize: '13px' }}>
                              <Text>{order.supplier_name}</Text>
                              <Text type="secondary" style={{ marginLeft: '12px' }}>
                                {order.warehouse}
                              </Text>
                            </div>
                          }
                          description={
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              商品: {order.items.length} 种 | 数量: {order.items.reduce((sum: number, i: any) => sum + (i.quantity || 0), 0)} 件
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              )}

              <Card title="商品批次列表" style={{ marginBottom: '16px' }}>
                <Form.List name="items">
                  {(fields, { add, remove }) => {
                    if (!fields || fields.length === 0) {
                      return (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                          <ShoppingOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                          <div>暂无商品数据</div>
                          <div style={{ fontSize: '12px', marginTop: '8px' }}>
                            请选择已确认状态的订单进行预约
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div>
                        {fields.map(({ key, name: itemIndex, ...restField }) => (
                          <Card
                            key={key}
                            size="small"
                            style={{ marginBottom: '16px', backgroundColor: '#fafafa' }}
                            title={
                              <div>
                                <Text strong>
                                  {appointmentForm.getFieldValue(['items', itemIndex, 'productName'])}
                                </Text>
                                <Text type="secondary" style={{ marginLeft: '12px' }}>
                                  条码: {appointmentForm.getFieldValue(['items', itemIndex, 'barcode'])}
                                </Text>
                                <Tag color="blue" style={{ marginLeft: '12px' }}>
                                  总数量: {appointmentForm.getFieldValue(['items', itemIndex, 'totalQuantity'])} 件
                                </Tag>
                              </div>
                            }
                          >
                            <Form.List name={[itemIndex, 'batches']}>
                              {(batchFields, { add: addBatch, remove: removeBatch }) => (
                                <div>
                                  {batchFields.map(({ key: batchKey, name: batchIndex, ...restBatchField }) => (
                                    <>
                                    <Row key={batchKey} gutter={16} align="middle" style={{ marginBottom: '12px' }}>
                                      <Col span={2}>
                                        <Tag color="geekblue">批次 {batchIndex + 1}</Tag>
                                      </Col>
                                      <Col span={6}>
                                        <Form.Item
                                          {...restBatchField}
                                          name={[batchIndex, 'productionDate']}
                                          label="生产日期"
                                          rules={[{ required: true, message: '请选择生产日期' }]}
                                        >
                                          <DatePicker style={{ width: '100%' }} />
                                        </Form.Item>
                                      </Col>
                                      <Col span={6}>
                                        <Form.Item
                                          {...restBatchField}
                                          name={[batchIndex, 'batchNo']}
                                          label="批次号"
                                          rules={[{ required: true, message: '请输入批次号' }]}
                                        >
                                          <Input placeholder="请输入批次号" />
                                        </Form.Item>
                                      </Col>
                                      <Col span={6}>
                                        <Form.Item
                                          {...restBatchField}
                                          name={[batchIndex, 'quantity']}
                                          label="数量"
                                          rules={[{ required: true, message: '请输入数量' }]}
                                        >
                                          <InputNumber
                                            min={1}
                                            style={{ width: '100%' }}
                                            placeholder="请输入数量"
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col span={4}>
                                        {batchFields.length > 1 && (
                                          <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleRemoveBatch(itemIndex as number, batchIndex)}
                                          >
                                            删除
                                          </Button>
                                        )}
                                      </Col>
                                    </Row>

                                    {/* 证明文件上传 */}
                                    <Divider orientation="left" style={{ margin: '16px 0', fontSize: '14px' }}>
                                      <FilePdfOutlined style={{ marginRight: '8px' }} />
                                      批次证明文件
                                    </Divider>
                                    <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                                      <Row gutter={16}>
                                        <Col span={12}>
                                          <Form.Item
                                            {...restBatchField}
                                            name={[batchIndex, 'certificates', 'factoryReport']}
                                            label="出厂检验报告"
                                            tooltip="必填：每批次需提供出厂检验报告"
                                            rules={[{ required: true, message: '请上传出厂检验报告' }]}
                                          >
                                            <Upload
                                              beforeUpload={() => false}
                                              maxCount={1}
                                              accept=".pdf,.jpg,.jpeg,.png"
                                              listType="text"
                                              onChange={(info) => {
                                                if (info.fileList && info.fileList.length > 0) {
                                                  const file = info.fileList[0].originFileObj;
                                                  appointmentForm.setFieldValue(
                                                    ['items', itemIndex, 'batches', batchIndex, 'certificates', 'factoryReport'],
                                                    file
                                                  );
                                                }
                                              }}
                                            >
                                              <Button icon={<CloudUploadOutlined />}>
                                                上传文件
                                              </Button>
                                            </Upload>
                                          </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                          <Form.Item
                                            {...restBatchField}
                                            name={[batchIndex, 'certificates', 'quarantineCertificate']}
                                            label="入境货物检验检疫证明"
                                            tooltip="进口商品必填：法定检测商品需提供"
                                          >
                                            <Upload
                                              beforeUpload={() => false}
                                              maxCount={1}
                                              accept=".pdf,.jpg,.jpeg,.png"
                                              listType="text"
                                              onChange={(info) => {
                                                if (info.fileList && info.fileList.length > 0) {
                                                  const file = info.fileList[0].originFileObj;
                                                  appointmentForm.setFieldValue(
                                                    ['items', itemIndex, 'batches', batchIndex, 'certificates', 'quarantineCertificate'],
                                                    file
                                                  );
                                                }
                                              }}
                                            >
                                              <Button icon={<CloudUploadOutlined />}>
                                                上传文件
                                              </Button>
                                            </Upload>
                                          </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                          <Form.Item
                                            {...restBatchField}
                                            name={[batchIndex, 'certificates', 'customsDeclaration']}
                                            label="报关单"
                                            tooltip="非法定检测商品可选：提供报关单可加快入库"
                                          >
                                            <Upload
                                              beforeUpload={() => false}
                                              maxCount={1}
                                              accept=".pdf,.jpg,.jpeg,.png"
                                              listType="text"
                                              onChange={(info) => {
                                                if (info.fileList && info.fileList.length > 0) {
                                                  const file = info.fileList[0].originFileObj;
                                                  appointmentForm.setFieldValue(
                                                    ['items', itemIndex, 'batches', batchIndex, 'certificates', 'customsDeclaration'],
                                                    file
                                                  );
                                                }
                                              }}
                                            >
                                              <Button icon={<CloudUploadOutlined />}>
                                                上传文件
                                              </Button>
                                            </Upload>
                                          </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                          <Form.Item
                                            {...restBatchField}
                                            name={[batchIndex, 'certificates', 'listingCertificate']}
                                            label="其他上市凭证"
                                            tooltip="可选：如厦门上市凭证等其他相关证明"
                                          >
                                            <Upload
                                              beforeUpload={() => false}
                                              maxCount={1}
                                              accept=".pdf,.jpg,.jpeg,.png"
                                              listType="text"
                                              onChange={(info) => {
                                                if (info.fileList && info.fileList.length > 0) {
                                                  const file = info.fileList[0].originFileObj;
                                                  appointmentForm.setFieldValue(
                                                    ['items', itemIndex, 'batches', batchIndex, 'certificates', 'listingCertificate'],
                                                    file
                                                  );
                                                }
                                              }}
                                            >
                                              <Button icon={<CloudUploadOutlined />}>
                                                上传文件
                                              </Button>
                                            </Upload>
                                          </Form.Item>
                                        </Col>
                                      </Row>
                                      <Alert
                                        message="文件上传说明"
                                        description={
                                          <div>
                                            <div>1. <Text strong>出厂检验报告</Text>：所有批次必填</div>
                                            <div>2. <Text strong>入境货物检验检疫证明</Text>：进口商品且为法定检测商品时必填</div>
                                            <div>3. <Text strong>报关单</Text>：非法定检测商品的进口商品建议上传</div>
                                            <div>4. <Text strong>其他上市凭证</Text>：根据商品类型选择性上传（如厦门上市凭证）</div>
                                          </div>
                                        }
                                        type="info"
                                        showIcon
                                        style={{ marginTop: '12px' }}
                                      />
                                    </Card>
                                    </>
                                  ))}
                                  <Button
                                    type="dashed"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleAddBatch(itemIndex as number)}
                                    style={{ width: '100%' }}
                                  >
                                    添加批次
                                  </Button>
                                </div>
                              )}
                            </Form.List>
                          </Card>
                        ))}
                      </div>
                    );
                  }}
                </Form.List>
              </Card>

              <div style={{ textAlign: 'right', marginTop: '24px' }}>
                <Space>
                  <Button onClick={() => setAppointmentModalVisible(false)}>取消</Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      // 验证第一步
                      appointmentForm.validateFields()
                        .then(() => setAppointmentStep(1))
                        .catch(() => message.warning('请完善商品批次信息'));
                    }}
                  >
                    下一步：物流信息
                  </Button>
                </Space>
              </div>
            </>
          )}

          {appointmentStep === 1 && (
            <>
              <Alert
                message="物流排程说明"
                description={
                  isNoAppointmentSupplier
                    ? '您是免预约供应商，可直接提交送货预约，无需选择时间。'
                    : '请填写司机和车辆信息，并选择预约送货日期和时段。'
                }
                type="warning"
                showIcon
                style={{ marginBottom: '16px' }}
              />

              <Row gutter={16}>
                <Col span={12}>
                  <Card title="司机信息" style={{ marginBottom: '16px' }}>
                    <Form.Item
                      name={['driver', 'name']}
                      label="司机姓名"
                      rules={[{ required: true, message: '请输入司机姓名' }]}
                    >
                      <Input placeholder="请输入司机姓名" />
                    </Form.Item>
                    <Form.Item
                      name={['driver', 'phone']}
                      label="司机电话"
                      rules={[
                        { required: true, message: '请输入司机电话' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                      ]}
                    >
                      <Input placeholder="请输入司机电话" />
                    </Form.Item>
                  </Card>
                </Col>

                <Col span={12}>
                  <Card title="车辆信息" style={{ marginBottom: '16px' }}>
                    <Form.Item
                      name={['vehicle', 'plateNumber']}
                      label="车牌号"
                      rules={[{ required: true, message: '请输入车牌号' }]}
                    >
                      <Input placeholder="如：粤B12345" />
                    </Form.Item>
                    <Form.Item
                      name={['vehicle', 'vehicleType']}
                      label="车辆类型"
                      rules={[{ required: true, message: '请选择车辆类型' }]}
                    >
                      <Select placeholder="请选择车辆类型">
                        <Select.Option value="truck_3t">3吨货车</Select.Option>
                        <Select.Option value="truck_5t">5吨货车</Select.Option>
                        <Select.Option value="truck_8t">8吨货车</Select.Option>
                        <Select.Option value="truck_10t">10吨货车</Select.Option>
                        <Select.Option value="van">面包车</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={['vehicle', 'loadCapacity']}
                      label="载重（吨）"
                      rules={[{ required: true, message: '请输入载重' }]}
                    >
                      <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入载重" />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>

              <Card title="预约排程" style={{ marginBottom: '16px' }}>
                <Form.Item
                  name={['schedule', 'isNoAppointment']}
                  valuePropName="checked"
                >
                  <Checkbox onChange={(e) => setIsNoAppointmentSupplier(e.target.checked)}>
                    免预约供应商（直接送货，无需预约）
                  </Checkbox>
                </Form.Item>

                {!isNoAppointmentSupplier && (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name={['schedule', 'appointmentDate']}
                        label="预约日期"
                        rules={[{ required: true, message: '请选择预约日期' }]}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          disabledDate={(current) => current && current < dayjs().startOf('day')}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={['schedule', 'timeSlot']}
                        label="预约时段"
                        rules={[{ required: true, message: '请选择预约时段' }]}
                      >
                        <Select placeholder="请选择预约时段">
                          <Select.Option value="08:00-10:00">08:00-10:00</Select.Option>
                          <Select.Option value="10:00-12:00">10:00-12:00</Select.Option>
                          <Select.Option value="12:00-14:00">12:00-14:00</Select.Option>
                          <Select.Option value="14:00-16:00">14:00-16:00</Select.Option>
                          <Select.Option value="16:00-18:00">16:00-18:00</Select.Option>
                          <Select.Option value="18:00-20:00">18:00-20:00</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                {isNoAppointmentSupplier && (
                  <Alert
                    message="免预约提示"
                    description="您已选择免预约模式，系统将生成预约单，但您可以直接送货到仓，无需等待审核。"
                    type="success"
                    showIcon
                  />
                )}
              </Card>

              <Form.Item name="notes" label="备注">
                <Input.TextArea rows={3} placeholder="可填写送货注意事项等" />
              </Form.Item>

              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button onClick={() => setAppointmentStep(0)}>上一步</Button>
                  <Button onClick={() => setAppointmentModalVisible(false)}>取消</Button>
                  <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                    提交预约
                  </Button>
                </Space>
              </div>
            </>
          )}
        </Form>
      </Modal>

      {/* 批次录入模态框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FilePdfOutlined style={{ marginRight: '8px', fontSize: '20px', color: '#1890ff' }} />
            <span>批次信息录入</span>
          </div>
        }
        open={batchEntryModalVisible}
        onCancel={() => setBatchEntryModalVisible(false)}
        width={1200}
        footer={null}
      >
        <Form form={batchEntryForm} layout="vertical">
          <Alert
            message="批次信息录入"
            description="请录入每批次的详细信息和证明文件。出厂检验报告为必填项。"
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <Form.List name="items">
            {(fields) => (
              <div>
                {!fields || fields.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    <ShoppingOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                    <div>暂无商品数据</div>
                  </div>
                ) : (
                  <div>
                    {fields.map(({ key, name: itemIndex, ...restField }) => (
                      <Card
                        key={key}
                        size="small"
                        style={{ marginBottom: '16px', backgroundColor: '#fafafa' }}
                        title={
                          <div>
                            <Text strong>
                              {batchEntryForm.getFieldValue(['items', itemIndex, 'productName'])}
                            </Text>
                            <Text type="secondary" style={{ marginLeft: '12px' }}>
                              条码: {batchEntryForm.getFieldValue(['items', itemIndex, 'barcode'])}
                            </Text>
                            <Tag color="blue" style={{ marginLeft: '12px' }}>
                              总数量: {batchEntryForm.getFieldValue(['items', itemIndex, 'totalQuantity'])} 件
                            </Tag>
                          </div>
                        }
                      >
                        <Form.List name={[itemIndex, 'batches']}>
                          {(batchFields, { add: addBatch, remove: removeBatch }) => (
                            <div>
                              {batchFields.map(({ key: batchKey, name: batchIndex, ...restBatchField }) => (
                                <>
                                  <Row key={batchKey} gutter={16} align="middle" style={{ marginBottom: '12px' }}>
                                    <Col span={2}>
                                      <Tag color="geekblue">批次 {batchIndex + 1}</Tag>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item
                                        {...restBatchField}
                                        name={[batchIndex, 'productionDate']}
                                        label="生产日期"
                                        rules={[{ required: true, message: '请选择生产日期' }]}
                                      >
                                        <DatePicker style={{ width: '100%' }} />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item
                                        {...restBatchField}
                                        name={[batchIndex, 'batchNo']}
                                        label="批次号"
                                        rules={[{ required: true, message: '请输入批次号' }]}
                                      >
                                        <Input placeholder="请输入批次号" />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item
                                        {...restBatchField}
                                        name={[batchIndex, 'quantity']}
                                        label="数量"
                                        rules={[{ required: true, message: '请输入数量' }]}
                                      >
                                        <InputNumber
                                          min={1}
                                          style={{ width: '100%' }}
                                          placeholder="请输入数量"
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                      {batchFields.length > 1 && (
                                        <Button
                                          type="text"
                                          danger
                                          icon={<DeleteOutlined />}
                                          onClick={() => handleBatchEntryRemoveBatch(itemIndex as number, batchIndex)}
                                        >
                                          删除
                                        </Button>
                                      )}
                                    </Col>
                                  </Row>

                                  {/* 证明文件上传 */}
                                  <Divider orientation="left" style={{ margin: '16px 0', fontSize: '14px' }}>
                                    <FilePdfOutlined style={{ marginRight: '8px' }} />
                                    批次证明文件
                                  </Divider>
                                  <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                                    <Row gutter={16}>
                                      <Col span={12}>
                                        <Form.Item
                                          {...restBatchField}
                                          name={[batchIndex, 'certificates', 'factoryReport']}
                                          label="出厂检验报告"
                                          tooltip="必填：每批次需提供出厂检验报告"
                                          rules={[{ required: true, message: '请上传出厂检验报告' }]}
                                        >
                                          <Upload
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            listType="text"
                                            onChange={(info) => {
                                              if (info.fileList && info.fileList.length > 0) {
                                                const file = info.fileList[0].originFileObj;
                                                batchEntryForm.setFieldValue(
                                                  ['items', itemIndex, 'batches', batchIndex, 'certificates', 'factoryReport'],
                                                  file
                                                );
                                              }
                                            }}
                                          >
                                            <Button icon={<CloudUploadOutlined />}>
                                              上传文件
                                            </Button>
                                          </Upload>
                                        </Form.Item>
                                      </Col>
                                      <Col span={12}>
                                        <Form.Item
                                          {...restBatchField}
                                          name={[batchIndex, 'certificates', 'quarantineCertificate']}
                                          label="入境货物检验检疫证明"
                                          tooltip="进口商品必填：法定检测商品需提供"
                                        >
                                          <Upload
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            listType="text"
                                            onChange={(info) => {
                                              if (info.fileList && info.fileList.length > 0) {
                                                const file = info.fileList[0].originFileObj;
                                                batchEntryForm.setFieldValue(
                                                  ['items', itemIndex, 'batches', batchIndex, 'certificates', 'quarantineCertificate'],
                                                  file
                                                );
                                              }
                                            }}
                                          >
                                            <Button icon={<CloudUploadOutlined />}>
                                              上传文件
                                            </Button>
                                          </Upload>
                                        </Form.Item>
                                      </Col>
                                      <Col span={12}>
                                        <Form.Item
                                          {...restBatchField}
                                          name={[batchIndex, 'certificates', 'customsDeclaration']}
                                          label="报关单"
                                          tooltip="非法定检测商品可选：提供报关单可加快入库"
                                        >
                                          <Upload
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            listType="text"
                                            onChange={(info) => {
                                              if (info.fileList && info.fileList.length > 0) {
                                                const file = info.fileList[0].originFileObj;
                                                batchEntryForm.setFieldValue(
                                                  ['items', itemIndex, 'batches', batchIndex, 'certificates', 'customsDeclaration'],
                                                  file
                                                );
                                              }
                                            }}
                                          >
                                            <Button icon={<CloudUploadOutlined />}>
                                              上传文件
                                            </Button>
                                          </Upload>
                                        </Form.Item>
                                      </Col>
                                      <Col span={12}>
                                        <Form.Item
                                          {...restBatchField}
                                          name={[batchIndex, 'certificates', 'listingCertificate']}
                                          label="其他上市凭证"
                                          tooltip="可选：如厦门上市凭证等其他相关证明"
                                        >
                                          <Upload
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            listType="text"
                                            onChange={(info) => {
                                              if (info.fileList && info.fileList.length > 0) {
                                                const file = info.fileList[0].originFileObj;
                                                batchEntryForm.setFieldValue(
                                                  ['items', itemIndex, 'batches', batchIndex, 'certificates', 'listingCertificate'],
                                                  file
                                                );
                                              }
                                            }}
                                          >
                                            <Button icon={<CloudUploadOutlined />}>
                                              上传文件
                                            </Button>
                                          </Upload>
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                    <Alert
                                      message="文件上传说明"
                                      description={
                                        <div>
                                          <div>1. <Text strong>出厂检验报告</Text>：所有批次必填</div>
                                          <div>2. <Text strong>入境货物检验检疫证明</Text>：进口商品且为法定检测商品时必填</div>
                                          <div>3. <Text strong>报关单</Text>：非法定检测商品的进口商品建议上传</div>
                                          <div>4. <Text strong>其他上市凭证</Text>：根据商品类型选择性上传（如厦门上市凭证）</div>
                                        </div>
                                      }
                                      type="info"
                                      showIcon
                                      style={{ marginTop: '12px' }}
                                    />
                                  </Card>
                                </>
                              ))}
                              <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={() => handleBatchEntryAddBatch(itemIndex as number)}
                                style={{ width: '100%' }}
                              >
                                添加批次
                              </Button>
                            </div>
                          )}
                        </Form.List>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Form.List>

          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <Space>
              <Button onClick={() => setBatchEntryModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit" onClick={handleBatchEntrySubmit}>
                提交批次信息
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
