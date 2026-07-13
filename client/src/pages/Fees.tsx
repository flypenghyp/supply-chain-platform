import React, { useEffect, useState } from 'react';
import { Table, Card, Row, Col, Tag, Statistic, Button, Space, Input, Select, message, Typography, Descriptions, Alert, Drawer } from 'antd';
import { FileDoneOutlined, ExportOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter';

const { Text, Title } = Typography;
const { Search } = Input;

const Fees: React.FC = () => {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    period: '',
    fee_type: '',
    status: '',
    settlement_no: '',
    fee_category: '',
    source: ''
  });
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setLoading(true);
    setTimeout(() => {
      // 从所有结算单中提取费用类扣款数据
      const mockData = [
        {
          id: 'FEE001',
          fee_no: 'FY20260101001',
          period: '202601',
          settlement_no: 'D13-99926010600012',
          supplier_name: '广东太古可口可乐有限公司深圳营业部',
          fee_type: '促销服务费',
          fee_category: '价内费用',
          amount: 5000,
          tax_rate: 0.06,
          tax_amount: 300,
          total_amount: 5300,
          status: 'confirmed',
          created_at: '2026-01-18 10:00',
          remark: '202601 月促销活动费用',
          source: '购销结算对账单'
        },
        {
          id: 'FEE002',
          fee_no: 'FY20260101002',
          period: '202601',
          settlement_no: 'D13-99926010600015',
          supplier_name: '农夫山泉股份有限公司',
          fee_type: '质量扣款',
          fee_category: '价外扣款',
          amount: 700,
          tax_rate: 0,
          tax_amount: 0,
          total_amount: 700,
          status: 'confirmed',
          created_at: '2026-01-20 14:30',
          remark: '产品质量问题扣款',
          source: '购销结算对账单'
        },
        {
          id: 'FEE003',
          fee_no: 'FY20260201003',
          period: '202602',
          settlement_no: 'D13-99926020600023',
          supplier_name: '深圳天虹商场有限公司',
          fee_type: '促销服务费',
          fee_category: '价内费用',
          amount: 3000,
          tax_rate: 0.06,
          tax_amount: 180,
          total_amount: 3180,
          status: 'confirmed',
          created_at: '2026-02-15 09:00',
          remark: '春节促销活动费用',
          source: '联营结算对账单'
        },
        {
          id: 'FEE004',
          fee_no: 'FY20260201004',
          period: '202602',
          settlement_no: 'D13-99926020600025',
          supplier_name: '华润万家超市有限公司',
          fee_type: '延期扣款',
          fee_category: '价外扣款',
          amount: 1500,
          tax_rate: 0,
          tax_amount: 0,
          total_amount: 1500,
          status: 'confirmed',
          created_at: '2026-02-18 11:00',
          remark: '交货延期扣款',
          source: '代销结算对账单'
        },
        {
          id: 'FEE005',
          fee_no: 'FY20260201005',
          period: '202602',
          settlement_no: 'D13-99926020600028',
          supplier_name: '娄底市天虹百货有限公司',
          fee_type: '租赁管理费',
          fee_category: '价内费用',
          amount: 1765.89,
          tax_rate: 0.09,
          tax_amount: 158.93,
          total_amount: 1924.82,
          status: 'confirmed',
          created_at: '2026-02-20 16:00',
          remark: 'clmp316 自动生成，2026-02-01 至 2026-02-28',
          source: '租赁结算对账单'
        },
        {
          id: 'FEE006',
          fee_no: 'FY20260301006',
          period: '202603',
          settlement_no: 'D13-99926030600035',
          supplier_name: '广东太古可口可乐有限公司深圳营业部',
          fee_type: '促销服务费',
          fee_category: '价内费用',
          amount: 8000,
          tax_rate: 0.06,
          tax_amount: 480,
          total_amount: 8480,
          status: 'pending',
          created_at: '2026-03-05 10:00',
          remark: '315 促销活动费用',
          source: '购销结算对账单'
        },
        {
          id: 'FEE007',
          fee_no: 'FY20260301007',
          period: '202603',
          settlement_no: 'D13-99926030600038',
          supplier_name: '农夫山泉股份有限公司',
          fee_type: '服务费',
          fee_category: '价内费用',
          amount: 1200,
          tax_rate: 0.06,
          tax_amount: 72,
          total_amount: 1272,
          status: 'pending',
          created_at: '2026-03-08 14:30',
          remark: '2 月消杀服务费用',
          source: '购销结算对账单'
        }
      ];
      setFees(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleFilter = () => {
    message.info('筛选功能已实现，实际项目中调用 API');
    console.log('筛选条件:', filters);
  };

  const handleReset = () => {
    setFilters({
      period: '',
      supplier_name: '',
      fee_type: '',
      settlement_no: ''
    });
    message.info('筛选条件已重置');
  };

  const handleExport = () => {
    message.success('导出成功！已下载费用单报表.xlsx');
    console.log('导出数据:', fees);
  };

  const handleViewDetail = (record: any) => {
    setSelectedFee(record);
    setDetailDrawerVisible(true);
  };

  const getFeeTypeColor = (type: string) => {
    const colorMap: any = {
      '促销服务费': 'blue',
      '质量扣款': 'red',
      '延期扣款': 'orange',
      '租赁管理费': 'green',
      '服务费': 'purple',
      '管理费': 'cyan'
    };
    return colorMap[type] || 'default';
  };

  const columns = [
    {
      title: '费用单号',
      dataIndex: 'fee_no',
      key: 'fee_no',
      width: 160,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
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
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 200,
      ellipsis: true
    },
    {
      title: '结算单号',
      dataIndex: 'settlement_no',
      key: 'settlement_no',
      width: 160,
      render: (text: string) => (
        <Text copyable style={{ color: '#1890ff' }}>{text}</Text>
      )
    },
    {
      title: '费用类型',
      dataIndex: 'fee_type',
      key: 'fee_type',
      width: 120,
      render: (type: string) => (
        <Tag color={getFeeTypeColor(type)}>{type}</Tag>
      )
    },
    {
      title: '费用类别',
      dataIndex: 'fee_category',
      key: 'fee_category',
      width: 100,
      render: (category: string) => (
        <Tag color={category === '价内费用' ? 'green' : 'orange'}>
          {category}
        </Tag>
      )
    },
    {
      title: '来源单据',
      dataIndex: 'source',
      key: 'source',
      width: 150,
      render: (source: string) => (
        <Text type="secondary">{source}</Text>
      )
    },
    {
      title: '金额 (不含税)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (amount: number) => (
        <Text>¥{amount?.toLocaleString()}</Text>
      )
    },
    {
      title: '税额',
      dataIndex: 'tax_amount',
      key: 'tax_amount',
      width: 100,
      align: 'right',
      render: (amount: number) => (
        <Text type="secondary">¥{amount?.toLocaleString()}</Text>
      )
    },
    {
      title: '总金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 120,
      align: 'right',
      render: (amount: number) => (
        <Text strong style={{ color: '#f5222d' }}>
          ¥{amount?.toLocaleString()}
        </Text>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'confirmed' ? 'green' : 'orange'}>
          {status === 'confirmed' ? '已确认' : '待确认'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
        </Space>
      )
    }
  ];

  // 计算统计数据
  const totalAmount = fees.reduce((sum, item) => sum + item.total_amount, 0);
  const totalTaxAmount = fees.reduce((sum, item) => sum + item.tax_amount, 0);
  const confirmedCount = fees.filter(item => item.status === 'confirmed').length;
  const pendingCount = fees.filter(item => item.status === 'pending').length;

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card>
        <Alert
          message="费用单管理"
          description="汇总展示所有结算单中的费用类扣款，包括价内费用和价外扣款。支持按会计期间查询和导出。"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="费用总额"
                value={totalAmount}
                prefix="¥"
                precision={2}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="税额总计"
                value={totalTaxAmount}
                prefix="¥"
                precision={2}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="已确认费用单"
                value={confirmedCount}
                suffix="个"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="待确认费用单"
                value={pendingCount}
                suffix="个"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 筛选区域 */}
        <AdvancedSearchFilter
          fields={[
            { key: 'period', label: '会计期间', type: 'input', placeholder: '例如：202601' },
            { key: 'fee_type', label: '费用类型', type: 'select', placeholder: '请选择费用类型',
              options: [
                { label: '促销服务费', value: '促销服务费' },
                { label: '质量扣款', value: '质量扣款' },
                { label: '延期扣款', value: '延期扣款' },
                { label: '租赁管理费', value: '租赁管理费' },
                { label: '服务费', value: '服务费' },
                { label: '管理费', value: '管理费' }
              ]
            },
            { key: 'status', label: '业务状态', type: 'select', placeholder: '请选择业务状态',
              options: [
                { label: '已确认', value: 'confirmed' },
                { label: '待确认', value: 'pending' }
              ]
            },
            { key: 'fee_category', label: '费用类别', type: 'select', placeholder: '请选择费用类别',
              options: [
                { label: '价内费用', value: '价内费用' },
                { label: '价外扣款', value: '价外扣款' }
              ]
            },
            ...(filterExpanded ? [
              { key: 'settlement_no', label: '结算单号', type: 'input', placeholder: '请输入结算单号' },
              { key: 'source', label: '来源单据', type: 'select', placeholder: '请选择来源单据',
                options: [
                  { label: '购销结算对账单', value: '购销结算对账单' },
                  { label: '联营结算对账单', value: '联营结算对账单' },
                  { label: '代销结算对账单', value: '代销结算对账单' },
                  { label: '租赁结算对账单', value: '租赁结算对账单' }
                ]
              },
              { key: 'supplier_name', label: '供应商名称', type: 'input', placeholder: '请输入供应商名称' },
              { key: 'fee_no', label: '费用单号', type: 'input', placeholder: '请输入费用单号' }
            ] : [])
          ]}
          values={filters}
          onChange={(k, v) => setFilters({ ...filters, [k]: v })}
          onSearch={handleFilter}
          onReset={handleReset}
          extraActions={
            <Button
              onClick={() => setFilterExpanded(!filterExpanded)}
              size="small"
            >
              {filterExpanded ? '收起' : '展开更多'}
            </Button>
          }
        />

        {/* 操作按钮 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col>
            <Button
              icon={<ExportOutlined />}
              onClick={handleExport}
              style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(82, 196, 26, 0.3)',
                fontWeight: 'bold',
                padding: '4px 20px',
                color: '#fff'
              }}
            >
              导出报表
            </Button>
          </Col>
        </Row>

        {/* 费用单列表 */}
        <Table
          columns={columns}
          dataSource={fees}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />

        {/* 费用单详情抽屉 */}
        <Drawer
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FileDoneOutlined style={{ marginRight: '8px', fontSize: '20px', color: '#1890ff' }} />
              <span>费用单详情</span>
            </div>
          }
          placement="right"
          width={1200}
          open={detailDrawerVisible}
          onClose={() => {
            setDetailDrawerVisible(false);
            setSelectedFee(null);
          }}
          extra={
            <Space>
              <Button onClick={() => {
                setDetailDrawerVisible(false);
                setSelectedFee(null);
              }}>
                关闭
              </Button>
            </Space>
          }
        >
          {selectedFee && (
            <div>
              {/* 基本信息 */}
              <div style={{ marginBottom: '24px' }}>
                <Title level={5} style={{ marginBottom: '16px' }}>基本信息</Title>
                <div style={{ backgroundColor: '#e6f7ff', padding: '16px', borderRadius: '4px' }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Descriptions.Item label="费用单号" span={2}>
                        <Text strong style={{ color: '#1890ff' }}>{selectedFee.fee_no}</Text>
                      </Descriptions.Item>
                    </Col>
                    <Col span={8}>
                      <Descriptions.Item label="会计期间">
                        <Tag color="geekblue">{selectedFee.period}</Tag>
                      </Descriptions.Item>
                    </Col>
                    <Col span={8}>
                      <Descriptions.Item label="业务状态">
                        <Tag color={selectedFee.status === 'confirmed' ? 'green' : 'orange'}>
                          {selectedFee.status === 'confirmed' ? '已确认' : '待确认'}
                        </Tag>
                      </Descriptions.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Descriptions.Item label="供应商" span={2}>
                        {selectedFee.supplier_name}
                      </Descriptions.Item>
                    </Col>
                    <Col span={12}>
                      <Descriptions.Item label="创建时间">
                        {dayjs(selectedFee.created_at).format('YYYY-MM-DD HH:mm:ss')}
                      </Descriptions.Item>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* 关联信息 */}
              <div style={{ marginBottom: '24px' }}>
                <Title level={5} style={{ marginBottom: '16px' }}>关联信息</Title>
                <div style={{ backgroundColor: '#fff7e6', padding: '16px', borderRadius: '4px' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Descriptions.Item label="结算单号" span={2}>
                        <Text copyable style={{ color: '#1890ff' }}>{selectedFee.settlement_no}</Text>
                      </Descriptions.Item>
                    </Col>
                    <Col span={12}>
                      <Descriptions.Item label="来源单据">
                        <Text type="secondary">{selectedFee.source}</Text>
                      </Descriptions.Item>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* 费用明细 */}
              <div style={{ marginBottom: '24px' }}>
                <Title level={5} style={{ marginBottom: '16px' }}>费用明细</Title>
                <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: '4px' }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Descriptions.Item label="费用类型" span={2}>
                        <Tag color={getFeeTypeColor(selectedFee.fee_type)}>{selectedFee.fee_type}</Tag>
                      </Descriptions.Item>
                    </Col>
                    <Col span={8}>
                      <Descriptions.Item label="费用类别">
                        <Tag color={selectedFee.fee_category === '价内费用' ? 'green' : 'orange'}>
                          {selectedFee.fee_category}
                        </Tag>
                      </Descriptions.Item>
                    </Col>
                    <Col span={8}>
                      <Descriptions.Item label="税率">
                        {(selectedFee.tax_rate * 100).toFixed(0)}%
                      </Descriptions.Item>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: '16px' }}>
                    <Col span={8}>
                      <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fff', borderRadius: '4px' }}>
                        <Statistic
                          title="金额 (不含税)"
                          value={selectedFee.amount}
                          prefix="¥"
                          precision={2}
                          valueStyle={{ fontSize: '18px' }}
                        />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fff', borderRadius: '4px' }}>
                        <Statistic
                          title="税额"
                          value={selectedFee.tax_amount}
                          prefix="¥"
                          precision={2}
                          valueStyle={{ color: '#faad14', fontSize: '18px' }}
                        />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fff', borderRadius: '4px' }}>
                        <Statistic
                          title="总金额"
                          value={selectedFee.total_amount}
                          prefix="¥"
                          precision={2}
                          valueStyle={{ color: '#f5222d', fontSize: '20px', fontWeight: 'bold' }}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* 备注信息 */}
              <div style={{ marginBottom: '24px' }}>
                <Title level={5} style={{ marginBottom: '16px' }}>备注说明</Title>
                <div style={{ backgroundColor: '#fafafa', padding: '16px', borderRadius: '4px', border: '1px solid #e8e8e8' }}>
                  <Text type="secondary">{selectedFee.remark || '无'}</Text>
                </div>
              </div>

              <Alert
                message="说明"
                description="该费用单关联到对应结算单，在结算时统一结算。价内费用在货款内扣除，价外扣款需另行支付。"
                type="info"
                showIcon
              />
            </div>
          )}
        </Drawer>
      </Card>
    </div>
  );
};

export default Fees;
