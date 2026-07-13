import React, { useEffect, useState, useCallback } from 'react';
import { Card, List, Tag, Badge, Empty, Drawer, Button, message, Spin } from 'antd';
import { BellOutlined, FileTextOutlined, EyeOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import AdvancedSearchFilter from '../components/common/AdvancedSearchFilter';

interface Announcement {
  id: string;
  title: string;
  type: 'notice' | 'announcement';
  content: string;
  is_important: boolean;
  is_published: boolean;
  expired_at: string;
  created_at: string;
  created_by: string;
  is_read?: boolean;
  attachments?: string[];
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: '2024年春节放假通知',
    type: 'notice',
    content: '春节放假时间为2024年2月9日至2月17日，共9天。请各供应商提前做好备货安排，确保春节期间商品供应稳定。如有紧急情况，请联系采购部王经理：13800138001。',
    is_important: true,
    is_published: true,
    expired_at: '2024-02-20',
    created_at: '2024-01-20',
    created_by: 'admin',
  },
  {
    id: '2',
    title: '新供应商入驻流程调整公告',
    type: 'announcement',
    content: '自2024年2月1日起，新供应商入驻需提供完整的资质证明文件，包括营业执照、食品经营许可证等。请各新供应商提前准备相关材料，以便顺利完成入驻流程。',
    is_important: false,
    is_published: true,
    expired_at: '2024-02-18',
    created_at: '2024-01-18',
    created_by: 'admin',
  },
  {
    id: '3',
    title: '1月份结算时间安排',
    type: 'notice',
    content: '1月份对账结算时间为2024年2月5日至2月8日，请各供应商按时提交对账单据。如有疑问，请联系财务部张会计：13800138002。',
    is_important: true,
    is_published: true,
    expired_at: '2024-02-15',
    created_at: '2024-01-15',
    created_by: 'admin',
  },
  {
    id: '4',
    title: '夏季促销活动合作通知',
    type: 'notice',
    content: '为迎接夏季购物高峰，现面向各供应商征集夏季促销活动方案。请有意参与的供应商于2024年3月31日前提交活动方案至市场部。',
    is_important: false,
    is_published: true,
    expired_at: '2024-03-31',
    created_at: '2024-01-12',
    created_by: 'admin',
  },
  {
    id: '5',
    title: '关于商品包装规范更新的公告',
    type: 'announcement',
    content: '为提升消费者购物体验，现对商品包装规范进行更新。新规范将于2024年3月1日起正式实施，请各供应商务必按照新规范执行。',
    is_important: true,
    is_published: true,
    expired_at: '2024-03-01',
    created_at: '2024-01-10',
    created_by: 'admin',
  },
  {
    id: '6',
    title: '系统升级维护通知',
    type: 'notice',
    content: '为提升系统性能，我们将于2024年1月25日凌晨2:00-4:00进行系统升级维护。维护期间供应商平台将暂停服务，请提前做好相关准备。',
    is_important: false,
    is_published: true,
    expired_at: '2024-01-26',
    created_at: '2024-01-08',
    created_by: 'admin',
  },
];

