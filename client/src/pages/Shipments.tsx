import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Drawer, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, List, Avatar, Descriptions, DatePicker, Upload,
  Steps, Progress, Alert, Typography, Tooltip, Tabs, Statistic
} from 'antd';
import {
  TruckOutlined, EyeOutlined, UploadOutlined, CheckCircleOutlined,
  ClockCircleOutlined, EnvironmentOutlined, PhoneOutlined,
  FileTextOutlined, CameraOutlined, CarOutlined, UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;

const Shipments: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [shipModalVisible, setShipModalVisible] = useState(false);
  const [trackModalVisible, setTrackModalVisible] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [form] = Form.useForm();

  // 模拟数据
  useEffect(() => {
    fetchShipments();
  }, [activeTab]);

  const fetchShipments = async () => {
    setLoading(true);
    setTimeout(() => {
      let mockData: any[] = [];

      switch (activeTab) {
        case 'pending':
          mockData = [
            {
              id: '1',
              order_no: 'PO20260118002',
              supplier_name: '蒙牛乳业有限公司',
              confirmed_date: '2026-01-18 14:30',
              promised_delivery_date: '2026-01-21',
              total_amount: 98000,
              items: [{ name: '蒙牛纯牛奶250ml', quantity: 200 }],
              warehouse: '上海中心仓',
              status: 'confirmed'
            }
          ];
          break;
        case 'in_transit':
          mockData = [
            {
              id: '2',
              shipment_no: 'SP20260119001',
              order_no: 'PO20260118003',
              supplier_name: '好利来食品有限公司',
              logistics_company: '顺丰速运',
              tracking_no: 'SF1234567890',
              shipment_date: '2026-01-19 09:00',
              estimated_arrival: '2026-01-20',
              status: 'in_transit',
              driver_name: '李师傅',
              driver_phone: '13800138001',
              vehicle_plate: '沪A12345',
              current_location: '江苏省南京市',
              progress: 60
            }
          ];
          break;
        case 'completed':
          mockData = [
            {
              id: '3',
              shipment_no: 'SP20260118001',
              order_no: 'PO20260118001',
              supplier_name: '农夫山泉股份有限公司',
              logistics_company: '京东物流',
              tracking_no: 'JD9876543210',
              shipment_date: '2026-01-18 15:30',
              actual_arrival: '2026-01-19 10:30',
              status: 'completed',
              receiver: '王经理',
              receiver_phone: '13900139001'
            }
          ];
          break;
      }

      setShipments(mockData);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      confirmed: 'orange',
      in_transit: 'blue',
      completed: 'green',
      rejected: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      confirmed: '待发货',
      in_transit: '运输中',
      completed: '已完成',
      rejected: '异常'
    };
    return texts[status] || status;
  };

  const handleShipOrder = (record: any) => {
    setSelectedShipment(record);
    setShipModalVisible(true);
  };

  const handleViewTracking = (record: any) => {
    setSelectedShipment(record);
    setTrackModalVisible(true);
  };

  const handleShipSubmit = async (values: any) => {
    try {
      // 验证批次信息和到期管控
      const hasInvalidBatch = values.batchInfo?.some((batch: any) => {
        const daysToExpiry = dayjs(batch.expiry_date).diff(dayjs(), 'day');
        return daysToExpiry <= batch.min_days_before_rejection;
      });

      if (hasInvalidBatch) {
        message.error('存在即将到期的批次，无法发货！请检查批次信息。');
        return;
      }

      // 模拟API调用
      message.success('送货预约单已提交');
      setShipModalVisible(false);
      fetchShipments();
    } catch (error) {
      message.error('提交失败');
    }
  };

  const getTrackingSteps = (shipment: any) => {
    const steps = [
      {
        title: '订单确认',
        description: '供应商已确认订单',
        status: 'finish' as const
      },
      {
        title: '准备发货',
        description: shipment.shipment_date ? `发货时间: ${shipment.shipment_date}` : '准备中',
        status: shipment.shipment_date ? 'finish' as const : 'process' as const
      },
      {
        title: '运输中',
        description: shipment.current_location ? `当前位置: ${shipment.current_location}` : '等待发运',
        status: shipment.status === 'in_transit' ? 'process' as const : shipment.shipment_date ? 'finish' as const : 'wait' as const
      },
      {
        title: '已签收',
        description: shipment.actual_arrival ? `签收时间: ${shipment.actual_arrival}` : '等待签收',
        status: shipment.status === 'completed' ? 'finish' as const : 'wait' as const
      }
    ];
    return steps;
  };

  const renderPendingColumns = () => [
    {
      title: '订单编号',
      dataIndex: 'order_no',
      key: 'order_no',
      width: 140,
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
      title: '商品信息',
      dataIndex: 'items',
      key: 'items',
      width: 150,
      render: (items: any[]) => (
        <div>
          {items.map((item, index) => (
            <div key={index} style={{ fontSize: '12px', marginBottom: '2px' }}>
              {item.name} × {item.quantity}
            </div>
          ))}
        </div>
      )
    },
    {
      title: '金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 100,
      render: (amount: number) => (
        <div style={{ fontWeight: 'bold', color: '#f5222d' }}>
          ¥{amount.toLocaleString()}
        </div>
      )
    },
    {
      title: '承诺发货',
      dataIndex: 'promised_delivery_date',
      key: 'promised_delivery_date',
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
        <Space>
          <Tooltip title="确认发货">
            <Button
              type="primary"
              icon={<TruckOutlined />}
              size="small"
              onClick={() => handleShipOrder(record)}
            >
              发货
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  const renderTransitColumns = () => [
    {
      title: '发货单号',
      dataIndex: 'shipment_no',
      key: 'shipment_no',
      width: 140,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '订单编号',
      dataIndex: 'order_no',
      key: 'order_no',
      width: 140
    },
    {
      title: '物流公司',
      dataIndex: 'logistics_company',
      key: 'logistics_company',
      width: 120
    },
    {
      title: '运单号',
      dataIndex: 'tracking_no',
      key: 'tracking_no',
      width: 140,
      render: (text: string) => (
        <div style={{ fontFamily: 'monospace' }}>{text}</div>
      )
    },
    {
      title: '发货时间',
      dataIndex: 'shipment_date',
      key: 'shipment_date',
      width: 120,
      render: (date: string) => dayjs(date).format('MM-DD HH:mm')
    },
    {
      title: '预计到达',
      dataIndex: 'estimated_arrival',
      key: 'estimated_arrival',
      width: 100,
      render: (date: string) => dayjs(date).format('MM-DD')
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 100,
      render: (progress: number) => (
        <div>
          <Progress percent={progress} size="small" />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {selectedShipment?.current_location}
          </div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="查看跟踪">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewTracking(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const renderCompletedColumns = () => [
    {
      title: '发货单号',
      dataIndex: 'shipment_no',
      key: 'shipment_no',
      width: 140,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '订单编号',
      dataIndex: 'order_no',
      key: 'order_no',
      width: 140
    },
    {
      title: '物流公司',
      dataIndex: 'logistics_company',
      key: 'logistics_company',
      width: 120
    },
    {
      title: '运单号',
      dataIndex: 'tracking_no',
      key: 'tracking_no',
      width: 140,
      render: (text: string) => (
        <div style={{ fontFamily: 'monospace' }}>{text}</div>
      )
    },
    {
      title: '发货时间',
      dataIndex: 'shipment_date',
      key: 'shipment_date',
      width: 120,
      render: (date: string) => dayjs(date).format('MM-DD HH:mm')
    },
    {
      title: '签收时间',
      dataIndex: 'actual_arrival',
      key: 'actual_arrival',
      width: 120,
      render: (date: string) => dayjs(date).format('MM-DD HH:mm')
    },
    {
      title: '签收人',
      dataIndex: 'receiver',
      key: 'receiver',
      width: 100,
      render: (receiver: string, record: any) => (
        <div>
          <div>{receiver}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.receiver_phone}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane
            tab={
              <span>
                <ClockCircleOutlined />
                待发货订单
                {activeTab === 'pending' && shipments.length > 0 && (
                  <Badge count={shipments.length} style={{ marginLeft: '8px' }} />
                )}
              </span>
            }
            key="pending"
          >
            <Table
              columns={renderPendingColumns()}
              dataSource={shipments}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <TruckOutlined />
                在途订单
              </span>
            }
            key="in_transit"
          >
            <Table
              columns={renderTransitColumns()}
              dataSource={shipments}
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
                <CheckCircleOutlined />
                已完成订单
              </span>
            }
            key="completed"
          >
            <Table
              columns={renderCompletedColumns()}
              dataSource={shipments}
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

      {/* 发货侧边栏 */}
      <Drawer
        title="确认发货"
        placement="right"
        onClose={() => setShipModalVisible(false)}
        open={shipModalVisible}
        width={720}
        style={{ maxWidth: '100vw' }}
        bodyStyle={{ padding: '24px' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
      >
        <Form onFinish={handleShipSubmit} layout="vertical">
          {selectedShipment && (
            <>
              <Alert
                message="订单发货信息"
                description={`订单 ${selectedShipment.order_no} - ${selectedShipment.supplier_name}`}
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
              />

              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="发货仓库">{selectedShipment.warehouse}</Descriptions.Item>
                <Descriptions.Item label="承诺到货">{selectedShipment.promised_delivery_date}</Descriptions.Item>
                <Descriptions.Item label="订单金额">¥{selectedShipment.total_amount.toLocaleString()}</Descriptions.Item>
              </Descriptions>

              <Divider>物流信息</Divider>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="logistics_company"
                    label="物流公司"
                    rules={[{ required: true, message: '请选择物流公司' }]}
                  >
                    <Select placeholder="选择物流公司">
                      <Select.Option value="顺丰速运">顺丰速运</Select.Option>
                      <Select.Option value="京东物流">京东物流</Select.Option>
                      <Select.Option value="中通快递">中通快递</Select.Option>
                      <Select.Option value="圆通速递">圆通速递</Select.Option>
                      <Select.Option value="韵达快递">韵达快递</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="tracking_no"
                    label="运单号"
                    rules={[{ required: true, message: '请输入运单号' }]}
                  >
                    <Input placeholder="请输入运单号" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="vehicle_plate" label="车牌号">
                    <Input placeholder="可选" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="driver_name" label="司机姓名">
                    <Input placeholder="可选" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="estimated_arrival_date"
                label="预计到货时间"
                rules={[{ required: true, message: '请选择预计到货时间' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>

              <Divider>商品批次信息</Divider>

              <Alert
                message="重要提示"
                description="请完整填写商品批次信息，未填写批次信息或批次即将到期的商品将无法发货。"
                type="warning"
                showIcon
                style={{ marginBottom: '16px' }}
              />

              <Form.List name="batchInfo">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        size="small"
                        style={{ marginBottom: '16px' }}
                        extra={
                          <Button
                            type="text"
                            danger
                            onClick={() => remove(name)}
                            icon={<CloseOutlined />}
                          />
                        }
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'product_name']}
                              label="商品名称"
                              rules={[{ required: true, message: '请选择商品' }]}
                            >
                              <Select placeholder="选择商品">
                                {selectedShipment?.items?.map((item: any, index: number) => (
                                  <Select.Option key={index} value={item.name}>
                                    {item.name}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'batch_no']}
                              label="生产批次号"
                              rules={[{ required: true, message: '请输入批次号' }]}
                            >
                              <Input placeholder="如：P20260118001" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'production_date']}
                              label="生产日期"
                              rules={[{ required: true, message: '请选择生产日期' }]}
                            >
                              <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'expiry_date']}
                              label="到期日期"
                              rules={[{ required: true, message: '请选择到期日期' }]}
                            >
                              <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'min_days_before_rejection']}
                              label="提前拒绝天数"
                              rules={[{ required: true, message: '请输入提前拒绝天数' }]}
                              initialValue={30}
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                min={1}
                                placeholder="如：30天"
                                addonAfter="天"
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'quantity']}
                              label="发货数量"
                              rules={[{ required: true, message: '请输入发货数量' }]}
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                min={1}
                                placeholder="件"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'storage_condition']}
                              label="存储条件"
                            >
                              <Select placeholder="选择存储条件">
                                <Select.Option value="常温">常温</Select.Option>
                                <Select.Option value="冷藏">冷藏</Select.Option>
                                <Select.Option value="冷冻">冷冻</Select.Option>
                                <Select.Option value="阴凉">阴凉</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>

                        <Divider>批次证件</Divider>

                        <Form.Item
                          {...restField}
                          name={[name, 'certificates']}
                          label="相关证件"
                          labelCol={{ span: 24 }}
                        >
                          <Upload
                            multiple
                            listType="picture-card"
                            maxCount={5}
                            accept=".jpg,.jpeg,.png,.pdf"
                          >
                            <div>
                              <FileTextOutlined />
                              <div style={{ marginTop: 8 }}>上传批次证件</div>
                            </div>
                          </Upload>
                        </Form.Item>

                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'quality_certificate_no']}
                              label="质检证书编号"
                            >
                              <Input placeholder="质检证书编号" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'health_certificate_no']}
                              label="卫生证书编号"
                            >
                              <Input placeholder="卫生证书编号" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item
                          {...restField}
                          name={[name, 'batch_notes']}
                          label="批次备注"
                          labelCol={{ span: 24 }}
                        >
                          <Input.TextArea rows={2} placeholder="批次特殊说明、注意事项等" />
                        </Form.Item>
                      </Card>
                    ))}

                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{ marginBottom: '16px' }}
                    >
                      添加商品批次
                    </Button>
                  </>
                )}
              </Form.List>

              <Form.Item name="photo" label="发货照片">
                <Upload
                  listType="picture-card"
                  maxCount={3}
                  accept="image/*"
                >
                  <div>
                    <CameraOutlined />
                    <div style={{ marginTop: 8 }}>上传发货照片</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item name="notes" label="发货备注">
                <Input.TextArea rows={3} placeholder="发货注意事项、特殊要求等" />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                  <Button onClick={() => setShipModalVisible(false)}>取消</Button>
                  <Button type="primary" htmlType="submit">
                    确认发货
                  </Button>
                </Space>
              </Form.Item>
            </>
          )}
        </Form>
      </Drawer>

      {/* 物流跟踪侧边栏 */}
      <Drawer
        title={`物流跟踪 - ${selectedShipment?.shipment_no}`}
        placement="right"
        onClose={() => setTrackModalVisible(false)}
        open={trackModalVisible}
        width={720}
        style={{ maxWidth: '100vw' }}
        bodyStyle={{ padding: '24px' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
      >
        {selectedShipment && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="发货单号">{selectedShipment.shipment_no}</Descriptions.Item>
              <Descriptions.Item label="订单编号">{selectedShipment.order_no}</Descriptions.Item>
              <Descriptions.Item label="物流公司">{selectedShipment.logistics_company}</Descriptions.Item>
              <Descriptions.Item label="运单号">{selectedShipment.tracking_no}</Descriptions.Item>
              <Descriptions.Item label="司机信息">
                {selectedShipment.driver_name} ({selectedShipment.driver_phone})
              </Descriptions.Item>
              <Descriptions.Item label="车牌号">{selectedShipment.vehicle_plate}</Descriptions.Item>
              <Descriptions.Item label="发货时间">{selectedShipment.shipment_date}</Descriptions.Item>
              <Descriptions.Item label="预计到达">{selectedShipment.estimated_arrival}</Descriptions.Item>
            </Descriptions>

            <Divider>物流进度</Divider>

            <Steps direction="vertical" current={getTrackingSteps(selectedShipment).findIndex(step => step.status === 'process')}>
              {getTrackingSteps(selectedShipment).map((step, index) => (
                <Step
                  key={index}
                  status={step.status}
                  title={step.title}
                  description={step.description}
                  icon={step.status === 'process' ? <TruckOutlined /> : undefined}
                />
              ))}
            </Steps>

            {selectedShipment.status === 'in_transit' && (
              <>
                <Divider>实时信息</Divider>
                <Row gutter={16}>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="运输进度"
                        value={selectedShipment.progress}
                        suffix="%"
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <EnvironmentOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>当前位置</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{selectedShipment.current_location}</div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Shipments;
