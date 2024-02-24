import { shuffleArray } from "../common/util";
import {
  City,
  Desert,
  GeographyLayout,
  Hex,
  HexId,
  HexLayout,
  HexState,
  Number,
  Ocean,
  Port,
  Resource,
  ResourceLayout,
  ResourceNumber,
  Road,
  Settlement,
  VertexId,
  isResource,
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
  readonly columns: ReadonlyArray<ReadonlyArray<HexLayout>>;
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
  private columns: ReadonlyArray<HexLayout>[] = [];
  private landHexes: HexLayout[] = [];
  private currentColumnIndex: number = 1;
  private currentColumn: HexLayout[] = [];
  private currentRow: number = 0;

  add(tile: ResourceNumber | Desert) {
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
    const landVertices: VertexId[] = [];
    for (const vertex of this.vertices) {
      if (this.landHexes.some((hex) => isAdjacent(hex, vertex))) {
        landVertices.push(vertex);
      }
    }
    return new BoardState({
      columns: Object.freeze(this.columns),
      ports: [],
      vertices: Object.freeze(landVertices),
    });
  }

  private push(hex: ResourceNumber | Ocean | Desert) {
    const location = { row: this.currentRow, col: this.currentColumnIndex };
    if (hex == "DESERT") {
      const desert: GeographyLayout = { geography: "DESERT", location };
      this.currentColumn.push(desert);
      this.landHexes.push(desert);
    } else if (hex == "OCEAN") {
      this.currentColumn.push({ geography: "OCEAN", location });
    } else {
      const resource: ResourceLayout = { location, ...hex };
      this.currentColumn.push(resource);
      this.landHexes.push(resource);
    }
    this.pushVertex(location);
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
    const column: HexLayout[] = [];
    for (let i = 0; i < size; i++) {
      const location = { row: i, col: columnIndex };
      column.push({ geography: "OCEAN", location });
      this.pushVertex(location);
    }
    return Object.freeze(column);
  }

  private pushVertex(location: HexId) {
    this.vertices.push({ location, side: "LEFT" });
    this.vertices.push({ location, side: "RIGHT" });
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
      return column.map((tile) => this.toHexState(tile));
    });
  }

  private toHexState(hex: HexLayout): Hex {
    const { left, right } = this.getVertecies(hex);
    const state: HexState = {
      leftVertex: left == null ? "CLOSED" : "OPEN",
      rightVertex: right == null ? "CLOSED" : "OPEN",
      isBlocked: false,
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
    const vertecies = this.layout.vertices.filter((vertex) =>
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

function isAdjacent(hex: { location: HexId }, vertex: VertexId) {
  return getAdjacentHexes(vertex).some((adjHex) => isSameLocation(adjHex, hex));
}

function isSameLocation(a: { location: HexId }, b: { location: HexId }) {
  return a.location.row === b.location.row && a.location.col === b.location.col;
}

function getAdjacentHexes(vertex: VertexId): { location: HexId }[] {
  const { row, col } = vertex.location;
  switch (vertex.side) {
    case "LEFT":
      return [
        { location: { row: row, col: col } },
        { location: { row: row, col: col - 1 } },
        { location: { row: row - 1, col: col } },
      ];
    case "RIGHT":
      return [
        { location: { row: row, col: col } },
        { location: { row: row - 1, col: col } },
        { location: { row: row, col: col + 1 } },
      ];
  }
}
