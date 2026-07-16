import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Input, Select, Modal, message } from 'antd'
import {
  AnnotationConfig,
  AnnotationItem,
  AnnotationType,
  AnnotationDetails,
  ANNOTATION_TYPE_META,
} from './types'
import { useUserAnnotations, genUserAnnotationId } from './useUserAnnotations'
import './ProductAnnotation.scss'

const { TextArea } = Input

interface ProductAnnotationProps {
  config: AnnotationConfig
  children: React.ReactNode
}

interface MarkerPosition {
  top: number
  left: number
  visible: boolean
}

// 运行时扩展：标记该标注来自静态配置还是用户
type AnnotationWithSource = AnnotationItem & { _source: 'static' | 'user' }

const ProductAnnotation: React.FC<ProductAnnotationProps> = ({ config, children }) => {
  const [annotationMode, setAnnotationMode] = useState(false)
  const [activeType, setActiveType] = useState<AnnotationType | 'all'>('all')
  const [selectedAnnotation, setSelectedAnnotation] = useState<AnnotationWithSource | null>(null)
  const [markerPositions, setMarkerPositions] = useState<Record<string, MarkerPosition>>({})
  const [mode, setMode] = useState<'view' | 'capture'>('view')
  const [editing, setEditing] = useState(false)
  const [highlightRect, setHighlightRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const editingFormRef = useRef<HTMLDivElement>(null)

  const userApi = useUserAnnotations(config.pageName)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setAnnotationMode(params.get('annotation') === 'true')
  }, [])

  // 合并静态 + 用户标注
  const allAnnotations = useMemo<AnnotationWithSource[]>(
    () => [
      ...config.annotations.map(a => ({ ...a, _source: 'static' as const })),
      ...userApi.items.map(a => ({ ...a, _source: 'user' as const })),
    ],
    [config.annotations, userApi.items]
  )

  const updateMarkerPositions = useCallback(() => {
    const positions: Record<string, MarkerPosition> = {}
    allAnnotations.forEach(ann => {
      const el = document.querySelector(`[data-annotation-id="${ann.target}"]`) as HTMLElement
      if (el) {
        const rect = el.getBoundingClientRect()
        const inViewport = rect.width > 0 && rect.height > 0
          && rect.bottom > 0 && rect.top < window.innerHeight
          && rect.right > 0 && rect.left < window.innerWidth

        let notOccluded = true
        if (inViewport) {
          const checkX = Math.min(rect.left + rect.width - 1, window.innerWidth - 1)
          const checkY = Math.min(rect.top + 1, window.innerHeight - 1)
          const topEl = document.elementFromPoint(checkX, checkY)
          if (topEl && topEl !== el && !el.contains(topEl)) {
            notOccluded = false
          }
        }

        positions[ann.target] = {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX + rect.width,
          visible: inViewport && notOccluded,
        }
      }
    })
    setMarkerPositions(positions)
  }, [allAnnotations])

  useEffect(() => {
    if (!annotationMode) return

    const timer = setTimeout(updateMarkerPositions, 200)
    const interval = setInterval(updateMarkerPositions, 300)

    const handleScroll = () => updateMarkerPositions()
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleScroll)

    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => {
        updateMarkerPositions()
      })
    })
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
      observer.disconnect()
    }
  }, [annotationMode, updateMarkerPositions])

  // ============ 采集模式（新增标注）============
  useEffect(() => {
    if (!annotationMode || mode !== 'capture') {
      setHighlightRect(null)
      return
    }
    document.body.classList.add('pa-capturing')

    const handleMove = (e: MouseEvent) => {
      // 忽略标注自身 UI
      const target = e.target as HTMLElement
      if (target.closest('.pa-toolbar')
        || target.closest('.pa-marker')
        || target.closest('.pa-panel-overlay')
        || target.closest('.pa-capture-highlight')) {
        setHighlightRect(null)
        return
      }
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      if (!el) {
        setHighlightRect(null)
        return
      }
      if (el.closest('.pa-toolbar')
        || el.closest('.pa-marker')
        || el.closest('.pa-panel-overlay')
        || el.closest('.pa-capture-highlight')) {
        setHighlightRect(null)
        return
      }
      const rect = el.getBoundingClientRect()
      setHighlightRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.pa-toolbar')
        || target.closest('.pa-marker')
        || target.closest('.pa-panel-overlay')
        || target.closest('.pa-capture-highlight')) {
        return
      }
      e.preventDefault()
      e.stopPropagation()
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      if (!el) return
      if (el.closest('.pa-toolbar')
        || el.closest('.pa-marker')
        || el.closest('.pa-panel-overlay')) {
        return
      }
      // 取出或注入 data-annotation-id
      let targetId = el.getAttribute('data-annotation-id')
      const isNewTarget = !targetId
      if (!targetId) {
        targetId = genUserAnnotationId()
        el.setAttribute('data-annotation-id', targetId)
        el.setAttribute('data-pa-injected', '1')
      }
      const draft: AnnotationWithSource = {
        id: genUserAnnotationId(),
        target: targetId,
        type: 'function',
        title: '',
        description: '',
        details: {},
        _source: 'user',
      }
      if (import.meta.env.DEV) console.log('[pa] new annotation draft', targetId)
      setSelectedAnnotation(draft)
      setEditing(true)
      setMode('view')
      if (import.meta.env.DEV) {
        setTimeout(() => console.log('[pa] after new annotation, mode should be view'), 0)
      }
      if (isNewTarget) {
        // 立即刷新 marker 位置
        requestAnimationFrame(updateMarkerPositions)
      }
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMode('view')
      }
    }

    document.addEventListener('mousemove', handleMove, true)
    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleKey, true)

    return () => {
      document.removeEventListener('mousemove', handleMove, true)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKey, true)
      document.body.classList.remove('pa-capturing')
      setHighlightRect(null)
    }
  }, [annotationMode, mode, updateMarkerPositions])

  const filteredAnnotations = activeType === 'all'
    ? allAnnotations
    : allAnnotations.filter(a => a.type === activeType)

  const typeCounts = useMemo(
    () => ({
      all: allAnnotations.length,
      function: allAnnotations.filter(a => a.type === 'function').length,
      interaction: allAnnotations.filter(a => a.type === 'interaction').length,
      business: allAnnotations.filter(a => a.type === 'business').length,
      data: allAnnotations.filter(a => a.type === 'data').length,
    }),
    [allAnnotations]
  )

  if (!annotationMode) {
    return <>{children}</>
  }

  const typeButtons: Array<{ key: AnnotationType | 'all'; label: string; count: number; color?: string }> = [
    { key: 'all', label: '全部', count: typeCounts.all },
    { key: 'function', label: '功能', count: typeCounts.function, color: ANNOTATION_TYPE_META.function.color },
    { key: 'interaction', label: '交互', count: typeCounts.interaction, color: ANNOTATION_TYPE_META.interaction.color },
    { key: 'business', label: '业务', count: typeCounts.business, color: ANNOTATION_TYPE_META.business.color },
    { key: 'data', label: '数据', count: typeCounts.data, color: ANNOTATION_TYPE_META.data.color },
  ]

  // ===== 详情面板：编辑表单的提交 =====
  const handleSaveEdit = (draft: AnnotationWithSource) => {
    if (!draft.title.trim()) {
      message.warning('请输入标注标题')
      return
    }
    const persisted: AnnotationItem = {
      id: draft.id,
      target: draft.target,
      type: draft.type,
      title: draft.title.trim(),
      description: draft.description?.trim() || undefined,
      details: draft.details,
      communicationNote: draft.communicationNote?.trim() || undefined,
    }
    // 判断是新增还是更新：id 不在 userApi.items 里就是新增
    const isExisting = userApi.items.some(a => a.id === draft.id)
    if (isExisting) {
      userApi.updateAnnotation(draft.id, persisted)
      message.success('标注已更新')
    } else {
      userApi.addAnnotation(persisted)
      message.success('标注已新增')
    }
    const next: AnnotationWithSource = { ...persisted, _source: 'user' }
    setSelectedAnnotation(next)
    setEditing(false)
    requestAnimationFrame(updateMarkerPositions)
  }

  const handleDelete = (item: AnnotationWithSource) => {
    Modal.confirm({
      title: '删除标注',
      content: `确认删除「${item.title || '未命名'}」？此操作仅清除本地浏览器中的内容。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        userApi.deleteAnnotation(item.id)
        setSelectedAnnotation(null)
        setEditing(false)
        // 清理自动注入的 data-annotation-id
        if (item._source === 'user') {
          const el = document.querySelector(`[data-annotation-id="${item.target}"]`)
          if (el && el.getAttribute('data-pa-injected') === '1') {
            el.removeAttribute('data-annotation-id')
            el.removeAttribute('data-pa-injected')
          }
        }
        message.success('已删除')
      },
    })
  }

  return (
    <div ref={containerRef}>
      {children}
      {createPortal(
        <>
          <div className="pa-toolbar">
            <div className="pa-toolbar-header">
              <span className="pa-toolbar-title">产品标注</span>
              <span className="pa-toolbar-page">{config.pageName}</span>
              <span className="pa-toolbar-version">v{config.version}</span>
              <button className="pa-toolbar-close" onClick={() => setAnnotationMode(false)}>退出标注</button>
            </div>
            <div className="pa-toolbar-actions">
              <button
                className={`pa-toolbar-action ${mode === 'capture' ? 'active' : ''}`}
                onClick={() => setMode(mode === 'capture' ? 'view' : 'capture')}
                title={mode === 'capture' ? '退出采集' : '点击页面元素新增标注'}
              >
                {mode === 'capture' ? '✕ 退出采集' : '+ 新增标注'}
              </button>
            </div>
            <div className="pa-toolbar-filters">
              {typeButtons.map(btn => (
                <button
                  key={btn.key}
                  className={`pa-filter-btn ${activeType === btn.key ? 'active' : ''}`}
                  style={activeType === btn.key && btn.color ? { borderColor: btn.color, color: btn.color, backgroundColor: `${btn.color}11` } : {}}
                  onClick={() => setActiveType(btn.key)}
                >
                  {btn.label} ({btn.count})
                </button>
              ))}
            </div>
            {mode === 'capture' && (
              <div className="pa-toolbar-tip">采集模式：点击页面任意元素即可新增标注，按 Esc 退出</div>
            )}
          </div>

          {/* 采集高亮框 */}
          {mode === 'capture' && highlightRect && (
            <div
              className="pa-capture-highlight"
              style={{
                top: highlightRect.top,
                left: highlightRect.left,
                width: highlightRect.width,
                height: highlightRect.height,
              }}
            />
          )}

          {filteredAnnotations.map((ann, index) => {
            const pos = markerPositions[ann.target]
            if (!pos || !pos.visible) return null
            const meta = ANNOTATION_TYPE_META[ann.type]
            return (
              <div
                key={ann.id}
                className={`pa-marker ${ann._source === 'user' ? 'pa-marker-user' : ''} ${selectedAnnotation?.id === ann.id ? 'pa-marker-active' : ''}`}
                style={{
                  top: pos.top,
                  left: pos.left,
                  backgroundColor: meta.color,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (import.meta.env.DEV) console.log('[pa] marker click', ann.id, ann.title);
                  setSelectedAnnotation(ann);
                  setEditing(false);
                  if (import.meta.env.DEV) console.log('[pa] selectedAnnotation set, mode stays:', mode);
                }}
                title={ann.title || '未命名'}
              >
                {index + 1}
              </div>
            )
          })}

          {selectedAnnotation && (() => {
            if (import.meta.env.DEV) console.log('[pa] render panel for', selectedAnnotation.id);
            return (
              <AnnotationPanel
                item={selectedAnnotation}
                editing={editing}
                formRef={editingFormRef}
                onClose={() => { setSelectedAnnotation(null); setEditing(false) }}
                onEdit={() => setEditing(true)}
                onCancelEdit={() => {
                  if (userApi.items.some(a => a.id === selectedAnnotation.id)) {
                    setEditing(false)
                  } else {
                    // 新增草稿：直接关闭
                    setSelectedAnnotation(null)
                    setEditing(false)
                    // 回滚自动注入的 data-annotation-id
                    const el = document.querySelector(`[data-annotation-id="${selectedAnnotation.target}"]`)
                    if (el && el.getAttribute('data-pa-injected') === '1') {
                      el.removeAttribute('data-annotation-id')
                      el.removeAttribute('data-pa-injected')
                    }
                  }
                }}
                onSave={handleSaveEdit}
                onDelete={handleDelete}
              />
            );
          })()}
        </>,
        document.body
      )}
    </div>
  )
}

export default ProductAnnotation

// ============ 详情面板子组件 ============

interface AnnotationPanelProps {
  item: AnnotationWithSource
  editing: boolean
  formRef: React.RefObject<HTMLDivElement>
  onClose: () => void
  onEdit: () => void
  onCancelEdit: () => void
  onSave: (draft: AnnotationWithSource) => void
  onDelete: (item: AnnotationWithSource) => void
}

const AnnotationPanel: React.FC<AnnotationPanelProps> = ({
  item, editing, onClose, onEdit, onCancelEdit, onSave, onDelete,
}) => {
  const [draft, setDraft] = useState<AnnotationWithSource>(item)

  // 当外部 item 变化时同步 draft
  useEffect(() => {
    if (!editing) setDraft(item)
  }, [item, editing])

  const updateDraft = (patch: Partial<AnnotationWithSource>) => {
    setDraft(prev => ({ ...prev, ...patch }))
  }

  const updateDetails = (patch: Partial<AnnotationDetails>) => {
    setDraft(prev => ({ ...prev, details: { ...prev.details, ...patch } }))
  }

  const meta = ANNOTATION_TYPE_META[draft.type]
  const isUser = item._source === 'user'

  return (
    <div className="pa-panel-overlay" onClick={onClose}>
      <div className="pa-panel" onClick={e => e.stopPropagation()}>
        <div className="pa-panel-header" style={{ borderLeftColor: meta.color }}>
          <span className="pa-panel-type" style={{ backgroundColor: meta.color }}>
            {meta.label}
          </span>
          {!editing ? (
            <>
              <span className="pa-panel-title">{draft.title || '（未命名）'}</span>
              {isUser && !draft.title && (
                <span className="pa-panel-badge-draft">草稿</span>
              )}
              <div className="pa-panel-actions">
                {isUser && (
                  <>
                    <button className="pa-panel-btn" onClick={onEdit}>编辑</button>
                    <button className="pa-panel-btn pa-panel-btn-danger" onClick={() => onDelete(item)}>删除</button>
                  </>
                )}
                <button className="pa-panel-close" onClick={onClose}>×</button>
              </div>
            </>
          ) : (
            <>
              <span className="pa-panel-title">{item.id.startsWith('user-anno-') && !item.title ? '新增标注' : '编辑标注'}</span>
              <div className="pa-panel-actions">
                <button className="pa-panel-btn" onClick={onCancelEdit}>取消</button>
                <button className="pa-panel-btn pa-panel-btn-primary" onClick={() => onSave(draft)}>保存</button>
                <button className="pa-panel-close" onClick={onClose}>×</button>
              </div>
            </>
          )}
        </div>

        <div className="pa-panel-body">
          {editing ? (
            <AnnotationEditForm
              draft={draft}
              onChangeType={t => updateDraft({ type: t, details: {} })}
              onChangeTitle={t => updateDraft({ title: t })}
              onChangeDesc={t => updateDraft({ description: t })}
              onChangeNote={t => updateDraft({ communicationNote: t })}
              onChangeDetails={updateDetails}
            />
          ) : (
            <>
              {draft.description && (
                <p className="pa-panel-desc">{draft.description}</p>
              )}

              {draft.details.functionName && (
                <div className="pa-panel-section">
                  <h4>功能信息</h4>
                  <dl>
                    {draft.details.functionName && <><dt>功能名称</dt><dd>{draft.details.functionName}</dd></>}
                    {draft.details.entryPath && <><dt>入口路径</dt><dd>{draft.details.entryPath}</dd></>}
                    {draft.details.priority && <><dt>优先级</dt><dd>{draft.details.priority}</dd></>}
                  </dl>
                </div>
              )}

              {(draft.details.trigger || draft.details.feedback || draft.details.stateChange || draft.details.exceptionHandling) && (
                <div className="pa-panel-section">
                  <h4>交互信息</h4>
                  <dl>
                    {draft.details.trigger && <><dt>触发条件</dt><dd>{draft.details.trigger}</dd></>}
                    {draft.details.feedback && <><dt>反馈方式</dt><dd>{draft.details.feedback}</dd></>}
                    {draft.details.stateChange && <><dt>状态变化</dt><dd>{draft.details.stateChange}</dd></>}
                    {draft.details.exceptionHandling && <><dt>异常处理</dt><dd>{draft.details.exceptionHandling}</dd></>}
                  </dl>
                </div>
              )}

              {(draft.details.businessRule || draft.details.validation || draft.details.permission || draft.details.statusFlow) && (
                <div className="pa-panel-section">
                  <h4>业务信息</h4>
                  <dl>
                    {draft.details.businessRule && <><dt>业务规则</dt><dd>{draft.details.businessRule}</dd></>}
                    {draft.details.validation && <><dt>数据校验</dt><dd>{draft.details.validation}</dd></>}
                    {draft.details.permission && <><dt>权限控制</dt><dd>{draft.details.permission}</dd></>}
                    {draft.details.statusFlow && <><dt>状态流转</dt><dd>{draft.details.statusFlow.join(' → ')}</dd></>}
                  </dl>
                </div>
              )}

              {(draft.details.dataSource || draft.details.apiEndpoint || (draft.details.fields && draft.details.fields.length > 0)) && (
                <div className="pa-panel-section">
                  <h4>数据信息</h4>
                  <dl>
                    {draft.details.dataSource && <><dt>数据来源</dt><dd>{draft.details.dataSource}</dd></>}
                    {draft.details.apiEndpoint && <><dt>接口对应</dt><dd>{draft.details.apiEndpoint}</dd></>}
                  </dl>
                  {draft.details.fields && draft.details.fields.length > 0 && (
                    <table className="pa-fields-table">
                      <thead>
                        <tr><th>字段名</th><th>类型</th><th>说明</th></tr>
                      </thead>
                      <tbody>
                        {draft.details.fields.map((f, i) => (
                          <tr key={i}><td>{f.name}</td><td>{f.type}</td><td>{f.description}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {draft.communicationNote && (
                <div className="pa-panel-note">
                  <strong>沟通记录：</strong>{draft.communicationNote}
                </div>
              )}

              {!draft.description && !draft.communicationNote
                && !draft.details.functionName && !draft.details.trigger
                && !draft.details.businessRule && !draft.details.dataSource
                && isUser && (
                  <p className="pa-panel-desc" style={{ color: '#bfbfbf' }}>
                    （该标注暂无详细内容，可点击「编辑」补充）
                  </p>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ 编辑表单 ============

interface AnnotationEditFormProps {
  draft: AnnotationWithSource
  onChangeType: (t: AnnotationType) => void
  onChangeTitle: (t: string) => void
  onChangeDesc: (t: string) => void
  onChangeNote: (t: string) => void
  onChangeDetails: (patch: Partial<AnnotationDetails>) => void
}

const AnnotationEditForm: React.FC<AnnotationEditFormProps> = ({
  draft, onChangeType, onChangeTitle, onChangeDesc, onChangeNote, onChangeDetails,
}) => {
  return (
    <div className="pa-edit-form">
      <div className="pa-form-row">
        <label className="pa-form-label">类型</label>
        <Select
          value={draft.type}
          style={{ width: '100%' }}
          onChange={onChangeType}
          options={[
            { value: 'function', label: '功能' },
            { value: 'interaction', label: '交互' },
            { value: 'business', label: '业务' },
            { value: 'data', label: '数据' },
          ]}
        />
      </div>

      <div className="pa-form-row">
        <label className="pa-form-label">标题<span className="pa-form-required">*</span></label>
        <Input value={draft.title} onChange={e => onChangeTitle(e.target.value)} placeholder="简要说明这个标注" maxLength={50} />
      </div>

      <div className="pa-form-row">
        <label className="pa-form-label">描述</label>
        <TextArea
          rows={2}
          value={draft.description || ''}
          onChange={e => onChangeDesc(e.target.value)}
          placeholder="补充说明"
          maxLength={200}
        />
      </div>

      {draft.type === 'function' && (
        <>
          <div className="pa-form-row">
            <label className="pa-form-label">功能名称</label>
            <Input value={draft.details.functionName || ''} onChange={e => onChangeDetails({ functionName: e.target.value })} />
          </div>
          <div className="pa-form-row">
            <label className="pa-form-label">入口路径</label>
            <Input value={draft.details.entryPath || ''} onChange={e => onChangeDetails({ entryPath: e.target.value })} placeholder="/xxx/yyy" />
          </div>
          <div className="pa-form-row">
            <label className="pa-form-label">优先级</label>
            <Select
              value={draft.details.priority}
              allowClear
              style={{ width: '100%' }}
              placeholder="选择优先级"
              onChange={v => onChangeDetails({ priority: v })}
              options={[
                { value: 'P0', label: 'P0' },
                { value: 'P1', label: 'P1' },
                { value: 'P2', label: 'P2' },
                { value: 'P3', label: 'P3' },
              ]}
            />
          </div>
        </>
      )}

      {draft.type === 'interaction' && (
        <>
          <div className="pa-form-row">
            <label className="pa-form-label">触发条件</label>
            <Input value={draft.details.trigger || ''} onChange={e => onChangeDetails({ trigger: e.target.value })} />
          </div>
          <div className="pa-form-row">
            <label className="pa-form-label">反馈方式</label>
            <Input value={draft.details.feedback || ''} onChange={e => onChangeDetails({ feedback: e.target.value })} />
          </div>
          <div className="pa-form-row">
            <label className="pa-form-label">状态变化</label>
            <Input value={draft.details.stateChange || ''} onChange={e => onChangeDetails({ stateChange: e.target.value })} />
          </div>
          <div className="pa-form-row">
            <label className="pa-form-label">异常处理</label>
            <Input value={draft.details.exceptionHandling || ''} onChange={e => onChangeDetails({ exceptionHandling: e.target.value })} />
          </div>
        </>
      )}

      {draft.type === 'business' && (
        <>
          <div className="pa-form-row">
            <label className="pa-form-label">业务规则</label>
            <TextArea rows={2} value={draft.details.businessRule || ''} onChange={e => onChangeDetails({ businessRule: e.target.value })} />
          </div>
          <div className="pa-form-row">
            <label className="pa-form-label">数据校验</label>
            <Input value={draft.details.validation || ''} onChange={e => onChangeDetails({ validation: e.target.value })} />
          </div>
          <div className="pa-form-row">
            <label className="pa-form-label">权限控制</label>
            <Input value={draft.details.permission || ''} onChange={e => onChangeDetails({ permission: e.target.value })} />
          </div>
        </>
      )}

      {draft.type === 'data' && (
        <>
          <div className="pa-form-row">
            <label className="pa-form-label">数据来源</label>
            <Input value={draft.details.dataSource || ''} onChange={e => onChangeDetails({ dataSource: e.target.value })} />
          </div>
          <div className="pa-form-row">
            <label className="pa-form-label">接口对应</label>
            <Input value={draft.details.apiEndpoint || ''} onChange={e => onChangeDetails({ apiEndpoint: e.target.value })} placeholder="/xxx/list" />
          </div>
        </>
      )}

      <div className="pa-form-row">
        <label className="pa-form-label">沟通记录</label>
        <TextArea
          rows={2}
          value={draft.communicationNote || ''}
          onChange={e => onChangeNote(e.target.value)}
          placeholder="会议纪要、对齐结论等"
          maxLength={300}
        />
      </div>
    </div>
  )
}
