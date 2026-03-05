import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, Tabs, Descriptions, List,
  Avatar, Progress, Statistic, DatePicker, InputNumber, Checkbox
} from 'antd';
import {
  FileDoneOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined,
  EyeOutlined, FileTextOutlined, DollarOutlined, ExclamationCircleOutlined,
  RobotOutlined, CalculatorOutlined, SignatureOutlined, ThunderboltOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import EarlySettlementModal from '../components/EarlySettlementModal';
import type { EarlySettlementApplication, EarlySettlementCalculation } from '../types/early-settlement';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const Reconciliation: React.FC = () => {
  const [reconciliations, setReconciliations] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [disputeModalVisible, setDisputeModalVisible] = useState(false);
  const [earlySettlementModalVisible, setEarlySettlementModalVisible] = useState(false);
  const [batchEarlySettlementModalVisible, setBatchEarlySettlementModalVisible] = useState(false);
  const [earlySettlementLoading, setEarlySettlementLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [selectedReconciliationIds, setSelectedReconciliationIds] = useState<React.Key[]>([]);
  const [activeTab, setActiveTab] = useState('list');
  const [filters, setFilters] = useState({
    period: '',
    status: ''
  });

  const [confirmForm] = Form.useForm();
  const [disputeForm] = Form.useForm();

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
          recon_no: 'RC20260101',
          period: '2026-01',
          purchase_amount: 125000,
          return_amount: -5000,
          promotion_fee: 2000,
          deduction_amount: -700,
          payable_amount: 119300,
          status: 'pending',
          created_at: '2026-02-01 10:00',
          supplier_name: '农夫山泉股份有限公司',
          items: [
            { type: '采购金额', amount: 125000, description: '1月采购商品总金额' },
            { type: '退货金额', amount: -5000, description: '质量问题退货扣款' },
            { type: '促销费用', amount: 2000, description: '春节促销费用分摊' },
            { type: '质量扣款', amount: -700, description: '质量问题赔偿' }
          ]
        },
        {
          id: '2',
          recon_no: 'RC20251201',
          period: '2025-12',
          purchase_amount: 98000,
          return_amount: 0,
          promotion_fee: 1500,
          deduction_amount: -500,
          payable_amount: 96000,
          status: 'confirmed',
          confirmed_at: '2026-01-15 14:30',
          supplier_name: '农夫山泉股份有限公司',
          items: [
            { type: '采购金额', amount: 98000, description: '12月采购商品总金额' },
            { type: '促销费用', amount: 1500, description: '元旦促销费用分摊' },
            { type: '交期扣款', amount: -500, description: '延期交货扣款' }
          ]
        },
        {
          id: '3',
          recon_no: 'RC20251101',
          period: '2025-11',
          purchase_amount: 102300,
          return_amount: -3200,
          promotion_fee: 0,
          deduction_amount: 0,
          payable_amount: 99100,
          status: 'confirmed',
          confirmed_at: '2026-01-01 09:00',
          supplier_name: '农夫山泉股份有限公司',
          items: [
            { type: '采购金额', amount: 102300, description: '11月采购商品总金额' },
            { type: '退货金额', amount: -3200, description: '临期商品退货' }
          ]
        },
        {
          id: '4',
          recon_no: 'RC20251001',
          period: '2025-10',
          purchase_amount: 85000,
          return_amount: -2000,
          promotion_fee: 1000,
          deduction_amount: -300,
          payable_amount: 83700,
          status: 'settled',
          settled_at: '2025-12-28 15:00',
          supplier_name: '农夫山泉股份有限公司',
          items: [
            { type: '采购金额', amount: 85000, description: '10月采购商品总金额' },
            { type: '退货金额', amount: -2000, description: '包装破损退货' },
            { type: '促销费用', amount: 1000, description: '双十促销费用分摊' },
            { type: '质量扣款', amount: -300, description: '包装轻微破损扣款' }
          ]
        }
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

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const handleConfirmReconciliation = (record: any) => {
    setSelectedRecord(record);
    setConfirmModalVisible(true);
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

    // 过滤出已确认的结算单
    const confirmedRecords = filteredData.filter(item =>
      selectedReconciliationIds.includes(item.id) && item.status === 'confirmed'
    );

    if (confirmedRecords.length === 0) {
      message.warning('请选择已确认状态的结算单');
      return;
    }

    setSelectedRecord(null); // 清空单个选择
    setBatchEarlySettlementModalVisible(true);
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
    setEarlySettlementLoading(true);
    
    // 模拟API调用
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
      
      // 刷新列表（实际项目中应该更新状态）
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
      case 'pending': return '待确认';
      case 'confirmed': return '已确认';
      case 'disputed': return '有异议';
      case 'settled': return '已结算';
      default: return status;
    }
  };

  const columns = [
    {
      title: '对账单号',
      dataIndex: 'recon_no',
      key: 'recon_no',
      width: 140,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '对账期间',
      dataIndex: 'period',
      key: 'period',
      width: 100,
      render: (period: string) => <span>{period}月</span>
    },
    {
      title: '采购金额',
      dataIndex: 'purchase_amount',
      key: 'purchase_amount',
      width: 120,
      render: (amount: number) => `¥${amount?.toLocaleString()}`
    },
    {
      title: '退货金额',
      dataIndex: 'return_amount',
      key: 'return_amount',
      width: 120,
      render: (amount: number) => `¥${amount?.toLocaleString()}`
    },
    {
      title: '应付金额',
      dataIndex: 'payable_amount',
      key: 'payable_amount',
      width: 120,
      render: (amount: number) => (
        <div style={{ fontWeight: 'bold', color: '#f5222d', fontSize: '16px' }}>
          ¥{amount.toLocaleString()}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (date: string) => dayjs(date).format('MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
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
              <Tooltip title="确认对账">
                <Button
                  type="text"
                  icon={<CheckCircleOutlined />}
                  size="small"
                  style={{ color: '#52c41a' }}
                  onClick={() => handleConfirmReconciliation(record)}
                />
              </Tooltip>
              <Tooltip title="提出异议">
                <Button
                  type="text"
                  icon={<CloseCircleOutlined />}
                  size="small"
                  style={{ color: '#f5222d' }}
                  onClick={() => handleDisputeReconciliation(record)}
                />
              </Tooltip>
            </>
          )}

          {record.status === 'confirmed' && (
            <>
              <Tooltip title="申请提前结算">
                <Button
                  type="primary"
                  size="small"
                  icon={<ThunderboltOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #fa8c16 0%, #ffec3d 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(250, 140, 22, 0.3)'
                  }}
                  onClick={() => handleOpenEarlySettlement(record)}
                >
                  提前结算
                </Button>
              </Tooltip>
              <Tooltip title="生成发票">
                <Button
                  type="text"
                  icon={<FileTextOutlined />}
                  size="small"
                  onClick={() => message.info('跳转到发票管理页面')}
                />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card style={{ marginBottom: '24px' }}>
        {/* 筛选条件 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="选择期间"
              style={{ width: '100%' }}
              allowClear
              value={filters.period}
              onChange={(value) => handleFilterChange({ ...filters, period: value })}
            >
              <Select.Option value="2026-01">2026年1月</Select.Option>
              <Select.Option value="2025-12">2025年12月</Select.Option>
              <Select.Option value="2025-11">2025年11月</Select.Option>
              <Select.Option value="2025-10">2025年10月</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="对账状态"
              style={{ width: '100%' }}
              allowClear
              value={filters.status}
              onChange={(value) => handleFilterChange({ ...filters, status: value })}
            >
              <Select.Option value="pending">待确认</Select.Option>
              <Select.Option value="confirmed">已确认</Select.Option>
              <Select.Option value="disputed">有异议</Select.Option>
              <Select.Option value="settled">已结算</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={8}>
            <Space>
              <Button type="primary" icon={<FileDoneOutlined />}>批量确认</Button>
              <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={handleBatchEarlySettlement}
            disabled={selectedReconciliationIds.length === 0}
            style={{
              background: 'linear-gradient(135deg, #fa8c16 0%, #ffec3d 100%)',
              border: 'none',
              color: '#fff',
              fontWeight: 'bold',
              opacity: selectedReconciliationIds.length > 0 ? 1 : 0.5
            }}
          >
            批量提前结算 {selectedReconciliationIds.length > 0 ? `(${selectedReconciliationIds.length})` : ''}
          </Button>
              <Button icon={<FileTextOutlined />}>导出对账单</Button>
            </Space>
          </Col>
        </Row>

        {/* 对账统计概览 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="待确认对账单"
                value={filteredData.filter(item => item.status === 'pending').length}
                suffix="个"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="已确认对账单"
                value={filteredData.filter(item => item.status === 'confirmed').length}
                suffix="个"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="本月应付账款"
                value={filteredData
                  .filter(item => item.period === '2026-01' && item.status !== 'settled')
                  .reduce((sum, item) => sum + item.payable_amount, 0)}
                prefix="¥"
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        <Table
          columns={columns}
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

      {/* 对账单详情弹窗 */}
      <Modal
        title={`对账单详情 - ${selectedRecord?.recon_no}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="对账单号">{selectedRecord.recon_no}</Descriptions.Item>
              <Descriptions.Item label="对账期间">{selectedRecord.period}月</Descriptions.Item>
              <Descriptions.Item label="对账状态">
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {getStatusText(selectedRecord.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedRecord.created_at}</Descriptions.Item>
              {selectedRecord.confirmed_at && (
                <>
                  <Descriptions.Item label="确认时间">{selectedRecord.confirmed_at}</Descriptions.Item>
                  <Descriptions.Item label="确认人">{selectedRecord.signer_name || '系统自动'}</Descriptions.Item>
                </>
              )}
            </Descriptions>

            <Divider>费用明细</Divider>
            <List
              size="small"
              dataSource={selectedRecord.items}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{
                        backgroundColor: item.amount >= 0 ? '#52c41a' : '#f5222d'
                      }}>
                        {item.type === '采购金额' ? '购' :
                         item.type === '退货金额' ? '退' :
                         item.type === '促销费用' ? '促' :
                         item.type === '质量扣款' ? '质' : '扣'}
                      </Avatar>
                    }
                    title={item.type}
                    description={item.description}
                  />
                  <div style={{
                    fontWeight: 'bold',
                    color: item.amount >= 0 ? '#52c41a' : '#f5222d',
                    fontSize: '16px'
                  }}>
                    {item.amount >= 0 ? '+' : ''}¥{Math.abs(item.amount).toLocaleString()}
                  </div>
                </List.Item>
              )}
            />

            <Divider />
            <div style={{
              backgroundColor: '#f6ffed',
              padding: '16px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <Text strong style={{ fontSize: '16px' }}>应付账款总额</Text>
                <Text type="secondary" style={{ display: 'block' }}>包含所有费用项目</Text>
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#f5222d'
              }}>
                ¥{selectedRecord.payable_amount.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 对账确认弹窗 */}
      <Modal
        title="确认对账单"
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form onFinish={handleConfirmSubmit} layout="vertical">
          {selectedRecord && (
            <>
              <Alert
                message="对账单确认"
                description={`对账单 ${selectedRecord.recon_no} - 应付金额 ¥${selectedRecord.payable_amount.toLocaleString()}`}
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
              />

              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="采购金额">¥{selectedRecord.purchase_amount.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="退货金额">¥{selectedRecord.return_amount.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="促销费用">¥{selectedRecord.promotion_fee.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="扣款金额">¥{selectedRecord.deduction_amount.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="应付账款">
                  <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                    ¥{selectedRecord.payable_amount.toLocaleString()}
                  </Text>
                </Descriptions.Item>
              </Descriptions>

              <Alert
                message="确认后，对账单将进入付款流程"
                type="warning"
                showIcon
                style={{ marginTop: '16px' }}
              />

              <Form.Item
                name="remark"
                label="备注"
                style={{ marginTop: '16px' }}
              >
                <Input.TextArea rows={3} placeholder="可选：添加确认备注" />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                  <Button onClick={() => setConfirmModalVisible(false)}>取消</Button>
                  <Button type="primary" htmlType="submit">
                    确认对账
                  </Button>
                </Space>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

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

      {/* 提前结算申请弹窗（单个） */}
      <EarlySettlementModal
        visible={earlySettlementModalVisible}
        onCancel={() => {
          setEarlySettlementModalVisible(false);
          setSelectedRecord(null);
        }}
        onSubmit={handleEarlySettlementSubmit}
        settlementData={selectedRecord ? {
          id: selectedRecord.id,
          recon_no: selectedRecord.recon_no,
          supplier_name: selectedRecord.supplier_name,
          payable_amount: selectedRecord.payable_amount,
          period: selectedRecord.period
        } : {
          id: '',
          recon_no: '',
          supplier_name: '',
          payable_amount: 0,
          period: ''
        }}
        loading={earlySettlementLoading}
      />

      {/* 批量提前结算申请弹窗 */}
      <EarlySettlementModal
        visible={batchEarlySettlementModalVisible}
        onCancel={() => {
          setBatchEarlySettlementModalVisible(false);
          setSelectedReconciliationIds([]);
        }}
        onSubmit={handleEarlySettlementSubmit}
        settlementData={{
          id: selectedReconciliationIds.join(','),
          recon_no: selectedReconciliationIds.length > 0 ? `${selectedReconciliationIds.length}个结算单` : '',
          supplier_name: selectedReconciliationIds.length > 0 ? filteredData.find(item => item.id === selectedReconciliationIds[0])?.supplier_name || '' : '',
          payable_amount: selectedReconciliationIds.length > 0 ? filteredData
            .filter(item => selectedReconciliationIds.includes(item.id))
            .reduce((sum, item) => sum + item.payable_amount, 0) : 0,
          period: selectedReconciliationIds.length > 0 ? filteredData
            .filter(item => selectedReconciliationIds.includes(item.id))
            .map(item => item.period)
            .join(', ') : ''
        }}
        loading={earlySettlementLoading}
        isBatch={true}
        batchCount={selectedReconciliationIds.length}
      />
    </div>
  );
};

export default Reconciliation;
