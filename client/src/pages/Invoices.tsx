import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, DatePicker, Upload,
  Statistic, Descriptions, Progress
} from 'antd';
import {
  FileDoneOutlined, PlusOutlined, EditOutlined, EyeOutlined, FileTextOutlined,
  CheckCircleOutlined, DownloadOutlined, RobotOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          id: '1',
          invoice_no: 'FP20260118001',
          reconciliation_no: 'RC20260101',
          amount: 119300,
          tax_rate: 13,
          tax_amount: 15509,
          total_amount: 134809,
          status: 'pending',
          created_at: '2026-01-18 16:00',
          verified_at: null
        }
      ];
      setInvoices(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'orange',
      verified: 'green',
      rejected: 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      pending: '待验收',
      verified: '已验收',
      rejected: '已驳回'
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: '发票号码',
      dataIndex: 'invoice_no',
      key: 'invoice_no',
      width: 140,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '对应对账单',
      dataIndex: 'reconciliation_no',
      key: 'reconciliation_no',
      width: 140
    },
    {
      title: '发票金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 120,
      render: (amount: number) => (
        <div style={{ fontWeight: 'bold', color: '#f5222d' }}>
          ¥{amount?.toLocaleString()}
        </div>
      )
    },
    {
      title: '税率',
      dataIndex: 'tax_rate',
      key: 'tax_rate',
      width: 80,
      render: (rate: number) => `${rate}%`
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
      title: '开票时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (date: string) => dayjs(date).format('MM-DD HH:mm')
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
              onClick={() => {
                setSelectedRecord(record);
                setDetailModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="下载发票">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              size="small"
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card>
        {/* 筛选条件 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={8} lg={4}>
            <Select placeholder="发票状态" style={{ width: '100%' }}>
              <Select.Option value="pending">待验收</Select.Option>
              <Select.Option value="verified">已验收</Select.Option>
              <Select.Option value="rejected">已驳回</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Button type="primary" icon={<PlusOutlined />}>申请开票</Button>
          </Col>
        </Row>

        {/* 统计概览 */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="待验收发票"
                value={filteredData.filter(item => item.status === 'pending').length}
                suffix="张"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="本月开票"
                value={filteredData.length}
                suffix="张"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="开票金额"
                value={filteredData.reduce((sum, item) => sum + (item.total_amount || 0), 0)}
                prefix="¥"
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
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 发票详情弹窗 */}
      <Modal
        title={`发票详情 - ${selectedRecord?.invoice_no}`}
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="发票号码">{selectedRecord.invoice_no}</Descriptions.Item>
            <Descriptions.Item label="对应对账单">{selectedRecord.reconciliation_no}</Descriptions.Item>
            <Descriptions.Item label="发票金额">¥{selectedRecord.amount?.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="税率">{selectedRecord.tax_rate}%</Descriptions.Item>
            <Descriptions.Item label="税额">¥{selectedRecord.tax_amount?.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="价税合计" span={2}>
              <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                ¥{selectedRecord.total_amount?.toLocaleString()}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="开票时间">{selectedRecord.created_at}</Descriptions.Item>
            <Descriptions.Item label="验收状态">
              <Tag color={getStatusColor(selectedRecord.status)}>
                {getStatusText(selectedRecord.status)}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Invoices;
