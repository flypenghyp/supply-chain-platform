import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, Upload, Descriptions,
  Statistic, List, Avatar, Progress, DatePicker, Checkbox, Result
} from 'antd';
import {
  FileTextOutlined, PlusOutlined, EditOutlined, EyeOutlined, FileDoneOutlined,
  CheckCircleOutlined, CloseCircleOutlined, SignatureOutlined, DownloadOutlined,
  RobotOutlined, CalculatorOutlined, SafetyOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { ESIGN_CONFIG } from '../config/esign';
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter';

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
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [contractSigning, setContractSigning] = useState(false);

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
    signing: '签署中',
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
        <AdvancedSearchFilter
          fields={[
            { key: 'status', label: '合同状态', type: 'select', placeholder: '请选择合同状态',
              options: [
                { label: '草稿', value: 'draft' },
                { label: '待签署', value: 'pending_sign' },
                { label: '已签署', value: 'signed' },
                { label: '已过期', value: 'expired' }
              ]
            },
            { key: 'type', label: '合同类型', type: 'select', placeholder: '请选择合同类型',
              options: [
                { label: '供货合同', value: 'supply_contract' },
                { label: '战略合作协议', value: 'strategic_agreement' },
                { label: '质量保证协议', value: 'quality_agreement' },
                { label: '促销合作协议', value: 'promotion_agreement' }
              ]
            },
            { key: 'search', label: '搜索合同', type: 'input', placeholder: '请输入合同名称或编号' }
          ]}
          values={filters}
          onChange={(k, v) => handleFilterChange({ ...filters, [k]: v })}
          onSearch={() => handleFilterChange(filters)}
          onReset={() => handleFilterChange({ status: '', type: '', search: '' })}
          extraActions={
            <Space>
              <Button type="primary" style={{ height: 32 }}>新增合同</Button>
              <Button style={{ height: 32 }}>批量签署</Button>
            </Space>
          }
        />

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
              {selectedRecord.status === 'signed' && (
                <Descriptions.Item label="签署文件" span={2}>
                  <Space>
                    <Tag color="green">已签署</Tag>
                    <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => {
                      window.open(`${ESIGN_CONFIG.FILE_VIEW_URL}?contract_id=${selectedRecord?.id}`, '_blank');
                    }}>
                      查看已签文件
                    </Button>
                    <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => message.success('下载成功')}>
                      下载
                    </Button>
                  </Space>
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
        title={`合同签署 - ${selectedRecord?.title || ''}`}
        visible={esignModalVisible}
        onCancel={() => { setEsignModalVisible(false); setAgreementAccepted(false); }}
        width={700}
        footer={null}
      >
        <Alert
          message="合同电子签署"
          description="将跳转到电签平台进行合同在线签署。签署完成后合同即生效。"
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Descriptions column={2} size="small" bordered style={{ marginBottom: '20px' }}>
          <Descriptions.Item label="合同编号">{selectedRecord?.contract_no}</Descriptions.Item>
          <Descriptions.Item label="合同名称">{selectedRecord?.title}</Descriptions.Item>
          <Descriptions.Item label="合同金额">¥{selectedRecord?.amount?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="签署日期">{dayjs().format('YYYY-MM-DD')}</Descriptions.Item>
          <Descriptions.Item label="甲方" span={2}>天虹数科商业股份有限公司</Descriptions.Item>
          <Descriptions.Item label="乙方" span={2}>供应商</Descriptions.Item>
        </Descriptions>

        <Checkbox
          checked={agreementAccepted}
          onChange={(e) => setAgreementAccepted(e.target.checked)}
        >
          我已阅读并同意《电子签名服务协议》及本合同全部条款，确认签署后合同即生效
        </Checkbox>

        <div style={{ textAlign: 'right', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
          <Space>
            <Button onClick={() => { setEsignModalVisible(false); setAgreementAccepted(false); }}>取消</Button>
            <Button
              type="primary"
              icon={<SignatureOutlined />}
              disabled={!agreementAccepted}
              loading={contractSigning}
              onClick={() => {
                window.open(`${ESIGN_CONFIG.PLATFORM_URL}?type=contract_sign&contract_id=${selectedRecord?.id}`, '_blank');
                message.success('已跳转到电签平台，签署完成后请返回确认');
                setContractSigning(true);

                setTimeout(() => {
                  const updatedContracts = contracts.map(c =>
                    c.id === selectedRecord?.id
                      ? { ...c, status: 'signed' as any, signed_by: '当前用户', signature_hash: `SIGN-${Date.now()}`, signed_at: dayjs().format('YYYY-MM-DD HH:mm:ss') }
                      : c
                  );
                  setContracts(updatedContracts);
                  setEsignModalVisible(false);
                  setContractSigning(false);
                  setAgreementAccepted(false);
                  message.success('合同签署成功');
                }, 2000);
              }}
            >
              前往电签平台签署
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default Contracts;
