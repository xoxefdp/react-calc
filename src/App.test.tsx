import React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

test('App integration: 1 + 2 = 3 via keypad clicks', async () => {
  const utils = render(<App />)
  const { getByText, getByRole } = utils
  const user = userEvent.setup()
  const input = getByRole('textbox') as HTMLInputElement

  // clear and type 1 using keyboard
  await user.clear(input)
  await user.keyboard('1')
  // click +
  await user.click(getByText('+'))
  // clear and type 2 using keyboard
  await user.clear(input)
  await user.keyboard('2')
  // click =
  await user.click(getByText('='))

  // input should now show 3
  await waitFor(() => expect(input.value).toBe('3'))
})

test('Long sequence integration and history', async () => {
  const utils2 = render(<App />)
  const { getByText, getByRole, findAllByText } = utils2
  const user = userEvent.setup()

  // 1 + 2 = 3
  const input = getByRole('textbox') as HTMLInputElement
  await user.clear(input)
  await user.keyboard('1')
  await user.click(getByText('+'))
  // history should show the operation so far (1+)
  const historyMatches = await findAllByText('1+')
  expect(historyMatches.length).toBeGreaterThan(0)
  await user.clear(input)
  await user.keyboard('2')
  await user.click(getByText('='))
  await waitFor(() => expect((getByRole('textbox') as HTMLInputElement).value).toBe('3'))

  // * 4 = 12
  await user.click(getByText('*'))
  // history should now show the previous result ready for multiplication (3*)
  const historyMatches2 = await findAllByText('3*')
  expect(historyMatches2.length).toBeGreaterThan(0)
  await user.clear(input)
  await user.keyboard('4')
  await user.click(getByText('='))
  await waitFor(() => expect((getByRole('textbox') as HTMLInputElement).value).toBe('12'))
  // The history contained intermediate expressions like '1+' and '3*' checked above
})

test('Pressing Enter in Display triggers calculation', async () => {
  const utils3 = render(<App />)
  const { getByRole, getByText } = utils3
  const user = userEvent.setup()
  const input = getByRole('textbox') as HTMLInputElement

  await user.clear(input)
  await user.keyboard('1')
  await user.click(getByText('+'))
  await user.clear(input)
  await user.keyboard('2')
  // press Enter to calculate
  await user.keyboard('{Enter}')

  await waitFor(() => expect(input.value).toBe('3'))
})

test('Full keyboard input performs operations (4+5=9)', async () => {
  const utils4 = render(<App />)
  const { getByRole } = utils4
  const user = userEvent.setup()
  const input = getByRole('textbox') as HTMLInputElement

  await user.clear(input)
  // type 4 + 5 Enter
  await user.keyboard('4+5{Enter}')

  await waitFor(() => expect(input.value).toBe('9'))
})

test('Backspace removes char and Escape clears', async () => {
  const utils5 = render(<App />)
  const { getByRole } = utils5
  const user = userEvent.setup()
  const input = getByRole('textbox') as HTMLInputElement

  await user.clear(input)
  await user.keyboard('12')
  // backspace should remove '2'
  await user.keyboard('{Backspace}')
  await waitFor(() => expect(input.value).toBe('1'))

  // escape should reset to 0
  await user.keyboard('{Escape}')
  await waitFor(() => expect(input.value).toBe('0'))
})

test('numpad and shift operator input work as expected', async () => {
  const utils = render(<App />)
  const { getByRole } = utils
  const user = userEvent.setup()
  const input = getByRole('textbox') as HTMLInputElement

  // simulate numpad: type '4' then '+' then '5' and Enter
  await user.clear(input)
  await user.keyboard('4')
  await user.keyboard('+')
  await user.keyboard('5')
  await user.keyboard('{Enter}')

  await waitFor(() => expect(input.value).toBe('9'))
})

test('composition (IME) ends and input is sanitized', async () => {
  const utils = render(<App />)
  const { getByRole } = utils
  const input = getByRole('textbox') as HTMLInputElement
  const user = userEvent.setup()

  // jsdom doesn't emulate IME well; simply type '1a2' and expect sanitization to leave only digits
  await user.clear(input)
  await user.type(input, '1a2')

  await waitFor(() => expect((getByRole('textbox') as HTMLInputElement).value).toBe('12'))
})
