import { ControlManager } from "../control/manager";
import { EdgeId, VertexId } from "../server/types";
import { GameState } from "./state";

export interface TurnOrchestrator {
  onVertexClicked(vertex: VertexId): void;
  onEdgeClicked(edge: EdgeId): void;
  startOrContinue(): void;
}

class UninitializedTurnOrchestrator implements TurnOrchestrator {
  onVertexClicked(vertex: VertexId): void {
    throw new Error("Turn orchestrator not initialized");
  }
  onEdgeClicked(edge: EdgeId): void {
    throw new Error("Turn orchestrator not initialized");
  }
  startOrContinue(): void {
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

  startOrContinue() {
    this.showAllOpenVertecies();
  }

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
      this.showAllOpenVertecies();
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

  private showAllOpenVertecies() {
    for (const vertex of this.game.getVertecies()) {
      if (this.game.isBuildingAllowed(vertex)) {
        if (!this.control.getVertex(vertex)) {
          // TODO(danielglasgow): Fix this bad controlflow
          continue; 
        }
        this.control.getVertex(vertex)?.showIndicator();
      }
    }
  }
}
