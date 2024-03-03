import { Dispatch, SetStateAction } from "react";
import { Controller, events } from "../control/controller";
import { Building, EdgeId, VertexId } from "../server/types";

type BoardState = {}

export class BoardControl extends Controller {
  constructor(
    parent: Controller,
    private readonly state: BoardState,
    private readonly setState: Dispatch<SetStateAction<BoardState>>
  ) {
    super(parent);
    /*this.listen(events.VERTEX_CLICKED, (vertex: VertexId) => {
      this.nextVertexSelectionResolver(vertex);
      return true;
    });*/
  }

  private nextVertexSelectionResolver: (vertex: VertexId) => void = () => {};

  nextVertexSelection(): Promise<VertexId> {
    return new Promise(resolve => {
      this.nextVertexSelectionResolver = resolve;
    });
  }

  clearVertex(vertex: VertexId) {}

  setBuilding(vertx: VertexId, building: Building) {}

  showAllVertexIndicators() {}

  showVertexIndicators(vertecies: VertexId[]) {}

  hideVertexIndicators() {}

  showAllEdgeIndicators() {}

  showEdgeInidcators(edges: EdgeId[]) {}

  hideEdgeIndicators() {}
}