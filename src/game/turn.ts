import { Dispatch, SetStateAction } from "react";
import { EdgeLocation, VertexLocation } from "../board";
import { AppState } from "../types";
import { Control } from "./control";
import { GameState } from "./state";

export interface GameTurn {
  onVertexClicked(vertex: VertexLocation): void;
  onEdgeClicked(edge: EdgeLocation): void;
  startOrContinue(): void;
}

abstract class BaseGameTurn implements GameTurn {
  constructor(
    private readonly setAppState: Dispatch<SetStateAction<AppState>>
  ) {}

  notify() {
    // TODO(danielglasgow): Notify the server of a non-binding action
  }
  commit(): Promise<void> {
    // TODO(danielglasgow): Commit an action to the server and update the app state with the response
    return Promise.resolve();
  }

  abstract onVertexClicked(vertex: VertexLocation): void;
  abstract onEdgeClicked(edge: EdgeLocation): void;
  abstract startOrContinue(): void;
}

export class InitialPlacement extends BaseGameTurn {
  constructor(
    private readonly state: GameState,
    private readonly control: Control,
    setAppState: Dispatch<SetStateAction<AppState>>
  ) {
    super(setAppState);
  }

  private settlement?: VertexLocation;
  private road?: EdgeLocation;

  startOrContinue() {
    this.showAllOpenVertecies();
  }

  onVertexClicked(vertex: VertexLocation) {
    if (!this.settlement) {
      this.control.getVertecies().forEach(vertex => vertex.hideIndicator());
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
