import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Drawer, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, Upload, Descriptions,
  Statistic, List, Avatar, Progress
} from 'antd';
import {
  ProductOutlined, PlusOutlined, EditOutlined, EyeOutlined, FileTextOutlined,
  CheckCircleOutlined, CameraOutlined, RobotOutlined, UploadOutlined,
  SafetyOutlined, BarcodeOutlined, ExperimentOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [newProductModalVisible, setNewProductModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          id: '1',
          product_code: 'P001',
          product_name: '农夫山泉550ml天然水',
          category: '饮用水',
          brand: '农夫山泉',
          specification: '550ml × 24瓶/箱',
          barcode: '6902083893347',
          status: 'active',
          created_at: '2026-01-15',
          certificates: ['生产许可证', '质检报告', '有机认证'],
          stock_level: 'normal',
          // 新增的详细商品信息
          origin: ['浙江省千岛湖', '江苏省太湖'], // 支持AI识别多产地
          ingredients: '饮用天然水',
          storage_method: '常温避光保存，避免阳光直射',
          shelf_life: '24个月',
          usage_method: '直接饮用，适合所有人群',
          // 生产商信息 - 支持多个生产商
          manufacturers: [
            {
              name: '农夫山泉股份有限公司',
              license: 'SC12345678901234',
              standard: 'GB/T 19298-2014'
            },
            {
              name: '农夫山泉湖北丹江口有限公司',
              license: 'SC12345678901235',
              standard: 'GB/T 19298-2014'
            }
          ],
          // 兼容旧数据格式
          manufacturer: '农夫山泉股份有限公司',
          standard_number: 'GB/T 19298-2014',
          license_number: 'SC12345678901234',
          nutritional_info: '矿物质含量：钙0.1mg/L，镁0.5mg/L，钠2.0mg/L',
          allergens: '无',
          contact_info: '400-885-1885'
        },
        {
          id: '2',
          product_code: 'P002',
          product_name: '蒙牛纯牛奶250ml',
          category: '乳制品',
          brand: '蒙牛',
          specification: '250ml × 12盒/箱',
          barcode: '6901028071181',
          status: 'pending_review',
          created_at: '2026-01-18',
          certificates: ['生产许可证'],
          stock_level: 'low'
        }
      ];
      setProducts(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    let filtered = [...products];

    if (newFilters.status) {
      filtered = filtered.filter(item => item.status === newFilters.status);
    }

    if (newFilters.category) {
      filtered = filtered.filter(item => item.category === newFilters.category);
    }

    if (newFilters.search) {
      filtered = filtered.filter(item =>
        item.product_name.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        item.product_code.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      active: 'green',
      pending_review: 'orange',
      rejected: 'red',
      inactive: 'gray'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      active: '已上架',
      pending_review: '待审核',
      rejected: '已驳回',
      inactive: '已下架'
    };
    return texts[status] || status;
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const handleNewProduct = () => {
    setNewProductModalVisible(true);
  };

  const handleAIRecognition = async (file: any) => {
    // 模拟AI识别过程
    message.loading('AI正在识别商品信息...', 2);
    setTimeout(() => {
      message.success('AI识别完成！已自动填充商品信息');
      // 这里可以设置识别结果到表单
    }, 2000);
  };

  const columns = [
    {
      title: '商品编码',
      dataIndex: 'product_code',
      key: 'product_code',
      width: 120,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
          <BarcodeOutlined style={{ marginRight: '4px' }} />
          {text}
        </div>
      )
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 200,
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.brand} | {record.specification}</div>
        </div>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
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
      title: '库存状态',
      dataIndex: 'stock_level',
      key: 'stock_level',
      width: 100,
      render: (level: string) => {
        const colors: any = {
          normal: 'green',
          low: 'orange',
          critical: 'red'
        };
        return (
          <Tag color={colors[level] || 'default'}>
            {level === 'normal' ? '正常' : level === 'low' ? '偏低' : '严重不足'}
          </Tag>
        );
      }
    },
    {
      title: '证书状态',
      dataIndex: 'certificates',
      key: 'certificates',
      width: 120,
      render: (certificates: string[]) => (
        <div>
          <Progress
            percent={Math.round((certificates.length / 5) * 100)}
            size="small"
            status={certificates.length >= 3 ? 'success' : 'normal'}
          />
          <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
            {certificates.length}/5 已齐全
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
          {record.status === 'pending_review' && (
            <Tooltip title="审核">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                size="small"
                style={{ color: '#52c41a' }}
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
        {/* 筛选条件 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="商品状态"
              style={{ width: '100%' }}
              allowClear
              value={filters.status}
              onChange={(value) => handleFilterChange({ ...filters, status: value })}
            >
              <Select.Option value="active">已上架</Select.Option>
              <Select.Option value="pending_review">待审核</Select.Option>
              <Select.Option value="inactive">已下架</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="商品分类"
              style={{ width: '100%' }}
              allowClear
              value={filters.category}
              onChange={(value) => handleFilterChange({ ...filters, category: value })}
            >
              <Select.Option value="饮用水">饮用水</Select.Option>
              <Select.Option value="乳制品">乳制品</Select.Option>
              <Select.Option value="烘焙食品">烘焙食品</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Input
              placeholder="搜索商品"
              value={filters.search}
              onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
              prefix={<ProductOutlined />}
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleNewProduct}>
                新品提报
              </Button>
              <Button icon={<FileTextOutlined />}>批量导入</Button>
            </Space>
          </Col>
        </Row>

        {/* 统计概览 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="总商品数"
                value={filteredData.length}
                suffix="个"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="待审核商品"
                value={filteredData.filter(item => item.status === 'pending_review').length}
                suffix="个"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="已上架商品"
                value={filteredData.filter(item => item.status === 'active').length}
                suffix="个"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="证书完整率"
                value={Math.round((filteredData.filter(item => item.certificates.length >= 3).length / filteredData.length) * 100)}
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

      {/* 商品详情侧边栏 */}
      <Drawer
        title={`商品详情 - ${selectedRecord?.product_name}`}
        placement="right"
        onClose={() => setDetailModalVisible(false)}
        open={detailModalVisible}
        width={720}
        style={{ maxWidth: '100vw' }}
        bodyStyle={{ padding: '24px' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
      >
        {selectedRecord && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="商品编码">{selectedRecord.product_code}</Descriptions.Item>
              <Descriptions.Item label="商品名称">{selectedRecord.product_name}</Descriptions.Item>
              <Descriptions.Item label="品牌">{selectedRecord.brand}</Descriptions.Item>
              <Descriptions.Item label="分类">{selectedRecord.category}</Descriptions.Item>
              <Descriptions.Item label="规格">{selectedRecord.specification}</Descriptions.Item>
              <Descriptions.Item label="条形码">{selectedRecord.barcode}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {getStatusText(selectedRecord.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedRecord.created_at}</Descriptions.Item>
            </Descriptions>

            <Divider>证书信息</Divider>
            <List
              size="small"
              dataSource={selectedRecord.certificates}
              renderItem={(certificate) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<SafetyOutlined style={{ color: '#52c41a' }} />}
                    title={certificate}
                    description="已验证，有效期至2028-12-31"
                  />
                  <Button size="small" type="link">查看证书</Button>
                </List.Item>
              )}
            />

            {selectedRecord.certificates.length < 5 && (
              <Alert
                message="证书不完整"
                description={`还缺少 ${5 - selectedRecord.certificates.length} 个证书，请尽快补充以确保商品合规上架`}
                type="warning"
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}

            <Divider>商品详细信息</Divider>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="产地" span={2}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedRecord.origin?.map((place: string, index: number) => (
                    <Tag key={index} color="cyan" icon={<RobotOutlined />}>
                      AI识别: {place}
                    </Tag>
                  )) || '暂无产地信息'}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="成分">{selectedRecord.ingredients || '暂无'}</Descriptions.Item>
              <Descriptions.Item label="保存方法">{selectedRecord.storage_method || '暂无'}</Descriptions.Item>
              <Descriptions.Item label="保质期">{selectedRecord.shelf_life || '暂无'}</Descriptions.Item>
              <Descriptions.Item label="使用方法">{selectedRecord.usage_method || '暂无'}</Descriptions.Item>
                  <Descriptions.Item label="生产商信息" span={2}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedRecord.manufacturers?.map((manufacturer: any, index: number) => (
                    <div key={index} style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                      <div><strong>生产商：</strong>{manufacturer.name}</div>
                      <div><strong>生产许可证：</strong>{manufacturer.license}</div>
                      <div><strong>产品执行标准：</strong>{manufacturer.standard}</div>
                    </div>
                  )) || (
                    <div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                      <div><strong>生产商：</strong>{selectedRecord.manufacturer || '暂无'}</div>
                      <div><strong>生产许可证：</strong>{selectedRecord.license_number || '暂无'}</div>
                      <div><strong>产品执行标准：</strong>{selectedRecord.standard_number || '暂无'}</div>
                    </div>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="营养信息" span={2}>{selectedRecord.nutritional_info || '暂无'}</Descriptions.Item>
              <Descriptions.Item label="过敏原">{selectedRecord.allergens || '暂无'}</Descriptions.Item>
              <Descriptions.Item label="联系方式">{selectedRecord.contact_info || '暂无'}</Descriptions.Item>
            </Descriptions>

            {/* AI分析建议 */}
            <Divider>AI智能分析</Divider>
            <div style={{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <RobotOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                <Text strong>商品合规性评估</Text>
              </div>
              <div>
                <Text>基于商品信息和证书分析：</Text>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>商品信息完整度: 95% ✅</li>
                  <li>证书合规性: {selectedRecord.certificates.length >= 3 ? '良好' : '需完善'} {selectedRecord.certificates.length >= 3 ? '✅' : '⚠️'}</li>
                  <li>建议: {selectedRecord.certificates.length >= 3 ? '可正常上架销售' : '请补充必要证书'}</li>
                  <li>风险提示: 请定期检查证书有效期</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* 新品提报侧边栏 */}
      <Drawer
        title="新品提报"
        placement="right"
        onClose={() => setNewProductModalVisible(false)}
        open={newProductModalVisible}
        width={720}
        style={{ maxWidth: '100vw' }}
        bodyStyle={{ padding: '24px' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
      >
        <Alert
          message="AI智能识别"
          description="上传商品照片，AI将自动识别商品信息并匹配所需证书，大大提升提报效率！"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Form layout="vertical">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="商品照片 (AI识别)">
                <Upload
                  listType="picture-card"
                  maxCount={5}
                  accept="image/*"
                  onChange={({ file }) => handleAIRecognition(file)}
                >
                  <div>
                    <CameraOutlined />
                    <div style={{ marginTop: 8 }}>上传照片</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>AI自动识别</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: '6px', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <RobotOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                  <Text strong>AI识别结果</Text>
                </div>
                <div>
                  <Text>识别状态: 待上传照片</Text>
                  <br />
                  <Text type="secondary">上传商品照片后，AI将自动识别商品名称、规格、条形码等信息</Text>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="product_name"
                label="商品名称"
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input placeholder="AI识别后自动填充" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="brand"
                label="品牌"
                rules={[{ required: true, message: '请输入品牌' }]}
              >
                <Input placeholder="AI识别后自动填充" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="category"
                label="商品分类"
                rules={[{ required: true, message: '请选择商品分类' }]}
              >
                <Select placeholder="选择分类">
                  <Select.Option value="饮用水">饮用水</Select.Option>
                  <Select.Option value="乳制品">乳制品</Select.Option>
                  <Select.Option value="烘焙食品">烘焙食品</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="specification"
                label="规格"
                rules={[{ required: true, message: '请输入规格' }]}
              >
                <Input placeholder="例如：550ml × 24瓶/箱" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="barcode"
                label="条形码"
                rules={[{ required: true, message: '请输入条形码' }]}
              >
                <Input placeholder="AI识别后自动填充" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>证书上传</Divider>
          <div style={{ backgroundColor: '#fff7e6', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <ExperimentOutlined style={{ color: '#faad14', marginRight: '8px' }} />
              <Text strong>AI智能匹配证书需求</Text>
            </div>
            <Text>基于商品分类，AI已为您匹配以下必备证书：</Text>
            <div style={{ marginTop: '8px' }}>
              <Tag color="red">生产许可证</Tag>
              <Tag color="orange">质检报告</Tag>
              <Tag color="blue">产品标签备案</Tag>
            </div>
          </div>

          <Form.Item label="上传证书">
            <Upload
              multiple
              listType="picture-card"
              accept=".pdf,.jpg,.png"
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>选择文件</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setNewProductModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                提交审核
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ProductManagement;
