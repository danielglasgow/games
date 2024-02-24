import { shuffleArray } from "../common/util";
import {
  City,
  Desert,
  HexId,
  Number,
  Port,
  Resource,
  ResourceTile,
  Road,
  Settlement,
  Tile,
} from "./types";

const TILES: Readonly<Array<Resource | Desert>> = Object.freeze([
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
  readonly columns: ReadonlyArray<ReadonlyArray<Tile>>;
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

  private columns: ReadonlyArray<Tile>[] = [];
  private currentColumnIndex: number = 1;
  private currentColumn: Tile[] = [];
  private currentRow: number = 0;

  add(tile: ResourceTile | Desert) {
    if (this.currentColumnIndex >= this.columnSizes.length - 1) {
      throw new Error("Illegal state: attempting to add to full board");
    }
    if (this.currentRow === 0) {
      this.push("OCEAN");
    }
    this.push(tile);
    if (this.currentRow === this.currentColumnSize() -1) {
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
    this.columns.unshift(BoardLayoutBuilder.oceanColumn(this.columnSizes[0]));
    this.columns.push(BoardLayoutBuilder.oceanColumn(this.currentColumnSize()));
    return new BoardState({ columns: Object.freeze(this.columns), ports: [] });
  }

  private push(tile: Tile) {
    this.currentColumn.push(tile);
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

  private static oceanColumn(size: number) {
    const column: Tile[] = [];
    for (let i = 0; i < size; i++) {
      column.push("OCEAN");
    }
    return Object.freeze(column);
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

  columns() {
    return this.layout.columns;
  }
}
