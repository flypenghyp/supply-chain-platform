import express, { Request, Response } from 'express';
import * as controllers from '../controllers/index.js';
import { requireRole, logOperation } from '../middleware/permission.js';

const router = express.Router();

// ============== 证照管理 ==============

router.get('/licenses', async (req: Request, res: Response) => {
  try {
    const supplierCode = req.query.supplier_code as string;
    const storeId = req.query.store_id as string;

    let licenses;
    if (storeId) {
      licenses = await controllers.getLicensesByStore(supplierCode, storeId);
    } else {
      licenses = await controllers.getAllLicenses(supplierCode);
    }
    res.json({ code: 200, data: licenses });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.get('/licenses/:id', async (req: Request, res: Response) => {
  try {
    const license = await controllers.getLicenseById(req.params.id);
    if (!license) return res.status(404).json({ code: 404, message: '证照不存在' });
    res.json({ code: 200, data: license });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.post('/licenses', logOperation('license', 'create'), async (req: Request, res: Response) => {
  try {
    const dup = await controllers.checkLicenseDuplicate(
      req.body.supplier_code,
      req.body.store_id,
      req.body.license_type
    );
    if (dup) {
      return res.status(400).json({ code: 400, message: '单门店同类证照已存在' });
    }
    const license = await controllers.createLicense(req.body);
    res.json({ code: 200, data: license });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.put('/licenses/:id', logOperation('license', 'update'), async (req: Request, res: Response) => {
  try {
    const license = await controllers.updateLicense(req.params.id, req.body);
    res.json({ code: 200, data: license });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.delete('/licenses/:id', logOperation('license', 'delete'), async (req: Request, res: Response) => {
  try {
    await controllers.deleteLicense(req.params.id);
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.post('/licenses/:id/renew', logOperation('license', 'renew'), async (req: Request, res: Response) => {
  try {
    const license = await controllers.renewLicense(req.params.id, req.body);
    res.json({ code: 200, data: license });
  } catch (error) {
    res.status(500).json({ code: 500, message: (error as Error).message });
  }
});

router.get('/licenses/types/list', async (req: Request, res: Response) => {
  // 17 类证照枚举（一期只实现营业执照）
  const types = [
    { code: 'business_license', name: '营业执照', enabled: true, category: '基础证照' },
    { code: 'food_license', name: '食品经营许可证', enabled: true, category: '基础证照' },
    { code: 'health_license', name: '卫生许可证', enabled: true, category: '基础证照' },
    { code: 'tax_registration', name: '税务登记证', enabled: true, category: '基础证照' },
    { code: 'organization_code', name: '组织机构代码证', enabled: true, category: '基础证照' },
    { code: 'production_license', name: '生产许可证', enabled: true, category: '行业证照' },
    { code: 'import_license', name: '进出口许可证', enabled: true, category: '行业证照' },
    { code: 'medical_device_license', name: '医疗器械经营许可证', enabled: true, category: '行业证照' },
    { code: 'drug_license', name: '药品经营许可证', enabled: true, category: '行业证照' },
    { code: 'cosmetic_license', name: '化妆品经营许可证', enabled: true, category: '行业证照' },
    { code: 'alcohol_license', name: '酒类批发许可证', enabled: false, category: '行业证照' },
    { code: 'tobacco_license', name: '烟草专卖零售许可证', enabled: false, category: '行业证照' },
    { code: 'trademark_certificate', name: '商标注册证', enabled: false, category: '知识产权' },
    { code: 'patent_certificate', name: '专利证书', enabled: false, category: '知识产权' },
    { code: 'quality_certificate', name: '产品质量认证证书', enabled: false, category: '质量认证' },
    { code: 'iso_certificate', name: 'ISO 体系认证', enabled: false, category: '质量认证' },
    { code: 'inspection_report', name: '检验报告', enabled: false, category: '质量认证' },
  ];
  res.json({ code: 200, data: types });
});

export default router;
