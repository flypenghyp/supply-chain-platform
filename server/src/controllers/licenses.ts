import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';

// ============== 证照管理 ==============

export async function getAllLicenses(supplierCode?: string) {
  if (supplierCode) {
    return db.all('SELECT * FROM licenses WHERE supplier_code = ? ORDER BY created_at DESC', [supplierCode]);
  }
  return db.all('SELECT * FROM licenses ORDER BY created_at DESC');
}

export async function getLicenseById(id: string) {
  return db.get('SELECT * FROM licenses WHERE id = ?', [id]);
}

export async function createLicense(data: any) {
  const id = uuidv4();
  const {
    supplier_code, store_id, license_type, license_name, license_no,
    issue_date, expire_date, is_permanent, issuing_authority, image_url,
    ai_recognized, ai_raw_data, created_by,
  } = data;

  await db.run(
    `INSERT INTO licenses
     (id, supplier_code, store_id, license_type, license_name, license_no,
      issue_date, expire_date, is_permanent, issuing_authority, image_url,
      ai_recognized, ai_raw_data, status, version, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 1, ?)`,
    [id, supplier_code, store_id || null, license_type, license_name, license_no,
     issue_date, expire_date || null, is_permanent ? 1 : 0, issuing_authority, image_url,
     ai_recognized ? 1 : 0, ai_raw_data ? JSON.stringify(ai_raw_data) : null, created_by]
  );

  return getLicenseById(id);
}

export async function updateLicense(id: string, data: any) {
  const fields = [
    'license_name', 'license_no', 'issue_date', 'expire_date', 'is_permanent',
    'issuing_authority', 'image_url', 'status', 'reject_reason',
  ];
  const updates: string[] = [];
  const values: any[] = [];

  for (const f of fields) {
    if (data[f] !== undefined) {
      updates.push(`${f} = ?`);
      values.push(f === 'is_permanent' ? (data[f] ? 1 : 0) : data[f]);
    }
  }

  if (updates.length === 0) return getLicenseById(id);

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  await db.run(`UPDATE licenses SET ${updates.join(', ')} WHERE id = ?`, values);
  return getLicenseById(id);
}

export async function deleteLicense(id: string) {
  await db.run('DELETE FROM licenses WHERE id = ?', [id]);
  return { success: true };
}

// 延期：生成新 version，关联 parent_id
export async function renewLicense(oldId: string, newData: any) {
  const old = await getLicenseById(oldId);
  if (!old) throw new Error('原证照不存在');

  // 把原证照标记为 expired
  await db.run(
    `UPDATE licenses SET status = 'expired', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [oldId]
  );

  // 创建新 version
  const id = uuidv4();
  await db.run(
    `INSERT INTO licenses
     (id, supplier_code, store_id, license_type, license_name, license_no,
      issue_date, expire_date, is_permanent, issuing_authority, image_url,
      status, version, parent_id, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)`,
    [id, old.supplier_code, old.store_id, old.license_type,
     newData.license_name || old.license_name, newData.license_no || old.license_no,
     newData.issue_date, newData.expire_date, newData.is_permanent ? 1 : 0,
     newData.issuing_authority || old.issuing_authority, newData.image_url || old.image_url,
     (old.version || 1) + 1, oldId, newData.created_by]
  );

  return getLicenseById(id);
}

export async function checkLicenseDuplicate(supplierCode: string, storeId: string | null, licenseType: string) {
  return db.get(
    `SELECT id FROM licenses
     WHERE supplier_code = ? AND IFNULL(store_id, '') = ? AND license_type = ?
       AND status = 'active' AND is_permanent = 0`,
    [supplierCode, storeId || '', licenseType]
  );
}

export async function getLicensesByStore(supplierCode: string, storeId: string) {
  return db.all(
    'SELECT * FROM licenses WHERE supplier_code = ? AND store_id = ? ORDER BY created_at DESC',
    [supplierCode, storeId]
  );
}
