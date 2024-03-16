import { VertexControl } from "../board/vertex";
import { GameState, createUninitializedGameState } from "../game/state";
import { EdgeId, VertexId } from "../server/types";
import {SERVER} from "../server/fake";
import { Dispatch, SetStateAction } from "react";
import { AppState } from "../types";
import { InitialPlacementOrchestrator, TurnOrchestrator, createUninitializedTurnOrchestrator } from "../game/orchestration";
import { EdgeControl } from "../board/edge";

export class ControlManager {
  private readonly vertecies: { [k: string]: VertexControl } = {};
  private readonly edges: {[k: string]: EdgeControl} = {};
  private game: GameState = createUninitializedGameState(); 
  private sync: Dispatch<SetStateAction<AppState>> = () => {
    throw new Error("Cannot sync app state with server, app state not initialized.");
  } 
  private turn: TurnOrchestrator = createUninitializedTurnOrchestrator(); 

  registerGame(game: GameState) {
    this.game = game;
    this.turn = new InitialPlacementOrchestrator(this, game);
  }

  registerVertex(control: VertexControl) {
    this.vertecies[control.location.toString()] = control;
  }

  registerEdge(location: EdgeId, control: EdgeControl) {
    this.edges[location.toString()] = control;
  }

  registerSync(sync: Dispatch<SetStateAction<AppState>>) {
    this.sync = sync;
  }

  startOrContinueTurn() {
    console.log("START OR CONTINUE");
    this.turn.startOrContinue();
  }

  hideAllVertexIndicators() {
    for (const k of Object.keys(this.vertecies)) {
      this.vertecies[k].hideIndicator();
    }
  }

  getVertex(vertex: VertexId) {
    return this.vertecies[vertex.toString()];
  }

  getEdge(edge: EdgeId) {
    return this.edges[edge.toString()]
  }

  // Consider making this event driven
  onVertexClick(vertex: VertexId) {
    console.log("VERTEX CLICKED: " + vertex.toString());
    this.turn.onVertexClicked(vertex);
   
  }

  // In my latest thinking each "action" is atomic whereas placing a settlement 
  // without confimration just notifies the server which can in turn notify other clients.
  private notifyPendingSettelment(vertex: VertexId) {
    // TODO(danielglasgow)
  }

  private async commit(vertex: VertexId) {
    const newState =  await SERVER.placeSettlement(vertex); 
    console.log("GOT SERVER STATE UPDATE");
    console.log(newState.settlements);
    // TODO(danielglasgow): Compare states and show warning if they do not match
    this.sync({server: newState, isLocked: false});
  }

  showAdjacentVertexIndicators(vertex: VertexId) {
    this.hideAllVertexIndicators();
    for (const v of vertex.adjacentVertecies()) {
      const control = this.vertecies[v.toString()];
      if (control) {
        control.showIndicator();
      }
    }
  }
}

// TODO(danielglasgow): Refactor to useContext (rather than globale singleton)
export const CONTROL_MANAGER = new ControlManager();
