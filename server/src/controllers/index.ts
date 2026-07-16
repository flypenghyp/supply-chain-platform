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
  const { name, email, phone, address, city, country, is_super_admin, business_license, super_admin_phone, super_admin_role } = data;
  
  await db.run(
    `INSERT INTO suppliers (id, name, email, phone, address, city, country, is_super_admin, business_license, super_admin_phone, super_admin_role) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, email, phone, address, city, country, is_super_admin || 0, business_license, super_admin_phone, super_admin_role]
  );
  
  return getSupplierById(id);
}

export async function updateSupplier(id: string, data: any) {
  const { name, email, phone, address, city, country, status, rating, is_super_admin, business_license, super_admin_phone, super_admin_role } = data;
  
  await db.run(
    `UPDATE suppliers SET name = ?, email = ?, phone = ?, address = ?, city = ?, 
     country = ?, status = ?, rating = ?, is_super_admin = ?, business_license = ?, super_admin_phone = ?, super_admin_role = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [name, email, phone, address, city, country, status, rating, is_super_admin, business_license, super_admin_phone, super_admin_role, id]
  );
  
  return getSupplierById(id);
}

export async function setSuperAdmin(supplierId: string, data: any) {
  const { is_super_admin, business_license, super_admin_phone, super_admin_role } = data;
  
  await db.run(
    `UPDATE suppliers SET is_super_admin = ?, business_license = ?, super_admin_phone = ?, super_admin_role = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [is_super_admin, business_license, super_admin_phone, super_admin_role, supplierId]
  );
  
  return getSupplierById(supplierId);
}

export async function getSuperAdmins() {
  return db.all('SELECT * FROM suppliers WHERE is_super_admin = 1 ORDER BY created_at DESC');
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

// Supplier Users
export async function getSupplierUsers(supplierCode: string) {
  return db.all(
    'SELECT * FROM supplier_users WHERE supplier_code = ? ORDER BY created_at DESC',
    [supplierCode]
  );
}

export async function getSupplierUserById(id: string) {
  return db.get('SELECT * FROM supplier_users WHERE id = ?', [id]);
}

export async function getSupplierUserByPhone(phone: string) {
  return db.get('SELECT * FROM supplier_users WHERE phone = ?', [phone]);
}

export async function getSupplierAdmin(supplierCode: string) {
  return db.get(
    'SELECT * FROM supplier_users WHERE supplier_code = ? AND role = ?',
    [supplierCode, 'admin']
  );
}

export async function createSupplierUser(data: any) {
  const id = uuidv4();
  const {
    supplier_code,
    name,
    phone,
    email,
    role,
    role_name,
    role_type,
    status,
    permissions,
    data_scope,
    created_by
  } = data;

  await db.run(
    `INSERT INTO supplier_users 
     (id, supplier_code, name, phone, email, role, role_name, role_type, status, permissions, data_scope, created_by) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      supplier_code,
      name,
      phone,
      email,
      role,
      role_name,
      role_type || 'custom',
      status || 'active',
      permissions ? JSON.stringify(permissions) : null,
      data_scope ? JSON.stringify(data_scope) : null,
      created_by
    ]
  );

  return getSupplierUserById(id);
}

export async function updateSupplierUser(id: string, data: any) {
  const {
    name,
    phone,
    email,
    role,
    role_name,
    role_type,
    status,
    permissions,
    data_scope
  } = data;

  await db.run(
    `UPDATE supplier_users 
     SET name = ?, phone = ?, email = ?, role = ?, role_name = ?, role_type = ?, 
         status = ?, permissions = ?, data_scope = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [
      name,
      phone,
      email,
      role,
      role_name,
      role_type,
      status,
      permissions ? JSON.stringify(permissions) : null,
      data_scope ? JSON.stringify(data_scope) : null,
      id
    ]
  );

  return getSupplierUserById(id);
}

export async function deleteSupplierUser(id: string) {
  await db.run('DELETE FROM supplier_users WHERE id = ?', [id]);
  return { success: true };
}

// Verify Codes
export async function createVerifyCode(data: any) {
  const id = uuidv4();
  const { phone, code, type, supplier_code, expire_time } = data;

  await db.run(
    `INSERT INTO verify_codes (id, phone, code, type, supplier_code, expire_time) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, phone, code, type, supplier_code, expire_time]
  );

  return { id, phone, code, type, supplier_code, expire_time };
}

