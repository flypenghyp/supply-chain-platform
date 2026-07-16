import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Card, Row, Col, Button, Form, Input, Select, Upload, Divider, List, Tag,
  Table, Space, Modal, Avatar, Tabs, Alert, message, Badge, Checkbox, Radio, Typography, Descriptions, Drawer, Tree, TreeSelect, Transfer, Switch, Steps, DatePicker, Tooltip, Timeline, Empty
} from 'antd';
import {
  UserOutlined, UploadOutlined, SettingOutlined, FileTextOutlined,
  TeamOutlined, SafetyOutlined, CrownOutlined, ShopOutlined,
  IdcardOutlined, DollarOutlined, FileDoneOutlined, PlusOutlined,
  EditOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';
import TransferSuperAdminModal from './components/TransferSuperAdminModal';
import PersonalAuthModal from './components/PersonalAuthModal';
import PhoneDisplay from './components/PhoneDisplay';
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter';
import { ESIGN_CONFIG } from '../config/esign';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;

const regions = [
  { id: '1', name: '华南区', code: 'HN' },
  { id: '2', name: '华东区', code: 'HD' },
  { id: '3', name: '华北区', code: 'HB' },
  { id: '4', name: '西南区', code: 'XN' }
];

const stores = [
  { id: '1', name: '广州门店', code: 'GZ001', regionId: '1' },
  { id: '2', name: '深圳门店', code: 'SZ001', regionId: '1' },
  { id: '3', name: '上海门店', code: 'SH001', regionId: '2' },
  { id: '4', name: '杭州门店', code: 'HZ001', regionId: '2' },
  { id: '5', name: '北京门店', code: 'BJ001', regionId: '3' }
];

const counters = [
  { id: '1', name: 'A区柜组', code: 'A01', storeId: '1' },
  { id: '2', name: 'B区柜组', code: 'B01', storeId: '1' },
  { id: '3', name: 'C区柜组', code: 'C01', storeId: '2' }
];

// 生成树状数据结构
const generateTreeData = () => {
  const treeData = [
    {
      key: 'national',
      title: '全国',
      children: regions.map(region => ({
        key: `region_${region.id}`,
        title: region.name,
        dataType: 'region',
        dataId: region.id,
        children: stores
          .filter(store => store.regionId === region.id)
          .map(store => ({
            key: `store_${store.id}`,
            title: store.name,
            dataType: 'store',
            dataId: store.id,
            children: counters
              .filter(counter => counter.storeId === store.id)
              .map(counter => ({
                key: `counter_${counter.id}`,
                title: counter.name,
                dataType: 'counter',
                dataId: counter.id
              }))
          }))
      }))
    }
  ];
  return treeData;
};

const treeData = generateTreeData();

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

  // 当前登录用户（从用户列表中获取超管）
  const currentUser = users.find(user => user.supplier_roles?.some((sr: any) => sr.roles?.includes('admin')));

  // 人员管理当前选中的供应商编码
  const [selectedUserSupplierCode, setSelectedUserSupplierCode] = useState<string>('');

  // 用户详情 Drawer 当前选中的供应商编码
  const [detailActiveSupplierCode, setDetailActiveSupplierCode] = useState<string>('');

  // 模态框状态
  const [supplierModalVisible, setSupplierModalVisible] = useState(false);
  const [certificateModalVisible, setCertificateModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [userDetailVisible, setUserDetailVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRolesForSetting, setSelectedRolesForSetting] = useState<string[]>(['admin']);
  const [permissionSettings, setPermissionSettings] = useState({
    business: [] as string[],
    finance: [] as string[],
    enterprise: [] as string[],
    cooperation: [] as string[],
    system: [] as string[]
  });
  const [dataTypeForSetting, setDataTypeForSetting] = useState('all');
  const [dataScopeDetail, setDataScopeDetail] = useState({
    regions: [] as string[],
    stores: [] as string[],
    counters: [] as string[]
  });
  const [dataScopeModalVisible, setDataScopeModalVisible] = useState(false);
  
  // 用户管理模态框的数据权限状态
  const [userModalDataType, setUserModalDataType] = useState('all');
  const [userModalDataScopeDetail, setUserModalDataScopeDetail] = useState({
    regions: [] as string[],
    stores: [] as string[],
    counters: [] as string[]
  });
  const [userModalDataScopeVisible, setUserModalDataScopeVisible] = useState(false);

  // 用户管理模态框的供应商权限选中状态
  const [userModalSelectedSupplierCodes, setUserModalSelectedSupplierCodes] = useState<string[]>([]);

  // 用户管理模态框的按供应商数据权限配置
  const [userModalSupplierScopes, setUserModalSupplierScopes] = useState<any[]>([]);
  const [currentScopeSupplierCode, setCurrentScopeSupplierCode] = useState<string | null>(null);

  // 用户管理模态框的编辑状态（null=新建模式，有值=编辑模式）
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // --- 证照管理相关状态 ---
  const [certFilterVisible, setCertFilterVisible] = useState(false);   // 搜索面板展开/收起
  const [certStatusTab, setCertStatusTab] = useState('valid');         // 有效/待审核 Tab
  const [certCategoryTab, setCertCategoryTab] = useState('all');       // 分类 Tab
  const [certSearchForm, setCertSearchForm] = useState({                // 搜索条件
    name: '', type: undefined as string | undefined, certNo: '', status: undefined as string | undefined,
  });
  const [editingCertId, setEditingCertId] = useState<string | null>(null); // null=新增，有值=编辑/延期
  const [isRenewMode, setIsRenewMode] = useState(false); // true=延期模式（基本信息只读）
  const [certDetailVisible, setCertDetailVisible] = useState(false);       // 详情 Drawer
  const [selectedCert, setSelectedCert] = useState<any>(null);

  // 电签权限状态
  const [esignPermission, setEsignPermission] = useState({
    enabled: false,
    verified: false
  });
  
  // 树状数据权限选择状态
  const [treeScopeModalVisible, setTreeScopeModalVisible] = useState(false);
  const [selectedTreeKeys, setSelectedTreeKeys] = useState<string[]>([]);
  const [userModalTreeScopeVisible, setUserModalTreeScopeVisible] = useState(false);
  const [userModalSelectedTreeKeys, setUserModalSelectedTreeKeys] = useState<string[]>([]);
  const [transferVisible, setTransferVisible] = useState(false);
  const [personalAuthVisible, setPersonalAuthVisible] = useState(false);

  // 角色权限列表相关状态
  const [roleDetailVisible, setRoleDetailVisible] = useState(false);
  const [roleUsersVisible, setRoleUsersVisible] = useState(false);
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState<any>(null);

  // 数据权限查看弹窗
  const [dataScopeViewModalVisible, setDataScopeViewModalVisible] = useState(false);

  // 电签权限 Switch 状态
  const [esignSwitchStates, setEsignSwitchStates] = useState<Record<string, boolean>>({});

  // 电签管理状态（授权链路）
  const [enterpriseAuthStatus, setEnterpriseAuthStatus] = useState<'unverified' | 'verified'>('unverified');
  const [esignApplyModalVisible, setEsignApplyModalVisible] = useState(false);
  const [esignAuthInfo, setEsignAuthInfo] = useState<any>(null);
  const [esignApplying, setEsignApplying] = useState(false);
  const [esignForm] = Form.useForm();

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
    // 模拟电签授权书驳回状态
    setEsignAuthInfo({
      status: 'rejected',
      authNo: '',
      applyTime: '2024-07-08 14:20:00',
      reviewer: '零售审核员-张工',
      reviewTime: '',
      rejectTime: '2024-07-09 10:15:00',
      rejectReason: '授权书盖章不清晰，请重新加盖清晰公章后上传；另请补充经办人身份证复印件。',
      resubmitCount: 0,
    });
  }, []);

  // 根据路由确定默认激活的标签页
  const getDefaultActiveKey = () => {
    const path = location.pathname;
    if (path === '/account/company') return '1';
    if (path === '/account/certificates') return '2';
    if (path === '/account/users') return '3';
    return '1'; // 默认企业信息管理
  };

  // 从树状选择中提取 regions、stores、counters
  const extractDataFromTreeKeys = (keys: string[]) => {
    const result = {
      regions: [] as string[],
      stores: [] as string[],
      counters: [] as string[],
      selectedNames: [] as string[]
    };

    keys.forEach(key => {
      if (key === 'national') {
        result.selectedNames.push('全国');
      } else if (key.startsWith('region_')) {
        const id = key.replace('region_', '');
        result.regions.push(id);
        const region = regions.find(r => r.id === id);
        if (region) result.selectedNames.push(region.name);
      } else if (key.startsWith('store_')) {
        const id = key.replace('store_', '');
        result.stores.push(id);
        const store = stores.find(s => s.id === id);
        if (store) result.selectedNames.push(store.name);
      } else if (key.startsWith('counter_')) {
        const id = key.replace('counter_', '');
        result.counters.push(id);
        const counter = counters.find(c => c.id === id);
        if (counter) result.selectedNames.push(counter.name);
      }
    });

    return result;
  };

  // 从 detail 数据生成树状选择的 keys
  const generateTreeKeysFromDetail = (detail: any) => {
    const keys: string[] = [];
    
    if (detail.regions) {
      detail.regions.forEach((id: string) => keys.push(`region_${id}`));
    }
    if (detail.stores) {
      detail.stores.forEach((id: string) => keys.push(`store_${id}`));
    }
    if (detail.counters) {
      detail.counters.forEach((id: string) => keys.push(`counter_${id}`));
    }
    
    return keys;
  };

  // 判断当前用户是否为超管
  const isCurrentUserAdmin = (): boolean => {
    try {
      const raw = localStorage.getItem('supplier_userInfo');
      if (!raw) return false;
      const info = JSON.parse(raw);
      return !!info?.supplier_roles?.some((sr: any) => Array.isArray(sr.roles) && sr.roles.includes('admin'));
    } catch {
      return false;
    }
  };

  // 获取当前登录用户自身的所有角色 code（用于子集校验）
  const getMyRoleCodes = (): string[] => {
    try {
      const raw = localStorage.getItem('supplier_userInfo');
      if (!raw) return [];
      const info = JSON.parse(raw);
      const list: string[] = [];
      (info?.supplier_roles || []).forEach((sr: any) => {
        if (Array.isArray(sr.roles)) list.push(...sr.roles);
      });
      return Array.from(new Set(list));
    } catch {
      return [];
    }
  };

  // 判断是否有权限修改目标用户：仅超管可改任何人；非超管一律不可改（含自己）
  const canModifyUser = (_targetUser: any): boolean => {
    return isCurrentUserAdmin();
  };

  // 判断目标用户权限是否为当前用户权限的子集
  const hasSubsetPermissions = (currentPerms: any, targetPerms: any): boolean => {
    const allCategories = ['business', 'finance', 'enterprise', 'cooperation', 'system'];
    for (const cat of allCategories) {
      const currentSet = new Set(currentPerms[cat] || []);
      const targetSet = new Set(targetPerms[cat] || []);
      for (const perm of targetSet) {
        if (!currentSet.has(perm)) return false;
      }
    }
    return true;
  };

  // 处理电签权限 Switch 变更
  const handleEsignSwitchChange = (userId: string, checked: boolean) => {
    setEsignSwitchStates(prev => ({ ...prev, [userId]: checked }));
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          esign_permission: {
            ...u.esign_permission,
            enabled: checked,
            granted_at: checked ? new Date().toLocaleString() : '',
            granted_by: checked ? '当前用户' : ''
          }
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    message.success(checked ? '电签权限已开通' : '电签权限已关闭');
  };

  // 下载授权书模板
  const handleDownloadTemplate = () => {
    const content = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>企业授权书模板</title>
          <style>
            body { font-family: SimSun, serif; font-size: 16px; line-height: 1.8; padding: 40px; }
            h1 { text-align: center; font-size: 22px; }
            .blank { display: inline-block; min-width: 120px; border-bottom: 1px solid #000; }
          </style>
        </head>
        <body>
          <h1>企业授权书</h1>
          <p>致：<span class="blank"></span>（零售商名称）：</p>
          <p>兹授权我公司员工 <span class="blank"></span>（姓名）作为本企业电子签章业务经办人，负责在贵司供应链协同平台办理以下业务：</p>
          <p>1. 结算确认；2. 合同签署；3. 提前结算；4. 质量确认；5. 促销协议。</p>
          <p>授权期限自 <span class="blank"></span> 至 <span class="blank"></span>。</p>
          <p>本授权书自加盖公章之日起生效。</p>
          <br/>
          <p style="text-align: right;">授权企业（盖章）：<span class="blank"></span></p>
          <p style="text-align: right;">法定代表人/授权代表签字：<span class="blank"></span></p>
          <p style="text-align: right;">日期：<span class="blank"></span></p>
        </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '企业授权书模板.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    setSelectedUserSupplierCode(mockData[0].codes[0]);
  };

  const handleSupplierSubmit = async (values: any) => {
    try {
      message.success('企业信息保存成功');
      setSupplierModalVisible(false);
      supplierForm.resetFields();
      fetchSuppliers();
    } catch (error) {
      // 子集校验/管理员校验已在内部 return，这里只剩真正的异常
      message.error('保存失败');
    }
  };

  // --- 证照管理常量 ---
  const CERT_CATEGORY_TABS = [
    { key: 'all', label: '全部' },
    { key: 'enterprise', label: '企业资质证照' },
    { key: 'product', label: '产品资质证照' },
    { key: 'circulation', label: '产品流通类证照' },
    { key: 'authorization', label: '授权委托证照' },
    { key: 'store_lease', label: '门店商户租赁证照' },
  ];

  interface CertTypeNode {
    value: string;
    label: string;
    children?: CertTypeNode[];
  }

  const CERT_TYPE_TREE: CertTypeNode[] = [
    {
      value: 'enterprise',
      label: '企业资质证照',
      children: [
        { value: 'business_license', label: '营业执照' },
        { value: 'food_business_license', label: '食品经营许可证' },
        { value: 'production_license', label: '生产许可证' },
        { value: 'tax_registration', label: '税务登记证' },
        { value: 'organization_code', label: '组织机构代码证' },
        { value: 'enterprise_credit', label: '企业信用等级证书' },
        { value: 'food_production_license', label: '食品生产许可证' },
        { value: 'sc_food_license', label: 'SC食品生产许可证' },
        { value: ' import_export_license', label: '进出口经营权证书' },
        { value: 'customs_registration', label: '海关注册登记证书' },
        { value: 'social_insurance', label: '社会保险登记证' },
        { value: 'statistics_certificate', label: '统计登记证' },
        { value: 'fire_safety_certificate', label: '消防安全检查合格证' },
        { value: 'environmental_permit', label: '排污许可证' },
        { value: 'occupational_health', label: '职业健康安全管理体系认证' },
        { value: 'iso9001', label: 'ISO9001质量管理体系认证' },
        { value: 'iso22000', label: 'ISO22000食品安全管理体系认证' },
        { value: 'haccp', label: 'HACCP认证' },
        { value: 'gmp', label: 'GMP认证' },
        { value: 'qs_certification', label: 'QS认证' },
      ],
    },
    {
      value: 'product',
      label: '产品资质证照',
      children: [
        { value: 'green_food_cert', label: '绿色食品证书' },
        { value: 'organic_food_cert', label: '有机产品认证证书' },
        { value: 'inspection_report', label: '产品检验报告' },
        { value: 'product_registration', label: '产品注册证' },
        { value: 'product_license', label: '产品生产许可证' },
        { value: 'health_food_cert', label: '保健食品批准证书' },
        { value: 'special_food_cert', label: '特殊食品经营许可证' },
        { value: 'halal_cert', label: '清真食品认证' },
        { value: 'kosher_cert', label: '犹太洁食认证' },
        { value: 'geographical_indication', label: '地理标志产品证书' },
        { value: 'pollution_free_agriculture', label: '无公害农产品证书' },
        { value: 'famous_brand_cert', label: '名牌产品证书' },
        { value: 'quality_cert', label: '产品质量合格证' },
        { value: 'ingredient_report', label: '成分检测报告' },
        { value: 'microbial_report', label: '微生物检测报告' },
        { value: 'nutrition_report', label: '营养成分检测报告' },
        { value: 'additive_report', label: '添加剂检测报告' },
        { value: 'pesticide_report', label: '农残检测报告' },
        { value: 'heavy_metal_report', label: '重金属检测报告' },
        { value: 'allergen_report', label: '过敏原检测报告' },
      ],
    },
    {
      value: 'circulation',
      label: '产品流通类证照',
      children: [
        { value: 'circulation_permit', label: '食品流通许可证' },
        { value: 'health_permit', label: '卫生许可证' },
        { value: 'import_food_record', label: '进口食品备案证明' },
        { value: 'customs_declaration', label: '进口货物报关单' },
        { value: 'inspection_quarantine', label: '入境货物检验检疫证明' },
        { value: 'cold_chain_qualification', label: '冷链物流资质' },
        { value: 'transport_permit', label: '道路运输经营许可证' },
        { value: 'warehouse_license', label: '仓储许可证' },
        { value: 'distribution_license', label: '配送许可证' },
        { value: 'retail_license', label: '零售许可证' },
        { value: 'wholesale_license', label: '批发许可证' },
        { value: 'import_license', label: '进口许可证' },
        { value: 'export_license', label: '出口许可证' },
        { value: 'commodity_inspection', label: '商检证书' },
        { value: 'origin_certificate', label: '原产地证书' },
        { value: 'sanitary_certificate', label: '卫生证书' },
        { value: 'health_certificate', label: '健康证书' },
        { value: 'quality_certificate', label: '品质证书' },
        { value: 'weight_certificate', label: '重量证书' },
        { value: 'phytosanitary_certificate', label: '植物检疫证书' },
      ],
    },
    {
      value: 'authorization',
      label: '授权委托证照',
      children: [
        { value: 'brand_authorization', label: '品牌授权书' },
        { value: 'trademark_registration', label: '商标注册证' },
        { value: 'sales_authorization', label: '销售授权书' },
        { value: 'distribution_authorization', label: '经销授权书' },
        { value: 'agency_authorization', label: '代理授权书' },
        { value: 'retail_authorization', label: '零售授权书' },
        { value: 'online_authorization', label: '网络销售授权书' },
        { value: 'trademark_license', label: '商标使用许可合同' },
        { value: 'patent_certificate', label: '专利证书' },
        { value: 'copyright_certificate', label: '著作权证书' },
        { value: 'franchise_certificate', label: '特许经营许可证' },
        { value: 'sole_agency', label: '独家代理协议' },
        { value: 'regional_agency', label: '区域代理协议' },
        { value: 'channel_authorization', label: '渠道授权书' },
        { value: 'promotion_authorization', label: '促销授权书' },
        { value: 'brand_use_certificate', label: '品牌使用证明' },
        { value: 'ip_license', label: '知识产权许可证明' },
        { value: 'quality_guarantee', label: '质量保证书' },
        { value: 'after_sales_authorization', label: '售后服务授权书' },
        { value: 'ecommerce_authorization', label: '电商平台授权书' },
      ],
    },
    {
      value: 'store_lease',
      label: '门店商户租赁证照',
      children: [
        { value: 'lease_contract', label: '门店租赁合同' },
        { value: 'lease_business_license', label: '门店租赁营业执照' },
        { value: 'property_certificate', label: '房屋产权证明' },
        { value: 'rental_registration', label: '房屋租赁登记备案证明' },
        { value: 'store_fire_safety', label: '门店消防安全合格证' },
        { value: 'store_environmental', label: '门店环保验收合格证' },
        { value: 'store_health_permit', label: '门店卫生许可证' },
        { value: 'store_decoration_permit', label: '门店装修许可证' },
        { value: 'store_open_permit', label: '门店开业许可证' },
        { value: 'mall_entry_permit', label: '商场进场许可证' },
        { value: 'store_operation_license', label: '门店经营许可证' },
        { value: 'counter_lease', label: '柜台租赁合同' },
        { value: 'booth_license', label: '展位租赁合同' },
        { value: 'store_signage_permit', label: '门店招牌设置许可证' },
        { value: 'store_parking_permit', label: '门店停车许可证' },
        { value: 'store_security_permit', label: '门店治安许可证' },
        { value: 'store_food_permit', label: '门店食品经营许可证' },
        { value: 'store_tobacco_permit', label: '门店烟草专卖许可证' },
        { value: 'store_alcohol_permit', label: '门店酒类流通许可证' },
        { value: 'store_medical_permit', label: '门店医疗器械经营许可证' },
      ],
    },
  ];

  const findCertTypeNode = (value: string): CertTypeNode | null => {
    for (const cat of CERT_TYPE_TREE) {
      if (cat.value === value) return cat;
      if (cat.children) {
        for (const child of cat.children) {
          if (child.value === value) return child;
        }
      }
    }
    return null;
  };

  const findCertTypeCategory = (value: string): CertTypeNode | null => {
    for (const cat of CERT_TYPE_TREE) {
      if (cat.children?.some(child => child.value === value)) return cat;
    }
    return null;
  };

  const findCertTypeNodeByLabel = (label: string): CertTypeNode | null => {
    for (const cat of CERT_TYPE_TREE) {
      if (cat.label === label) return cat;
      if (cat.children) {
        for (const child of cat.children) {
          if (child.label === label) return child;
        }
      }
    }
    return null;
  };

  const CERT_TYPE_OPTIONS = CERT_TYPE_TREE.flatMap(cat =>
    (cat.children || []).map(child => ({
      label: `${cat.label} / ${child.label}`,
      value: child.value,
      category: cat.value,
    }))
  );

  const CERT_STATUS_OPTIONS = [
    { value: 'valid', label: '正常' },
    { value: 'expired', label: '过期' },
    { value: 'pending', label: '待审核' },
    { value: 'rejected', label: '已驳回' },
    { value: 'renewal_pending', label: '延期申请中' },
    { value: 'renewal_approved', label: '已延期' },
    { value: 'renewal_rejected', label: '延期被驳回' },
  ];

  // 资质证照管理
  const fetchCertificates = () => {
    const mockData = [
      {
        id: '1',
        name: '门店租赁营业执照',
        cert_no: '320594666202409060054',
        type: 'store_lease',
        type_label: '门店商户租赁证照',
        sub_type: '门店租赁营业执照',
        expiry_date_start: '2023-07-06',
        expiry_date: '2026-07-05',
        is_long_term: false,
        status: 'invalid',
        status_label: '无效',
        expiry_warning: '30天到期',
        supplier_code: 'NFS001',
        supplier_name: '湖南山润山茶油销售有限公司',
        authorized_company: '',
        专柜: '格格服饰苏州金鸡湖天虹',
        brand: '格格',
        business_place: '中国（江苏）自由贸易试验区苏州工业园区苏雅路388号新天翔商业广场2幢10室12层b1',
        license_scope: '一般项目：美发饰品销售；日用百货销售',
        category: 'store_lease',
        is_renewed: true,
        is_master: false,
        version_sequence: 1,
        approval_status: 'approved',
        approval_status_label: '已通过',
        renewed_cert_id: '10',
      },
      {
        id: '2',
        name: '食品经营许可证',
        cert_no: 'JY13205940012345',
        type: 'enterprise',
        type_label: '企业资质证照',
        sub_type: '食品经营许可证',
        expiry_date_start: '2026-03-15',
        expiry_date: '2027-03-14',
        is_long_term: false,
        status: 'valid',
        status_label: '正常',
        expiry_warning: '--',
        supplier_code: 'NFS001',
        supplier_name: '湖南山润山茶油销售有限公司',
        authorized_company: '农夫山泉杭州分公司',
        专柜: '',
        brand: '农夫山泉',
        business_place: '浙江省杭州市余杭区五常大道18号',
        license_scope: '食品经营（销售预包装食品）',
        category: 'enterprise',
        is_renewed: false,
        is_master: true,
        version_sequence: 1,
        approval_status: 'approved',
        approval_status_label: '已通过',
      },
      {
        id: '3',
        name: '绿色食品证书',
        cert_no: 'LB-10-23071813587A;LB-10-230718133586A;LB-10-23071',
        type: 'product',
        type_label: '产品资质证照',
        sub_type: '绿色食品证书',
        expiry_date_start: '2023-07-06',
        expiry_date: '2026-07-05',
        is_long_term: false,
        status: 'valid',
        status_label: '正常',
        expiry_warning: '30天到期',
        supplier_code: 'NFS001',
        supplier_name: '湖南山润山茶油销售有限公司',
        authorized_company: '',
        专柜: '',
        brand: '',
        business_place: '湖南省长沙市岳麓区',
        license_scope: '绿色食品生产与销售',
        category: 'product',
        is_renewed: false,
        is_master: true,
        version_sequence: 1,
        approval_status: 'approved',
        approval_status_label: '已通过',
      },
      {
        id: '4',
        name: '品牌授权书',
        cert_no: 'ZZ000000000002063106',
        type: 'authorization',
        type_label: '授权委托证照',
        sub_type: '品牌授权书',
        expiry_date_start: '2026-01-01',
        expiry_date: '2028-12-31',
        is_long_term: false,
        status: 'valid',
        status_label: '正常',
        expiry_warning: '--',
        supplier_code: 'NFS001',
        supplier_name: '湖南山润山茶油销售有限公司',
        authorized_company: '农夫山泉股份有限公司',
        专柜: '',
        brand: '',
        business_place: '湖南省长沙市',
        license_scope: '授权销售代理业务',
        category: 'authorization',
        is_renewed: true,
        is_master: true,
        version_sequence: 1,
        approval_status: 'approved',
        approval_status_label: '已通过',
        renewed_cert_id: '11',
      },
      {
        id: '5',
        name: '产品检验报告',
        cert_no: 'DLF25-202511001',
        type: 'product',
        type_label: '产品资质证照',
        sub_type: '产品检验报告',
        expiry_date_start: '2025-11-01',
        expiry_date: '2025-04-30',
        is_long_term: false,
        status: 'expired',
        status_label: '过期',
        expiry_warning: '已过期',
        supplier_code: 'NFS001',
        supplier_name: '湖南省点程供应链管理有限公司',
        authorized_company: '',
        专柜: '',
        brand: '',
        business_place: '湖南省长沙市',
        license_scope: '产品质量检验合格',
        category: 'product',
        is_renewed: false,
        is_master: true,
        version_sequence: 1,
        approval_status: 'approved',
        approval_status_label: '已通过',
      },
      {
        id: '6',
        name: '商标注册证',
        cert_no: 'TM2024006',
        type: 'authorization',
        type_label: '授权委托证照',
        sub_type: '商标注册证',
        expiry_date_start: '2024-01-01',
        expiry_date: '2034-01-01',
        is_long_term: false,
        status: 'pending',
        status_label: '待审核',
        approval_status: 'rejected',
        approval_status_label: '已驳回',
        reject_reason: '证书图片不清晰，请重新上传高清扫描件',
        audit_time: '2026-07-05 10:00:00',
        auditor: '零售审核员',
        supplier_code: 'NFS001',
        supplier_name: '湖南山润山茶油销售有限公司',
        authorized_company: '',
        专柜: '',
        brand: '',
        business_place: '湖南省长沙市',
        license_scope: '商标注册证明',
        category: 'authorization',
        is_renewed: false,
        is_master: true,
        version_sequence: 1,
      },
      {
        id: '7',
        name: '产品流通许可证',
        cert_no: 'LT2025001',
        type: 'circulation',
        type_label: '产品流通类证照',
        sub_type: '产品流通许可证',
        expiry_date_start: '2024-01-01',
        expiry_date: '2025-06-30',
        is_long_term: false,
        status: 'expired',
        status_label: '过期',
        expiry_warning: '已过期',
        supplier_code: 'NFS001',
        supplier_name: '湖南省点程供应链管理有限公司',
        authorized_company: '',
        专柜: '',
        brand: '',
        business_place: '湖南省长沙市',
        license_scope: '产品流通许可',
        category: 'circulation',
        is_renewed: false,
        is_master: true,
        version_sequence: 1,
        approval_status: 'approved',
        approval_status_label: '已通过',
      },
      {
        id: '8',
        name: '食品生产许可证',
        cert_no: 'SC2024001',
        type: 'enterprise',
        type_label: '企业资质证照',
        sub_type: '食品生产许可证',
        expiry_date_start: '2020-01-01',
        expiry_date: '2025-06-30',
        is_long_term: false,
        status: 'expired',
        status_label: '过期',
        expiry_warning: '已过期',
        supplier_code: 'NFS001',
        supplier_name: '湖南山润山茶油销售有限公司',
        authorized_company: '',
        专柜: '',
        brand: '',
        business_place: '湖南省长沙市',
        license_scope: '食品生产',
        category: 'enterprise',
        is_renewed: true,
        is_master: true,
        version_sequence: 1,
        approval_status: 'approved',
        approval_status_label: '已通过',
        renewed_cert_id: '9',
      },
      {
        id: '9',
        name: '食品生产许可证（延期申请）',
        cert_no: 'SC2024001',
        type: 'enterprise',
        type_label: '企业资质证照',
        sub_type: '食品生产许可证',
        expiry_date_start: '2025-07-01',
        expiry_date: '2030-06-30',
        is_long_term: false,
        status: 'pending',
        status_label: '待审核',
        expiry_warning: '--',
        supplier_code: 'NFS001',
        supplier_name: '湖南山润山茶油销售有限公司',
        authorized_company: '',
        专柜: '',
        brand: '',
        business_place: '湖南省长沙市',
        license_scope: '食品生产',
        category: 'enterprise',
        is_renewed: false,
        is_master: false,
        version_sequence: 2,
        approval_status: 'pending',
        approval_status_label: '待审核',
        operation_type: 'renew',
        operation_type_label: '延期申请',
        source_cert_id: '8',
      },
      {
        id: '10',
        name: '门店租赁营业执照（延期）',
        cert_no: '320594666202409060054',
        type: 'store_lease',
        type_label: '门店商户租赁证照',
        sub_type: '门店租赁营业执照',
        expiry_date_start: '2026-07-06',
        expiry_date: '2031-07-05',
        is_long_term: false,
        status: 'valid',
        status_label: '正常',
        expiry_warning: '--',
        supplier_code: 'NFS001',
        supplier_name: '湖南山润山茶油销售有限公司',
        authorized_company: '',
        专柜: '格格服饰苏州金鸡湖天虹',
        brand: '格格',
        business_place: '中国（江苏）自由贸易试验区苏州工业园区苏雅路388号新天翔商业广场2幢10室12层b1',
        license_scope: '一般项目：美发饰品销售；日用百货销售',
        category: 'store_lease',
        is_renewed: false,
        is_master: true,
        version_sequence: 2,
        approval_status: 'approved',
        approval_status_label: '已通过',
        operation_type: 'renew',
        operation_type_label: '延期申请',
        source_cert_id: '1',
      },
      {
        id: '11',
        name: '品牌授权书（延期）',
        cert_no: 'ZZ000000000002063106',
        type: 'authorization',
        type_label: '授权委托证照',
        sub_type: '品牌授权书',
        expiry_date_start: '2028-12-31',
        expiry_date: '2033-12-31',
        is_long_term: false,
        status: 'pending',
        status_label: '待审核',
        expiry_warning: '--',
        supplier_code: 'NFS001',
        supplier_name: '湖南山润山茶油销售有限公司',
        authorized_company: '农夫山泉股份有限公司',
        专柜: '',
        brand: '',
        business_place: '湖南省长沙市',
        license_scope: '授权销售代理业务',
        category: 'authorization',
        is_renewed: false,
        is_master: false,
        version_sequence: 2,
        approval_status: 'rejected',
        approval_status_label: '已驳回',
        operation_type: 'renew',
        operation_type_label: '延期申请',
        source_cert_id: '4',
        reject_reason: '延期材料不完整，请补充有效期说明',
        audit_time: '2026-07-05 10:00:00',
        auditor: '零售审核员',
      }
    ];
    setCertificates(mockData);
  };

  const handleCertificateSubmit = async (values: any) => {
    try {
      const selectedType = values.type;
      const category = findCertTypeCategory(selectedType);
      const typeNode = findCertTypeNode(selectedType);

      const certData = {
        name: values.name || typeNode?.label || '',
        cert_no: values.cert_no,
        type: category?.value || 'other',
        type_label: category?.label || '其他',
        sub_type: values.sub_type || typeNode?.label || '',
        category: category?.value || 'other',
        expiry_date: Array.isArray(values.expiry_date) ? values.expiry_date[1] : (values.expiry_date || ''),
        expiry_date_start: Array.isArray(values.expiry_date) ? values.expiry_date[0] : '',
        is_long_term: values.is_long_term || false,
        supplier_code: currentSupplier?.code,
        supplier_name: values.supplier_name || currentSupplier?.name,
        authorized_company: values.authorized_company || '',
        专柜: values.专柜 || '',
        商品: values.商品 || '',
        brand: values.brand || '',
        business_place: values.business_place || '',
        license_scope: values.license_scope || '',
        submit_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };

      if (isRenewMode) {
        // 延期模式：创建延期申请记录（待零售商审核）
        const sourceCert = certificates.find(cert => cert.id === editingCertId);
        const renewApplicationId = `renew_${Date.now()}`;
        const renewApplication = {
          id: renewApplicationId,
          ...certData,
          status: 'pending',              // 待审核状态
          status_label: '待审核',
          operation_type: 'renew',        // 操作类型标识
          operation_type_label: '延期申请',
          source_cert_id: editingCertId,  // 关联原证照ID
          is_master: false,
          version_sequence: (sourceCert?.version_sequence || 1) + 1,
        };
        setCertificates(prev => prev.map(cert =>
          cert.id === editingCertId
            ? { ...cert, is_renewed: true, renewed_cert_id: renewApplicationId }
            : cert
        ).concat(renewApplication));
        message.success('延期申请已提交，等待零售商审核');
      } else if (editingCertId) {
        // 编辑被驳回证照：覆盖原记录并重新进入审批流程
        setCertificates(prev => prev.map(cert =>
          cert.id === editingCertId
            ? {
                ...cert,
                ...certData,
                id: cert.id,
                status: 'pending',
                status_label: '待审核',
                approval_status: 'pending',
                approval_status_label: '待审核',
                reject_reason: undefined,
                audit_time: undefined,
                auditor: undefined,
                submit_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              }
            : cert
        ));
        message.success('证照修改成功，等待零售商审核');
      } else {
        // 新增模式：创建新证照（同样走审批流程）
        const newCertificate = {
          id: Date.now().toString(),
          ...certData,
          status: 'pending',              // 待审核状态
          status_label: '待审核',
          operation_type: 'add',          // 操作类型标识
          operation_type_label: '新增',
        };
        setCertificates([...certificates, newCertificate]);
        message.success('证照上传成功，等待零售商审核');
      }

      setCertificateModalVisible(false);
      certificateForm.resetFields();
      setEditingCertId(null);
      setIsRenewMode(false);
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 人员管理
  const fetchUsers = () => {
    const mockData = [
      {
        id: '1',
        username: 'admin',
        name: '张经理',
        phone: '13800138001',
        supplier_type: 'enterprise',
        status: 'active',
        esign_permission: {
          enabled: true,
          verified: true,
          granted_at: '2024-01-15 10:30:00',
          granted_by: '系统初始化'
        },
        last_login: '2026-01-18 14:30',
        created_at: '2024-01-15 10:30:00',
        supplier_roles: [
          {
            supplier_code: 'NFS001',
            supplier_name: '湖南山润山茶油销售有限公司',
            roles: ['admin'],
            role_names: ['超管'],
            role_type: 'system',
            permissions: {
              business: ['订单管理', '发货管理', '商品管理', '销售数据', '库存查询', '竞价管理', '价格管理', '质量管理'],
              finance: ['财务对账', '对账申请', '发票管理', '交款管理', '费用单管理', '供应链金融'],
              enterprise: ['企业信息管理', '供应商资质证照', '员工管理'],
              cooperation: ['合同管理'],
              system: ['公告通知', '服务中心']
            },
            data_scope: {
              type: 'all',
              label: '全部数据',
              detail: { regions: [], stores: [], counters: [], selectedNames: [] }
            }
          },
          {
            supplier_code: 'NFS002',
            supplier_name: '广州鲜味食品有限公司',
            roles: ['admin'],
            role_names: ['超管'],
            role_type: 'system',
            permissions: {
              business: ['订单管理', '发货管理', '商品管理', '销售数据', '库存查询', '竞价管理', '价格管理', '质量管理'],
              finance: ['财务对账', '对账申请', '发票管理', '交款管理', '费用单管理', '供应链金融'],
              enterprise: ['企业信息管理', '供应商资质证照', '员工管理'],
              cooperation: ['合同管理'],
              system: ['公告通知', '服务中心']
            },
            data_scope: {
              type: 'custom',
              label: '特定范围',
              detail: { regions: ['2'], stores: [], counters: [], selectedNames: ['华东区'] }
            }
          }
        ]
      },
      {
        id: '2',
        username: 'business01',
        name: '李四',
        phone: '13800138002',
        supplier_type: 'personal',
        status: 'active',
        esign_permission: {
          enabled: false,
          verified: false,
          granted_at: '',
          granted_by: ''
        },
        last_login: '2026-01-18 10:15',
        created_at: '2024-02-20 11:20:00',
        supplier_roles: [
          {
            supplier_code: 'NFS001',
            supplier_name: '湖南山润山茶油销售有限公司',
            roles: ['operator', 'clerk'],
            role_names: ['操作员', '店员'],
            role_type: 'custom',
            permissions: {
              business: ['订单管理', '发货管理', '销售数据'],
              finance: ['财务对账', '发票管理'],
              enterprise: [],
              cooperation: [],
              system: ['公告通知']
            },
            data_scope: {
              type: 'custom',
              label: '特定门店',
              detail: { regions: [], stores: ['1'], counters: [], selectedNames: ['广州门店'] }
            }
          }
        ]
      },
      {
        id: '3',
        username: 'finance01',
        name: '王五',
        phone: '13800138003',
        supplier_type: 'enterprise',
        status: 'active',
        esign_permission: {
          enabled: true,
          verified: true,
          granted_at: '2024-03-10 10:00:00',
          granted_by: '张经理'
        },
        last_login: '2026-01-17 16:20',
        created_at: '2024-03-10 09:15:00',
        supplier_roles: [
          {
            supplier_code: 'NFS002',
            supplier_name: '广州鲜味食品有限公司',
            roles: ['finance'],
            role_names: ['财务'],
            role_type: 'system',
            permissions: {
              business: [],
              finance: ['财务对账', '对账申请', '发票管理', '交款管理', '费用单管理'],
              enterprise: ['企业信息管理'],
              cooperation: [],
              system: ['公告通知']
            },
            data_scope: {
              type: 'custom',
              label: '特定区域',
              detail: { regions: ['2'], stores: [], counters: [], selectedNames: ['华东区'] }
            }
          }
        ]
      }
    ];
    setUsers(mockData);
  };

  const fetchRoles = () => {
    const mockData = [
      {
        id: '1',
        code: 'admin',
        name: '超管',
        description: '系统预设角色，拥有所有权限，可管理所有数据和用户权限',
        type: 'system',
        permissions: {
          business: ['订单管理', '发货管理', '商品管理', '销售数据', '库存查询', '竞价管理', '价格管理', '质量管理'],
          finance: ['财务对账', '对账申请', '发票管理', '交款管理', '费用单管理', '供应链金融'],
          enterprise: ['企业信息管理', '供应商资质证照', '员工管理'],
          cooperation: ['合同管理'],
          system: ['公告通知', '服务中心']
        }
      },
      {
        id: '2',
        code: 'finance',
        name: '财务',
        description: '系统预设角色，负责财务对账、发票管理、费用报销等工作',
        type: 'system',
        permissions: {
          business: [],
          finance: ['财务对账', '对账申请', '发票管理', '交款管理', '费用单管理'],
          enterprise: ['企业信息管理'],
          cooperation: [],
          system: ['公告通知']
        }
      },
      {
        id: '3',
        code: 'clerk',
        name: '店员',
        description: '系统预设角色，负责日常业务操作，如订单处理、发货等',
        type: 'system',
        permissions: {
          business: ['订单管理', '发货管理', '销售数据'],
          finance: ['财务对账'],
          enterprise: [],
          cooperation: [],
          system: ['公告通知']
        }
      },
      {
        id: '4',
        code: 'operator',
        name: '操作员',
        description: '系统预设角色，负责日常业务操作',
        type: 'system',
        permissions: {
          business: ['订单管理', '发货管理', '销售数据'],
          finance: ['财务对账', '发票管理'],
          enterprise: [],
          cooperation: [],
          system: ['公告通知']
        }
      }
    ];
    setRoles(mockData);
  };

  // 按供应商编码获取数据权限树（mock 阶段：不同供应商返回不同区域子集）
  const getSupplierTreeData = (supplierCode: string) => {
    if (supplierCode === 'NFS001') {
      return treeData.map(node => ({
        ...node,
        children: node.children?.filter(child => child.title === '华东区' || child.title === '全国')
      })).filter(node => node.title === '全国' || node.children?.length);
    }
    if (supplierCode === 'NFS002') {
      return treeData.map(node => ({
        ...node,
        children: node.children?.filter(child => child.title === '华南区' || child.title === '全国')
      })).filter(node => node.title === '全国' || node.children?.length);
    }
    return treeData;
  };

  // 用户弹窗：获取指定供应商的数据权限配置
  const getSupplierScope = (code: string) =>
    userModalSupplierScopes.find(s => s.supplier_code === code);

  // 合并多个角色的权限（去重）
  const mergeRolePermissions = (roleCodes: string[]) => {
    const result = {
      business: [] as string[],
      finance: [] as string[],
      enterprise: [] as string[],
      cooperation: [] as string[],
      system: [] as string[]
    };
    roleCodes.forEach(code => {
      const role = roles.find(r => r.code === code);
      if (role?.permissions) {
        Object.keys(role.permissions).forEach(key => {
          const k = key as keyof typeof result;
          result[k] = Array.from(new Set([...result[k], ...(role.permissions[k] || [])]));
        });
      }
    });
    return result;
  };

  // 用户弹窗：切换可访问供应商编码时同步维护 supplier_scopes
  const handleSupplierCodesChange = (codes: string[]) => {
    setUserModalSelectedSupplierCodes(codes);
    setUserModalSupplierScopes(prev => {
      const next = prev.filter(s => codes.includes(s.supplier_code));
      codes.forEach(code => {
        if (!next.find(s => s.supplier_code === code)) {
          next.push({
            supplier_code: code,
            supplier_name: supplierCodeNameMap[code] || code,
            roles: [],
            role_names: [],
            role_type: 'custom',
            data_scope: { type: 'all', label: '全部数据', detail: { regions: [], stores: [], counters: [], selectedNames: [] } }
          });
        }
      });
      return [...next];
    });
  };

  // 用户弹窗：切换某个供应商的角色
  const handleSupplierRolesChange = (code: string, roleCodes: string[]) => {
    setUserModalSupplierScopes(prev => prev.map(s => {
      if (s.supplier_code !== code) return s;
      const roleNames = roleCodes.map((c: string) => roles.find(r => r.code === c)?.name).filter(Boolean);
      return {
        ...s,
        roles: roleCodes,
        role_names: roleNames,
        permissions: mergeRolePermissions(roleCodes)
      };
    }));
  };

  // 用户弹窗：切换某个供应商的数据权限类型（全部/自定义）
  const handleSupplierScopeTypeChange = (code: string, type: 'all' | 'custom') => {
    setUserModalSupplierScopes(prev => prev.map(s =>
      s.supplier_code === code
        ? {
            ...s,
            data_scope: {
              ...s.data_scope,
              type,
              label: type === 'all' ? '全部数据' : '特定范围',
              detail: type === 'all' ? { regions: [], stores: [], counters: [], selectedNames: [] } : s.data_scope.detail
            }
          }
        : s
    ));
  };

  // 用户弹窗：打开指定供应商的数据权限树
  const openSupplierScopeTree = (code: string) => {
    setCurrentScopeSupplierCode(code);
    const scope = getSupplierScope(code);
    const keys = scope?.data_scope?.detail ? generateTreeKeysFromDetail(scope.data_scope.detail) : [];
    if (scope?.data_scope?.type === 'all') {
      keys.unshift('national');
    }
    setUserModalSelectedTreeKeys(keys);
    setUserModalTreeScopeVisible(true);
  };

  // 用户弹窗：确认数据权限树选择
  const handleScopeTreeConfirm = () => {
    if (!currentScopeSupplierCode) return;
    const isAll = userModalSelectedTreeKeys.includes('national') || userModalSelectedTreeKeys.length === 0;
    const detail = isAll
      ? { regions: [], stores: [], counters: [], selectedNames: [] }
      : extractDataFromTreeKeys(userModalSelectedTreeKeys);
    setUserModalSupplierScopes(prev => prev.map(s =>
      s.supplier_code === currentScopeSupplierCode
        ? {
            ...s,
            data_scope: {
              type: isAll ? 'all' : 'custom',
              label: isAll ? '全部数据' : (detail.selectedNames?.length ? '特定范围' : '全部数据'),
              detail
            }
          }
        : s
    ));
    setUserModalTreeScopeVisible(false);
    setCurrentScopeSupplierCode(null);
  };

  const handleUserSubmit = async (values: any) => {
    try {
      // 校验供应商权限至少选择一个
      if (userModalSelectedSupplierCodes.length === 0) {
        message.warning('请至少选择一个供应商代码权限');
        return;
      }

      // 计算保存后所有供应商下的角色 code 集合（用于 3 道权限校验）
      const submittingRoleCodes: string[] = [];
      userModalSupplierScopes.forEach(s => {
        if (userModalSelectedSupplierCodes.includes(s.supplier_code)) {
          (s.roles || []).forEach((r: string) => submittingRoleCodes.push(r));
        }
      });
      const submittingHasAdmin = submittingRoleCodes.includes('admin');

      // 校验 1：非超管不能被设为超管（全局硬约束）
      if (submittingHasAdmin && !isCurrentUserAdmin()) {
        message.error('仅超管可授予超管权限');
        return;
      }

      // 校验 2：编辑自己时，禁止变更自己的超管状态（防自提权/自降权）
      if (editingUserId && !isCurrentUserAdmin()) {
        const me = users.find(u => u.id === editingUserId);
        const wasAdmin = !!me?.supplier_roles?.some((sr: any) => Array.isArray(sr.roles) && sr.roles.includes('admin'));
        if (wasAdmin !== submittingHasAdmin) {
          message.error('无权修改自己的超管状态');
          return;
        }
      }

      // 校验 3：非超管角色必须是当前用户角色的子集
      if (!isCurrentUserAdmin()) {
        const myRoles = new Set(getMyRoleCodes());
        userModalSelectedSupplierCodes.forEach(code => {
          const scopeRoles = (userModalSupplierScopes.find(s => s.supplier_code === code)?.roles) || [];
          scopeRoles.forEach((r: string) => {
            if (!myRoles.has(r)) {
              message.error(`您没有角色 ${r} 的分配权限`);
              throw new Error('__role_subset_block__');
            }
          });
        });
      }

      // 校验每个供应商至少选择一个角色
      const invalidScope = userModalSupplierScopes.find(s =>
        userModalSelectedSupplierCodes.includes(s.supplier_code) && (!s.roles || s.roles.length === 0)
      );
      if (invalidScope) {
        message.warning(`请为供应商 ${invalidScope.supplier_code} 选择角色`);
        return;
      }

      // 构建 supplier_roles
      const supplierRoles = userModalSupplierScopes
        .filter(s => userModalSelectedSupplierCodes.includes(s.supplier_code))
        .map(s => {
          const roleNames = (s.roles || []).map((code: string) =>
            roles.find(r => r.code === code)?.name
          ).filter(Boolean);
          return {
            supplier_code: s.supplier_code,
            supplier_name: s.supplier_name || supplierCodeNameMap[s.supplier_code] || s.supplier_code,
            roles: s.roles || [],
            role_names: roleNames,
            role_type: s.role_type || 'custom',
            permissions: mergeRolePermissions(s.roles || []),
            data_scope: s.data_scope || { type: 'all', label: '全部数据', detail: { regions: [], stores: [], counters: [], selectedNames: [] } }
          };
        });

      // 构建更新的用户数据
      const updatedUserData = {
        name: values.name,
        phone: values.phone,
        supplier_roles: supplierRoles,
      };

      if (editingUserId) {
        // 编辑模式：更新已有用户
        const updatedUsers = users.map(u =>
          u.id === editingUserId ? { ...u, ...updatedUserData } : u
        );
        setUsers(updatedUsers);
      } else {
        // 新建模式：追加新用户
        const newUser = {
          id: Date.now().toString(),
          ...updatedUserData,
          supplier_type: 'enterprise',
          status: 'active',
          esign_permission: { enabled: false, verified: false, granted_at: '', granted_by: '' },
          last_login: '-',
          created_at: new Date().toLocaleString()
        };
        setUsers([...users, newUser]);
      }

      message.success('用户保存成功');
      setUserModalVisible(false);
      userForm.resetFields();

      // 重置数据权限状态、供应商权限状态和编辑状态
      setUserModalSelectedTreeKeys([]);
      setUserModalSelectedSupplierCodes([]);
      setUserModalSupplierScopes([]);
      setCurrentScopeSupplierCode(null);
      setEditingUserId(null);
    } catch (error) {
      // 三道权限校验已在函数内 message + return 拦截，这里是真正的保存异常
      message.error('保存失败');
    }
  };

  // 查看用户详情
  const handleViewUserDetail = (user: any) => {
    setSelectedUser(user);
    setDetailActiveSupplierCode(user.supplier_roles?.[0]?.supplier_code || selectedUserSupplierCode || '');
    setUserDetailVisible(true);
  };

  // 编辑用户
  const handleEditUser = (user: any) => {
    userForm.setFieldsValue({
      name: user.name,
      phone: user.phone,
    });

    // 初始化供应商权限选择（从 supplier_roles 提取）
    if (user.supplier_roles && user.supplier_roles.length > 0) {
      const codes = user.supplier_roles.map((sr: any) => sr.supplier_code);
      setUserModalSelectedSupplierCodes(codes);
      setUserModalSupplierScopes(user.supplier_roles.map((sr: any) => ({
        supplier_code: sr.supplier_code,
        supplier_name: sr.supplier_name || supplierCodeNameMap[sr.supplier_code] || sr.supplier_code,
        roles: sr.roles || [],
        role_names: sr.role_names || [],
        role_type: sr.role_type || 'custom',
        data_scope: sr.data_scope || { type: 'all', label: '全部数据', detail: { regions: [], stores: [], counters: [], selectedNames: [] } }
      })));
    } else {
      // 默认使用当前选中的供应商代码
      const defaultCodes = selectedUserSupplierCode ? [selectedUserSupplierCode] : (currentSupplier?.codes || []);
      setUserModalSelectedSupplierCodes(defaultCodes);
      setUserModalSupplierScopes(defaultCodes.map((code: string) => ({
        supplier_code: code,
        supplier_name: supplierCodeNameMap[code] || code,
        roles: [],
        role_names: [],
        role_type: 'custom',
        data_scope: { type: 'all', label: '全部数据', detail: { regions: [], stores: [], counters: [], selectedNames: [] } }
      })));
    }

    // 标记为编辑模式
    setEditingUserId(user.id);
    setUserModalVisible(true);
  };

  // 权限设置
  const handlePermissionSetting = (user: any) => {
    const currentSr = user.supplier_roles?.find((sr: any) => sr.supplier_code === selectedUserSupplierCode);
    if (!isCurrentUserAdmin() && currentSr?.roles?.includes('admin')) {
      message.warning('无权修改超管权限');
      return;
    }
    setSelectedUser(user);
    setSelectedRolesForSetting(currentSr?.roles || []);

    if (currentSr?.permissions) {
      setPermissionSettings({
        business: currentSr.permissions.business || [],
        finance: currentSr.permissions.finance || [],
        enterprise: currentSr.permissions.enterprise || [],
        cooperation: currentSr.permissions.cooperation || [],
        system: currentSr.permissions.system || []
      });
    }
    
    // 初始化树状选择
    if (currentSr?.data_scope?.detail) {
      const keys = generateTreeKeysFromDetail(currentSr.data_scope.detail);
      // 如果是全部数据，添加全国节点
      if (currentSr.data_scope.type === 'all') {
        keys.unshift('national');
      }
      setSelectedTreeKeys(keys);
    } else {
      setSelectedTreeKeys([]);
    }
    
    // 初始化电签权限状态
    if (user.esign_permission) {
      setEsignPermission({
        enabled: user.esign_permission.enabled || false,
        verified: user.esign_permission.verified || false
      });
    } else {
      setEsignPermission({
        enabled: false,
        verified: false
      });
    }
    
    setPermissionModalVisible(true);
  };

  // 保存权限设置
  const handlePermissionSave = () => {
    if (!selectedUser) return;

    const roleNames = selectedRolesForSetting.map((code: string) =>
      roles.find(r => r.code === code)?.name
    ).filter(Boolean);

    // 从树状选择中提取数据
    const extracted = extractDataFromTreeKeys(selectedTreeKeys);
    const dataScopeLabel = selectedTreeKeys.includes('national') || selectedTreeKeys.length === 0
      ? '全部门店'
      : '特定范围';

    // 构建电签权限数据
    let esignPermissionData = selectedUser.esign_permission || {
      enabled: false,
      verified: false,
      granted_at: '',
      granted_by: ''
    };

    // 如果电签权限状态有变化
    if (esignPermission.enabled !== esignPermissionData.enabled) {
      if (esignPermission.enabled) {
        // 授予电签权限
        esignPermissionData = {
          ...esignPermissionData,
          enabled: true,
          granted_at: new Date().toLocaleString(),
          granted_by: '当前用户' // 实际应用中应该是当前登录用户
        };
      } else {
        // 撤销电签权限
        esignPermissionData = {
          ...esignPermissionData,
          enabled: false,
          granted_at: '',
          granted_by: ''
        };
      }
    }

    const updatedUsers = users.map(u => {
      if (u.id === selectedUser.id) {
        const updatedSupplierRoles = (u.supplier_roles || []).map((sr: any) => {
          if (sr.supplier_code !== selectedUserSupplierCode) return sr;
          return {
            ...sr,
            roles: selectedRolesForSetting,
            role_names: roleNames,
            role_type: selectedRolesForSetting.length > 0 ? 'custom' : (sr.role_type || 'custom'),
            permissions: { ...permissionSettings },
            data_scope: {
              type: selectedTreeKeys.includes('national') ? 'all' : 'custom',
              label: dataScopeLabel,
              detail: {
                regions: extracted.regions,
                stores: extracted.stores,
                counters: extracted.counters,
                selectedNames: extracted.selectedNames
              }
            }
          };
        });
        return {
          ...u,
          supplier_roles: updatedSupplierRoles,
          esign_permission: esignPermissionData
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    setPermissionModalVisible(false);
    message.success('权限设置保存成功');
  };

  // 禁用/启用用户
  const handleToggleUserStatus = (user: any) => {
    Modal.confirm({
      title: user.status === 'active' ? '禁用确认' : '启用确认',
      content: `确定要${user.status === 'active' ? '禁用' : '启用'}"${user.name}"吗？`,
      onOk: () => {
        const updatedUsers = users.map(u =>
          u.id === user.id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
        );
        setUsers(updatedUsers);
        message.success(`已${user.status === 'active' ? '禁用' : '启用'}用户`);
      }
    });
  };

  // 删除用户
  const handleDeleteUser = (user: any) => {
    Modal.confirm({
      title: '删除确认',
      content: `确定要删除"${user.name}"吗？`,
      okType: 'danger',
      onOk: () => {
        setUsers(users.filter(u => u.id !== user.id));
        message.success('用户已删除');
      }
    });
  };

  const handleTransferSuccess = () => {
    setTransferVisible(false);
    message.success('超管权限已转让');
  };

  // 渲染权限标签辅助函数
  const renderPermissionTags = (permissions: string[]) => {
    if (!permissions || permissions.length === 0) {
      return <span style={{ color: '#999', fontSize: 12 }}>无此类别权限</span>;
    }
    return (
      <div>
        {permissions.map((perm: string) => (
          <Tag key={perm} color="blue" style={{ marginBottom: 4, marginRight: 4 }}>
            {perm}
          </Tag>
        ))}
      </div>
    );
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

  // 供应商代码名称映射
  const supplierCodeNameMap: Record<string, string> = {
    'NFS001': '农夫山泉股份有限公司',
    'NFS002': '农夫山泉北京分公司',
    'NFS003': '农夫山泉上海分公司',
  };

  const userColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 80,
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (text: string) => <PhoneDisplay phone={text} />
    },
    {
      title: '角色',
      key: 'role_names',
      width: 150,
      render: (_: any, record: any) => {
        const sr = record.supplier_roles?.find((item: any) => item.supplier_code === selectedUserSupplierCode);
        const roleNames = sr?.role_names || [];
        return (
          <Space size="small" wrap>
            {roleNames.map((name: string, idx: number) => (
              <Tag key={idx} color="blue">{name}</Tag>
            ))}
          </Space>
        );
      }
    },
    {
      title: '供应商权限',
      key: 'supplier_codes',
      width: 100,
      render: (_: any, record: any) => (
        record.supplier_roles && record.supplier_roles.length > 0
          ? record.supplier_roles.map((sr: any) => (
              <Tooltip key={sr.supplier_code} title={`${sr.supplier_code} - ${sr.supplier_name || supplierCodeNameMap[sr.supplier_code] || sr.supplier_code}`}>
                <Tag style={{ margin: '2px', cursor: 'pointer' }}>{sr.supplier_code}</Tag>
              </Tooltip>
            ))
          : <span style={{ color: '#999' }}>-</span>
      )
    },
    {
      title: '实名认证',
      dataIndex: ['esign_permission', 'verified'],
      key: 'esign_verified',
      width: 90,
      render: (verified: boolean) => (
        <Tag color={verified ? 'success' : 'default'}>
          {verified ? '已认证' : '未认证'}
        </Tag>
      )
    },
    {
      title: '电签权限',
      dataIndex: ['esign_permission', 'enabled'],
      key: 'esign_enabled',
      width: 100,
      render: (enabled: boolean, record: any) => {
        if (record.supplier_type === 'personal') {
          return <span style={{ color: '#999' }}>--</span>;
        }
        const hasPermission = enabled && record.esign_permission?.verified;
        return (
          <Switch
            size="small"
            checked={hasPermission}
            onChange={(checked) => handleEsignSwitchChange(record.id, checked)}
            disabled={!record.esign_permission?.verified}
          />
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 70,
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
      key: 'last_login',
      width: 150
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleViewUserDetail(record)}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => handleEditUser(record)} disabled={!canModifyUser(record)}>
            编辑
          </Button>
          <Button type="link" size="small" onClick={() => handleToggleUserStatus(record)} disabled={!canModifyUser(record)}>
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
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
                          <strong>关联供应商代码：</strong>
                          {currentSupplier.codes.map((code: string) => (
                            <Tag key={code} style={{ marginRight: '4px' }}>{code}</Tag>
                          ))}
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>法定代表人：</strong>{currentSupplier.legal_person}
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>企业地址：</strong>{currentSupplier.address}
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>联系电话：</strong><PhoneDisplay phone={currentSupplier.phone} />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>统一社会信用代码：</strong>{currentSupplier.credit_code}
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card>
            </Col>

            {/* 电签权限管理 */}
            <Col xs={24}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SafetyCertificateOutlined style={{ color: '#1890ff' }} />
                    <span>电签权限管理</span>
                  </div>
                }
              >
                {/* 授权链路 Steps */}
                <Steps
                  current={(() => {
                    if (!esignAuthInfo) return 0;
                    if (esignAuthInfo.status === 'rejected' || esignAuthInfo.status === 'pending') return 1;
                    if (esignAuthInfo.status === 'approved') {
                      const userInfo = JSON.parse(localStorage.getItem('supplier_userInfo') || '{}');
                      const personalVerified = userInfo?.personal_verified;
                      if (!personalVerified) return 2;
                      if (enterpriseAuthStatus !== 'verified') return 3;
                    }
                    return 3;
                  })()}
                  size="small"
                  style={{ marginBottom: '24px' }}
                  items={[
                    { title: '授权书申请' },
                    { title: '审核确认' },
                    { title: '个人认证' },
                    { title: '企业认证' },
                  ]}
                />

                {/* 步骤1：授权书申请 */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>授权委托书申请</strong></span>
                    {esignAuthInfo ? (
                      <Space>
                        <Tag color={esignAuthInfo.status === 'approved' ? 'green' : esignAuthInfo.status === 'rejected' ? 'red' : 'blue'}>
                          {esignAuthInfo.status === 'approved' ? '已通过' : esignAuthInfo.status === 'rejected' ? '已驳回' : '审核中'}
                        </Tag>
                        {esignAuthInfo.status === 'rejected' && (
                          <Button type="primary" size="small" icon={<FileTextOutlined />} onClick={() => setEsignApplyModalVisible(true)}>
                            重新提交
                          </Button>
                        )}
                      </Space>
                    ) : (
                      <Button type="primary" size="small" icon={<FileTextOutlined />} onClick={() => setEsignApplyModalVisible(true)}>
                        提交申请
                      </Button>
                    )}
                  </div>
                </div>

                {/* 步骤2：审核确认 */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>审核确认</strong></span>
                    {esignAuthInfo ? (
                      <Tag color={esignAuthInfo.status === 'approved' ? 'green' : esignAuthInfo.status === 'rejected' ? 'red' : 'default'}>
                        {esignAuthInfo.status === 'approved' ? '已通过' : esignAuthInfo.status === 'rejected' ? '已驳回' : '待审核'}
                      </Tag>
                    ) : (
                      <span style={{ color: '#999', fontSize: 12 }}>请先提交授权书申请</span>
                    )}
                  </div>
                  {esignAuthInfo && (
                    <>
                      <Alert
                        message={esignAuthInfo.status === 'pending' ? '审核中' : esignAuthInfo.status === 'approved' ? '已通过' : '已驳回'}
                        description={esignAuthInfo.status === 'pending'
                          ? `申请时间：${esignAuthInfo.applyTime}，请等待零售商管理员审核`
                          : esignAuthInfo.status === 'approved'
                            ? `授权编号：${esignAuthInfo.authNo}，有效期至：${esignAuthInfo.expireTime}`
                            : `驳回原因：${esignAuthInfo.rejectReason || '请联系零售商管理员了解详情'}`
                        }
                        type={esignAuthInfo.status === 'approved' ? 'success' : esignAuthInfo.status === 'rejected' ? 'error' : 'info'}
                        showIcon
                        style={{ marginTop: '12px' }}
                      />
                    </>
                  )}
                </div>

                {/* 步骤3：个人认证 */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>个人实名认证</strong></span>
                    {(() => {
                      const userInfo = JSON.parse(localStorage.getItem('supplier_userInfo') || '{}');
                      const verified = userInfo?.personal_verified;
                      if (verified) return <Tag color="green">已完成</Tag>;
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {esignAuthInfo?.status !== 'approved' && (
                            <span style={{ color: '#999', fontSize: 12 }}>请先通过授权书审核</span>
                          )}
                          <Button
                            type="primary"
                            size="small"
                            disabled={esignAuthInfo?.status !== 'approved'}
                            onClick={() => setPersonalAuthVisible(true)}
                          >
                            前往认证
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 步骤4：企业认证 */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>企业认证</strong></span>
                    {(() => {
                      const userInfo = JSON.parse(localStorage.getItem('supplier_userInfo') || '{}');
                      const personalVerified = userInfo?.personal_verified;
                      if (enterpriseAuthStatus === 'verified') return <Tag color="green">已完成</Tag>;
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {(!esignAuthInfo || esignAuthInfo.status !== 'approved' || !personalVerified) && (
                            <span style={{ color: '#999', fontSize: 12 }}>
                              {!personalVerified ? '请先完成个人认证' : '请先通过授权书审核'}
                            </span>
                          )}
                          <Button
                            type="primary"
                            size="small"
                            disabled={esignAuthInfo?.status !== 'approved' || !personalVerified}
                            onClick={() => window.open(ESIGN_CONFIG.AUTH_URL + '?type=enterprise', '_blank')}
                          >
                            前往企业认证
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 下属用户授权（审核通过后显示） */}
                {esignAuthInfo && esignAuthInfo.status === 'approved' && (
                  <>
                    <Divider>下属用户电签授权</Divider>
                    <Table
                      dataSource={users.filter(u => !u.supplier_roles?.some((sr: any) => sr.roles?.includes('admin')))}
                      rowKey="id"
                      size="small"
                      pagination={false}
                      columns={[
                        { title: '姓名', dataIndex: 'name', width: 100 },
                        { title: '角色', key: 'role_names', width: 160, render: (_: any, record: any) => {
                          const roleNames = (record.supplier_roles || []).flatMap((sr: any) => sr.role_names || []);
                          return roleNames.length > 0 ? roleNames.map((name: string, idx: number) => <Tag key={idx}>{name}</Tag>) : <Tag>--</Tag>;
                        }},
                        {
                          title: '实名认证',
                          width: 100,
                          render: (_: any, record: any) => (
                            <Tag color={record.esign_permission?.verified ? 'green' : 'default'}>
                              {record.esign_permission?.verified ? '已认证' : '未认证'}
                            </Tag>
                          )
                        },
                        {
                          title: '电签状态',
                          width: 120,
                          render: (_: any, record: any) => (
                            <Switch
                              size="small"
                              checked={!!(esignSwitchStates[record.id] ?? record.esign_permission?.enabled)}
                              onChange={(checked) => handleEsignSwitchChange(record.id, checked)}
                              disabled={!record.esign_permission?.verified}
                            />
                          )
                        },
                      ]}
                    />
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      );
    } else if (path === '/account/certificates') {
      // 证照合并状态计算（列表展示 + 搜索过滤共用）
      const getCombinedCertStatus = (record: any) => {
        const { status, approval_status, is_renewed, operation_type } = record;

        // 延期被驳回
        if (operation_type === 'renew' && approval_status === 'rejected') {
          return { value: 'renewal_rejected', label: '延期被驳回', color: 'orange' };
        }

        // 新增/修改被驳回
        if (approval_status === 'rejected' && status === 'pending') {
          return { value: 'rejected', label: '已驳回', color: 'red' };
        }

        // 延期申请中（原证照已提交延期 或 延期记录待审核）
        if ((is_renewed && approval_status === 'pending') || (operation_type === 'renew' && approval_status === 'pending')) {
          return { value: 'renewal_pending', label: '延期申请中', color: 'blue' };
        }

        // 已延期
        if (operation_type === 'renew' && approval_status === 'approved') {
          return { value: 'renewal_approved', label: '已延期', color: 'green' };
        }

        // 过期未延期
        if (status === 'expired') {
          return { value: 'expired', label: '过期', color: 'red' };
        }

        // 待审核（新增/修改）
        if (status === 'pending') {
          return { value: 'pending', label: '待审核', color: 'blue' };
        }

        // 正常（含临期，临期预警由单独列展示）
        return { value: 'valid', label: '正常', color: 'green' };
      };

      // --- 证照过滤逻辑 ---
      const getFilteredCertificates = () => {
        return certificates.filter((cert: any) => {
          // 按 分类Tab 过滤
          if (certCategoryTab !== 'all' && cert.category !== certCategoryTab) return false;
          // 按搜索条件过滤
          if (certSearchForm.name && !cert.name.includes(certSearchForm.name)) return false;
          if (certSearchForm.type && cert.type !== certSearchForm.type) return false;
          if (certSearchForm.certNo && !cert.cert_no.includes(certSearchForm.certNo)) return false;
          if (certSearchForm.status) {
            const combinedStatus = getCombinedCertStatus(cert);
            if (combinedStatus.value !== certSearchForm.status) return false;
          }
          return true;
        });
      };

      const filteredCerts = getFilteredCertificates();

      // 证照操作：新增
      const handleAddCert = () => {
        setEditingCertId(null);
        setIsRenewMode(false);
        certificateForm.resetFields();
        setCertificateModalVisible(true);
      };

      // 证照操作：延期
      const handleRenewCert = (record: any) => {
        setEditingCertId(record.id);
        setIsRenewMode(true);

        // 安全构建有效期数组（RangePicker 需要 dayjs 对象，不能传字符串）
        let expiryDateValue: any = undefined;
        if (record.expiry_date_start && record.expiry_date) {
          expiryDateValue = [dayjs(record.expiry_date_start), dayjs(record.expiry_date)];
        } else if (record.expiry_date) {
          expiryDateValue = [dayjs(), dayjs(record.expiry_date)];
        }

        const typeNode = record.sub_type ? findCertTypeNodeByLabel(record.sub_type) : null;
        certificateForm.setFieldsValue({
          supplier_name: record.supplier_name || currentSupplier?.name,
          authorized_company: record.authorized_company || '',
          type: typeNode?.value || record.type,
          name: record.name || '',
          sub_type: record.sub_type || '',
          type_label: record.type_label || '',
          cert_no: record.cert_no || '',
          expiry_date: expiryDateValue,
          is_long_term: record.is_long_term || false,
          专柜: record.专柜 || '',
          商品: record.商品 || '',
          brand: record.brand || '',
          business_place: record.business_place || '',
          license_scope: record.license_scope || '',
        });
        setCertificateModalVisible(true);
      };

      // 证照操作：修改被驳回证照并重新提交
      const handleEditRejectedCert = (record: any) => {
        setEditingCertId(record.id);
        setIsRenewMode(false);

        // 安全构建有效期数组（RangePicker 需要 dayjs 对象，不能传字符串）
        let expiryDateValue: any = undefined;
        if (record.expiry_date_start && record.expiry_date) {
          expiryDateValue = [dayjs(record.expiry_date_start), dayjs(record.expiry_date)];
        } else if (record.expiry_date) {
          expiryDateValue = [dayjs(), dayjs(record.expiry_date)];
        }

        const typeNode = record.sub_type ? findCertTypeNodeByLabel(record.sub_type) : null;
        certificateForm.setFieldsValue({
          type: typeNode?.value || record.type,
          name: record.name || '',
          sub_type: record.sub_type || '',
          type_label: record.type_label || '',
          cert_no: record.cert_no || '',
          expiry_date: expiryDateValue,
          is_long_term: record.is_long_term || false,
          supplier_name: record.supplier_name || currentSupplier?.name,
          authorized_company: record.authorized_company || '',
          专柜: record.专柜 || '',
          商品: record.商品 || '',
          brand: record.brand || '',
          business_place: record.business_place || '',
          license_scope: record.license_scope || '',
        });
        setCertificateModalVisible(true);
      };

      // 证照操作：查看详情
      const handleViewCert = (record: any) => {
        setSelectedCert(record);
        setCertDetailVisible(true);
      };

      // 获取证照版本链
      const getCertVersionChain = (record: any) => {
        const chain: any[] = [];
        // 向前追溯原证照
        let current = record;
        while (current?.source_cert_id) {
          const prev = certificates.find((c: any) => c.id === current.source_cert_id);
          if (!prev || chain.some(c => c.id === prev.id)) break;
          chain.unshift(prev);
          current = prev;
        }
        // 加入当前证照
        chain.push(record);
        // 向后追溯延期证照
        current = record;
        while (current?.renewed_cert_id) {
          const next = certificates.find((c: any) => c.id === current.renewed_cert_id);
          if (!next || chain.some(c => c.id === next.id)) break;
          chain.push(next);
          current = next;
        }
        return chain;
      };

      // 证照操作：查看版本链
      const handleViewCertVersionChain = (record: any) => {
        const chain = getCertVersionChain(record);
        Modal.info({
          title: '证照版本链',
          width: 640,
          content: (
            <div style={{ marginTop: 16 }}>
              {chain.map((cert, index) => (
                <div key={cert.id} style={{ marginBottom: 12, padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                    V{cert.version_sequence || 1} {cert.is_master ? <Tag color="green">主证照</Tag> : <Tag>历史版本</Tag>}
                  </div>
                  <div>证照名称：{cert.name}</div>
                  <div>证书编号：{cert.cert_no}</div>
                  <div>有效期：{cert.expiry_date_start || '-'} 至 {cert.expiry_date}</div>
                  <div>状态：<Tag color={cert.status === 'valid' ? 'green' : cert.status === 'expired' ? 'red' : 'blue'}>{cert.status_label}</Tag></div>
                </div>
              ))}
            </div>
          ),
        });
      };

      // 证照操作：删除
      const handleDeleteCert = (id: string) => {
        Modal.confirm({
          title: '确认删除',
          content: '确定要删除该证照吗？删除后不可恢复。',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            setCertificates(certificates.filter((c: any) => c.id !== id));
            message.success('删除成功');
          },
        });
      };

      // 证照搜索：查询
      const handleCertSearch = () => {
        // 触发重新渲染即可（filteredCerts 自动重新计算）
      };

      // 证照搜索：重置
      const handleCertReset = () => {
        setCertSearchForm({ name: '', type: undefined, certNo: '', status: undefined });
      };

      // 表格列定义
      const certColumns = [
        {
          title: '证照名称',
          dataIndex: 'name',
          key: 'name',
          width: 200,
          render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
        },
        {
          title: '证照类型',
          dataIndex: 'type_label',
          key: 'type_label',
          width: 150,
        },
        {
          title: '证书编号',
          dataIndex: 'cert_no',
          key: 'cert_no',
          width: 200,
          render: (text: string) => (
            text.length > 25 ? <Tooltip title={text}><span>{text.slice(0, 25)}...</span></Tooltip> : text
          ),
        },
        {
          title: '有效期',
          dataIndex: 'expiry_date',
          key: 'expiry_date',
          width: 120,
          render: (_: any, record: any) => (
            <span>{record.expiry_date}{record.is_long_term ? '(长期)' : ''}</span>
          ),
        },
        {
          title: '状态',
          key: 'status',
          width: 100,
          render: (_: any, record: any) => {
            const status = getCombinedCertStatus(record);
            return <Tag color={status.color}>{status.label}</Tag>;
          },
        },
        {
          title: '临期预警',
          dataIndex: 'expiry_warning',
          key: 'expiry_warning',
          width: 120,
          render: (text: string) => {
            if (!text || text === '--') return <span style={{ color: '#999' }}>--</span>;
            const isExpired = text.includes('已过期');
            return <Tag color={isExpired ? 'red' : 'orange'}>{text}</Tag>;
          },
        },
        {
          title: '是否主证照',
          dataIndex: 'is_master',
          key: 'is_master',
          width: 110,
          render: (isMaster: boolean) => (
            <Tag color={isMaster ? 'green' : 'default'}>{isMaster ? '主证照' : '历史版本'}</Tag>
          ),
        },
        {
          title: '操作',
          key: 'actions',
          width: 200,
          render: (_: any, record: any) => (
            <Space size="small">
              {record.status === 'expired' && !record.is_renewed && record.approval_status !== 'pending' && (
                <Button size="small" type="link" onClick={() => handleRenewCert(record)}>延期</Button>
              )}
              {record.approval_status === 'rejected' && (
                <Button size="small" type="link" onClick={() => handleEditRejectedCert(record)}>修改并重新提交</Button>
              )}
              {record.approval_status === 'rejected' && (
                <Button size="small" type="link" onClick={() => Modal.info({ title: '驳回原因', content: record.reject_reason })}>查看原因</Button>
              )}
              <Button size="small" type="link" onClick={() => handleViewCert(record)}>查看</Button>
              {(record.source_cert_id || record.renewed_cert_id) && (
                <Button size="small" type="link" onClick={() => handleViewCertVersionChain(record)}>版本链</Button>
              )}
            </Space>
          ),
        },
      ];

      // 供应商资质证照页面
      return (
        <div>
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card
                title="证照管理"
                extra={
                  <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCert}>新增证照</Button>
                  </Space>
                }
              >
                {/* 可展开搜索面板 */}
                <div style={{ marginBottom: 16 }}>
                  <AdvancedSearchFilter
                    fields={[
                      { key: 'name', label: '证照名称', type: 'input', placeholder: '请输入证照名称' },
                      { key: 'type', label: '证照类型', type: 'select', placeholder: '请选择',
                        options: CERT_TYPE_OPTIONS.map(item => ({ label: item.label, value: item.value }))
                      },
                      { key: 'certNo', label: '证书编号', type: 'input', placeholder: '请输入证书编号' },
                      { key: 'status', label: '状态', type: 'select', placeholder: '请选择',
                        options: CERT_STATUS_OPTIONS.map(opt => ({ label: opt.label, value: opt.value }))
                      }
                    ]}
                    values={certSearchForm}
                    onChange={(k, v) => setCertSearchForm({ ...certSearchForm, [k]: v })}
                    onSearch={handleCertSearch}
                    onReset={handleCertReset}
                  />
                </div>

                {/* 分类 Tab */}
                <Tabs activeKey={certCategoryTab} onChange={(key) => { setCertCategoryTab(key); }} style={{ marginBottom: 16 }}>
                  {CERT_CATEGORY_TABS.map(tab => (
                    <Tabs.TabPane tab={tab.label} key={tab.key} />
                  ))}
                </Tabs>

                {/* 过期未延期提示 */}
                {filteredCerts.some(cert => cert.status === 'expired' && !cert.is_renewed) && (
                  <Alert
                    message="存在已过期且未申请延期的证照，请及时处理"
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}

                {/* 数据表格 */}
                <Table
                  columns={certColumns}
                  dataSource={filteredCerts}
                  rowKey="id"
                  pagination={{
                    showTotal: (total) => `共${total}条`,
                    pageSize: 10,
                    showSizeChanger: false,
                  }}
                  scroll={{ x: 1100 }}
                  size="middle"
                />

                {/* 证照详情 Drawer */}
                <Drawer
                  title="证照详情"
                  placement="right"
                  width={680}
                  visible={certDetailVisible}
                  onClose={() => setCertDetailVisible(false)}
                >
                  {selectedCert && (
                    <>
                    <Descriptions column={2} bordered size="small" labelStyle={{ width: '100px' }}>
                      <Descriptions.Item label="证照名称" span={2}>{selectedCert.name}</Descriptions.Item>
                      <Descriptions.Item label="证照类型">{selectedCert.type_label}</Descriptions.Item>
                      <Descriptions.Item label="证照子类">{selectedCert.sub_type || '-'}</Descriptions.Item>
                      <Descriptions.Item label="证书编号" span={2}>
                        <Tooltip title={selectedCert.cert_no}>{selectedCert.cert_no}</Tooltip>
                      </Descriptions.Item>
                      <Descriptions.Item label="有效期起始">{selectedCert.expiry_date_start || '-'}</Descriptions.Item>
                      <Descriptions.Item label="有效期至">
                        {selectedCert.expiry_date}
                        {selectedCert.is_long_term ? '（长期）' : ''}
                      </Descriptions.Item>
                      <Descriptions.Item label="状态">
                        <Tag color={selectedCert.status === 'valid' ? 'green' : selectedCert.status === 'expired' ? 'red' : 'blue'}>
                          {selectedCert.status_label}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="审核状态">
                        <Tag color={selectedCert.approval_status === 'approved' ? 'green' : selectedCert.approval_status === 'rejected' ? 'red' : 'blue'}>
                          {selectedCert.approval_status_label || selectedCert.approval_status}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="版本序号">V{selectedCert.version_sequence || 1}</Descriptions.Item>
                      <Descriptions.Item label="是否主证照">
                        <Tag color={selectedCert.is_master ? 'green' : 'default'}>
                          {selectedCert.is_master ? '主证照' : '历史版本'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="关联原证照">
                        {selectedCert.source_cert_id
                          ? (() => {
                              const parent = certificates.find((c: any) => c.id === selectedCert.source_cert_id);
                              return parent
                                ? <Button type="link" size="small" onClick={() => handleViewCert(parent)}>{parent.name}</Button>
                                : selectedCert.source_cert_id;
                            })()
                          : '-'}
                      </Descriptions.Item>
                      <Descriptions.Item label="后续延期证照">
                        {selectedCert.renewed_cert_id
                          ? (() => {
                              const child = certificates.find((c: any) => c.id === selectedCert.renewed_cert_id);
                              return child
                                ? <Button type="link" size="small" onClick={() => handleViewCert(child)}>{child.name}</Button>
                                : selectedCert.renewed_cert_id;
                            })()
                          : '-'}
                      </Descriptions.Item>
                      <Descriptions.Item label="临期预警">
                        {selectedCert.expiry_warning !== '--'
                          ? <Tag color={selectedCert.expiry_warning?.includes('过期') ? 'red' : 'orange'}>{selectedCert.expiry_warning}</Tag>
                          : '--'}
                      </Descriptions.Item>
                      <Descriptions.Item label="延期状态">
                        {(() => {
                          if (selectedCert.status === 'expired' && !selectedCert.is_renewed) {
                            return <Tag color="error">未延期</Tag>;
                          }
                          if (selectedCert.is_renewed) {
                            if (selectedCert.approval_status === 'approved') return <Tag color="success">已延期</Tag>;
                            if (selectedCert.approval_status === 'rejected') return <Tag color="warning">延期被驳回</Tag>;
                            return <Tag color="processing">延期申请中</Tag>;
                          }
                          return '-';
                        })()}
                      </Descriptions.Item>
                      {selectedCert.approval_status === 'rejected' && (
                        <Descriptions.Item label="驳回原因" span={2}>{selectedCert.reject_reason || '-'}</Descriptions.Item>
                      )}
                      {selectedCert.audit_time && (
                        <Descriptions.Item label="审核时间">{selectedCert.audit_time}</Descriptions.Item>
                      )}
                      {selectedCert.auditor && (
                        <Descriptions.Item label="审核人">{selectedCert.auditor}</Descriptions.Item>
                      )}
                      <Descriptions.Item label="供应商" span={2}>{selectedCert.supplier_name}</Descriptions.Item>
                      <Descriptions.Item label="授权企业">{selectedCert.authorized_company || '-'}</Descriptions.Item>
                      <Descriptions.Item label="专柜">{selectedCert.专柜 || '-'}</Descriptions.Item>
                      <Descriptions.Item label="品牌">{selectedCert.brand || '-'}</Descriptions.Item>
                      <Descriptions.Item label="经营场所" span={2}>{selectedCert.business_place || '-'}</Descriptions.Item>
                      <Descriptions.Item label="许可范围" span={2}>{selectedCert.license_scope || '-'}</Descriptions.Item>
                    </Descriptions>
                    <div style={{ marginTop: 24 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 16, fontSize: 16 }}>延期记录</div>
                      <Timeline>
                        {getCertVersionChain(selectedCert).map((cert) => (
                          <Timeline.Item
                            key={cert.id}
                            color={cert.id === selectedCert.id ? 'blue' : 'gray'}
                          >
                            <div style={{ fontWeight: cert.id === selectedCert.id ? 'bold' : 'normal' }}>
                              V{cert.version_sequence || 1} {cert.operation_type_label || '新增'}
                            </div>
                            <div style={{ color: '#666', fontSize: 12 }}>
                              有效期：{cert.expiry_date_start || '-'} 至 {cert.expiry_date}
                            </div>
                            <div>
                              <Tag color={cert.approval_status === 'approved' ? 'green' : cert.approval_status === 'rejected' ? 'red' : 'blue'}>
                                {cert.approval_status_label || cert.approval_status || '待审核'}
                              </Tag>
                              {cert.approval_status === 'rejected' && cert.reject_reason && (
                                <span style={{ color: '#999', marginLeft: 8 }}>驳回：{cert.reject_reason}</span>
                              )}
                            </div>
                            {cert.audit_time && (
                              <div style={{ color: '#999', fontSize: 12 }}>审核时间：{cert.audit_time}</div>
                            )}
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </div>
                  </>
                  )}
                </Drawer>
              </Card>
            </Col>
          </Row>
        </div>
      );
    } else if (path === '/account/users') {
      if (!isCurrentUserAdmin()) {
        return (
          <Empty
            description={
              <div>
                <div>员工管理功能仅对超管开放</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                  当前账号无访问权限
                </div>
              </div>
            }
          />
        );
      }
      // 人员管理页面
      return (
        <div>
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card
                title="用户管理"
                extra={
                  <Space>
                    <Select
                      style={{ width: 280 }}
                      placeholder="请选择供应商"
                      value={selectedUserSupplierCode}
                      onChange={(value) => setSelectedUserSupplierCode(value)}
                    >
                      {(currentSupplier?.codes || []).map((code: string) => (
                        <Select.Option key={code} value={code}>
                          {code} - {supplierCodeNameMap[code] || code}
                        </Select.Option>
                      ))}
                    </Select>
                    {isCurrentUserAdmin() && (
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          userForm.resetFields();
                          // 重置数据权限状态
                          setUserModalDataType('all');
                          setUserModalDataScopeDetail({
                            regions: [],
                            stores: [],
                            counters: []
                          });
                          // 重置树状选择
                          setUserModalSelectedTreeKeys([]);
                          // 默认使用当前选中的供应商代码
                          const defaultCodes = selectedUserSupplierCode ? [selectedUserSupplierCode] : (currentSupplier?.codes || []);
                          setUserModalSelectedSupplierCodes(defaultCodes);
                          setUserModalSupplierScopes(defaultCodes.map((code: string) => ({
                            supplier_code: code,
                            supplier_name: supplierCodeNameMap[code] || code,
                            data_scope: { type: 'all', label: '全部数据', detail: { regions: [], stores: [], counters: [], selectedNames: [] } }
                          })));
                          setCurrentScopeSupplierCode(null);
                          // 标记为新建模式
                          setEditingUserId(null);
                          setUserModalVisible(true);
                        }}
                      >
                        添加用户
                      </Button>
                    )}
                    {currentUser?.supplier_roles?.some((sr: any) => sr.roles?.includes('admin')) && (
                      <Button
                        type="primary"
                        danger
                        icon={<CrownOutlined />}
                        onClick={() => setTransferVisible(true)}
                      >
                        转让超管权限
                      </Button>
                    )}
                  </Space>
                }
              >
                <Table
                  columns={userColumns}
                  dataSource={users.filter(user => user.supplier_roles?.some((sr: any) => sr.supplier_code === selectedUserSupplierCode))}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                }}
                />
              </Card>
            </Col>

            <Col xs={24}>
              <Card
                title="角色权限说明"
                extra={
                  <Button
                    icon={<SettingOutlined />}
                    onClick={() => setRoleModalVisible(true)}
                  >
                    配置角色
                  </Button>
                }
              >
                <Table
                  dataSource={roles}
                  rowKey="id"
                  pagination={false}
                  size="middle"
                  columns={[
                    {
                      title: '角色名称',
                      dataIndex: 'name',
                      key: 'role_name',
                      width: 120,
                      render: (text: string, record: any) => (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {getRoleIcon(record.code)}
                          <span style={{ marginLeft: '8px' }}>{text}</span>
                        </div>
                      )
                    },
                    {
                      title: '描述',
                      dataIndex: 'description',
                      key: 'description',
                      ellipsis: true
                    },
                    {
                      title: '权限',
                      key: 'permissions',
                      render: (_: any, record: any) => {
                        const allPermissions = [
                          ...(record.permissions?.business || []),
                          ...(record.permissions?.finance || []),
                          ...(record.permissions?.enterprise || []),
                          ...(record.permissions?.cooperation || []),
                          ...(record.permissions?.system || [])
                        ];
                        return (
                          <div>
                            {allPermissions.map((perm: string) => (
                              <Tag key={perm} size="small" style={{ margin: '2px' }}>
                                {perm}
                              </Tag>
                            ))}
                          </div>
                        );
                      }
                    },
                    {
                      title: '操作',
                      key: 'actions',
                      width: 200,
                      render: (_: any, record: any) => (
                        <Space size="small">
                          <Button type="link" size="small" onClick={() => {
                            setSelectedRoleForDetail(record);
                            setRoleModalVisible(true);
                          }}>
                            调整角色
                          </Button>
                          <Button type="link" size="small" onClick={() => {
                            setSelectedRoleForDetail(record);
                            setRoleUsersVisible(true);
                          }}>
                            查看角色用户
                          </Button>
                        </Space>
                      )
                    }
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </div>
      );
    } else {
      // 默认显示企业信息管理
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
                          <strong>关联供应商代码：</strong>
                          {currentSupplier.codes.map((code: string) => (
                            <Tag key={code} style={{ marginRight: '4px' }}>{code}</Tag>
                          ))}
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>法定代表人：</strong>{currentSupplier.legal_person}
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>企业地址：</strong>{currentSupplier.address}
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>联系电话：</strong><PhoneDisplay phone={currentSupplier.phone} />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>统一社会信用代码：</strong>{currentSupplier.credit_code}
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card>
            </Col>

          </Row>
        </div>
      );
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

      {/* 证照上传/延期模态框（上传在上 + AI识别 + 表单在下） */}
      <Modal
        title={isRenewMode ? '证照延期申请' : (editingCertId ? '修改并重新提交' : '新增证照')}
        visible={certificateModalVisible}
        onCancel={() => {
          setCertificateModalVisible(false);
          setEditingCertId(null);
          setIsRenewMode(false);
          setAiRecognizing(false);
          setAiRecognitionResult(null);
          setUploadedFile(null);
          certificateForm.resetFields();
        }}
        footer={null}
        width={720}
      >
        <Form
          form={certificateForm}
          onFinish={handleCertificateSubmit}
          layout="vertical"
          initialValues={{
            supplier_name: currentSupplier?.name,
            is_long_term: false,
          }}
        >
          {/* ===== 上传区域（置顶）===== */}
          <Alert
            message="AI智能识别"
            description="上传证照照片，AI将自动识别证照类型、编号、有效期等信息，大大提升录入效率！"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          {/* 延期模式提示 */}
          {isRenewMode && (
            <Alert
              message="延期申请"
              description="您正在办理证照延期手续，提交后将进入零售商审批流程。请填写新的有效期信息。"
              type="warning"
              showIcon
              icon={<FileTextOutlined />}
              style={{ marginBottom: 16 }}
            />
          )}

          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={12}>
              <Form.Item
                name="certificate_file"
                label="证照文件上传（AI识别）"
                rules={[{ required: !isRenewMode, message: '请上传证照文件' }]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  accept=".pdf,.jpg,.png,.jpeg,.bmp,.rar,.zip"
                  beforeUpload={(file) => {
                    setUploadedFile(file);
                    return false;
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
                      <div style={{ fontSize: 12, color: '#999' }}>支持PDF、图片、压缩包格式</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              {uploadedFile && (
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  loading={aiRecognizing}
                  onClick={() => {
                    setAiRecognizing(true);
                    setTimeout(() => {
                      const mockResult = {
                        certificate_type: 'green_food_cert',
                        certificate_name: '绿色食品证书',
                        certificate_no: `LB-10-${Date.now().toString().slice(-8)}`,
                        issue_date: dayjs().subtract(3, 'year').format('YYYY-MM-DD'),
                        expiry_date: dayjs().add(1, 'year').format('YYYY-MM-DD'),
                        issuer: '国家市场监督管理总局',
                        enterprise_name: currentSupplier?.name || '',
                        confidence: 95,
                      };
                      setAiRecognitionResult(mockResult);
                      certificateForm.setFieldsValue({
                        name: mockResult.certificate_name,
                        cert_no: mockResult.certificate_no,
                        expiry_date: [mockResult.issue_date, mockResult.expiry_date],
                        supplier_name: mockResult.enterprise_name,
                      });
                      message.success('AI识别完成，已自动填充证照信息');
                      setAiRecognizing(false);
                    }, 2500);
                  }}
                  block
                >
                  {aiRecognizing ? 'AI识别中...' : 'AI智能识别'}
                </Button>
              )}
            </Col>
            <Col span={12}>
              <div style={{
                background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4,
                padding: 16, height: '100%', minHeight: 160,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <FileTextOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <span style={{ fontWeight: 'bold', color: '#52c41a' }}>AI识别结果</span>
                </div>
                {aiRecognitionResult ? (
                  <div style={{ fontSize: 13 }}>
                    <div style={{ marginBottom: 6 }}><strong>证照类型：</strong><Tag color="blue">{aiRecognitionResult.certificate_name}</Tag></div>
                    <div style={{ marginBottom: 6 }}><strong>证照编号：</strong>{aiRecognitionResult.certificate_no}</div>
                    <div style={{ marginBottom: 6 }}><strong>有效期至：</strong>{aiRecognitionResult.expiry_date}</div>
                    <div style={{ marginBottom: 6 }}><strong>企业名称：</strong>{aiRecognitionResult.enterprise_name}</div>
                    <div><strong>准确率：</strong><Tag color="green">{aiRecognitionResult.confidence}%</Tag></div>
                  </div>
                ) : (
                  <div style={{ color: '#999', textAlign: 'center', paddingTop: 40 }}>
                    {uploadedFile ? '点击「AI智能识别」开始分析' : '请先上传证照文件'}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* 分隔线 */}
          <Divider style={{ margin: '0 0 16px' }} />

          {/* ===== 表单字段区域（下方）===== */}

          {/* 供应商 — 延期模式只读 */}
          <Form.Item
            name="supplier_name"
            label="供应商"
            rules={[{ required: true, message: '请输入供应商' }]}
          >
            <Input placeholder="供应商名称" disabled />
          </Form.Item>

          {/* 授权企业 — 延期模式只读 */}
          <Form.Item name="authorized_company" label="授权企业">
            <Input placeholder="请输入授权企业" maxLength={40} disabled={isRenewMode} />
          </Form.Item>

          {/* 证照类型 — 延期模式只读 */}
          <Form.Item
            name="type"
            label="证照类型"
            rules={[{ required: true, message: '请选择证照类型' }]}
          >
            <TreeSelect
              showSearch
              treeDefaultExpandAll
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择证照类型，支持搜索"
              treeData={CERT_TYPE_TREE}
              disabled={isRenewMode}
              onChange={(value) => {
                if (!value) return;
                const node = findCertTypeNode(value as string);
                const category = findCertTypeCategory(value as string);
                certificateForm.setFieldsValue({
                  name: node?.label || '',
                  sub_type: node?.label || '',
                  type_label: category?.label || '',
                });
              }}
            />
          </Form.Item>

          {/* 隐藏的派生字段 */}
          <Form.Item name="name" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="sub_type" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="type_label" hidden>
            <Input />
          </Form.Item>

          {/* 证书编号 — 延期模式只读 */}
          <Form.Item
            name="cert_no"
            label="证书编号"
            rules={[{ required: true, message: '请输入证书编号' }]}
          >
            <Input placeholder="多个以分号分隔" maxLength={40} disabled={isRenewMode} />
          </Form.Item>

          {/* 证照有效时间 — 延期重点编辑项 */}
          <Form.Item
            name="expiry_date"
            label="证照有效时间"
            rules={[{ required: true, message: '请选择证照有效时间' }]}
          >
            <DatePicker.RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 16 }}>
            <Checkbox
              checked={certificateForm.getFieldValue('is_long_term')}
              onChange={(e) => certificateForm.setFieldsValue({ is_long_term: e.target.checked })}
            >长期</Checkbox>
          </Form.Item>

          {/* 以下字段始终可编辑 */}
          <Form.Item name="专柜" label="专柜">
            <Input placeholder="请输入专柜信息" />
          </Form.Item>
          <Form.Item name="商品" label="商品">
            <Input placeholder="请输入商品信息" />
          </Form.Item>
          <Form.Item name="brand" label="品牌">
            <Input placeholder="请输入品牌" />
          </Form.Item>
          <Form.Item name="business_place" label="经营场所">
            <Input.TextArea rows={2} placeholder="请输入经营场所" maxLength={50} showCount />
          </Form.Item>
          <Form.Item name="license_scope" label="许可范围">
            <Input.TextArea rows={3} placeholder="请输入许可范围" maxLength={200} showCount />
          </Form.Item>

          {/* 底部按钮 */}
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setCertificateModalVisible(false);
                setEditingCertId(null);
                setIsRenewMode(false);
                certificateForm.resetFields();
              }}>取消</Button>
              <Button type="primary" htmlType="submit">保存</Button>
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
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
            help="用于实名认证和企业关联"
          >
            <Input disabled={!!editingUserId} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号码' }
            ]}
          >
            <Input placeholder="请输入手机号" maxLength={11} disabled={!!editingUserId} />
          </Form.Item>

          {editingUserId && (
            <Alert
              type="info"
              showIcon
              message="姓名和手机号不可修改"
              description="如需更换人员，请删除该用户后重新添加。"
              style={{ marginBottom: 16 }}
            />
          )}

          <Divider orientation="left">供应商权限配置</Divider>

          <Form.Item
            label="可访问供应商编码"
            rules={[{ required: true, message: '请选择供应商权限' }]}
            help="选择该用户可以访问的供应商代码权限，每个供应商可独立配置角色和数据权限"
          >
            <Checkbox.Group
              value={userModalSelectedSupplierCodes}
              onChange={(values) => handleSupplierCodesChange(values as string[])}
            >
              <Row>
                {(currentSupplier?.codes || []).map((code: string) => (
                  <Col span={24} key={code}>
                    <Checkbox value={code}>
                      {code}
                      {supplierCodeNameMap[code] ? `（${supplierCodeNameMap[code]}）` : ''}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          {userModalSelectedSupplierCodes.map(code => {
            const scope = getSupplierScope(code);
            const scopeType = scope?.data_scope?.type || 'all';
            return (
              <Card
                key={code}
                size="small"
                title={`${code}${supplierCodeNameMap[code] ? ` - ${supplierCodeNameMap[code]}` : ''}`}
                style={{ marginBottom: 12 }}
              >
                <div style={{ marginBottom: 12 }}>
                  <div style={{ marginBottom: 8, fontWeight: 500 }}>角色</div>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请选择角色，可多选"
                    value={scope?.roles || []}
                    onChange={(values) => handleSupplierRolesChange(code, values as string[])}
                  >
                    {roles
                      .filter((role: any) => isCurrentUserAdmin() || getMyRoleCodes().includes(role.code))
                      .map(role => (
                        <Option key={role.code} value={role.code}>
                          {role.name}
                        </Option>
                      ))}
                  </Select>
                </div>

                <div style={{ marginBottom: 8, fontWeight: 500 }}>数据权限范围</div>
                <Radio.Group
                  value={scopeType}
                  onChange={(e) => handleSupplierScopeTypeChange(code, e.target.value)}
                  style={{ marginBottom: 12 }}
                >
                  <Radio value="all" disabled={!isCurrentUserAdmin()}>全部数据</Radio>
                  <Radio value="custom">自定义范围</Radio>
                </Radio.Group>
                {!isCurrentUserAdmin() && (
                  <Alert
                    type="warning"
                    message="仅超管可授予「全部数据」权限"
                    showIcon
                    style={{ marginBottom: 12 }}
                  />
                )}

                {scopeType === 'custom' ? (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                      type="dashed"
                      icon={<SettingOutlined />}
                      onClick={() => openSupplierScopeTree(code)}
                    >
                      选择数据范围
                    </Button>
                    <div>
                      {(scope?.data_scope?.detail?.selectedNames || []).length === 0 ? (
                        <span style={{ color: '#999', fontSize: 12 }}>暂未选择范围</span>
                      ) : (
                        (scope?.data_scope?.detail?.selectedNames || []).map((name: string) => (
                          <Tag key={name}>{name}</Tag>
                        ))
                      )}
                    </div>
                  </Space>
                ) : (
                  <Alert type="info" message="该供应商下全部数据可访问" showIcon />
                )}
              </Card>
            );
          })}

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

          <Form.Item name="description" label="角色描述">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="权限设置"
          >
            <Tabs
              defaultActiveKey="business"
              items={[
                {
                  key: 'business',
                  label: '📦 业务经营',
                  children: (
                    <Checkbox.Group style={{ width: '100%' }}>
                      <Row>
                        <Col span={8}><Checkbox value="订单管理">订单管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="发货管理">发货管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="商品管理">商品管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="销售数据">销售数据</Checkbox></Col>
                        <Col span={8}><Checkbox value="库存查询">库存查询</Checkbox></Col>
                        <Col span={8}><Checkbox value="竞价管理">竞价管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="价格管理">价格管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="质量管理">质量管理</Checkbox></Col>
                      </Row>
                    </Checkbox.Group>
                  )
                },
                {
                  key: 'finance',
                  label: '💰 财务结算',
                  children: (
                    <Checkbox.Group style={{ width: '100%' }}>
                      <Row>
                        <Col span={8}><Checkbox value="财务对账">财务对账</Checkbox></Col>
                        <Col span={8}><Checkbox value="对账申请">对账申请</Checkbox></Col>
                        <Col span={8}><Checkbox value="发票管理">发票管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="交款管理">交款管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="费用单管理">费用单管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="供应链金融">供应链金融</Checkbox></Col>
                      </Row>
                    </Checkbox.Group>
                  )
                },
                {
                  key: 'enterprise',
                  label: '🏢 企业管理',
                  children: (
                    <Checkbox.Group style={{ width: '100%' }}>
                      <Row>
                        <Col span={8}><Checkbox value="企业信息管理">企业信息管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="供应商资质证照">供应商资质证照</Checkbox></Col>
                        <Col span={8}><Checkbox value="员工管理">员工管理</Checkbox></Col>
                      </Row>
                    </Checkbox.Group>
                  )
                },
                {
                  key: 'cooperation',
                  label: '🤝 合作与合同',
                  children: (
                    <Checkbox.Group style={{ width: '100%' }}>
                      <Row>
                        <Col span={8}><Checkbox value="合同管理">合同管理</Checkbox></Col>
                      </Row>
                    </Checkbox.Group>
                  )
                },
                {
                  key: 'system',
                  label: '⚙️ 系统与其他',
                  children: (
                    <Checkbox.Group style={{ width: '100%' }}>
                      <Row>
                        <Col span={8}><Checkbox value="公告通知">公告通知</Checkbox></Col>
                        <Col span={8}><Checkbox value="服务中心">服务中心</Checkbox></Col>
                      </Row>
                    </Checkbox.Group>
                  )
                }
              ]}
            />
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

      {/* 用户详情 Drawer */}
      <Drawer
        title={`员工详情 - ${selectedUser?.name}`}
        placement="right"
        width={800}
        onClose={() => setUserDetailVisible(false)}
        open={userDetailVisible}
      >
        {selectedUser && (
          <>
            <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="姓名">{selectedUser.name}</Descriptions.Item>
                <Descriptions.Item label="手机号"><PhoneDisplay phone={selectedUser.phone} /></Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Badge status={selectedUser.status === 'active' ? 'success' : 'default'} 
                         text={selectedUser.status === 'active' ? '正常' : '禁用'} />
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">{selectedUser.created_at || '-'}</Descriptions.Item>
                <Descriptions.Item label="最后登录" span={2}>{selectedUser.last_login || '-'}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Tabs
              activeKey={detailActiveSupplierCode}
              onChange={setDetailActiveSupplierCode}
              items={(selectedUser.supplier_roles || []).map((sr: any) => ({
                key: sr.supplier_code,
                label: `${sr.supplier_code}${sr.supplier_name ? ` - ${sr.supplier_name}` : ''}`,
                children: (
                  <>
                    <Card title="功能权限" size="small" style={{ marginBottom: 16 }}>
                      <div style={{ marginBottom: 12 }}>
                        <strong>当前角色：</strong>
                        <Space size="small" wrap style={{ marginLeft: 8 }}>
                          {(sr.role_names || []).map((name: string, idx: number) => (
                            <Tag key={idx} color="blue">{name}</Tag>
                          ))}
                        </Space>
                        <Tag color={sr.role_type === 'system' ? 'processing' : 'default'} style={{ marginLeft: 4 }}>
                          {sr.role_type === 'system' ? '系统预设' : '自定义角色'}
                        </Tag>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <Title level={5}>📦 业务经营</Title>
                        {renderPermissionTags(sr.permissions?.business || [])}
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Title level={5}>💰 财务结算</Title>
                        {renderPermissionTags(sr.permissions?.finance || [])}
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Title level={5}>🏢 企业管理</Title>
                        {renderPermissionTags(sr.permissions?.enterprise || [])}
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Title level={5}>🤝 合作与合同</Title>
                        {renderPermissionTags(sr.permissions?.cooperation || [])}
                      </div>
                      <div>
                        <Title level={5}>⚙️ 系统与其他</Title>
                        {renderPermissionTags(sr.permissions?.system || [])}
                      </div>
                    </Card>

                    <Card title="数据权限范围" size="small" style={{ marginBottom: 16 }}>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="权限类型">
                          <Tag>{sr.data_scope?.label}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="详细范围">
                          {(sr.data_scope?.detail?.selectedNames || []).length === 0 ? (
                            <span style={{ color: '#999', fontSize: 12 }}>全部数据</span>
                          ) : (
                            <Space size="small" wrap>
                              {(sr.data_scope?.detail?.selectedNames || []).map((name: string) => (
                                <Tag key={name}>{name}</Tag>
                              ))}
                            </Space>
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>

                    <Card title="电签权限" size="small">
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="实名认证状态">
                          <Tag color={selectedUser.esign_permission?.verified ? 'success' : 'default'}>
                            {selectedUser.esign_permission?.verified ? '已实名认证' : '未实名认证'}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="电签权限状态">
                          {(() => {
                            const hasPermission = selectedUser.esign_permission?.enabled && selectedUser.esign_permission?.verified;
                            return (
                              <Tag color={hasPermission ? 'processing' : 'default'}>
                                {hasPermission ? '已授予电签权限' : '未授予电签权限'}
                              </Tag>
                            );
                          })()}
                        </Descriptions.Item>
                        {selectedUser.esign_permission?.granted_at && (
                          <>
                            <Descriptions.Item label="授权时间">
                              {selectedUser.esign_permission.granted_at}
                            </Descriptions.Item>
                            <Descriptions.Item label="授权人">
                              {selectedUser.esign_permission.granted_by}
                            </Descriptions.Item>
                          </>
                        )}
                      </Descriptions>
                      {selectedUser.esign_permission?.enabled && !selectedUser.esign_permission?.verified && (
                        <Alert
                          message="权限待生效"
                          description="该用户已被授予电签权限，需要完成实名认证后才能生效。"
                          type="warning"
                          showIcon
                          style={{ marginTop: 12 }}
                        />
                      )}
                    </Card>
                  </>
                )
              }))}
            />
          </>
        )}
      </Drawer>

      {/* 权限设置 Modal */}
      <Modal
        title={`权限设置 - ${selectedUser?.name}`}
        visible={permissionModalVisible}
        onOk={handlePermissionSave}
        onCancel={() => setPermissionModalVisible(false)}
        width={900}
      >
        <Form layout="vertical">
          <Form.Item label="选择角色">
            <Select
              mode="multiple"
              value={selectedRolesForSetting}
              onChange={setSelectedRolesForSetting}
              placeholder="请选择角色，可多选"
            >
              {roles.map(role => (
                <Option key={role.code} value={role.code}>
                  {role.name} - {role.description}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="功能权限">
            <Tabs
              defaultActiveKey="business"
              items={[
                {
                  key: 'business',
                  label: '📦 业务经营',
                  children: (
                    <Checkbox.Group style={{ width: '100%' }} value={permissionSettings.business}>
                      <Row>
                        <Col span={8}><Checkbox value="订单管理">订单管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="发货管理">发货管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="商品管理">商品管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="销售数据">销售数据</Checkbox></Col>
                        <Col span={8}><Checkbox value="库存查询">库存查询</Checkbox></Col>
                        <Col span={8}><Checkbox value="竞价管理">竞价管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="价格管理">价格管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="质量管理">质量管理</Checkbox></Col>
                      </Row>
                    </Checkbox.Group>
                  )
                },
                {
                  key: 'finance',
                  label: '💰 财务结算',
                  children: (
                    <Checkbox.Group style={{ width: '100%' }} value={permissionSettings.finance}>
                      <Row>
                        <Col span={8}><Checkbox value="财务对账">财务对账</Checkbox></Col>
                        <Col span={8}><Checkbox value="对账申请">对账申请</Checkbox></Col>
                        <Col span={8}><Checkbox value="发票管理">发票管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="交款管理">交款管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="费用单管理">费用单管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="供应链金融">供应链金融</Checkbox></Col>
                      </Row>
                    </Checkbox.Group>
                  )
                },
                {
                  key: 'enterprise',
                  label: '🏢 企业管理',
                  children: (
                    <Checkbox.Group style={{ width: '100%' }} value={permissionSettings.enterprise}>
                      <Row>
                        <Col span={8}><Checkbox value="企业信息管理">企业信息管理</Checkbox></Col>
                        <Col span={8}><Checkbox value="供应商资质证照">供应商资质证照</Checkbox></Col>
                        <Col span={8}><Checkbox value="员工管理">员工管理</Checkbox></Col>
                      </Row>
                    </Checkbox.Group>
                  )
                },
                {
                  key: 'cooperation',
                  label: '🤝 合作与合同',
                  children: (
                    <Checkbox.Group style={{ width: '100%' }} value={permissionSettings.cooperation}>
                      <Row>
                        <Col span={8}><Checkbox value="合同管理">合同管理</Checkbox></Col>
                      </Row>
                    </Checkbox.Group>
                  )
                },
                {
                  key: 'system',
                  label: '⚙️ 系统',
                  children: (
                    <Checkbox.Group style={{ width: '100%' }} value={permissionSettings.system}>
                      <Row>
                        <Col span={8}><Checkbox value="公告通知">公告通知</Checkbox></Col>
                        <Col span={8}><Checkbox value="服务中心">服务中心</Checkbox></Col>
                      </Row>
                    </Checkbox.Group>
                  )
                }
              ]}
            />
          </Form.Item>

          <Form.Item label="数据权限范围">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="default"
                onClick={() => setTreeScopeModalVisible(true)}
                icon={<SettingOutlined />}
              >
                选择数据权限范围
              </Button>
              <div style={{ marginTop: 8 }}>
                {selectedTreeKeys.length === 0 ? (
                  <span style={{ color: '#999', fontSize: 12 }}>暂未选择范围</span>
                ) : (
                  <div>
                    {(() => {
                      const extracted = extractDataFromTreeKeys(selectedTreeKeys);
                      return (
                        <div>
                          <div style={{ marginBottom: 4, fontWeight: 500 }}>已选择：</div>
                          {extracted.selectedNames.map((name, index) => (
                            <Tag key={index} style={{ margin: '2px' }}>
                              {name}
                            </Tag>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </Space>
          </Form.Item>

          <Divider>电签权限</Divider>
          
          <Form.Item label="实名认证状态">
            <Tag color={esignPermission.verified ? 'success' : 'default'}>
              {esignPermission.verified ? '已实名认证' : '未实名认证'}
            </Tag>
          </Form.Item>

          <Form.Item label="电签权限">
            <Space>
              <Checkbox
                checked={esignPermission.enabled}
                disabled={!esignPermission.verified}
                onChange={(e) => {
                  if (!esignPermission.verified) {
                    message.warning('请先完成实名认证后再授予电签权限');
                    return;
                  }
                  setEsignPermission({ ...esignPermission, enabled: e.target.checked });
                }}
              >
                授予电签权限（可调用公司公章）
              </Checkbox>
            </Space>
          </Form.Item>
          
          {esignPermission.enabled && (
            <Alert
              message="电签权限已授予"
              description="该用户已获得电签权限，实名认证后可调用公司公章进行电子签名。"
              type="info"
              showIcon
            />
          )}
        </Form>
      </Modal>

      {/* 数据权限选择 Modal */}
      <Modal
        title="选择数据权限范围"
        open={dataScopeModalVisible}
        onOk={() => {
          setDataScopeModalVisible(false);
          message.success('范围选择已保存');
        }}
        onCancel={() => setDataScopeModalVisible(false)}
        width={700}
      >
        {dataTypeForSetting === 'region' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>请选择区域：</strong>
            </div>
            <Checkbox.Group value={dataScopeDetail.regions}>
              <Row gutter={[16, 16]}>
                {regions.map(region => (
                  <Col span={12} key={region.id}>
                    <Checkbox
                      value={region.id}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newRegions = checked
                          ? [...dataScopeDetail.regions, region.id]
                          : dataScopeDetail.regions.filter(id => id !== region.id);
                        setDataScopeDetail({ ...dataScopeDetail, regions: newRegions });
                      }}
                    >
                      {region.name}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
            <Space style={{ marginTop: 16 }}>
              <Button
                size="small"
                onClick={() => setDataScopeDetail({
                  ...dataScopeDetail,
                  regions: regions.map(r => r.id)
                })}
              >
                全选
              </Button>
              <Button
                size="small"
                onClick={() => setDataScopeDetail({
                  ...dataScopeDetail,
                  regions: []
                })}
              >
                取消全选
              </Button>
            </Space>
          </div>
        )}

        {dataTypeForSetting === 'store' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>请选择门店：</strong>
            </div>
            <Checkbox.Group value={dataScopeDetail.stores}>
              <Row gutter={[16, 16]}>
                {stores.map(store => (
                  <Col span={12} key={store.id}>
                    <Checkbox
                      value={store.id}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newStores = checked
                          ? [...dataScopeDetail.stores, store.id]
                          : dataScopeDetail.stores.filter(id => id !== store.id);
                        setDataScopeDetail({ ...dataScopeDetail, stores: newStores });
                      }}
                    >
                      {store.name}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
            <Space style={{ marginTop: 16 }}>
              <Button
                size="small"
                onClick={() => setDataScopeDetail({
                  ...dataScopeDetail,
                  stores: stores.map(s => s.id)
                })}
              >
                全选
              </Button>
              <Button
                size="small"
                onClick={() => setDataScopeDetail({
                  ...dataScopeDetail,
                  stores: []
                })}
              >
                取消全选
              </Button>
            </Space>
          </div>
        )}

        {dataTypeForSetting === 'counter' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>请选择柜组：</strong>
            </div>
            <Checkbox.Group value={dataScopeDetail.counters}>
              <Row gutter={[16, 16]}>
                {counters.map(counter => (
                  <Col span={12} key={counter.id}>
                    <Checkbox
                      value={counter.id}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newCounters = checked
                          ? [...dataScopeDetail.counters, counter.id]
                          : dataScopeDetail.counters.filter(id => id !== counter.id);
                        setDataScopeDetail({ ...dataScopeDetail, counters: newCounters });
                      }}
                    >
                      {counter.name}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
            <Space style={{ marginTop: 16 }}>
              <Button
                size="small"
                onClick={() => setDataScopeDetail({
                  ...dataScopeDetail,
                  counters: counters.map(c => c.id)
                })}
              >
                全选
              </Button>
              <Button
                size="small"
                onClick={() => setDataScopeDetail({
                  ...dataScopeDetail,
                  counters: []
                })}
              >
                取消全选
              </Button>
            </Space>
          </div>
        )}
      </Modal>

      {/* 用户管理模态框的数据权限选择 Modal */}
      <Modal
        title="选择数据权限范围"
        open={userModalDataScopeVisible}
        onOk={() => {
          setUserModalDataScopeVisible(false);
          message.success('范围选择已保存');
        }}
        onCancel={() => setUserModalDataScopeVisible(false)}
        width={700}
      >
        {userModalDataType === 'region' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>请选择区域：</strong>
            </div>
            <Checkbox.Group value={userModalDataScopeDetail.regions}>
              <Row gutter={[16, 16]}>
                {regions.map(region => (
                  <Col span={12} key={region.id}>
                    <Checkbox
                      value={region.id}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newRegions = checked
                          ? [...userModalDataScopeDetail.regions, region.id]
                          : userModalDataScopeDetail.regions.filter(id => id !== region.id);
                        setUserModalDataScopeDetail({ ...userModalDataScopeDetail, regions: newRegions });
                      }}
                    >
                      {region.name}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
            <Space style={{ marginTop: 16 }}>
              <Button
                size="small"
                onClick={() => setUserModalDataScopeDetail({
                  ...userModalDataScopeDetail,
                  regions: regions.map(r => r.id)
                })}
              >
                全选
              </Button>
              <Button
                size="small"
                onClick={() => setUserModalDataScopeDetail({
                  ...userModalDataScopeDetail,
                  regions: []
                })}
              >
                取消全选
              </Button>
            </Space>
          </div>
        )}

        {userModalDataType === 'store' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>请选择门店：</strong>
            </div>
            <Checkbox.Group value={userModalDataScopeDetail.stores}>
              <Row gutter={[16, 16]}>
                {stores.map(store => (
                  <Col span={12} key={store.id}>
                    <Checkbox
                      value={store.id}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newStores = checked
                          ? [...userModalDataScopeDetail.stores, store.id]
                          : userModalDataScopeDetail.stores.filter(id => id !== store.id);
                        setUserModalDataScopeDetail({ ...userModalDataScopeDetail, stores: newStores });
                      }}
                    >
                      {store.name}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
            <Space style={{ marginTop: 16 }}>
              <Button
                size="small"
                onClick={() => setUserModalDataScopeDetail({
                  ...userModalDataScopeDetail,
                  stores: stores.map(s => s.id)
                })}
              >
                全选
              </Button>
              <Button
                size="small"
                onClick={() => setUserModalDataScopeDetail({
                  ...userModalDataScopeDetail,
                  stores: []
                })}
              >
                取消全选
              </Button>
            </Space>
          </div>
        )}

        {userModalDataType === 'counter' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>请选择柜组：</strong>
            </div>
            <Checkbox.Group value={userModalDataScopeDetail.counters}>
              <Row gutter={[16, 16]}>
                {counters.map(counter => (
                  <Col span={12} key={counter.id}>
                    <Checkbox
                      value={counter.id}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newCounters = checked
                          ? [...userModalDataScopeDetail.counters, counter.id]
                          : userModalDataScopeDetail.counters.filter(id => id !== counter.id);
                        setUserModalDataScopeDetail({ ...userModalDataScopeDetail, counters: newCounters });
                      }}
                    >
                      {counter.name}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
            <Space style={{ marginTop: 16 }}>
              <Button
                size="small"
                onClick={() => setUserModalDataScopeDetail({
                  ...userModalDataScopeDetail,
                  counters: counters.map(c => c.id)
                })}
              >
                全选
              </Button>
              <Button
                size="small"
                onClick={() => setUserModalDataScopeDetail({
                  ...userModalDataScopeDetail,
                  counters: []
                })}
              >
                取消全选
              </Button>
            </Space>
          </div>
        )}
      </Modal>

      {/* 树状数据权限选择 Modal */}
      <Modal
        title="选择数据权限范围"
        open={treeScopeModalVisible}
        onOk={() => {
          setTreeScopeModalVisible(false);
        }}
        onCancel={() => setTreeScopeModalVisible(false)}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setTreeScopeModalVisible(false)}>
            取消
          </Button>,
          <Button key="ok" type="primary" onClick={() => {
            setTreeScopeModalVisible(false);
            message.success('范围选择已保存');
          }}>
            确定
          </Button>
        ]}
      >
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>可选范围</div>
            <Tree
              checkable
              defaultExpandAll
              treeData={treeData}
              checkedKeys={selectedTreeKeys}
              onCheck={(checkedKeys) => {
                setSelectedTreeKeys(checkedKeys as string[]);
              }}
            />
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>已选择范围</div>
            <div style={{ 
              border: '1px solid #d9d9d9', 
              borderRadius: 4, 
              padding: 12, 
              minHeight: 300,
              maxHeight: 400,
              overflowY: 'auto'
            }}>
              {selectedTreeKeys.length === 0 ? (
                <div style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                  暂未选择范围
                </div>
              ) : (
                <div>
                  {(() => {
                    const extracted = extractDataFromTreeKeys(selectedTreeKeys);
                    return extracted.selectedNames.map((name, index) => (
                      <Tag key={index} style={{ margin: '4px' }}>
                        {name}
                      </Tag>
                    ));
                  })()}
                </div>
              )}
            </div>
            <Space style={{ marginTop: 12 }}>
              <Button
                size="small"
                onClick={() => {
                  const allKeys: string[] = [];
                  const collectKeys = (nodes: any[]) => {
                    nodes.forEach(node => {
                      allKeys.push(node.key);
                      if (node.children) {
                        collectKeys(node.children);
                      }
                    });
                  };
                  collectKeys(treeData);
                  setSelectedTreeKeys(allKeys);
                }}
              >
                全选
              </Button>
              <Button
                size="small"
                onClick={() => setSelectedTreeKeys([])}
              >
                取消全选
              </Button>
            </Space>
          </Col>
        </Row>
      </Modal>

      {/* 用户管理模态框的树状数据权限选择 Modal */}
      <Modal
        title={`选择数据权限范围${currentScopeSupplierCode ? ` - ${currentScopeSupplierCode}` : ''}`}
        open={userModalTreeScopeVisible}
        onCancel={() => {
          setUserModalTreeScopeVisible(false);
          setCurrentScopeSupplierCode(null);
        }}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => {
            setUserModalTreeScopeVisible(false);
            setCurrentScopeSupplierCode(null);
          }}>
            取消
          </Button>,
          <Button key="ok" type="primary" onClick={handleScopeTreeConfirm}>
            确定
          </Button>
        ]}
      >
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>可选范围</div>
            <Tree
              checkable
              defaultExpandAll
              treeData={currentScopeSupplierCode ? getSupplierTreeData(currentScopeSupplierCode) : treeData}
              checkedKeys={userModalSelectedTreeKeys}
              onCheck={(checkedKeys) => {
                setUserModalSelectedTreeKeys(checkedKeys as string[]);
              }}
            />
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>已选择范围</div>
            <div style={{ 
              border: '1px solid #d9d9d9', 
              borderRadius: 4, 
              padding: 12, 
              minHeight: 300,
              maxHeight: 400,
              overflowY: 'auto'
            }}>
              {userModalSelectedTreeKeys.length === 0 ? (
                <div style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                  暂未选择范围
                </div>
              ) : (
                <div>
                  {(() => {
                    const extracted = extractDataFromTreeKeys(userModalSelectedTreeKeys);
                    return extracted.selectedNames.map((name, index) => (
                      <Tag key={index} style={{ margin: '4px' }}>
                        {name}
                      </Tag>
                    ));
                  })()}
                </div>
              )}
            </div>
            <Space style={{ marginTop: 12 }}>
              <Button
                size="small"
                onClick={() => {
                  const allKeys: string[] = [];
                  const collectKeys = (nodes: any[]) => {
                    nodes.forEach(node => {
                      allKeys.push(node.key);
                      if (node.children) {
                        collectKeys(node.children);
                      }
                    });
                  };
                  collectKeys(currentScopeSupplierCode ? getSupplierTreeData(currentScopeSupplierCode) : treeData);
                  setUserModalSelectedTreeKeys(allKeys);
                }}
              >
                全选
              </Button>
              <Button
                size="small"
                onClick={() => setUserModalSelectedTreeKeys([])}
              >
                取消全选
              </Button>
            </Space>
          </Col>
        </Row>
      </Modal>

      {/* 数据权限范围查看 Modal（只读） */}
      <Modal
        title="数据权限范围 - 只读查看"
        open={dataScopeViewModalVisible}
        onCancel={() => setDataScopeViewModalVisible(false)}
        width={700}
        footer={[
          <Button key="close" onClick={() => setDataScopeViewModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedUser && (() => {
          const sr = selectedUser.supplier_roles?.find((item: any) => item.supplier_code === detailActiveSupplierCode);
          return (
            <div>
              <div style={{ marginBottom: 8, fontWeight: 'bold' }}>权限类型：
                <Tag>{sr?.data_scope?.label}</Tag>
              </div>
              <Tree
                checkable
                defaultExpandAll
                treeData={treeData}
                checkedKeys={sr?.data_scope?.detail ? generateTreeKeysFromDetail(sr.data_scope.detail) : []}
                disabled
                selectable={false}
                style={{ opacity: 0.7 }}
              />
              <div style={{ marginTop: 12 }}>
                <strong>已选择范围：</strong>
                <div style={{ marginTop: 4 }}>
                  {sr?.data_scope?.detail?.selectedNames?.map((item: string) => (
                    <Tag key={item} style={{ margin: '2px' }}>{item}</Tag>
                  ))}
                  {(!sr?.data_scope?.detail?.selectedNames || sr?.data_scope?.detail?.selectedNames.length === 0) && (
                    <span style={{ color: '#999', fontSize: 12 }}>暂未选择范围</span>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* 角色详情查看 Modal */}
      <Modal
        title={`角色详情 - ${selectedRoleForDetail?.name}`}
        visible={roleDetailVisible}
        onCancel={() => setRoleDetailVisible(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setRoleDetailVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedRoleForDetail && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="角色名称">{selectedRoleForDetail.name}</Descriptions.Item>
            <Descriptions.Item label="角色代码">{selectedRoleForDetail.code}</Descriptions.Item>
            <Descriptions.Item label="角色类型">
              <Tag color={selectedRoleForDetail.type === 'system' ? 'processing' : 'default'}>
                {selectedRoleForDetail.type === 'system' ? '系统预设' : '自定义角色'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="描述">{selectedRoleForDetail.description}</Descriptions.Item>
            <Descriptions.Item label="功能权限">
              <div>
                {[
                  ...(selectedRoleForDetail.permissions?.business || []),
                  ...(selectedRoleForDetail.permissions?.finance || []),
                  ...(selectedRoleForDetail.permissions?.enterprise || []),
                  ...(selectedRoleForDetail.permissions?.cooperation || []),
                  ...(selectedRoleForDetail.permissions?.system || [])
                ].map((perm: string) => (
                  <Tag key={perm} size="small" style={{ margin: '2px' }}>{perm}</Tag>
                ))}
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 角色用户列表 Modal */}
      <Modal
        title={`角色用户列表 - ${selectedRoleForDetail?.name}`}
        visible={roleUsersVisible}
        onCancel={() => setRoleUsersVisible(false)}
        width={700}
        footer={[
          <Button key="close" onClick={() => setRoleUsersVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedRoleForDetail && (
          <Table
            dataSource={users.filter(u => u.supplier_roles?.some((sr: any) => sr.roles?.includes(selectedRoleForDetail.code)))}
            rowKey="id"
            pagination={false}
            size="small"
            columns={[
              {
                title: '姓名',
                dataIndex: 'name',
                key: 'name'
              },
              {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
                render: (text: string) => <PhoneDisplay phone={text} />
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => (
                  <Badge status={status === 'active' ? 'success' : 'default'} text={status === 'active' ? '正常' : '禁用'} />
                )
              },
              {
                title: '最后登录',
                dataIndex: 'last_login',
                key: 'last_login'
              }
            ]}
          />
        )}
      </Modal>

      <TransferSuperAdminModal
        visible={transferVisible}
        userList={users}
        currentUserId={currentUser?.id || ''}
        onCancel={() => {
          setTransferVisible(false);
        }}
        onSuccess={(targetUserId) => {
          console.log('转让给用户ID:', targetUserId);
          handleTransferSuccess();
        }}
      />

      <PersonalAuthModal
        visible={personalAuthVisible}
        onCancel={() => setPersonalAuthVisible(false)}
        onSuccess={() => {
          setPersonalAuthVisible(false);
          message.success('认证成功');
          // 更新本地存储的个人认证状态
          const userInfo = JSON.parse(localStorage.getItem('supplier_userInfo') || '{}');
          localStorage.setItem('supplier_userInfo', JSON.stringify({ ...userInfo, personal_verified: true }));
          // 刷新用户列表中的电签认证状态
          setUsers(prev => prev.map(u => ({
            ...u,
            esign_permission: { ...u.esign_permission, verified: true }
          })));
        }}
      />

      {/* 电签授权书申请 Modal */}
      <Modal
        title={esignAuthInfo?.status === 'rejected' ? '重新提交企业授权书' : '企业授权书申请'}
        open={esignApplyModalVisible}
        onCancel={() => setEsignApplyModalVisible(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Alert
          message="电签权限申请"
          description="提交企业授权书后，将由零售商管理员审核。审核通过后即可使用企业印章进行电子签名。"
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        {esignAuthInfo?.status === 'rejected' && esignAuthInfo?.rejectReason && (
          <Alert
            message="驳回原因"
            description={esignAuthInfo.rejectReason}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <Form
          form={esignForm}
          layout="vertical"
          onFinish={(values) => {
            // 二次确认（仅驳回重新提交时）
            const doSubmit = () => {
              setEsignApplying(true);
              setTimeout(() => {
                setEsignAuthInfo((prev: any) => {
                  const isResubmit = prev?.status === 'rejected';
                  return {
                    ...(prev || {}),
                    status: 'pending',
                    authNo: prev?.authNo || '',
                    applyTime: new Date().toLocaleString(),
                    reviewer: '',
                    reviewTime: '',
                    expireTime: prev?.expireTime || '',
                    // 重新提交次数 +1
                    resubmitCount: isResubmit ? (prev.resubmitCount || 0) + 1 : (prev?.resubmitCount || 0),
                    // 驳回信息保留（让供应商对照修改）
                    rejectReason: prev?.rejectReason || '',
                    rejectTime: prev?.rejectTime || '',
                  };
                });
                setEsignApplyModalVisible(false);
                setEsignApplying(false);
                esignForm.resetFields();
                message.success(
                  esignAuthInfo?.status === 'rejected'
                    ? '授权书已重新提交，请等待审核'
                    : '授权书申请已提交，请等待审核'
                );
              }, 1500);
            };

            if (esignAuthInfo?.status === 'rejected') {
              Modal.confirm({
                title: '确认重新提交',
                content: (
                  <div>
                    <p>确认要重新提交授权书申请吗？</p>
                    <p style={{ color: '#999', fontSize: 12 }}>
                      重新提交后，零售商管理员将重新审核。在此之前请确保已按驳回原因完成修改。
                    </p>
                  </div>
                ),
                okText: '确认重新提交',
                cancelText: '取消',
                onOk: doSubmit,
              });
            } else {
              doSubmit();
            }
          }}
        >
          <Alert
            message="请下载授权书模板，填写并盖章后上传扫描件"
            type="info"
            showIcon
            action={
              <Button size="small" onClick={handleDownloadTemplate}>
                下载模板
              </Button>
            }
            style={{ marginBottom: '20px' }}
          />

          <Form.Item
            label="授权书文件"
            name="authFile"
            rules={[{ required: true, message: '请上传企业授权书' }]}
          >
            <Upload maxCount={1} accept=".pdf,.jpg,.png">
              <Button icon={<UploadOutlined />}>上传授权书</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setEsignApplyModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={esignApplying}>提交申请</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 电签授权审核历史 Drawer（已删除） */}
    </div>
  );
};

export default Account;
