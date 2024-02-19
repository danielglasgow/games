import "./App.css";
import Board from "./board";
import { TileType } from "./board/types";

function App({ tiles }: { tiles: TileType[] }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {Board({ tiles })}
    </div>
  );
}

export default App;
