// import "./styles.css";
import { useState, useEffect } from "react";

export default function Traffic() {
  const cellStyle = {
    display:"flex",
    width: "40px",
    height: "40px",
    border: "1px solid #fff",
    boxSizing: "border-box",
    backgroundColor: "blue",
    borderRadius: "10px",
  };
  const anchorCellStyle = {
    ...cellStyle,
    backgroundColor: "yellow",
  };
  const [flag, setFlag] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setFlag((prev) => !prev);
      setCount((count) => {
        if (count >= 19) {
          clearInterval(interval);
        }
        return count + 1;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h3>Traffic Lamb</h3>
      <span className="traffic" style={ flag ? anchorCellStyle : cellStyle } />
      <span>{count}</span>
    </div>
  );
}


