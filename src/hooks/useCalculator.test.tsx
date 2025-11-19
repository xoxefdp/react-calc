import React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useCalculator from './useCalculator'

function TestComponent() {
  const { state, reset, setCurrent, addToCurrent, calculate } = useCalculator()
  return (
    <div>
      <div data-testid="current">{state.current}</div>
      <div data-testid="previous">{state.previous.join('|')}</div>
      <input data-testid="manual-input" value={state.current} onChange={e => setCurrent(e.target.value)} />
      <button onClick={() => addToCurrent('1')} data-testid="add-1">1</button>
      <button onClick={() => addToCurrent('+')} data-testid="add-plus">+</button>
      <button onClick={() => addToCurrent('2')} data-testid="add-2">2</button>
      <button onClick={() => addToCurrent('.')} data-testid="add-dot">.</button>
      <button onClick={() => addToCurrent('5')} data-testid="add-5">5</button>
      <button onClick={() => addToCurrent('/')} data-testid="add-div">/</button>
      <button onClick={() => addToCurrent('0')} data-testid="add-0">0</button>
      <button onClick={calculate} data-testid="calc">=</button>
      <button onClick={reset} data-testid="reset">C</button>
      <button onClick={() => setCurrent('5')} data-testid="set-5">set</button>
    </div>
  )
}

test('useCalculator basic flow: add digits, operator, calculate and reset', async () => {
  const utils = render(<TestComponent />)
  const { getByTestId } = utils
  const user = userEvent.setup()

  const cur = getByTestId('current')
  const prev = getByTestId('previous')

  // initial
  expect(cur.textContent).toBe('0')
  expect(prev.textContent).toBe('')

  // add 1
  await user.click(getByTestId('add-1'))
  expect(cur.textContent).toBe('1')

  // add +
  await user.click(getByTestId('add-plus'))
  expect(prev.textContent).toBe('1+')

  // add 2 (should replace current)
  await user.click(getByTestId('add-2'))
  expect(cur.textContent).toBe('2')

  // calculate -> 3
  await user.click(getByTestId('calc'))
  await waitFor(() => expect(getByTestId('current').textContent).toBe('3'))

  // reset -> 0
  await user.click(getByTestId('reset'))
  await waitFor(() => expect(getByTestId('current').textContent).toBe('0'))

  // set current directly via typing into input
  const manual = getByTestId('manual-input') as HTMLInputElement
  await user.clear(manual)
  await user.keyboard('5')
  await waitFor(() => expect(getByTestId('current').textContent).toBe('5'))
})

test('useCalculator decimals and division by zero', async () => {
  const utils2 = render(<TestComponent />)
  const { getByTestId } = utils2
  const user = userEvent.setup()

  // start fresh
  await user.click(getByTestId('reset'))

  // enter 2.5 + 1.25 = 3.75
  const manual = getByTestId('manual-input') as HTMLInputElement
  await user.clear(manual)
  await user.keyboard('2.5')
  await user.click(getByTestId('add-plus'))
  await user.clear(manual)
  await user.keyboard('1.25')
  await user.click(getByTestId('calc'))
  await waitFor(() => expect(getByTestId('current').textContent).toBe('3.75'))

  // division by zero -> Error
  await user.click(getByTestId('reset'))
  await user.click(getByTestId('add-1'))
  await user.click(getByTestId('add-div'))
  await user.click(getByTestId('add-0'))
  await user.click(getByTestId('calc'))
  await waitFor(() => expect(getByTestId('current').textContent).toBe('Error'))
})

test('recover from Error when typing a digit', async () => {
  const utils3 = render(<TestComponent />)
  const { getByTestId } = utils3
  const user = userEvent.setup()
  // trigger division by zero
  await user.click(getByTestId('reset'))
  await user.click(getByTestId('add-1'))
  await user.click(getByTestId('add-div'))
  await user.click(getByTestId('add-0'))
  await user.click(getByTestId('calc'))
  await waitFor(() => expect(getByTestId('current').textContent).toBe('Error'))

  // now type a digit (via the add-2 button) - should reset current to '2'
  await user.click(getByTestId('add-2'))
  await waitFor(() => expect(getByTestId('current').textContent).toBe('2'))
})
