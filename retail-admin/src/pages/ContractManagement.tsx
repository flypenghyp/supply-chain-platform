import { useState } from 'react'
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Drawer,
  Descriptions,
  Typography,
  Divider,
  DatePicker,
  Select,
  Input,
  message,
  Modal,
  Form,
  Row,
  Col,
} from 'antd'
import {
  FileTextOutlined,
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  ReloadOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

interface Contract {
  id: string
  signStatus: string
  documentNo: string
  supplierCode: string
  contractNo: string
  signLegalPerson: string
  supplierName: string
  businessCategory: string
  supplierNature: string
  supplierGrade: string
  contractStartDate: string
  docName: string
  contractType: string
  counterCode: string
  flowStatus: string
}

interface ContractDetail extends Contract {
  content: string
  partyA: string
  partyB: string
  effectiveDate: string
  expiryDate: string
  mainContractNo: string
}

const ContractManagement = () => {
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedContract, setSelectedContract] = useState<ContractDetail | null>(null)
  const [filters, setFilters] = useState({
    documentNo: '',
    supplierCode: '',
    supplierName: '',
    signStatus: '',
  })

  // Mock data
  const contracts: Contract[] = [
    {
      id: '1',
      signStatus: '待签署',
      documentNo: 'LY20260305-00001',
      supplierCode: '3800894',
      contractNo: 'LY2026030500001',
      signLegalPerson: '天虹数科商业股份有限公司',
      supplierName: '广东海华投资集团有限公司',
      businessCategory: '鞋履',
      supplierNature: '宝安中心区',
      supplierGrade: '供应商分级',
      contractStartDate: '2026-03-14',
      docName: 'LY2026030500001',
      contractType: '主合同',
      counterCode: '0012810254',
      flowStatus: '流',
    },
    {
      id: '2',
      signStatus: '待签署',
      documentNo: 'LY20260305-00002',
      supplierCode: '3800894',
      contractNo: 'LY2026030500002',
      signLegalPerson: '天虹数科商业股份有限公司',
      supplierName: '广东海华投资集团有限公司',
      businessCategory: '鞋履',
      supplierNature: '宝安中心区',
      supplierGrade: '供应商分级',
      contractStartDate: '2026-03-14',
      docName: 'LY2026030500002',
      contractType: '主合同',
      counterCode: '0012810254',
      flowStatus: '流',
    },
    {
      id: '3',
      signStatus: '待签署',
      documentNo: 'LY20260305-00003',
      supplierCode: '3800894',
      contractNo: 'LY2026030500003',
      signLegalPerson: '天虹数科商业股份有限公司',
      supplierName: '广东海华投资集团有限公司',
      businessCategory: '鞋履',
      supplierNature: '宝安中心区',
      supplierGrade: '供应商分级',
      contractStartDate: '2026-03-14',
      docName: 'LY2026030500003',
      contractType: '主合同',
      counterCode: '0012810254',
      flowStatus: '流',
    },
    {
      id: '4',
      signStatus: '待签署',
      documentNo: 'COO-999260-2803905',
      supplierCode: '2803905',
      contractNo: 'COO-999260-2803905',
      signLegalPerson: '东莞市天虹...',
      supplierName: '佛山市顺德...',
      businessCategory: '无品牌',
      supplierNature: '东莞虎门天虹',
      supplierGrade: '供应商分级',
      contractStartDate: '2026-03-10',
      docName: 'COO-999260-2803905',
      contractType: '主合同',
      counterCode: '0100627189',
      flowStatus: '流',
    },
    {
      id: '5',
      signStatus: '待签署',
      documentNo: 'COO-999260-2803905',
      supplierCode: '2803905',
      contractNo: 'COO-999260-2803905',
      signLegalPerson: '东莞市天虹...',
      supplierName: '佛山市顺德...',
      businessCategory: '无品牌',
      supplierNature: '东莞虎门天虹',
      supplierGrade: '供应商分级',
      contractStartDate: '2026-03-10',
      docName: 'COO-999260-2803905',
      contractType: '主合同',
      counterCode: '0100627189',
      flowStatus: '流',
    },
    {
      id: '6',
      signStatus: '已盖章',
      documentNo: 'COO-999260-2803905',
      supplierCode: '2803905',
      contractNo: 'COO-999260-2803905',
      signLegalPerson: '深圳市天虹...',
      supplierName: '佛山市顺德...',
      businessCategory: '无品牌',
      supplierNature: '深圳福民天虹',
      supplierGrade: '供应商分级',
      contractStartDate: '2026-03-24',
      docName: 'COO-999260-2803905',
      contractType: '主合同',
      counterCode: '0220620189',
      flowStatus: '流',
    },
  ]

  const contractDetail: ContractDetail = {
    id: '1',
    signStatus: '待签署',
    documentNo: 'LY20260305-00001',
    supplierCode: '3800894',
    contractNo: 'LY2026030500001',
    signLegalPerson: '天虹数科商业股份有限公司',
    supplierName: '广东海华投资集团有限公司',
    businessCategory: '鞋履',
    supplierNature: '宝安中心区',
    supplierGrade: '供应商分级',
    contractStartDate: '2026-03-14',
    docName: 'LY2026030500001',
    contractType: '主合同',
    counterCode: '0012810254',
    flowStatus: '流',
    content: '根据双方签订的有效期为 2026-03-14 至 2026-04-12 《专柜经营合同》（合同编号:LY202603050008），在此基础上，双方对其他事项达成如下补充协议。',
    partyA: '天虹数科商业股份有限公司',
    partyB: '广东海华投资集团有限公司',
    effectiveDate: '2026-03-14',
    expiryDate: '2026-04-12',
    mainContractNo: 'LY202603050008',
  }

  const handleViewDetail = (record: Contract) => {
    setSelectedContract(contractDetail)
    setDetailVisible(true)
  }

  const handleDownload = () => {
    message.success('下载签件')
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const handleSearch = () => {
    message.success('查询成功')
  }

  const handleReset = () => {
    setFilters({
      documentNo: '',
      supplierCode: '',
      supplierName: '',
      signStatus: '',
    })
    message.info('已重置查询条件')
  }

  const getSignStatusColor = (status: string) => {
    return status === '已盖章' ? 'success' : 'orange'
  }

  const columns: ColumnsType<Contract> = [
    { 
      title: '签章状态', 
      dataIndex: 'signStatus',
      width: 100,
      render: (status: string) => (
        <Tag color={getSignStatusColor(status)}>{status}</Tag>
      ),
    },
    { title: '单据编号', dataIndex: 'documentNo', width: 140 },
    { title: '供应商编号', dataIndex: 'supplierCode', width: 110 },
    { title: '合同编号', dataIndex: 'contractNo', width: 140 },
    { title: '签订法人', dataIndex: 'signLegalPerson', width: 140 },
    { title: '供应商名称', dataIndex: 'supplierName', width: 160 },
    { title: '经营类别', dataIndex: 'businessCategory', width: 100 },
    { title: '供应商性质', dataIndex: 'supplierNature', width: 120 },
    { title: '供应商分级', dataIndex: 'supplierGrade', width: 110 },
    { title: '合同开始日期', dataIndex: 'contractStartDate', width: 120 },
    { title: 'DOC文档名称', dataIndex: 'docName', width: 140 },
    { title: '合同类型', dataIndex: 'contractType', width: 100 },
    { title: '柜组代码', dataIndex: 'counterCode', width: 110 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看</Button>
          <Button type="link" size="small" icon={<DownloadOutlined />} onClick={handleDownload}>下载</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* 合同列表 */}
      <Card title="电子合同">
        <AdvancedSearchFilter
          fields={[
            { key: 'documentNo', label: '单据编号', type: 'input', placeholder: '请输入单据编号' },
            { key: 'supplierCode', label: '供应商编号', type: 'input', placeholder: '请输入编号' },
            { key: 'supplierName', label: '供应商名称', type: 'input', placeholder: '请输入名称' },
            { key: 'signStatus', label: '签章状态', type: 'select', placeholder: '请选择',
              options: [{ label: '待签署', value: 'pending_sign' }, { label: '已盖章', value: 'signed' }]
            }
          ]}
          values={filters} onChange={(k,v)=>handleFilterChange({...filters,[k]:v})} onSearch={()=>handleSearch()} onReset={()=>handleReset()}
        />

        <Table
          rowKey="id"
          columns={columns}
          dataSource={contracts}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条记录` }}
          scroll={{ x: 2000 }}
        />
      </Card>

      {/* 合同详情/签署抽屉 */}
      <Drawer
        title="电子合同"
        placement="right"
        width={800}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
        extra={
          <Space>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
              下载签件
            </Button>
            <Button icon={<LogoutOutlined />} onClick={() => setDetailVisible(false)}>
              退出
            </Button>
          </Space>
        }
      >
        {selectedContract && (
          <>
            <div style={{ marginBottom: 16, color: '#666' }}>
              <Text type="secondary">签件是已盖章的文件，可随时下载。</Text>
            </div>

            <Card style={{ 
              minHeight: 500, 
              border: '2px dashed #d9d9d9',
              padding: '40px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              position: 'relative'
            }}>
              {/* 水印效果 */}
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                fontSize: '60px',
                color: 'rgba(24, 144, 255, 0.1)',
                fontWeight: 'bold',
                transform: 'rotate(-30deg)',
                pointerEvents: 'none',
                zIndex: 0
              }}>
                天虹
              </div>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '30%',
                fontSize: '60px',
                color: 'rgba(24, 144, 255, 0.1)',
                fontWeight: 'bold',
                transform: 'rotate(-30deg)',
                pointerEvents: 'none',
                zIndex: 0
              }}>
                RAINBOW
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
                  专柜经营合同补充协议
                </Title>

                <div style={{ fontSize: 16, lineHeight: 2 }}>
                  <p style={{ marginBottom: 20 }}>
                    <span style={{ display: 'inline-block', width: 120 }}>甲 方：</span>
                    <span style={{ fontWeight: 500 }}>{selectedContract.partyA}</span>
                  </p>
                  <p style={{ marginBottom: 20 }}>
                    <span style={{ display: 'inline-block', width: 120 }}>乙 方：</span>
                    <span style={{ fontWeight: 500 }}>{selectedContract.partyB}</span>
                  </p>
                  <p style={{ marginBottom: 20, textIndent: '2em' }}>
                    根据双方签订的有效期为 <span style={{ fontWeight: 500, textDecoration: 'underline' }}>{selectedContract.effectiveDate}</span> 至 
                    <span style={{ fontWeight: 500, textDecoration: 'underline' }}>{selectedContract.expiryDate}</span> 
                    《专柜经营合同》（合同编号：<span style={{ fontWeight: 500, textDecoration: 'underline' }}>{selectedContract.mainContractNo}</span>），
                    在此基础上，双方对其他事项达成如下补充协议。
                  </p>
                  <div style={{ paddingLeft: '2em' }}>
                    <p style={{ marginBottom: 16 }}>1、乙方同意按顾客使用甲方预付卡消费金额的 <span style={{ fontWeight: 500, textDecoration: 'underline' }}>2%</span> 承担费用。</p>
                    <p style={{ marginBottom: 16 }}>2、乙方同意按照以下方式承担管理费：</p>
                    <p style={{ marginBottom: 16, paddingLeft: '2em' }}>2.1 按照该专柜面积承担管理费 <span style={{ textDecoration: 'underline' }}> / </span> 元/平方米/月</p>
                    <p style={{ marginBottom: 16, paddingLeft: '2em' }}>2.2 每月承担管理费 <span style={{ textDecoration: 'underline' }}> / </span> 元。</p>
                    <p style={{ marginBottom: 16 }}>3、支付手续费用率：乙方同意每月按销售额的 <span style={{ fontWeight: 500, textDecoration: 'underline' }}>0.8%</span> 承担顾客消费时使用各支付方式（包括但不限于银行卡、信用卡、支付宝、微信等）手续费的费用提成。</p>
                    <p style={{ marginBottom: 16 }}>4、为保证双方长期交易的便利，节约双方的交易成本，甲方对乙方提供客户端信息系统服务，</p>
                    <p style={{ marginBottom: 16, textIndent: '2em' }}>乙方可使用该服务，费用由乙方承担。</p>
                  </div>
                </div>

                <div style={{ marginTop: 60, display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p>甲方（盖章）：</p>
                    <div style={{ 
                      width: 100, 
                      height: 100, 
                      border: selectedContract.signStatus === '已盖章' ? '3px solid #52c41a' : '2px dashed #d9d9d9',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '10px auto',
                      background: selectedContract.signStatus === '已盖章' ? 'rgba(82, 196, 66, 0.1)' : 'transparent',
                      color: selectedContract.signStatus === '已盖章' ? '#52c41a' : '#d9d9d9'
                    }}>
                      {selectedContract.signStatus === '已盖章' ? '已盖章' : '未盖章'}
                    </div>
                    <p style={{ fontSize: 12, color: '#999' }}>天虹数科商业股份有限公司</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p>乙方（盖章）：</p>
                    <div style={{ 
                      width: 100, 
                      height: 100, 
                      border: selectedContract.signStatus === '已盖章' ? '3px solid #52c41a' : '2px dashed #d9d9d9',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '10px auto',
                      background: selectedContract.signStatus === '已盖章' ? 'rgba(82, 196, 66, 0.1)' : 'transparent',
                      color: selectedContract.signStatus === '已盖章' ? '#52c41a' : '#d9d9d9'
                    }}>
                      {selectedContract.signStatus === '已盖章' ? '已盖章' : '未盖章'}
                    </div>
                    <p style={{ fontSize: 12, color: '#999' }}>{selectedContract.supplierName}</p>
                  </div>
                </div>
              </div>
            </Card>

            <div style={{ marginTop: 16, textAlign: 'center', color: '#999' }}>
              <Text type="secondary">1 of 4</Text>
              <Space style={{ margin: '0 20px' }}>
                <Button size="small">◀</Button>
                <Button size="small">▶</Button>
                <Button size="small">▼</Button>
                <Button size="small">▲</Button>
              </Space>
              <Text type="secondary">96.98%</Text>
              <Space style={{ marginLeft: 20 }}>
                <Button size="small" icon={<FileTextOutlined />}></Button>
                <Button size="small" icon={<DownloadOutlined />}></Button>
              </Space>
            </div>
          </>
        )}
      </Drawer>
    </div>
  )
}

export default ContractManagement
