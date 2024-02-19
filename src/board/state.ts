import { shuffleArray } from "../common/util";
import { BoardLayout, Number, Resource, Tile, TileType } from "./types";

const TILES: Readonly<TileType[]> = Object.freeze([
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

export function newRandomBoard(): BoardLayout {
  const numbers = shuffleArray(Array.from(NUMBERS));
  const tiles: Tile[] = [];
  for (const resourceOrDesert of shuffleArray(Array.from(TILES))) {
    if (resourceOrDesert === "DESERT") {
      tiles.push("DESERT");
    } else {
      const resource: Resource = resourceOrDesert;
      const number = numbers.pop();
      if (!number) {
        throw Error("Could not initlize board. Number not found");
      }
      tiles.push({ resource, number });
    }
  }
  return Object.freeze({ tiles: Object.freeze(tiles) });
}
