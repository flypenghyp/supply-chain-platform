import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';

// ============== 授权委托书 ==============

export async function getAllAuthorizations(supplierCode?: string, status?: string) {
  let sql = 'SELECT * FROM authorizations WHERE 1=1';
  const params: any[] = [];
  if (supplierCode) {
    sql += ' AND supplier_code = ?';
    params.push(supplierCode);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';
  return db.all(sql, params);
}

export async function getAuthorizationById(id: string) {
  return db.get('SELECT * FROM authorizations WHERE id = ?', [id]);
}

export async function createAuthorization(data: any) {
  const id = uuidv4();
  const {
    supplier_code, submitter_user_id, submitter_name, submitter_phone,
    file_url, file_type, file_size, auth_no, auth_start_date, auth_end_date,
    authorizer_name, authorizee_name,
  } = data;

  await db.run(
    `INSERT INTO authorizations
     (id, supplier_code, submitter_user_id, submitter_name, submitter_phone,
      file_url, file_type, file_size, auth_no, auth_start_date, auth_end_date,
      authorizer_name, authorizee_name, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [id, supplier_code, submitter_user_id, submitter_name, submitter_phone,
     file_url, file_type, file_size, auth_no, auth_start_date, auth_end_date,
     authorizer_name, authorizee_name]
  );

  return getAuthorizationById(id);
}

export async function approveAuthorization(id: string, reviewerId: string, reviewerName: string) {
  await db.run(
    `UPDATE authorizations
     SET status = 'approved', reviewer_id = ?, reviewer_name = ?, review_time = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [reviewerId, reviewerName, id]
  );
  return getAuthorizationById(id);
}

export async function rejectAuthorization(id: string, reviewerId: string, reviewerName: string, reason: string) {
  if (!reason || !reason.trim()) {
    throw new Error('驳回原因必填');
  }
  await db.run(
    `UPDATE authorizations
     SET status = 'rejected', reviewer_id = ?, reviewer_name = ?, review_time = CURRENT_TIMESTAMP,
         reject_reason = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [reviewerId, reviewerName, reason.trim(), id]
  );
  return getAuthorizationById(id);
}

export async function deleteAuthorization(id: string) {
  await db.run('DELETE FROM authorizations WHERE id = ?', [id]);
  return { success: true };
}
