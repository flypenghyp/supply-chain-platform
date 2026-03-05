import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Card, Row, Col, Tag, Statistic, Tooltip
} from 'antd';
import { CreditCardOutlined, DollarOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          id: '1',
          receivable_no: 'YS20260101',
          amount: 119300,
          payment_date: '2026-01-18',
          status: 'paid',
          payment_voucher: 'VOUCHER001'
        }
      ];
      setPayments(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: '应收账款编号',
      dataIndex: 'receivable_no',
      key: 'receivable_no',
      width: 140,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '收款金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => (
        <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ¥{amount?.toLocaleString()}
        </div>
      )
    },
    {
      title: '收款时间',
      dataIndex: 'payment_date',
      key: 'payment_date',
      width: 120,
      render: (date: string) => dayjs(date).format('MM-DD')
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'paid' ? 'green' : 'orange'}>
          {status === 'paid' ? '已收款' : '待收款'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="查看凭证">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card>
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="应收账款总额"
                value={filteredData.reduce((sum, item) => sum + (item.amount || 0), 0)}
                prefix="¥"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="已收款"
                value={filteredData.filter(item => item.status === 'paid').length}
                suffix="笔"
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
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
        />
      </Card>
    </div>
  );
};

export default Payments;
