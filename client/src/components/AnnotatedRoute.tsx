import React from 'react'
import ProductAnnotation from '../components/ProductAnnotation'
import { dashboardAnnotations } from '../pages/annotations/dashboard'
import { accountAnnotations } from '../pages/annotations/account'
import { ordersAnnotations } from '../pages/annotations/orders'
import { shipmentsAnnotations } from '../pages/annotations/shipments'
import { inventoryAnnotations } from '../pages/annotations/inventory'
import { salesAnnotations } from '../pages/annotations/sales'
import { qualityAnnotations } from '../pages/annotations/quality'
import { reconciliationAnnotations } from '../pages/annotations/reconciliation'
import { invoicesAnnotations } from '../pages/annotations/invoices'
import { paymentsAnnotations } from '../pages/annotations/payments'
import { feesAnnotations } from '../pages/annotations/fees'
import { financeAnnotations } from '../pages/annotations/finance'
import { productManagementAnnotations } from '../pages/annotations/product-management'
import { priceManagementAnnotations } from '../pages/annotations/price-management'
import { contractsAnnotations } from '../pages/annotations/contracts'
import { announcementsAnnotations } from '../pages/annotations/announcements'
import { bidManagementAnnotations } from '../pages/annotations/bid-management'
import { serviceAnnotations } from '../pages/annotations/service'
import { settlementApplicationAnnotations } from '../pages/annotations/settlement-application'
import { productsAnnotations } from '../pages/annotations/products'
import { suppliersAnnotations } from '../pages/annotations/suppliers'
import { loginAnnotations } from '../pages/annotations/login'
import { promotionsAnnotations } from '../pages/annotations/promotions'
import { priceAdjustmentsAnnotations } from '../pages/annotations/price-adjustments'
import { leaseCounterPayableAnnotations } from '../pages/annotations/lease-counter-payable'
import { selfOperatedPayableAnnotations } from '../pages/annotations/self-operated-payable'
import { apiResultAnnotations } from '../pages/annotations/api-result'
import { reconciliationSimpleAnnotations } from '../pages/annotations/reconciliation-simple'
import { AnnotationConfig } from '../components/ProductAnnotation'

// 页面名 → annotation 配置的映射
const ANNOTATION_MAP: Record<string, AnnotationConfig> = {
  '/': dashboardAnnotations,
  '/account': accountAnnotations,
  '/account/company': accountAnnotations,
  '/account/certificates': accountAnnotations,
  '/account/users': accountAnnotations,
  '/orders': ordersAnnotations,
  '/shipments': shipmentsAnnotations,
  '/inventory': inventoryAnnotations,
  '/sales': salesAnnotations,
  '/quality': qualityAnnotations,
  '/reconciliation': reconciliationAnnotations,
  '/invoices': invoicesAnnotations,
  '/payments': paymentsAnnotations,
  '/fees': feesAnnotations,
  '/finance': financeAnnotations,
  '/product-management': productManagementAnnotations,
  '/price-management': priceManagementAnnotations,
  '/contracts': contractsAnnotations,
  '/announcements': announcementsAnnotations,
  '/bid-management': bidManagementAnnotations,
  '/service': serviceAnnotations,
  '/settlement-application': settlementApplicationAnnotations,
  '/products': productsAnnotations,
  '/suppliers': suppliersAnnotations,
  '/login': loginAnnotations,
  '/promotions': promotionsAnnotations,
  '/price-adjustments': priceAdjustmentsAnnotations,
  '/lease-counter-payable': leaseCounterPayableAnnotations,
  '/self-operated-payable': selfOperatedPayableAnnotations,
  '/api-result/success': apiResultAnnotations,
  '/api-result/error': apiResultAnnotations,
  '/reconciliation-simple': reconciliationSimpleAnnotations,
}

interface AnnotatedRouteProps {
  pageKey: string
  children: React.ReactNode
}

/**
 * 统一标注路由包装
 * 根据 pageKey 自动选择对应的 annotation 配置
 * 不在 map 中的页面不标注
 */
const AnnotatedRoute: React.FC<AnnotatedRouteProps> = ({ pageKey, children }) => {
  const config = ANNOTATION_MAP[pageKey]
  if (!config) {
    return <>{children}</>
  }
  return <ProductAnnotation config={config}>{children}</ProductAnnotation>
}

export default AnnotatedRoute
