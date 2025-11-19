import { useState } from 'react'
import { evaluateExpression } from '../lib/evaluator'

export type CalcState = {
  current: string
  previous: string[]
  nextIsReset: boolean
}

export function useCalculator(initial?: CalcState) {
  const initialState: CalcState = initial ?? { current: '0', previous: [], nextIsReset: false }
  const [state, setState] = useState<CalcState>(initialState)

  const reset = () => setState(initialState)

  const setCurrent = (val: string) => setState(s => ({ ...s, current: val }))

  const addToCurrent = (symbol: string) => {
    if (['/', '*', '-', '+'].includes(symbol)) {
      setState(s => ({ ...s, previous: [...s.previous, s.current + symbol], nextIsReset: true }))
      return
    }
    setState(s => ((s.current === '0' && symbol !== '.') || s.nextIsReset) ? { ...s, current: symbol, nextIsReset: false } : { ...s, current: s.current + symbol })
  }

  const calculate = () => {
    if (state.previous.length === 0) return
    const expr = [...state.previous, state.current].join('')
    const res = evaluateExpression(expr)
    if (res === null) { setState(s => ({ ...s, current: 'Error', previous: [], nextIsReset: true })); return }
    setState({ current: res, previous: [], nextIsReset: true })
  }

  const deleteLast = () => {
    setState(s => {
      if (s.current === 'Error') return { ...s, current: '0', nextIsReset: false }
      if (s.current.length <= 1) return { ...s, current: '0' }
      return { ...s, current: s.current.slice(0, -1) }
    })
  }

  return { state, reset, setCurrent, addToCurrent, calculate, deleteLast }
}

export default useCalculator
