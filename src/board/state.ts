import { shuffleArray } from "../common/util";
import { TileType } from "./types";

const TILES: TileType[] = [
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
];

export function newRandomBoard() {
  return shuffleArray(Array.from(TILES));
}