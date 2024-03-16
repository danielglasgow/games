export interface Server {
  //notify()
  //commit()
}

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
  // Play could be build c/s/r, buy dev card, play dev card.
  // With the exception of buy dev card, all these actions are considered pending until committed.
  // Playing a dev card becomes final once all the choices are made.
  // For example, if a knight is played, until the robber is moved and a card is stolen, the action is not final
  // If a dev card is played, but it's action sequence is not finished, it reamins "revealed" -- i.e. face up, but playable.
  // A victory point that is playd before the end of the game is a binary action.
  // Before playing a dev card the palyer is warned that once played it will remain visible to all players,
  // even if it's action has not yet been taken.
  phase: "ROLL" | "MOVE_ROBBER" | "PLAY";
}

export interface InitialPlacementTurn {
  player: string;
  type: "NOT_LAST" | "LAST";
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

export interface VertexId {
  readonly hex: HexId;
  readonly side: "LEFT" | "RIGHT";
}

function isEdge(x: VertexId | EdgeId): x is EdgeId {
  return (x as EdgeId).position != undefined;
}

export type Building = "SETTLEMENT" | "CITY";

export interface EdgeId {
  readonly hex: HexId;
  readonly position: "LEFT" | "RIGHT" | "TOP";
}
export interface BoardLayout {
  readonly columns: ReadonlyArray<ReadonlyArray<HexLayout>>;
  readonly vertices: ReadonlyArray<VertexId>;
  readonly ports: ReadonlyArray<Port>;
}

export function isInitialPlacementTurn(
  turn: GameTurn | InitialPlacementTurn
): turn is InitialPlacementTurn {
  return (turn as InitialPlacementTurn).type != undefined;
}

export function isGameTurn(
  turn: GameTurn | InitialPlacementTurn
): turn is GameTurn {
  return (turn as GameTurn).phase != undefined;
}

export function isRoad(x: Settlement | City | Road): x is Road {
  return isEdge((x as Road).location);
}
