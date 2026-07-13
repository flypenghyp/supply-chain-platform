import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Card,
  Descriptions,
  DatePicker,
  Input,
  Alert,
  Statistic,
  Row,
  Col,
  Checkbox,
  Button,
  Space,
  Typography,
  message,
  Result
} from 'antd';
import {
  ThunderboltOutlined,
  CalculatorOutlined,
  CheckCircleOutlined,
  SignatureOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import {
  calculateEarlySettlement,
  calculateBatchEarlySettlement,
  getDefaultExpectedPayDate,
  getDatePickerConstraints,
  formatCurrency,
  generateAgreementContent,
  generateBatchAgreementContent
} from '../utils/early-settlement-calc';
import type { EarlySettlementCalculation } from '../types/early-settlement';
import { ESIGN_CONFIG } from '../config/esign';

const { Title, Text } = Typography;

interface EarlySettlementModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  settlementData: {
    id: string;
    recon_no: string;
    supplier_name: string;
    payable_amount: number;
    period: string;
  };
  loading?: boolean;
  isBatch?: boolean;
  batchCount?: number;
}

const EarlySettlementModal: React.FC<EarlySettlementModalProps> = ({
  open,
  onCancel,
  onSubmit,
  settlementData,
  loading = false,
  isBatch = false,
  batchCount = 0
}) => {
  const [form] = Form.useForm();
  const [calculation, setCalculation] = useState<EarlySettlementCalculation | null>(null);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [agreementContent, setAgreementContent] = useState('');
  const [signFlowId, setSignFlowId] = useState<string>('');

  // 初始化
  useEffect(() => {
    if (open && settlementData && settlementData.id) {
      initializeForm();
      setSignFlowId('');
    }
  }, [open, settlementData]);

  const initializeForm = () => {
    const defaultDate = getDefaultExpectedPayDate();
    
    form.setFieldsValue({
      expectedPayDate: defaultDate,
      contactPerson: '张三', // 可以从用户信息获取
      contactPhone: '13800138000' // 可以从用户信息获取
    });
    
    // 初始计算
    handleCalculate(defaultDate);
    setAgreementAccepted(false);
  };

  const handleCalculate = (expectedPayDate: Dayjs) => {
    if (!expectedPayDate || !settlementData) return;

    try {
      let result;
      let content;
      
      if (isBatch && batchCount > 1) {
        // 批量计算
        // 解析多个结算单
        const settlementIds = settlementData.id.split(',');
        const settlements = settlementIds.map((id, index) => {
          const periods = settlementData.period.split(', ');
          return {
            recon_no: settlementData.recon_no.includes('个结算单') ? settlementData.recon_no : `结算单${index + 1}`,
            period: periods[index] || periods[0],
            payable_amount: settlementData.payable_amount / settlementIds.length
          };
        });
        
        result = calculateBatchEarlySettlement(settlements, expectedPayDate);
        
        // 生成批量协议内容
        content = generateBatchAgreementContent(
          settlementData.supplier_name,
          settlements,
          expectedPayDate.format('YYYY年MM月DD日'),
          result
        );
      } else {
        // 单个计算
        result = calculateEarlySettlement(
          settlementData.payable_amount,
          settlementData.period + '-01', // 原付款日
          expectedPayDate
        );
        
        // 生成单个协议内容
        content = generateAgreementContent(
          settlementData.supplier_name,
          settlementData.recon_no,
          settlementData.period + '-01',
          expectedPayDate.format('YYYY年MM月DD日'),
          result
        );
      }
      
      setCalculation(result);
      setAgreementContent(content);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '计算失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!agreementAccepted) {
        message.warning('请先阅读并同意提前结算补充协议');
        return;
      }
      
      if (!calculation) {
        message.error('费用计算失败，请检查输入');
        return;
      }

      // 检查是否已完成电签
      if (!signFlowId) {
        message.warning('请先完成协议电签');
        return;
      }

      const submitData = {
        ...values,
        settlementId: settlementData.id,
        calculation,
        agreementContent,
        agreementAccepted,
        signFlowId, // 电签流程ID
        signedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
      
      onSubmit(submitData);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const getDateConstraints = () => {
    return getDatePickerConstraints(settlementData.period + '-01');
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ThunderboltOutlined style={{ marginRight: '8px', fontSize: '20px', color: '#fa8c16' }} />
          <span>{isBatch ? `批量提前结算申请 (${batchCount}个结算单)` : '提前结算申请'}</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={900}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        {/* 关键信息卡片 */}
        <Card
          size="small"
          title={isBatch && batchCount > 1 ? `结算单信息（${batchCount}个）` : '结算单信息'}
          style={{ marginBottom: '16px', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}
        >
          {isBatch && batchCount > 1 ? (
            <>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="供应商">
                  <Text>{settlementData.supplier_name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="结算单数量">
                  <Text strong style={{ color: '#1890ff' }}>{batchCount}个</Text>
                </Descriptions.Item>
                <Descriptions.Item label="对账期间" span={2}>
                  {settlementData.period}
                </Descriptions.Item>
                <Descriptions.Item label="合计金额" span={2}>
                  <Text strong style={{ color: '#f5222d', fontSize: '18px' }}>
                    {formatCurrency(settlementData.payable_amount)}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
              <div style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
                <Text type="secondary">包含: {settlementData.recon_no}</Text>
              </div>
            </>
          ) : (
            <Descriptions column={2} size="small">
              <Descriptions.Item label="对账单号">
                <Text strong style={{ color: '#1890ff' }}>{settlementData.recon_no}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="供应商">
                <Text>{settlementData.supplier_name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="对账期间">
                {settlementData.period}月
              </Descriptions.Item>
              <Descriptions.Item label="原付款日">
                {settlementData.period}-01
              </Descriptions.Item>
              <Descriptions.Item label="结算金额" span={2}>
                <Text strong style={{ color: '#f5222d', fontSize: '18px' }}>
                  {formatCurrency(settlementData.payable_amount)}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Card>

        {/* 费用试算器 */}
        <Card
          size="small"
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CalculatorOutlined style={{ marginRight: '8px', color: '#faad14' }} />
              <span>费用试算</span>
            </div>
          }
          style={{ marginBottom: '16px', backgroundColor: '#fff7e6', borderColor: '#ffd591' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="expectedPayDate"
                label="期望付款日"
                rules={[{ required: true, message: '请选择期望付款日' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={getDateConstraints().disabledDate}
                  format="YYYY-MM-DD"
                  onChange={(date) => {
                    handleCalculate(date);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Statistic
                  title="商业折扣"
                  value={calculation?.discount_fee || 0}
                  prefix="-"
                  precision={2}
                  suffix="元"
                  valueStyle={{ color: '#faad14', fontSize: '24px' }}
                />
              </div>
            </Col>
            <Col span={24}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Statistic
                  title="预计实付金额"
                  value={calculation?.net_amount || settlementData.payable_amount}
                  prefix="¥"
                  precision={2}
                  valueStyle={{ 
                    color: '#52c41a', 
                    fontSize: '32px',
                    fontWeight: 'bold'
                  }}
                />
              </div>
            </Col>
          </Row>

          {calculation && calculation.days_diff > 0 && (
            <Alert
              message="费用明细"
              description={
                <div>
                  <div>提前天数：<Text strong>{calculation.days_diff}</Text> 天</div>
                  <div>日折扣率：<Text strong>{(calculation.daily_rate * 100).toFixed(3)}%</Text></div>
                  <div>折扣金额：{formatCurrency(calculation.discount_fee)}</div>
                  <div>折扣比例：<Text strong>{calculation.discount_rate}%</Text></div>
                </div>
              }
              type="info"
              showIcon
              style={{ marginTop: '16px' }}
            />
          )}
        </Card>

        {/* 联系信息 */}
        <Card size="small" title="联系信息" style={{ marginBottom: '16px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPerson"
                label="联系人"
                rules={[{ required: true, message: '请填写联系人' }]}
              >
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPhone"
                label="联系电话"
                rules={[
                  { required: true, message: '请填写联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 协议签署区 */}
        <Card
          size="small"
          title={isBatch && batchCount > 1 ? "批量提前结算补充协议" : "提前结算补充协议"}
          style={{ marginBottom: '16px', backgroundColor: '#f0f9ff', borderColor: '#1890ff' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <Text strong>请阅读并勾选下方协议</Text>
            <Button
              type="link"
              onClick={() => {
                Modal.info({
                  title: isBatch && batchCount > 1 ? '批量提前结算补充协议预览' : '提前结算补充协议预览',
                  width: 800,
                  content: (
                    <div style={{ maxHeight: '60vh', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                      {agreementContent}
                    </div>
                  ),
                  okText: '关闭'
                });
              }}
            >
              查看完整协议
            </Button>
          </div>

          <div style={{
            maxHeight: '150px',
            overflow: 'auto',
            padding: '12px',
            backgroundColor: '#fff',
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
            fontSize: '13px',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap'
          }}>
            {agreementContent || '加载中...'}
          </div>

          <Form.Item style={{ marginTop: '16px', marginBottom: 0 }}>
            <Checkbox
              checked={agreementAccepted}
              onChange={(e) => setAgreementAccepted(e.target.checked)}
            >
              <Text style={{ marginLeft: '8px' }}>
                我已阅读并同意《{isBatch && batchCount > 1 ? '批量' : ''}提前结算补充协议》
              </Text>
            </Checkbox>
          </Form.Item>
        </Card>

        {/* 电签签署区 — 替代原 Canvas 手写签名 */}
        {agreementAccepted && (
          <Card
            size="small"
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>电子签署</Text>
                {signFlowId && (
                  <span style={{ color: '#52c41a' }}>已签署</span>
                )}
              </div>
            }
            style={{ marginBottom: '16px', border: '1px solid #d9d9d9' }}
          >
            {/* 电签签署区 — 替代原 Canvas 手写签名 */}
            <div style={{ textAlign: 'center', padding: '32px 0', borderTop: '1px solid #f0f0f0', marginTop: '16px' }}>
              <Alert
                message="电子签署"
                description="点击下方按钮跳转到电签平台完成《提前结算补充协议》的在线签署"
                type="info"
                showIcon
                style={{ marginBottom: '16px', textAlign: 'left' }}
              />

              {!signFlowId ? (
                <Button
                  type="primary"
                  size="large"
                  icon={<SignatureOutlined />}
                  disabled={!agreementAccepted}
                  onClick={() => {
                    const signData = {
                      business_type: 'early_settlement',
                      application_id: settlementData?.id,
                      supplier_name: settlementData?.supplier_name,
                      amount: settlementData?.payable_amount,
                    };
                    window.open(`${ESIGN_CONFIG.PLATFORM_URL}?data=${encodeURIComponent(JSON.stringify(signData))}`, '_blank');
                    message.success('已跳转到电签平台，签署完成后请返回确认');
                  }}
                >
                  前往电签平台签署协议
                </Button>
              ) : (
                <Result
                  status="success"
                  title="协议已签署"
                  subTitle={`签署时间：${new Date().toLocaleString()}`}
                  extra={
                    <Button onClick={() => setSignFlowId('')}>重新签署</Button>
                  }
                />
              )}

              {!agreementAccepted && (
                <div style={{ color: '#faad14', marginTop: '12px', fontSize: 13 }}>请先阅读并同意上方协议</div>
              )}

              {/* 用户从外部回来后的手动确认入口 */}
              {!signFlowId && agreementAccepted && (
                <div style={{ marginTop: '12px' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>已在电签平台完成签署？</Text>
                  <Button type="link" size="small" onClick={() => {
                    setSignFlowId(`FLOW-${Date.now()}`);
                    message.success('已确认签署完成，可以提交申请了');
                  }}>
                    点击此处确认
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}
      </Form>

      {/* 底部操作按钮 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <Space>
          <Button onClick={onCancel}>
            取消
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!agreementAccepted || !calculation || !signFlowId}
            loading={loading}
            icon={<CheckCircleOutlined />}
          >
            同意并提交申请
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default EarlySettlementModal;
