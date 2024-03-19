import { Context, createContext } from "react";
import { GameControl } from "./control";
import { GameState, createGameState } from "./state";

import { GameState as ServerGameState } from "../server/types";
import { GameTurn, InitialPlacement } from "./turn";

export interface Game {
  state: GameState;
  turn: GameTurn;
  control: GameControl;
}

class UninitializedGame implements Game {
  public get state(): GameState {
    throw new Error("GameContext is unset");
  }

  public get control(): GameControl {
    throw new Error("GameContext is unset");
  }

  public get turn(): GameTurn {
    throw new Error("GameContext is unset");
  }
}

export function createGame(server: ServerGameState): Game {
  const state = createGameState(server);
  const control = new GameControl();
  const turn = new InitialPlacement(state, control);
  return { state, control, turn};
}

export const GameContext: Context<Game> = createContext(
  new UninitializedGame()
);
