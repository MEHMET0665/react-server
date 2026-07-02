import "./App.css";
import { useEffect, useState } from "react";
function Grid() {
  const cellStyle = {
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

  const [pos, setPos] = useState(0);

  useEffect(() => {
    const handleKey = (e) => {
      setPos((prev) => {
        let row = Math.floor(prev / 5);
        let col = prev % 5;

        switch (e.key) {
          case "ArrowUp":
            if (row > 0) {
              row--;
            } else {
              col = col < 4 ? col + 1 : col - 1;
            }
            break;

          case "ArrowDown":
            if (row < 4) {
              row++;
            } else {
              col = col < 4 ? col + 1 : col - 1;
            }
            break;

          case "ArrowLeft":
            if (col > 0) {
              col--;
            } else {
              row = row < 4 ? row + 1 : row - 1;
            }
            break;

          case "ArrowRight":
            if (col < 4) {
              col++;
            } else {
              row = row < 4 ? row + 1 : row - 1;
            }
            break;

          default:
            return prev;
        }

        return row * 5 + col;
      });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const renderGrid = () => {
    const cells = [];
    for (let i = 0; i < 25; i++) {
      cells.push(
        <div key={i} style={i === pos ? anchorCellStyle : cellStyle} />
      );
    }
    return cells;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(5, 40px)`,
        gap: "1px",
        padding: "8px",
        background: "#fff",
        width: "fit-content",
      }}
    >
      {renderGrid()}
     
    </div>
   
  );
}

export default Grid;