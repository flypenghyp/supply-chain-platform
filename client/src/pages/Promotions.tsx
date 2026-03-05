import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, DatePicker, InputNumber,
  Progress, Statistic, List, Avatar, Descriptions
} from 'antd';
import {
  GiftOutlined, PlusOutlined, EditOutlined, EyeOutlined, FileTextOutlined,
  CheckCircleOutlined, ClockCircleOutlined, RobotOutlined, BarChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [form] = Form.useForm();

  // 模拟数据
  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
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
      setPromotions(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'orange',
      active: 'green',
      completed: 'blue',
      rejected: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      pending: '待审核',
      active: '进行中',
      completed: '已完成',
      rejected: '已驳回'
    };
    return texts[status] || status;
  };

  const getTypeText = (type: string) => {
    const types: any = {
      discount: '折扣',
      bundle: '买赠',
      gift: '满减',
      special: '特价'
    };
    return types[type] || type;
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const handleCreatePromotion = () => {
    setCreateModalVisible(true);
  };

  const handleCreateSubmit = async (values: any) => {
    try {
      // 模拟API调用
      message.success('促销活动已提交审核');
      setCreateModalVisible(false);
      fetchPromotions();
    } catch (error) {
      message.error('提交失败');
    }
  };

  const columns = [
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
        <Tag color="blue">{getTypeText(type)}</Tag>
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
          <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
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
              onClick={() => handleViewDetail(record)}
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

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card style={{ marginBottom: '24px' }}>
        {/* 筛选条件和操作按钮 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={8} lg={4}>
            <Select placeholder="促销状态" style={{ width: '100%' }}>
              <Select.Option value="pending">待审核</Select.Option>
              <Select.Option value="active">进行中</Select.Option>
              <Select.Option value="completed">已完成</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select placeholder="促销类型" style={{ width: '100%' }}>
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

        {/* 统计概览 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="进行中活动"
                value={filteredData.filter(item => item.status === 'active').length}
                suffix="个"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="总预算"
                value={filteredData.reduce((sum, item) => sum + (item.budget || 0), 0)}
                prefix="¥"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="平均ROI"
                value={Math.round(filteredData.reduce((sum, item) => sum + (item.roi || 0), 0) / filteredData.length)}
                suffix="%"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="销量提升"
                value={Math.round(filteredData.reduce((sum, item) => sum + (item.sales_increase || 0), 0) / filteredData.length)}
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

      {/* 促销详情弹窗 */}
      <Modal
        title={`促销详情 - ${selectedRecord?.promotion_name}`}
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="促销编号">{selectedRecord.promotion_no}</Descriptions.Item>
              <Descriptions.Item label="活动名称">{selectedRecord.promotion_name}</Descriptions.Item>
              <Descriptions.Item label="促销类型">{getTypeText(selectedRecord.promotion_type)}</Descriptions.Item>
              <Descriptions.Item label="活动状态">
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {getStatusText(selectedRecord.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="活动时间">
                {dayjs(selectedRecord.start_date).format('YYYY-MM-DD')} 至 {dayjs(selectedRecord.end_date).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label="预算金额">¥{selectedRecord.budget?.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="费用承担">{selectedRecord.cost_bearer === 'supplier' ? '供应商全额' : '双方分摊'}</Descriptions.Item>
              <Descriptions.Item label="活动进度">
                <Progress percent={selectedRecord.progress} />
              </Descriptions.Item>
            </Descriptions>

            {/* 效果数据 */}
            <Divider>活动效果</Divider>
            <Row gutter={16}>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="销量提升"
                    value={selectedRecord.sales_increase}
                    suffix="%"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="ROI"
                    value={selectedRecord.roi}
                    suffix="%"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="完成度"
                    value={selectedRecord.progress}
                    suffix="%"
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="预算使用"
                    value={Math.round((selectedRecord.progress / 100) * selectedRecord.budget)}
                    prefix="¥"
                    suffix={`/¥${selectedRecord.budget}`}
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
                  <li>ROI表现优秀 ({selectedRecord.roi}%)，建议扩大活动规模</li>
                  <li>销量提升明显 ({selectedRecord.sales_increase}%)，活动策略有效</li>
                  <li>建议在活动后期加大宣传力度，提升转化率</li>
                  <li>预算控制良好，可考虑适当增加预算以扩大效果</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 创建促销弹窗 */}
      <Modal
        title="创建促销活动"
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form onFinish={handleCreateSubmit} layout="vertical">
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
              <Button onClick={() => setCreateModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                提交审核
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Promotions;
