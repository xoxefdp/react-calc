import React from "react";

class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "0"
    };
  }

  UNSAFE_componentWillUpdate(props, state) {
    console.log("Will update from props ", props, state, this.state);
  }

  render() {
    let { current } = this.props;
    return (
      <input
        type="text"
        value={current}
        onChange={this.props.changeValue}
      />
    );
  }
}

export default Field;
