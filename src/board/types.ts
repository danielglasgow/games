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

export interface GeographyLayout {
  readonly geography: Desert | Ocean;
  readonly location: HexId;
}
export interface ResourceLayout extends ResourceNumber {
  readonly location: HexId;
}

export type HexLayout = ResourceLayout | GeographyLayout;

export function isResource(layout: HexLayout): layout is ResourceLayout {
  return (
    (layout as ResourceLayout).resource !== undefined &&
    (layout as ResourceLayout).number !== undefined
  );
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

export interface HexId {
  readonly row: number;
  readonly col: number;
}

export interface VertexId {
  readonly location: HexId;
  readonly side: "LEFT" | "RIGHT";
}

export type VertexState = "SETTLEMENT" | "CITY" | "OPEN" | "CLOSED";

export interface HexState {
  leftVertex: VertexState;
  rightVertex: VertexState;
  isBlocked: boolean;
}

export interface EdgeId {}

export interface Hex {
  readonly state: HexState;
  readonly layout: HexLayout; 
}
