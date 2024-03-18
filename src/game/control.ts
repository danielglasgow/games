import { Dispatch, SetStateAction } from "react";
import { EdgeLocation, VertexLocation } from "../board";
import { EdgeControl } from "../board/edge";
import { VertexControl } from "../board/vertex";
import { SERVER } from "../server/fake";
import { AppState } from "../types";
import { TurnOrchestrator } from "./orchestration";

export class GameControl {
  private readonly vertecies: { [k: string]: VertexControl } = {};
  private readonly edges: { [k: string]: EdgeControl } = {};
  private sync: Dispatch<SetStateAction<AppState>> = () => {
    throw new Error(
      "Cannot sync app state with server, app state not initialized."
    );
  };

  private turn?: TurnOrchestrator;

  registerTurn(turn: TurnOrchestrator) {
    this.turn = turn;
  } 

  registerVertex(control: VertexControl) {
    this.vertecies[control.location.key()] = control;
  }

  registerEdge(control: EdgeControl) {
    this.edges[control.location.key()] = control;
  }

  registerSync(sync: Dispatch<SetStateAction<AppState>>) {
    this.sync = sync;
  }

  hideAllVertexIndicators() {
    for (const k of Object.keys(this.vertecies)) {
      this.vertecies[k].hideIndicator();
    }
  }

  getVertex(vertex: VertexLocation) {
    return this.vertecies[vertex.key()];
  }

  getEdge(edge: EdgeLocation) {
    return this.edges[edge.key()];
  }

  // Consider making this event driven
  onVertexClick(vertex: VertexLocation) {
    console.log("VERTEX CLICKED: " + vertex.key());
    this.turn!.onVertexClicked(vertex);
  }

  // In my latest thinking each "action" is atomic whereas placing a settlement
  // without confimration just notifies the server which can in turn notify other clients.
  private notifyPendingSettelment(vertex: VertexLocation) {
    // TODO(danielglasgow)
  }

  private async commit(vertex: VertexLocation) {
    const newState = await SERVER.placeSettlement(vertex);
    console.log("GOT SERVER STATE UPDATE");
    console.log(newState.settlements);
    // TODO(danielglasgow): Compare states and show warning if they do not match
    this.sync({ server: newState, isLocked: false });
  }

  showAdjacentVertexIndicators(vertex: VertexLocation) {
    this.hideAllVertexIndicators();
    for (const v of vertex.adjacentVertecies()) {
      const control = this.vertecies[v.key()];
      if (control) {
        control.showIndicator();
      }
    }
  }
}
