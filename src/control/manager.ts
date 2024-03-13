import { VertexControl } from "../board/vertex";
import { GameState, createUninitializedGameState } from "../game/state";
import { VertexId } from "../server/types";

export class ControlManager {
  private readonly vertecies: { [k: string]: VertexControl } = {};
  private game: GameState = createUninitializedGameState(); 

  registerGame(game: GameState) {
    this.game = game;
  }

  registerOpenVertex(location: VertexId, control: VertexControl) {
    this.vertecies[location.toString()] = control;
  }

  hideAllVertexIndicators() {
    for (const k of Object.keys(this.vertecies)) {
      this.vertecies[k].hideIndicator();
    }
  }

  // Consider making this event driven
  onVertexClick(vertex: VertexId) {
    this.vertecies[vertex.toString()].hideIndicator();
    this.vertecies[vertex.toString()].setBuilding("SETTLEMENT");
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
