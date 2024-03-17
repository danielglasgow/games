import { useLayoutEffect, useState } from "react";
import "./App.css";
import Board from "./board";
import { CONTROL_MANAGER } from "./control/manager";
import { GameContext } from "./game/context";
import { createGameState } from "./game/state";
import { SidePanel } from "./sidepanel";
import { AppState } from "./types";

function App({ app }: { app: AppState }) {
  useLayoutEffect(() => CONTROL_MANAGER.startOrContinueTurn())
  const [state, setState] = useState(app);
  const game = createGameState(state.server);
  CONTROL_MANAGER.registerSync(setState);
  CONTROL_MANAGER.registerGame(game);
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
          <SidePanel/>
        </div>
      </GameContext.Provider>
    </div>
  );
}

export default App;
