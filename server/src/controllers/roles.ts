import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';

// ============== 角色管理（双层权限-功能权限）==============

export async function getAllRoles(supplierCode?: string) {
  // 系统角色 (type='system') + 自定义角色 (created_by 关联到 supplier_code)
  if (supplierCode) {
    return db.all(
      `SELECT * FROM roles
       WHERE type = 'system' OR created_by = ? OR created_by IS NULL
       ORDER BY type DESC, created_at ASC`,
      [supplierCode]
    );
  }
  return db.all('SELECT * FROM roles ORDER BY type DESC, created_at ASC');
}

export async function getRoleById(id: string) {
  return db.get('SELECT * FROM roles WHERE id = ?', [id]);
}

export async function getRoleByCode(code: string) {
  return db.get('SELECT * FROM roles WHERE code = ?', [code]);
}

export async function createRole(data: any) {
  const id = uuidv4();
  const { code, name, description, type, permissions, created_by } = data;

  await db.run(
    `INSERT INTO roles (id, code, name, description, type, permissions, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, 'active', ?)`,
    [id, code, name, description, type || 'custom', JSON.stringify(permissions || []), created_by]
  );

  return getRoleById(id);
}

export async function updateRole(id: string, data: any) {
  const fields = ['name', 'description', 'permissions', 'status'];
  const updates: string[] = [];
  const values: any[] = [];

  for (const f of fields) {
    if (data[f] !== undefined) {
      updates.push(`${f} = ?`);
      values.push(f === 'permissions' ? JSON.stringify(data[f]) : data[f]);
    }
  }

  if (updates.length === 0) return getRoleById(id);

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  await db.run(`UPDATE roles SET ${updates.join(', ')} WHERE id = ?`, values);
  return getRoleById(id);
}

export async function deleteRole(id: string) {
  // 系统角色不可删
  const role = await getRoleById(id);
  if (role && role.type === 'system') {
    throw new Error('系统角色不可删除');
  }
  await db.run('DELETE FROM user_roles WHERE role_id = ?', [id]);
  await db.run('DELETE FROM roles WHERE id = ?', [id]);
  return { success: true };
}

// ============== 用户角色关联 ==============

export async function getUserRoles(userId: string) {
  return db.all(
    `SELECT r.* FROM roles r
     INNER JOIN user_roles ur ON r.id = ur.role_id
     WHERE ur.user_id = ?`,
    [userId]
  );
}

export async function assignUserRole(userId: string, roleId: string, supplierCode: string, grantedBy: string) {
  const id = uuidv4();
  await db.run(
    `INSERT OR IGNORE INTO user_roles (id, user_id, role_id, supplier_code, granted_by)
     VALUES (?, ?, ?, ?, ?)`,
    [id, userId, roleId, supplierCode, grantedBy]
  );
  return { success: true };
}

export async function revokeUserRole(userId: string, roleId: string) {
  await db.run(
    'DELETE FROM user_roles WHERE user_id = ? AND role_id = ?',
    [userId, roleId]
  );
  return { success: true };
}

export async function setUserRoles(userId: string, roleIds: string[], supplierCode: string, grantedBy: string) {
  // 先删后增
  await db.run('DELETE FROM user_roles WHERE user_id = ? AND supplier_code = ?', [userId, supplierCode]);
  for (const roleId of roleIds) {
    await assignUserRole(userId, roleId, supplierCode, grantedBy);
  }
  return { success: true };
}

// ============== 用户数据权限范围 ==============

export async function getUserDataScope(userId: string) {
  return db.get(
    'SELECT * FROM user_data_scope WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
    [userId]
  );
}

export async function setUserDataScope(data: any) {
  const id = uuidv4();
  const { user_id, supplier_code, scope_type, scope_ids, created_by } = data;

  // 删除旧的范围
  await db.run('DELETE FROM user_data_scope WHERE user_id = ? AND supplier_code = ?', [user_id, supplier_code]);

  // 插入新的
  await db.run(
    `INSERT INTO user_data_scope (id, user_id, supplier_code, scope_type, scope_ids, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, user_id, supplier_code, scope_type, JSON.stringify(scope_ids || []), created_by]
  );

  return { success: true };
}
