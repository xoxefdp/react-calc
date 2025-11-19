import { describe, it, expect } from 'vitest'
import { tokenize, evaluateExpression, applyMulDiv, applyAddSub, safeParse } from './evaluator'

describe('tokenize', () => {
  it('splits numbers and operators', () => {
    expect(tokenize('12+3.5*2')).toEqual(['12', '+', '3.5', '*', '2'])
  })
})

describe('applyMulDiv and applyAddSub', () => {
  it('respects precedence', () => {
    const tokens = tokenize('2+3*4-5/5')
    const after = applyMulDiv(tokens)
    expect(after).not.toBeNull()
    // after should be ['2', '+', '12', '-', '1']
    expect(after).toEqual(['2', '+', '12', '-', '1'])
    const final = applyAddSub(after || [])
    expect(final).toBe(13)
  })

  it('returns null on invalid parse', () => {
    expect(applyMulDiv(['a', '*', '2'] as any)).toBeNull()
  })
})

describe('evaluateExpression', () => {
  it('calculates correctly', () => {
    expect(evaluateExpression('2+2')).toBe('4')
    expect(evaluateExpression('2+3*4')).toBe('14')
  })

  it('handles division by zero', () => {
    expect(evaluateExpression('1/0')).toBeNull()
  })

  it('returns null for unary/negative usages that are not supported', () => {
    // current tokenizer/evaluator does not support unary minus or leading operators
    expect(evaluateExpression('-1+2')).toBeNull()
    expect(evaluateExpression('2+-3')).toBeNull()
  })

  it('handles floating point rounding (0.1 + 0.2 -> 0.3)', () => {
    expect(evaluateExpression('0.1+0.2')).toBe('0.3')
  })
})

describe('safeParse', () => {
  it('parses valid numbers and returns null for invalid', () => {
    expect(safeParse('3.14')).toBeCloseTo(3.14)
    expect(safeParse('0')).toBe(0)
    expect(safeParse('abc')).toBeNull()
    expect(safeParse('Infinity')).toBeNull()
  })
})
