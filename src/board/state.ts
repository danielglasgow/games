import {
  BoardLayout,
  HexId,
  HexLayout,
  VertexId,
  isResource,
} from "../server/types";

import { Hex, HexState } from "./types";

type IndicatorState = {
  vertex: boolean;
  roads: boolean;
};

export class BoardState {
  constructor(
    private readonly board: BoardLayout,
    private indicators: IndicatorState
  ) {}

  update(state: {
    board?: BoardLayout;
    indicators?: IndicatorState;
  }): BoardState {
    if (!state.board) {
      state.board = this.board;
    }
    if (!state.indicators) {
      state.indicators = this.indicators;
    }
    return new BoardState(state.board, state.indicators);
  }

  columns(): Array<Array<Hex>> {
    return this.board.columns.map((column) => {
      return column.map((hex) => this.toHex(hex));
    });
  }

  private toHex(hex: HexLayout): Hex {
    const { left, right } = this.getVertecies(hex);
    const state: HexState = {
      leftVertex: left == null ? "CLOSED" : "OPEN",
      rightVertex: right == null ? "CLOSED" : "OPEN",
      isBlocked: false,
      showVertexIndicators: this.indicators.vertex,
      showEdgeIndicators: false,
    };
    if (isResource(hex)) {
      return { state, layout: hex };
    }
    if (hex.geography === "DESERT") {
      return { state, layout: hex };
    }
    if (hex.geography === "OCEAN") {
      return { state, layout: hex };
    }
    throw new Error("Illegal state: unknown tile type");
  }

  private getVertecies(hex: HexLayout): {
    left: VertexId | null;
    right: VertexId | null;
  } {
    const vertecies = this.board.vertices.filter((vertex) =>
      isSameLocation(vertex, hex)
    );
    if (vertecies.length > 2) {
      throw new Error("Should not be more than two vertecies per hex");
    }
    return {
      left: vertecies.find((vertex) => vertex.side === "LEFT") || null,
      right: vertecies.find((vertex) => vertex.side === "RIGHT") || null,
    };
  }
}

// TODO: Put in shared location
function isSameLocation(a: { location: HexId }, b: { location: HexId }) {
  return a.location.row === b.location.row && a.location.col === b.location.col;
}
