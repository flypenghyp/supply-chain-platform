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

export default router;
