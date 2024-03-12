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

export class GameState {
  constructor(private readonly state: ServerGameState) {}

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
    const turn = this.state.turn;
    if (isInitialPlacementTurn(turn)) {
      if (vertex.equals(turn.pendingPlacements.settlement)) {
        return "SETTLEMENT";
      }
    } else {
      return getPendingBuildings(turn).find((building) =>
        building.location.equals(vertex)
      )?.name;
    }
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
