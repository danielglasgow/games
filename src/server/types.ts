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
}

export interface InitialPlacementTurn {
  player: string;
  phase: "PLACE_SETTLEMENT" | "PLACE_ROAD";
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

export interface HexId {
  readonly row: number;
  readonly col: number;
}

export class VertexId {
  constructor(readonly hex: HexId, readonly side: "LEFT" | "RIGHT") {}

  equals(other?: VertexId|EdgeId) {
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

  equals(other?: VertexId|EdgeId) {
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
