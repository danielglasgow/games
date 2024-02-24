import { shuffleArray } from "../common/util";
import {
  City,
  Desert,
  Hex,
  HexId,
  HexState,
  LandTile,
  Number,
  Port,
  Resource,
  Road,
  Settlement,
  Tile,
  TileHex,
  VertexId,
  isResourceHex,
} from "./types";

const TILES: ReadonlyArray<Resource | Desert> = Object.freeze([
  "ORE",
  "ORE",
  "ORE",
  "BRICK",
  "BRICK",
  "BRICK",
  "WHEAT",
  "WHEAT",
  "WHEAT",
  "WHEAT",
  "WOOD",
  "WOOD",
  "WOOD",
  "WOOD",
  "SHEEP",
  "SHEEP",
  "SHEEP",
  "SHEEP",
  "DESERT",
]);

const NUMBERS: Readonly<Number[]> = Object.freeze([
  "TWO",
  "THREE",
  "THREE",
  "FOUR",
  "FOUR",
  "FIVE",
  "FIVE",
  "SIX",
  "SIX",
  "EIGHT",
  "EIGHT",
  "NINE",
  "NINE",
  "TEN",
  "TEN",
  "ELEVEN",
  "ELEVEN",
  "TWELVE",
]);

export function newRandomBoard(): BoardState {
  const numbers = shuffleArray(Array.from(NUMBERS));
  const builder = new BoardLayoutBuilder([4, 5, 6, 7, 6, 5, 4]);
  for (const resourceOrDesert of shuffleArray(Array.from(TILES))) {
    if (resourceOrDesert === "DESERT") {
      builder.add("DESERT");
    } else {
      const resource: Resource = resourceOrDesert;
      const number = numbers.pop();
      if (!number) {
        throw Error("Could not initlize board. Number not found");
      }
      builder.add({ resource, number });
    }
  }
  return builder.build();
}

interface BoardLayout {
  readonly columns: ReadonlyArray<ReadonlyArray<TileHex>>;
  readonly vertices: ReadonlyArray<VertexId>;
  readonly ports: ReadonlyArray<Port>;
}

class BoardLayoutBuilder {
  constructor(private readonly columnSizes: number[]) {
    if (columnSizes.length < 3) {
      throw new Error(
        "Must have at least three columns in order to surround with ocean"
      );
    }
  }

  private vertices: VertexId[] = [];
  private columns: ReadonlyArray<TileHex>[] = [];
  private currentColumnIndex: number = 1;
  private currentColumn: TileHex[] = [];
  private currentRow: number = 0;

  add(tile: LandTile) {
    if (this.currentColumnIndex >= this.columnSizes.length - 1) {
      throw new Error("Illegal state: attempting to add to full board");
    }
    if (this.currentRow === 0) {
      this.push("OCEAN");
    }
    this.push(tile);
    if (this.currentRow === this.currentColumnSize() - 1) {
      this.push("OCEAN");
      this.startNextColumn();
    }
  }

  build() {
    if (this.currentColumnIndex !== this.columnSizes.length - 1) {
      throw new Error("Illegal state: board is not full");
    }
    if (this.currentRow !== 0) {
      throw new Error("Illegal state: last column is not empty");
    }
    this.columns.unshift(this.oceanColumn(0, this.columnSizes[0]));
    this.columns.push(
      this.oceanColumn(this.currentColumnIndex, this.currentColumnSize())
    );
    const landTiles = this.columns
      .flatMap((x) => x)
      .filter((hex) => isResourceHex(hex) || hex.geography === "DESERT");
    const landVertices: VertexId[] = [];
    console.log("BUILD VERTEXES");
    for (const vertex of this.vertices) {
      const adjacentHexes = getAdjacentHexes(vertex);
      if (vertex.col === 1 && vertex.row === 4) {
        console.log(vertex);
        console.log(adjacentHexes);
      }
      for (const hex of adjacentHexes) {
        if (
          landTiles.some(
            (tile) =>
              tile.location.row === hex.row && tile.location.col === hex.col
          )
        ) {
          landVertices.push(vertex);
          break;
        }
      }
    }
    return new BoardState({
      columns: Object.freeze(this.columns),
      ports: [],
      vertices: Object.freeze(landVertices),
    });
  }

  private push(tile: Tile) {
    const location = { row: this.currentRow, col: this.currentColumnIndex };
    if (tile == "DESERT") {
      this.currentColumn.push({ geography: "DESERT", location });
    } else if (tile == "OCEAN") {
      this.currentColumn.push({ geography: "OCEAN", location });
    } else {
      this.currentColumn.push({ location, ...tile });
    }
    this.vertices.push({
      row: this.currentRow,
      col: this.currentColumnIndex,
      side: "LEFT",
    });
    this.vertices.push({
      row: this.currentRow,
      col: this.currentColumnIndex,
      side: "RIGHT",
    });
    this.currentRow++;
  }

  private currentColumnSize() {
    return this.columnSizes[this.currentColumnIndex];
  }

  private startNextColumn() {
    this.columns.push(Object.freeze(this.currentColumn));
    this.currentColumnIndex++;
    this.currentColumn = [];
    this.currentRow = 0;
  }

  private oceanColumn(columnIndex: number, size: number) {
    const column: TileHex[] = [];
    for (let i = 0; i < size; i++) {
      column.push({
        geography: "OCEAN",
        location: { row: i, col: columnIndex },
      });
      this.vertices.push({
        row: i,
        col: columnIndex,
        side: "LEFT",
      });
      this.vertices.push({
        row: i,
        col: columnIndex,
        side: "RIGHT",
      });
    }
    return Object.freeze(column);
  }
}

function getAdjacentHexes(vertex: VertexId): HexId[] {
  const { row, col } = vertex;
  switch (vertex.side) {
    case "LEFT":
      return [
        { row: row, col: col },
        { row: row, col: col - 1 },
        { row: row - 1, col: col },
      ];
    case "RIGHT":
      return [
        { row: row, col: col },
        { row: row - 1, col: col },
        { row: row, col: col + 1 },
      ];
  }
}

export class BoardState {
  private readonly layout: BoardLayout;
  private robber: HexId = { row: 0, col: 0 };
  private settlements: Settlement[] = [];
  private roads: Road[] = [];
  private cities: City[] = [];

  constructor(layout: BoardLayout) {
    this.layout = layout;
  }

  columns(): Array<Array<Hex>> {
    return this.layout.columns.map((column) => {
      return column.map((tile) => this.toHex(tile));
    });
  }

  toHex(tile: TileHex): Hex {
    const left = this.layout.vertices.filter(
      (vertex) => vertex.side === "LEFT"
    );
    const right = this.layout.vertices.filter(
      (vertex) => vertex.side === "RIGHT"
    );
    const state: HexState = {
      leftVertex: left.some(
        (vertex) =>
          vertex.row === tile.location.row && vertex.col === tile.location.col
      )
        ? "OPEN"
        : "CLOSED",
      rightVertex: right.some(
        (vertex) =>
          vertex.row === tile.location.row && vertex.col === tile.location.col
      )
        ? "OPEN"
        : "CLOSED",
      isBlocked: false,
    };

    if (isResourceHex(tile)) {
      return { state, tile, location: tile.location };
    }
    if (tile.geography === "DESERT") {
      return { state, tile: "DESERT" , location: tile.location};
    }
    if (tile.geography === "OCEAN") {
      return { state, tile: "OCEAN" , location: tile.location};
    }
    throw new Error("Illegal state: unknown tile type");
  }
}
