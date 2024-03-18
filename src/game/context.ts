import { Context, createContext } from "react";
import { GameControl } from "./control";
import { GameState, createGameState } from "./state";

import { GameState as ServerGameState } from "../server/types";
import { InitialPlacementOrchestrator } from "./orchestration";

export interface Game {
  state: GameState;
  control: GameControl;
  startOrContinueTurn(): void;
}

class UninitializedGame implements Game {
  public get state(): GameState {
    throw new Error("Game Context is unset");
  }

  public get control(): GameControl {
    throw new Error("Game Context is unset");
  }

  public startOrContinueTurn(): void {
    throw new Error("Game Context is unset");
  }
}

export function createGame(server: ServerGameState): Game {
  const state = createGameState(server);
  const control = new GameControl();
  const turn = new InitialPlacementOrchestrator(state, control);
  control.registerTurn(turn);
  return {
    state, control, startOrContinueTurn: () => {
      turn.startOrContinue();
    }
  }
}

export const GameContext: Context<Game> = createContext(
  new UninitializedGame()
);
