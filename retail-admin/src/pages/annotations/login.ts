import { AnnotationConfig } from '../components/ProductAnnotation'

export const loginAnnotations: AnnotationConfig = {
  pageName: '登录',
  version: '1.0.0',
  lastUpdated: '2026-07-14',
  annotations: [
    { id: 'anno-001', target: 'form-login', type: 'function', title: '登录表单', details: { functionName: '账号密码登录' } },
    { id: 'anno-002', target: 'input-username', type: 'data', title: '账号输入', details: { dataSource: 'user.username' } },
    { id: 'anno-003', target: 'input-password', type: 'data', title: '密码输入' },
    { id: 'anno-004', target: 'input-captcha', type: 'data', title: '验证码' },
    { id: 'anno-005', target: 'btn-submit', type: 'interaction', title: '登录按钮', details: { trigger: '点击「登录」' } },
    { id: 'anno-006', target: 'btn-forgot', type: 'function', title: '忘记密码' },
  ],
}
