import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, DatePicker, InputNumber,
  Statistic, Descriptions, Progress, List, Avatar, Tabs
} from 'antd';
import {
  ShoppingOutlined, PlusOutlined, EditOutlined, EyeOutlined, FileTextOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined,
  RobotOutlined, CalculatorOutlined, RiseOutlined, FallOutlined, UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const BidManagement: React.FC = () => {
  const [bids, setBids] = useState<any[]>([]);
  const [retailerRequests, setRetailerRequests] = useState<any[]>([]);
  const [filteredBids, setFilteredBids] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('bids');
  const [filters, setFilters] = useState({
    status: '',
    product: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setTimeout(() => {
      // 模拟零售商报价需求数据
      const mockRequests = [
        {
          id: '1',
          request_no: 'BR20260118001',
          retailer_name: '华润万家',
          product_name: '农夫山泉550ml',
          product_code: 'P001',
          required_quantity: 10000,
          expected_price: 45,
          deadline: '2026-01-25',
          status: 'open',
          created_at: '2026-01-18 10:00',
          description: '春节期间大批量采购，需要优惠价格'
        },
        {
          id: '2',
          request_no: 'BR20260117001',
          retailer_name: '沃尔玛',
          product_name: '蒙牛纯牛奶250ml',
          product_code: 'P002',
          required_quantity: 5000,
          expected_price: 42,
          deadline: '2026-01-22',
          status: 'open',
          created_at: '2026-01-17 14:30',
          description: '新店开业促销活动'
        }
      ];

      // 模拟供应商报价数据
      const mockBids = [
        {
          id: '1',
          bid_no: 'BID20260118001',
          request_no: 'BR20260118001',
          retailer_name: '华润万家',
          product_name: '农夫山泉550ml',
          bid_price: 43,
          bid_quantity: 10000,
          total_amount: 430000,
          bid_date: '2026-01-18 11:30',
          status: 'pending',
          valid_until: '2026-01-25',
          notes: '可以提供春节期间的优惠价格'
        },
        {
          id: '2',
          bid_no: 'BID20260117001',
          request_no: 'BR20260117001',
          retailer_name: '沃尔玛',
          product_name: '蒙牛纯牛奶250ml',
          bid_price: 40,
          bid_quantity: 5000,
          total_amount: 200000,
          bid_date: '2026-01-17 15:00',
          status: 'accepted',
          valid_until: '2026-01-22',
          notes: '新店开业优惠报价'
        }
      ];

      setRetailerRequests(mockRequests);
      setFilteredRequests(mockRequests);
      setBids(mockBids);
      setFilteredBids(mockBids);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    let filtered = activeTab === 'bids' ? [...bids] : [...retailerRequests];

    if (newFilters.status) {
      filtered = filtered.filter(item => item.status === newFilters.status);
    }

    if (newFilters.product) {
      filtered = filtered.filter(item =>
        item.product_name?.toLowerCase().includes(newFilters.product.toLowerCase()) ||
        item.product_code?.toLowerCase().includes(newFilters.product.toLowerCase())
      );
    }

    if (activeTab === 'bids') {
      setFilteredBids(filtered);
    } else {
      setFilteredRequests(filtered);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      open: 'green',
      pending: 'orange',
      accepted: 'blue',
      rejected: 'red',
      expired: 'gray'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      open: '开放中',
      pending: '待确认',
      accepted: '已接受',
      rejected: '已拒绝',
      expired: '已过期'
    };
    return texts[status] || status;
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const handleSubmitBid = () => {
    setBidModalVisible(true);
  };

  const handleBidSubmit = async (values: any) => {
    try {
      message.success('报价已提交');
      setBidModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('提交失败');
    }
  };

  const handleBidAction = (record: any, action: 'accept' | 'reject') => {
    const status = action === 'accept' ? 'accepted' : 'rejected';
    message.success(`报价已${action === 'accept' ? '接受' : '拒绝'}`);
    fetchData();
  };

  const requestColumns = [
    {
      title: '需求编号',
      dataIndex: 'request_no',
      key: 'request_no',
      width: 140,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '零售商',
      dataIndex: 'retailer_name',
      key: 'retailer_name',
      width: 120,
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          {text}
        </div>
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
      title: '需求数量',
      dataIndex: 'required_quantity',
      key: 'required_quantity',
      width: 100,
      render: (quantity: number) => (
        <div style={{ fontWeight: 'bold' }}>{quantity?.toLocaleString()}</div>
      )
    },
    {
      title: '期望价格',
      dataIndex: 'expected_price',
      key: 'expected_price',
      width: 100,
      render: (price: number) => (
        <div style={{ color: '#52c41a', fontWeight: 'bold' }}>¥{price}</div>
      )
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
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
      width: 120,
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
          <Tooltip title="提交报价">
            <Button
              type="text"
              icon={<ShoppingOutlined />}
              size="small"
              style={{ color: '#1890ff' }}
              onClick={handleSubmitBid}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const bidColumns = [
    {
      title: '报价编号',
      dataIndex: 'bid_no',
      key: 'bid_no',
      width: 140,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '需求编号',
      dataIndex: 'request_no',
      key: 'request_no',
      width: 140
    },
    {
      title: '零售商',
      dataIndex: 'retailer_name',
      key: 'retailer_name',
      width: 120,
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          {text}
        </div>
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
          <div style={{ fontSize: '12px', color: '#666' }}>报价数量: {record.bid_quantity?.toLocaleString()}</div>
        </div>
      )
    },
    {
      title: '报价价格',
      dataIndex: 'bid_price',
      key: 'bid_price',
      width: 100,
      render: (price: number) => (
        <div style={{ color: '#f5222d', fontWeight: 'bold' }}>¥{price}</div>
      )
    },
    {
      title: '报价总金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 120,
      render: (amount: number) => (
        <div style={{ fontWeight: 'bold' }}>¥{amount?.toLocaleString()}</div>
      )
    },
    {
      title: '报价日期',
      dataIndex: 'bid_date',
      key: 'bid_date',
      width: 120,
      render: (date: string) => dayjs(date).format('MM-DD HH:mm')
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
              <Tooltip title="接受报价">
                <Button
                  type="text"
                  icon={<CheckCircleOutlined />}
                  size="small"
                  style={{ color: '#52c41a' }}
                  onClick={() => handleBidAction(record, 'accept')}
                />
              </Tooltip>
              <Tooltip title="拒绝报价">
                <Button
                  type="text"
                  icon={<CloseCircleOutlined />}
                  size="small"
                  style={{ color: '#f5222d' }}
                  onClick={() => handleBidAction(record, 'reject')}
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
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <ShoppingOutlined />
                我的报价
              </span>
            }
            key="bids"
          >
            {/* 报价筛选条件 */}
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col xs={24} sm={8} lg={4}>
                <Select
                  placeholder="报价状态"
                  style={{ width: '100%' }}
                  allowClear
                  value={filters.status}
                  onChange={(value) => handleFilterChange({ ...filters, status: value })}
                >
                  <Select.Option value="pending">待确认</Select.Option>
                  <Select.Option value="accepted">已接受</Select.Option>
                  <Select.Option value="rejected">已拒绝</Select.Option>
                  <Select.Option value="expired">已过期</Select.Option>
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
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleSubmitBid}>
                    提交新报价
                  </Button>
                  <Button icon={<FileTextOutlined />}>导出报表</Button>
                </Space>
              </Col>
            </Row>

            {/* 报价统计概览 */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="待确认报价"
                    value={filteredBids.filter(item => item.status === 'pending').length}
                    suffix="个"
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="已接受报价"
                    value={filteredBids.filter(item => item.status === 'accepted').length}
                    suffix="个"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="报价成功率"
                    value={Math.round((filteredBids.filter(item => item.status === 'accepted').length / filteredBids.length) * 100)}
                    suffix="%"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="总报价金额"
                    value={filteredBids.reduce((sum, item) => sum + (item.total_amount || 0), 0)}
                    prefix="¥"
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>

            <Table
              columns={bidColumns}
              dataSource={filteredBids}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                零售商需求
              </span>
            }
            key="requests"
          >
            {/* 需求筛选条件 */}
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col xs={24} sm={8} lg={4}>
                <Select
                  placeholder="需求状态"
                  style={{ width: '100%' }}
                  allowClear
                  value={filters.status}
                  onChange={(value) => handleFilterChange({ ...filters, status: value })}
                >
                  <Select.Option value="open">开放中</Select.Option>
                  <Select.Option value="expired">已过期</Select.Option>
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
            </Row>

            {/* 需求统计概览 */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="开放需求"
                    value={filteredRequests.filter(item => item.status === 'open').length}
                    suffix="个"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="总需求量"
                    value={filteredRequests.reduce((sum, item) => sum + (item.required_quantity || 0), 0)}
                    suffix="件"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="平均期望价"
                    value={Math.round(filteredRequests.reduce((sum, item) => sum + (item.expected_price || 0), 0) / filteredRequests.length)}
                    prefix="¥"
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>

            <Table
              columns={requestColumns}
              dataSource={filteredRequests}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={`${activeTab === 'bids' ? '报价' : '需求'}详情`}
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedRecord && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label={activeTab === 'bids' ? '报价编号' : '需求编号'}>
                {activeTab === 'bids' ? selectedRecord.bid_no : selectedRecord.request_no}
              </Descriptions.Item>
              <Descriptions.Item label="零售商">{selectedRecord.retailer_name}</Descriptions.Item>
              <Descriptions.Item label="商品名称">{selectedRecord.product_name}</Descriptions.Item>
              <Descriptions.Item label="商品编码">{selectedRecord.product_code}</Descriptions.Item>
              <Descriptions.Item label="数量">
                {activeTab === 'bids' ? selectedRecord.bid_quantity : selectedRecord.required_quantity} 件
              </Descriptions.Item>
              <Descriptions.Item label={activeTab === 'bids' ? '报价价格' : '期望价格'}>
                ¥{activeTab === 'bids' ? selectedRecord.bid_price : selectedRecord.expected_price}
              </Descriptions.Item>
              {activeTab === 'bids' && (
                <Descriptions.Item label="报价总金额">¥{selectedRecord.total_amount?.toLocaleString()}</Descriptions.Item>
              )}
              <Descriptions.Item label="状态">
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {getStatusText(selectedRecord.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={activeTab === 'bids' ? '报价日期' : '截止日期'}>
                {dayjs(activeTab === 'bids' ? selectedRecord.bid_date : selectedRecord.deadline).format('YYYY-MM-DD HH:mm')}
              </Descriptions.Item>
            </Descriptions>

            <Divider>备注说明</Divider>
            <Paragraph>{activeTab === 'bids' ? selectedRecord.notes : selectedRecord.description}</Paragraph>

            {/* AI分析建议 */}
            <Divider>AI智能分析</Divider>
            <div style={{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <RobotOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                <Text strong>竞价策略建议</Text>
              </div>
              <div>
                <Text>基于市场数据分析：</Text>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>当前价格在市场合理区间内</li>
                  <li>建议关注竞争对手报价动态</li>
                  <li>可以考虑提供批量优惠或服务增值</li>
                  <li>建议在截止日期前调整报价以提高中标率</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 提交报价弹窗 */}
      <Modal
        title="提交商品报价"
        visible={bidModalVisible}
        onCancel={() => setBidModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form onFinish={handleBidSubmit} layout="vertical">
          <Form.Item
            name="request"
            label="选择需求"
            rules={[{ required: true, message: '请选择报价需求' }]}
          >
            <Select placeholder="选择要报价的需求">
              {retailerRequests.filter(item => item.status === 'open').map(request => (
                <Select.Option key={request.id} value={request.id}>
                  {request.request_no} - {request.retailer_name} - {request.product_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="bid_price"
                label="报价价格"
                rules={[{ required: true, message: '请输入报价价格' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  prefix="¥"
                  placeholder="单价"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bid_quantity"
                label="报价数量"
                rules={[{ required: true, message: '请输入报价数量' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="件"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="valid_until"
            label="报价有效期"
            rules={[{ required: true, message: '请选择报价有效期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="notes"
            label="报价说明"
          >
            <Input.TextArea rows={3} placeholder="请说明您的报价优势、服务承诺等" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setBidModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                提交报价
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BidManagement;
