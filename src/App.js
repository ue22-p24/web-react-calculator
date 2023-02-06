import logo from "./logo.svg";
import "./App.sass";
import { useReducer, useState } from "react";

const CalculationOutput = ({ formula, value }) => {
  return (
    <div className="output">
      {formula || "0"}
      {value ? <span className="preRes">{value}</span> : ""}
    </div>
  );
};

const CalcButton = ({ value, action, children }) => {
  return (
    <button onClick={() => action(value)} key={value}>
      {children ? children : value}
    </button>
  );
};

const CalcKeyboard = ({ action }) => {
  return (
    <>
      <div className="operations">
        <CalcButton action={action} value={"/"} />
        <CalcButton action={action} value={"*"} />
        <CalcButton action={action} value={"+"} />
        <CalcButton action={action} value={"-"} />
        <CalcButton action={action} value={"clear"}>
          <img
            alt={"backspace"}
            width={40}
            height={40}
            // how to insert an image that is in the public/ folder
            src={process.env.PUBLIC_URL + "/backspace.png"}
          />
        </CalcButton>
      </div>
      <div>
        <div className="digits">
          {[...Array(9).keys()].map((i) => {
            return <CalcButton action={action} value={i + 1} key={i} />;
          })}
          <CalcButton action={action} value={"."} />
          <CalcButton action={action} value={"0"} />
          <CalcButton action={action} value={"="} />
        </div>
      </div>
    </>
  );
};

// Custom hook to handle formula and calculation output
const useFormulaAndResult = () => {
  const [output, setOutput] = useState("");

  // Reducer function
  const updateCalculation = (calculation, action) => {
    console.log("updateCalculation");
    console.log(action);
    const operations = ["/", "*", "+", "-", "."];
    if (
      operations.includes(action) & (calculation === "") ||
      operations.includes(action) & operations.includes(calculation.slice(-1))
    ) {
      // cannot add operations or dot if formula is empty or last symbol is already operation or dot
      return calculation;
    } else if (action === "clear") {
      if (calculation === "") {
        return "";
      } else {
        return calculation.slice(0, -1);
      }
    } else if (action === "=") {
      return `${eval(calculation)}`;
    }

    const newCalculation = calculation + `${action}`;

    if (operations.includes(action)) {
      return newCalculation;
    }

    const result = eval(newCalculation);

    setOutput(`${result}`);

    return newCalculation;
  };

  const [calculation, dispatch] = useReducer(updateCalculation, "");
  return [calculation, output, dispatch];
};

function App() {
  // const calculate = () => {
  //   setCalculation(eval(calculation).toString());
  // };
  const [calculation, output, dispatch] = useFormulaAndResult();

  return (
    <div>
      <center>
        <h1>
          Calculator With <img alt="react" className="react-logo" src={logo} />{" "}
          Hooks
        </h1>
      </center>
      <div className="calc-grid">
        <CalculationOutput value={output} formula={calculation} />
        <CalcKeyboard action={dispatch}></CalcKeyboard>
      </div>
    </div>
  );
}

export default App;
