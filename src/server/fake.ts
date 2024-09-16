import { newRandomGame } from "./state";
import {
  BoardLayout,
  City,
  GameState,
  GameTurn,
  HexId,
  InitialPlacementTurn,
  PlayerOther,
  PlayerYou,
  Road,
  Settlement,
  VertexId,
} from "./types";

class FakeServer {
  private state: GameState = newRandomGame();

  placeSettlement(vertex: VertexId): Promise<GameState> {
    const state = copyAsMutable(this.state);
    state.settlements.push({
      location: vertex,
      player: this.state.turn.player,
      name: "SETTLEMENT",
    });
    this.state = state;
    const promise = new Promise<GameState>(resolve => {
      setTimeout(() => {
        resolve(this.state);
      }, 1000);
    })
    return promise;
  }

  // TODO: Make Async
  getState(): GameState {
    return this.state;
  }
}

export interface MutableGameState {
  readonly board: BoardLayout;
  turn: GameTurn | InitialPlacementTurn;
  players: [PlayerYou, PlayerOther, PlayerOther, PlayerOther];
  robber: HexId;
  readonly settlements: Settlement[];
  readonly roads: Road[];
  readonly cities: City[];
}

function copyAsMutable(state: GameState): MutableGameState {
  return {
    board: state.board,
    turn: state.turn,
    players: [
      state.players[0],
      state.players[1],
      state.players[2],
      state.players[3],
    ],
    robber: state.robber,
    settlements: Array.from(state.settlements),
    roads: Array.from(state.roads),
    cities: Array.from(state.cities),
  };
}

export const SERVER = new FakeServer();
