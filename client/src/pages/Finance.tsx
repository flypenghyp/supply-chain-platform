import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, Table, Tag, Progress, Alert, Modal, Checkbox, Space, message, Typography, Descriptions } from 'antd';
import { BankOutlined, DollarOutlined, PlusOutlined, CheckOutlined, FileTextOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Finance: React.FC = () => {
  const [financing, setFinancing] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [applicationModalVisible, setApplicationModalVisible] = useState(false);
  const [reconciliationData, setReconciliationData] = useState<any[]>([]);
  const [selectedReconciliationIds, setSelectedReconciliationIds] = useState<React.Key[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

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
          financing_no: 'FN20260115001',
          source_type: 'early_settlement', // 来源于提前结算
          source_id: 'ES20260115001',
          settlement_no: 'RC20260101',
          supplier_name: '农夫山泉股份有限公司',
          amount: 119300,
          discount_fee: 895,
          net_amount: 118405,
          interest_rate: 0.05,
          status: 'approved',
          created_at: '2026-01-15 14:30',
          approved_at: '2026-01-16 09:00',
          expected_pay_date: '2026-01-20',
          signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        },
        {
          id: 'F002',
          financing_no: 'FN20260112002',
          source_type: 'early_settlement',
          source_id: 'ES20260112002',
          settlement_no: 'RC20251201',
          supplier_name: '农夫山泉股份有限公司',
          amount: 96000,
          discount_fee: 720,
          net_amount: 95280,
          interest_rate: 0.05,
          status: 'pending',
          created_at: '2026-01-12 10:15',
          approved_at: null,
          expected_pay_date: '2026-01-18',
          signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        },
        {
          id: 'F003',
          financing_no: 'FN20260108003',
          source_type: 'early_settlement',
          source_id: 'ES20260108003',
          settlement_no: 'RC20251101',
          supplier_name: '农夫山泉股份有限公司',
          amount: 99100,
          discount_fee: 743,
          net_amount: 98357,
          interest_rate: 0.05,
          status: 'paid',
          created_at: '2026-01-08 16:45',
          approved_at: '2026-01-09 11:00',
          paid_at: '2026-01-10 14:00',
          expected_pay_date: '2026-01-15',
          payment_transaction_id: 'PAY20260110001',
          signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        }
      ];
      setFinancing(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: '融资编号',
      dataIndex: 'financing_no',
      key: 'financing_no',
      width: 150,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '来源',
      dataIndex: 'source_type',
      key: 'source_type',
      width: 120,
      render: (type: string) => (
        <Tag color={type === 'early_settlement' ? 'blue' : 'default'}>
          {type === 'early_settlement' ? '提前结算' : '其他'}
        </Tag>
      )
    },
    {
      title: '结算单号',
      dataIndex: 'settlement_no',
      key: 'settlement_no',
      width: 140
    },
    {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 180
    },
    {
      title: '融资金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      render: (amount: number) => (
        <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ¥{amount?.toLocaleString()}
        </div>
      )
    },
    {
      title: '折扣费用',
      dataIndex: 'discount_fee',
      key: 'discount_fee',
      width: 120,
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
      width: 100,
      render: (rate: number) => `${(rate * 100).toFixed(1)}%/天`
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
      title: '创建时间',
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
          message="供应链金融服务"
          description="基于确认的应收账款申请提前结算，缓解资金压力。A级供应商可享受0.05%/天的优惠利率。"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenApplication}
              style={{
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                fontWeight: 'bold',
                padding: '4px 20px'
              }}
            >
              申请融资
            </Button>
          </Col>
        </Row>

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

        {/* 融资单据详情弹窗 */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FileTextOutlined style={{ marginRight: '8px', fontSize: '20px', color: '#1890ff' }} />
              <span>融资单据详情</span>
            </div>
          }
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          width={900}
        >
          {selectedRecord && (
            <div>
              {/* 基本信息 */}
              <Card size="small" title="基本信息" style={{ marginBottom: '16px', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="融资编号">
                    <Text strong style={{ color: '#1890ff' }}>{selectedRecord.financing_no}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="来源类型">
                    <Tag color="blue">{selectedRecord.source_type === 'early_settlement' ? '提前结算' : '其他'}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="结算单号">
                    {selectedRecord.settlement_no}
                  </Descriptions.Item>
                  <Descriptions.Item label="供应商">
                    {selectedRecord.supplier_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {selectedRecord.created_at}
                  </Descriptions.Item>
                  <Descriptions.Item label="期望付款日">
                    {selectedRecord.expected_pay_date}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* 金额信息 */}
              <Card size="small" title="金额信息" style={{ marginBottom: '16px', backgroundColor: '#fff7e6', borderColor: '#ffd591' }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Statistic
                        title="融资金额"
                        value={selectedRecord.amount}
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
                        value={selectedRecord.discount_fee}
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
                        value={selectedRecord.net_amount}
                        prefix="¥"
                        precision={2}
                        valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
                      />
                    </div>
                  </Col>
                </Row>
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <Text type="secondary">
                    利率：{(selectedRecord.interest_rate * 100).toFixed(1)}% / 天
                  </Text>
                </div>
              </Card>

              {/* 状态信息 */}
              <Card size="small" title="状态流转" style={{ marginBottom: '16px' }}>
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="当前状态">
                    {{
                      pending: <Tag color="orange">待审批</Tag>,
                      approved: <Tag color="green">已批准</Tag>,
                      rejected: <Tag color="red">已拒绝</Tag>,
                      paid: <Tag color="blue">已支付</Tag>
                    }[selectedRecord.status as keyof any] || <Tag>{selectedRecord.status}</Tag>}
                  </Descriptions.Item>
                  {selectedRecord.approved_at && (
                    <>
                      <Descriptions.Item label="审批时间">
                        {selectedRecord.approved_at}
                      </Descriptions.Item>
                      <Descriptions.Item label="审批人">
                        系统管理员
                      </Descriptions.Item>
                    </>
                  )}
                  {selectedRecord.paid_at && (
                    <>
                      <Descriptions.Item label="支付时间">
                        {selectedRecord.paid_at}
                      </Descriptions.Item>
                      <Descriptions.Item label="支付流水号">
                        <Text copyable>{selectedRecord.payment_transaction_id}</Text>
                      </Descriptions.Item>
                    </>
                  )}
                </Descriptions>
              </Card>

              {/* 电子签名 */}
              {selectedRecord.signature && (
                <Card size="small" title="电子签名" style={{ marginBottom: '16px', backgroundColor: '#f0f9ff', borderColor: '#1890ff' }}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <img 
                      src={selectedRecord.signature} 
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
                </Card>
              )}

              {/* 备注信息 */}
              <Alert
                message="说明"
                description="该融资单据由供应商通过提前结算申请生成，基于确认的应收账款进行融资。"
                type="info"
                showIcon
              />
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default Finance;
