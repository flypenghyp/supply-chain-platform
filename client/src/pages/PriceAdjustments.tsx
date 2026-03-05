import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, DatePicker, InputNumber,
  Statistic, Descriptions, Progress, List, Avatar
} from 'antd';
import {
  DollarOutlined, PlusOutlined, EditOutlined, EyeOutlined, FileTextOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined,
  RobotOutlined, CalculatorOutlined, RiseOutlined, FallOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const PriceAdjustments: React.FC = () => {
  const [priceAdjustments, setPriceAdjustments] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [adjustmentModalVisible, setAdjustmentModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    product: ''
  });

  useEffect(() => {
    fetchPriceAdjustments();
  }, []);

  const fetchPriceAdjustments = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          id: '1',
          adjustment_no: 'PA20260118001',
          product_name: '农夫山泉550ml',
          product_code: 'P001',
          original_price: 50,
          new_price: 48,
          adjustment_type: 'retailer_adjustment',
          adjustment_reason: '市场竞争调整',
          effective_date: '2026-01-20',
          status: 'pending',
          initiator: '零售商',
          created_at: '2026-01-18 10:00',
          impact: -4
        },
        {
          id: '2',
          adjustment_no: 'PA20260117001',
          product_name: '蒙牛纯牛奶250ml',
          product_code: 'P002',
          original_price: 50,
          new_price: 45,
          adjustment_type: 'supplier_promotion',
          adjustment_reason: '春节促销活动',
          effective_date: '2026-01-25',
          status: 'approved',
          initiator: '供应商',
          created_at: '2026-01-17 14:30',
          impact: -10
        },
        {
          id: '3',
          adjustment_no: 'PA20260116001',
          product_name: '好利来面包500g',
          product_code: 'P003',
          original_price: 45,
          new_price: 52,
          adjustment_type: 'supplier_adjustment',
          adjustment_reason: '成本上涨调整',
          effective_date: '2026-01-15',
          status: 'effective',
          initiator: '供应商',
          created_at: '2026-01-16 09:00',
          impact: 15.6
        }
      ];
      setPriceAdjustments(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    let filtered = [...priceAdjustments];

    if (newFilters.type) {
      filtered = filtered.filter(item => item.adjustment_type === newFilters.type);
    }

    if (newFilters.status) {
      filtered = filtered.filter(item => item.status === newFilters.status);
    }

    if (newFilters.product) {
      filtered = filtered.filter(item =>
        item.product_name.toLowerCase().includes(newFilters.product.toLowerCase()) ||
        item.product_code.toLowerCase().includes(newFilters.product.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const getTypeColor = (type: string) => {
    const colors: any = {
      retailer_adjustment: 'blue',
      supplier_adjustment: 'orange',
      supplier_promotion: 'green'
    };
    return colors[type] || 'default';
  };

  const getTypeText = (type: string) => {
    const texts: any = {
      retailer_adjustment: '零售商调价',
      supplier_adjustment: '供应商调价',
      supplier_promotion: '供应商促销调价'
    };
    return texts[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'orange',
      approved: 'green',
      rejected: 'red',
      effective: 'blue'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已驳回',
      effective: '已生效'
    };
    return texts[status] || status;
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const handleNewAdjustment = () => {
    setAdjustmentModalVisible(true);
  };

  const handleApproval = (record: any, approved: boolean) => {
    const status = approved ? 'approved' : 'rejected';
    message.success(`${approved ? '通过' : '驳回'}调价申请`);
    fetchPriceAdjustments();
  };

  const columns = [
    {
      title: '调价单号',
      dataIndex: 'adjustment_no',
      key: 'adjustment_no',
      width: 140,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '商品信息',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 150,
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.product_code}</div>
        </div>
      )
    },
    {
      title: '调价类型',
      dataIndex: 'adjustment_type',
      key: 'adjustment_type',
      width: 120,
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>
          {getTypeText(type)}
        </Tag>
      )
    },
    {
      title: '价格调整',
      dataIndex: 'original_price',
      key: 'original_price',
      width: 140,
      render: (original: number, record: any) => (
        <div>
          <div style={{ textDecoration: 'line-through', color: '#999' }}>
            ¥{original}
          </div>
          <div style={{
            fontWeight: 'bold',
            color: record.new_price > original ? '#f5222d' : '#52c41a',
            display: 'flex',
            alignItems: 'center'
          }}>
            {record.new_price > original ? <RiseOutlined /> : <FallOutlined />}
            ¥{record.new_price}
            <span style={{ fontSize: '12px', marginLeft: '4px' }}>
              ({record.impact > 0 ? '+' : ''}{record.impact.toFixed(1)}%)
            </span>
          </div>
        </div>
      )
    },
    {
      title: '调价原因',
      dataIndex: 'adjustment_reason',
      key: 'adjustment_reason',
      width: 120,
      render: (reason: string) => (
        <Tooltip title={reason}>
          <div style={{
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {reason}
          </div>
        </Tooltip>
      )
    },
    {
      title: '生效日期',
      dataIndex: 'effective_date',
      key: 'effective_date',
      width: 100,
      render: (date: string) => dayjs(date).format('MM-DD')
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
      title: '操作',
      key: 'actions',
      width: 150,
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
              <Tooltip title="通过">
                <Button
                  type="text"
                  icon={<CheckCircleOutlined />}
                  size="small"
                  style={{ color: '#52c41a' }}
                  onClick={() => handleApproval(record, true)}
                />
              </Tooltip>
              <Tooltip title="驳回">
                <Button
                  type="text"
                  icon={<CloseCircleOutlined />}
                  size="small"
                  style={{ color: '#f5222d' }}
                  onClick={() => handleApproval(record, false)}
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
              placeholder="调价类型"
              style={{ width: '100%' }}
              allowClear
              value={filters.type}
              onChange={(value) => handleFilterChange({ ...filters, type: value })}
            >
              <Select.Option value="retailer_adjustment">零售商调价</Select.Option>
              <Select.Option value="supplier_adjustment">供应商调价</Select.Option>
              <Select.Option value="supplier_promotion">供应商促销调价</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="审核状态"
              style={{ width: '100%' }}
              allowClear
              value={filters.status}
              onChange={(value) => handleFilterChange({ ...filters, status: value })}
            >
              <Select.Option value="pending">待审核</Select.Option>
              <Select.Option value="approved">已通过</Select.Option>
              <Select.Option value="rejected">已驳回</Select.Option>
              <Select.Option value="effective">已生效</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Input
              placeholder="搜索商品"
              value={filters.product}
              onChange={(e) => handleFilterChange({ ...filters, product: e.target.value })}
              prefix={<FileTextOutlined />}
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleNewAdjustment}>
                申请调价
              </Button>
              <Button icon={<FileTextOutlined />}>导出报表</Button>
            </Space>
          </Col>
        </Row>

        {/* 统计概览 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="待审核调价"
                value={filteredData.filter(item => item.status === 'pending').length}
                suffix="个"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="已生效调价"
                value={filteredData.filter(item => item.status === 'effective').length}
                suffix="个"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="平均调价幅度"
                value={Math.abs(filteredData.reduce((sum, item) => sum + item.impact, 0) / filteredData.length).toFixed(1)}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="调价成功率"
                value={Math.round((filteredData.filter(item => item.status === 'approved' || item.status === 'effective').length / filteredData.length) * 100)}
                suffix="%"
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
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 调价详情弹窗 */}
      <Modal
        title={`调价详情 - ${selectedRecord?.adjustment_no}`}
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedRecord && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="调价单号">{selectedRecord.adjustment_no}</Descriptions.Item>
              <Descriptions.Item label="商品名称">{selectedRecord.product_name}</Descriptions.Item>
              <Descriptions.Item label="商品编码">{selectedRecord.product_code}</Descriptions.Item>
              <Descriptions.Item label="调价类型">
                <Tag color={getTypeColor(selectedRecord.adjustment_type)}>
                  {getTypeText(selectedRecord.adjustment_type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="调价状态">
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {getStatusText(selectedRecord.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="发起方">{selectedRecord.initiator}</Descriptions.Item>
              <Descriptions.Item label="原价格">¥{selectedRecord.original_price}</Descriptions.Item>
              <Descriptions.Item label="新价格">
                <span style={{
                  color: selectedRecord.new_price > selectedRecord.original_price ? '#f5222d' : '#52c41a',
                  fontWeight: 'bold'
                }}>
                  ¥{selectedRecord.new_price}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="调价幅度">
                <span style={{
                  color: selectedRecord.impact > 0 ? '#f5222d' : '#52c41a',
                  fontWeight: 'bold'
                }}>
                  {selectedRecord.impact > 0 ? '+' : ''}{selectedRecord.impact.toFixed(1)}%
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="生效日期">{selectedRecord.effective_date}</Descriptions.Item>
              <Descriptions.Item label="申请时间">{selectedRecord.created_at}</Descriptions.Item>
            </Descriptions>

            <Divider>调价原因</Divider>
            <Paragraph>{selectedRecord.adjustment_reason}</Paragraph>

            {/* AI分析建议 */}
            <Divider>AI智能分析</Divider>
            <div style={{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <RobotOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                <Text strong>调价影响评估</Text>
              </div>
              <div>
                <Text>基于历史数据分析，该调价可能产生以下影响：</Text>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>预计销量影响: {selectedRecord.impact > 0 ? '下降' : '提升'} {Math.abs(selectedRecord.impact * 0.8).toFixed(1)}%</li>
                  <li>毛利率变化: {selectedRecord.impact > 0 ? '提升' : '下降'} {Math.abs(selectedRecord.impact).toFixed(1)}%</li>
                  <li>建议关注竞争对手价格变化</li>
                  <li>建议在调价后监控销量变化</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 新增调价申请弹窗 */}
      <Modal
        title="申请商品调价"
        visible={adjustmentModalVisible}
        onCancel={() => setAdjustmentModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item
            name="product"
            label="选择商品"
            rules={[{ required: true, message: '请选择商品' }]}
          >
            <Select placeholder="选择要调价的商品">
              <Select.Option value="P001">农夫山泉550ml</Select.Option>
              <Select.Option value="P002">蒙牛纯牛奶250ml</Select.Option>
              <Select.Option value="P003">好利来面包500g</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="adjustment_type"
            label="调价类型"
            rules={[{ required: true, message: '请选择调价类型' }]}
          >
            <Select placeholder="选择调价类型">
              <Select.Option value="supplier_adjustment">供应商调价</Select.Option>
              <Select.Option value="supplier_promotion">供应商促销调价</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="original_price"
                label="原价格"
                rules={[{ required: true, message: '请输入原价格' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  prefix="¥"
                  placeholder="当前价格"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="new_price"
                label="新价格"
                rules={[{ required: true, message: '请输入新价格' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  prefix="¥"
                  placeholder="调整后价格"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="effective_date"
            label="生效日期"
            rules={[{ required: true, message: '请选择生效日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="reason"
            label="调价原因"
            rules={[{ required: true, message: '请填写调价原因' }]}
          >
            <Input.TextArea rows={3} placeholder="请详细说明调价原因" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setAdjustmentModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                提交申请
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PriceAdjustments;
