import express, { Request, Response } from 'express';
import * as controllers from '../controllers/index.js';
import aiRoutes from './ai.js';

const router = express.Router();

// AI routes
router.use('/ai', aiRoutes);

// Supplier routes
router.get('/suppliers', async (req: Request, res: Response) => {
  try {
    const suppliers = await controllers.getAllSuppliers();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/suppliers/:id', async (req: Request, res: Response) => {
  try {
    const supplier = await controllers.getSupplierById(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/suppliers', async (req: Request, res: Response) => {
  try {
    const supplier = await controllers.createSupplier(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/suppliers/:id', async (req: Request, res: Response) => {
  try {
    const supplier = await controllers.updateSupplier(req.params.id, req.body);
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/suppliers/:id', async (req: Request, res: Response) => {
  try {
    await controllers.deleteSupplier(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Super Admin routes
router.get('/suppliers/super-admins', async (req: Request, res: Response) => {
  try {
    const superAdmins = await controllers.getSuperAdmins();
    res.json(superAdmins);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/suppliers/super-admin', async (req: Request, res: Response) => {
  try {
    const superAdmin = await controllers.createSupplier(req.body);
    res.status(201).json(superAdmin);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/suppliers/super-admin/:id', async (req: Request, res: Response) => {
  try {
    const superAdmin = await controllers.setSuperAdmin(req.params.id, req.body);
    res.json(superAdmin);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/suppliers/super-admin/:id', async (req: Request, res: Response) => {
  try {
    await controllers.deleteSupplier(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Product routes
router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await controllers.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await controllers.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/products', async (req: Request, res: Response) => {
  try {
    const product = await controllers.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await controllers.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    await controllers.deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Order routes
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const orders = await controllers.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/orders/:id', async (req: Request, res: Response) => {
  try {
    const order = await controllers.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const items = await controllers.getOrderItems(req.params.id);
    res.json({ ...order, items });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/orders', async (req: Request, res: Response) => {
  try {
    const order = await controllers.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/orders/:id', async (req: Request, res: Response) => {
  try {
    const order = await controllers.updateOrder(req.params.id, req.body);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/orders/:id/items', async (req: Request, res: Response) => {
  try {
    const item = await controllers.addOrderItem(req.params.id, req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Analytics routes
router.get('/analytics/dashboard', async (req: Request, res: Response) => {
  try {
    const stats = await controllers.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/analytics/orders', async (req: Request, res: Response) => {
  try {
    const stats = await controllers.getOrderStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/analytics/suppliers', async (req: Request, res: Response) => {
  try {
    const suppliers = await controllers.getTopSuppliers();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/analytics/categories', async (req: Request, res: Response) => {
  try {
    const categories = await controllers.getProductCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Super Admin Management Routes
router.post('/supplier/super-admin/send-verify-code', async (req: Request, res: Response) => {
  try {
    const { supplier_code, new_phone } = req.body;
    
    if (!supplier_code || !new_phone) {
      return res.status(400).json({
        code: 400,
        message: '供应商代码和手机号不能为空'
      });
    }
    
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(new_phone)) {
      return res.status(400).json({
        code: 400,
        message: '请输入正确的手机号格式'
      });
    }
    
    const currentAdmin = await controllers.getSupplierAdmin(supplier_code);
    if (currentAdmin && currentAdmin.phone === new_phone) {
      return res.status(400).json({
        code: 400,
        message: '新手机号不能与当前超管手机号相同'
      });
    }
    
    const existingUser = await controllers.getSupplierUserByPhone(new_phone);
    if (existingUser && existingUser.supplier_code === supplier_code) {
      return res.status(400).json({
        code: 400,
        message: '该手机号已存在于该供应商下'
      });
    }
    
    const code = Math.random().toString().slice(-6);
    const expireTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    
    await controllers.createVerifyCode({
      phone: new_phone,
      code,
      type: 'super_admin_change',
      supplier_code,
      expire_time: expireTime
    });
    
    res.json({
      code: 200,
      message: '验证码已发送',
      data: {
        expire_time: 300,
        countdown: 60
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: (error as Error).message
    });
  }
});

router.post('/supplier/super-admin/verify-code', async (req: Request, res: Response) => {
  try {
    const { supplier_code, new_phone, verify_code } = req.body;
    
    if (!supplier_code || !new_phone || !verify_code) {
      return res.status(400).json({
        code: 400,
        message: '参数不完整'
      });
    }
    
    const verifyCodeRecord = await controllers.getVerifyCode(new_phone, 'super_admin_change');
    
    if (!verifyCodeRecord) {
      return res.status(400).json({
        code: 400,
        message: '验证码已过期或不存在'
      });
    }
    
    if (verifyCodeRecord.fail_count >= 3) {
      return res.status(400).json({
        code: 400,
        message: '验证失败次数过多，请重新获取验证码'
      });
    }
    
    if (verifyCodeRecord.code !== verify_code) {
      await controllers.updateVerifyCode(verifyCodeRecord.id, {
        fail_count: verifyCodeRecord.fail_count + 1
      });
      
      return res.status(400).json({
        code: 400,
        message: '验证码错误'
      });
    }
    
    await controllers.updateVerifyCode(verifyCodeRecord.id, {
      used: 1,
      used_time: new Date().toISOString()
    });
    
    res.json({
      code: 200,
      message: '验证成功',
      data: {
        verified: true
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: (error as Error).message
    });
  }
});

router.post('/supplier/super-admin/change', async (req: Request, res: Response) => {
  try {
    const { supplier_code, new_admin, verify_code, reason } = req.body;
    
    if (!supplier_code || !new_admin || !verify_code) {
      return res.status(400).json({
        code: 400,
        message: '参数不完整'
      });
    }
    
    const verifyCodeRecord = await controllers.getVerifyCode(new_admin.phone, 'super_admin_change');
    if (!verifyCodeRecord || verifyCodeRecord.code !== verify_code) {
      return res.status(400).json({
        code: 400,
        message: '验证码错误或已过期'
      });
    }
    
    const oldAdmin = await controllers.getSupplierAdmin(supplier_code);
    
    let newAdminUser = await controllers.getSupplierUserByPhone(new_admin.phone);
    
    if (newAdminUser) {
      newAdminUser = await controllers.updateSupplierUser(newAdminUser.id, {
        ...newAdminUser,
        role: 'admin',
        role_name: '超管',
        role_type: 'system',
        name: new_admin.name || newAdminUser.name,
        email: new_admin.email || newAdminUser.email
      });
    } else {
      newAdminUser = await controllers.createSupplierUser({
        supplier_code,
        name: new_admin.name,
        phone: new_admin.phone,
        email: new_admin.email,
        role: 'admin',
        role_name: '超管',
        role_type: 'system',
        status: 'active',
        created_by: 'retailer'
      });
    }
    
    if (oldAdmin) {
      await controllers.updateSupplierUser(oldAdmin.id, {
        ...oldAdmin,
        role: 'operator',
        role_name: '操作员',
        role_type: 'custom'
      });
    }
    
    await controllers.createSuperAdminChangeLog({
      supplier_code,
      old_admin_id: oldAdmin?.id,
      old_admin_name: oldAdmin?.name,
      old_admin_phone: oldAdmin?.phone,
      new_admin_id: newAdminUser.id,
      new_admin_name: newAdminUser.name,
      new_admin_phone: newAdminUser.phone,
      operator_id: 'system',
      operator_name: '系统操作员',
      operation_ip: req.ip,
      operation_device: req.headers['user-agent'],
      reason,
      verify_method: 'sms_code'
    });
    
    res.json({
      code: 200,
      message: '超管修改成功',
      data: {
        old_admin: oldAdmin ? {
          id: oldAdmin.id,
          name: oldAdmin.name,
          phone: oldAdmin.phone,
          new_role: 'operator'
        } : null,
        new_admin: {
          id: newAdminUser.id,
          name: newAdminUser.name,
          phone: newAdminUser.phone,
          role: 'admin'
        },
        operation_time: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: (error as Error).message
    });
  }
});

router.post('/supplier/super-admin/transfer', async (req: Request, res: Response) => {
  try {
    const { target_user_id, verify_code } = req.body;
    
    if (!target_user_id || !verify_code) {
      return res.status(400).json({
        code: 400,
        message: '参数不完整'
      });
    }
    
    const targetUser = await controllers.getSupplierUserById(target_user_id);
    if (!targetUser) {
      return res.status(404).json({
        code: 404,
        message: '目标用户不存在'
      });
    }
    
    await controllers.updateSupplierUser(target_user_id, {
      ...targetUser,
      role: 'admin',
      role_name: '超管',
      role_type: 'system'
    });
    
    res.json({
      code: 200,
      message: '转让成功'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: (error as Error).message
    });
  }
});

// Esign Management Routes
router.post('/supplier/esign/verify', async (req: Request, res: Response) => {
  try {
    const { user_id, real_name, phone, id_card } = req.body;
    
    if (!user_id || !real_name || !phone || !id_card) {
      return res.status(400).json({
        code: 400,
        message: '参数不完整'
      });
    }
    
    const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
    if (!idCardRegex.test(id_card)) {
      return res.status(400).json({
        code: 400,
        message: '请输入正确的身份证号'
      });
    }
    
    const user = await controllers.getSupplierUserById(user_id);
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }
    
    let esignInfo = await controllers.getEsignInfo(user_id);
    
    if (esignInfo) {
      esignInfo = await controllers.updateEsignInfo(user_id, {
        real_name,
        phone,
        id_card,
        status: 'verified',
        verified: 1,
        verified_at: new Date().toISOString(),
        verified_by: 'self'
      });
    } else {
      esignInfo = await controllers.createEsignInfo({
        user_id,
        supplier_code: user.supplier_code,
        real_name,
        phone,
        id_card,
        status: 'verified',
        verified: 1,
        verified_at: new Date().toISOString(),
        verified_by: 'self'
      });
    }
    
    await controllers.createEsignLog({
      user_id,
      supplier_code: user.supplier_code,
      action: 'verify',
      action_ip: req.ip,
      action_device: req.headers['user-agent'],
      result: 'success',
      real_name,
      phone,
      id_card
    });
    
    res.json({
      code: 200,
      message: '认证成功',
      data: {
        verified: true,
        verified_at: esignInfo.verified_at,
        user_id
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: (error as Error).message
    });
  }
});

router.get('/supplier/esign/status', async (req: Request, res: Response) => {
  try {
    const user_id = req.query.user_id as string;
    
    if (!user_id) {
      return res.status(400).json({
        code: 400,
        message: '用户ID不能为空'
      });
    }
    
    const esignInfo = await controllers.getEsignInfo(user_id);
    
    if (!esignInfo) {
      return res.json({
        code: 200,
        data: {
          enabled: false,
          verified: false,
          status: 'none'
        }
      });
    }
    
    res.json({
      code: 200,
      data: {
        enabled: esignInfo.enabled === 1,
        verified: esignInfo.verified === 1,
        verified_at: esignInfo.verified_at,
        status: esignInfo.status,
        real_name: esignInfo.real_name,
        phone: esignInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: (error as Error).message
    });
  }
});

export default router;
