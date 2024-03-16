import { BoardLayout, EdgeId, HexId, VertexId } from "../server/types";

export class HexLocation {
  readonly row: number;
  readonly col: number;

  constructor(id: HexId) {
    this.row = id.row;
    this.col = id.col;
  }

  equals(other?: HexLocation) {
    return other && this.row === other.row && this.col === other.col;
  }

  key() {
    return `${this.row},${this.col}`;
  }
}

export class VertexLocation {
  readonly hex: HexLocation;
  readonly side: "LEFT" | "RIGHT";
  constructor(id: VertexId) {
    this.hex = new HexLocation(id.hex);
    this.side = id.side;
  }

  equals(other?: VertexLocation | EdgeLocation) {
    if (!VertexLocation.isInstanceOf(other)) {
      return false;
    }
    return (
      this.hex.row === other.hex.row &&
      this.hex.col === other.hex.col &&
      this.side === other.side
    );
  }

  key() {
    return `${this.hex.row},${this.hex.col}:${this.side}`;
  }

  isExteriorOf(board: BoardLayout) {
    if (this.hex.row === 0) {
      return true;
    }
    if (this.hex.col === 0) {
      return this.side === "LEFT";
    }
    if (this.hex.col === board.columns.length - 1) {
      return this.side === "RIGHT";
    }
    return false;
  }

  adjacentHexes(): { location: HexLocation }[] {
    const { row, col } = this.hex;
    switch (this.side) {
      // TODO(danielglasgow):
      // [sameHex(), adjacentColumnUpHex(), adjacentColumnDownHex()]
      // Probably can reuse with vertex logic: e.g for vertex get a hex,
      // and then ask for it's left or right vertex.
      case "LEFT":
        return [
          { location: new HexLocation({ row: row, col: col }) },
          { location: new HexLocation({ row: row, col: col - 1 }) },
          { location: new HexLocation({ row: row - 1, col: col }) },
        ];
      case "RIGHT":
        return [
          { location: new HexLocation({ row: row, col: col }) },
          { location: new HexLocation({ row: row - 1, col: col }) },
          { location: new HexLocation({ row: row, col: col + 1 }) },
        ];
    }
  }

  adjacentVertecies() {
    return [
      this.sameHexOtherSide(),
      this.adjacentColumnUp(),
      this.adjacentColumnDown(),
    ];
  }

  adjacentEdges() {
    return [
      new EdgeLocation({ hex: this.hex, position: "TOP" }),
      new EdgeLocation({ hex: this.hex, position: this.side }),
      new EdgeLocation({
        hex: this.adjacentColumnDown().hex,
        position: this.oppositeSide(),
      }),
    ];
  }

  private sameHexOtherSide() {
    const hex = new HexLocation({ row: this.hex.row, col: this.hex.col });
    return new VertexLocation({ hex, side: this.oppositeSide() });
  }

  private adjacentColumnUp() {
    const up = this.adjacentColumnIsBigger() ? 1 : 0;
    const hex = new HexLocation({
      row: this.hex.row + up,
      col: this.adjacentColumn(),
    });
    return new VertexLocation({ hex, side: this.oppositeSide() });
  }

  private adjacentColumnDown() {
    const down = this.adjacentColumnIsBigger() ? 0 : -1;
    const hex = new HexLocation({
      row: this.hex.row + down,
      col: this.adjacentColumn(),
    });
    return new VertexLocation({ hex, side: this.oppositeSide() });
  }

  private adjacentColumn() {
    switch (this.side) {
      case "LEFT":
        return this.hex.col - 1;
      case "RIGHT":
        return this.hex.col + 1;
    }
  }

  oppositeSide() {
    switch (this.side) {
      case "LEFT":
        return "RIGHT";
      case "RIGHT":
        return "LEFT";
    }
  }

  private adjacentColumnIsBigger() {
    const side = this.side;
    if (side === "RIGHT") {
      return this.hex.col < 3;
    }
    if (side === "LEFT") {
      return this.hex.col > 3;
    }
  }

  static isInstanceOf(x: unknown): x is VertexLocation {
    if (!x) {
      return false;
    }
    return (x as VertexLocation).constructor.name === "VertexLocation";
  }
}

export class EdgeLocation {
  readonly hex: HexLocation;
  readonly position: "LEFT" | "RIGHT" | "TOP";
  constructor(id: EdgeId) {
    this.hex = new HexLocation(id.hex);
    this.position = id.position;
  }

  equals(other?: VertexLocation | EdgeLocation) {
    if (!EdgeLocation.isInstanceOf(other)) {
      return false;
    }
    return (
      this.hex.row === other.hex.row &&
      this.hex.col === other.hex.col &&
      this.position === other.position
    );
  }

  key() {
    return `${this.hex.row},${this.hex.col}:${this.position}`;
  }

  static isInstanceOf(x: unknown): x is EdgeLocation {
    if (!x) {
      return false;
    }
    return (x as EdgeLocation).constructor.name === "EdgeLocation";
  }
}
