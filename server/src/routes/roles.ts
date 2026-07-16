import express, { Request, Response } from 'express';
import * as controllers from '../controllers/index.js';
import { requireRole, logOperation } from '../middleware/permission.js';

const router = express.Router();

// ============== 角色管理 ==============

router.get('/roles', async (req: Request, res: Response) => {
  try {
    const supplierCode = req.query.supplier_code as string;
    const roles = await controllers.getAllRoles(supplierCode);
    // 解析 permissions JSON
    const data = roles.map((r: any) => ({
      ...r,
      permissions: r.permissions ? JSON.parse(r.permissions) : [],
    }));
    res.json({ code: 200, data });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.get('/roles/:id', async (req: Request, res: Response) => {
  try {
    const role = await controllers.getRoleById(req.params.id);
    if (!role) return res.status(404).json({ code: 404, message: '角色不存在' });
    res.json({
      code: 200,
      data: { ...role, permissions: role.permissions ? JSON.parse(role.permissions) : [] }
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.post('/roles', requireRole('admin'), logOperation('permission', 'create_role'), async (req: Request, res: Response) => {
  try {
    const role = await controllers.createRole(req.body);
    res.json({ code: 200, data: role });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.put('/roles/:id', requireRole('admin'), logOperation('permission', 'update_role'), async (req: Request, res: Response) => {
  try {
    const role = await controllers.updateRole(req.params.id, req.body);
    res.json({ code: 200, data: role });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.delete('/roles/:id', requireRole('admin'), logOperation('permission', 'delete_role'), async (req: Request, res: Response) => {
  try {
    await controllers.deleteRole(req.params.id);
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

// ============== 用户角色分配 ==============

router.get('/users/:userId/roles', async (req: Request, res: Response) => {
  try {
    const roles = await controllers.getUserRoles(req.params.userId);
    res.json({
      code: 200,
      data: roles.map((r: any) => ({
        ...r,
        permissions: r.permissions ? JSON.parse(r.permissions) : [],
      }))
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.post('/users/:userId/roles', requireRole('admin'), logOperation('permission', 'assign_role'), async (req: Request, res: Response) => {
  try {
    const { role_ids, supplier_code } = req.body;
    const grantedBy = req.user?.id || 'system';
    const result = await controllers.setUserRoles(req.params.userId, role_ids, supplier_code, grantedBy);
    res.json({ code: 200, data: result });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

// ============== 数据权限范围 ==============

router.get('/users/:userId/data-scope', async (req: Request, res: Response) => {
  try {
    const scope = await controllers.getUserDataScope(req.params.userId);
    if (!scope) return res.json({ code: 200, data: null });
    res.json({
      code: 200,
      data: {
        ...scope,
        scope_ids: scope.scope_ids ? JSON.parse(scope.scope_ids) : [],
      }
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.post('/users/:userId/data-scope', requireRole('admin', 'area_manager', 'store_manager'), logOperation('permission', 'set_data_scope'), async (req: Request, res: Response) => {
  try {
    const data = {
      user_id: req.params.userId,
      supplier_code: req.body.supplier_code,
      scope_type: req.body.scope_type,
      scope_ids: req.body.scope_ids,
      created_by: req.user?.id || 'system',
    };
    const result = await controllers.setUserDataScope(data);
    res.json({ code: 200, data: result });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

export default router;
