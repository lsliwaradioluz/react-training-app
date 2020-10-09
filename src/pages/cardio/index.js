import { React, Fragment } from "src/imports/react";

const Cardio = (props) => {
  const [state, setState] = React.useState({ count: 0, error: false });

  return (
    <Fragment>
      <div data-test="component-app">
        <h1 data-test="counter-display">
          The counter is currently <span data-test="count">{state.count}</span>
        </h1>
        {state.error ? (
          <p data-test="error">The counter should not go below 0</p>
        ) : null}
        <button
          type="button"
          data-test="increment-button"
          onClick={() => setState({ count: state.count + 1, error: false })}
        >
          Increment counter
        </button>
        <button
          type="button"
          data-test="decrement-button"
          onClick={() =>
            setState({
              count: state.count === 0 ? 0 : state.count - 1,
              error: state.count === 0 ? true : false,
            })
          }
        >
          Decrement counter
        </button>
      </div>
    </Fragment>
  );
};

export default Cardio;
