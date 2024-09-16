import { useLayoutEffect, useState } from "react";
import "./App.css";
import development from "./assets/cards/development.svg";
import resource from "./assets/cards/resource.svg";
import vp from "./assets/cards/vp.svg";
import Board from "./board";
import { GameContext, createGameContext } from "./game";
import { AppState } from "./types";

function App({ app }: { app: AppState }) {
  const [state, setState] = useState(app);
  const game = createGameContext(state, setState);
  useLayoutEffect(() => game.turn.startOrContinue());
  return (
    <div>
      <GameContext.Provider value={game}>
        <div
          style={{
            display: "grid",
            width: "80%",
            height: "100vmin",
            gridTemplateColumns: "25% auto 25%",
            gridTemplateRows: "10% 70% 20%",
          }}
        >
          <div
            style={{
              gridColumnStart: 2,
              gridColumnEnd: 2,
              gridRowStart: 2,
              gridRowEnd: 2,
              justifySelf: "center",
            }}
          >
            <Board layout={state.server.board} />
          </div>
          <div
            style={{
              gridColumnStart: 2,
              gridColumnEnd: 2,
              gridRowStart: 1,
              gridRowEnd: 1,
            }}
          >
            <div style={{ display: "flex" }}>
              <div
                style={{
                  width: "25%",
                  marginLeft: "-25%",
                  height: "22vmin",
                  border: "1px solid black",
                }}
              >
                <div style={{ padding: "5px" }}>Player Top Profile</div>
              </div>
              <div
                style={{
                  display: "block",
                  marginLeft: "5px",
                  width: "14vmin",
                  height: "22vmin",
                  // border: "1px solid black",
                }}
              >
                <div>
                  <img
                    src={resource}
                    style={{
                      width: "7vmin",
                      height: "10vmin",
                    }}
                  />
                </div>
                <div>
                  <img
                    src={development}
                    style={{
                      width: "7vmin",
                      height: "10vmin",
                    }}
                  />
                </div>
              </div>
              <div>
                <img
                  src={vp}
                  style={{
                    width: "7vmin",
                    height: "10vmin",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </GameContext.Provider>
    </div>
  );
}

export default App;
