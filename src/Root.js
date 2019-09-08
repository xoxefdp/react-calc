import React from "react";
import "./Root.css";
// import Field from "./components/Field";
import Button from "./components/Button";

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "0",
      previous: [],
      nextIsReset: false
    };
  }

  // changeValue = ev => {
  //   let value = ev.target.value;
  //   this.setState({ current: value });
  // };

  reset = () => {
    this.setState({
      current: "0",
      previous: [],
      nextIsReset: false
    });
  };

  addToCurrent = symbol => {
    if (["/", "*", "-", "+"].indexOf(symbol) > -1) {
      let { previous } = this.state;
      previous.push(this.state.current + symbol);
      this.setState({ previous, nextIsReset: true });
    } else {
      if (this.state.current === "0" && symbol !== "."  || this.state.nextIsReset) {
        this.setState({ current: symbol, nextIsReset: false });
      } else {
        this.setState({ current: this.state.current + symbol });
      }
    }
  };

  calculate = symbol => {
    let { current, previous, nextIsReset } = this.state;
    if (previous.length > 0) {
      current = eval(String(previous[previous.length - 1] + current));
      this.setState({ current, previous: [], nextIsReset: true });
    }
  };

  render() {
    const buttons = [
      { symbol: "C", cols: "3 special", action: this.reset },
      { symbol: "/", cols: "1 special", action: this.addToCurrent },
      { symbol: "7", cols: 1, action: this.addToCurrent },
      { symbol: "8", cols: 1, action: this.addToCurrent },
      { symbol: "9", cols: 1, action: this.addToCurrent },
      { symbol: "*", cols: "1 special", action: this.addToCurrent },
      { symbol: "4", cols: 1, action: this.addToCurrent },
      { symbol: "5", cols: 1, action: this.addToCurrent },
      { symbol: "6", cols: 1, action: this.addToCurrent },
      { symbol: "-", cols: "1 special", action: this.addToCurrent },
      { symbol: "1", cols: 1, action: this.addToCurrent },
      { symbol: "2", cols: 1, action: this.addToCurrent },
      { symbol: "3", cols: 1, action: this.addToCurrent },
      { symbol: "+", cols: "1 special", action: this.addToCurrent },
      { symbol: ".", cols: 1, action: this.addToCurrent },
      { symbol: "0", cols: 1, action: this.addToCurrent },
      { symbol: "=", cols: "2 special", action: this.calculate }
    ];

    return (
      <div>
        {/* <Field changeValue={this.changeValue} current={this.state.current} /> */}
        {this.state.previous.length > 0 ? (
          <div className="calc-operation">
            {this.state.previous[this.state.previous.length - 1]}
          </div>
        ) : null}
        <input type="text" className="calc-input" value={this.state.current} />
        {buttons.map((btn, i) => {
          return (
            <Button
              key={i}
              symbol={btn.symbol}
              cols={btn.cols}
              action={symbol => btn.action(symbol)}
            />
          );
        })}
      </div>
    );
  }
}

export default Root;
