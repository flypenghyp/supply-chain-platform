import React, { useState, useEffect, useRef } from 'react';
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
  Divider,
  message,
  Popconfirm
} from 'antd';
import {
  ThunderboltOutlined,
  CalculatorOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ClearOutlined
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

const { Title, Text, Paragraph } = Typography;

interface EarlySettlementModalProps {
  visible: boolean;
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
  visible,
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
  const [signature, setSignature] = useState<string>('');
  const [signatureRequired, setSignatureRequired] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // 初始化
  useEffect(() => {
    if (visible && settlementData && settlementData.id) {
      initializeForm();
      setSignature('');
      setSignatureRequired(false);
    }
  }, [visible, settlementData]);

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

  // 签名相关函数
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
    setSignatureRequired(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    setSignature(dataUrl);
    setSignatureRequired(false);
    message.success('签名已保存');
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

      // 检查是否已签名
      if (!signature) {
        setSignatureRequired(true);
        message.warning('请先签署协议');
        return;
      }

      const submitData = {
        ...values,
        settlementId: settlementData.id,
        calculation,
        agreementContent,
        agreementAccepted,
        signature, // 电子签名
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
      open={visible}
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

        {/* 电子签章区域 */}
        {agreementAccepted && (
          <Card
            size="small"
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>电子签名</Text>
                {signature && (
                  <Tag color="success">已签署</Tag>
                )}
              </div>
            }
            style={{ marginBottom: '16px', border: signatureRequired ? '2px solid #f5222d' : '1px solid #d9d9d9' }}
          >
            {!signature ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <Text type="secondary">请在下方的签名区域手写签名</Text>
                </div>
                <div style={{
                  border: '2px solid #1890ff',
                  borderRadius: '4px',
                  backgroundColor: '#f0f9ff',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={150}
                    style={{
                      border: '1px solid #d9d9d9',
                      backgroundColor: '#fff',
                      cursor: 'crosshair',
                      display: 'block'
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                  <Space>
                    <Button onClick={clearSignature} icon={<ClearOutlined />}>
                      清除签名
                    </Button>
                    <Button type="primary" onClick={saveSignature} icon={<CheckCircleOutlined />}>
                      确认签名
                    </Button>
                  </Space>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <img 
                  src={signature} 
                  alt="电子签名" 
                  style={{ 
                    maxWidth: '400px', 
                    height: '80px', 
                    border: '2px solid #52c41a',
                    borderRadius: '4px',
                    padding: '10px',
                    backgroundColor: '#f6ffed'
                  }} 
                />
                <div style={{ marginTop: '12px' }}>
                  <Text type="success">✓ 签名已确认</Text>
                </div>
                <Button 
                  type="link" 
                  onClick={clearSignature}
                  style={{ marginTop: '8px' }}
                >
                  重新签名
                </Button>
              </div>
            )}
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
            disabled={!agreementAccepted || !calculation || !signature}
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
