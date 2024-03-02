import { BoardState } from "./board/state";
import { GameState } from "./server/types";

export type Action = "PLACE_SETTLEMENT" | "PLACE_CITY" | "PLACE_ROAD"

export interface AppState {
  readonly server: GameState;
  readonly board: BoardState;
  readonly activeAction?: Action;
  readonly isLocked: boolean;
}