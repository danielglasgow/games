import "./App.css";
import Board from "./board";
import { BoardLayout } from "./board/types";

function App({ layout }: { layout: BoardLayout }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {Board({ layout })}
    </div>
  );
}

export default App;
