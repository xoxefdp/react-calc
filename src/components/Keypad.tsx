import Button from './Button'

type Key = { symbol: string; cols?: number | string; action: (s: string) => void }

type KeypadProps = {
  keys: Key[]
}

function Keypad({ keys }: KeypadProps) {
  return (
    <div className="calc-keypad">
      {keys.map((k, i) => (
        <Button key={i} symbol={k.symbol} cols={k.cols} action={(s: string) => k.action(s)} />
      ))}
    </div>
  )
}

export default Keypad
