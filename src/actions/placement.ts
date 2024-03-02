import { GameState, VertexId } from "../server/types";
import {SERVER} from "../server/fake";

export class PlacementAction {
  private vertex?: VertexId;

  startConfirmPlacement(vertex: VertexId) {
    this.vertex = vertex;
  }

  confirm(): Promise<GameState> {
    if (!this.vertex) {
      throw new Error('Attempt to place settlement with no location');
    }
    return SERVER.placeSettlement(this.vertex);
  }

  
}