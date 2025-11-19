import React from 'react'
import { render } from '@testing-library/react'
import OperationHistory from './OperationHistory'

test('OperationHistory renders list of previous operations', () => {
  const history = ['1+2', '3*4']
  const { getByText } = render(<OperationHistory history={history} />)
  expect(getByText('1+2')).toBeTruthy()
  expect(getByText('3*4')).toBeTruthy()
})
