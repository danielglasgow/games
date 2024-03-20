import { useLayoutEffect, useState } from "react";
import "./App.css";
import Board from "./board";
import { GameContext, createGameContext } from "./game";
import { SidePanel } from "./sidepanel";
import { AppState } from "./types";

function App({ app }: { app: AppState }) {
  const [state, setState] = useState(app);
  const game = createGameContext(state, setState);
  useLayoutEffect(() => game.turn.startOrContinue())
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
