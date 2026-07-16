import { Request, Response, NextFunction } from 'express';
import { db } from '../db/database.js';

/**
 * 权限中间件 - 解析 JWT/Token 简易实现
 * 实际生产用 JWT，本期用 header X-User-Id mock
 */
export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  supplier_code: string;
  roles: string[];            // ['admin', 'staff', ...] - 功能权限
  data_scope_type: string;    // 'all' | 'region' | 'store' | 'counter' - 数据权限
  data_scope_ids: string[];   // 数据范围 ID 列表
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * 简易身份解析：从 X-User-Id 头读用户
 * 完整登录态用 JWT，本期 mock
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id'] as string;
  const supplierCode = req.headers['x-supplier-code'] as string;

  if (!userId) {
    // 允许通过 /health、/api/ai/recognize 等公开接口
    return next();
  }

  try {
    const user = await db.get('SELECT * FROM supplier_users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户不存在' });
    }

    // 加载用户角色
    const roles = await db.all(
      `SELECT r.code FROM roles r
       INNER JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = ?`,
      [userId]
    );

    // 加载数据权限
    const dataScope = await db.get(
      'SELECT * FROM user_data_scope WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    req.user = {
      id: user.id,
      phone: user.phone,
      name: user.name,
      supplier_code: supplierCode || user.supplier_code,
      roles: roles.map((r: any) => r.code),
      data_scope_type: dataScope?.scope_type || 'none',
      data_scope_ids: dataScope ? JSON.parse(dataScope.scope_ids || '[]') : [],
    };

    next();
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
}

/**
 * 角色守卫：必须有任一指定角色
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ code: 401, message: '未登录' });
    }

    const hasRole = req.user.roles.some(r => allowedRoles.includes(r));
    if (!hasRole) {
      return res.status(403).json({
        code: 403,
        message: `仅 ${allowedRoles.join('/')} 角色可操作，您当前角色：${req.user.roles.join(',') || '无'}`
      });
    }

    next();
  };
}

/**
 * 数据权限守卫：检查用户对目标 store_id 是否有访问权限
 */
export function checkDataScope(storeId: string, user: AuthUser): boolean {
  // 超管全部通
  if (user.roles.includes('admin') || user.data_scope_type === 'all') {
    return true;
  }

  // 无数据范围
  if (user.data_scope_type === 'none' || !user.data_scope_ids?.length) {
    return false;
  }

  // 在范围内
  return user.data_scope_ids.includes(storeId);
}

/**
 * 操作日志中间件
 */
export function logOperation(module: string, action: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next();

    // 在 res.json 后记录日志
    const originalJson = res.json.bind(res);
    const user = req.user;  // 缓存到 closure
    res.json = function(body: any) {
      const result = res.statusCode < 400 ? 'success' : 'failed';
      db.run(
        `INSERT INTO operation_logs
         (id, user_id, user_name, supplier_code, module, action,
          target_id, target_type, detail, result, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          require('uuid').v4(),
          user.id,
          user.name,
          user.supplier_code,
          module,
          action,
          req.params.id || req.body.id || null,
          module,
          JSON.stringify({ url: req.originalUrl, method: req.method }),
          result,
          req.ip,
          req.headers['user-agent'],
        ]
      ).catch((err: Error) => console.error('Log operation failed:', err));
      return originalJson(body);
    };

    next();
  };
}
