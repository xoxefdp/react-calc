import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

test('Button renders symbol and calls action with symbol', async () => {
  const calls: string[] = []
  const { getByText } = render(<Button symbol="9" action={(s) => calls.push(s)} />)
  const btn = getByText('9')
  await userEvent.click(btn)
  expect(calls).toEqual(['9'])
})
