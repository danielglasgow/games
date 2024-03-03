import {
  BoardLayout,
  HexId,
  HexLayout,
  VertexId
} from "../server/types";



export class BoardStateUtility {
  constructor(
    private readonly board: BoardLayout,
  ) {}

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
