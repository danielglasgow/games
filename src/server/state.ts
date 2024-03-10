import { shuffleArray } from "../common/util";
import {
  BoardLayout,
  Desert,
  DesertLayout,
  GameState,
  HexId,
  HexLayout,
  Number,
  Ocean,
  PlayerOther,
  PlayerYou,
  Resource,
  ResourceLayout,
  ResourceNumber,
  VertexId,
  isDesert,
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

export function newRandomGame(): GameState {
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
  const board = builder.build();
  const desert = getHexes(board).find(isDesert);
  if (!desert) {
    throw new Error("Cannot construct board layout without a desert tile");
  }
  return {
    board,
    turn: {
      player: "player1",
      phase: "PLACE_SETTLEMENT",
      pendingPlacements: {}
    },
    players: [playerYou(1), playerOther(2), playerOther(3), playerOther(4)],
    robber: desert.location,
    settlements: [{name: "SETTLEMENT", location: new VertexId({row: 3, col: 3}, "LEFT"), player: "player1"}],
    cities: [{name: "CITY", location: new VertexId({row: 3, col: 4}, "LEFT"), player: "player1"}],
    roads: [],
  };
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
    return {
      columns: Object.freeze(this.columns),
      ports: [],
      vertices: Object.freeze(landVertices),
    };
  }

  private push(hex: ResourceNumber | Ocean | Desert) {
    const location = { row: this.currentRow, col: this.currentColumnIndex };
    if (hex == "DESERT") {
      const desert: DesertLayout = { geography: "DESERT", location };
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

  private pushVertex(hex: HexId) {
    this.vertices.push(new VertexId(hex, "LEFT" ));
    this.vertices.push(new VertexId(hex, "RIGHT" ));
  }
}

function isAdjacent(hex: { location: HexId }, vertex: VertexId) {
  return getAdjacentHexes(vertex).some((adjHex) => isSameLocation(adjHex, hex));
}

function isSameLocation(a: { location: HexId }, b: { location: HexId }) {
  return a.location.row === b.location.row && a.location.col === b.location.col;
}

function getAdjacentHexes(vertex: VertexId): { location: HexId }[] {
  const { row, col } = vertex.hex;
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

function playerYou(n: number): PlayerYou {
  return {
    name: "player" + n,
    position: n,
    playedCards: [],
    largestArmyCount: 0,
    longestRoadCount: 0,
    points: 0,
    cards: {
      development: [],
      resource: [],
    },
    ports: [],
  };
}

function playerOther(n: number): PlayerOther {
  return {
    name: "player" + n,
    position: n,
    playedCards: [],
    largestArmyCount: 0,
    longestRoadCount: 0,
    points: 0,
    cards: {
      development: 0,
      resource: 0,
    },
  };
}

function getHexes(board: BoardLayout) {
  const hexes: HexLayout[] = [];
  for (const column of board.columns) {
    for (const hex of column) {
      hexes.push(hex);
    }
  }
  return hexes;
}
