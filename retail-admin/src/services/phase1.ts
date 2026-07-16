// Phase 1 通用 API 封装
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api'

export function getApiBase() {
  return API_BASE
}

async function request<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const userInfo = JSON.parse(localStorage.getItem('retail_userInfo') || '{}')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (userInfo?.id) {
    headers['X-User-Id'] = userInfo.id
  }
  if (userInfo?.supplier_code) {
    headers['X-Supplier-Code'] = userInfo.supplier_code
  }

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers })
  const json = await res.json()
  if (json.code && json.code >= 400) {
    throw new Error(json.message || 'Request failed')
  }
  return json
}

export const api = {
  get: <T = any>(url: string) => request<T>(url, { method: 'GET' }),
  post: <T = any>(url: string, body?: any) => request<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T = any>(url: string, body?: any) => request<T>(url, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T = any>(url: string) => request<T>(url, { method: 'DELETE' }),
}

// ============== 证照 ==============
export const licenseApi = {
  list: (supplierCode?: string) => api.get(`/licenses?supplier_code=${supplierCode || ''}`),
  get: (id: string) => api.get(`/licenses/${id}`),
  create: (data: any) => api.post('/licenses', data),
  update: (id: string, data: any) => api.put(`/licenses/${id}`, data),
  delete: (id: string) => api.delete(`/licenses/${id}`),
  renew: (id: string, data: any) => api.post(`/licenses/${id}/renew`, data),
  types: () => api.get('/licenses/types/list'),
}

// ============== 授权委托书 ==============
export const authorizationApi = {
  list: (supplierCode?: string, status?: string) =>
    api.get(`/authorizations?supplier_code=${supplierCode || ''}${status ? `&status=${status}` : ''}`),
  get: (id: string) => api.get(`/authorizations/${id}`),
  create: (data: any) => api.post('/authorizations', data),
  approve: (id: string) => api.post(`/authorizations/${id}/approve`),
  reject: (id: string, reason: string) => api.post(`/authorizations/${id}/reject`, { reject_reason: reason }),
  delete: (id: string) => api.delete(`/authorizations/${id}`),
}

// ============== 操作日志 ==============
export const operationLogApi = {
  list: (filter: { supplierCode?: string; userId?: string; module?: string; limit?: number }) => {
    const params = new URLSearchParams()
    if (filter.supplierCode) params.set('supplier_code', filter.supplierCode)
    if (filter.userId) params.set('user_id', filter.userId)
    if (filter.module) params.set('module', filter.module)
    if (filter.limit) params.set('limit', String(filter.limit))
    return api.get(`/operation-logs?${params.toString()}`)
  },
  byUser: (userId: string) => api.get(`/operation-logs/user/${userId}`),
}

// ============== 角色 ==============
export const roleApi = {
  list: (supplierCode?: string) => api.get(`/roles?supplier_code=${supplierCode || ''}`),
  get: (id: string) => api.get(`/roles/${id}`),
  create: (data: any) => api.post('/roles', data),
  update: (id: string, data: any) => api.put(`/roles/${id}`, data),
  delete: (id: string) => api.delete(`/roles/${id}`),
  userRoles: (userId: string) => api.get(`/users/${userId}/roles`),
  setUserRoles: (userId: string, roleIds: string[], supplierCode: string) =>
    api.post(`/users/${userId}/roles`, { role_ids: roleIds, supplier_code: supplierCode }),
  userDataScope: (userId: string) => api.get(`/users/${userId}/data-scope`),
  setUserDataScope: (userId: string, data: any) => api.post(`/users/${userId}/data-scope`, data),
}

// ============== AI 识别 ==============
export const aiApi = {
  recognize: async (file: File, type: string = 'business_license') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    const res = await fetch(`${API_BASE}/ai/recognize`, {
      method: 'POST',
      body: formData,
    })
    const json = await res.json()
    if (json.code && json.code >= 400) throw new Error(json.message)
    return json
  },
}
