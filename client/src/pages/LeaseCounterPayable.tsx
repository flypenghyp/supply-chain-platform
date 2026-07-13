import React, { useEffect, useState } from 'react';
import {
  Table, Card, Row, Col, Button, Space, Tag, Input, Select,
  Modal, message, Typography, Alert, Drawer, Descriptions, Divider
} from 'antd';
import {
  FileTextOutlined, ThunderboltOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter';

const { Title, Text } = Typography;
const { Option } = Select;

interface LeasePayableItem {
  id: string;
  payable_no: string;
  supplier_code: string;
  supplier_name: string;
  legal_person_code: string;
  shoppe_code: string;
  shoppe_name: string;
  accounting_period: string;
  document_date: string;
  total_amount: number;
  unpaid_amount: number;
  paid_amount: number;
  direction: 1 | 2; // 1-正数，2-负数
  status: 'pending' | 'confirmed' | 'settled' | 'invoiced' | 'completed';
  settlement_no?: string;
  invoice_status?: 'pending' | 'submitted' | 'verified';
  remark: string;
  transfer_date?: string;
  is_hidden?: boolean; // 是否被零售商隐藏
  created_at: string;
}

const LeaseCounterPayable: React.FC = () => {
  const [data, setData] = useState<LeasePayableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filters, setFilters] = useState({
    period: '',
    status: '',
    payable_no: '',
    shoppe_code: ''
  });
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<LeasePayableItem | null>(null);
  const [settlementInfo, setSettlementInfo] = useState<{
    settlementNo: string;
    accountingPeriod: string;
    totalAmount: number;
    itemCount: number;
    items: LeasePayableItem[];
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    // 模拟数据
    setTimeout(() => {
      const mockData: LeasePayableItem[] = [
        {
          id: '1',
          payable_no: 'ZG202603001',
          supplier_code: 'SUP002',
          supplier_name: '广州欧莱雅化妆品有限公司',
          legal_person_code: 'LP002',
          shoppe_code: 'SP001',
          shoppe_name: '一楼化妆品专柜',
          accounting_period: '202603',
          document_date: '2026-03-01',
          total_amount: 85600,
          unpaid_amount: 85600,
          paid_amount: 0,
          direction: 1,
          status: 'pending',
          remark: '2026 年 3 月专柜销售',
          is_hidden: false,
          created_at: '2026-03-01 10:00'
        },
        {
          id: '2',
          payable_no: 'ZG202603002',
          supplier_code: 'SUP002',
          supplier_name: '广州欧莱雅化妆品有限公司',
          legal_person_code: 'LP002',
          shoppe_code: 'SP001',
          shoppe_name: '一楼化妆品专柜',
          accounting_period: '202603',
          document_date: '2026-03-05',
          total_amount: -3000,
          unpaid_amount: -3000,
          paid_amount: 0,
          direction: 2, // 负数
          status: 'pending',
          remark: '顾客退货',
          is_hidden: false,
          created_at: '2026-03-05 14:30'
        },
        {
          id: '3',
          payable_no: 'ZG202603003',
          supplier_code: 'SUP002',
          supplier_name: '广州欧莱雅化妆品有限公司',
          legal_person_code: 'LP002',
          shoppe_code: 'SP002',
          shoppe_name: '二楼护肤品专柜',
          accounting_period: '202603',
          document_date: '2026-03-08',
          total_amount: 62000,
          unpaid_amount: 62000,
          paid_amount: 0,
          direction: 1,
          status: 'pending',
          remark: '2026 年 3 月专柜销售',
          is_hidden: false,
          created_at: '2026-03-08 09:00'
        },
        {
          id: '4',
          payable_no: 'ZG202602001',
          supplier_code: 'SUP002',
          supplier_name: '广州欧莱雅化妆品有限公司',
          legal_person_code: 'LP002',
          shoppe_code: 'SP001',
          shoppe_name: '一楼化妆品专柜',
          accounting_period: '202602',
          document_date: '2026-02-01',
          total_amount: 78000,
          unpaid_amount: 0,
          paid_amount: 78000,
          direction: 1,
          status: 'completed',
          settlement_no: 'ST202602002',
          invoice_status: 'verified',
          remark: '2026 年 2 月已结算',
          transfer_date: '2026-02-28',
          is_hidden: false,
          created_at: '2026-02-01 09:00'
        }
      ];
      // 过滤掉被隐藏的单据
      const visibleData = mockData.filter(item => !item.is_hidden);
      setData(visibleData);
      setLoading(false);
    }, 500);
  };

  // 负金额单据必勾逻辑
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      // 检查是否有负金额单据未被选中
      const negativeAmountItems = data.filter(item => item.total_amount < 0 && item.status === 'pending');
      const selectedNegativeKeys = negativeAmountItems
        .filter(item => newSelectedRowKeys.includes(item.id))
        .map(item => item.id);

      if (selectedNegativeKeys.length < negativeAmountItems.length) {
        message.warning('负金额单据必须勾选！');
        // 自动选中所有负金额单据
        const allPendingIds = data
          .filter(item => item.status === 'pending')
          .map(item => item.id);
        newSelectedRowKeys = [...new Set([...newSelectedRowKeys, ...allPendingIds])];
      }

      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: LeasePayableItem) => ({
      disabled: record.status !== 'pending',
      name: record.payable_no,
    }),
  };

  const handleGenerateSettlement = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一个单据');
      return;
    }

    const selectedItems = data.filter(item => selectedRowKeys.includes(item.id));
    const totalAmount = selectedItems.reduce((sum, item) => sum + item.total_amount, 0);

    // 检查是否包含负金额单据
    const hasNegativeAmount = selectedItems.some(item => item.total_amount < 0);
    if (!hasNegativeAmount) {
      Modal.warning({
        title: '提示',
        content: '根据规定，负金额单据必须参与结算，请确认是否还有未勾选的负金额单据？',
      });
    }

    // 生成结算单信息
    const settlementNo = `ST${new Date().getTime()}`;
    const settlementInfo = {
      settlementNo,
      accountingPeriod: selectedItems[0].accounting_period,
      totalAmount,
      itemCount: selectedItems.length,
      items: selectedItems
    };

    // 打开结算单详情抽屉
    setSettlementInfo(settlementInfo);
    setSelectedRowKeys([]);
  };

  const handleConfirmInvoice = () => {
    message.success('已确认并发起发票！');
    setInvoiceModalVisible(true);
    setSettlementInfo(null);
  };

  const columns: ColumnsType<LeasePayableItem> = [
    {
      title: '单据编号',
      dataIndex: 'payable_no',
      key: 'payable_no',
      width: 120,
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 140,
      ellipsis: true
    },
    {
      title: '专柜编码',
      dataIndex: 'shoppe_code',
      key: 'shoppe_code',
      width: 90
    },
    {
      title: '专柜名称',
      dataIndex: 'shoppe_name',
      key: 'shoppe_name',
      width: 120,
      ellipsis: true
    },
    {
      title: '会计期间',
      dataIndex: 'accounting_period',
      key: 'accounting_period',
      width: 90,
      render: (period: string) => period
    },
    {
      title: '单据日期',
      dataIndex: 'document_date',
      key: 'document_date',
      width: 100,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: '单据金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 110,
      align: 'right',
      render: (amount: number) => (
        <Text strong style={{ color: amount >= 0 ? '#1890ff' : '#f5222d' }}>
          ¥{amount.toLocaleString()}
        </Text>
      )
    },
    {
      title: '未付金额',
      dataIndex: 'unpaid_amount',
      key: 'unpaid_amount',
      width: 110,
      align: 'right',
      render: (amount: number) => `¥${amount.toLocaleString()}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => {
        const statusMap: any = {
          pending: { color: 'orange', text: '待确认' },
          confirmed: { color: 'blue', text: '已确认' },
          settled: { color: 'purple', text: '已结算' },
          invoiced: { color: 'cyan', text: '已开票' },
          completed: { color: 'green', text: '已完成' }
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '发票状态',
      dataIndex: 'invoice_status',
      key: 'invoice_status',
      width: 90,
      render: (status?: string) => {
        if (!status) return '-';
        const statusMap: any = {
          pending: { color: 'orange', text: '待提交' },
          submitted: { color: 'blue', text: '已提交' },
          verified: { color: 'green', text: '已核验' }
        };
        const config = statusMap[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '关联结算单',
      dataIndex: 'settlement_no',
      key: 'settlement_no',
      width: 120,
      render: (no?: string) => no || '-'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 120,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: LeasePayableItem) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => {
              setSelectedRecord(record);
              // 查看详情 - 暂时只记录日志
              console.log('查看详情:', record);
            }}
          >
            查看
          </Button>
          {record.status === 'confirmed' && !record.invoice_status && (
            <Button 
              type="link" 
              size="small"
              icon={<ThunderboltOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                setInvoiceModalVisible(true);
              }}
            >
              开票
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* 筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <AdvancedSearchFilter
          fields={[
            { key: 'payable_no', label: '单据编号', type: 'input', placeholder: '请输入单据编号' },
            { key: 'shoppe_code', label: '专柜编码', type: 'input', placeholder: '请输入专柜编码' },
            { key: 'period', label: '会计期间', type: 'input', placeholder: '例如：202603' },
            { key: 'status', label: '状态', type: 'select', placeholder: '请选择状态',
              options: [
                { label: '待确认', value: 'pending' },
                { label: '已确认', value: 'confirmed' },
                { label: '已结算', value: 'settled' },
                { label: '已完成', value: 'completed' }
              ]
            }
          ]}
          values={filters}
          onChange={(k, v) => setFilters({ ...filters, [k]: v })}
          onSearch={fetchData}
          onReset={() => setFilters({ period: '', status: '', payable_no: '', shoppe_code: '' })}
        />
      </Card>

      {/* 数据表格 */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <Space>
              <Button 
                type="primary" 
                icon={<ThunderboltOutlined />}
                onClick={handleGenerateSettlement}
                disabled={selectedRowKeys.length === 0}
              >
                生成结算单
              </Button>
            </Space>
          </div>
          <div>
            <Text type="secondary">
              已选择 {selectedRowKeys.length} 个单据
              {selectedRowKeys.length > 0 && (
                <Text strong style={{ marginLeft: 8 }}>
                  (负金额单据已强制勾选)
                </Text>
              )}
            </Text>
          </div>
        </div>
        <Alert
          message="业务规则提示"
          description="1. 按会计期间合并正负金额单据生成结算申请；2. 负金额单据为必勾项；3. 结算单生成后可选择是否立即开具发票；4. 数据来源于 ERP 系统自动同步"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true
          }}
        />
      </Card>

      {/* 发票提交模态框 */}
      <Modal
        title="发票提交"
        open={invoiceModalVisible}
        onCancel={() => setInvoiceModalVisible(false)}
        footer={null}
        width={800}
      >
        <Alert
          message="发票提交功能开发中..."
          description="该功能将跳转到发票管理页面进行发票上传和提交"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      </Modal>

      {/* 结算单详情抽屉 */}
      <Drawer
        title="结算单详情"
        placement="right"
        width={800}
        open={!!settlementInfo}
        onClose={() => setSettlementInfo(null)}
      >
        {settlementInfo && (
          <div>
            <Descriptions title="单头信息" bordered column={2} size="small">
              <Descriptions.Item label="结算单号">
                {settlementInfo.settlementNo}
              </Descriptions.Item>
              <Descriptions.Item label="会计期间">
                {settlementInfo.accountingPeriod}
              </Descriptions.Item>
              <Descriptions.Item label="合计金额">
                <Text strong style={{ color: '#1890ff' }}>
                  ¥{settlementInfo.totalAmount.toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="单据数量">
                {settlementInfo.itemCount} 张
              </Descriptions.Item>
            </Descriptions>

            <Divider>单据明细</Divider>

            <Table
              rowKey="id"
              columns={[
                {
                  title: '单据编号',
                  dataIndex: 'payable_no',
                  key: 'payable_no',
                  width: 120,
                  render: (text: string) => <Text strong>{text}</Text>
                },
                {
                  title: '单据日期',
                  dataIndex: 'document_date',
                  key: 'document_date',
                  width: 100,
                  render: (date: string) => dayjs(date).format('YYYY-MM-DD')
                },
                {
                  title: '单据金额',
                  dataIndex: 'total_amount',
                  key: 'total_amount',
                  width: 110,
                  align: 'right',
                  render: (amount: number) => (
                    <Text strong style={{ color: amount >= 0 ? '#1890ff' : '#f5222d' }}>
                      ¥{amount.toLocaleString()}
                    </Text>
                  )
                },
                {
                  title: '备注',
                  dataIndex: 'remark',
                  key: 'remark',
                  width: 150,
                  ellipsis: true
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 100,
                  fixed: 'right' as const,
                  render: (_: any, record: LeasePayableItem) => (
                    <Button
                      type="link"
                      size="small"
                      icon={<FileTextOutlined />}
                      onClick={() => {
                        setSelectedRecord(record);
                        setSettlementInfo(null);
                      }}
                    >
                      查看明细
                    </Button>
                  )
                }
              ]}
              dataSource={settlementInfo.items}
              pagination={{ pageSize: 10 }}
              scroll={{ y: 300 }}
            />

            <Divider />

            <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
              <Button
                type="primary"
                size="large"
                block
                icon={<ThunderboltOutlined />}
                onClick={handleConfirmInvoice}
              >
                确认并发起发票
              </Button>
              <Button
                size="large"
                block
                onClick={() => setSettlementInfo(null)}
              >
                关闭
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* 详情抽屉 */}
      <Drawer
        title="单据详情"
        placement="right"
        width={720}
        open={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      >
        {selectedRecord && (
          <div>
            <Descriptions title="基本信息" bordered column={2} size="small">
              <Descriptions.Item label="单据编号">
                {selectedRecord.payable_no}
              </Descriptions.Item>
              <Descriptions.Item label="供应商名称">
                {selectedRecord.supplier_name}
              </Descriptions.Item>
              <Descriptions.Item label="专柜编码">
                {selectedRecord.shoppe_code}
              </Descriptions.Item>
              <Descriptions.Item label="专柜名称">
                {selectedRecord.shoppe_name}
              </Descriptions.Item>
              <Descriptions.Item label="会计期间">
                {selectedRecord.accounting_period}
              </Descriptions.Item>
              <Descriptions.Item label="单据日期">
                {dayjs(selectedRecord.document_date).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label="单据金额">
                <Text strong style={{ color: selectedRecord.total_amount >= 0 ? '#1890ff' : '#f5222d' }}>
                  ¥{selectedRecord.total_amount.toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="未付金额">
                ¥{selectedRecord.unpaid_amount.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="已付金额">
                ¥{selectedRecord.paid_amount?.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {selectedRecord.status === 'pending' && <Tag color="orange">待确认</Tag>}
                {selectedRecord.status === 'confirmed' && <Tag color="blue">已确认</Tag>}
                {selectedRecord.status === 'settled' && <Tag color="purple">已结算</Tag>}
                {selectedRecord.status === 'invoiced' && <Tag color="cyan">已开票</Tag>}
                {selectedRecord.status === 'completed' && <Tag color="green">已完成</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="发票状态">
                {selectedRecord.invoice_status === 'pending' && <Tag color="orange">待提交</Tag>}
                {selectedRecord.invoice_status === 'submitted' && <Tag color="blue">已提交</Tag>}
                {selectedRecord.invoice_status === 'verified' && <Tag color="green">已核验</Tag>}
              </Descriptions.Item>
              {selectedRecord.settlement_no && (
                <Descriptions.Item label="关联结算单">
                  {selectedRecord.settlement_no}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="结转日期">
                {selectedRecord.transfer_date ? dayjs(selectedRecord.transfer_date).format('YYYY-MM-DD') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {selectedRecord.created_at}
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>
                {selectedRecord.remark}
              </Descriptions.Item>
            </Descriptions>
            
            {selectedRecord.status === 'confirmed' && !selectedRecord.invoice_status && (
              <div style={{ marginTop: 24 }}>
                <Alert
                  message="发票提示"
                  description="该单据已确认，请及时开具发票"
                  type="warning"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Button type="primary" block icon={<ThunderboltOutlined />} onClick={() => {
                  setInvoiceModalVisible(true);
                }}>
                  立即开票
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default LeaseCounterPayable;
