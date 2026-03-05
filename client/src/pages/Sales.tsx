import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Card, Row, Col, Select, DatePicker, Input,
  Statistic, Progress, Tag, Divider, Alert, Typography, Tooltip,
  Tabs, List, Avatar
} from 'antd';
import {
  BarChartOutlined, LineChartOutlined, PieChartOutlined, DownloadOutlined,
  RobotOutlined, ShoppingOutlined, TrophyOutlined, FireOutlined,
  ArrowUpOutlined, ArrowDownOutlined, MinusOutlined, FilterOutlined
} from '@ant-design/icons';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ScatterChart, Scatter
} from 'recharts';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const Sales: React.FC = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    dateRange: null,
    product: '',
    store: '',
    region: ''
  });

  // 模拟数据
  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          date: '2026-01-18',
          product_code: 'P001',
          product_name: '农夫山泉550ml',
          store: '北京万达店',
          region: '北京',
          quantity: 150,
          amount: 7500,
          unit_price: 50
        },
        {
          date: '2026-01-18',
          product_code: 'P002',
          product_name: '蒙牛纯牛奶250ml',
          store: '上海虹桥店',
          region: '上海',
          quantity: 200,
          amount: 10000,
          unit_price: 50
        },
        {
          date: '2026-01-17',
          product_code: 'P001',
          product_name: '农夫山泉550ml',
          store: '广州天河店',
          region: '广州',
          quantity: 180,
          amount: 9000,
          unit_price: 50
        },
        {
          date: '2026-01-17',
          product_code: 'P003',
          product_name: '好利来面包500g',
          store: '深圳福田店',
          region: '深圳',
          quantity: 120,
          amount: 6000,
          unit_price: 50
        }
      ];
      setSalesData(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    let filtered = [...salesData];

    if (newFilters.dateRange && newFilters.dateRange.length === 2) {
      const [startDate, endDate] = newFilters.dateRange;
      filtered = filtered.filter(item => {
        const itemDate = dayjs(item.date);
        return itemDate.isAfter(startDate.subtract(1, 'day')) && itemDate.isBefore(endDate.add(1, 'day'));
      });
    }

    if (newFilters.product) {
      filtered = filtered.filter(item =>
        item.product_name.toLowerCase().includes(newFilters.product.toLowerCase()) ||
        item.product_code.toLowerCase().includes(newFilters.product.toLowerCase())
      );
    }

    if (newFilters.store) {
      filtered = filtered.filter(item => item.store === newFilters.store);
    }

    if (newFilters.region) {
      filtered = filtered.filter(item => item.region === newFilters.region);
    }

    setFilteredData(filtered);
  };

  // 计算销售统计
  const getSalesStats = () => {
    const totalSales = filteredData.reduce((sum, item) => sum + item.amount, 0);
    const totalQuantity = filteredData.reduce((sum, item) => sum + item.quantity, 0);
    const avgPrice = totalSales / totalQuantity || 0;

    // 商品销量排行
    const productSales = filteredData.reduce((acc, item) => {
      if (!acc[item.product_name]) {
        acc[item.product_name] = { quantity: 0, amount: 0 };
      }
      acc[item.product_name].quantity += item.quantity;
      acc[item.product_name].amount += item.amount;
      return acc;
    }, {});

    const topProducts = Object.entries(productSales)
      .map(([name, data]: [string, any]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount);

    // 门店销量排行
    const storeSales = filteredData.reduce((acc, item) => {
      if (!acc[item.store]) {
        acc[item.store] = { quantity: 0, amount: 0 };
      }
      acc[item.store].quantity += item.quantity;
      acc[item.store].amount += item.amount;
      return acc;
    }, {});

    const topStores = Object.entries(storeSales)
      .map(([name, data]: [string, any]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalSales,
      totalQuantity,
      avgPrice,
      topProducts,
      topStores,
      recordCount: filteredData.length
    };
  };

  // 生成趋势图数据
  const getTrendData = () => {
    const dateMap = filteredData.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = { date: item.date, sales: 0, quantity: 0 };
      }
      acc[item.date].sales += item.amount;
      acc[item.date].quantity += item.quantity;
      return acc;
    }, {});

    return Object.values(dateMap).sort((a: any, b: any) => dayjs(a.date).diff(dayjs(b.date)));
  };

  // 生成饼图数据
  const getPieData = () => {
    const productMap = filteredData.reduce((acc, item) => {
      if (!acc[item.product_name]) {
        acc[item.product_name] = 0;
      }
      acc[item.product_name] += item.amount;
      return acc;
    }, {});

    return Object.entries(productMap).map(([name, value]) => ({ name, value }));
  };

  // 生成地区热力图数据
  const getRegionData = () => {
    const regionMap = filteredData.reduce((acc, item) => {
      if (!acc[item.region]) {
        acc[item.region] = 0;
      }
      acc[item.region] += item.amount;
      return acc;
    }, {});

    return Object.entries(regionMap).map(([region, sales]) => ({
      region,
      sales,
      intensity: Math.min(100, (sales as number) / 10000 * 100) // 模拟热力强度
    }));
  };

  // AI销售预测
  const getSalesPrediction = () => {
    const stats = getSalesStats();
    const trendData = getTrendData();

    if (trendData.length < 3) {
      return { prediction: '数据不足，无法预测', confidence: '低' };
    }

    // 简单的线性回归预测
    const recentData = trendData.slice(-7); // 最近7天数据
    const avgDailySales = recentData.reduce((sum: number, item: any) => sum + item.sales, 0) / recentData.length;

    // 计算增长趋势
    const growthRate = recentData.length > 1 ?
      (recentData[recentData.length - 1].sales - recentData[0].sales) / recentData[0].sales : 0;

    const prediction = avgDailySales * (1 + growthRate);
    const confidence = Math.abs(growthRate) < 0.1 ? '高' : Math.abs(growthRate) < 0.3 ? '中' : '低';

    return {
      prediction: Math.round(prediction),
      confidence,
      trend: growthRate > 0 ? '上升' : growthRate < 0 ? '下降' : '平稳',
      suggestion: growthRate > 0.1 ? '建议增加库存' : growthRate < -0.1 ? '建议促销活动' : '保持当前策略'
    };
  };

  const stats = getSalesStats();
  const trendData = getTrendData();
  const pieData = getPieData();
  const regionData = getRegionData();
  const prediction = getSalesPrediction();

  const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#13c2c2', '#722ed1'];

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (date: string) => dayjs(date).format('MM-DD')
    },
    {
      title: '商品',
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
      title: '门店',
      dataIndex: 'store',
      key: 'store',
      width: 120
    },
    {
      title: '地区',
      dataIndex: 'region',
      key: 'region',
      width: 80
    },
    {
      title: '销量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: (quantity: number) => (
        <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
          {quantity}
        </div>
      )
    },
    {
      title: '销售额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number) => (
        <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#f5222d' }}>
          ¥{amount.toLocaleString()}
        </div>
      )
    },
    {
      title: '均价',
      dataIndex: 'unit_price',
      key: 'unit_price',
      width: 80,
      render: (price: number) => (
        <div style={{ textAlign: 'right' }}>
          ¥{price}
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card style={{ marginBottom: '24px' }}>
        {/* 筛选条件 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={8} lg={6}>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              style={{ width: '100%' }}
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange({ ...filters, dateRange: dates })}
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Input
              placeholder="搜索商品"
              value={filters.product}
              onChange={(e) => handleFilterChange({ ...filters, product: e.target.value })}
              prefix={<FilterOutlined />}
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="选择门店"
              style={{ width: '100%' }}
              allowClear
              value={filters.store}
              onChange={(value) => handleFilterChange({ ...filters, store: value })}
            >
              <Select.Option value="北京万达店">北京万达店</Select.Option>
              <Select.Option value="上海虹桥店">上海虹桥店</Select.Option>
              <Select.Option value="广州天河店">广州天河店</Select.Option>
              <Select.Option value="深圳福田店">深圳福田店</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="选择地区"
              style={{ width: '100%' }}
              allowClear
              value={filters.region}
              onChange={(value) => handleFilterChange({ ...filters, region: value })}
            >
              <Select.Option value="北京">北京</Select.Option>
              <Select.Option value="上海">上海</Select.Option>
              <Select.Option value="广州">广州</Select.Option>
              <Select.Option value="深圳">深圳</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <Space>
              <Button type="primary" icon={<DownloadOutlined />}>导出报表</Button>
              <Button icon={<BarChartOutlined />}>生成图表</Button>
            </Space>
          </Col>
        </Row>

        {/* 销售概览统计 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="总销售额"
                value={stats.totalSales}
                prefix="¥"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="总销量"
                value={stats.totalQuantity}
                suffix="件"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="平均价格"
                value={Math.round(stats.avgPrice)}
                prefix="¥"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="销售记录"
                value={stats.recordCount}
                suffix="条"
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="商品种类"
                value={stats.topProducts.length}
                suffix="种"
                valueStyle={{ color: '#13c2c2' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'overview',
            label: '数据概览',
            children: (
              <Row gutter={[24, 24]}>
                {/* 销售趋势图 */}
                <Col xs={24} lg={12}>
                  <Card title="销售趋势" size="small">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip formatter={(value) => [`¥${value}`, '销售额']} />
                        <Area type="monotone" dataKey="sales" stroke="#1890ff" fill="#1890ff" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>

                {/* 商品销售占比 */}
                <Col xs={24} lg={12}>
                  <Card title="商品销售占比" size="small">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => `¥${value}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>

                {/* 商品销量排行 */}
                <Col xs={24} lg={12}>
                  <Card title={<><TrophyOutlined /> 商品销量排行</>} size="small">
                    <List
                      size="small"
                      dataSource={stats.topProducts.slice(0, 5)}
                      renderItem={(item: any, index) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar style={{
                                backgroundColor: index < 3 ? '#faad14' : '#d9d9d9',
                                color: index < 3 ? '#fff' : '#666'
                              }}>
                                {index + 1}
                              </Avatar>
                            }
                            title={item.name}
                            description={`销量: ${item.quantity}件 | 销售额: ¥${item.amount.toLocaleString()}`}
                          />
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>

                {/* 门店销售排行 */}
                <Col xs={24} lg={12}>
                  <Card title={<><ShoppingOutlined /> 门店销售排行</>} size="small">
                    <List
                      size="small"
                      dataSource={stats.topStores.slice(0, 5)}
                      renderItem={(item: any, index) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar style={{ backgroundColor: '#1890ff' }}>
                                {index + 1}
                              </Avatar>
                            }
                            title={item.name}
                            description={`销售额: ¥${item.amount.toLocaleString()}`}
                          />
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>
            )
          },
          {
            key: 'prediction',
            label: '销售预测',
            children: (
              <Card>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <Title level={3}>AI销售预测</Title>
                  <Text type="secondary">基于历史数据智能预测未来销量</Text>
                </div>

                <Row gutter={24} style={{ marginBottom: '24px' }}>
                  <Col xs={24} lg={8}>
                    <Card style={{ textAlign: 'center' }}>
                      <Statistic
                        title="明日预测销售额"
                        value={prediction.prediction}
                        prefix="¥"
                        valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                      />
                      <div style={{ marginTop: '16px' }}>
                        <Tag color={prediction.confidence === '高' ? 'green' : prediction.confidence === '中' ? 'orange' : 'red'}>
                          置信度{prediction.confidence}
                        </Tag>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Card style={{ textAlign: 'center' }}>
                      <Statistic
                        title="销售趋势"
                        value={prediction.trend}
                        valueStyle={{
                          color: prediction.trend === '上升' ? '#52c41a' :
                                 prediction.trend === '下降' ? '#f5222d' : '#faad14'
                        }}
                      />
                      <div style={{ marginTop: '16px' }}>
                        {prediction.trend === '上升' && <ArrowUpOutlined style={{ fontSize: '24px', color: '#52c41a' }} />}
                        {prediction.trend === '下降' && <ArrowDownOutlined style={{ fontSize: '24px', color: '#f5222d' }} />}
                        {prediction.trend === '平稳' && <MinusOutlined style={{ fontSize: '24px', color: '#faad14' }} />}
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Card style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: '16px' }}>
                        <RobotOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                      </div>
                      <Text strong>AI建议</Text>
                      <div style={{ marginTop: '8px' }}>
                        <Text>{prediction.suggestion}</Text>
                      </div>
                    </Card>
                  </Col>
                </Row>

                <Alert
                  message="预测说明"
                  description="基于最近7天的销售数据进行预测，结果仅供参考。实际销售会受到季节、促销、竞争等多因素影响。"
                  type="info"
                  showIcon
                />
              </Card>
            )
          },
          {
            key: 'detail',
            label: '详细数据',
            children: (
              <Card>
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  loading={loading}
                  rowKey={(record, index) => `${record.date}-${record.product_code}-${record.store}-${index}`}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                  }}
                  scroll={{ x: 800 }}
                />
              </Card>
            )
          }
        ]}
      />
    </div>
  );
};

export default Sales;
