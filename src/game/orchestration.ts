import { ControlManager } from "../control/manager";
import { EdgeId, VertexId } from "../server/types";
import { GameState } from "./state";

export interface TurnOrchestrator {
  onVertexClicked(vertex: VertexId): void;
  onEdgeClicked(edge: EdgeId): void;
}

class UninitializedTurnOrchestrator implements TurnOrchestrator {
  onVertexClicked(vertex: VertexId): void {
    throw new Error("Turn orchestrator not initialized");
  }
  onEdgeClicked(edge: EdgeId): void {
    throw new Error("Turn orchestrator not initialized");
  }
}

export function createUninitializedTurnOrchestrator(): TurnOrchestrator {
  return new UninitializedTurnOrchestrator();
}

export class InitialPlacementOrchestrator implements TurnOrchestrator {
  constructor(private control: ControlManager, private game: GameState) {}

  private settlement?: VertexId;
  private road?: EdgeId;

  onVertexClicked(vertex: VertexId) {
    if (!this.settlement) {
      this.control.hideAllVertexIndicators();
      this.control.getVertex(vertex).setBuilding("SETTLEMENT");
      this.settlement = vertex;
      for (const edge of vertex.adjacentEdges()) {
        this.control.getEdge(edge).showIndicator();
      }
    } else if (this.settlement.equals(vertex)) {
      this.settlement = undefined;
      this.control.getVertex(vertex).removeBuilding();
      for (const vertex of this.game.getVertecies()) {
        if (this.game.isBuildingAllowed(vertex)) {
          if (!this.control.getVertex(vertex)) {
            console.log(vertex.toString());
          }
          this.control.getVertex(vertex)?.showIndicator();
        }
      }
      for (const edge of vertex.adjacentEdges()) {
        this.control.getEdge(edge).hideIndicator();
      }
    }
  }

  onEdgeClicked(edge: EdgeId) {
    if (!this.road) {
      this.road = edge;
    } else if (this.road.equals(edge)) {
      this.road = undefined;
    }
  }
}
