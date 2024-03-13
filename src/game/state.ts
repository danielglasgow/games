import { createContext } from "react";
import {
  Building,
  City,
  GameTurn,
  HexId,
  GameState as ServerGameState,
  Settlement,
  VertexId,
  isInitialPlacementTurn,
  isRoad
} from "../server/types";
import { Turn } from "./turn";


export interface GameState {
  getFixedBuilding(vertex: VertexId): Building | undefined;
  getPendingBuilding(vertex: VertexId): Building | undefined;
  isBuildingAllowed(vertex: VertexId): boolean;
  isEmpty(vertex: VertexId): boolean;
  isVertexPlacementActive(): boolean;
}

export function createGameState(state: ServerGameState): GameState {
  return new ServerGameStateWrapper(state);
}

export function createUninitializedGameState(): GameState {
  return new UninitiliazedGameState();
}

class UninitiliazedGameState implements GameState {
  getFixedBuilding(vertex: VertexId): Building | undefined {
    throw new Error("GameState not initialized");
  }
  getPendingBuilding(vertex: VertexId): Building | undefined {
    throw new Error("GameState not initialized");
  }
  isBuildingAllowed(vertex: VertexId): boolean {
    throw new Error("GameState not initialized");
  }
  isEmpty(vertex: VertexId): boolean {
    throw new Error("GameState not initialized");
  }
  isVertexPlacementActive(): boolean {
    throw new Error("GameState not initialized");
  }
}


class ServerGameStateWrapper implements GameState {
  constructor(private readonly state: ServerGameState) {}

  getTurn() {
    return this.state.turn;
  }

  getFixedBuilding(vertex: VertexId): Building | undefined {
    const settlement = this.state.settlements.find((s) =>
      s.location.equals(vertex)
    );
    const city = this.state.cities.find((c) => c.location.equals(vertex));
    if (settlement && city) {
      throw new Error(
        "Illegal board state, found both settlement and city on vertex: " +
          vertex
      );
    }
    if (settlement) {
      return "SETTLEMENT";
    }
    if (city) {
      return "CITY";
    }
  }

  getPendingBuilding(vertex: VertexId): Building | undefined {
    return new Turn(this.state).getPendingPlacement(vertex)?.name;
  }

  isBuildingAllowed(vertex: VertexId) {
    if (vertex.hex.row === 0) {
      return false;
    }
    if (vertex.hex.col === 0) {
      return vertex.side === "RIGHT";
    }
    if (vertex.hex.col === this.state.board.columns.length - 1) {
      return vertex.side === "LEFT";
    }
    return vertex.adjacentVertecies().every((v) => this.isEmpty(v));
  }

  isEmpty(vertex: VertexId) {
    return (
      this.state.cities.every((c) => !c.location.equals(vertex)) &&
      this.state.settlements.every((s) => !s.location.equals(vertex))
    );
  }

  isVertexPlacementActive() {
    const turn = this.state.turn;
    if (isInitialPlacementTurn(turn)) {
      return turn.phase === "PLACE_SETTLEMENT";
    }
    return turn.pendingAction === "PLACE_SETTLEMENT";
  }
}

function getPendingBuildings(turn: GameTurn) {
  const buildings: Array<Settlement | City> = [];
  for (const building of turn.pendingPlacements) {
    if (!isRoad(building)) {
      buildings.push(building);
    }
  }
  return buildings;
}
