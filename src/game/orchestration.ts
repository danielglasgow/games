import { EdgeLocation, VertexLocation } from "../board";
import { GameControl } from "./control";
import { GameState } from "./state";

export interface TurnOrchestrator {
  onVertexClicked(vertex: VertexLocation): void;
  onEdgeClicked(edge: EdgeLocation): void;
  startOrContinue(): void;
}

class UninitializedTurnOrchestrator implements TurnOrchestrator {
  onVertexClicked(vertex: VertexLocation): void {
    throw new Error("Turn orchestrator not initialized");
  }
  onEdgeClicked(edge: EdgeLocation): void {
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
  constructor(private state: GameState, private control: GameControl) {}

  private settlement?: VertexLocation;
  private road?: EdgeLocation;

  startOrContinue() {
    this.showAllOpenVertecies();
  }

  onVertexClicked(vertex: VertexLocation) {
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

  onEdgeClicked(edge: EdgeLocation) {
    if (!this.road) {
      this.road = edge;
    } else if (this.road.equals(edge)) {
      this.road = undefined;
    }
  }

  private showAllOpenVertecies() {
    for (const vertex of this.state.getVertecies()) {
      if (this.state.isBuildingAllowed(vertex)) {
        if (!this.control.getVertex(vertex)) {
          // TODO(danielglasgow): Fix this bad controlflow
          continue; 
        }
        this.control.getVertex(vertex)?.showIndicator();
      }
    }
  }
}
