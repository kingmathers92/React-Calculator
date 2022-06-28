import { useReducer } from "react";
import DigitBtn from "./DigitBtn";
import OperationBtn from "./OperationBtn";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currOperand: `${state.currOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currOperand == null && state.PrevOperand == null) {
        return state;
      }

      if (state.currOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.PrevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          PrevOperand: state.currOperand,
          currOperand: null,
        };
      }

      return {
        ...state,
        PrevOperand: evaluate(state),
        operation: payload.operation,
        currOperand: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currOperand: null,
        };
      }
      if (state.currOperand == null) return state;
      if (state.currOperand.length === 1) {
        return { ...state, currOperand: null };
      }

      return {
        ...state,
        currOperand: state.currOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currOperand == null ||
        state.PrevOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        PrevOperand: null,
        currOperand: evaluate(state),
        operation: null,
      };
  }
}

function evaluate({ currOperand, PrevOperand, operation }) {
  const prev = parseFloat(PrevOperand);
  const current = parseFloat(currOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currOperand, PrevOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator">
      <div className="output">
        <div className="prev-operand">
          {formatOperand(PrevOperand)} {operation}
        </div>
        <div className="curr-operand">{formatOperand(currOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationBtn operation="÷" dispatch={dispatch} />
      <DigitBtn digit="1" dispatch={dispatch} />
      <DigitBtn digit="2" dispatch={dispatch} />
      <DigitBtn digit="3" dispatch={dispatch} />
      <OperationBtn operation="*" dispatch={dispatch} />
      <DigitBtn digit="4" dispatch={dispatch} />
      <DigitBtn digit="5" dispatch={dispatch} />
      <DigitBtn digit="6" dispatch={dispatch} />
      <OperationBtn operation="+" dispatch={dispatch} />
      <DigitBtn digit="7" dispatch={dispatch} />
      <DigitBtn digit="8" dispatch={dispatch} />
      <DigitBtn digit="9" dispatch={dispatch} />
      <OperationBtn operation="-" dispatch={dispatch} />
      <DigitBtn digit="." dispatch={dispatch} />
      <DigitBtn digit="0" dispatch={dispatch} />
      <button
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        className="span-two"
      >
        =
      </button>
    </div>
  );
}

export default App;
