/**
 * 电签平台外部配置
 * 所有电签相关的跳转URL统一在此配置
 */
export const ESIGN_CONFIG = {
  /** 认证地址（个人认证/企业认证） */
  AUTH_URL: 'https://esign-platform.example.com/auth',
  /** 签署地址（业务文件签署） */
  PLATFORM_URL: 'https://esign-platform.example.com/sign',
  /** 文件查看地址（已签原文件查看） */
  FILE_VIEW_URL: 'https://esign-platform.example.com/view',
};
