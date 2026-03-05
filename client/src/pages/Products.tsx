import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { productService, supplierService } from '../services/api';

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAll();
      setProducts(res.data);
    } catch (error) {
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await supplierService.getAll();
      setSuppliers(res.data);
    } catch (error) {
      console.error('Failed to load suppliers', error);
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
      title: 'Delete Product',
      content: 'Are you sure you want to delete this product?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await productService.delete(id);
          message.success('Product deleted successfully');
          fetchProducts();
        } catch (error) {
          message.error('Failed to delete product');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await productService.update(editingId, values);
        message.success('Product updated successfully');
      } else {
        await productService.create(values);
        message.success('Product created successfully');
      }
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku', width: 120 },
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
    { title: 'Supplier', dataIndex: 'supplier_name', key: 'supplier_name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Unit Price', dataIndex: 'unit_price', key: 'unit_price', render: (price: number) => `¥${price.toFixed(2)}` },
    { title: 'Stock', dataIndex: 'stock_quantity', key: 'stock_quantity' },
    { title: 'Min Order', dataIndex: 'min_order_qty', key: 'min_order_qty' },
    { title: 'Lead Time', dataIndex: 'lead_time_days', key: 'lead_time_days', render: (days: number) => `${days} days` },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEditClick(record)} />
          <Button icon={<DeleteOutlined />} danger size="small" onClick={() => handleDeleteClick(record.id)} />
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
              Add Product
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={products}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={editingId ? 'Edit Product' : 'Add New Product'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="supplier_id" label="Supplier" rules={[{ required: true }]}>
            <Select placeholder="Select supplier">
              {suppliers.map(supplier => (
                <Select.Option key={supplier.id} value={supplier.id}>{supplier.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="unit_price" label="Unit Price" rules={[{ required: true }]}>
            <InputNumber min={0} step={0.01} />
          </Form.Item>
          <Form.Item name="stock_quantity" label="Stock Quantity" initialValue={0}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name="min_order_qty" label="Minimum Order Quantity" initialValue={1}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="lead_time_days" label="Lead Time (Days)" initialValue={7}>
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
