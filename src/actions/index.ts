import { GameState } from "../server/types";

export interface Action {
  execute(): Promise<void |GameState>
}