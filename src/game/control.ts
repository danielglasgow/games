import { EdgeLocation, VertexLocation } from "../board";
import { EdgeControl } from "../board/edge";
import { VertexControl } from "../board/vertex";

export interface GameControl {
  attachVertex(control: VertexControl): void;
  attachEdge(control: EdgeControl): void;
}

export interface Control {
  getVertex(location: VertexLocation): VertexControl;
  getVertecies(): VertexControl[];
  getEdge(location: EdgeLocation): EdgeControl;
  getEdges(): EdgeControl[];
}

export class ControlRegistry implements Control, GameControl {
  private readonly vertecies: { [k: string]: VertexControl } = {};
  private readonly edges: { [k: string]: EdgeControl } = {};

  attachVertex(control: VertexControl) {
    this.vertecies[control.location.key()] = control;
  }

  attachEdge(control: EdgeControl) {
    this.edges[control.location.key()] = control;
  }

  getVertex(vertex: VertexLocation) {
    return this.vertecies[vertex.key()];
  }

  getVertecies() {
    return Object.keys(this.vertecies).map((k) => this.vertecies[k]);
  }

  getEdge(edge: EdgeLocation) {
    return this.edges[edge.key()];
  }

  getEdges() {
    return Object.keys(this.edges).map((k) => this.edges[k]);
  }
}
