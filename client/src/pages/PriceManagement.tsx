import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, DatePicker, InputNumber,
  Progress, Statistic, List, Avatar, Tabs, Descriptions
} from 'antd';
import {
  DollarOutlined, PlusOutlined, EditOutlined, EyeOutlined, FileTextOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined,
  RobotOutlined, CalculatorOutlined, RiseOutlined, FallOutlined, GiftOutlined,
  BarChartOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const PriceManagement: React.FC = () => {
  // 促销活动状态
  const [promotions, setPromotions] = useState<any[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<any[]>([]);
  const [promotionLoading, setPromotionLoading] = useState(false);
  const [promotionDetailModalVisible, setPromotionDetailModalVisible] = useState(false);
  const [createPromotionModalVisible, setCreatePromotionModalVisible] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);

  // 价格调整状态
  const [priceAdjustments, setPriceAdjustments] = useState<any[]>([]);
  const [filteredAdjustments, setFilteredAdjustments] = useState<any[]>([]);
  const [adjustmentLoading, setAdjustmentLoading] = useState(false);
  const [adjustmentDetailModalVisible, setAdjustmentDetailModalVisible] = useState(false);
  const [adjustmentModalVisible, setAdjustmentModalVisible] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState<any>(null);

  const [activeTab, setActiveTab] = useState('promotions');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    product: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setPromotionLoading(true);
    setAdjustmentLoading(true);

    setTimeout(() => {
      // 模拟促销数据
      const mockPromotions = [
        {
          id: '1',
          promotion_no: 'PM202601001',
          promotion_name: '春节大促',
          promotion_type: 'discount',
          start_date: '2026-01-25',
          end_date: '2026-02-10',
          status: 'active',
          budget: 50000,
          cost_bearer: 'supplier',
          progress: 65,
          sales_increase: 45,
          roi: 115
        },
        {
          id: '2',
          promotion_no: 'PM202512001',
          promotion_name: '元旦特惠',
          promotion_type: 'bundle',
          start_date: '2025-12-25',
          end_date: '2026-01-05',
          status: 'completed',
          budget: 30000,
          cost_bearer: 'shared',
          progress: 100,
          sales_increase: 38,
          roi: 95
        }
      ];

      // 模拟价格调整数据
      const mockAdjustments = [
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

      setPromotions(mockPromotions);
      setFilteredPromotions(mockPromotions);
      setPriceAdjustments(mockAdjustments);
      setFilteredAdjustments(mockAdjustments);
      setPromotionLoading(false);
      setAdjustmentLoading(false);
    }, 1000);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);

    if (activeTab === 'promotions') {
      let filtered = [...promotions];
      if (newFilters.status) {
        filtered = filtered.filter(item => item.status === newFilters.status);
      }
      if (newFilters.type) {
        filtered = filtered.filter(item => item.promotion_type === newFilters.type);
      }
      setFilteredPromotions(filtered);
    } else {
      let filtered = [...priceAdjustments];
      if (newFilters.status) {
        filtered = filtered.filter(item => item.status === newFilters.status);
      }
      if (newFilters.type) {
        filtered = filtered.filter(item => item.adjustment_type === newFilters.type);
      }
      if (newFilters.product) {
        filtered = filtered.filter(item =>
          item.product_name?.toLowerCase().includes(newFilters.product.toLowerCase()) ||
          item.product_code?.toLowerCase().includes(newFilters.product.toLowerCase())
        );
      }
      setFilteredAdjustments(filtered);
    }
  };

  // 促销相关函数
  const getPromotionStatusColor = (status: string) => {
    const colors: any = {
      pending: 'orange',
      active: 'green',
      completed: 'blue',
      rejected: 'red'
    };
    return colors[status] || 'default';
  };

  const getPromotionStatusText = (status: string) => {
    const texts: any = {
      pending: '待审核',
      active: '进行中',
      completed: '已完成',
      rejected: '已驳回'
    };
    return texts[status] || status;
  };

  const getPromotionTypeText = (type: string) => {
    const types: any = {
      discount: '折扣',
      bundle: '买赠',
      gift: '满减',
      special: '特价'
    };
    return types[type] || type;
  };

  const handleViewPromotionDetail = (record: any) => {
    setSelectedPromotion(record);
    setPromotionDetailModalVisible(true);
  };

  const handleCreatePromotion = () => {
    setCreatePromotionModalVisible(true);
  };

  // 价格调整相关函数
  const getAdjustmentTypeColor = (type: string) => {
    const colors: any = {
      retailer_adjustment: 'blue',
      supplier_adjustment: 'orange',
      supplier_promotion: 'green'
    };
    return colors[type] || 'default';
  };

  const getAdjustmentTypeText = (type: string) => {
    const texts: any = {
      retailer_adjustment: '零售商调价',
      supplier_adjustment: '供应商调价',
      supplier_promotion: '供应商促销调价'
    };
    return texts[type] || type;
  };

  const getAdjustmentStatusColor = (status: string) => {
    const colors: any = {
      pending: 'orange',
      approved: 'green',
      rejected: 'red',
      effective: 'blue'
    };
    return colors[status] || 'default';
  };

  const getAdjustmentStatusText = (status: string) => {
    const texts: any = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已驳回',
      effective: '已生效'
    };
    return texts[status] || status;
  };

  const handleViewAdjustmentDetail = (record: any) => {
    setSelectedAdjustment(record);
    setAdjustmentDetailModalVisible(true);
  };

  const handleNewAdjustment = () => {
    setAdjustmentModalVisible(true);
  };

  const handleApproval = (record: any, approved: boolean) => {
    const status = approved ? 'approved' : 'rejected';
    message.success(`${approved ? '通过' : '驳回'}调价申请`);
    fetchData();
  };

  const promotionColumns = [
    {
      title: '促销编号',
      dataIndex: 'promotion_no',
      key: 'promotion_no',
      width: 140,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '活动名称',
      dataIndex: 'promotion_name',
      key: 'promotion_name',
      width: 150
    },
    {
      title: '促销类型',
      dataIndex: 'promotion_type',
      key: 'promotion_type',
      width: 100,
      render: (type: string) => (
        <Tag color="blue">{getPromotionTypeText(type)}</Tag>
      )
    },
    {
      title: '活动时间',
      dataIndex: 'start_date',
      key: 'start_date',
      width: 180,
      render: (text: string, record: any) => (
        <div>
          <div>{dayjs(text).format('MM-DD')} 至 {dayjs(record.end_date).format('MM-DD')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {dayjs().isBefore(dayjs(text)) ? '未开始' :
             dayjs().isAfter(dayjs(record.end_date)) ? '已结束' : '进行中'}
          </div>
        </div>
      )
    },
    {
      title: '预算金额',
      dataIndex: 'budget',
      key: 'budget',
      width: 100,
      render: (amount: number) => (
        <div style={{ fontWeight: 'bold', color: '#f5222d' }}>
          ¥{amount?.toLocaleString()}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: any) => (
        <div>
          <Tag color={getPromotionStatusColor(status)}>{getPromotionStatusText(status)}</Tag>
          {status === 'active' && (
            <div style={{ marginTop: '4px' }}>
              <Progress percent={record.progress} size="small" showInfo={false} />
              <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                进度: {record.progress}%
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: '效果数据',
      dataIndex: 'sales_increase',
      key: 'sales_increase',
      width: 120,
      render: (increase: number, record: any) => (
        <div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#52c41a' }}>
            +{increase}%
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ROI: {record.roi}%
          </div>
        </div>
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
              onClick={() => handleViewPromotionDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
            />
          </Tooltip>
          {record.status === 'active' && (
            <Tooltip title="效果监控">
              <Button
                type="text"
                icon={<BarChartOutlined />}
                size="small"
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const adjustmentColumns = [
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
        <Tag color={getAdjustmentTypeColor(type)}>
          {getAdjustmentTypeText(type)}
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
        <Tag color={getAdjustmentStatusColor(status)}>
          {getAdjustmentStatusText(status)}
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
              onClick={() => handleViewAdjustmentDetail(record)}
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
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <GiftOutlined />
                促销管理
              </span>
            }
            key="promotions"
          >
            {/* 促销筛选条件 */}
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col xs={24} sm={8} lg={4}>
                <Select
                  placeholder="促销状态"
                  style={{ width: '100%' }}
                  allowClear
                  value={filters.status}
                  onChange={(value) => handleFilterChange({ ...filters, status: value })}
                >
                  <Select.Option value="pending">待审核</Select.Option>
                  <Select.Option value="active">进行中</Select.Option>
                  <Select.Option value="completed">已完成</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={8} lg={4}>
                <Select
                  placeholder="促销类型"
                  style={{ width: '100%' }}
                  allowClear
                  value={filters.type}
                  onChange={(value) => handleFilterChange({ ...filters, type: value })}
                >
                  <Select.Option value="discount">折扣</Select.Option>
                  <Select.Option value="bundle">买赠</Select.Option>
                  <Select.Option value="gift">满减</Select.Option>
                  <Select.Option value="special">特价</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={8} lg={4}>
                <Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreatePromotion}>
                    创建促销
                  </Button>
                  <Button icon={<FileTextOutlined />}>导出报表</Button>
                </Space>
              </Col>
            </Row>

            {/* 促销统计概览 */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="进行中活动"
                    value={filteredPromotions.filter(item => item.status === 'active').length}
                    suffix="个"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="总预算"
                    value={filteredPromotions.reduce((sum, item) => sum + (item.budget || 0), 0)}
                    prefix="¥"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="平均ROI"
                    value={Math.round(filteredPromotions.reduce((sum, item) => sum + (item.roi || 0), 0) / filteredPromotions.length)}
                    suffix="%"
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="销量提升"
                    value={Math.round(filteredPromotions.reduce((sum, item) => sum + (item.sales_increase || 0), 0) / filteredPromotions.length)}
                    suffix="%"
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>

            <Table
              columns={promotionColumns}
              dataSource={filteredPromotions}
              loading={promotionLoading}
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
                <DollarOutlined />
                价格调整
              </span>
            }
            key="adjustments"
          >
            {/* 价格调整筛选条件 */}
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

            {/* 价格调整统计概览 */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="待审核调价"
                    value={filteredAdjustments.filter(item => item.status === 'pending').length}
                    suffix="个"
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="已生效调价"
                    value={filteredAdjustments.filter(item => item.status === 'effective').length}
                    suffix="个"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="平均调价幅度"
                    value={Math.abs(filteredAdjustments.reduce((sum, item) => sum + item.impact, 0) / filteredAdjustments.length).toFixed(1)}
                    suffix="%"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card size="small">
                  <Statistic
                    title="调价成功率"
                    value={Math.round((filteredAdjustments.filter(item => item.status === 'approved' || item.status === 'effective').length / filteredAdjustments.length) * 100)}
                    suffix="%"
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>

            <Table
              columns={adjustmentColumns}
              dataSource={filteredAdjustments}
              loading={adjustmentLoading}
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

      {/* 促销详情弹窗 */}
      <Modal
        title={`促销详情 - ${selectedPromotion?.promotion_name}`}
        visible={promotionDetailModalVisible}
        onCancel={() => setPromotionDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedPromotion && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="促销编号">{selectedPromotion.promotion_no}</Descriptions.Item>
              <Descriptions.Item label="活动名称">{selectedPromotion.promotion_name}</Descriptions.Item>
              <Descriptions.Item label="促销类型">{getPromotionTypeText(selectedPromotion.promotion_type)}</Descriptions.Item>
              <Descriptions.Item label="活动状态">
                <Tag color={getPromotionStatusColor(selectedPromotion.status)}>
                  {getPromotionStatusText(selectedPromotion.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="活动时间">
                {dayjs(selectedPromotion.start_date).format('YYYY-MM-DD')} 至 {dayjs(selectedPromotion.end_date).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label="预算金额">¥{selectedPromotion.budget?.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="费用承担">{selectedPromotion.cost_bearer === 'supplier' ? '供应商全额' : '双方分摊'}</Descriptions.Item>
              <Descriptions.Item label="活动进度">
                <Progress percent={selectedPromotion.progress} />
              </Descriptions.Item>
            </Descriptions>

            {/* 效果数据 */}
            <Divider>活动效果</Divider>
            <Row gutter={16}>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="销量提升"
                    value={selectedPromotion.sales_increase}
                    suffix="%"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="ROI"
                    value={selectedPromotion.roi}
                    suffix="%"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="完成度"
                    value={selectedPromotion.progress}
                    suffix="%"
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="预算使用"
                    value={Math.round((selectedPromotion.progress / 100) * selectedPromotion.budget)}
                    prefix="¥"
                    suffix={`/¥${selectedPromotion.budget}`}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* AI建议 */}
            <Divider>AI智能分析</Divider>
            <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <RobotOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                <Text strong>AI优化建议</Text>
              </div>
              <div>
                <Text>基于当前活动效果分析：</Text>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>ROI表现优秀 ({selectedPromotion.roi}%)，建议扩大活动规模</li>
                  <li>销量提升明显 ({selectedPromotion.sales_increase}%)，活动策略有效</li>
                  <li>建议在活动后期加大宣传力度，提升转化率</li>
                  <li>预算控制良好，可考虑适当增加预算以扩大效果</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 价格调整详情弹窗 */}
      <Modal
        title={`调价详情 - ${selectedAdjustment?.adjustment_no}`}
        visible={adjustmentDetailModalVisible}
        onCancel={() => setAdjustmentDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedAdjustment && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="调价单号">{selectedAdjustment.adjustment_no}</Descriptions.Item>
              <Descriptions.Item label="商品名称">{selectedAdjustment.product_name}</Descriptions.Item>
              <Descriptions.Item label="商品编码">{selectedAdjustment.product_code}</Descriptions.Item>
              <Descriptions.Item label="调价类型">
                <Tag color={getAdjustmentTypeColor(selectedAdjustment.adjustment_type)}>
                  {getAdjustmentTypeText(selectedAdjustment.adjustment_type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="调价状态">
                <Tag color={getAdjustmentStatusColor(selectedAdjustment.status)}>
                  {getAdjustmentStatusText(selectedAdjustment.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="发起方">{selectedAdjustment.initiator}</Descriptions.Item>
              <Descriptions.Item label="原价格">¥{selectedAdjustment.original_price}</Descriptions.Item>
              <Descriptions.Item label="新价格">
                <span style={{
                  color: selectedAdjustment.new_price > selectedAdjustment.original_price ? '#f5222d' : '#52c41a',
                  fontWeight: 'bold'
                }}>
                  ¥{selectedAdjustment.new_price}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="调价幅度">
                <span style={{
                  color: selectedAdjustment.impact > 0 ? '#f5222d' : '#52c41a',
                  fontWeight: 'bold'
                }}>
                  {selectedAdjustment.impact > 0 ? '+' : ''}{selectedAdjustment.impact.toFixed(1)}%
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="生效日期">{selectedAdjustment.effective_date}</Descriptions.Item>
              <Descriptions.Item label="申请时间">{selectedAdjustment.created_at}</Descriptions.Item>
            </Descriptions>

            <Divider>调价原因</Divider>
            <Paragraph>{selectedAdjustment.adjustment_reason}</Paragraph>

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
                  <li>预计销量影响: {selectedAdjustment.impact > 0 ? '下降' : '提升'} {Math.abs(selectedAdjustment.impact * 0.8).toFixed(1)}%</li>
                  <li>毛利率变化: {selectedAdjustment.impact > 0 ? '提升' : '下降'} {Math.abs(selectedAdjustment.impact).toFixed(1)}%</li>
                  <li>建议关注竞争对手价格变化</li>
                  <li>建议在调价后监控销量变化</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 创建促销弹窗 */}
      <Modal
        title="创建促销活动"
        visible={createPromotionModalVisible}
        onCancel={() => setCreatePromotionModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item
            name="promotion_name"
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
          >
            <Input placeholder="例如：春节大促" />
          </Form.Item>

          <Form.Item
            name="promotion_type"
            label="促销类型"
            rules={[{ required: true, message: '请选择促销类型' }]}
          >
            <Select placeholder="选择促销类型">
              <Select.Option value="discount">折扣</Select.Option>
              <Select.Option value="bundle">买赠</Select.Option>
              <Select.Option value="gift">满减</Select.Option>
              <Select.Option value="special">特价</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date_range"
            label="活动时间"
            rules={[{ required: true, message: '请选择活动时间' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="budget"
            label="预算金额"
            rules={[{ required: true, message: '请输入预算金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              prefix="¥"
              placeholder="预计促销费用"
            />
          </Form.Item>

          <Form.Item
            name="cost_bearer"
            label="费用承担"
            rules={[{ required: true, message: '请选择费用承担方' }]}
          >
            <Select placeholder="选择费用承担方">
              <Select.Option value="supplier">供应商全额承担</Select.Option>
              <Select.Option value="shared">双方分摊</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="活动说明">
            <Input.TextArea rows={4} placeholder="请详细描述促销方案、目标、预期效果等" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setCreatePromotionModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                提交审核
              </Button>
            </Space>
          </Form.Item>
        </Form>
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

export default PriceManagement;
