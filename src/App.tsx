import { useState } from "react";
import "./App.css";
import Board from "./board";
import { GameState } from "./server/types";
import { BoardState } from "./board/state";
import { AppControl } from "./control";
import { AppState } from "./types";

function App({ state }: { game: AppState}) {
  const [state, setState] = useState(game);
  const control = new AppControl(game, state);
  const placeSettlemnt = () => {
    board.showVertexIndicators();
    setActiveAction("PLACE_SETTLEMENT");
  };
  const cancel = () => {
    board.hideVertexIndicators();
    setActiveAction("NONE");
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {Board({ board, control: {

          } })}
        </div>
        <div
          id="actionbox"
          style={{
            marginLeft: "10vmin",
            width: "30vmin",
            height: "80vmin",
            background: "#f6b26bff",
            float: "right",
          }}
        >
          <button
            style={{ margin: "10px", width: "20vmin" }}
            onClick={placeSettlemnt}
          >
            Place Settlement
          </button>
          <button style={{ margin: "10px", width: "20vmin" }}>
            Place City
          </button>
          <button style={{ margin: "10px", width: "20vmin" }}>
            Place Road
          </button>
          <div>
            {activeAction != "NONE" && (
              <button
                style={{ margin: "10px", width: "20vmin" }}
                onClick={cancel}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
