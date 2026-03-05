import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Drawer, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, DatePicker, Upload,
  Steps, Progress, Statistic, List, Avatar, Descriptions, Radio, Modal
} from 'antd';
import {
  SafetyOutlined, PlusOutlined, EditOutlined, EyeOutlined, FileTextOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined,
  RobotOutlined, CalculatorOutlined, SignatureOutlined, CameraOutlined,
  DollarOutlined, WarningOutlined, FileProtectOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { ViolationNotice, ViolationItem } from '../types/violation-notice';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const Quality: React.FC = () => {
  const [notices, setNotices] = useState<ViolationNotice[]>([]);
  const [filteredData, setFilteredData] = useState<ViolationNotice[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [handleModalVisible, setHandleModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ViolationNotice | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { confirm } = Modal;

  // 模拟数据
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData: ViolationNotice[] = [
        {
          id: '1',
          supplierCode: '600583',
          supplierName: '深圳市礼悦食品有限公司',
          occurrenceDate: '2025-05-09',
          orgName: '天虹sp@ce新安优城店',
          inspectionType: 'Internal',
          violationRegulation: '食品安全法',
          violationContent: '生产批次20250401-01,商品外包装标签粘不牢、易脱落,条码错误',
          handlingAction: '撤柜退货',
          problemScope: 'Batch',
          problemType: '商品标识不合格-标识',
          severity: 'High',
          penaltyPoints: 3,
          items: [
            {
              storeCode: '60014',
              storeName: 'sp@ce新安优城店',
              barcode: '6942536578049',
              productName: '天口味迷你虎皮瑞士卷蛋糕'
            },
            {
              storeCode: '60015',
              storeName: 'sp@ce西乡店',
              barcode: '6942536578049',
              productName: '天口味迷你虎皮瑞士卷蛋糕'
            }
          ],
          supplierAnalysis: '标签印刷工艺问题，胶水质量不稳定',
          rectificationMeasures: '更换标签供应商，加强进厂检验',
          supplierRepName: '赖宇翔',
          supplierRepPhone: '13534131731',
          auditOpinion: '违反食品安全法相关规定，处以违约金处罚',
          penaltyAmount: 10000
        },
        {
          id: '2',
          supplierCode: '600584',
          supplierName: '东莞美食品有限公司',
          occurrenceDate: '2025-05-10',
          orgName: '天虹sp@ce宝安店',
          inspectionType: 'External',
          violationRegulation: '食品安全法',
          violationContent: '生产批次20250415-03,保质期标注错误',
          handlingAction: '自查自纠',
          problemScope: 'Individual',
          problemType: '商品标识不合格-保质期',
          severity: 'General',
          penaltyPoints: 1,
          items: [
            {
              storeCode: '60016',
              storeName: 'sp@ce宝安店',
              barcode: '6942536578050',
              productName: '美式巧克力曲奇'
            }
          ],
          supplierAnalysis: '标签模板更新不及时',
          rectificationMeasures: '完善标签管理制度',
          supplierRepName: '张三',
          supplierRepPhone: '13800138000',
          auditOpinion: '问题较轻，要求整改',
          penaltyAmount: 0
        }
      ];
      setNotices(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    const colors: any = {
      'Low': 'blue',
      'General': 'orange',
      'High': 'red'
    };
    return colors[severity] || 'default';
  };

  const getSeverityText = (severity: string) => {
    const texts: any = {
      'Low': '低',
      'General': '一般',
      'High': '高'
    };
    return texts[severity] || severity;
  };

  const getProblemScopeText = (scope: string) => {
    const texts: any = {
      'Batch': '批量',
      'Individual': '个别'
    };
    return texts[scope] || scope;
  };

  const getInspectionTypeText = (type: string) => {
    const texts: any = {
      'Internal': '内部检查',
      'External': '外部检查'
    };
    return texts[type] || type;
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const handleProcessIssue = (record: any) => {
    setSelectedRecord(record);
    setHandleModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      // 模拟API调用
      message.success('违约通知单处理完成');
      setHandleModalVisible(false);
      fetchNotices();
    } catch (error) {
      message.error('处理失败');
    }
  };

  const handleConfirm = (values: any) => {
    confirm({
      title: '确认处理结果',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p><strong>通知单号：</strong>VN{selectedRecord?.id?.padStart(6, '0')}</p>
          <p><strong>违约金：</strong><span style={{ color: '#f5222d', fontSize: '18px', fontWeight: 'bold' }}> ¥{values.penaltyAmount?.toLocaleString()}</span></p>
          <p><strong>违约扣分：</strong><span style={{ color: '#f5222d', fontSize: '18px', fontWeight: 'bold' }}> {selectedRecord?.penaltyPoints} 分</span></p>
          <Divider style={{ margin: '12px 0' }} />
          <p style={{ color: '#faad14' }}>
            <ExclamationCircleOutlined /> 请确认以上信息无误，确认后将无法修改！
          </p>
        </div>
      ),
      okText: '确认并签字',
      okType: 'danger',
      cancelText: '再看看',
      width: 480,
      onOk() {
        // 显示签字确认对话框
        setConfirmModalVisible(true);
      },
      onCancel() {
        console.log('取消确认');
      },
    });
  };

  const columns = [
    {
      title: '通知单号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {text ? `VN${text.padStart(6, '0')}` : '-'}
        </div>
      )
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 160,
      render: (text: string, record: ViolationNotice) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>编码: {record.supplierCode}</div>
        </div>
      )
    },
    {
      title: '发生日期',
      dataIndex: 'occurrenceDate',
      key: 'occurrenceDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: '违反条例',
      dataIndex: 'violationRegulation',
      key: 'violationRegulation',
      width: 140
    },
    {
      title: '问题类型',
      dataIndex: 'problemType',
      key: 'problemType',
      width: 160,
      render: (type: string) => (
        <Tag color="red">{type}</Tag>
      )
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => (
        <Tag color={getSeverityColor(severity)}>
          {severity === 'High' && <ExclamationCircleOutlined style={{ marginRight: '4px' }} />}
          {getSeverityText(severity)}
        </Tag>
      )
    },
    {
      title: '违约金',
      dataIndex: 'penaltyAmount',
      key: 'penaltyAmount',
      width: 100,
      render: (amount: number) => (
        <div style={{ textAlign: 'right', fontWeight: 'bold', color: amount > 0 ? '#f5222d' : '#52c41a' }}>
          {amount > 0 ? `¥${amount.toLocaleString()}` : '无'}
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_: any, record: ViolationNotice) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="处理">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              size="small"
              onClick={() => handleProcessIssue(record)}
            >
              处理
            </Button>
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
          <Col xs={24} sm={8} lg={4}>
            <Select placeholder="严重程度" style={{ width: '100%' }}>
              <Select.Option value="Low">低</Select.Option>
              <Select.Option value="General">一般</Select.Option>
              <Select.Option value="High">高</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select placeholder="检查类型" style={{ width: '100%' }}>
              <Select.Option value="Internal">内部检查</Select.Option>
              <Select.Option value="External">外部检查</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select placeholder="问题范围" style={{ width: '100%' }}>
              <Select.Option value="Batch">批量</Select.Option>
              <Select.Option value="Individual">个别</Select.Option>
            </Select>
          </Col>
        </Row>

        {/* 统计概览 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="违约通知单总数"
                value={filteredData.length}
                suffix="份"
                valueStyle={{ color: '#1890ff' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="高风险通知单"
                value={filteredData.filter(item => item.severity === 'High').length}
                suffix="份"
                valueStyle={{ color: '#f5222d' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="总违约金额"
                value={filteredData.reduce((sum, item) => sum + item.penaltyAmount, 0)}
                suffix="元"
                precision={2}
                valueStyle={{ color: '#faad14' }}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="涉及供应商数"
                value={new Set(filteredData.map(item => item.supplierCode)).size}
                suffix="家"
                valueStyle={{ color: '#52c41a' }}
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
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* 违约通知单详情侧边栏 */}
      <Drawer
        title={`违约通知单详情 - ${selectedRecord?.id ? `VN${selectedRecord.id.padStart(6, '0')}` : ''}`}
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
            {/* 头部基础信息 */}
            <Card size="small" title="基础信息" style={{ marginBottom: '16px' }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="供应商编码">{selectedRecord.supplierCode}</Descriptions.Item>
                <Descriptions.Item label="供应商名称">{selectedRecord.supplierName}</Descriptions.Item>
                <Descriptions.Item label="发生日期">{dayjs(selectedRecord.occurrenceDate).format('YYYY-MM-DD')}</Descriptions.Item>
                <Descriptions.Item label="组织架构">{selectedRecord.orgName}</Descriptions.Item>
                <Descriptions.Item label="检查类型">
                  <Tag color="blue">{getInspectionTypeText(selectedRecord.inspectionType)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="违反条例">
                  <Tag color="red">{selectedRecord.violationRegulation}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 违规详情 - 第一个红框重点 */}
            <Card size="small" title="违规详情" style={{ marginBottom: '16px', border: '2px solid #f5222d' }}>
              <Descriptions column={2} size="small" style={{ marginBottom: '16px' }}>
                <Descriptions.Item label="问题类型" span={2}>
                  <Tag color="red">{selectedRecord.problemType}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="严重程度" span={1}>
                  <Tag color={getSeverityColor(selectedRecord.severity)}>
                    {getSeverityText(selectedRecord.severity)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="问题范围">
                  <Tag color="orange">{getProblemScopeText(selectedRecord.problemScope)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="处理方式" span={1}>
                  <Text>{selectedRecord.handlingAction}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="违约扣分">
                  <Text strong style={{ color: '#f5222d' }}>{selectedRecord.penaltyPoints} 分</Text>
                </Descriptions.Item>
              </Descriptions>
              <div style={{ marginTop: '12px' }}>
                <Text strong>违规内容描述：</Text>
                <Paragraph style={{ marginTop: '8px', backgroundColor: '#fffbe6', padding: '12px', borderRadius: '4px' }}>
                  {selectedRecord.violationContent}
                </Paragraph>
              </div>
            </Card>

            {/* 关联商品列表 */}
            <Card size="small" title="关联商品列表" style={{ marginBottom: '16px' }}>
              <Table
                dataSource={selectedRecord.items}
                columns={[
                  {
                    title: '门店编码',
                    dataIndex: 'storeCode',
                    key: 'storeCode',
                    width: 120
                  },
                  {
                    title: '门店名称',
                    dataIndex: 'storeName',
                    key: 'storeName',
                    width: 200
                  },
                  {
                    title: '商品条码',
                    dataIndex: 'barcode',
                    key: 'barcode',
                    width: 140,
                    render: (text: string) => <Text code>{text}</Text>
                  },
                  {
                    title: '商品名称',
                    dataIndex: 'productName',
                    key: 'productName'
                  }
                ]}
                pagination={false}
                size="small"
                rowKey={(record, index) => index}
              />
            </Card>

            {/* 整改与反馈 */}
            <Card size="small" title="整改与反馈" style={{ marginBottom: '16px' }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="供应商原因分析">
                  <Paragraph>{selectedRecord.supplierAnalysis || '待供应商填写'}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="整改措施">
                  <Paragraph>{selectedRecord.rectificationMeasures || '待供应商填写'}</Paragraph>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 签署信息 - 第二个红框重点 */}
            <Card size="small" title="签署信息" style={{ marginBottom: '16px', border: '2px solid #52c41a' }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="供应商负责人" span={1}>
                  <Text strong>{selectedRecord.supplierRepName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="手机号码" span={1}>
                  <Text>{selectedRecord.supplierRepPhone}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* 审核结果 */}
            <Card size="small" title="审核结果" style={{ marginBottom: '16px' }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="审核意见">
                  <Paragraph>{selectedRecord.auditOpinion || '待审核'}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="违约金金额">
                  {selectedRecord.penaltyAmount > 0 ? (
                    <Text strong style={{ color: '#f5222d', fontSize: '18px' }}>
                      ¥{selectedRecord.penaltyAmount.toLocaleString()}
                    </Text>
                  ) : (
                    <Text style={{ color: '#52c41a' }}>无违约金</Text>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        )}
      </Drawer>

      {/* 处理违约通知单侧边栏 */}
      <Drawer
        title="处理违约通知单"
        placement="right"
        onClose={() => setHandleModalVisible(false)}
        open={handleModalVisible}
        width={720}
        style={{ maxWidth: '100vw' }}
        bodyStyle={{ padding: '24px' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
      >
        <Form onFinish={handleSubmit} layout="vertical">
          {selectedRecord && (
            <>
              {/* 单据关键信息 */}
              <Card size="small" title="单据关键信息" style={{ marginBottom: '16px', backgroundColor: '#f6ffed' }}>
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="通知单号" span={1}>
                    <Text strong style={{ color: '#1890ff' }}>
                      VN{selectedRecord.id?.padStart(6, '0')}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="发生日期" span={1}>
                    <Text>{dayjs(selectedRecord.occurrenceDate).format('YYYY-MM-DD')}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="供应商" span={2}>
                    <Text>{selectedRecord.supplierName} ({selectedRecord.supplierCode})</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="违反条例" span={1}>
                    <Tag color="red">{selectedRecord.violationRegulation}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="严重程度" span={1}>
                    <Tag color={getSeverityColor(selectedRecord.severity)}>
                      {getSeverityText(selectedRecord.severity)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="问题类型" span={2}>
                    <Tag color="orange">{selectedRecord.problemType}</Tag>
                  </Descriptions.Item>
                </Descriptions>
                
                <Divider orientation="left" style={{ margin: '12px 0' }}>违规内容</Divider>
                <Paragraph 
                  style={{ 
                    backgroundColor: '#fffbe6', 
                    padding: '12px', 
                    borderRadius: '4px',
                    marginBottom: '8px'
                  }}
                >
                  {selectedRecord.violationContent}
                </Paragraph>

                <Divider orientation="left" style={{ margin: '12px 0' }}>关联商品</Divider>
                <Table
                  dataSource={selectedRecord.items}
                  size="small"
                  pagination={false}
                  scroll={{ y: 100 }}
                  style={{ marginTop: '8px' }}
                  columns={[
                    {
                      title: '门店',
                      dataIndex: 'storeName',
                      key: 'storeName',
                      width: 180
                    },
                    {
                      title: '商品名称',
                      dataIndex: 'productName',
                      key: 'productName'
                    },
                    {
                      title: '条码',
                      dataIndex: 'barcode',
                      key: 'barcode',
                      width: 120,
                      render: (text: string) => <Text code style={{ fontSize: '12px' }}>{text}</Text>
                    }
                  ]}
                  rowKey={(record, index) => index}
                />
              </Card>

              <Card size="small" title="供应商整改反馈" style={{ marginBottom: '16px' }}>
                <Form.Item
                  name="supplierAnalysis"
                  label="原因分析"
                  rules={[{ required: true, message: '请填写原因分析' }]}
                >
                  <Input.TextArea rows={3} placeholder="请详细分析问题产生的原因" />
                </Form.Item>

                <Form.Item
                  name="rectificationMeasures"
                  label="整改措施"
                  rules={[{ required: true, message: '请填写整改措施' }]}
                >
                  <Input.TextArea rows={3} placeholder="请详细描述整改措施" />
                </Form.Item>

                <Form.Item
                  name="supplierRepName"
                  label="供应商负责人"
                  rules={[{ required: true, message: '请填写负责人姓名' }]}
                >
                  <Input placeholder="请输入负责人姓名" />
                </Form.Item>

                <Form.Item
                  name="supplierRepPhone"
                  label="手机号码"
                  rules={[
                    { required: true, message: '请填写手机号码' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                  ]}
                >
                  <Input placeholder="请输入手机号码" />
                </Form.Item>
              </Card>

              <Card size="small" title="审核意见" style={{ marginBottom: '16px' }}>
                <Form.Item
                  name="auditOpinion"
                  label="审核意见"
                  rules={[{ required: true, message: '请填写审核意见' }]}
                >
                  <Input.TextArea rows={3} placeholder="请填写审核意见，包括违约金金额等" />
                </Form.Item>

                <Form.Item
                  name="penaltyAmount"
                  label="违约金金额"
                  rules={[{ required: true, message: '请填写违约金金额' }]}
                >
                  <Input
                    type="number"
                    prefix="¥"
                    placeholder="请输入违约金金额"
                    min={0}
                  />
                </Form.Item>
              </Card>

              <Form.Item name="evidence" label="证据材料">
                <Upload
                  listType="picture-card"
                  maxCount={5}
                  accept="image/*,.pdf"
                >
                  <div>
                    <CameraOutlined />
                    <div style={{ marginTop: 8 }}>上传证据</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                  <Button onClick={() => setHandleModalVisible(false)}>取消</Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    onClick={handleConfirm}
                    icon={<CheckCircleOutlined />}
                  >
                    确认处理结果
                  </Button>
                </Space>
              </Form.Item>
            </>
          )}
        </Form>
      </Drawer>

      {/* 签字确认模态框 */}
      <Modal
        title="供应商确认签字"
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        onOk={() => {
          message.success('确认成功，违约通知单已生效！');
          setConfirmModalVisible(false);
          setHandleModalVisible(false);
          fetchNotices();
        }}
        okText="确认签字"
        cancelText="取消"
        width={500}
      >
        <Alert
          message="重要提示"
          description="您即将对以下违约处理结果进行签字确认，签字后表示您完全接受处理结果并承担相应责任。"
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
        
        <Descriptions column={1} size="small" bordered style={{ marginBottom: '24px' }}>
          <Descriptions.Item label="通知单号">
            VN{selectedRecord?.id?.padStart(6, '0')}
          </Descriptions.Item>
          <Descriptions.Item label="违约金金额">
            <span style={{ color: '#f5222d', fontSize: '18px', fontWeight: 'bold' }}>
              ¥{form.getFieldValue('penaltyAmount')?.toLocaleString() || 0}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="违约扣分">
            <span style={{ color: '#f5222d', fontSize: '18px', fontWeight: 'bold' }}>
              {selectedRecord?.penaltyPoints} 分
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="审核意见">
            {form.getFieldValue('auditOpinion')}
          </Descriptions.Item>
        </Descriptions>

        <Divider>签字确认</Divider>
        <div style={{ textAlign: 'center', padding: '24px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Text type="secondary">电子签名区域</Text>
          </div>
          <div style={{ 
            border: '2px dashed #d9d9d9', 
            borderRadius: '4px', 
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px'
          }}>
            <SignatureOutlined style={{ fontSize: '32px', marginRight: '8px' }} />
            点击此处签名
          </div>
          <div style={{ marginTop: '12px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              签字即表示您已阅读并同意以上处理结果
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Quality;
