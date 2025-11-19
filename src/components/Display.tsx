import React from 'react'
import OperationHistory from './OperationHistory'

type DisplayProps = {
  current: string
  previous?: string
  history?: string[]
  onChange: (value: string) => void
  onEnter?: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  inputRef?: React.RefObject<HTMLInputElement>
  maxLength?: number
}

function Display({ current, previous, history = [], onChange, onEnter, onKeyDown, inputRef, maxLength = 16 }: DisplayProps) {
  const sanitize = (v: string) => {
    // keep only digits and dots
    let s = v.replace(/[^0-9.]/g, '')
    // keep only the first dot
    const firstDot = s.indexOf('.')
    if (firstDot !== -1) {
      s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '')
    }
    // truncate to maxLength
    if (typeof maxLength === 'number' && maxLength > 0) s = s.slice(0, maxLength)
    return s
  }

  return (
    <div className="calc-display">
      {/* show the last pending operation if any */}
      {previous && <div className="calc-pending">{previous}</div>}

      {/* reuse OperationHistory component for consistent markup */}
      <OperationHistory history={history} />

      <input
        ref={inputRef}
        type="text"
        className="calc-input"
        value={current}
        maxLength={maxLength}
        onChange={e => onChange(sanitize(e.target.value))}
        onKeyDown={e => {
          // If parent provided a handler, delegate to it (e.g. App.handleKeyDown)
          if (onKeyDown) { onKeyDown(e); return }

          // If Enter pressed, trigger onEnter if provided
          if (e.key === 'Enter') {
            if (onEnter) onEnter()
            e.preventDefault()
            return
          }

          // Allow only digits, dot, navigation and editing keys by default
          const allowed = (/^[0-9]$/).test(e.key) || e.key === '.' || e.key === 'Backspace' || e.key === 'Delete' || e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End' || e.key === 'Tab' || e.key === 'Escape'
          if (!allowed) {
            e.preventDefault()
          }
        }}
        onPaste={e => {
          // sanitize pasted content and insert at the selection point
          const paste = e.clipboardData?.getData('text') ?? ''
          const input = e.currentTarget as HTMLInputElement
          const start = input.selectionStart ?? input.value.length
          const end = input.selectionEnd ?? start
          const newVal = input.value.slice(0, start) + paste + input.value.slice(end)
          e.preventDefault()
          onChange(sanitize(newVal))
        }}
      />
    </div>
  )
}

export default Display
