import { VertexControl } from "../board/vertex";
import { GameState, createUninitializedGameState } from "../game/state";
import { VertexId } from "../server/types";
import {SERVER} from "../server/fake";
import { Dispatch, SetStateAction } from "react";
import { AppState } from "../types";
import { InitialPlacementOrchestrator, TurnOrchestrator, createUninitializedTurnOrchestrator } from "../game/orchestration";

export class ControlManager {
  private readonly vertecies: { [k: string]: VertexControl } = {};
  private game: GameState = createUninitializedGameState(); 
  private sync: Dispatch<SetStateAction<AppState>> = () => {
    throw new Error("Cannot sync app state with server, app state not initialized.");
  } 
  private turn: TurnOrchestrator = createUninitializedTurnOrchestrator(); 

  registerGame(game: GameState) {
    this.game = game;
    this.turn = new InitialPlacementOrchestrator(this, game);
  }

  registerOpenVertex(location: VertexId, control: VertexControl) {
    this.vertecies[location.toString()] = control;
  }

  registerSync(sync: Dispatch<SetStateAction<AppState>>) {
    this.sync = sync;
  }

  hideAllVertexIndicators() {
    for (const k of Object.keys(this.vertecies)) {
      this.vertecies[k].hideIndicator();
    }
  }

  getVertex(vertex: VertexId) {
    return this.vertecies[vertex.toString()];
  }

  // Consider making this event driven
  onVertexClick(vertex: VertexId) {
    console.log("VERTEX CLICKED: " + vertex.toString());
    this.turn.onVertexClicked(vertex);
   
  }

  private async reportPlaceSettlement(vertex: VertexId) {
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

export const CONTROL_MANAGER = new ControlManager();
