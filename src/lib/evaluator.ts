export const tokenize = (expr: string): string[] => {
  const tokens: string[] = []
  let num = ''
  for (const ch of expr) {
    if ((ch >= '0' && ch <= '9') || ch === '.') { num += ch; continue }
    if (['+', '-', '*', '/'].includes(ch)) { if (num) { tokens.push(num); num = '' }; tokens.push(ch) }
  }
  if (num) tokens.push(num)
  return tokens
}

export const safeParse = (s: string): number | null => {
  const n = parseFloat(s)
  return isFinite(n) ? n : null
}

export const applyMulDiv = (tokens: string[]): string[] | null => {
  const out: string[] = []
  let i = 0
  while (i < tokens.length) {
    const tk = tokens[i]
    if (tk === '*' || tk === '/') {
      const a = safeParse(out.pop() ?? '0')
      const b = safeParse(tokens[i + 1] ?? '0')
      if (a === null || b === null) return null
      if (tk === '/' && b === 0) return null
      out.push(String(tk === '*' ? a * b : a / b))
      i += 2
      continue
    }
    out.push(tk)
    i += 1
  }
  return out
}

export const applyAddSub = (tokens: string[]): number | null => {
  if (tokens.length === 0) return 0
  let acc = safeParse(tokens[0])
  if (acc === null) return null
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i]
    const v = safeParse(tokens[i + 1] ?? '0')
    if (v === null) return null
    acc = op === '+' ? acc + v : acc - v
  }
  return acc
}

export const formatResult = (n: number): string => String(Math.round((n + Number.EPSILON) * 1e12) / 1e12)

export const evaluateExpression = (expr: string): string | null => {
  const tokens = tokenize(expr)
  const after = applyMulDiv(tokens)
  if (after === null) return null
  const finalVal = applyAddSub(after)
  if (finalVal === null || !isFinite(finalVal)) return null
  return formatResult(finalVal)
}
