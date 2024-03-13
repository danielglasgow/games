import { useState } from "react";
import "./App.css";
import Board from "./board";
import { AppControl } from "./control";
import { GameContext, createGameState } from "./game/state";
import { SidePanel } from "./sidepanel";
import { AppState } from "./types";

function App({ app }: { app: AppState }) {
  const [state, setState] = useState(app);
  const control = new AppControl(state, setState);
  return (
    <div>
      <GameContext.Provider value={createGameState(app.server)}>
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
            <Board layout={app.server.board} />
          </div>
          {SidePanel(control)}
        </div>
      </GameContext.Provider>
    </div>
  );
}

export default App;
