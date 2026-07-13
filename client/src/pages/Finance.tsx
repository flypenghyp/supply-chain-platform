import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, Table, Tag, Progress, Alert, Modal, Checkbox, Space, message, Typography, Descriptions, Drawer, Form, Input, Select } from 'antd';
import { BankOutlined, DollarOutlined, PlusOutlined, CheckOutlined, FileTextOutlined, EyeOutlined, ExportOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter';

const { Text, Title } = Typography;

const Finance: React.FC = () => {
  const [financing, setFinancing] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [applicationModalVisible, setApplicationModalVisible] = useState(false);
  const [reconciliationData, setReconciliationData] = useState<any[]>([]);
  const [selectedReconciliationIds, setSelectedReconciliationIds] = useState<React.Key[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [financingDrawerVisible, setFinancingDrawerVisible] = useState(false);
  const [selectedFinancingRecord, setSelectedFinancingRecord] = useState<any>(null);
  const [filters, setFilters] = useState({
    application_no: '',
    supplier_name: '',
    settlement_no: '',
    status: '',
    date_range: [] as any[]
  });

  useEffect(() => {
    fetchFinancing();
  }, []);

  const handleOpenApplication = () => {
    setApplicationModalVisible(true);
    // 模拟加载可融资的结算单数据
    const mockReconciliationData = [
      {
        id: '1',
        recon_no: 'RC20260101',
        supplier_name: '优质供应商A',
        period: '2026-01',
        payable_amount: 119300,
        original_due_date: '2026-02-01',
        status: 'confirmed',
        confirmed_at: '2026-01-20 10:00'
      },
      {
        id: '2',
        recon_no: 'RC20251201',
        supplier_name: '优质供应商A',
        period: '2025-12',
        payable_amount: 96000,
        original_due_date: '2026-01-01',
        status: 'confirmed',
        confirmed_at: '2025-12-25 14:30'
      },
      {
        id: '3',
        recon_no: 'RC20251101',
        supplier_name: '优质供应商A',
        period: '2025-11',
        payable_amount: 99100,
        original_due_date: '2026-01-01',
        status: 'confirmed',
        confirmed_at: '2025-12-01 09:00'
      }
    ];
    setReconciliationData(mockReconciliationData);
  };

  const handleReconciliationRowSelection = {
    selectedRowKeys: selectedReconciliationIds,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedReconciliationIds(selectedKeys);
    }
  };

  const handleSubmitApplication = () => {
    if (selectedReconciliationIds.length === 0) {
      message.warning('请至少选择一个结算单');
      return;
    }

    const selectedRecords = reconciliationData.filter(item => selectedReconciliationIds.includes(item.id));
    const totalAmount = selectedRecords.reduce((sum, item) => sum + item.payable_amount, 0);

    message.success(`融资申请已提交！合计金额：¥${totalAmount.toLocaleString()}`);
    setApplicationModalVisible(false);
    setSelectedReconciliationIds([]);
  };

  const fetchFinancing = async () => {
    setLoading(true);
    setTimeout(() => {
      // 模拟从提前结算单生成的融资单据
      const mockData = [
        {
          id: 'F001',
          application_no: 'TQJS20260115001',
          source_type: 'early_settlement',
          source_id: 'ES20260115001',
          settlement_no: 'D13-99926030600056',
          supplier_name: '农夫山泉股份有限公司',
          amount: 119300,
          discount_fee: 895,
          net_amount: 118405,
          interest_rate: 0.0005,
          early_days: 15,
          original_due_date: '2026-02-01',
          expected_pay_date: '2026-01-20',
          paid_at: '2026-01-20 14:30',
          status: 'paid',
          created_at: '2026-01-15 14:30',
          approved_at: '2026-01-16 09:00',
          signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        },
        {
          id: 'F002',
          application_no: 'TQJS20260112002',
          source_type: 'early_settlement',
          source_id: 'ES20260112002',
          settlement_no: 'D13-99926030600057',
          supplier_name: '深圳天虹商场有限公司',
          amount: 68000,
          discount_fee: 510,
          net_amount: 67490,
          interest_rate: 0.0005,
          early_days: 10,
          original_due_date: '2026-01-25',
          expected_pay_date: '2026-01-18',
          paid_at: null,
          status: 'approved',
          created_at: '2026-01-12 10:15',
          approved_at: '2026-01-13 11:00',
          signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        },
        {
          id: 'F003',
          application_no: 'TQJS20260108003',
          source_type: 'early_settlement',
          source_id: 'ES20260108003',
          settlement_no: 'D13-99926030600058',
          supplier_name: '华润万家超市有限公司',
          amount: 85600,
          discount_fee: 642,
          net_amount: 84958,
          interest_rate: 0.0005,
          early_days: 12,
          original_due_date: '2026-01-22',
          expected_pay_date: '2026-01-15',
          paid_at: '2026-01-15 16:00',
          status: 'paid',
          created_at: '2026-01-08 16:45',
          approved_at: '2026-01-09 11:00',
          signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        },
        {
          id: 'F004',
          application_no: 'TQJS20260105004',
          source_type: 'early_settlement',
          source_id: 'ES20260105004',
          settlement_no: 'D13-99926030600059',
          supplier_name: '娄底市天虹百货有限公司',
          amount: 146057.34,
          discount_fee: 1095.43,
          net_amount: 144961.91,
          interest_rate: 0.0005,
          early_days: 10,
          original_due_date: '2026-03-20',
          expected_pay_date: '2026-03-08',
          paid_at: null,
          status: 'pending',
          created_at: '2026-03-08 10:00',
          approved_at: null,
          signature: null
        }
      ];
      setFinancing(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleViewDetail = (record: any) => {
    setSelectedFinancingRecord(record);
    setFinancingDrawerVisible(true);
  };

  const handleExport = () => {
    message.success('导出成功！已下载提前结算报表.xlsx');
    console.log('导出数据:', financing);
  };

  const handleFilter = () => {
    message.info('筛选功能已实现，实际项目中调用 API');
    // 实际项目中这里调用 API 传递筛选条件
    console.log('筛选条件:', filters);
  };

  const handleReset = () => {
    setFilters({
      application_no: '',
      supplier_name: '',
      settlement_no: '',
      status: '',
      date_range: []
    });
    message.info('筛选条件已重置');
  };

  const columns = [
    {
      title: '申请单号',
      dataIndex: 'application_no',
      key: 'application_no',
      width: 160,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 180
    },
    {
      title: '结算单号',
      dataIndex: 'settlement_no',
      key: 'settlement_no',
      width: 140
    },
    {
      title: '提前结算金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      align: 'right',
      render: (amount: number) => (
        <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ¥{amount?.toLocaleString()}
        </div>
      )
    },
    {
      title: '服务费',
      dataIndex: 'discount_fee',
      key: 'discount_fee',
      width: 100,
      align: 'right',
      render: (fee: number) => (
        <Text type="secondary">
          ¥{fee?.toLocaleString()}
        </Text>
      )
    },
    {
      title: '实付金额',
      dataIndex: 'net_amount',
      key: 'net_amount',
      width: 130,
      align: 'right',
      render: (amount: number) => (
        <Text strong style={{ color: '#f5222d' }}>
          ¥{amount?.toLocaleString()}
        </Text>
      )
    },
    {
      title: '利率',
      dataIndex: 'interest_rate',
      key: 'interest_rate',
      width: 90,
      align: 'right',
      render: (rate: number) => `${(rate * 100).toFixed(2)}%/天`
    },
    {
      title: '提前天数',
      dataIndex: 'early_days',
      key: 'early_days',
      width: 90,
      align: 'right',
      render: (days: number) => `${days}天`
    },
    {
      title: '原付款日',
      dataIndex: 'original_due_date',
      key: 'original_due_date',
      width: 120
    },
    {
      title: '预计付款日',
      dataIndex: 'expected_pay_date',
      key: 'expected_pay_date',
      width: 120,
      render: (date: string) => (
        <Text strong style={{ color: '#1890ff' }}>{date}</Text>
      )
    },
    {
      title: '实际付款日',
      dataIndex: 'paid_at',
      key: 'paid_at',
      width: 120,
      render: (date: string) => date || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'orange', text: '待审批' },
          approved: { color: 'green', text: '已批准' },
          rejected: { color: 'red', text: '已拒绝' },
          paid: { color: 'blue', text: '已支付' }
        };
        const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '申请时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看单据
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Alert
          message="供应链金融服务 - 提前结算报表"
          description="基于确认的应收账款申请提前结算，缓解资金压力。A 级供应商可享受 0.05%/天的优惠利率。"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        {/* 筛选区域 */}
        <AdvancedSearchFilter
          fields={[
            { key: 'application_no', label: '申请单号', type: 'input', placeholder: '请输入申请单号' },
            { key: 'supplier_name', label: '供应商名称', type: 'input', placeholder: '请输入供应商名称' },
            { key: 'settlement_no', label: '结算单号', type: 'input', placeholder: '请输入结算单号' },
            { key: 'status', label: '业务状态', type: 'select', placeholder: '请选择',
              options: [
                { label: '待审批', value: 'pending' },
                { label: '已批准', value: 'approved' },
                { label: '已拒绝', value: 'rejected' },
                { label: '已支付', value: 'paid' }
              ]
            }
          ]}
          values={filters}
          onChange={(k, v) => setFilters({ ...filters, [k]: v })}
          onSearch={handleFilter}
          onReset={handleReset}
          extraActions={
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenApplication}
                style={{
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                  fontWeight: 'bold',
                  padding: '4px 20px',
                  height: 32
                }}
              >
                申请融资
              </Button>
              <Button
                icon={<ExportOutlined />}
                onClick={handleExport}
                style={{
                  background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(82, 196, 26, 0.3)',
                  fontWeight: 'bold',
                  padding: '4px 20px',
                  color: '#fff',
                  height: 32
                }}
              >
                导出报表
              </Button>
            </Space>
          }
        />

        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="可用额度"
                value={200000}
                prefix="¥"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="信用等级"
                value="A级"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="优惠利率"
                value="0.05%"
                suffix="/天"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={financing}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />

        {/* 融资申请模态框 */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <PlusOutlined style={{ marginRight: '8px', fontSize: '20px', color: '#1890ff' }} />
              <span>申请融资 - 选择可融资结算单</span>
            </div>
          }
          open={applicationModalVisible}
          onCancel={() => {
            setApplicationModalVisible(false);
            setSelectedReconciliationIds([]);
          }}
          width={1000}
          footer={[
            <Button key="cancel" onClick={() => {
              setApplicationModalVisible(false);
              setSelectedReconciliationIds([]);
            }}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleSubmitApplication}
              disabled={selectedReconciliationIds.length === 0}
              style={{
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none'
              }}
            >
              提交申请
            </Button>
          ]}
        >
          <Alert
            message="可融资结算单"
            description="请选择需要融资的结算单，可多选。融资额度基于结算金额，利率0.05%/天，最高可融资金额200,000元。"
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <Table
            dataSource={reconciliationData}
            rowKey="id"
            rowSelection={handleReconciliationRowSelection}
            pagination={false}
            columns={[
              {
                title: '结算单号',
                dataIndex: 'recon_no',
                key: 'recon_no',
                render: (text: string) => (
                  <Text strong style={{ color: '#1890ff' }}>{text}</Text>
                )
              },
              {
                title: '供应商',
                dataIndex: 'supplier_name',
                key: 'supplier_name'
              },
              {
                title: '对账期间',
                dataIndex: 'period',
                key: 'period'
              },
              {
                title: '原付款日',
                dataIndex: 'original_due_date',
                key: 'original_due_date'
              },
              {
                title: '结算金额',
                dataIndex: 'payable_amount',
                key: 'payable_amount',
                render: (amount: number) => (
                  <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                    ¥{amount.toLocaleString()}
                  </Text>
                )
              },
              {
                title: '确认时间',
                dataIndex: 'confirmed_at',
                key: 'confirmed_at'
              }
            ]}
          />

          {selectedReconciliationIds.length > 0 && (
            <Alert
              message={`已选择 ${selectedReconciliationIds.length} 个结算单`}
              description={
                <div>
                  <div>总金额：¥{
                    reconciliationData
                      .filter(item => selectedReconciliationIds.includes(item.id))
                      .reduce((sum, item) => sum + item.payable_amount, 0)
                      .toLocaleString()
                  }</div>
                  <div style={{ marginTop: '4px', color: '#faad14' }}>
                    预计日利息：¥{
                      (reconciliationData
                        .filter(item => selectedReconciliationIds.includes(item.id))
                        .reduce((sum, item) => sum + item.payable_amount, 0) * 0.0005).toFixed(2)
                    }
                  </div>
                </div>
              }
              type="success"
              showIcon
              style={{ marginTop: '16px' }}
            />
          )}
        </Modal>

        {/* 融资单据详情抽屉 - 右侧滑出（签署完成的单据） */}
        <Drawer
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FileTextOutlined style={{ marginRight: '8px', fontSize: '20px', color: '#1890ff' }} />
              <span>融资单据详情（已签署）</span>
            </div>
          }
          placement="right"
          width={1200}
          open={financingDrawerVisible}
          onClose={() => {
            setFinancingDrawerVisible(false);
            setSelectedFinancingRecord(null);
          }}
          extra={
            <Space>
              <Button onClick={() => {
                setFinancingDrawerVisible(false);
                setSelectedFinancingRecord(null);
              }}>
                关闭
              </Button>
            </Space>
          }
        >
          {selectedFinancingRecord && (
            <div>
              {/* 基本信息 */}
              <div style={{ marginBottom: '24px' }}>
                <Title level={5} style={{ marginBottom: '16px' }}>基本信息</Title>
                <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: '4px' }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item label="融资编号" labelCol={{ span: 24 }}>
                        <Input 
                          value={selectedFinancingRecord.financing_no} 
                          readOnly 
                          style={{ fontWeight: 'bold', color: '#1890ff' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="来源类型" labelCol={{ span: 24 }}>
                        <Tag color="blue">提前结算</Tag>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="结算单号" labelCol={{ span: 24 }}>
                        <Input value={selectedFinancingRecord.settlement_no} readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="供应商" labelCol={{ span: 24 }}>
                        <Input value={selectedFinancingRecord.supplier_name} readOnly />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item label="创建时间" labelCol={{ span: 24 }}>
                        <Input value={selectedFinancingRecord.created_at} readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="期望付款日" labelCol={{ span: 24 }}>
                        <Input value={selectedFinancingRecord.expected_pay_date} readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="业务状态" labelCol={{ span: 24 }}>
                        {
                          {
                            pending: <Tag color="orange">待审批</Tag>,
                            approved: <Tag color="green">已批准</Tag>,
                            rejected: <Tag color="red">已拒绝</Tag>,
                            paid: <Tag color="blue">已支付</Tag>
                          }[selectedFinancingRecord.status as keyof any] || <Tag>{selectedFinancingRecord.status}</Tag>
                        }
                      </Form.Item>
                    </Col>
                  </Row>

                  {selectedFinancingRecord.approved_at && (
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item label="审批时间" labelCol={{ span: 24 }}>
                          <Input value={selectedFinancingRecord.approved_at} readOnly />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="审批人" labelCol={{ span: 24 }}>
                          <Input value="系统管理员" readOnly />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {selectedFinancingRecord.paid_at && (
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item label="支付时间" labelCol={{ span: 24 }}>
                          <Input value={selectedFinancingRecord.paid_at} readOnly />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="支付流水号" labelCol={{ span: 24 }}>
                          <Input value={selectedFinancingRecord.payment_transaction_id} readOnly />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </div>
              </div>

              {/* 金额信息 */}
              <div style={{ marginBottom: '24px' }}>
                <Title level={5} style={{ marginBottom: '16px' }}>金额信息</Title>
                <div style={{ backgroundColor: '#fff7e6', padding: '16px', borderRadius: '4px' }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Statistic
                          title="融资金额"
                          value={selectedFinancingRecord.amount}
                          prefix="¥"
                          precision={2}
                          valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                        />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Statistic
                          title="折扣费用"
                          value={selectedFinancingRecord.discount_fee}
                          prefix="-¥"
                          precision={2}
                          valueStyle={{ color: '#faad14' }}
                        />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Statistic
                          title="实付金额"
                          value={selectedFinancingRecord.net_amount}
                          prefix="¥"
                          precision={2}
                          valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Text type="secondary">
                      利率：{(selectedFinancingRecord.interest_rate * 100).toFixed(1)}% / 天
                    </Text>
                  </div>
                </div>
              </div>

              {/* 电子签名 */}
              {selectedFinancingRecord.signature && (
                <div style={{ marginBottom: '24px' }}>
                  <Title level={5} style={{ marginBottom: '16px' }}>电子签名</Title>
                  <div style={{ backgroundColor: '#f0f9ff', padding: '24px', borderRadius: '4px', textAlign: 'center' }}>
                    <img 
                      src={selectedFinancingRecord.signature} 
                      alt="电子签名" 
                      style={{ 
                        maxWidth: '400px', 
                        height: '80px', 
                        border: '2px solid #52c41a',
                        borderRadius: '4px',
                        padding: '10px',
                        backgroundColor: '#f6ffed'
                      }} 
                    />
                    <div style={{ marginTop: '12px' }}>
                      <Text type="success">✓ 已签署</Text>
                    </div>
                  </div>
                </div>
              )}

              {/* 备注信息 */}
              <Alert
                message="说明"
                description="该融资单据由供应商通过提前结算申请生成，基于确认的应收账款进行融资。单据已签署完成，具有法律效力。"
                type="success"
                showIcon
              />
            </div>
          )}
        </Drawer>
      </Card>
    </div>
  );
};

export default Finance;
