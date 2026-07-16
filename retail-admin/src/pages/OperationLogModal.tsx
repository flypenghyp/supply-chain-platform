import React, { useState, useEffect } from 'react'
import { Modal, Table, Tag, Space, Empty, Spin } from 'antd'
import type { OperationLog } from '@/types/phase1'

interface Props {
  open: boolean
  userId: string
  userName: string
  onClose: () => void
}

const OperationLogModal: React.FC<Props> = ({ open, userId, userName, onClose }) => {
  const [logs, setLogs] = useState<OperationLog[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !userId) return
    loadLogs()
  }, [open, userId])

  const loadLogs = async () => {
    setLoading(true)
    // Mock 数据
    setTimeout(() => {
      setLogs([
        {
          id: '1', user_id: userId, user_name: userName, supplier_code: 'NFS001',
          module: 'user', action: 'update', target_id: 't1', target_type: 'user',
          detail: { before: { role: 'staff' }, after: { role: 'store_manager' } },
          result: 'success', ip_address: '192.168.1.100',
          operation_time: '2026-07-15 14:23:12',
        },
        {
          id: '2', user_id: userId, user_name: userName, supplier_code: 'NFS001',
          module: 'license', action: 'create', target_id: 'L001', target_type: 'license',
          detail: { license_name: '营业执照' },
          result: 'success', ip_address: '192.168.1.100',
          operation_time: '2026-07-14 10:05:33',
        },
        {
          id: '3', user_id: userId, user_name: userName, supplier_code: 'NFS001',
          module: 'authorization', action: 'approve', target_id: 'A001', target_type: 'authorization',
          detail: { auth_no: 'AUTH2026001' },
          result: 'success', ip_address: '192.168.1.100',
          operation_time: '2026-07-13 16:42:08',
        },
        {
          id: '4', user_id: userId, user_name: userName, supplier_code: 'NFS001',
          module: 'permission', action: 'create', target_id: 'R001', target_type: 'role',
          detail: { role_name: '新角色' },
          result: 'success', ip_address: '192.168.1.100',
          operation_time: '2026-07-12 09:18:55',
        },
        {
          id: '5', user_id: userId, user_name: userName, supplier_code: 'NFS001',
          module: 'login', action: 'login',
          result: 'success', ip_address: '192.168.1.100',
          operation_time: '2026-07-11 08:30:01',
        },
      ])
      setLoading(false)
    }, 300)
  }

  const moduleMap: any = {
    user: { color: 'blue', text: '用户' },
    license: { color: 'orange', text: '证照' },
    super_admin: { color: 'red', text: '超管' },
    authorization: { color: 'purple', text: '授权' },
    permission: { color: 'cyan', text: '权限' },
  }
  const actionMap: any = {
    create: { color: 'success', text: '新增' },
    update: { color: 'processing', text: '修改' },
    delete: { color: 'error', text: '删除' },
    approve: { color: 'success', text: '通过' },
    reject: { color: 'error', text: '驳回' },
    login: { color: 'default', text: '登录' },
    logout: { color: 'default', text: '登出' },
  }

  return (
    <Modal
      title={`操作日志 - ${userName}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <Spin spinning={loading}>
        {logs.length === 0 ? (
          <Empty description="暂无操作日志" />
        ) : (
          <Table
            rowKey="id"
            dataSource={logs}
            pagination={{ pageSize: 8 }}
            size="small"
            columns={[
              {
                title: '时间', dataIndex: 'operation_time', key: 'operation_time', width: 160,
              },
              {
                title: '模块', dataIndex: 'module', key: 'module', width: 90,
                render: (m: string) => <Tag color={moduleMap[m]?.color}>{moduleMap[m]?.text}</Tag>,
              },
              {
                title: '操作', dataIndex: 'action', key: 'action', width: 80,
                render: (a: string) => <Tag color={actionMap[a]?.color}>{actionMap[a]?.text}</Tag>,
              },
              {
                title: '详情', dataIndex: 'detail', key: 'detail',
                render: (d: any) => (
                  <code style={{ fontSize: 12 }}>
                    {d ? JSON.stringify(d) : '-'}
                  </code>
                ),
              },
              {
                title: 'IP', dataIndex: 'ip_address', key: 'ip_address', width: 130,
                render: (ip: string) => <span style={{ fontSize: 12, color: '#999' }}>{ip}</span>,
              },
              {
                title: '结果', dataIndex: 'result', key: 'result', width: 80,
                render: (r: string) => <Tag color={r === 'success' ? 'success' : 'error'}>{r === 'success' ? '成功' : '失败'}</Tag>,
              },
            ]}
          />
        )}
      </Spin>
    </Modal>
  )
}

export default OperationLogModal
