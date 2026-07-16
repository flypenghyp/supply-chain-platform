import express, { Request, Response } from 'express';
import * as controllers from '../controllers/index.js';
import { requireRole, logOperation } from '../middleware/permission.js';

const router = express.Router();

// ============== 授权委托书 ==============

router.get('/authorizations', async (req: Request, res: Response) => {
  try {
    const supplierCode = req.query.supplier_code as string;
    const status = req.query.status as string;
    const list = await controllers.getAllAuthorizations(supplierCode, status);
    res.json({ code: 200, data: list });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.get('/authorizations/:id', async (req: Request, res: Response) => {
  try {
    const auth = await controllers.getAuthorizationById(req.params.id);
    if (!auth) return res.status(404).json({ code: 404, message: '授权书不存在' });
    res.json({ code: 200, data: auth });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.post('/authorizations', logOperation('authorization', 'submit'), async (req: Request, res: Response) => {
  try {
    const auth = await controllers.createAuthorization(req.body);
    res.json({ code: 200, data: auth });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.post('/authorizations/:id/approve', requireRole('admin'), logOperation('authorization', 'approve'), async (req: Request, res: Response) => {
  try {
    const reviewerId = req.user?.id || '';
    const reviewerName = req.user?.name || '';
    const auth = await controllers.approveAuthorization(req.params.id, reviewerId, reviewerName);
    res.json({ code: 200, data: auth });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.post('/authorizations/:id/reject', requireRole('admin'), logOperation('authorization', 'reject'), async (req: Request, res: Response) => {
  try {
    const reviewerId = req.user?.id || '';
    const reviewerName = req.user?.name || '';
    const reason = req.body.reject_reason || '';
    const auth = await controllers.rejectAuthorization(req.params.id, reviewerId, reviewerName, reason);
    res.json({ code: 200, data: auth });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.delete('/authorizations/:id', logOperation('authorization', 'delete'), async (req: Request, res: Response) => {
  try {
    await controllers.deleteAuthorization(req.params.id);
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

// ============== 操作日志 ==============

router.get('/operation-logs', async (req: Request, res: Response) => {
  try {
    const filter = {
      userId: req.query.user_id as string,
      supplierCode: req.query.supplier_code as string,
      module: req.query.module as string,
      action: req.query.action as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };
    const logs = await controllers.getOperationLogs(filter);
    res.json({ code: 200, data: logs });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.get('/operation-logs/user/:userId', async (req: Request, res: Response) => {
  try {
    const logs = await controllers.getOperationLogsByUser(req.params.userId);
    res.json({ code: 200, data: logs });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

export default router;
