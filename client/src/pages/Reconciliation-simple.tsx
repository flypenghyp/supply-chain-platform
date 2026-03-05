import React, { useEffect, useState } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col,
  Tag, Badge, Divider, Alert, Typography, Tooltip, Tabs, Descriptions, List,
  Avatar, Progress, Statistic, DatePicker, InputNumber, Checkbox
} from 'antd';
import {
  FileDoneOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined,
  EyeOutlined, FileTextOutlined, DollarOutlined, ExclamationCircleOutlined,
  RobotOutlined, CalculatorOutlined, SignatureOutlined, ThunderboltOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const Reconciliation: React.FC = () => {
  const [reconciliations, setReconciliations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // 模拟数据
  useEffect(() => {
    fetchReconciliations();
  }, []);

  const fetchReconciliations = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          id: '1',
          recon_no: 'RC20260101',
          period: '2026-01',
          purchase_amount: 125000,
          return_amount: -5000,
          promotion_fee: 2000,
          deduction_amount: -700,
          payable_amount: 119300,
          status: 'pending',
          created_at: '2026-02-01 10:00',
          items: [
            { type: '采购金额', amount: 125000, description: '1月采购商品总金额' },
            { type: '退货金额', amount: -5000, description: '质量问题退货扣款' },
            { type: '促销费用', amount: 2000, description: '春节促销费用分摊' },
            { type: '质量扣款', amount: -700, description: '质量问题赔偿' }
          ]
        },
        {
          id: '2',
          recon_no: 'RC20251201',
          period: '2025-12',
          purchase_amount: 98000,
          return_amount: 0,
          promotion_fee: 1500,
          deduction_amount: -500,
          payable_amount: 96000,
          status: 'confirmed',
          confirmed_at: '2026-01-15 14:30',
          items: [
            { type: '采购金额', amount: 98000, description: '12月采购商品总金额' },
            { type: '促销费用', amount: 1500, description: '元旦促销费用分摊' },
            { type: '交期扣款', amount: -500, description: '延期交货扣款' }
          ]
        },
        {
          id: '3',
          recon_no: 'RC20251101',
          period: '2025-11',
          purchase_amount: 102300,
          return_amount: -3200,
          promotion_fee: 0,
          deduction_amount: 0,
          payable_amount: 99100,
          status: 'settled',
          settled_at: '2026-01-01 09:00',
          items: [
            { type: '采购金额', amount: 102300, description: '11月采购商品总金额' },
            { type: '退货金额', amount: -3200, description: '临期商品退货' }
          ]
        }
      ];
      setReconciliations(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'confirmed': return 'green';
      case 'disputed': return 'red';
      case 'settled': return 'blue';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待确认';
      case 'confirmed': return '已确认';
      case 'disputed': return '有异议';
      case 'settled': return '已结算';
      default: return status;
    }
  };

  const columns = [
    {
      title: '对账单号',
      dataIndex: 'recon_no',
      key: 'recon_no',
      width: 140,
      render: (text: string) => (
        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
      )
    },
    {
      title: '对账期间',
      dataIndex: 'period',
      key: 'period',
      width: 100,
      render: (period: string) => <span>{period}月</span>
    },
    {
      title: '采购金额',
      dataIndex: 'purchase_amount',
      key: 'purchase_amount',
      width: 120,
      render: (amount: number) => `¥${amount?.toLocaleString()}`
    },
    {
      title: '退货金额',
      dataIndex: 'return_amount',
      key: 'return_amount',
      width: 120,
      render: (amount: number) => `¥${amount?.toLocaleString()}`
    },
    {
      title: '应付金额',
      dataIndex: 'payable_amount',
      key: 'payable_amount',
      width: 120,
      render: (amount: number) => (
        <div style={{ fontWeight: 'bold', color: '#f5222d', fontSize: '16px' }}>
          ¥{amount.toLocaleString()}
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
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (date: string) => dayjs(date).format('MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
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
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card>
        <Table
          columns={columns}
          dataSource={reconciliations}
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

      {/* 对账单详情弹窗 */}
      <Modal
        title={`对账单详情 - ${selectedRecord?.recon_no}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="对账单号">{selectedRecord.recon_no}</Descriptions.Item>
              <Descriptions.Item label="对账期间">{selectedRecord.period}月</Descriptions.Item>
              <Descriptions.Item label="对账状态">
                <Tag color={getStatusColor(selectedRecord.status)}>
                  {getStatusText(selectedRecord.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedRecord.created_at}</Descriptions.Item>
            </Descriptions>

            <Divider>费用明细</Divider>
            <List
              size="small"
              dataSource={selectedRecord.items}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{
                        backgroundColor: item.amount >= 0 ? '#52c41a' : '#f5222d'
                      }}>
                        {item.type === '采购金额' ? '购' :
                         item.type === '退货金额' ? '退' :
                         item.type === '促销费用' ? '促' :
                         item.type === '质量扣款' ? '质' : '扣'}
                      </Avatar>
                    }
                    title={item.type}
                    description={item.description}
                  />
                  <div style={{
                    fontWeight: 'bold',
                    color: item.amount >= 0 ? '#52c41a' : '#f5222d',
                    fontSize: '16px'
                  }}>
                    {item.amount >= 0 ? '+' : ''}¥{Math.abs(item.amount).toLocaleString()}
                  </div>
                </List.Item>
              )}
            />

            <Divider />
            <div style={{
              backgroundColor: '#f6ffed',
              padding: '16px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <Text strong style={{ fontSize: '16px' }}>应付账款总额</Text>
                <Text type="secondary" style={{ display: 'block' }}>包含所有费用项目</Text>
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#f5222d'
              }}>
                ¥{selectedRecord.payable_amount.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reconciliation;
