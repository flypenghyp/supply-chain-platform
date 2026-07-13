import React, { useEffect, useMemo, useState } from 'react';
import {
  Table, Button, Space, Drawer, Form, Input, Select, message, Card, Row, Col,
  Tag, Divider, Alert, Typography, Tooltip, Upload, Statistic,
  Descriptions, Modal
} from 'antd';
import {
  EyeOutlined, FileTextOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined,
  SignatureOutlined, CameraOutlined, DollarOutlined,
  WarningOutlined, CloseCircleOutlined, EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { ViolationNotice, ViolationItem } from '../types/violation-notice';
import { ESIGN_CONFIG } from '../config/esign';
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter';
import './Quality.scss';

const { Text, Paragraph } = Typography;

type SignType = 'breach' | 'deduction';

const Quality: React.FC = () => {
  const [notices, setNotices] = useState<ViolationNotice[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [handleDrawerVisible, setHandleDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ViolationNotice | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [signType, setSignType] = useState<SignType>('breach');
  const [disagreeModalVisible, setDisagreeModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [disagreeForm] = Form.useForm();

  const [filters, setFilters] = useState({
    severity: '',
    inspectionType: '',
    problemScope: '',
    status: ''
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    if (selectedRecord && handleDrawerVisible) {
      if (selectedRecord.status === 'processing' || selectedRecord.status === 'rejected') {
        form.setFieldsValue({
          supplierAnalysis: selectedRecord.supplierAnalysis || '',
          rectificationMeasures: selectedRecord.rectificationMeasures || '',
          supplierRepName: selectedRecord.supplierRepName || '',
          supplierRepPhone: selectedRecord.supplierRepPhone || ''
        });
      } else {
        form.resetFields();
      }
    }
  }, [selectedRecord, handleDrawerVisible, form]);

  const fetchNotices = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData: ViolationNotice[] = [
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
            },
            {
              storeCode: '60015',
              storeName: 'sp@ce西乡店',
              barcode: '6942536578049',
              productName: '天口味迷你虎皮瑞士卷蛋糕'
            }
          ],
          supplierAnalysis: '',
          rectificationMeasures: '',
          supplierRepName: '',
          supplierRepPhone: '',
          auditOpinion: '',
          penaltyAmount: 0,
          penaltyStatus: 'pending',
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
          auditOpinion: '问题较轻，要求整改',
          penaltyAmount: 0,
          penaltyStatus: 'pending',
          status: 'processing',
          breachSignStatus: 'signed',
          breachSignedAt: '2025-05-11 10:00:00',
          breachSigner: '当前用户',
          breachSignFlowId: 'FLOW-B-001',
          deductionSignStatus: 'pending',
          createTime: '2025-05-10 09:00:00',
          supplierSubmitTime: '2025-05-11 09:30:00'
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
          auditOpinion: '违反食品安全法，扣除违约金',
          penaltyAmount: 10000,
          penaltyStatus: 'pending',
          status: 'deduction_pending',
          breachSignStatus: 'signed',
          breachSignedAt: '2025-05-13 10:00:00',
          breachSigner: '当前用户',
          breachSignFlowId: 'FLOW-B-003',
          deductionSignStatus: 'pending',
          createTime: '2025-05-12 08:00:00',
          supplierSubmitTime: '2025-05-13 09:00:00'
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
      setNotices(mockData);
      setLoading(false);
    }, 600);
  };

  const filteredData = useMemo(() => {
    return notices.filter((item) => {
      if (filters.severity && item.severity !== filters.severity) return false;
      if (filters.inspectionType && item.inspectionType !== filters.inspectionType) return false;
      if (filters.problemScope && item.problemScope !== filters.problemScope) return false;
      if (filters.status && item.status !== filters.status) return false;
      return true;
    });
  }, [notices, filters]);

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

  const getProblemScopeText = (scope: string) => {
    const texts: Record<string, string> = {
      Batch: '批量',
      Individual: '个别'
    };
    return texts[scope] || scope;
  };

  const getInspectionTypeText = (type: string) => {
    const texts: Record<string, string> = {
      Internal: '内部检查',
      External: '外部检查'
    };
    return texts[type] || type;
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

  const formatNoticeNo = (record?: ViolationNotice | null) => {
    if (!record?.noticeNo) return '-';
    return `VN${record.noticeNo.padStart(6, '0')}`;
  };

  const handleViewDetail = (record: ViolationNotice) => {
    setSelectedRecord(record);
    setDetailDrawerVisible(true);
  };

  const handleProcessIssue = (record: ViolationNotice) => {
    setSelectedRecord(record);
    setHandleDrawerVisible(true);
  };

  const handleOpenSign = (record: ViolationNotice, type: SignType) => {
    setSelectedRecord(record);
    setSignType(type);
    setConfirmModalVisible(true);
  };

  const handleOpenDisagree = (record: ViolationNotice) => {
    setSelectedRecord(record);
    disagreeForm.resetFields();
    setDisagreeModalVisible(true);
  };

  const updateNotice = (id: string, patch: Partial<ViolationNotice>) => {
    setNotices((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, ...patch, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') } : n));
      return next;
    });
  };

  const handleSignConfirm = () => {
    if (!selectedRecord) return;
    const url = `${ESIGN_CONFIG.PLATFORM_URL}?type=${signType === 'breach' ? 'quality_breach' : 'quality_deduction'}&notice_id=${selectedRecord.id}`;
    window.open(url, '_blank');
    message.info('已打开电签平台，请完成签署');

    setTimeout(() => {
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
      if (signType === 'breach') {
        updateNotice(selectedRecord.id, {
          breachSignStatus: 'signed',
          breachSignFlowId: `FLOW-B-${Date.now()}`,
          breachSignedAt: now,
          breachSigner: '当前用户',
          status: 'processing'
        });
        message.success('违约函签章完成，请填写整改反馈');
      } else {
        updateNotice(selectedRecord.id, {
          deductionSignStatus: 'signed',
          deductionSignFlowId: `FLOW-D-${Date.now()}`,
          deductionSignedAt: now,
          deductionSigner: '当前用户',
          status: 'completed'
        });
        message.success('违约扣款单签章完成，流程结束');
      }
      setConfirmModalVisible(false);
      setHandleDrawerVisible(false);
    }, 2000);
  };

  const handleDisagreeSubmit = (values: { supplierDisagreeReason: string }) => {
    if (!selectedRecord) return;
    updateNotice(selectedRecord.id, {
      supplierDisagreeReason: values.supplierDisagreeReason,
      supplierDisagreedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      status: 'supplier_disagreed'
    });
    message.success('已提交异议，等待零售商处理');
    setDisagreeModalVisible(false);
    setHandleDrawerVisible(false);
  };

  const handleFeedbackSubmit = async (values: {
    supplierAnalysis: string;
    rectificationMeasures: string;
    supplierRepName: string;
    supplierRepPhone: string;
  }) => {
    if (!selectedRecord) return;
    updateNotice(selectedRecord.id, {
      ...values,
      supplierSubmitTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      status: 'processing'
    });
    message.success('整改反馈已提交，等待零售商审核');
    setHandleDrawerVisible(false);
  };

  const renderActionButtons = (record: ViolationNotice) => {
    if (record.status === 'pending') {
      return (
        <Button
          type="primary"
          icon={<EditOutlined />}
          size="small"
          onClick={() => handleProcessIssue(record)}
        >
          处理
        </Button>
      );
    }
    if (record.status === 'processing' || record.status === 'rejected') {
      return (
        <Button
          type="primary"
          icon={record.status === 'rejected' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
          size="small"
          onClick={() => handleProcessIssue(record)}
        >
          {record.status === 'rejected' ? '重新处理' : '处理'}
        </Button>
      );
    }
    if (record.status === 'deduction_pending') {
      return (
        <Button
          type="primary"
          icon={<SignatureOutlined />}
          size="small"
          onClick={() => handleOpenSign(record, 'deduction')}
        >
          签扣款单
        </Button>
      );
    }
    return null;
  };

  const columns = [
    {
      title: '通知单号',
      dataIndex: 'noticeNo',
      key: 'noticeNo',
      width: 130,
      render: (_: string, record: ViolationNotice) => (
        <div className="quality-notice-no">{formatNoticeNo(record)}</div>
      )
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 170,
      render: (text: string, record: ViolationNotice) => (
        <div>
          <div>{text}</div>
          <div className="quality-sub-text">编码: {record.supplierCode}</div>
        </div>
      )
    },
    {
      title: '发生日期',
      dataIndex: 'occurrenceDate',
      key: 'occurrenceDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: '违反条例',
      dataIndex: 'violationRegulation',
      key: 'violationRegulation',
      width: 120
    },
    {
      title: '问题类型',
      dataIndex: 'problemType',
      key: 'problemType',
      width: 160,
      render: (type: string) => <Tag color="red">{type}</Tag>
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => (
        <Tag color={getSeverityColor(severity)}>
          {severity === 'High' && <ExclamationCircleOutlined style={{ marginRight: 4 }} />}
          {getSeverityText(severity)}
        </Tag>
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
      render: (status?: string, record?: ViolationNotice) => {
        if (record?.status === 'pending' || record?.status === 'supplier_disagreed' || record?.status === 'processing' || record?.status === 'rejected' || record?.status === 'closed') {
          return <Tag>未生成</Tag>;
        }
        return <Tag color={status === 'signed' ? 'green' : 'orange'}>{getSignStatusText(status)}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (_: unknown, record: ViolationNotice) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          {renderActionButtons(record)}
        </Space>
      )
    }
  ];

  const renderInfoCard = (record: ViolationNotice) => (
    <Card size="small" title="单据关键信息" className="quality-info-card">
      <Descriptions column={2} size="small">
        <Descriptions.Item label="通知单号">
          <Text strong className="quality-primary-text">{formatNoticeNo(record)}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="发生日期">
          <Text>{dayjs(record.occurrenceDate).format('YYYY-MM-DD')}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="供应商" span={2}>
          <Text>{record.supplierName} ({record.supplierCode})</Text>
        </Descriptions.Item>
        <Descriptions.Item label="违反条例">
          <Tag color="red">{record.violationRegulation}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="严重程度">
          <Tag color={getSeverityColor(record.severity)}>{getSeverityText(record.severity)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="问题类型" span={2}>
          <Tag color="orange">{record.problemType}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="问题范围">
          <Tag color="orange">{getProblemScopeText(record.problemScope)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="处理方式">
          <Text>{record.handlingAction}</Text>
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" className="quality-divider">违规内容</Divider>
      <Paragraph className="quality-warning-block">{record.violationContent}</Paragraph>

      <Divider orientation="left" className="quality-divider">关联商品</Divider>
      <Table
        dataSource={record.items}
        size="small"
        pagination={false}
        scroll={{ y: 120 }}
        className="quality-mini-table"
        columns={[
          {
            title: '门店',
            dataIndex: 'storeName',
            key: 'storeName',
            width: 180
          },
          {
            title: '商品名称',
            dataIndex: 'productName',
            key: 'productName'
          },
          {
            title: '条码',
            dataIndex: 'barcode',
            key: 'barcode',
            width: 120,
            render: (text: string) => <Text code className="quality-barcode">{text}</Text>
          }
        ]}
        rowKey={(item: ViolationItem, index?: number) => `${item.barcode}-${index ?? 0}`}
      />
    </Card>
  );

  const renderBreachSignPanel = (record: ViolationNotice) => (
    <>
      {renderInfoCard(record)}
      <Card size="small" title="质量违约函" className="quality-breach-card">
        <Alert
          message="违约函摘要"
          description={
            <div>
              <p>贵司供应的商品在{record.orgName}发生{record.problemType}问题，违反《{record.violationRegulation}》相关规定。</p>
              <p>请确认违约事实，并通过电子签章方式签署本违约函。</p>
            </div>
          }
          type="warning"
          showIcon
        />
        <Divider />
        <div className="quality-sign-actions">
          <Button
            type="primary"
            size="large"
            icon={<SignatureOutlined />}
            onClick={() => handleOpenSign(record, 'breach')}
          >
            同意并电子签章
          </Button>
          <Button
            danger
            size="large"
            icon={<CloseCircleOutlined />}
            onClick={() => handleOpenDisagree(record)}
          >
            不同意
          </Button>
        </div>
      </Card>
    </>
  );

  const renderFeedbackPanel = (record: ViolationNotice) => (
    <>
      {renderInfoCard(record)}
      <Card size="small" title="零售商审核结果" className="quality-retailer-card">
        <Form layout="vertical">
          <Form.Item label="审核意见">
            <Input.TextArea
              rows={3}
              disabled
              value={record.auditOpinion || '待零售商填写'}
              placeholder="待零售商填写"
            />
          </Form.Item>
          <Form.Item label="违约金金额">
            <Input
              disabled
              value={record.penaltyAmount !== undefined ? `¥${record.penaltyAmount.toLocaleString()}` : '待零售商填写'}
              placeholder="待零售商填写"
            />
          </Form.Item>
          {record.rejectReason && (
            <Form.Item label="驳回原因">
              <Input.TextArea rows={2} disabled value={record.rejectReason} />
            </Form.Item>
          )}
        </Form>
      </Card>
      <Card size="small" title="供应商整改反馈" className="quality-feedback-card">
        <Form form={form} onFinish={handleFeedbackSubmit} layout="vertical">
          <Form.Item
            name="supplierAnalysis"
            label="原因分析"
            rules={[{ required: true, message: '请填写原因分析' }]}
          >
            <Input.TextArea rows={3} placeholder="请详细分析问题产生的原因" />
          </Form.Item>

          <Form.Item
            name="rectificationMeasures"
            label="整改措施"
            rules={[{ required: true, message: '请填写整改措施' }]}
          >
            <Input.TextArea rows={3} placeholder="请详细描述整改措施" />
          </Form.Item>

          <Form.Item
            name="supplierRepName"
            label="供应商负责人"
            rules={[{ required: true, message: '请填写负责人姓名' }]}
          >
            <Input placeholder="请输入负责人姓名" />
          </Form.Item>

          <Form.Item
            name="supplierRepPhone"
            label="手机号码"
            rules={[
              { required: true, message: '请填写手机号码' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
            ]}
          >
            <Input placeholder="请输入手机号码" />
          </Form.Item>

          <Form.Item label="证据材料">
            <Upload listType="picture-card" maxCount={5} accept="image/*,.pdf">
              <div>
                <CameraOutlined />
                <div style={{ marginTop: 8 }}>上传证据</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setHandleDrawerVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                提交反馈
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );

  const renderDeductionSignPanel = (record: ViolationNotice) => (
    <>
      {renderInfoCard(record)}
      <Card size="small" title="供应商违约扣款单" className="quality-deduction-card">
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label="通知单号">{formatNoticeNo(record)}</Descriptions.Item>
          <Descriptions.Item label="审核意见">{record.auditOpinion}</Descriptions.Item>
          <Descriptions.Item label="违约金金额">
            <Text strong className="quality-danger-text">
              ¥{record.penaltyAmount?.toLocaleString() || 0}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="违约扣分">{record.penaltyPoints} 分</Descriptions.Item>
          <Descriptions.Item label="扣分状态">
            {record.penaltyStatus === 'deducted' ? '已扣除' : '待扣除'}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <div className="quality-sign-action">
          <Button
            type="primary"
            size="large"
            icon={<SignatureOutlined />}
            onClick={() => handleOpenSign(record, 'deduction')}
          >
            电子签章确认扣款单
          </Button>
        </div>
      </Card>
    </>
  );

  const renderHandleContent = () => {
    if (!selectedRecord) return null;
    switch (selectedRecord.status) {
      case 'pending':
        return renderBreachSignPanel(selectedRecord);
      case 'processing':
      case 'rejected':
        return renderFeedbackPanel(selectedRecord);
      case 'deduction_pending':
        return renderDeductionSignPanel(selectedRecord);
      case 'supplier_disagreed':
        return (
          <>
            {renderInfoCard(selectedRecord)}
            <Alert
              message="供应商异议"
              description={
                <div>
                  <p><Text strong>异议时间：</Text>{selectedRecord.supplierDisagreedAt}</p>
                  <p><Text strong>不同意原因：</Text></p>
                  <Paragraph className="quality-warning-block">{selectedRecord.supplierDisagreeReason}</Paragraph>
                </div>
              }
              type="warning"
              showIcon
            />
          </>
        );
      case 'completed':
        return (
          <>
            {renderInfoCard(selectedRecord)}
            <Alert message="该质量问题单已完成全部签章流程" type="success" showIcon />
          </>
        );
      case 'closed':
        return (
          <>
            {renderInfoCard(selectedRecord)}
            <Alert message="该质量问题单已被零售商关闭" type="info" showIcon />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="quality-page">
      <Card>
        <AdvancedSearchFilter
          fields={[
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
              key: 'inspectionType',
              label: '检查类型',
              type: 'select',
              placeholder: '请选择检查类型',
              options: [
                { label: '内部检查', value: 'Internal' },
                { label: '外部检查', value: 'External' }
              ]
            },
            {
              key: 'problemScope',
              label: '问题范围',
              type: 'select',
              placeholder: '请选择问题范围',
              options: [
                { label: '批量', value: 'Batch' },
                { label: '个别', value: 'Individual' }
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
          onReset={() => setFilters({ severity: '', inspectionType: '', problemScope: '', status: '' })}
        />

        <Row gutter={16} className="quality-stats">
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="违约通知单总数"
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
                title="高风险通知单"
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
                title="总违约金额"
                value={filteredData.reduce((sum, item) => sum + (item.penaltyAmount || 0), 0)}
                suffix="元"
                precision={2}
                valueStyle={{ color: '#faad14' }}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="涉及供应商数"
                value={new Set(filteredData.map((item) => item.supplierCode)).size}
                suffix="家"
                valueStyle={{ color: '#52c41a' }}
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

      {/* 详情抽屉 */}
      <Drawer
        title={`违约通知单详情 - ${formatNoticeNo(selectedRecord)}`}
        placement="right"
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
        width={720}
        className="quality-detail-drawer"
        bodyStyle={{ padding: '24px' }}
      >
        {selectedRecord && (
          <div>
            <Card size="small" title="基础信息" className="quality-detail-card">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="供应商编码">{selectedRecord.supplierCode}</Descriptions.Item>
                <Descriptions.Item label="供应商名称">{selectedRecord.supplierName}</Descriptions.Item>
                <Descriptions.Item label="发生日期">
                  {dayjs(selectedRecord.occurrenceDate).format('YYYY-MM-DD')}
                </Descriptions.Item>
                <Descriptions.Item label="组织架构">{selectedRecord.orgName}</Descriptions.Item>
                <Descriptions.Item label="检查类型">
                  <Tag color="blue">{getInspectionTypeText(selectedRecord.inspectionType)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="违反条例">
                  <Tag color="red">{selectedRecord.violationRegulation}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card size="small" title="违规详情" className="quality-detail-violation">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="问题类型" span={2}>
                  <Tag color="red">{selectedRecord.problemType}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="严重程度">
                  <Tag color={getSeverityColor(selectedRecord.severity)}>{getSeverityText(selectedRecord.severity)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="问题范围">
                  <Tag color="orange">{getProblemScopeText(selectedRecord.problemScope)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="处理方式">
                  <Text>{selectedRecord.handlingAction}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="违约扣分">
                  <Text strong className="quality-danger-text">{selectedRecord.penaltyPoints} 分</Text>
                </Descriptions.Item>
              </Descriptions>
              <div className="quality-desc-block">
                <Text strong>违规内容描述：</Text>
                <Paragraph className="quality-warning-block">{selectedRecord.violationContent}</Paragraph>
              </div>
            </Card>

            <Card size="small" title="关联商品列表" className="quality-detail-card">
              <Table
                dataSource={selectedRecord.items}
                columns={[
                  { title: '门店编码', dataIndex: 'storeCode', key: 'storeCode', width: 120 },
                  { title: '门店名称', dataIndex: 'storeName', key: 'storeName', width: 200 },
                  {
                    title: '商品条码',
                    dataIndex: 'barcode',
                    key: 'barcode',
                    width: 140,
                    render: (text: string) => <Text code>{text}</Text>
                  },
                  { title: '商品名称', dataIndex: 'productName', key: 'productName' }
                ]}
                pagination={false}
                size="small"
                rowKey={(item: ViolationItem, index?: number) => `${item.barcode}-${index ?? 0}`}
              />
            </Card>

            <Card size="small" title="整改与反馈" className="quality-detail-card">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="供应商原因分析">
                  <Paragraph>{selectedRecord.supplierAnalysis || '待供应商填写'}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="整改措施">
                  <Paragraph>{selectedRecord.rectificationMeasures || '待供应商填写'}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="供应商负责人">
                  <Text strong>{selectedRecord.supplierRepName || '-'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="手机号码">
                  <Text>{selectedRecord.supplierRepPhone || '-'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="反馈时间">
                  <Text>{selectedRecord.supplierSubmitTime || '-'}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {selectedRecord.supplierDisagreeReason && (
              <Card size="small" title="供应商异议" className="quality-detail-card">
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="异议时间">{selectedRecord.supplierDisagreedAt || '-'}</Descriptions.Item>
                  <Descriptions.Item label="不同意原因">
                    <Paragraph className="quality-warning-block">{selectedRecord.supplierDisagreeReason}</Paragraph>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            <Card size="small" title="审核结果" className="quality-detail-card">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="审核意见">
                  <Paragraph>{selectedRecord.auditOpinion || '待零售商填写'}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="违约金金额">
                  {(selectedRecord.penaltyAmount || 0) > 0 ? (
                    <Text strong className="quality-danger-text" style={{ fontSize: 18 }}>
                      ¥{selectedRecord.penaltyAmount?.toLocaleString()}
                    </Text>
                  ) : (
                    <Text className="quality-success-text">无违约金</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="扣分状态">
                  {selectedRecord.penaltyStatus === 'deducted' ? '已扣除' : '待扣除'}
                </Descriptions.Item>
                {selectedRecord.rejectReason && (
                  <Descriptions.Item label="驳回原因">
                    <Paragraph>{selectedRecord.rejectReason}</Paragraph>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            <Card size="small" title="签章记录" className="quality-detail-card">
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="质量违约函签章">
                  {selectedRecord.breachSignStatus === 'signed' ? (
                    <Text className="quality-success-text">
                      已签章（{selectedRecord.breachSigner} · {selectedRecord.breachSignedAt} · {selectedRecord.breachSignFlowId}）
                    </Text>
                  ) : (
                    <Text className="quality-warning-text">待签章</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="违约扣款单签章">
                  {selectedRecord.deductionSignStatus === 'signed' ? (
                    <Text className="quality-success-text">
                      已签章（{selectedRecord.deductionSigner} · {selectedRecord.deductionSignedAt} · {selectedRecord.deductionSignFlowId}）
                    </Text>
                  ) : (
                    <Text className="quality-warning-text">
                      {['pending', 'supplier_disagreed', 'processing', 'rejected', 'closed'].includes(selectedRecord.status) ? '未生成' : '待签章'}
                    </Text>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        )}
      </Drawer>

      {/* 处理抽屉 */}
      <Drawer
        title={selectedRecord ? `处理违约通知单 - ${formatNoticeNo(selectedRecord)}` : '处理违约通知单'}
        placement="right"
        onClose={() => setHandleDrawerVisible(false)}
        open={handleDrawerVisible}
        width={720}
        className="quality-handle-drawer"
        bodyStyle={{ padding: '24px' }}
      >
        {renderHandleContent()}
      </Drawer>

      {/* 电签确认模态框 */}
      <Modal
        title={signType === 'breach' ? '质量违约函 - 电签确认' : '供应商违约扣款单 - 电签确认'}
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        width={560}
        footer={null}
      >
        <Alert
          message="电签确认"
          description={
            signType === 'breach'
              ? '请确认违约函内容无误，签署后将进入整改反馈阶段。'
              : '请确认扣款单金额及扣分信息无误，签署后流程结束。'
          }
          type="warning"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Descriptions column={1} size="small" bordered style={{ marginBottom: '20px' }}>
          <Descriptions.Item label="通知单号">{formatNoticeNo(selectedRecord)}</Descriptions.Item>
          <Descriptions.Item label="供应商">{selectedRecord?.supplierName}</Descriptions.Item>
          {signType === 'deduction' && (
            <>
              <Descriptions.Item label="违约金金额">
                <Text strong className="quality-danger-text" style={{ fontSize: 16 }}>
                  ¥{selectedRecord?.penaltyAmount?.toLocaleString() || 0}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="违约扣分">{selectedRecord?.penaltyPoints} 分</Descriptions.Item>
              <Descriptions.Item label="审核意见">{selectedRecord?.auditOpinion}</Descriptions.Item>
            </>
          )}
        </Descriptions>

        <div className="quality-modal-action">
          <Button
            type="primary"
            size="large"
            icon={<SignatureOutlined />}
            onClick={handleSignConfirm}
          >
            前往电签平台签署
          </Button>
        </div>
      </Modal>

      {/* 供应商不同意原因弹窗 */}
      <Modal
        title="不同意《质量违约函》"
        open={disagreeModalVisible}
        onCancel={() => setDisagreeModalVisible(false)}
        width={560}
        footer={null}
      >
        <Alert
          message="提交异议"
          description="请填写不同意原因，提交后该单据将返回零售商处理。"
          type="warning"
          showIcon
          style={{ marginBottom: '20px' }}
        />
        <Form form={disagreeForm} layout="vertical" onFinish={handleDisagreeSubmit}>
          <Form.Item
            name="supplierDisagreeReason"
            label="不同意原因"
            rules={[{ required: true, message: '请填写不同意原因' }]}
          >
            <Input.TextArea rows={4} placeholder="请详细说明不同意的原因" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setDisagreeModalVisible(false)}>取消</Button>
              <Button type="primary" danger htmlType="submit" icon={<CheckCircleOutlined />}>
                提交异议
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Quality;
