import "./App.css";
import Board from "./board";
import { BoardState } from "./board/state";

function App({ board }: { board: BoardState }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {Board({ board })}
    </div>
  );
}

export default App;
