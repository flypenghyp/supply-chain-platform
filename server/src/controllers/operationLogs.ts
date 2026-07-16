import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';

// ============== 操作日志 ==============

export async function createOperationLog(data: any) {
  const id = uuidv4();
  const {
    user_id, user_name, supplier_code, module, action,
    target_id, target_type, detail, result, error_message,
    ip_address, user_agent,
  } = data;

  await db.run(
    `INSERT INTO operation_logs
     (id, user_id, user_name, supplier_code, module, action,
      target_id, target_type, detail, result, error_message,
      ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, user_id, user_name, supplier_code, module, action,
     target_id, target_type, detail ? JSON.stringify(detail) : null,
     result || 'success', error_message, ip_address, user_agent]
  );

  return { id };
}

export async function getOperationLogs(filter: {
  userId?: string;
  supplierCode?: string;
  module?: string;
  action?: string;
  limit?: number;
  offset?: number;
}) {
  let sql = 'SELECT * FROM operation_logs WHERE 1=1';
  const params: any[] = [];

  if (filter.userId) {
    sql += ' AND user_id = ?';
    params.push(filter.userId);
  }
  if (filter.supplierCode) {
    sql += ' AND supplier_code = ?';
    params.push(filter.supplierCode);
  }
  if (filter.module) {
    sql += ' AND module = ?';
    params.push(filter.module);
  }
  if (filter.action) {
    sql += ' AND action = ?';
    params.push(filter.action);
  }

  sql += ' ORDER BY operation_time DESC';

  if (filter.limit) {
    sql += ' LIMIT ? OFFSET ?';
    params.push(filter.limit, filter.offset || 0);
  }

  return db.all(sql, params);
}

export async function getOperationLogsByUser(userId: string, limit = 100) {
  return db.all(
    'SELECT * FROM operation_logs WHERE user_id = ? ORDER BY operation_time DESC LIMIT ?',
    [userId, limit]
  );
}
