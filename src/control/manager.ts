import { VertexControl } from "../board/vertex";
import { VertexId } from "../server/types";

export class ControlManager {
  private readonly vertecies: { [k: string]: VertexControl } = {};

  registerOpenVertex(location: VertexId, control: VertexControl) {
    this.vertecies[location.toString()] = control;
  }

  hideAllVertexIndicators() {
    for (const k of Object.keys(this.vertecies)) {
      this.vertecies[k].hideIndicator();
    }
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
