import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Keypad from './Keypad'

test('Keypad calls action with symbol when button clicked', async () => {
  const clicks: string[] = []
  const keys = [
    { symbol: '1', cols: 1, action: (s: string) => clicks.push(s) },
    { symbol: '+', cols: '1 special', action: (s: string) => clicks.push(s) },
  ]
  const { getByText } = render(<Keypad keys={keys as unknown as any} />)
  await userEvent.click(getByText('1'))
  await userEvent.click(getByText('+'))
  expect(clicks).toEqual(['1', '+'])
})
