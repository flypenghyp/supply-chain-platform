import express, { Request, Response } from 'express';
import { recognizeProductWithTencentOCR } from '../services/ocrService.js';

const router = express.Router();

router.post('/recognize-product', async (req: Request, res: Response) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ 
        success: false, 
        error: '图片数据不能为空' 
      });
    }

    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    console.log(`收到商品识别请求，图片大小: ${base64Image.length} 字符`);
    
    const result = await recognizeProductWithTencentOCR(base64Image);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('商品识别失败:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

export default router;
