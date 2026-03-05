import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, Progress, Statistic,
  Switch, InputNumber, DatePicker
} from 'antd';
import {
  BarChartOutlined, WarningOutlined, SettingOutlined, RobotOutlined,
  ExclamationCircleOutlined, CheckCircleOutlined, ClockCircleOutlined,
  ArrowUpOutlined, ArrowDownOutlined, LineChartOutlined, FilterOutlined
} from '@ant-design/icons';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [trendModalVisible, setTrendModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filters, setFilters] = useState({
    product: '',
    warehouse: '',
    status: ''
  });
  const [settings, setSettings] = useState({
    lowStockThreshold: 30,
    overstockThreshold: 80,
    notifications: true
  });

  // 模拟数据
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          id: '1',
          product_code: 'P001',
          product_name: '农夫山泉550ml',
          warehouse: '北京中心仓',
          current_stock: 5000,
          safety_stock: 3000,
          stock_days: 15,
          status: 'normal',
          unit: '箱',
          last_updated: '2026-01-18 14:30',
          trend: 'stable',
          turnover_rate: 85
        },
        {
          id: '2',
          product_code: 'P001',
          product_name: '农夫山泉550ml',
          warehouse: '上海中心仓',
          current_stock: 1500,
          safety_stock: 3000,
          stock_days: 5,
          status: 'low',
          unit: '箱',
          last_updated: '2026-01-18 14:30',
          trend: 'decreasing',
          turnover_rate: 92
        },
        {
          id: '3',
          product_code: 'P002',
          product_name: '蒙牛纯牛奶250ml',
          warehouse: '北京中心仓',
          current_stock: 8000,
          safety_stock: 2000,
          stock_days: 25,
          status: 'overstocked',
          unit: '箱',
          last_updated: '2026-01-18 14:30',
          trend: 'increasing',
          turnover_rate: 65
        }
      ];
      setInventory(mockData);
      setFilteredInventory(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    let filtered = [...inventory];

    if (newFilters.product) {
      filtered = filtered.filter(item =>
        item.product_name.toLowerCase().includes(newFilters.product.toLowerCase()) ||
        item.product_code.toLowerCase().includes(newFilters.product.toLowerCase())
      );
    }

    if (newFilters.warehouse) {
      filtered = filtered.filter(item => item.warehouse === newFilters.warehouse);
    }

    if (newFilters.status) {
      filtered = filtered.filter(item => item.status === newFilters.status);
    }

    setFilteredInventory(filtered);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      low: 'red',
      normal: 'green',
      overstocked: 'orange'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      low: '缺货预警',
      normal: '正常',
      overstocked: '积压预警'
    };
    return texts[status] || status;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <ArrowUpOutlined style={{ color: '#f5222d' }} />;
      case 'decreasing':
        return <ArrowDownOutlined style={{ color: '#52c41a' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
    }
  };

  const getAISuggestion = (item: any) => {
    if (item.status === 'low') {
      const suggestedQuantity = item.safety_stock - item.current_stock + Math.ceil(item.current_stock * 0.2);
      return {
        type: '补货建议',
        message: `建议补货 ${suggestedQuantity}${item.unit}，预计可满足7天销量`,
        action: '立即补货',
        priority: 'high'
      };
    } else if (item.status === 'overstocked') {
      return {
        type: '促销建议',
        message: `库存积压严重，建议制定促销策略，预计可消化${Math.ceil(item.current_stock * 0.3)}${item.unit}`,
        action: '制定促销',
        priority: 'medium'
      };
    } else {
      return {
        type: '库存正常',
        message: '库存水平正常，继续保持当前补货策略',
        action: '继续监控',
        priority: 'low'
      };
    }
  };

  const handleViewTrend = (record: any) => {
    setSelectedProduct(record);
    setTrendModalVisible(true);
  };

  const handleSettingsSubmit = async (values: any) => {
    try {
      setSettings(values);
      message.success('预警设置已保存');
      setSettingsModalVisible(false);
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 模拟趋势数据
  const getTrendData = (product: any) => {
    const days = 30;
    const data = [];
    let currentStock = product.current_stock;

    for (let i = days; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day').format('MM-DD');
      // 模拟库存变化趋势
      const change = Math.random() * 200 - 100; // -100 到 100 的随机变化
      currentStock = Math.max(0, currentStock + change);

      data.push({
        date,
        stock: Math.round(currentStock),
        safety: product.safety_stock
      });
    }

    return data;
  };

  const columns = [
    {
      title: '商品信息',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 200,
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            编码: {record.product_code} | 仓库: {record.warehouse}
          </div>
        </div>
      )
    },
    {
      title: '当前库存',
      dataIndex: 'current_stock',
      key: 'current_stock',
      width: 120,
      render: (stock: number, record: any) => (
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
            {stock.toLocaleString()} {record.unit}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            安全库存: {record.safety_stock} {record.unit}
          </div>
        </div>
      )
    },
    {
      title: '库存天数',
      dataIndex: 'stock_days',
      key: 'stock_days',
      width: 100,
      render: (days: number) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{days}天</div>
          <Progress
            percent={Math.min(100, (days / 30) * 100)}
            size="small"
            status={days < 7 ? 'exception' : days > 21 ? 'warning' : 'normal'}
            showInfo={false}
          />
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record: any) => (
        <div>
          <Tag color={getStatusColor(status)} style={{ marginBottom: '4px' }}>
            {status === 'low' && <WarningOutlined style={{ marginRight: '4px' }} />}
            {getStatusText(status)}
          </Tag>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#666' }}>
            {getTrendIcon(record.trend)}
            <span>周转率: {record.turnover_rate}%</span>
          </div>
        </div>
      )
    },
    {
      title: 'AI建议',
      dataIndex: 'ai_suggestion',
      key: 'ai_suggestion',
      width: 200,
      render: (_: any, record: any) => {
        const suggestion = getAISuggestion(record);
        return (
          <div>
            <Alert
              message={suggestion.message}
              type={suggestion.priority === 'high' ? 'error' : suggestion.priority === 'medium' ? 'warning' : 'info'}
              showIcon
              style={{ fontSize: '12px', padding: '8px' }}
            />
          </div>
        );
      }
    },
    {
      title: '最后更新',
      dataIndex: 'last_updated',
      key: 'last_updated',
      width: 120,
      render: (date: string) => dayjs(date).format('MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="查看趋势">
            <Button
              type="text"
              icon={<LineChartOutlined />}
              size="small"
              onClick={() => handleViewTrend(record)}
            />
          </Tooltip>
          <Tooltip title="设置预警">
            <Button
              type="text"
              icon={<SettingOutlined />}
              size="small"
              onClick={() => setSettingsModalVisible(true)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card style={{ marginBottom: '24px' }}>
        {/* 筛选条件 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={8} lg={6}>
            <Input
              placeholder="搜索商品名称/编码"
              value={filters.product}
              onChange={(e) => handleFilterChange({ ...filters, product: e.target.value })}
              prefix={<FilterOutlined />}
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="选择仓库"
              style={{ width: '100%' }}
              allowClear
              value={filters.warehouse}
              onChange={(value) => handleFilterChange({ ...filters, warehouse: value })}
            >
              <Select.Option value="北京中心仓">北京中心仓</Select.Option>
              <Select.Option value="上海中心仓">上海中心仓</Select.Option>
              <Select.Option value="广州中心仓">广州中心仓</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="库存状态"
              style={{ width: '100%' }}
              allowClear
              value={filters.status}
              onChange={(value) => handleFilterChange({ ...filters, status: value })}
            >
              <Select.Option value="low">缺货预警</Select.Option>
              <Select.Option value="normal">正常</Select.Option>
              <Select.Option value="overstocked">积压预警</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Space>
              <Button type="primary" icon={<BarChartOutlined />}>导出报表</Button>
              <Button icon={<SettingOutlined />} onClick={() => setSettingsModalVisible(true)}>
                预警设置
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 库存概览统计 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={8} lg={4}>
            <Card size="small">
              <Statistic
                title="总库存量"
                value={inventory.reduce((sum, item) => sum + item.current_stock, 0)}
                suffix="箱"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Card size="small">
              <Statistic
                title="缺货商品"
                value={inventory.filter(item => item.status === 'low').length}
                suffix="个"
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Card size="small">
              <Statistic
                title="积压商品"
                value={inventory.filter(item => item.status === 'overstocked').length}
                suffix="个"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Card size="small">
              <Statistic
                title="正常商品"
                value={inventory.filter(item => item.status === 'normal').length}
                suffix="个"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Card size="small">
              <Statistic
                title="平均周转率"
                value={Math.round(inventory.reduce((sum, item) => sum + item.turnover_rate, 0) / inventory.length)}
                suffix="%"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredInventory}
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

      {/* 预警设置弹窗 */}
      <Modal
        title="库存预警设置"
        visible={settingsModalVisible}
        onCancel={() => setSettingsModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form onFinish={handleSettingsSubmit} initialValues={settings} layout="vertical">
          <Form.Item
            name="lowStockThreshold"
            label="缺货预警阈值 (%)"
            rules={[{ required: true, message: '请输入缺货预警阈值' }]}
          >
            <InputNumber
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => value?.replace('%', '') || ''}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="overstockThreshold"
            label="积压预警阈值 (天)"
            rules={[{ required: true, message: '请输入积压预警阈值' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item name="notifications" label="启用通知" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setSettingsModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                保存设置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 库存趋势弹窗 */}
      <Modal
        title={`${selectedProduct?.product_name} - 库存趋势分析`}
        visible={trendModalVisible}
        onCancel={() => setTrendModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedProduct && (
          <div>
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="当前库存"
                    value={selectedProduct.current_stock}
                    suffix={selectedProduct.unit}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="安全库存"
                    value={selectedProduct.safety_stock}
                    suffix={selectedProduct.unit}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="周转率"
                    value={selectedProduct.turnover_rate}
                    suffix="%"
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card title="近30天库存变化趋势" size="small">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getTrendData(selectedProduct)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip formatter={(value, name) => [value, name === 'stock' ? '实际库存' : '安全库存']} />
                  <Area
                    type="monotone"
                    dataKey="stock"
                    stroke="#1890ff"
                    fill="#1890ff"
                    fillOpacity={0.3}
                    name="实际库存"
                  />
                  <Line
                    type="monotone"
                    dataKey="safety"
                    stroke="#52c41a"
                    strokeDasharray="5 5"
                    name="安全库存"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Divider />

            <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <RobotOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                <Text strong>AI分析建议</Text>
              </div>
              <div>
                <Text>基于近30天数据分析：</Text>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>库存波动幅度较大，建议优化补货策略</li>
                  <li>当前周转率为 {selectedProduct.turnover_rate}%，{selectedProduct.turnover_rate > 80 ? '周转良好' : '有待提升'}</li>
                  <li>建议安全库存调整为 {Math.round(selectedProduct.safety_stock * 1.1)} {selectedProduct.unit}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inventory;
