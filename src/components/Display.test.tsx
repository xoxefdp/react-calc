import React, { useState } from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
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

test('Display truncates input to maxLength', async () => {
  // use a small maxLength to test truncation easily
  const Wrapper = () => {
    const [value, setValue] = React.useState('')
    return <Display current={value} history={[]} onChange={setValue} maxLength={6} />
  }

  const utils = render(<Wrapper />)
  const { getByRole } = utils
  const input = getByRole('textbox') as HTMLInputElement
  const user = userEvent.setup()

  // type a long numeric string with extra characters
  await user.clear(input)
  await user.keyboard('1234567890abc')

  // sanitized and truncated to 6 characters -> '123456'
  await waitFor(() => expect(input.value).toBe('123456'))
})

test('Display blocks non-numeric keys when no onKeyDown provided', async () => {
  const Wrapper = () => {
    const [value, setValue] = React.useState('')
    return <Display current={value} history={[]} onChange={setValue} maxLength={6} />
  }

  const utils = render(<Wrapper />)
  const { getByRole } = utils
  const input = getByRole('textbox') as HTMLInputElement
  const user = userEvent.setup()

  await user.clear(input)
  // type a letter - should be blocked and not change value
  await user.keyboard('a')
  await waitFor(() => expect(input.value).toBe(''))
})

test('Display sanitizes pasted text', async () => {
  const Wrapper = () => {
    const [value, setValue] = React.useState('')
    return <Display current={value} history={[]} onChange={setValue} maxLength={6} />
  }

  const utils = render(<Wrapper />)
  const { getByRole } = utils
  const input = getByRole('textbox') as HTMLInputElement

  // simulate paste via userEvent (works in jsdom)
  // simulate paste with fireEvent and clipboardData
  fireEvent.paste(input, {
    clipboardData: {
      getData: () => '12a3.4b5678'
    }
  })

  // sanitized and truncated to 6 characters -> '123.45'
  await waitFor(() => expect(input.value).toBe('123.45'))
})
