import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';

export async function getAllSuppliers() {
  return db.all('SELECT * FROM suppliers ORDER BY created_at DESC');
}

export async function getSupplierById(id: string) {
  return db.get('SELECT * FROM suppliers WHERE id = ?', [id]);
}

export async function createSupplier(data: any) {
  const id = uuidv4();
  const { name, email, phone, address, city, country } = data;
  
  await db.run(
    `INSERT INTO suppliers (id, name, email, phone, address, city, country) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, name, email, phone, address, city, country]
  );
  
  return getSupplierById(id);
}

export async function updateSupplier(id: string, data: any) {
  const { name, email, phone, address, city, country, status, rating } = data;
  
  await db.run(
    `UPDATE suppliers SET name = ?, email = ?, phone = ?, address = ?, city = ?, 
     country = ?, status = ?, rating = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [name, email, phone, address, city, country, status, rating, id]
  );
  
  return getSupplierById(id);
}

export async function deleteSupplier(id: string) {
  await db.run('DELETE FROM suppliers WHERE id = ?', [id]);
  return { success: true };
}

// Products
export async function getAllProducts() {
  return db.all(`
    SELECT p.*, s.name as supplier_name 
    FROM products p 
    LEFT JOIN suppliers s ON p.supplier_id = s.id 
    ORDER BY p.created_at DESC
  `);
}

export async function getProductsBySupplier(supplierId: string) {
  return db.all('SELECT * FROM products WHERE supplier_id = ? ORDER BY created_at DESC', [supplierId]);
}

export async function getProductById(id: string) {
  return db.get('SELECT * FROM products WHERE id = ?', [id]);
}

export async function createProduct(data: any) {
  const id = uuidv4();
  const { supplier_id, name, sku, category, unit_price, stock_quantity, min_order_qty, lead_time_days } = data;
  
  await db.run(
    `INSERT INTO products (id, supplier_id, name, sku, category, unit_price, stock_quantity, min_order_qty, lead_time_days) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, supplier_id, name, sku, category, unit_price, stock_quantity, min_order_qty, lead_time_days]
  );
  
  return getProductById(id);
}

export async function updateProduct(id: string, data: any) {
  const { name, sku, category, unit_price, stock_quantity, min_order_qty, lead_time_days } = data;
  
  await db.run(
    `UPDATE products SET name = ?, sku = ?, category = ?, unit_price = ?, 
     stock_quantity = ?, min_order_qty = ?, lead_time_days = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [name, sku, category, unit_price, stock_quantity, min_order_qty, lead_time_days, id]
  );
  
  return getProductById(id);
}

export async function deleteProduct(id: string) {
  await db.run('DELETE FROM products WHERE id = ?', [id]);
  return { success: true };
}

// Orders
export async function getAllOrders() {
  return db.all(`
    SELECT o.*, s.name as supplier_name 
    FROM orders o 
    LEFT JOIN suppliers s ON o.supplier_id = s.id 
    ORDER BY o.created_at DESC
  `);
}

export async function getOrderById(id: string) {
  return db.get(`
    SELECT o.*, s.name as supplier_name 
    FROM orders o 
    LEFT JOIN suppliers s ON o.supplier_id = s.id 
    WHERE o.id = ?
  `, [id]);
}

export async function getOrderItems(orderId: string) {
  return db.all(`
    SELECT oi.*, p.name as product_name, p.sku 
    FROM order_items oi 
    LEFT JOIN products p ON oi.product_id = p.id 
    WHERE oi.order_id = ?
  `, [orderId]);
}

export async function createOrder(data: any) {
  const id = uuidv4();
  const { supplier_id, order_number, total_amount, status } = data;
  
  await db.run(
    `INSERT INTO orders (id, order_number, supplier_id, total_amount, status) 
     VALUES (?, ?, ?, ?, ?)`,
    [id, order_number, supplier_id, total_amount, status || 'pending']
  );
  
  return getOrderById(id);
}

export async function updateOrder(id: string, data: any) {
  const { status, delivery_date } = data;
  
  await db.run(
    `UPDATE orders SET status = ?, delivery_date = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [status, delivery_date, id]
  );
  
  return getOrderById(id);
}

export async function addOrderItem(orderId: string, data: any) {
  const id = uuidv4();
  const { product_id, quantity, unit_price } = data;
  const subtotal = quantity * unit_price;
  
  await db.run(
    `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, orderId, product_id, quantity, unit_price, subtotal]
  );
  
  return { id, order_id: orderId, product_id, quantity, unit_price, subtotal };
}

// Analytics
export async function getDashboardStats() {
  const suppliers = await db.get('SELECT COUNT(*) as count FROM suppliers');
  const products = await db.get('SELECT COUNT(*) as count FROM products');
  const orders = await db.get('SELECT COUNT(*) as count FROM orders');
  const totalValue = await db.get('SELECT SUM(total_amount) as total FROM orders WHERE status IN ("confirmed", "shipped")');
  
  return {
    suppliers: suppliers?.count || 0,
    products: products?.count || 0,
    orders: orders?.count || 0,
    totalValue: totalValue?.total || 0
  };
}

export async function getOrderStats() {
  return db.all(`
    SELECT status, COUNT(*) as count 
    FROM orders 
    GROUP BY status
  `);
}

export async function getTopSuppliers() {
  return db.all(`
    SELECT s.id, s.name, COUNT(o.id) as order_count, SUM(o.total_amount) as total_amount
    FROM suppliers s
    LEFT JOIN orders o ON s.id = o.supplier_id
    GROUP BY s.id
    ORDER BY total_amount DESC
    LIMIT 10
  `);
}

export async function getProductCategories() {
  return db.all(`
    SELECT category, COUNT(*) as count, AVG(unit_price) as avg_price
    FROM products
    GROUP BY category
  `);
}
