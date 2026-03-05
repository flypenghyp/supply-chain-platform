import type { UserPermission } from '@/types'

// 模拟登录
export const login = async (username: string, password: string): Promise<UserPermission> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if ((username === 'admin' && password === 'admin123') ||
          (username === 'manager' && password === 'manager123')) {
        const mockPermission: UserPermission = {
          user: {
            id: '1',
            username: username,
            realName: username === 'admin' ? '系统管理员' : '张经理',
            department: '采购部',
            position: username === 'admin' ? '管理员' : '品类经理',
          },
          categories: [
            {
              categoryId: 'CAT001',
              categoryName: '饮料类',
              categoryCode: 'DRINK',
              permissions: username === 'admin' 
                ? ['view', 'edit', 'approve', 'hide'] 
                : ['view', 'edit', 'approve'],
            },
            {
              categoryId: 'CAT002',
              categoryName: '零食类',
              categoryCode: 'SNACK',
              permissions: ['view', 'edit'],
            },
            {
              categoryId: 'CAT003',
              categoryName: '乳制品',
              categoryCode: 'DAIRY',
              permissions: ['view', 'edit', 'approve'],
            },
          ],
          roles: username === 'admin' ? ['admin'] : ['category_manager'],
          token: 'mock_token_' + Date.now(),
        }
        resolve(mockPermission)
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 500)
  })
}
