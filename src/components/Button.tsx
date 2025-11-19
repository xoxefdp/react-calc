type ButtonProps = {
  symbol: string;
  cols?: number | string;
  action: (symbol: string) => void;
};

function Button({ symbol, cols = 1, action }: ButtonProps) {
  return (
    <div className={`column-${cols}`}>
      <button onClick={() => action(symbol)}>{symbol}</button>
    </div>
  );
}

export default Button;
