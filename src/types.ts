import { BoardState } from "./board/state";

export type Action = "PLACE_SETTLEMENT" | "PLACE_CITY" | "PLACE_ROAD"

export interface AppState {
  board: BoardState;
  activeAction?: Action;
}