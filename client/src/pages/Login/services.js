// 登录模块接口配置
export default {
  // 发送短信验证码
  sendSmsCode: '/supplier/sms/send',

  // 验证码登录接口
  loginBySms: '/supplier/login/sms',

  // 图形验证码（如需要）
  getCaptcha: '/captcha/get',
}
