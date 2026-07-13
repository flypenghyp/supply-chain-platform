import React, { useEffect, useMemo, useState } from 'react';
import {
  Table, Button, Space, Drawer, Form, Input, Select, message, Card, Row, Col,
  Tag, Alert, Typography, DatePicker, InputNumber, Statistic, Modal, Descriptions
} from 'antd';
import {
  PlusOutlined, EyeOutlined, FileTextOutlined, CheckCircleOutlined,
  WarningOutlined, ClockCircleOutlined,
  EditOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { QualityIssue, QualityItem } from '../types/quality';
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter';
import './QualityManagement.scss';

const { Text, Paragraph } = Typography;
const { Option } = Select;

interface SupplierOption {
  code: string;
  name: string;
}

const QualityManagement: React.FC = () => {
  const [issues, setIssues] = useState<QualityIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [createDrawerVisible, setCreateDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [auditDrawerVisible, setAuditDrawerVisible] = useState(false);
  const [disagreeDrawerVisible, setDisagreeDrawerVisible] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [closeModalVisible, setCloseModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<QualityIssue | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [auditForm] = Form.useForm();
  const [rejectForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [filters, setFilters] = useState({
    supplierName: '',
    problemType: '',
    severity: '',
    status: ''
  });

  const supplierOptions: SupplierOption[] = [
    { code: '600583', name: '深圳市礼悦食品有限公司' },
    { code: '600584', name: '东莞美食品有限公司' },
    { code: '600585', name: '广州鲜味食品有限公司' }
  ];

  const problemTypeOptions = [
    '商品标识不合格-标识',
    '商品标识不合格-保质期',
    '质量不合格-过期',
    '质量不合格-异物',
    '其他'
  ];

  const handlingActionOptions = ['撤柜退货', '自查自纠', '下架整改', '召回处理'];

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData: QualityIssue[] = [
        {
          id: '1',
          noticeNo: '20250001',
          supplierCode: '600583',
          supplierName: '深圳市礼悦食品有限公司',
          occurrenceDate: '2025-05-09',
          orgName: '天虹sp@ce新安优城店',
          inspectionType: 'Internal',
          violationRegulation: '食品安全法',
          violationContent: '生产批次20250401-01,商品外包装标签粘不牢、易脱落,条码错误',
          handlingAction: '撤柜退货',
          problemScope: 'Batch',
          problemType: '商品标识不合格-标识',
          severity: 'High',
          penaltyPoints: 3,
          items: [
            {
              storeCode: '60014',
              storeName: 'sp@ce新安优城店',
              barcode: '6942536578049',
              productName: '天口味迷你虎皮瑞士卷蛋糕'
            }
          ],
          status: 'pending',
          breachSignStatus: 'pending',
          deductionSignStatus: 'pending',
          createTime: '2025-05-09 14:30:00'
        },
        {
          id: '2',
          noticeNo: '20250002',
          supplierCode: '600584',
          supplierName: '东莞美食品有限公司',
          occurrenceDate: '2025-05-10',
          orgName: '天虹sp@ce宝安店',
          inspectionType: 'External',
          violationRegulation: '食品安全法',
          violationContent: '生产批次20250415-03,保质期标注错误',
          handlingAction: '自查自纠',
          problemScope: 'Individual',
          problemType: '商品标识不合格-保质期',
          severity: 'General',
          penaltyPoints: 1,
          items: [
            {
              storeCode: '60016',
              storeName: 'sp@ce宝安店',
              barcode: '6942536578050',
              productName: '美式巧克力曲奇'
            }
          ],
          supplierAnalysis: '标签模板更新不及时',
          rectificationMeasures: '完善标签管理制度',
          supplierRepName: '张三',
          supplierRepPhone: '13800138000',
          supplierSubmitTime: '2025-05-11 09:30:00',
          status: 'processing',
          breachSignStatus: 'signed',
          breachSignedAt: '2025-05-11 10:00:00',
          breachSigner: '供应商用户',
          breachSignFlowId: 'FLOW-B-001',
          deductionSignStatus: 'pending',
          createTime: '2025-05-10 09:00:00'
        },
        {
          id: '3',
          noticeNo: '20250003',
          supplierCode: '600585',
          supplierName: '广州鲜味食品有限公司',
          occurrenceDate: '2025-05-12',
          orgName: '天虹sp@ce南山店',
          inspectionType: 'Internal',
          violationRegulation: '食品安全法',
          violationContent: '商品过期仍在架销售',
          handlingAction: '撤柜退货',
          problemScope: 'Batch',
          problemType: '质量不合格-过期',
          severity: 'High',
          penaltyPoints: 5,
          items: [
            {
              storeCode: '60017',
              storeName: 'sp@ce南山店',
              barcode: '6942536578061',
              productName: '即食鸡胸肉'
            }
          ],
          supplierAnalysis: '库房盘点疏漏',
          rectificationMeasures: '建立临期商品预警机制',
          supplierRepName: '李四',
          supplierRepPhone: '13900139000',
          supplierSubmitTime: '2025-05-13 09:00:00',
          auditOpinion: '违反食品安全法，扣除违约金',
          penaltyAmount: 10000,
          penaltyStatus: 'pending',
          status: 'deduction_pending',
          breachSignStatus: 'signed',
          breachSignedAt: '2025-05-13 10:00:00',
          breachSigner: '供应商用户',
          breachSignFlowId: 'FLOW-B-003',
          deductionSignStatus: 'pending',
          createTime: '2025-05-12 08:00:00'
        },
        {
          id: '4',
          noticeNo: '20250004',
          supplierCode: '600586',
          supplierName: '上海优选食品有限公司',
          occurrenceDate: '2025-05-14',
          orgName: '天虹sp@ce福田店',
          inspectionType: 'Internal',
          violationRegulation: '食品安全法',
          violationContent: '商品标签与实物不符',
          handlingAction: '自查自纠',
          problemScope: 'Individual',
          problemType: '商品标识不合格-标识',
          severity: 'General',
          penaltyPoints: 1,
          items: [
            {
              storeCode: '60018',
              storeName: 'sp@ce福田店',
              barcode: '6942536578072',
              productName: '原味酸奶'
            }
          ],
          supplierDisagreeReason: '该批次商品并非我司供货，标签问题应由物流环节负责',
          supplierDisagreedAt: '2025-05-15 10:30:00',
          status: 'supplier_disagreed',
          breachSignStatus: 'pending',
          deductionSignStatus: 'pending',
          createTime: '2025-05-14 16:00:00'
        }
      ];
      setIssues(mockData);
      setLoading(false);
    }, 600);
  };

  const filteredData = useMemo(() => {
    return issues.filter((item) => {
      if (filters.supplierName && !item.supplierName.includes(filters.supplierName)) return false;
      if (filters.problemType && item.problemType !== filters.problemType) return false;
      if (filters.severity && item.severity !== filters.severity) return false;
      if (filters.status && item.status !== filters.status) return false;
      return true;
    });
  }, [issues, filters]);

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      Low: 'blue',
      General: 'orange',
      High: 'red'
    };
    return colors[severity] || 'default';
  };

  const getSeverityText = (severity: string) => {
    const texts: Record<string, string> = {
      Low: '低',
      General: '一般',
      High: '高'
    };
    return texts[severity] || severity;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'orange',
      supplier_disagreed: 'purple',
      processing: 'blue',
      rejected: 'red',
      deduction_pending: 'cyan',
      completed: 'green',
      closed: 'default'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: '待签违约函',
      supplier_disagreed: '供应商异议',
      processing: '处理中',
      rejected: '已驳回',
      deduction_pending: '待签扣款单',
      completed: '已完成',
      closed: '已关闭'
    };
    return texts[status] || status;
  };

  const getSignStatusText = (status?: string) => {
    if (status === 'signed') return '已签章';
    return '待签章';
  };

  const formatNoticeNo = (record?: QualityIssue | null) => {
    if (!record?.noticeNo) return '-';
    return `VN${record.noticeNo.padStart(6, '0')}`;
  };

  const updateIssue = (id: string, patch: Partial<QualityIssue>) => {
    setIssues((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...patch, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }
          : item
      )
    );
  };

  const handleCreate = (values: Record<string, unknown>) => {
    const supplier = supplierOptions.find((s) => s.code === values.supplierCode);
    const occurrenceDate = (values.occurrenceDate as Dayjs).format('YYYY-MM-DD');
    const items = (values.items as QualityItem[]) || [];
    const newIssue: QualityIssue = {
      id: String(Date.now()),
      noticeNo: `${dayjs().format('YYYYMMDD')}${String(issues.length + 1).padStart(3, '0')}`,
      supplierCode: supplier?.code || (values.supplierCode as string),
      supplierName: supplier?.name || (values.supplierCode as string),
      occurrenceDate,
      orgName: values.orgName as string,
      inspectionType: values.inspectionType as 'Internal' | 'External',
      violationRegulation: values.violationRegulation as string,
      violationContent: values.violationContent as string,
      handlingAction: values.handlingAction as string,
      problemScope: values.problemScope as 'Batch' | 'Individual',
      problemType: values.problemType as string,
      severity: values.severity as 'Low' | 'General' | 'High',
      penaltyPoints: Number(values.penaltyPoints) || 0,
      items,
      status: 'pending',
      breachSignStatus: 'pending',
      deductionSignStatus: 'pending',
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    };
    setIssues((prev) => [newIssue, ...prev]);
    message.success('质量问题单已发起');
    setCreateDrawerVisible(false);
    createForm.resetFields();
  };

  const handleAuditApprove = (values: Record<string, unknown>) => {
    if (!selectedRecord) return;
    updateIssue(selectedRecord.id, {
      auditOpinion: values.auditOpinion as string,
      penaltyAmount: Number(values.penaltyAmount) || 0,
      penaltyStatus: values.penaltyStatus as 'pending' | 'deducted',
      status: 'deduction_pending',
      deductionSignStatus: 'pending'
    });
    message.success('审核通过，已生成违约扣款单并推送供应商');
    setAuditDrawerVisible(false);
    auditForm.resetFields();
  };

  const handleRejectSubmit = (values: { rejectReason: string }) => {
    if (!selectedRecord) return;
    updateIssue(selectedRecord.id, {
      rejectReason: values.rejectReason,
      status: 'rejected'
    });
    message.success('已驳回，供应商需重新处理');
    setRejectModalVisible(false);
    setAuditDrawerVisible(false);
    rejectForm.resetFields();
  };

  const handleViewDetail = (record: QualityIssue) => {
    setSelectedRecord(record);
    setDetailDrawerVisible(true);
  };

  const handleOpenAudit = (record: QualityIssue) => {
    setSelectedRecord(record);
    auditForm.setFieldsValue({
      auditOpinion: record.auditOpinion || '',
      penaltyAmount: record.penaltyAmount || 0,
      penaltyStatus: record.penaltyStatus || 'pending'
    });
    setAuditDrawerVisible(true);
  };

  const handleOpenDisagreeHandle = (record: QualityIssue) => {
    setSelectedRecord(record);
    setDisagreeDrawerVisible(true);
  };

  const handleOpenEditResend = (record: QualityIssue) => {
    setSelectedRecord(record);
    editForm.setFieldsValue({
      supplierCode: record.supplierCode,
      occurrenceDate: dayjs(record.occurrenceDate),
      orgName: record.orgName,
      inspectionType: record.inspectionType,
      violationRegulation: record.violationRegulation,
      violationContent: record.violationContent,
      problemType: record.problemType,
      problemScope: record.problemScope,
      severity: record.severity,
      handlingAction: record.handlingAction,
      penaltyPoints: record.penaltyPoints,
      items: record.items
    });
    setEditDrawerVisible(true);
  };

  const handleEditResend = (values: Record<string, unknown>) => {
    if (!selectedRecord) return;
    const supplier = supplierOptions.find((s) => s.code === values.supplierCode);
    const occurrenceDate = (values.occurrenceDate as Dayjs).format('YYYY-MM-DD');
    const items = (values.items as QualityItem[]) || [];
    updateIssue(selectedRecord.id, {
      supplierCode: supplier?.code || (values.supplierCode as string),
      supplierName: supplier?.name || (values.supplierCode as string),
      occurrenceDate,
      orgName: values.orgName as string,
      inspectionType: values.inspectionType as 'Internal' | 'External',
      violationRegulation: values.violationRegulation as string,
      violationContent: values.violationContent as string,
      handlingAction: values.handlingAction as string,
      problemScope: values.problemScope as 'Batch' | 'Individual',
      problemType: values.problemType as string,
      severity: values.severity as 'Low' | 'General' | 'High',
      penaltyPoints: Number(values.penaltyPoints) || 0,
      items,
      supplierDisagreeReason: undefined,
      supplierDisagreedAt: undefined,
      breachSignStatus: 'pending',
      status: 'pending'
    });
    message.success('已重新推送违约函');
    setEditDrawerVisible(false);
    setDisagreeDrawerVisible(false);
    editForm.resetFields();
  };

  const handleForceDeduction = () => {
    if (!selectedRecord) return;
    if (!selectedRecord.auditOpinion) {
      setDisagreeDrawerVisible(false);
      auditForm.setFieldsValue({
        auditOpinion: selectedRecord.auditOpinion || '',
        penaltyAmount: selectedRecord.penaltyAmount || 0,
        penaltyStatus: selectedRecord.penaltyStatus || 'pending'
      });
      setAuditDrawerVisible(true);
      return;
    }
    updateIssue(selectedRecord.id, {
      status: 'deduction_pending',
      deductionSignStatus: 'pending'
    });
    message.success('已强制生成违约扣款单');
    setDisagreeDrawerVisible(false);
  };

  const handleCloseIssue = () => {
    if (!selectedRecord) return;
    updateIssue(selectedRecord.id, { status: 'closed' });
    message.success('单据已关闭');
    setCloseModalVisible(false);
    setDisagreeDrawerVisible(false);
  };

  const columns = [
    {
      title: '通知单号',
      dataIndex: 'noticeNo',
      key: 'noticeNo',
      width: 130,
      render: (_: string, record: QualityIssue) => (
        <div className="qm-notice-no">{formatNoticeNo(record)}</div>
      )
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 180,
      render: (text: string, record: QualityIssue) => (
        <div>
          <div>{text}</div>
          <div className="qm-sub-text">编码: {record.supplierCode}</div>
        </div>
      )
    },
    {
      title: '问题类型',
      dataIndex: 'problemType',
      key: 'problemType',
      width: 170,
      render: (type: string) => <Tag color="red">{type}</Tag>
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => (
        <Tag color={getSeverityColor(severity)}>{getSeverityText(severity)}</Tag>
      )
    },
    {
      title: '违约金',
      dataIndex: 'penaltyAmount',
      key: 'penaltyAmount',
      width: 110,
      render: (amount?: number) => (
        <div className={amount && amount > 0 ? 'qm-danger-text' : 'qm-success-text'}>
          {amount && amount > 0 ? `¥${amount.toLocaleString()}` : '无'}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
    },
    {
      title: '违约函签章',
      dataIndex: 'breachSignStatus',
      key: 'breachSignStatus',
      width: 110,
      render: (status?: string) => <Tag color={status === 'signed' ? 'green' : 'orange'}>{getSignStatusText(status)}</Tag>
    },
    {
      title: '扣款单签章',
      dataIndex: 'deductionSignStatus',
      key: 'deductionSignStatus',
      width: 110,
      render: (status?: string, record?: QualityIssue) => {
        if (record?.status === 'pending' || record?.status === 'processing' || record?.status === 'rejected') {
          return <Tag>未生成</Tag>;
        }
        return <Tag color={status === 'signed' ? 'green' : 'orange'}>{getSignStatusText(status)}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      fixed: 'right' as const,
      render: (_: unknown, record: QualityIssue) => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record)}>
            查看
          </Button>
          {(record.status === 'processing' || record.status === 'rejected') && (
            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleOpenAudit(record)}>
              审核
            </Button>
          )}
          {record.status === 'supplier_disagreed' && (
            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleOpenDisagreeHandle(record)}>
              处理异议
            </Button>
          )}
        </Space>
      )
    }
  ];

  const renderInfoDescriptions = (record: QualityIssue) => (
    <Descriptions column={2} size="small">
      <Descriptions.Item label="供应商编码">{record.supplierCode}</Descriptions.Item>
      <Descriptions.Item label="供应商名称">{record.supplierName}</Descriptions.Item>
      <Descriptions.Item label="发生日期">{dayjs(record.occurrenceDate).format('YYYY-MM-DD')}</Descriptions.Item>
      <Descriptions.Item label="组织架构">{record.orgName}</Descriptions.Item>
      <Descriptions.Item label="检查类型">
        <Tag color="blue">{record.inspectionType === 'Internal' ? '内部检查' : '外部检查'}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="违反条例">
        <Tag color="red">{record.violationRegulation}</Tag>
      </Descriptions.Item>
    </Descriptions>
  );

  const renderViolationDescriptions = (record: QualityIssue) => (
    <Descriptions column={2} size="small">
      <Descriptions.Item label="问题类型" span={2}>
        <Tag color="red">{record.problemType}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="严重程度">
        <Tag color={getSeverityColor(record.severity)}>{getSeverityText(record.severity)}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="问题范围">
        <Tag color="orange">{record.problemScope === 'Batch' ? '批量' : '个别'}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="处理方式">{record.handlingAction}</Descriptions.Item>
      <Descriptions.Item label="违约扣分">
        <Text strong className="qm-danger-text">{record.penaltyPoints} 分</Text>
      </Descriptions.Item>
      <Descriptions.Item label="违规内容描述" span={2}>
        <Paragraph className="qm-warning-block">{record.violationContent}</Paragraph>
      </Descriptions.Item>
    </Descriptions>
  );

  const renderItemsTable = (record: QualityIssue) => (
    <Table
      dataSource={record.items}
      pagination={false}
      size="small"
      columns={[
        { title: '门店编码', dataIndex: 'storeCode', key: 'storeCode', width: 120 },
        { title: '门店名称', dataIndex: 'storeName', key: 'storeName', width: 200 },
        { title: '商品条码', dataIndex: 'barcode', key: 'barcode', width: 140 },
        { title: '商品名称', dataIndex: 'productName', key: 'productName' }
      ]}
      rowKey={(item: QualityItem, index?: number) => `${item.barcode}-${index ?? 0}`}
    />
  );

  const renderFeedbackDescriptions = (record: QualityIssue) => (
    <Descriptions column={1} size="small">
      <Descriptions.Item label="原因分析">{record.supplierAnalysis || '待供应商填写'}</Descriptions.Item>
      <Descriptions.Item label="整改措施">{record.rectificationMeasures || '待供应商填写'}</Descriptions.Item>
      <Descriptions.Item label="供应商负责人">{record.supplierRepName || '-'}</Descriptions.Item>
      <Descriptions.Item label="手机号码">{record.supplierRepPhone || '-'}</Descriptions.Item>
      <Descriptions.Item label="反馈时间">{record.supplierSubmitTime || '-'}</Descriptions.Item>
    </Descriptions>
  );

  const renderAuditDescriptions = (record: QualityIssue) => (
    <Descriptions column={1} size="small">
      <Descriptions.Item label="审核意见">{record.auditOpinion || '待填写'}</Descriptions.Item>
      <Descriptions.Item label="违约金金额">
        {(record.penaltyAmount || 0) > 0 ? (
          <Text strong className="qm-danger-text" style={{ fontSize: 18 }}>
            ¥{record.penaltyAmount?.toLocaleString()}
          </Text>
        ) : (
          <Text className="qm-success-text">无</Text>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="扣分状态">
        {record.penaltyStatus === 'deducted' ? '已扣除' : '待扣除'}
      </Descriptions.Item>
      {record.rejectReason && (
        <Descriptions.Item label="驳回原因">
          <Paragraph>{record.rejectReason}</Paragraph>
        </Descriptions.Item>
      )}
    </Descriptions>
  );

  const renderSignRecords = (record: QualityIssue) => (
    <Descriptions column={1} size="small" bordered>
      <Descriptions.Item label="质量违约函签章">
        {record.breachSignStatus === 'signed' ? (
          <Text className="qm-success-text">
            已签章（{record.breachSigner} · {record.breachSignedAt} · {record.breachSignFlowId}）
          </Text>
        ) : (
          <Text className="qm-warning-text">待签章</Text>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="违约扣款单签章">
        {record.deductionSignStatus === 'signed' ? (
          <Text className="qm-success-text">
            已签章（{record.deductionSigner} · {record.deductionSignedAt} · {record.deductionSignFlowId}）
          </Text>
        ) : (
          <Text className="qm-warning-text">
            {['pending', 'processing', 'rejected'].includes(record.status) ? '未生成' : '待签章'}
          </Text>
        )}
      </Descriptions.Item>
    </Descriptions>
  );

  return (
    <div className="quality-management-page">
      <Card>
        <Alert
          message="质量管理流程说明"
          description="零售商发起质量问题单后，系统自动生成质量违约函推送给供应商签章；供应商反馈整改后，零售商审核并生成违约扣款单，供应商再次签章完成闭环。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <AdvancedSearchFilter
          fields={[
            {
              key: 'supplierName',
              label: '供应商名称',
              type: 'input',
              placeholder: '请输入供应商名称'
            },
            {
              key: 'problemType',
              label: '问题类型',
              type: 'select',
              placeholder: '请选择问题类型',
              options: problemTypeOptions.map((t) => ({ label: t, value: t }))
            },
            {
              key: 'severity',
              label: '严重程度',
              type: 'select',
              placeholder: '请选择严重程度',
              options: [
                { label: '低', value: 'Low' },
                { label: '一般', value: 'General' },
                { label: '高', value: 'High' }
              ]
            },
            {
              key: 'status',
              label: '处理状态',
              type: 'select',
              placeholder: '请选择处理状态',
              options: [
                { label: '待签违约函', value: 'pending' },
                { label: '供应商异议', value: 'supplier_disagreed' },
                { label: '处理中', value: 'processing' },
                { label: '已驳回', value: 'rejected' },
                { label: '待签扣款单', value: 'deduction_pending' },
                { label: '已完成', value: 'completed' },
                { label: '已关闭', value: 'closed' }
              ]
            }
          ]}
          values={filters}
          onChange={(k, v) => setFilters({ ...filters, [k]: v })}
          onSearch={() => message.success('筛选已应用')}
          onReset={() => setFilters({ supplierName: '', problemType: '', severity: '', status: '' })}
          extraActions={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateDrawerVisible(true)}>
              发起质量问题单
            </Button>
          }
        />

        <Row gutter={16} className="qm-stats">
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="质量问题单总数"
                value={filteredData.length}
                suffix="份"
                valueStyle={{ color: '#1890ff' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="高风险单数"
                value={filteredData.filter((item) => item.severity === 'High').length}
                suffix="份"
                valueStyle={{ color: '#f5222d' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="处理中单数"
                value={filteredData.filter((item) => item.status === 'processing' || item.status === 'rejected').length}
                suffix="份"
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="已完成单数"
                value={filteredData.filter((item) => item.status === 'completed').length}
                suffix="份"
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total: number, range: [number, number]) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* 新建抽屉 */}
      <Drawer
        title="发起质量问题单"
        placement="right"
        onClose={() => {
          setCreateDrawerVisible(false);
          createForm.resetFields();
        }}
        open={createDrawerVisible}
        width={720}
        className="qm-create-drawer"
        bodyStyle={{ padding: '24px' }}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setCreateDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => createForm.submit()}>
              提交
            </Button>
          </Space>
        }
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Card size="small" title="基础信息" className="qm-card">
            <Form.Item
              name="supplierCode"
              label="供应商"
              rules={[{ required: true, message: '请选择供应商' }]}
            >
              <Select
                placeholder="请选择供应商"
                showSearch
                optionFilterProp="children"
              >
                {supplierOptions.map((s) => (
                  <Option key={s.code} value={s.code}>
                    {s.name}（{s.code}）
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="occurrenceDate"
              label="发生日期"
              rules={[{ required: true, message: '请选择发生日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="orgName"
              label="组织架构"
              rules={[{ required: true, message: '请输入组织架构' }]}
            >
              <Input placeholder="请输入组织架构" />
            </Form.Item>

            <Form.Item
              name="inspectionType"
              label="检查类型"
              rules={[{ required: true, message: '请选择检查类型' }]}
            >
              <Select placeholder="请选择检查类型">
                <Option value="Internal">内部检查</Option>
                <Option value="External">外部检查</Option>
              </Select>
            </Form.Item>
          </Card>

          <Card size="small" title="违规详情" className="qm-card qm-violation-card">
            <Form.Item
              name="violationRegulation"
              label="违反条例"
              rules={[{ required: true, message: '请输入违反条例' }]}
            >
              <Input placeholder="如：食品安全法" />
            </Form.Item>

            <Form.Item
              name="violationContent"
              label="违规内容描述"
              rules={[{ required: true, message: '请输入违规内容描述' }]}
            >
              <Input.TextArea rows={3} placeholder="请详细描述违规内容" />
            </Form.Item>

            <Form.Item
              name="problemType"
              label="问题类型"
              rules={[{ required: true, message: '请选择问题类型' }]}
            >
              <Select placeholder="请选择问题类型">
                {problemTypeOptions.map((t) => (
                  <Option key={t} value={t}>
                    {t}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="problemScope"
              label="问题范围"
              rules={[{ required: true, message: '请选择问题范围' }]}
            >
              <Select placeholder="请选择问题范围">
                <Option value="Batch">批量</Option>
                <Option value="Individual">个别</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="severity"
              label="严重程度"
              rules={[{ required: true, message: '请选择严重程度' }]}
            >
              <Select placeholder="请选择严重程度">
                <Option value="Low">低</Option>
                <Option value="General">一般</Option>
                <Option value="High">高</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="handlingAction"
              label="处理方式"
              rules={[{ required: true, message: '请选择处理方式' }]}
            >
              <Select placeholder="请选择处理方式">
                {handlingActionOptions.map((a) => (
                  <Option key={a} value={a}>
                    {a}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="penaltyPoints"
              label="违约扣分"
              rules={[{ required: true, message: '请输入违约扣分' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入违约扣分" />
            </Form.Item>
          </Card>

          <Card size="small" title="关联商品" className="qm-card">
            <Form.List
              name="items"
              initialValue={[{ storeCode: '', storeName: '', barcode: '', productName: '' }]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} align="baseline" className="qm-item-row">
                      <Form.Item
                        {...restField}
                        name={[name, 'storeCode']}
                        rules={[{ required: true, message: '请输入门店编码' }]}
                      >
                        <Input placeholder="门店编码" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'storeName']}
                        rules={[{ required: true, message: '请输入门店名称' }]}
                      >
                        <Input placeholder="门店名称" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'barcode']}
                        rules={[{ required: true, message: '请输入商品条码' }]}
                      >
                        <Input placeholder="商品条码" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'productName']}
                        rules={[{ required: true, message: '请输入商品名称' }]}
                      >
                        <Input placeholder="商品名称" />
                      </Form.Item>
                      <Button type="link" danger onClick={() => remove(name)}>
                        删除
                      </Button>
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block>
                    添加商品
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        </Form>
      </Drawer>

      {/* 详情抽屉 */}
      <Drawer
        title={`质量问题单详情 - ${formatNoticeNo(selectedRecord)}`}
        placement="right"
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
        width={720}
        className="qm-detail-drawer"
        bodyStyle={{ padding: '24px' }}
      >
        {selectedRecord && (
          <div>
            <Card size="small" title="基础信息" className="qm-card">
              {renderInfoDescriptions(selectedRecord)}
            </Card>
            <Card size="small" title="违规详情" className="qm-card qm-violation-card">
              {renderViolationDescriptions(selectedRecord)}
            </Card>
            <Card size="small" title="关联商品列表" className="qm-card">
              {renderItemsTable(selectedRecord)}
            </Card>
            <Card size="small" title="整改反馈" className="qm-card">
              {renderFeedbackDescriptions(selectedRecord)}
            </Card>
            {selectedRecord.supplierDisagreeReason && (
              <Card size="small" title="供应商异议" className="qm-card">
                <Descriptions column={1} size="small" className="qm-disagree-desc">
                  <Descriptions.Item label="异议时间">{selectedRecord.supplierDisagreedAt || '-'}</Descriptions.Item>
                  <Descriptions.Item label="不同意原因">
                    <Paragraph className="qm-warning-block">{selectedRecord.supplierDisagreeReason}</Paragraph>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
            <Card size="small" title="审核结果" className="qm-card qm-audit-card">
              {renderAuditDescriptions(selectedRecord)}
            </Card>
            <Card size="small" title="签章记录" className="qm-card">
              {renderSignRecords(selectedRecord)}
            </Card>
          </div>
        )}
      </Drawer>

      {/* 审核抽屉 */}
      <Drawer
        title={`审核质量问题单 - ${formatNoticeNo(selectedRecord)}`}
        placement="right"
        onClose={() => {
          setAuditDrawerVisible(false);
          auditForm.resetFields();
        }}
        open={auditDrawerVisible}
        width={720}
        className="qm-audit-drawer"
        bodyStyle={{ padding: '24px' }}
      >
        {selectedRecord && (
          <>
            <Card size="small" title="基础信息" className="qm-card">
              {renderInfoDescriptions(selectedRecord)}
            </Card>
            <Card size="small" title="违规详情" className="qm-card qm-violation-card">
              {renderViolationDescriptions(selectedRecord)}
            </Card>
            <Card size="small" title="关联商品列表" className="qm-card">
              {renderItemsTable(selectedRecord)}
            </Card>
            <Card size="small" title="整改反馈" className="qm-card">
              {renderFeedbackDescriptions(selectedRecord)}
            </Card>

            <Card size="small" title="审核意见" className="qm-card qm-audit-card">
              <Form form={auditForm} layout="vertical" onFinish={handleAuditApprove}>
                <Form.Item
                  name="auditOpinion"
                  label="审核意见"
                  rules={[{ required: true, message: '请输入审核意见' }]}
                >
                  <Input.TextArea rows={3} placeholder="请填写审核意见" />
                </Form.Item>

                <Form.Item
                  name="penaltyAmount"
                  label="违约金金额"
                  rules={[{ required: true, message: '请输入违约金金额' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    precision={2}
                    prefix="¥"
                    placeholder="请输入违约金金额"
                  />
                </Form.Item>

                <Form.Item
                  name="penaltyStatus"
                  label="扣分状态"
                  rules={[{ required: true, message: '请选择扣分状态' }]}
                >
                  <Select placeholder="请选择扣分状态">
                    <Option value="pending">待扣除</Option>
                    <Option value="deducted">已扣除</Option>
                  </Select>
                </Form.Item>

                <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                  <Space>
                    <Button onClick={() => setAuditDrawerVisible(false)}>取消</Button>
                    <Button danger icon={<CloseCircleOutlined />} onClick={() => setRejectModalVisible(true)}>
                      驳回
                    </Button>
                    <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                      通过并生成扣款单
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </>
        )}
      </Drawer>

      {/* 驳回弹窗 */}
      <Modal
        title="驳回整改反馈"
        open={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false);
          rejectForm.resetFields();
        }}
        onOk={() => rejectForm.submit()}
        okText="确认驳回"
        okButtonProps={{ danger: true }}
      >
        <Form form={rejectForm} layout="vertical" onFinish={handleRejectSubmit}>
          <Form.Item
            name="rejectReason"
            label="驳回原因"
            rules={[{ required: true, message: '请输入驳回原因' }]}
          >
            <Input.TextArea rows={4} placeholder="请填写驳回原因，供应商将根据原因重新处理" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 供应商异议处理抽屉 */}
      <Drawer
        title={`处理供应商异议 - ${formatNoticeNo(selectedRecord)}`}
        placement="right"
        onClose={() => setDisagreeDrawerVisible(false)}
        open={disagreeDrawerVisible}
        width={720}
        className="qm-disagree-drawer"
        bodyStyle={{ padding: '24px' }}
      >
        {selectedRecord && (
          <>
            <Alert
              message="供应商异议"
              description={
                <div>
                  <p>供应商对《质量违约函》存在异议，请根据异议内容选择处理方式。</p>
                  <p><Text strong>异议时间：</Text>{selectedRecord.supplierDisagreedAt}</p>
                </div>
              }
              type="warning"
              showIcon
              style={{ marginBottom: 24 }}
            />
            <Card size="small" title="异议详情" className="qm-card qm-violation-card">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="供应商">{selectedRecord.supplierName}（{selectedRecord.supplierCode}）</Descriptions.Item>
                <Descriptions.Item label="通知单号">{formatNoticeNo(selectedRecord)}</Descriptions.Item>
                <Descriptions.Item label="违约函摘要">
                  贵司供应的商品在{selectedRecord.orgName}发生{selectedRecord.problemType}问题，违反《{selectedRecord.violationRegulation}》相关规定。
                </Descriptions.Item>
                <Descriptions.Item label="不同意原因">
                  <Paragraph className="qm-warning-block">{selectedRecord.supplierDisagreeReason}</Paragraph>
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <Card size="small" title="单据关键信息" className="qm-card">
              {renderInfoDescriptions(selectedRecord)}
              <div style={{ marginTop: 16 }}>{renderViolationDescriptions(selectedRecord)}</div>
            </Card>
            <Card size="small" title="处理操作" className="qm-card qm-audit-card">
              <Alert
                message="请选择对本次异议的处理方式"
                description="修改并重发将清除异议并回到待签章状态；强制生成扣款单将跳过违约函签章；关闭单据将结束流程。"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <div className="qm-disagree-actions">
                <Button type="primary" icon={<EditOutlined />} onClick={() => handleOpenEditResend(selectedRecord)}>
                  修改并重发
                </Button>
                <Button danger icon={<WarningOutlined />} onClick={handleForceDeduction}>
                  强制生成扣款单
                </Button>
                <Button icon={<CloseCircleOutlined />} onClick={() => setCloseModalVisible(true)}>
                  关闭单据
                </Button>
              </div>
            </Card>
          </>
        )}
      </Drawer>

      {/* 修改并重发抽屉 */}
      <Drawer
        title={`修改问题单并重新推送 - ${formatNoticeNo(selectedRecord)}`}
        placement="right"
        onClose={() => {
          setEditDrawerVisible(false);
          editForm.resetFields();
        }}
        open={editDrawerVisible}
        width={720}
        className="qm-edit-drawer"
        bodyStyle={{ padding: '24px' }}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setEditDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => editForm.submit()}>
              提交并重发
            </Button>
          </Space>
        }
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditResend}>
          <Card size="small" title="基础信息" className="qm-card">
            <Form.Item
              name="supplierCode"
              label="供应商"
              rules={[{ required: true, message: '请选择供应商' }]}
            >
              <Select
                placeholder="请选择供应商"
                showSearch
                optionFilterProp="children"
              >
                {supplierOptions.map((s) => (
                  <Option key={s.code} value={s.code}>
                    {s.name}（{s.code}）
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="occurrenceDate"
              label="发生日期"
              rules={[{ required: true, message: '请选择发生日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="orgName"
              label="组织架构"
              rules={[{ required: true, message: '请输入组织架构' }]}
            >
              <Input placeholder="请输入组织架构" />
            </Form.Item>

            <Form.Item
              name="inspectionType"
              label="检查类型"
              rules={[{ required: true, message: '请选择检查类型' }]}
            >
              <Select placeholder="请选择检查类型">
                <Option value="Internal">内部检查</Option>
                <Option value="External">外部检查</Option>
              </Select>
            </Form.Item>
          </Card>

          <Card size="small" title="违规详情" className="qm-card qm-violation-card">
            <Form.Item
              name="violationRegulation"
              label="违反条例"
              rules={[{ required: true, message: '请输入违反条例' }]}
            >
              <Input placeholder="如：食品安全法" />
            </Form.Item>

            <Form.Item
              name="violationContent"
              label="违规内容描述"
              rules={[{ required: true, message: '请输入违规内容描述' }]}
            >
              <Input.TextArea rows={3} placeholder="请详细描述违规内容" />
            </Form.Item>

            <Form.Item
              name="problemType"
              label="问题类型"
              rules={[{ required: true, message: '请选择问题类型' }]}
            >
              <Select placeholder="请选择问题类型">
                {problemTypeOptions.map((t) => (
                  <Option key={t} value={t}>
                    {t}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="problemScope"
              label="问题范围"
              rules={[{ required: true, message: '请选择问题范围' }]}
            >
              <Select placeholder="请选择问题范围">
                <Option value="Batch">批量</Option>
                <Option value="Individual">个别</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="severity"
              label="严重程度"
              rules={[{ required: true, message: '请选择严重程度' }]}
            >
              <Select placeholder="请选择严重程度">
                <Option value="Low">低</Option>
                <Option value="General">一般</Option>
                <Option value="High">高</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="handlingAction"
              label="处理方式"
              rules={[{ required: true, message: '请选择处理方式' }]}
            >
              <Select placeholder="请选择处理方式">
                {handlingActionOptions.map((a) => (
                  <Option key={a} value={a}>
                    {a}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="penaltyPoints"
              label="违约扣分"
              rules={[{ required: true, message: '请输入违约扣分' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入违约扣分" />
            </Form.Item>
          </Card>

          <Card size="small" title="关联商品" className="qm-card">
            <Form.List
              name="items"
              initialValue={[{ storeCode: '', storeName: '', barcode: '', productName: '' }]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} align="baseline" className="qm-item-row">
                      <Form.Item
                        {...restField}
                        name={[name, 'storeCode']}
                        rules={[{ required: true, message: '请输入门店编码' }]}
                      >
                        <Input placeholder="门店编码" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'storeName']}
                        rules={[{ required: true, message: '请输入门店名称' }]}
                      >
                        <Input placeholder="门店名称" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'barcode']}
                        rules={[{ required: true, message: '请输入商品条码' }]}
                      >
                        <Input placeholder="商品条码" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'productName']}
                        rules={[{ required: true, message: '请输入商品名称' }]}
                      >
                        <Input placeholder="商品名称" />
                      </Form.Item>
                      <Button type="link" danger onClick={() => remove(name)}>
                        删除
                      </Button>
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block>
                    添加商品
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        </Form>
      </Drawer>

      {/* 关闭单据二次确认 */}
      <Modal
        title="关闭单据"
        open={closeModalVisible}
        onCancel={() => setCloseModalVisible(false)}
        onOk={handleCloseIssue}
        okText="确认关闭"
        okButtonProps={{ danger: true }}
      >
        <p>关闭后该质量问题单将结束流程，供应商端将同步显示“已关闭”状态，是否确认？</p>
      </Modal>
    </div>
  );
};

export default QualityManagement;
