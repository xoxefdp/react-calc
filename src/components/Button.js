import React from "react";

class Button extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    let { symbol } = this.props;
    let { cols } = this.props;
    let { action } = this.props;
    return (
      <div className={`column-${cols}`}>
        <button onClick={() => action(symbol)}>
          {symbol}
        </button>
      </div>
    );
  }
}

export default Button;
