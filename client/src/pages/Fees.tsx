import React, { useEffect, useState } from 'react';
import { Table, Card, Row, Col, Tag, Statistic } from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const Fees: React.FC = () => {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          id: '1',
          fee_no: 'FY20260101',
          fee_type: 'quality_penalty',
          amount: 700,
          status: 'confirmed',
          created_at: '2026-01-18'
        }
      ];
      setFees(mockData);
      setLoading(false);
    }, 1000);
  };

  const columns = [
    {
      title: '费用单号',
      dataIndex: 'fee_no',
      key: 'fee_no',
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '费用类型',
      dataIndex: 'fee_type',
      key: 'fee_type',
      render: (type: string) => {
        const types: any = {
          quality_penalty: '质量扣款',
          delay_penalty: '延期扣款',
          promotion_fee: '促销费用'
        };
        return <Tag color="red">{types[type] || type}</Tag>;
      }
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
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
      render: (status: string) => (
        <Tag color={status === 'confirmed' ? 'green' : 'orange'}>
          {status === 'confirmed' ? '已确认' : '待确认'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('MM-DD')
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card>
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={4}>
            <Card size="small">
              <Statistic
                title="费用总额"
                value={fees.reduce((sum, item) => sum + (item.amount || 0), 0)}
                prefix="¥"
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={fees}
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

export default Fees;
