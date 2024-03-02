import { useState } from "react";
import "./App.css";
import Board from "./board";
import { AppControl } from "./control";
import { AppState } from "./types";

function App({ app }: { app: AppState }) {
  const [state, setState] = useState(app);
  const control = new AppControl(state, setState);
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
          {Board({
            board: { state: state.board, control: control.getBoardControl() },
          })}
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
            onClick={control.placeSettlement.bind(control)}
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
            {state.activeAction && (
              <button
                style={{ margin: "10px", width: "20vmin" }}
                onClick={control.cancel}
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
