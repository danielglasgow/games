import {
  City,
  OneInitialPlacementTurn,
  GameState as ServerGameState,
  Settlement,
  TwoInitialPlacementTurn,
  VertexId,
  isGameTurn,
  isRoad,
} from "../server/types";

export class Turn {
  constructor(private readonly state: ServerGameState) {}

  getPendingPlacement(vertexId: VertexId): Settlement | City | undefined {
    const pendingPlacementsOnVertecies: Array<Settlement | City> = [];
    if (isGameTurn(this.state.turn)) {
      for (const building of this.state.turn.pendingPlacements) {
        if (isRoad(building)) {
          continue;
        }
        pendingPlacementsOnVertecies.push(building);
      }
    }
    const settlements = [
      (this.state.turn as TwoInitialPlacementTurn).pendingPlacements.first
        ?.settlement,
      (this.state.turn as TwoInitialPlacementTurn).pendingPlacements.second
        ?.settlement,
      (this.state.turn as OneInitialPlacementTurn).pendingPlacements.settlement,
    ];
    for (const settlment of settlements) {
      if (settlment) {
        pendingPlacementsOnVertecies.push(settlment);
      }
    }
    return pendingPlacementsOnVertecies.find((s) =>
      s.location.equals(vertexId)
    );
  }
}
