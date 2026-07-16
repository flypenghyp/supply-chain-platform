import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './AnnotationFloatButton.scss'

/**
 * 浮动按钮：作为产品标注模式的入口
 * 点击后在 URL 中追加 ?annotation=true，自动刷新进入标注模式
 * 在标注模式下点击则移除该参数回到正常模式
 */
const AnnotationFloatButton = () => {
  const location = useLocation()
  const isAnnotationMode = new URLSearchParams(location.search).get('annotation') === 'true'
  const [hidden, setHidden] = useState(false)

  if (hidden && !isAnnotationMode) return null

  const handleClick = () => {
    if (isAnnotationMode) {
      // 退出标注模式：移除 query 中的 annotation 参数
      const params = new URLSearchParams(location.search)
      params.delete('annotation')
      const newSearch = params.toString()
      window.location.href = `${location.pathname}${newSearch ? '?' + newSearch : ''}`
    } else {
      // 进入标注模式
      const params = new URLSearchParams(location.search)
      params.set('annotation', 'true')
      window.location.href = `${location.pathname}?${params.toString()}`
    }
  }

  return (
    <button
      className={`annotation-float-btn ${isAnnotationMode ? 'active' : ''}`}
      onClick={handleClick}
      title={isAnnotationMode ? '退出标注模式' : '进入标注模式（查看产品标注）'}
      type="button"
    >
      {isAnnotationMode ? (
        <>
          <span className="icon">✕</span>
          <span className="label">退出标注</span>
        </>
      ) : (
        <>
          <span className="icon">📋</span>
          <span className="label">产品标注</span>
        </>
      )}
      {!hidden && !isAnnotationMode && (
        <span className="annotation-float-close" onClick={(e) => { e.stopPropagation(); setHidden(true) }} title="关闭提示">×</span>
      )}
    </button>
  )
}

export default AnnotationFloatButton
