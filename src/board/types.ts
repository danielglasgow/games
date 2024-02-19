export type Resource = "ORE" | "BRICK" | "WHEAT" | "WOOD" | "SHEEP";

type Desert = "DESERT";

export type TileType = Resource | Desert;

export type Number = "TWO" | "THREE" | "FOUR" | "FIVE" | "SIX" | "EIGHT" | "NINE" | "TEN" | "ELEVEN" | "TWELVE";

export interface ResourceTile {
  readonly resource: Resource;
  readonly number: Number;
}

export type Tile = ResourceTile | Desert;
 
export interface BoardLayout {
  readonly tiles: Readonly<Tile[]>
}