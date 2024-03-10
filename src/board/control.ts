import { Dispatch, SetStateAction } from "react";
import { Controller, events } from "../control/controller";
import { Building, EdgeId, VertexId } from "../server/types";
import { VertexControl } from "./vertex";

type BoardState = {}

export class BoardControl extends Controller {
  private readonly vertecies: {[k: string]: VertexControl} = {}
  constructor(
    parent: Controller,
    private readonly state: BoardState,
    private readonly setState: Dispatch<SetStateAction<BoardState>>
  ) {
    super(parent);
    this.listen(events.VERTEX_CLICKED, (vertex: VertexId) => {
      this.nextVertexSelectionResolver(vertex);
      return true;
    });
  }

  private nextVertexSelectionResolver: (vertex: VertexId) => void = () => {};

  nextVertexSelection(): Promise<VertexId> {
    return new Promise(resolve => {
      this.nextVertexSelectionResolver = resolve;
    });
  }

  clearVertex(vertex: VertexId) {}

  setBuilding(vertx: VertexId, building: Building) {}

  showAllVertexIndicators() {
    const vertecies = Object.keys(this.vertecies).map(k => this.vertecies[k]);
    for (const vertex of vertecies) {
      vertex.showIndicator();
    }
  }

  showVertexIndicators(vertecies: VertexId[]) {}

  hideVertexIndicators() {
    for (const k of Object.keys(this.vertecies)) {
      this.vertecies[k].hideIndicator();
    }
  }

  showAllEdgeIndicators() {}

  showEdgeInidcators(edges: EdgeId[]) {}

  hideEdgeIndicators() {}

  registerVertex(location: VertexId, control: VertexControl) {
    this.vertecies[toString(location)] = control;
  }
}

function toString(vertex: VertexId) {
  return `${vertex.location.row},${vertex.location.col}:${vertex.side}`;
}