export interface GameState {
  readonly board: BoardLayout;
  readonly turn: GameTurn | InitialPlacementTurn;
  readonly players: [PlayerYou, PlayerOther, PlayerOther, PlayerOther];
  readonly robber: HexId;
  readonly settlements: ReadonlyArray<Settlement>;
  readonly roads: ReadonlyArray<Road>;
  readonly cities: ReadonlyArray<City>;
}

export type DevelopmentCard =
  | "KNIGHT"
  | "YOP"
  | "MONOPOLOY"
  | "ROAD_BUILDING"
  | "VP";

interface Player {
  readonly name: string;
  readonly position: number;
  readonly playedCards: ReadonlyArray<DevelopmentCard>;
  readonly largestArmyCount: number;
  readonly longestRoadCount: number;
  readonly points: number;
}

export interface PlayerOther extends Player {
  readonly cards: { development: number; resource: number };
}

export interface PlayerYou extends Player {
  readonly cards: {
    development: ReadonlyArray<DevelopmentCard>;
    resource: ReadonlyArray<Resource>;
  };
  readonly ports: ReadonlyArray<Resource | "THREE_FOR_ONE">;
}

export interface GameTurn {
  player: string;
  phase: "ROLL" | "BUILD";
  pendingPlacements: ReadonlyArray<Settlement | City | Road>;
  pendingAction: "PLACE_SETTLEMENT" | "PLACE_CITY" | "PLACE_ROAD" | "CONFIRM";
}

export interface InitialPlacementTurn {
  player: string;
  phase: "PLACE_SETTLEMENT" | "PLACE_ROAD" | "CONFIRM";
  pendingPlacements: Readonly<{ settlement?: VertexId; road?: EdgeId }>;
}

export type Resource = "ORE" | "BRICK" | "WHEAT" | "WOOD" | "SHEEP";

export type Desert = "DESERT";

export type Ocean = "OCEAN";

export type Number =
  | "TWO"
  | "THREE"
  | "FOUR"
  | "FIVE"
  | "SIX"
  | "EIGHT"
  | "NINE"
  | "TEN"
  | "ELEVEN"
  | "TWELVE";

export interface ResourceNumber {
  readonly resource: Resource;
  readonly number: Number;
}

interface GeographyLayout<T extends Desert | Ocean> {
  readonly geography: T;
  readonly location: HexId;
}

export type DesertLayout = GeographyLayout<Desert>;
export type OceanLayout = GeographyLayout<Ocean>;

export interface ResourceLayout extends ResourceNumber {
  readonly location: HexId;
}

export type HexLayout = ResourceLayout | DesertLayout | OceanLayout;

export function isResource(layout: HexLayout): layout is ResourceLayout {
  return (
    (layout as ResourceLayout).resource !== undefined &&
    (layout as ResourceLayout).number !== undefined
  );
}

export function isDesert(layout: HexLayout): layout is DesertLayout {
  return (layout as DesertLayout).geography === "DESERT";
}

export function isOcean(layout: HexLayout): layout is OceanLayout {
  return (layout as OceanLayout).geography === "OCEAN";
}

export interface Port {
  readonly type: Resource | "THREE_FOR_ONE";
  readonly location: VertexId;
}

export interface Settlement {
  readonly name: "SETTLEMENT";
  readonly location: VertexId;
  readonly player: string;
}

export interface City {
  readonly name: "CITY";
  readonly location: VertexId;
  readonly player: string;
}

export interface Road {
  readonly type: "ROAD";
  readonly location: EdgeId;
  readonly player: string;
}

export class HexId {
  readonly row: number;
  readonly col: number;

  constructor({ row, col }: { row: number; col: number }) {
    this.row = row;
    this.col = col;
  }

  equals(other?: HexId) {
    return other && this.row === other.row && this.col === other.col;
  }

  toString() {
    return `${this.row},${this.col}`;
  }
}

export class VertexId {
  constructor(readonly hex: HexId, readonly side: "LEFT" | "RIGHT") {}

  equals(other?: VertexId | EdgeId) {
    if (!other || isEdge(other)) {
      return false;
    }
    return (
      this.hex.row === other.hex.row &&
      this.hex.col === other.hex.col &&
      this.side === other.side
    );
  }

  toString() {
    return `${this.hex.row},${this.hex.col}:${this.side}`;
  }

  adjacentHexes(): { location: HexId }[] {
    const { row, col } = this.hex;
    switch (this.side) {
      // TODO(danielglasgow):
      // [sameHex(), adjacentColumnUpHex(), adjacentColumnDownHex()]
      // Probably can reuse with vertex logic: e.g for vertex get a hex, 
      // and then ask for it's left or right vertex.
      case "LEFT":
        return [
          { location: new HexId({ row: row, col: col }) },
          { location: new HexId({ row: row, col: col - 1 }) },
          { location: new HexId({ row: row - 1, col: col }) },
        ];
      case "RIGHT":
        return [
          { location: new HexId({ row: row, col: col }) },
          { location: new HexId({ row: row - 1, col: col }) },
          { location: new HexId({ row: row, col: col + 1 }) },
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

  private sameHexOtherSide() {
    const hex = new HexId({ row: this.hex.row, col: this.hex.col });
    return new VertexId(hex, this.oppositeSide());
  }

  private adjacentColumnUp() {
    const up = this.adjacentColumnIsBigger() ? 1 : 0;
    const hex = new HexId({
      row: this.hex.row + up,
      col: this.adjacentColumn(),
    });
    return new VertexId(hex, this.oppositeSide());
  }

  private adjacentColumnDown() {
    const down = this.adjacentColumnIsBigger() ? 0 : -1;
    const hex = new HexId({
      row: this.hex.row + down,
      col: this.adjacentColumn(),
    });
    return new VertexId(hex, this.oppositeSide());
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
}

export function isEdge(x: VertexId | EdgeId): x is EdgeId {
  return (x as EdgeId).position != undefined;
}

export function isVertex(x: VertexId | EdgeId): x is VertexId {
  return (x as VertexId).side != undefined;
}

export type VertexState = "SETTLEMENT" | "CITY" | "OPEN" | "CLOSED";

export type Building = "SETTLEMENT" | "CITY";

export class EdgeId {
  constructor(readonly hex: HexId, readonly position: "INNER" | "OUTER") {}

  equals(other?: VertexId | EdgeId) {
    if (!other || isVertex(other)) {
      return false;
    }
    return (
      this.hex.row === other.hex.row &&
      this.hex.col === other.hex.col &&
      this.position === other.position
    );
  }
}

export interface BoardLayout {
  readonly columns: ReadonlyArray<ReadonlyArray<HexLayout>>;
  readonly vertices: ReadonlyArray<VertexId>;
  readonly ports: ReadonlyArray<Port>;
}

export function isInitialPlacementTurn(
  turn: GameTurn | InitialPlacementTurn
): turn is InitialPlacementTurn {
  return typeof (turn as InitialPlacementTurn).pendingPlacements === "object";
}

export function isRoad(x: Settlement | City | Road): x is Road {
  return isEdge((x as Road).location);
}
