import { useState, useEffect, useCallback } from 'react'
import { AnnotationItem } from './types'

const STORAGE_PREFIX = 'product-annotation:user:'

/**
 * 用户自维护标注的 localStorage 持久化 hook
 * 标注按 pageName 分键保存，仅当前浏览器可见
 */
export function useUserAnnotations(pageKey: string) {
  const storageKey = `${STORAGE_PREFIX}${pageKey}`

  const [items, setItems] = useState<AnnotationItem[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items))
    } catch {
      // 隐私模式 / 容量超限静默
    }
  }, [storageKey, items])

  const addAnnotation = useCallback((item: AnnotationItem) => {
    setItems(prev => [...prev, item])
  }, [])

  const updateAnnotation = useCallback((id: string, patch: Partial<AnnotationItem>) => {
    setItems(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)))
  }, [])

  const deleteAnnotation = useCallback((id: string) => {
    setItems(prev => prev.filter(a => a.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setItems([])
  }, [])

  return {
    items,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    clearAll,
  }
}

/**
 * 生成用户标注 ID（避免和静态 anno-xxx 冲突）
 */
export function genUserAnnotationId(): string {
  return `user-anno-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
