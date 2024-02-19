import brick from "../assets/brick.svg";
import desert from "../assets/desert.svg";
import ore from "../assets/ore.svg";
import sheep from "../assets/sheep.svg";
import wheat from "../assets/wheat.svg";
import wood from "../assets/wood.svg";
import { HEX_OVERALY_OFFSET_VMIN } from "./dimensions";
import { Hexagon, Spacer } from "./tile";
import { TileType } from "./types";

const BACKGROUNDS: { [key in TileType]: string } = {
  ORE: ore,
  BRICK: brick,
  WHEAT: wheat,
  WOOD: wood,
  SHEEP: sheep,
  DESERT: desert,
};

export default function Board({ tiles }: { tiles: TileType[] }) {
  return (
    <div id="board">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          paddingLeft: HEX_OVERALY_OFFSET_VMIN * -1 + "vmin",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Spacer({ ratio: 1 })}
          {Hexagon({ src: BACKGROUNDS[tiles[0]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[1]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[2]] })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Spacer({ ratio: 0.5 })}
          {Hexagon({ src: BACKGROUNDS[tiles[3]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[4]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[5]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[6]] })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Hexagon({ src: BACKGROUNDS[tiles[7]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[8]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[9]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[10]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[11]] })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Spacer({ ratio: 0.5 })}
          {Hexagon({ src: BACKGROUNDS[tiles[12]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[13]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[14]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[15]] })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Spacer({ ratio: 1 })}
          {Hexagon({ src: BACKGROUNDS[tiles[16]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[17]] })}
          {Hexagon({ src: BACKGROUNDS[tiles[18]] })}
        </div>
      </div>
    </div>
  );
}
