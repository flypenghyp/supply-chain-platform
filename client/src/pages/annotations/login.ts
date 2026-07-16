import { AnnotationConfig } from '../../components/ProductAnnotation'

export const loginAnnotations: AnnotationConfig = {
  pageName: '登录页',
  version: '1.0.0',
  lastUpdated: '2026-07-15',
  annotations: [
    { id: 'anno-001', target: 'phone-input', type: 'interaction', title: '手机号输入', details: { trigger: '输入登录手机号' } },
    { id: 'anno-002', target: 'captcha-input', type: 'interaction', title: '验证码输入', details: { trigger: '输入短信验证码' } },
    { id: 'anno-003', target: 'send-captcha-btn', type: 'interaction', title: '发送验证码', details: { trigger: '点击发送短信验证码' } },
    { id: 'anno-004', target: 'login-btn', type: 'interaction', title: '登录按钮', details: { trigger: '提交登录' } },
  ],
}
