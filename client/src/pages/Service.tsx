import React from 'react';
import { Card, Row, Col, Button, List, Avatar, Typography, Divider } from 'antd';
import { CustomerServiceOutlined, MessageOutlined, BookOutlined, VideoCameraOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Service: React.FC = () => {
  const helpItems = [
    {
      title: '新手入门指南',
      description: '了解平台基本功能和操作流程',
      icon: <BookOutlined />
    },
    {
      title: '订单管理教程',
      description: '如何确认订单、处理变更、跟踪发货',
      icon: <VideoCameraOutlined />
    },
    {
      title: '财务对账说明',
      description: '对账单生成、确认、异议处理流程',
      icon: <BookOutlined />
    }
  ];

  const faqItems = [
    {
      question: '如何申请供应链金融？',
      answer: '在财务中心选择供应链金融，基于已确认的应收账款申请融资'
    },
    {
      question: '订单确认后多长时间必须发货？',
      answer: '订单确认后应在承诺的发货时间内完成发货，超时将产生违约责任'
    },
    {
      question: '如何处理质量问题？',
      answer: '在质量管理模块及时响应问题报告，提供调查结果和处理方案'
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title={<><CustomerServiceOutlined /> 智能客服</>} style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar size={64} icon={<MessageOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: '16px' }} />
              <Title level={4}>AI智能助手</Title>
              <Paragraph>7x24小时在线，随时为您解答问题</Paragraph>
              <Button type="primary" size="large" icon={<MessageOutlined />}>
                开始对话
              </Button>
            </div>
            <Divider />
            <div>
              <Title level={5}>热门问题</Title>
              <List
                size="small"
                dataSource={faqItems}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <>
                          <QuestionCircleOutlined style={{ marginRight: '8px' }} />
                          {item.question}
                        </>
                      }
                      description={item.answer}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={<><BookOutlined /> 帮助中心</>} style={{ height: '100%' }}>
            <List
              dataSource={helpItems}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" size="small">查看</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={item.icon} style={{ backgroundColor: '#f0f9ff' }} />}
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <Button icon={<VideoCameraOutlined />}>观看视频教程</Button>
            </div>
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="联系我们">
            <Row gutter={24}>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar size={48} icon={<CustomerServiceOutlined />} style={{ backgroundColor: '#52c41a', marginBottom: '8px' }} />
                  <div><strong>客服热线</strong></div>
                  <div>400-XXX-XXXX</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>工作日 9:00-18:00</div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar size={48} icon={<MessageOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: '8px' }} />
                  <div><strong>在线客服</strong></div>
                  <div>support@supply-chain.com</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>7x24小时响应</div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar size={48} icon={<BookOutlined />} style={{ backgroundColor: '#faad14', marginBottom: '8px' }} />
                  <div><strong>工单服务</strong></div>
                  <div>提交技术问题</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>专业技术支持</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Service;
