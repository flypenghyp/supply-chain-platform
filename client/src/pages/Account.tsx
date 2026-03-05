import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Card, Row, Col, Button, Form, Input, Select, Upload, Divider, List, Tag,
  Table, Space, Modal, Avatar, Tabs, Alert, message, Tooltip, Badge
} from 'antd';
import {
  UserOutlined, UploadOutlined, SettingOutlined, FileTextOutlined,
  TeamOutlined, SafetyOutlined, CrownOutlined, ShopOutlined,
  IdcardOutlined, DollarOutlined, FileDoneOutlined, PlusOutlined,
  EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

const Account: React.FC = () => {
  const location = useLocation();

  // 企业信息状态
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [currentSupplier, setCurrentSupplier] = useState<any>(null);

  // 资质证照状态
  const [certificates, setCertificates] = useState<any[]>([]);

  // 人员管理状态
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  // 模态框状态
  const [supplierModalVisible, setSupplierModalVisible] = useState(false);
  const [certificateModalVisible, setCertificateModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  // AI识别状态
  const [aiRecognizing, setAiRecognizing] = useState(false);
  const [aiRecognitionResult, setAiRecognitionResult] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  // 企业信息AI识别状态
  const [supplierAiRecognizing, setSupplierAiRecognizing] = useState(false);
  const [supplierAiResult, setSupplierAiResult] = useState<any>(null);
  const [supplierUploadedFile, setSupplierUploadedFile] = useState<any>(null);

  // 表单
  const [supplierForm] = Form.useForm();
  const [certificateForm] = Form.useForm();
  const [userForm] = Form.useForm();
  const [roleForm] = Form.useForm();

  useEffect(() => {
    fetchSuppliers();
    fetchCertificates();
    fetchUsers();
    fetchRoles();
  }, []);

  // 根据路由确定默认激活的标签页
  const getDefaultActiveKey = () => {
    const path = location.pathname;
    if (path === '/account/company') return '1';
    if (path === '/account/certificates') return '2';
    if (path === '/account/users') return '3';
    return '1'; // 默认企业信息管理
  };

  // 企业信息管理
  const fetchSuppliers = () => {
    const mockData = [
      {
        id: '1',
        name: '农夫山泉股份有限公司',
        code: 'NFS001',
        codes: ['NFS001', 'NFS002', 'NFS003'], // 多供应商代码
        address: '浙江省杭州市余杭区',
        phone: '0571-88888888',
        credit_code: '91110000XXXXXXXX',
        legal_person: '张三',
        status: 'active'
      }
    ];
    setSuppliers(mockData);
    setCurrentSupplier(mockData[0]);
  };

  const handleSupplierSubmit = async (values: any) => {
    try {
      message.success('企业信息保存成功');
      setSupplierModalVisible(false);
      supplierForm.resetFields();
      fetchSuppliers();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 资质证照管理
  const fetchCertificates = () => {
    const mockData = [
      {
        id: '1',
        name: '食品生产许可证',
        cert_no: 'SC12345678901234',
        type: 'production_license',
        expiry_date: '2028-06-14',
        status: 'valid',
        supplier_code: 'NFS001'
      },
      {
        id: '2',
        name: '营业执照',
        cert_no: '91110000XXXXXXXX',
        type: 'business_license',
        expiry_date: '长期',
        status: 'valid',
        supplier_code: 'NFS001'
      }
    ];
    setCertificates(mockData);
  };

  const handleCertificateSubmit = async (values: any) => {
    try {
      message.success('证照上传成功');
      setCertificateModalVisible(false);
      certificateForm.resetFields();
      fetchCertificates();
    } catch (error) {
      message.error('上传失败');
    }
  };

  // 人员管理
  const fetchUsers = () => {
    const mockData = [
      {
        id: '1',
        username: 'admin',
        name: '管理员',
        role: 'super_admin',
        role_name: '超级管理员',
        supplier_codes: ['NFS001', 'NFS002', 'NFS003'],
        phone: '13800138001',
        email: 'admin@nongfuspring.com',
        status: 'active',
        last_login: '2026-01-18 14:30'
      },
      {
        id: '2',
        username: 'business01',
        name: '李四',
        role: 'business_staff',
        role_name: '业务人员',
        supplier_codes: ['NFS001'],
        phone: '13800138002',
        email: 'li@nongfuspring.com',
        status: 'active',
        last_login: '2026-01-18 10:15'
      },
      {
        id: '3',
        username: 'finance01',
        name: '王五',
        role: 'finance_staff',
        role_name: '财务结算人员',
        supplier_codes: ['NFS001', 'NFS002'],
        phone: '13800138003',
        email: 'wang@nongfuspring.com',
        status: 'active',
        last_login: '2026-01-17 16:20'
      }
    ];
    setUsers(mockData);
  };

  const fetchRoles = () => {
    const mockData = [
      {
        id: '1',
        code: 'super_admin',
        name: '超级管理员',
        description: '系统最高权限，可管理所有供应商数据和用户权限',
        permissions: ['supplier_code_access', 'user_management', 'role_management']
      },
      {
        id: '2',
        code: 'business_staff',
        name: '业务人员',
        description: '负责订单处理、发货管理、商品管理等业务操作',
        permissions: ['order_management', 'shipment_management', 'product_management']
      },
      {
        id: '3',
        code: 'document_staff',
        name: '单据人员',
        description: '负责单据审核、质量管理等工作',
        permissions: ['quality_management', 'document_review']
      },
      {
        id: '4',
        code: 'finance_staff',
        name: '财务结算人员',
        description: '负责财务对账、发票管理、收款管理等工作',
        permissions: ['financial_management', 'invoice_management', 'payment_management']
      }
    ];
    setRoles(mockData);
  };

  const handleUserSubmit = async (values: any) => {
    try {
      message.success('用户保存成功');
      setUserModalVisible(false);
      userForm.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleRoleSubmit = async (values: any) => {
    try {
      message.success('角色保存成功');
      setRoleModalVisible(false);
      roleForm.resetFields();
      fetchRoles();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 用户角色相关函数
  const getRoleColor = (role: string) => {
    const colors: any = {
      super_admin: 'red',
      business_staff: 'blue',
      document_staff: 'orange',
      finance_staff: 'green'
    };
    return colors[role] || 'default';
  };

  const getRoleIcon = (role: string) => {
    const icons: any = {
      super_admin: <CrownOutlined />,
      business_staff: <ShopOutlined />,
      document_staff: <FileDoneOutlined />,
      finance_staff: <DollarOutlined />
    };
    return icons[role] || <UserOutlined />;
  };

  const userColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '角色',
      dataIndex: 'role_name',
      key: 'role_name',
      render: (text: string, record: any) => (
        <Tag color={getRoleColor(record.role)} icon={getRoleIcon(record.role)}>
          {text}
        </Tag>
      )
    },
    {
      title: '供应商代码权限',
      dataIndex: 'supplier_codes',
      key: 'supplier_codes',
      render: (codes: string[]) => (
        <div>
          {codes.map(code => (
            <Tag key={code} size="small">{code}</Tag>
          ))}
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={status === 'active' ? '正常' : '禁用'}
        />
      )
    },
    {
      title: '最后登录',
      dataIndex: 'last_login',
      key: 'last_login'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                userForm.setFieldsValue(record);
                setUserModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="权限设置">
            <Button
              type="text"
              icon={<SettingOutlined />}
              size="small"
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 根据路由渲染不同内容
  const renderContent = () => {
    const path = location.pathname;

    if (path === '/account/company') {
      // 企业信息管理页面
      return (
        <div>
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card title="当前供应商信息">
                {currentSupplier && (
                  <div>
                    <Row gutter={16}>
                      <Col span={12}>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>供应商名称：</strong>{currentSupplier.name}
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>主供应商代码：</strong>{currentSupplier.code}
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>关联供应商代码：</strong>
                          {currentSupplier.codes.map((code: string) => (
                            <Tag key={code} style={{ marginRight: '4px' }}>{code}</Tag>
                          ))}
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>企业地址：</strong>{currentSupplier.address}
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>联系电话：</strong>{currentSupplier.phone}
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>统一社会信用代码：</strong>{currentSupplier.credit_code}
                        </div>
                      </Col>
                    </Row>
                    <div style={{ marginTop: '16px' }}>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                          supplierForm.setFieldsValue(currentSupplier);
                          setSupplierModalVisible(true);
                        }}
                      >
                        编辑企业信息
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </Col>

            <Col xs={24}>
              <Card title="供应商代码管理">
                <Alert
                  message="供应商代码说明"
                  description="一个供应商可以关联多个供应商代码，不同业务人员可以根据权限访问不同的供应商代码数据。"
                  type="info"
                  showIcon
                  style={{ marginBottom: '16px' }}
                />
                <div>
                  <strong>当前可用的供应商代码：</strong>
                  {currentSupplier?.codes.map((code: string) => (
                    <Tag key={code} color="blue" style={{ margin: '4px' }}>
                      {code}
                    </Tag>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      );
    } else if (path === '/account/certificates') {
      // 供应商资质证照页面
      return (
        <div>
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card
                title="证照管理"
                extra={
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    onClick={() => setCertificateModalVisible(true)}
                  >
                    上传新证照
                  </Button>
                }
              >
                <List
                  dataSource={certificates}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button size="small" type="link">查看</Button>,
                        <Button size="small" type="link">下载</Button>,
                        <Button size="small" type="link" danger>删除</Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                        title={
                          <div>
                            {item.name}
                            <Tag
                              color={item.status === 'valid' ? 'green' : 'red'}
                              style={{ marginLeft: '8px' }}
                            >
                              {item.status === 'valid' ? '有效' : '过期'}
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div>证照编号: {item.cert_no}</div>
                            <div>有效期至: {item.expiry_date}</div>
                            <div>关联供应商: {item.supplier_code}</div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      );
    } else if (path === '/account/users') {
      // 人员管理页面
      return (
        <div>
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card
                title="用户管理"
                extra={
                  <Space>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setUserModalVisible(true)}
                    >
                      添加用户
                    </Button>
                    <Button
                      icon={<SettingOutlined />}
                      onClick={() => setRoleModalVisible(true)}
                    >
                      角色管理
                    </Button>
                  </Space>
                }
              >
                <Table
                  columns={userColumns}
                  dataSource={users}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                  }}
                  scroll={{ x: 1200 }}
                />
              </Card>
            </Col>

            <Col xs={24}>
              <Card title="角色权限说明">
                <Row gutter={16}>
                  {roles.map(role => (
                    <Col xs={24} sm={12} lg={6} key={role.id}>
                      <Card size="small" title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {getRoleIcon(role.code)}
                          <span style={{ marginLeft: '8px' }}>{role.name}</span>
                        </div>
                      }>
                        <p style={{ fontSize: '12px', marginBottom: '8px' }}>
                          {role.description}
                        </p>
                        <div>
                          <strong>权限：</strong>
                          {role.permissions.map((perm: string) => (
                            <Tag key={perm} size="small" style={{ margin: '2px' }}>
                              {perm}
                            </Tag>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      );
    } else {
      // 默认显示企业信息管理
      return renderContent();
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      {renderContent()}

      {/* 企业信息编辑模态框 */}
      <Modal
        title="编辑企业信息"
        visible={supplierModalVisible}
        onCancel={() => {
          setSupplierModalVisible(false);
          setSupplierAiRecognizing(false);
          setSupplierAiResult(null);
          setSupplierUploadedFile(null);
        }}
        footer={null}
        width={700}
      >
        <Alert
          message="AI智能识别营业执照"
          description="上传最新的营业执照照片，AI将自动识别企业信息并填充表单，大大提升更新效率！"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Form
          form={supplierForm}
          onFinish={handleSupplierSubmit}
          layout="vertical"
        >
          {/* 营业执照上传区域 */}
          <Row gutter={24} style={{ marginBottom: '24px' }}>
            <Col span={12}>
              <Form.Item label="营业执照上传 (AI识别)">
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  accept=".pdf,.jpg,.png,.jpeg"
                  beforeUpload={(file) => {
                    setSupplierUploadedFile(file);
                    return false; // 阻止自动上传
                  }}
                  onRemove={() => {
                    setSupplierUploadedFile(null);
                    setSupplierAiResult(null);
                    setSupplierAiRecognizing(false);
                  }}
                >
                  {supplierUploadedFile ? null : (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>上传营业执照</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>支持PDF、图片格式</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              {supplierUploadedFile && (
                <div style={{ marginBottom: '16px' }}>
                  <Button
                    type="primary"
                    icon={<FileTextOutlined />}
                    loading={supplierAiRecognizing}
                    onClick={async () => {
                      setSupplierAiRecognizing(true);
                      try {
                        // 模拟AI识别营业执照信息
                        setTimeout(() => {
                          const mockResult = {
                            enterprise_name: '农夫山泉股份有限公司',
                            credit_code: '91110000XXXXXXXX',
                            legal_person: '钟睒睒',
                            address: '浙江省杭州市余杭区五常大道18号',
                            establishment_date: '1996-08-28',
                            business_scope: '生产、销售瓶装饮用水、果汁饮料等',
                            registered_capital: '人民币50,000万元',
                            validity_period: '长期',
                            confidence: 98
                          };

                          setSupplierAiResult(mockResult);

                          // 自动填充表单
                          supplierForm.setFieldsValue({
                            name: mockResult.enterprise_name,
                            credit_code: mockResult.credit_code,
                            legal_person: mockResult.legal_person,
                            address: mockResult.address
                          });

                          message.success('AI识别完成，已自动填充企业信息');
                          setSupplierAiRecognizing(false);
                        }, 3000);
                      } catch (error) {
                        message.error('AI识别失败，请手动填写信息');
                        setSupplierAiRecognizing(false);
                      }
                    }}
                    style={{ width: '100%' }}
                  >
                    {supplierAiRecognizing ? 'AI识别中...' : 'AI智能识别'}
                  </Button>
                </div>
              )}
            </Col>

            <Col span={12}>
              <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: '6px', height: '100%', minHeight: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <FileTextOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                  <span style={{ fontWeight: 'bold', color: '#52c41a' }}>AI识别结果</span>
                </div>

                {supplierAiResult ? (
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>企业名称：</strong>{supplierAiResult.enterprise_name}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>统一社会信用代码：</strong>{supplierAiResult.credit_code}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>法定代表人：</strong>{supplierAiResult.legal_person}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>企业地址：</strong>{supplierAiResult.address}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>成立日期：</strong>{supplierAiResult.establishment_date}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>经营范围：</strong>{supplierAiResult.business_scope}
                    </div>
                    <div>
                      <strong>识别准确率：</strong>
                      <Tag color="green">{supplierAiResult.confidence}%</Tag>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#666', textAlign: 'center', paddingTop: '40px' }}>
                    {supplierUploadedFile ? (
                      <div>
                        <div>文件已上传：{supplierUploadedFile.name}</div>
                        <div style={{ marginTop: '8px' }}>点击"AI智能识别"开始分析</div>
                      </div>
                    ) : (
                      <div>请先上传营业执照</div>
                    )}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* 企业信息表单 */}
          <Divider>企业基本信息</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="公司名称"
                rules={[{ required: true, message: '请输入公司名称' }]}
              >
                <Input placeholder={supplierAiResult ? 'AI已自动识别' : '请输入公司名称'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="主供应商代码"
                rules={[{ required: true, message: '请输入主供应商代码' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="credit_code"
                label="统一社会信用代码"
                rules={[{ required: true, message: '请输入统一社会信用代码' }]}
              >
                <Input placeholder={supplierAiResult ? 'AI已自动识别' : '请输入统一社会信用代码'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="legal_person"
                label="法定代表人"
                rules={[{ required: true, message: '请输入法定代表人' }]}
              >
                <Input placeholder={supplierAiResult ? 'AI已自动识别' : '请输入法定代表人'} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="address" label="企业地址">
                <Input placeholder={supplierAiResult ? 'AI已自动识别' : '请输入企业地址'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="联系电话">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="codes"
            label="关联供应商代码"
            help="多个供应商代码用逗号分隔，不同业务人员可以根据权限访问不同的供应商代码"
          >
            <Select mode="tags" placeholder="输入供应商代码" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setSupplierModalVisible(false);
                setSupplierAiRecognizing(false);
                setSupplierAiResult(null);
                setSupplierUploadedFile(null);
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存企业信息
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 证照上传模态框 */}
      <Modal
        title="上传证照"
        visible={certificateModalVisible}
        onCancel={() => {
          setCertificateModalVisible(false);
          setAiRecognizing(false);
          setAiRecognitionResult(null);
          setUploadedFile(null);
        }}
        footer={null}
        width={700}
      >
        <Alert
          message="AI智能识别"
          description="上传证照照片，AI将自动识别证照类型、编号、有效期等信息，大大提升录入效率！"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Form
          form={certificateForm}
          onFinish={handleCertificateSubmit}
          layout="vertical"
        >
          {/* 文件上传区域 */}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="证照文件上传">
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  accept=".pdf,.jpg,.png,.jpeg"
                  beforeUpload={(file) => {
                    setUploadedFile(file);
                    return false; // 阻止自动上传
                  }}
                  onRemove={() => {
                    setUploadedFile(null);
                    setAiRecognitionResult(null);
                    setAiRecognizing(false);
                  }}
                >
                  {uploadedFile ? null : (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>选择证照文件</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>支持PDF、图片格式</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              {uploadedFile && (
                <div style={{ marginBottom: '16px' }}>
                  <Button
                    type="primary"
                    icon={<FileTextOutlined />}
                    loading={aiRecognizing}
                    onClick={async () => {
                      setAiRecognizing(true);
                      try {
                        // 模拟AI识别过程
                        setTimeout(() => {
                          const mockResult = {
                            certificate_type: 'production_license',
                            certificate_name: '食品生产许可证',
                            certificate_no: 'SC12345678901234',
                            issue_date: '2023-06-15',
                            expiry_date: '2028-06-14',
                            issuer: '国家市场监督管理总局',
                            enterprise_name: '农夫山泉股份有限公司',
                            confidence: 95
                          };

                          setAiRecognitionResult(mockResult);

                          // 自动填充表单
                          certificateForm.setFieldsValue({
                            name: mockResult.certificate_name,
                            cert_no: mockResult.certificate_no,
                            type: mockResult.certificate_type,
                            expiry_date: mockResult.expiry_date
                          });

                          message.success('AI识别完成，已自动填充证照信息');
                          setAiRecognizing(false);
                        }, 3000);
                      } catch (error) {
                        message.error('AI识别失败，请手动填写信息');
                        setAiRecognizing(false);
                      }
                    }}
                    style={{ width: '100%' }}
                  >
                    {aiRecognizing ? 'AI识别中...' : 'AI智能识别'}
                  </Button>
                </div>
              )}
            </Col>

            <Col span={12}>
              <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: '6px', height: '100%', minHeight: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <FileTextOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                  <span style={{ fontWeight: 'bold', color: '#52c41a' }}>AI识别结果</span>
                </div>

                {aiRecognitionResult ? (
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>证照类型：</strong>
                      <Tag color="blue">{aiRecognitionResult.certificate_name}</Tag>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>证照编号：</strong>{aiRecognitionResult.certificate_no}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>有效期至：</strong>{aiRecognitionResult.expiry_date}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>发证机关：</strong>{aiRecognitionResult.issuer}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>企业名称：</strong>{aiRecognitionResult.enterprise_name}
                    </div>
                    <div>
                      <strong>识别准确率：</strong>
                      <Tag color="green">{aiRecognitionResult.confidence}%</Tag>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#666', textAlign: 'center', paddingTop: '40px' }}>
                    {uploadedFile ? (
                      <div>
                        <div>文件已上传：{uploadedFile.name}</div>
                        <div style={{ marginTop: '8px' }}>点击"AI智能识别"开始分析</div>
                      </div>
                    ) : (
                      <div>请先上传证照文件</div>
                    )}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* 表单字段 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="证照名称"
                rules={[{ required: true, message: '请输入证照名称' }]}
              >
                <Input placeholder={aiRecognitionResult ? 'AI已自动识别' : '例如：食品生产许可证'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cert_no"
                label="证照编号"
                rules={[{ required: true, message: '请输入证照编号' }]}
              >
                <Input placeholder={aiRecognitionResult ? 'AI已自动识别' : '请输入证照编号'} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="证照类型"
                rules={[{ required: true, message: '请选择证照类型' }]}
              >
                <Select placeholder="选择证照类型">
                  <Option value="production_license">生产许可证</Option>
                  <Option value="business_license">营业执照</Option>
                  <Option value="quality_certificate">质量证书</Option>
                  <Option value="environmental_certificate">环保证书</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="supplier_code"
                label="关联供应商代码"
                rules={[{ required: true, message: '请选择关联供应商代码' }]}
              >
                <Select placeholder="选择供应商代码">
                  {currentSupplier?.codes.map((code: string) => (
                    <Option key={code} value={code}>{code}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="expiry_date" label="有效期至">
                <Input placeholder={aiRecognitionResult ? 'AI已自动识别' : '例如：2028-12-31 或 长期'} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="备注说明">
            <Input.TextArea rows={2} placeholder="可选填写备注信息" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setCertificateModalVisible(false);
                setAiRecognizing(false);
                setAiRecognitionResult(null);
                setUploadedFile(null);
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                上传证照
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 用户管理模态框 */}
      <Modal
        title="用户管理"
        visible={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={userForm}
          onFinish={handleUserSubmit}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="选择角色">
              {roles.map(role => (
                <Option key={role.id} value={role.code}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="supplier_codes"
            label="供应商代码权限"
            help="选择该用户可以访问的供应商代码"
          >
            <Select mode="multiple" placeholder="选择供应商代码">
              {currentSupplier?.codes.map((code: string) => (
                <Option key={code} value={code}>{code}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="phone" label="手机号">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="邮箱">
            <Input />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setUserModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 角色管理模态框 */}
      <Modal
        title="角色管理"
        visible={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={roleForm}
          onFinish={handleRoleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="code"
            label="角色代码"
            rules={[{ required: true, message: '请输入角色代码' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="角色描述">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="权限设置"
          >
            <Select mode="multiple" placeholder="选择权限">
              <Option value="supplier_code_access">供应商代码访问权限</Option>
              <Option value="user_management">用户管理权限</Option>
              <Option value="role_management">角色管理权限</Option>
              <Option value="order_management">订单管理权限</Option>
              <Option value="shipment_management">发货管理权限</Option>
              <Option value="product_management">商品管理权限</Option>
              <Option value="quality_management">质量管理权限</Option>
              <Option value="financial_management">财务管理权限</Option>
              <Option value="invoice_management">发票管理权限</Option>
              <Option value="payment_management">收款管理权限</Option>
              <Option value="document_review">单据审核权限</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setRoleModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Account;
