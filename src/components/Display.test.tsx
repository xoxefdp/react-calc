import React, { useState } from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import Display from './Display'

test('Display shows previous and calls onChange', async () => {
  const Wrapper = () => {
    const [value, setValue] = useState('12')
    const handleChange = vi.fn((v: string) => setValue(v))
    return <Display current={value} previous="1+" onChange={handleChange} />
  }

  const utils = render(<Wrapper />)
  const { getByRole, getByText } = utils
  const user = userEvent.setup()

  // previous is shown (use a flexible matcher in case the text is split across nodes)
  expect(getByText((content) => content.includes('1+'))).toBeTruthy()

  const input = getByRole('textbox') as HTMLInputElement
  await user.clear(input)
  await user.keyboard('13')
  await waitFor(() => expect(input.value).toBe('13'))
})

test('Display sanitizes input, allowing only digits and one dot', async () => {
  // Controlled wrapper so the Display's value updates as onChange is called
  const Wrapper = () => {
    const [value, setValue] = React.useState('')
    return <Display current={value} history={[]} onChange={setValue} />
  }
  const utils2 = render(<Wrapper />)
  const { getByRole } = utils2
  const input = getByRole('textbox') as HTMLInputElement
  const user = userEvent.setup()

  // type a messy string
  await user.clear(input)
  await user.keyboard('1a2b.3..4')

  // After typing, the controlled input should reflect the sanitized string '12.34'
  await waitFor(() => expect(input.value).toBe('12.34'))
})
