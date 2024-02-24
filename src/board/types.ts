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

export type Tile = ResourceTile | Desert | Ocean;

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

export interface EdgeId {}

export interface HexId {
  readonly row: number;
  readonly col: number;
}
