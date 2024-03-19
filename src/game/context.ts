import { Context, Dispatch, SetStateAction, createContext } from "react";
import { ControlRegistry, GameControl } from "./control";
import { GameState, createGameState } from "./state";

import { GameState as ServerGameState } from "../server/types";
import { AppState } from "../types";
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

export function createGame(server: ServerGameState, setAppState: Dispatch<SetStateAction<AppState>>): Game {
  const state = createGameState(server);
  const control = new ControlRegistry(); 
  const turn = new InitialPlacement(state, control, setAppState);
  return { state, control, turn};
}

export const GameContext: Context<Game> = createContext(
  new UninitializedGame()
);