const READ_ANNOUNCEMENTS_KEY = 'supplier_read_announcements';

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    type: '',
    is_important: '',
    is_read: '',
  });

  const loadReadAnnouncements = () => {
    try {
      const stored = localStorage.getItem(READ_ANNOUNCEMENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  };

  const saveReadAnnouncements = (readIds: string[]) => {
    try {
      localStorage.setItem(READ_ANNOUNCEMENTS_KEY, JSON.stringify(readIds));
    } catch (error) {
      console.error('Failed to save read announcements:', error);
    }
  };

  const fetchAnnouncements = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const readIds = loadReadAnnouncements();
      const announcementsWithReadStatus = mockAnnouncements.map(a => ({
        ...a,
        is_read: readIds.includes(a.id),
      }));
      setAnnouncements(announcementsWithReadStatus);
      setLoading(false);
      message.success('刷新成功');
    }, 500);
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setDrawerVisible(true);

    if (!announcement.is_read) {
      const readIds = loadReadAnnouncements();
      const newReadIds = [...readIds, announcement.id];
      saveReadAnnouncements(newReadIds);
      setAnnouncements(prev =>
        prev.map(a => (a.id === announcement.id ? { ...a, is_read: true } : a))
      );
    }
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedAnnouncement(null);
  };

  const getTypeTag = (type: string) => {
    return type === 'notice' ? (
      <Tag color="blue">通知</Tag>
    ) : (
      <Tag color="green">公告</Tag>
    );
  };

  const handleSearch = () => {
    message.success('查询成功');
  };

  const handleReset = () => {
    setFilters({
      title: '',
      type: '',
      is_important: '',
      is_read: '',
    });
    message.success('已重置查询条件');
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (!a.is_published) return false;
    if (filters.title && !a.title.includes(filters.title)) return false;
    if (filters.type && a.type !== filters.type) return false;
    if (filters.is_important !== '' && a.is_important !== (filters.is_important === 'true')) return false;
    if (filters.is_read !== '' && (a.is_read ? 'true' : 'false') !== filters.is_read) return false;
    return true;
  });

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BellOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>公告通知</h2>
            <Badge count={filteredAnnouncements.filter(a => !a.is_read).length} />
          </div>
          <Button type="primary" icon={<ReloadOutlined />} onClick={fetchAnnouncements} style={{ height: 32 }}>
            刷新
          </Button>
        </div>

        <AdvancedSearchFilter
          fields={[
            { key: 'title', label: '标题', type: 'input', placeholder: '搜索标题' },
            { key: 'type', label: '类型', type: 'select', placeholder: '请选择',
              options: [
                { label: '通知', value: 'notice' },
                { label: '公告', value: 'announcement' }
              ]
            },
            { key: 'is_important', label: '重要程度', type: 'select', placeholder: '请选择',
              options: [
                { label: '重要', value: 'true' },
                { label: '普通', value: 'false' }
              ]
            },
            { key: 'is_read', label: '阅读状态', type: 'select', placeholder: '请选择',
              options: [
                { label: '未读', value: 'false' },
                { label: '已读', value: 'true' }
              ]
            }
          ]}
          values={filters}
          onChange={(k, v) => setFilters({ ...filters, [k]: v })}
          onSearch={() => handleSearch()}
          onReset={() => handleReset()}
        />

        <Spin spinning={loading}>
          {filteredAnnouncements.length === 0 ? (
            <Empty description="暂无公告" />
          ) : (
            <List
              dataSource={filteredAnnouncements}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: '16px',
                    marginBottom: '12px',
                    backgroundColor: item.is_read ? '#fff' : '#f0f9ff',
                    border: '1px solid #e8e8e8',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onClick={() => handleViewAnnouncement(item)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{ fontSize: '24px', color: item.is_important ? '#f5222d' : '#1890ff' }}>
                        <FileTextOutlined />
                      </div>
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {!item.is_read && <Badge dot />}
                        {item.is_important && <Tag color="red">重要</Tag>}
                        {getTypeTag(item.type)}
                        <span style={{ fontSize: '16px', fontWeight: 500 }}>{item.title}</span>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                          发布时间: {item.created_at}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          截止时间: {item.expired_at}
                        </div>
                      </div>
                    }
                  />
                  <Button type="link" icon={<EyeOutlined />}>
                    查看
                  </Button>
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Card>

      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileTextOutlined />
            <span>公告详情</span>
          </div>
        }
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={handleCloseDrawer}
      >
        {selectedAnnouncement && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              {selectedAnnouncement.is_important && (
                <Tag color="red" style={{ marginBottom: '8px', marginRight: '8px' }}>
                  重要
                </Tag>
              )}
              {getTypeTag(selectedAnnouncement.type)}
            </div>
            <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 'bold' }}>
              {selectedAnnouncement.title}
            </h2>
            <div style={{ marginBottom: '24px', fontSize: '13px', color: '#666' }}>
              <div style={{ marginBottom: '4px' }}>发布时间: {selectedAnnouncement.created_at}</div>
              <div>截止时间: {selectedAnnouncement.expired_at}</div>
            </div>
            <div
              style={{
                padding: '16px',
                backgroundColor: '#fafafa',
                borderRadius: '4px',
                lineHeight: '1.8',
                fontSize: '14px',
              }}
            >
              {selectedAnnouncement.content}
            </div>
            {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>附件</h3>
                {selectedAnnouncement.attachments.map((attachment, index) => (
                  <div key={index} style={{ padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '8px' }}>
                    <FileTextOutlined style={{ marginRight: '8px' }} />
                    {attachment}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Announcements;
