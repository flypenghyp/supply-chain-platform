import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { supplierService } from '../services/api';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await supplierService.getAll();
      setSuppliers(res.data);
    } catch (error) {
      message.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    form.resetFields();
    setEditingId(null);
    setIsModalVisible(true);
  };

  const handleEditClick = (record: any) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsModalVisible(true);
  };

  const handleDeleteClick = async (id: string) => {
    Modal.confirm({
      title: 'Delete Supplier',
      content: 'Are you sure you want to delete this supplier?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await supplierService.delete(id);
          message.success('Supplier deleted successfully');
          fetchSuppliers();
        } catch (error) {
          message.error('Failed to delete supplier');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await supplierService.update(editingId, values);
        message.success('Supplier updated successfully');
      } else {
        await supplierService.create(values);
        message.success('Supplier created successfully');
      }
      setIsModalVisible(false);
      fetchSuppliers();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'Country', dataIndex: 'country', key: 'country' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <span style={{ color: status === 'active' ? 'green' : 'red' }}>{status}</span> },
    { title: 'Rating', dataIndex: 'rating', key: 'rating' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditClick(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteClick(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Row style={{ marginBottom: '16px' }}>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
              Add Supplier
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={suppliers}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={editingId ? 'Edit Supplier' : 'Add New Supplier'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Country" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="active">
            <Input />
          </Form.Item>
          <Form.Item name="rating" label="Rating" initialValue={0}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Suppliers;
