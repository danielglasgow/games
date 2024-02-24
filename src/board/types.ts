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

export interface ResourceTile {
  readonly resource: Resource;
  readonly number: Number;
}

interface Location {
  readonly location: HexId;
}

export type LandTile = ResourceTile | Desert;

export type Tile = LandTile | Ocean;

export interface GeographyHex extends Location {
  readonly geography: Desert | Ocean;
}
export type ResourceHex = ResourceTile & Location;

export function isResourceHex(hex: TileHex): hex is ResourceHex {
  return (
    (hex as ResourceHex).resource !== undefined &&
    (hex as ResourceHex).number !== undefined
  );
}

export type TileHex = ResourceHex | GeographyHex;

export interface BoardLayout {
  readonly tiles: Readonly<Tile[]>;
  readonly ports: Readonly<Port[]>;
}

export interface Port {
  readonly type: Resource | "THREE_FOR_ONE";
  readonly location: VertexId;
}

export interface Settlement {
  readonly location: VertexId;
  readonly player: string;
}

export interface City {
  readonly location: VertexId;
  readonly player: string;
}

export interface Road {
  readonly location: EdgeId;
  readonly player: string;
}

export interface VertexId {
  readonly row: number;
  readonly col: number;
  readonly side: "LEFT" | "RIGHT";
}

export type VertexState = "SETTLEMENT" | "CITY" | "OPEN" | "CLOSED";

export interface HexState {
  leftVertex: VertexState;
  rightVertex: VertexState;
  isBlocked: boolean;
}

export interface Hex {
  readonly state: HexState;
  readonly tile: Tile;
  readonly location: HexId;
}

export interface EdgeId {}

export interface HexId {
  readonly row: number;
  readonly col: number;
}
