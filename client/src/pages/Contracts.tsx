import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, Upload, Descriptions,
  Statistic, List, Avatar, Progress, DatePicker
} from 'antd';
import {
  FileTextOutlined, PlusOutlined, EditOutlined, EyeOutlined, FileDoneOutlined,
  CheckCircleOutlined, CloseCircleOutlined, SignatureOutlined, DownloadOutlined,
  RobotOutlined, CalculatorOutlined, SafetyOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [esignModalVisible, setEsignModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          id: '1',
          contract_no: 'HT2026001',
          title: '农夫山泉饮用水供货合同',
          type: 'supply_contract',
          status: 'signed',
          sign_date: '2026-01-15',
          effective_date: '2026-01-15',
          expiry_date: '2027-01-14',
          amount: 5000000,
          supplier: '农夫山泉股份有限公司',
          retailer: 'XX零售有限公司',
          signed_by: '张三',
          signature_hash: 'abc123def456',
          created_at: '2026-01-10'
        },
        {
          id: '2',
          contract_no: 'HT2026002',
          title: '蒙牛乳制品战略合作协议',
          type: 'strategic_agreement',
          status: 'pending_sign',
          sign_date: null,
          effective_date: null,
          expiry_date: null,
          amount: 8000000,
          supplier: '蒙牛乳业有限公司',
          retailer: 'XX零售有限公司',
          signed_by: null,
          signature_hash: null,
          created_at: '2026-01-18'
        }
      ];
      setContracts(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    let filtered = [...contracts];

    if (newFilters.status) {
      filtered = filtered.filter(item => item.status === newFilters.status);
    }

    if (newFilters.type) {
      filtered = filtered.filter(item => item.type === newFilters.type);
    }

    if (newFilters.search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        item.contract_no.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      draft: 'gray',
      pending_sign: 'orange',
      signed: 'green',
      expired: 'red',
      terminated: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      draft: '草稿',
      pending_sign: '待签署',
      signed: '已签署',
      expired: '已过期',
      terminated: '已终止'
    };
    return texts[status] || status;
  };

  const getTypeText = (type: string) => {
    const texts: any = {
      supply_contract: '供货合同',
      strategic_agreement: '战略合作协议',
      quality_agreement: '质量保证协议',
      promotion_agreement: '促销合作协议'
    };
    return texts[type] || type;
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const handleEsign = (record: any) => {
    setSelectedRecord(record);
    setEsignModalVisible(true);
  };

  const handleEsignSubmit = async (values: any) => {
    try {
      // 模拟电子签名过程
      message.success('电子签名完成，合同已生效');
      setEsignModalVisible(false);
      fetchContracts();
    } catch (error) {
      message.error('签署失败');
    }
  };

  const columns = [
    {
      title: '合同编号',
      dataIndex: 'contract_no',
      key: 'contract_no',
      width: 140,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '合同标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string) => (
        <Tooltip title={text}>
          <div style={{
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {text}
          </div>
        </Tooltip>
      )
    },
    {
      title: '合同类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => (
        <Tag color="blue">{getTypeText(type)}</Tag>
      )
    },
    {
      title: '合同金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
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
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '生效日期',
      dataIndex: 'effective_date',
      key: 'effective_date',
      width: 100,
      render: (date: string) => date ? dayjs(date).format('MM-DD') : '-'
    },
    {
      title: '到期日期',
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      width: 100,
      render: (date: string) => {
        if (!date) return '-';
        const isExpiringSoon = dayjs(date).diff(dayjs(), 'day') <= 30;
        return (
          <div style={{ color: isExpiringSoon ? '#f5222d' : 'inherit' }}>
            {dayjs(date).format('MM-DD')}
            {isExpiringSoon && <ClockCircleOutlined style={{ marginLeft: '4px' }} />}
          </div>
        );
      }
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
          <Tooltip title="下载合同">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              size="small"
            />
          </Tooltip>
          {record.status === 'pending_sign' && (
            <Tooltip title="电子签名">
              <Button
                type="primary"
                icon={<SignatureOutlined />}
                size="small"
                onClick={() => handleEsign(record)}
              >
                签署
              </Button>
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
              placeholder="合同状态"
              style={{ width: '100%' }}
              allowClear
              value={filters.status}
              onChange={(value) => handleFilterChange({ ...filters, status: value })}
            >
              <Select.Option value="draft">草稿</Select.Option>
              <Select.Option value="pending_sign">待签署</Select.Option>
              <Select.Option value="signed">已签署</Select.Option>
              <Select.Option value="expired">已过期</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="合同类型"
              style={{ width: '100%' }}
              allowClear
              value={filters.type}
              onChange={(value) => handleFilterChange({ ...filters, type: value })}
            >
              <Select.Option value="supply_contract">供货合同</Select.Option>
              <Select.Option value="strategic_agreement">战略合作协议</Select.Option>
              <Select.Option value="quality_agreement">质量保证协议</Select.Option>
              <Select.Option value="promotion_agreement">促销合作协议</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Input
              placeholder="搜索合同"
              value={filters.search}
              onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
              prefix={<FileTextOutlined />}
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />}>新增合同</Button>
              <Button icon={<FileDoneOutlined />}>批量签署</Button>
            </Space>
          </Col>
        </Row>

        {/* 统计概览 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="总合同数"
                value={filteredData.length}
                suffix="份"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="待签署合同"
                value={filteredData.filter(item => item.status === 'pending_sign').length}
                suffix="份"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="已生效合同"
                value={filteredData.filter(item => item.status === 'signed').length}
                suffix="份"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="即将到期"
                value={filteredData.filter(item => {
                  if (!item.expiry_date) return false;
                  return dayjs(item.expiry_date).diff(dayjs(), 'day') <= 30;
                }).length}
                suffix="份"
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

      {/* 合同详情弹窗 */}
      <Modal
        title={`合同详情 - ${selectedRecord?.contract_no}`}
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="合同编号">{selectedRecord.contract_no}</Descriptions.Item>
              <Descriptions.Item label="合同标题">{selectedRecord.title}</Descriptions.Item>
              <Descriptions.Item label="合同类型">{getTypeText(selectedRecord.type)}</Descriptions.Item>
              <Descriptions.Item label="合同状态">
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {getStatusText(selectedRecord.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="供应商">{selectedRecord.supplier}</Descriptions.Item>
              <Descriptions.Item label="零售商">{selectedRecord.retailer}</Descriptions.Item>
              <Descriptions.Item label="合同金额">¥{selectedRecord.amount?.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="签订日期">{selectedRecord.sign_date || '-'}</Descriptions.Item>
              <Descriptions.Item label="生效日期">{selectedRecord.effective_date || '-'}</Descriptions.Item>
              <Descriptions.Item label="到期日期">{selectedRecord.expiry_date || '-'}</Descriptions.Item>
              {selectedRecord.signed_by && (
                <Descriptions.Item label="签署人">{selectedRecord.signed_by}</Descriptions.Item>
              )}
              {selectedRecord.signature_hash && (
                <Descriptions.Item label="签名哈希" span={2}>
                  <Text code>{selectedRecord.signature_hash}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 合同到期提醒 */}
            {selectedRecord.expiry_date && dayjs(selectedRecord.expiry_date).diff(dayjs(), 'day') <= 30 && (
              <Alert
                message="合同即将到期"
                description={`合同将于 ${dayjs(selectedRecord.expiry_date).format('YYYY-MM-DD')} 到期，请及时续签`}
                type="warning"
                showIcon
                style={{ marginBottom: '16px' }}
              />
            )}

            <Divider>合同条款摘要</Divider>
            <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: '6px' }}>
              <Title level={5}>主要条款</Title>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>供货周期：合同有效期内</li>
                <li>质量标准：符合国家相关标准</li>
                <li>付款方式：月结30天</li>
                <li>违约责任：按合同约定承担</li>
                <li>争议解决：协商不成提交仲裁</li>
              </ul>
            </div>

            {/* AI合规分析 */}
            <Divider>AI合规性分析</Divider>
            <div style={{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <RobotOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                <Text strong>合同合规评估</Text>
              </div>
              <div>
                <Text>基于合同内容分析：</Text>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>合同条款完整性: 95% ✅</li>
                  <li>法律合规性: 良好 ✅</li>
                  <li>风险控制: 完善 ✅</li>
                  <li>建议: 定期检查合同执行情况</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 电子签名弹窗 */}
      <Modal
        title="电子签名"
        visible={esignModalVisible}
        onCancel={() => setEsignModalVisible(false)}
        footer={null}
        width={600}
      >
        <Alert
          message="电子签名确认"
          description="请确认您已仔细阅读合同条款，签署后具有法律效力。"
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        {selectedRecord && (
          <Form onFinish={handleEsignSubmit} layout="vertical">
            <Descriptions bordered size="small" column={1} style={{ marginBottom: '16px' }}>
              <Descriptions.Item label="合同编号">{selectedRecord.contract_no}</Descriptions.Item>
              <Descriptions.Item label="合同标题">{selectedRecord.title}</Descriptions.Item>
              <Descriptions.Item label="合同金额">¥{selectedRecord.amount?.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="签署日期">{dayjs().format('YYYY-MM-DD')}</Descriptions.Item>
            </Descriptions>

            <Form.Item
              name="verification_code"
              label="短信验证码"
              rules={[{ required: true, message: '请输入短信验证码' }]}
            >
              <Input placeholder="请输入6位验证码" />
            </Form.Item>

            <Form.Item style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Button type="link">获取验证码</Button>
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[{ required: true, message: '请同意合同条款' }]}
            >
              <div>
                <input type="checkbox" id="agreement" />
                <label htmlFor="agreement" style={{ marginLeft: '8px' }}>
                  我已仔细阅读并同意《{selectedRecord.title}》的所有条款
                </label>
              </div>
            </Form.Item>

            <Divider />
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <SignatureOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <div style={{ marginTop: '8px' }}>
                <Text strong>点击"确认签署"完成电子签名</Text>
              </div>
            </div>

            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
              <Space>
                <Button onClick={() => setEsignModalVisible(false)}>取消</Button>
                <Button type="primary" htmlType="submit">
                  确认签署
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Contracts;
