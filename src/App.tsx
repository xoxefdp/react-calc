import React, { useRef } from 'react'
import './App.css'
import Display from './components/Display'
import Keypad from './components/Keypad'
import useCalculator from './hooks/useCalculator'

function App() {

  const { state, reset, setCurrent, addToCurrent, calculate, deleteLast } = useCalculator()

  // Keep a ref in case the input needs to be focused programmatically later.
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const k = e.key
    // digits and dot
    if ((/^[0-9]$/).test(k) || k === '.') {
      e.preventDefault()
      addToCurrent(k)
      return
    }

    // operators
    if (['+', '-', '*', '/'].includes(k)) {
      e.preventDefault()
      addToCurrent(k)
      return
    }

    // calculate
    if (k === 'Enter' || k === '=') {
      e.preventDefault()
      calculate()
      return
    }

    // delete last
    if (k === 'Backspace') {
      e.preventDefault()
      deleteLast()
      return
    }

    // clear
    if (k === 'Escape' || k.toLowerCase() === 'c') {
      e.preventDefault()
      reset()
      return
    }
  }

  const buttons = [
    { symbol: 'C', cols: '3 reset', action: reset },
    { symbol: '/', cols: '1 special', action: addToCurrent },
    { symbol: '7', cols: 1, action: addToCurrent },
    { symbol: '8', cols: 1, action: addToCurrent },
    { symbol: '9', cols: 1, action: addToCurrent },
    { symbol: '*', cols: '1 special', action: addToCurrent },
    { symbol: '4', cols: 1, action: addToCurrent },
    { symbol: '5', cols: 1, action: addToCurrent },
    { symbol: '6', cols: 1, action: addToCurrent },
    { symbol: '-', cols: '1 special', action: addToCurrent },
    { symbol: '1', cols: 1, action: addToCurrent },
    { symbol: '2', cols: 1, action: addToCurrent },
    { symbol: '3', cols: 1, action: addToCurrent },
    { symbol: '+', cols: '1 special', action: addToCurrent },
    { symbol: '.', cols: 1, action: addToCurrent },
    { symbol: '0', cols: 1, action: addToCurrent },
    { symbol: '=', cols: '2 special', action: calculate },
  ]

  return (
    <>
      <div className='calc-container'>
        {/* TODO: truncate input length */}
        {/* TODO: let keyboard events others than 'enter'
          to execute actions, like '/', '*', '-', '+' */}
        {/* TODO: restrain other keyboard events than numbers
          or operation keys to be inputted */}
  <Display inputRef={inputRef} onKeyDown={handleKeyDown} current={state.current} previous={state.previous[state.previous.length - 1]} history={state.previous} onChange={setCurrent} onEnter={calculate} />
        {/* TODO: calc buttons should be clicked but not focused */}
        <Keypad keys={buttons} />
      </div>
    </>
  )
}

export default App
