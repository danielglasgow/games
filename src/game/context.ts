import { Context, createContext } from "react";
import { GameState, createUninitializedGameState } from "./state";

export const GameContext: Context<GameState>  = createContext(createUninitializedGameState());