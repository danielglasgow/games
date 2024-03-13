import { useState } from "react";
import "./App.css";
import Board from "./board";
import { AppControl } from "./control";
import {createGameState } from "./game/state";
import { SidePanel } from "./sidepanel";
import { AppState } from "./types";
import { GameContext } from "./game/context";
import { CONTROL_MANAGER } from "./control/manager";

function App({ app }: { app: AppState }) {
  const [state, setState] = useState(app);
  const game = createGameState(state.server);
  CONTROL_MANAGER.registerSync(setState);
  CONTROL_MANAGER.registerGame(game);
  const control = new AppControl(state, setState);
  return (
    <div>
      <GameContext.Provider value={game}>
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
            <Board layout={state.server.board} />
          </div>
          {SidePanel(control)}
        </div>
      </GameContext.Provider>
    </div>
  );
}

export default App;