export async function getVerifyCode(phone: string, type: string) {
  return db.get(
    `SELECT * FROM verify_codes 
     WHERE phone = ? AND type = ? AND used = 0 AND expire_time > datetime('now') 
     ORDER BY created_at DESC LIMIT 1`,
    [phone, type]
  );
}

export async function updateVerifyCode(id: string, data: any) {
  const { used, used_time, fail_count } = data;

  await db.run(
    `UPDATE verify_codes SET used = ?, used_time = ?, fail_count = ? WHERE id = ?`,
    [used, used_time, fail_count, id]
  );

  return { id };
}

// Super Admin Change Logs
export async function createSuperAdminChangeLog(data: any) {
  const id = uuidv4();
  const {
    supplier_code,
    old_admin_id,
    old_admin_name,
    old_admin_phone,
    new_admin_id,
    new_admin_name,
    new_admin_phone,
    operator_id,
    operator_name,
    operation_ip,
    operation_device,
    reason,
    verify_method
  } = data;

  await db.run(
    `INSERT INTO super_admin_change_logs 
     (id, supplier_code, old_admin_id, old_admin_name, old_admin_phone, 
      new_admin_id, new_admin_name, new_admin_phone, operator_id, operator_name, 
      operation_ip, operation_device, reason, verify_method) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      supplier_code,
      old_admin_id,
      old_admin_name,
      old_admin_phone,
      new_admin_id,
      new_admin_name,
      new_admin_phone,
      operator_id,
      operator_name,
      operation_ip,
      operation_device,
      reason,
      verify_method || 'sms_code'
    ]
  );

  return { id };
}

export async function getSuperAdminChangeLogs(supplierCode: string) {
  return db.all(
    `SELECT * FROM super_admin_change_logs WHERE supplier_code = ? ORDER BY operation_time DESC`,
    [supplierCode]
  );
}

// Esign Info
export async function getEsignInfo(userId: string) {
  return db.get('SELECT * FROM supplier_esign_info WHERE user_id = ?', [userId]);
}

export async function createEsignInfo(data: any) {
  const id = uuidv4();
  const {
    user_id,
    supplier_code,
    real_name,
    phone,
    id_card,
    status,
    verified,
    verified_at,
    verified_by,
    enabled,
    granted_at,
    granted_by
  } = data;

  await db.run(
    `INSERT INTO supplier_esign_info 
     (id, user_id, supplier_code, real_name, phone, id_card, status, verified, 
      verified_at, verified_by, enabled, granted_at, granted_by) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      user_id,
      supplier_code,
      real_name,
      phone,
      id_card,
      status || 'pending',
      verified || 0,
      verified_at,
      verified_by,
      enabled || 0,
      granted_at,
      granted_by
    ]
  );

  return getEsignInfo(user_id);
}

export async function updateEsignInfo(userId: string, data: any) {
  const {
    real_name,
    phone,
    id_card,
    status,
    verified,
    verified_at,
    verified_by,
    enabled,
    granted_at,
    granted_by,
    reject_reason
  } = data;

  await db.run(
    `UPDATE supplier_esign_info 
     SET real_name = ?, phone = ?, id_card = ?, status = ?, verified = ?, 
         verified_at = ?, verified_by = ?, enabled = ?, granted_at = ?, 
         granted_by = ?, reject_reason = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE user_id = ?`,
    [
      real_name,
      phone,
      id_card,
      status,
      verified,
      verified_at,
      verified_by,
      enabled,
      granted_at,
      granted_by,
      reject_reason,
      userId
    ]
  );

  return getEsignInfo(userId);
}

// Esign Logs
export async function createEsignLog(data: any) {
  const id = uuidv4();
  const {
    user_id,
    supplier_code,
    action,
    action_ip,
    action_device,
    result,
    reason,
    real_name,
    phone,
    id_card
  } = data;

  await db.run(
    `INSERT INTO supplier_esign_logs 
     (id, user_id, supplier_code, action, action_ip, action_device, result, 
      reason, real_name, phone, id_card) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      user_id,
      supplier_code,
      action,
      action_ip,
      action_device,
      result,
      reason,
      real_name,
      phone,
      id_card
    ]
  );

  return { id };
}

export async function getEsignLogs(userId: string) {
  return db.all(
    `SELECT * FROM supplier_esign_logs WHERE user_id = ? ORDER BY action_time DESC`,
    [userId]
  );
}

// ============== Phase 1 新增模块 ==============
export * from './licenses.js';
export * from './authorizations.js';
export * from './operationLogs.js';
export * from './roles.js';
