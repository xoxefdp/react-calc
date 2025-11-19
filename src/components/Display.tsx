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
}

function Display({ current, previous, history = [], onChange, onEnter, onKeyDown, inputRef }: DisplayProps) {
  const sanitize = (v: string) => {
    // keep only digits and dots
    let s = v.replace(/[^0-9.]/g, '')
    // keep only the first dot
    const firstDot = s.indexOf('.')
    if (firstDot !== -1) {
      s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '')
    }
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
        onChange={e => onChange(sanitize(e.target.value))}
        onKeyDown={e => {
          if (onKeyDown) { onKeyDown(e); return }
          if (e.key === 'Enter' && onEnter) onEnter()
        }}
      />
    </div>
  )
}

export default Display
