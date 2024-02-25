import { EdgeId, HexId, HexLayout, VertexId } from "../server/types";

export type VertexState = "SETTLEMENT" | "CITY" | "OPEN" | "CLOSED";

export interface HexState {
  leftVertex: VertexState;
  rightVertex: VertexState;
  isBlocked: boolean;
  showVertexIndicators: boolean;
}

export interface Hex {
  readonly state: HexState;
  readonly layout: HexLayout;
}

export interface BoardControl {
  readonly clickVertexIndicator: (vertext: VertexId) => void;
  readonly clickEdgeIndicator: (road: EdgeId) => void;
  readonly clickHex: (hex: HexId) => void;
}
