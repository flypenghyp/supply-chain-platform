import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, DatePicker,
  Statistic, Descriptions
} from 'antd';
import {
  FileDoneOutlined, PlusOutlined, EditOutlined, EyeOutlined, FileTextOutlined,
  CheckCircleOutlined, DownloadOutlined, RobotOutlined,
  SendOutlined, RollbackOutlined, ArrowLeftOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter';

const { Title, Text, Paragraph } = Typography;

interface InvoiceRecord {
  id: string;
  invoice_no: string;
  recon_id: string;
  recon_no: string;
  supplier_name: string;
  amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
  created_at: string;
  verified_at: string | null;
  payment_date: string | null;
  reject_reason?: string;   // 零售商驳回原因（只读）
  rejected_at?: string;     // 驳回时间
}

const Invoices: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [filteredData, setFilteredData] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<InvoiceRecord | null>(null);
  // 驳回原因查看 Modal（只读模式 — 查看零售商的驳回意见）
  const [rejectReasonVisible, setRejectReasonVisible] = useState(false);
  const [rejectReasonRecord, setRejectReasonRecord] = useState<InvoiceRecord | null>(null);

  // 筛选条件
  const [filters, setFilters] = useState({
    status: undefined as string | undefined,
    searchText: ''
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // 根据筛选条件过滤数据
    let filtered = [...invoices];
    if (newFilters.status) {
      filtered = filtered.filter(item => item.status === newFilters.status);
    }
    if (newFilters.searchText) {
      filtered = filtered.filter(item =>
        item.invoice_no.includes(newFilters.searchText) ||
        item.recon_no.includes(newFilters.searchText)
      );
    }
    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // 接收对账页面传来的参数，动态新增发票记录
  useEffect(() => {
    const state = location.state as any;
    if (state?.source === 'reconciliation' && state?.records?.length > 0) {
      const newInvoices: InvoiceRecord[] = state.records.map((record: any, index: number) => ({
        id: `inv-${record.id}`,
        invoice_no: `FP${dayjs().format('YYYYMMDD')}${String(index + 1).padStart(3, '0')}`,
        recon_id: record.id,
        recon_no: record.recon_no || record.settlement_no || '-',
        supplier_name: record.supplier_name || record.supplier || '-',
        amount: record.payment_amount || record.amount || 0,
        tax_rate: Math.round((record.tax_rate || 0.13) * 100),
        tax_amount: Math.round((record.payment_amount || record.amount || 0) * (record.tax_rate || 0.13)),
        total_amount: Math.round((record.payment_amount || record.amount || 0) * (1 + (record.tax_rate || 0.13))),
        status: 'pending' as const,
        created_at: dayjs().format('YYYY-MM-DD HH:mm'),
        verified_at: null,
        payment_date: null,
      }));

      setInvoices(prev => {
        const existingIds = new Set(prev.map(inv => inv.recon_id));
        const toAdd = newInvoices.filter(inv => !existingIds.has(inv.recon_id));
        if (toAdd.length === 0) return prev;

        message.success(`已从对账单导入 ${toAdd.length} 张待开票记录`);
        return [...prev, ...toAdd];
      });

      window.history.replaceState({}, '', '/invoices');
    }
  }, [location.state]);

  const fetchInvoices = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData: InvoiceRecord[] = [
        // 已核验（有付款日期）— 对应结算单 id=5
        {
          id: 'inv-5',
          invoice_no: 'FP202602003',
          recon_id: '5',
          recon_no: 'D13-99926030600059',
          supplier_name: '娄底市天虹百货有限公司',
          amount: 146057.34,
          tax_rate: 9,
          tax_amount: 13145.16,
          total_amount: 159202.50,
          status: 'verified',
          created_at: '2026-03-10 11:00',
          verified_at: '2026-03-12 14:30',
          payment_date: '2026-03-20',
        },
        // 已提交待零售商核验 — 对应结算单 id=4
        {
          id: 'inv-4',
          invoice_no: 'FP202603002',
          recon_id: '4',
          recon_no: 'D13-99926030600058',
          supplier_name: '屈臣氏化妆品有限公司',
          amount: 125000,
          tax_rate: 13,
          tax_amount: 16250,
          total_amount: 141250,
          status: 'submitted',
          created_at: '2026-03-14 09:00',
          verified_at: null,
          payment_date: null,
        },
        // 被零售商驳回 — Demo 用
        {
          id: 'inv-3',
          invoice_no: 'FP202603001',
          recon_id: '3',
          recon_no: 'D13-99926030600057',
          supplier_name: '华润万家超市有限公司',
          amount: 85600,
          tax_rate: 13,
          tax_amount: 11128,
          total_amount: 96728,
          status: 'rejected',
          created_at: '2026-03-13 15:00',
          verified_at: null,
          payment_date: null,
          reject_reason: '发票金额与结算单金额不符（差额 ¥2,300），请核对后重新提交。',
          rejected_at: '2026-03-14 11:20',
        },
      ];
      setInvoices(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    setFilteredData(invoices);
  }, [invoices]);

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'orange',
      submitted: 'blue',
      verified: 'green',
      rejected: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      pending: '待提交',
      submitted: '审核中',
      verified: '已核验',
      rejected: '已驳回'
    };
    return texts[status] || status;
  };

  const updateInvoiceStatus = (
    id: string,
    newStatus: string,
    extraFields?: Partial<InvoiceRecord>
  ) => {
    setInvoices(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: newStatus as InvoiceRecord['status'], ...extraFields }
          : item
      )
    );
    if (selectedRecord?.id === id) {
      setSelectedRecord(prev =>
        prev ? { ...prev, status: newStatus as InvoiceRecord['status'], ...extraFields } : null
      );
    }
  };

  // ====== 供应商端操作方法 ======

  /** 提交核验：pending -> submitted（供应商提交给零售商） */
  const handleSubmitVerify = (record: InvoiceRecord) => {
    Modal.confirm({
      title: '提交核验',
      content: `确认将以下发票提交给零售商进行核验？\n\n发票号码：${record.invoice_no}\n关联结算单：${record.recon_no}\n金额：¥${record.total_amount?.toLocaleString()}`,
      okText: '确认提交',
      onOk: () => {
        updateInvoiceStatus(record.id, 'submitted');
        message.success(`发票 ${record.invoice_no} 已提交，等待零售商核验`);
      },
    });
  };

  /** 查看驳回原因（只读 — 展示零售商的驳回意见） */
  const handleViewRejectReason = (record: InvoiceRecord) => {
    setRejectReasonRecord(record);
    setRejectReasonVisible(true);
  };

  /** 重新提交：rejected -> pending */
  const handleResubmit = (record: InvoiceRecord) => {
    Modal.confirm({
      title: '重新提交核验',
      content: `确认重新提交发票 ${record.invoice_no}？\n\n请确保已根据驳回原因修正发票信息。`,
      okText: '确认重新提交',
      onOk: () => {
        updateInvoiceStatus(record.id, 'pending', { reject_reason: undefined, rejected_at: undefined });
        message.success(`发票 ${record.invoice_no} 已重新提交，请点击「提交核验」发送给零售商`);
      },
    });
  };

  /** 跳转回对账页面并定位到关联结算单 */
  const handleGoToReconciliation = (reconId: string) => {
    navigate('/reconciliation', { state: { focusReconId: reconId } });
  };

  const columns = [
    {
      title: '发票号码',
      dataIndex: 'invoice_no',
      key: 'invoice_no',
      width: 150,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '关联结算单号',
      dataIndex: 'recon_no',
      key: 'recon_no',
      width: 180,
      render: (text: string, record: InvoiceRecord) => (
        <Tooltip title="点击查看对账单详情">
          <Button type="link" size="small" style={{ padding: 0, fontWeight: 'bold' }} onClick={() => handleGoToReconciliation(record.recon_id)}>
            {text}
          </Button>
        </Tooltip>
      )
    },
    {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 160,
      ellipsis: true
    },
    {
      title: '发票金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 120,
      render: (amount: number) => (
        <div style={{ fontWeight: 'bold', color: '#f5222d' }}>¥{amount?.toLocaleString()}</div>
      )
    },
    {
      title: '税率',
      dataIndex: 'tax_rate',
      key: 'tax_rate',
      width: 70,
      render: (rate: number) => `${rate}%`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: string, record: InvoiceRecord) => {
        // 已驳回且有原因：Tag + 原因摘要（省略+Tooltip）+ 点击弹窗
        if (status === 'rejected' && record.reject_reason) {
          return (
            <Tooltip title={record.reject_reason}>
              <Space size={4}>
                <Tag color="red">{getStatusText(status)}</Tag>
                <Text
                  type="danger"
                  style={{
                    maxWidth: 120,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                  onClick={(e) => { e.stopPropagation(); handleViewRejectReason(record); }}
                >
                  {record.reject_reason}
                </Text>
              </Space>
            </Tooltip>
          );
        }
        return <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>;
      }
    },
    {
      title: '付款日期',
      dataIndex: 'payment_date',
      key: 'payment_date',
      width: 110,
      render: (date: string | null) => date
        ? <Text strong style={{ color: '#52c41a' }}>{date}</Text>
        : <Text type="secondary">-</Text>
    },
    {
      title: '开票时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (date: string) => dayjs(date).format('MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'actions',
      width: 240,
      fixed: 'right' as const,
      render: (_: any, record: InvoiceRecord) => (
        <Space size="small">
          {/* 待提交：提交核验 */}
          {record.status === 'pending' && (
            <>
              <Tooltip title="提交给零售商核验">
                <Button type="primary" size="small" icon={<SendOutlined />} onClick={() => handleSubmitVerify(record)}>
                  提交核验
                </Button>
              </Tooltip>
              <Tooltip title="下载发票">
                <Button type="text" icon={<DownloadOutlined />} size="small" />
              </Tooltip>
            </>
          )}

          {/* 审核中：只能查看和下载，等待零售商操作 */}
          {record.status === 'submitted' && (
            <>
              <Tag icon={<ClockCircleOutlined />} color="processing">审核中</Tag>
              <Tooltip title="查看详情">
                <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => { setSelectedRecord(record); setDetailModalVisible(true); }} />
              </Tooltip>
              <Tooltip title="下载发票">
                <Button type="text" icon={<DownloadOutlined />} size="small" />
              </Tooltip>
            </>
          )}

          {/* 已核验：查看 / 下载 */}
          {record.status === 'verified' && (
            <>
              <Tooltip title="查看详情">
                <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => { setSelectedRecord(record); setDetailModalVisible(true); }} />
              </Tooltip>
              <Tooltip title="下载发票">
                <Button type="text" icon={<DownloadOutlined />} size="small" />
              </Tooltip>
            </>
          )}

          {/* 已驳回：重新提交 + 下载（驳回原因在状态列展示） */}
          {record.status === 'rejected' && (
            <>
              <Tooltip title="修正后重新提交">
                <Button size="small" icon={<RollbackOutlined />} onClick={() => handleResubmit(record)}>
                  重新提交
                </Button>
              </Tooltip>
              <Tooltip title="下载发票">
                <Button type="text" icon={<DownloadOutlined />} size="small" />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card>
        {/* 返回按钮 + 标题 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginRight: 12 }}>
            返回
          </Button>
          <Title level={4} style={{ margin: 0 }}>发票管理</Title>
          <Tag color="blue" style={{ marginLeft: 12 }}>供应商端</Tag>
        </div>

        {/* 筛选条件 */}
        <AdvancedSearchFilter
          fields={[
            { key: 'status', label: '发票状态', type: 'select', placeholder: '请选择发票状态',
              options: [
                { label: '待提交', value: 'pending' },
                { label: '审核中', value: 'submitted' },
                { label: '已核验', value: 'verified' },
                { label: '已驳回', value: 'rejected' }
              ]
            },
            { key: 'searchText', label: '搜索', type: 'input', placeholder: '搜索发票号码/结算单号' }
          ]}
          values={filters}
          onChange={handleFilterChange}
          onSearch={() => console.log('search')}
          onReset={() => {
            setFilters({ status: undefined, searchText: '' });
            setFilteredData(invoices);
          }}
        />

        {/* 统计概览 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic title="待提交" value={filteredData.filter(i => i.status === 'pending').length} suffix="张" valueStyle={{ color: '#faad14' }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic title="审核中" value={filteredData.filter(i => i.status === 'submitted').length} suffix="张" valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic title="已核验" value={filteredData.filter(i => i.status === 'verified').length} suffix="张" valueStyle={{ color: '#52c41a' }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic title="已驳回" value={filteredData.filter(i => i.status === 'rejected').length} suffix="张" valueStyle={{ color: '#ff4d4f' }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic title="本月开票总额" prefix="¥" value={filteredData.reduce((sum, i) => sum + (i.total_amount || 0), 0)} valueStyle={{ color: '#f5222d' }} />
            </Card>
          </Col>
        </Row>

        {/* 业务提示 — 供应商视角 */}
        <Alert
          message="供应商端发票操作说明"
          description={
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              <li>从对账页发起的发票将自动导入本列表（待提交状态）</li>
              <li>点击「提交核验」将发票发送给<strong>零售商</strong>进行审核</li>
              <li>审核通过后系统自动生成付款日期，对应结算单标记为已付款</li>
              <li>如被驳回，请点击「驳回原因」查看零售商意见，修正后重新提交</li>
            </ol>
          }
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 1300 }}
        />
      </Card>

      {/* 发票详情弹窗 */}
      <Modal
        title={`发票详情 - ${selectedRecord?.invoice_no}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={
          selectedRecord?.status === 'pending' ? (
            <Space>
              <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
              <Button type="primary" icon={<SendOutlined />} onClick={() => { setDetailModalVisible(false); handleSubmitVerify(selectedRecord!); }}>
                提交核验
              </Button>
            </Space>
          ) : (
            <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
          )
        }
        width={650}
      >
        {selectedRecord && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="发票号码">{selectedRecord.invoice_no}</Descriptions.Item>
            <Descriptions.Item label="发票状态">
              <Tag color={getStatusColor(selectedRecord.status)}>{getStatusText(selectedRecord.status)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="关联结算单号">
              <Button type="link" size="small" style={{ padding: 0 }} onClick={() => { setDetailModalVisible(false); handleGoToReconciliation(selectedRecord.recon_id); }}>
                {selectedRecord.recon_no} <ArrowLeftOutlined />
              </Button>
            </Descriptions.Item>
            <Descriptions.Item label="供应商">{selectedRecord.supplier_name}</Descriptions.Item>
            <Descriptions.Item label="发票金额">¥{selectedRecord.amount?.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="税率">{selectedRecord.tax_rate}%</Descriptions.Item>
            <Descriptions.Item label="税额">¥{selectedRecord.tax_amount?.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="价税合计" span={2}>
              <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>¥{selectedRecord.total_amount?.toLocaleString()}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="开票时间">{selectedRecord.created_at}</Descriptions.Item>
            <Descriptions.Item label="核验时间">
              {selectedRecord.verified_at || <Text type="secondary">-</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="付款日期" span={2}>
              {selectedRecord.payment_date ? (
                <Tag icon={<CheckCircleOutlined />} color="success">{selectedRecord.payment_date}</Tag>
              ) : (
                <Text type="secondary">核验通过后自动生成</Text>
              )}
            </Descriptions.Item>
            {selectedRecord.status === 'rejected' && selectedRecord.reject_reason && (
              <>
                <Descriptions.Item label="驳回时间" span={1}>
                  {selectedRecord.rejected_at || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="驳回原因" span={1}>
                  <Text type="danger">{selectedRecord.reject_reason}</Text>
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* 驳回原因查看弹窗（只读 — 展示零售商的驳回意见） */}
      <Modal
        title={`驳回原因 - ${rejectReasonRecord?.invoice_no}`}
        open={rejectReasonVisible}
        onCancel={() => setRejectReasonVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setRejectReasonVisible(false)}>知道了</Button>
            <Button type="primary" icon={<RollbackOutlined />} onClick={() => { setRejectReasonVisible(false); if (rejectReasonRecord) handleResubmit(rejectReasonRecord); }}>
              修正后重新提交
            </Button>
          </Space>
        }
        width={520}
      >
        {rejectReasonRecord && (
          <div>
            <Alert
              message="该发票已被零售商驳回"
              description="请根据下方驳回原因修正发票信息后重新提交"
              type="error"
              showIcon
              style={{ marginBottom: 20 }}
            />
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="发票号码">{rejectReasonRecord.invoice_no}</Descriptions.Item>
              <Descriptions.Item label="关联结算单">{rejectReasonRecord.recon_no}</Descriptions.Item>
              <Descriptions.Item label="驳回时间">
                {rejectReasonRecord.rejected_at || <Text type="secondary">-</Text>}
              </Descriptions.Item>
              <Descriptions.Item label="驳回原因" labelStyle={{ backgroundColor: '#fff1f0' }}>
                <div style={{
                  backgroundColor: '#fff2f0',
                  border: '1px solid #ffccc7',
                  borderRadius: '4px',
                  padding: '12px',
                  color: '#cf1322',
                  fontSize: '14px',
                  lineHeight: '1.8'
                }}>
                  {rejectReasonRecord.reject_reason || '暂无驳回原因'}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Invoices;
