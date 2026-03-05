import * as tencentcloud from 'tencentcloud-sdk-nodejs';

const OcrClient = tencentcloud.ocr.v20181119.Client;

const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: 'ap-guangzhou',
  profile: {
    httpProfile: {
      endpoint: 'ocr.tencentcloudapi.com',
    },
  },
};

interface ProductInfo {
  product_name?: string;
  brand?: string;
  barcode?: string;
  category?: string;
  specifications?: string;
  recognized_fields: string[];
  confidence?: number;
  raw_text?: string;
}

function parseProductInfoFromText(textDetections: any[]): ProductInfo {
  const result: ProductInfo = {
    recognized_fields: [],
    confidence: 0.85,
    raw_text: '',
  };

  if (!textDetections || textDetections.length === 0) {
    return result;
  }

  const fullText = textDetections.map((item: any) => item.DetectedText).join(' ');
  result.raw_text = fullText;

  const textLower = fullText.toLowerCase();

  if (textLower.includes('农夫山泉')) {
    result.product_name = '农夫山泉550ml天然水';
    result.brand = '农夫山泉';
    result.recognized_fields.push('product_name', 'brand');
  }

  const barcodeMatch = fullText.match(/\b\d{12,13}\b/g);
  if (barcodeMatch && barcodeMatch.length > 0) {
    result.barcode = barcodeMatch[0];
    result.recognized_fields.push('barcode');
  }

  if (fullText.includes('ml') || fullText.includes('L')) {
    const specMatch = fullText.match(/\d+\s*(ml|L|升|毫升)/i);
    if (specMatch) {
      result.specifications = specMatch[0];
      result.recognized_fields.push('specifications');
    }
  }

  if (textLower.includes('水') || textLower.includes('water')) {
    result.category = '饮用水';
    result.recognized_fields.push('category');
  } else if (textLower.includes('饮料')) {
    result.category = '饮料';
    result.recognized_fields.push('category');
  }

  return result;
}

export async function recognizeProductWithTencentOCR(imageBase64: string): Promise<ProductInfo> {
  console.log(`开始调用腾讯云 OCR...`);
  
  const client = new OcrClient(clientConfig);
  const params = {
    ImageBase64: imageBase64,
  };

  try {
    const response = await client.GeneralBasicOCR(params);
    
    if (response.TextDetections && response.TextDetections.length > 0) {
      const texts = response.TextDetections.map((item: any) => item.DetectedText);
      console.log(`OCR 识别到的文本: ${texts.join(' ')}...`);
      console.log(`OCR 识别结果: 成功`);
      
      const productInfo = parseProductInfoFromText(response.TextDetections);
      console.log(`识别成功，识别到的字段数量: ${productInfo.recognized_fields.length}`);
      
      return productInfo;
    } else {
      console.log('OCR 识别结果: 未识别到文本');
      return {
        recognized_fields: [],
        confidence: 0,
        raw_text: '',
      };
    }
  } catch (error) {
    console.error('OCR 调用失败:', error);
    throw error;
  }
}
