import { HEX_OVERALY_OFFSET_VMIN } from "./dimensions";
import { Hexagon, Spacer } from "./tile";
import { BoardLayout, TileType } from "./types";


export default function Board({ layout }: { layout: BoardLayout }) {
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
          {Hexagon({ tile: layout.tiles[0] })}
          {Hexagon({ tile: layout.tiles[1] })}
          {Hexagon({ tile: layout.tiles[2] })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Spacer({ ratio: 0.5 })}
          {Hexagon({ tile: layout.tiles[3] })}
          {Hexagon({ tile: layout.tiles[4] })}
          {Hexagon({ tile: layout.tiles[5] })}
          {Hexagon({ tile: layout.tiles[6] })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Hexagon({ tile: layout.tiles[7] })}
          {Hexagon({ tile: layout.tiles[8] })}
          {Hexagon({ tile: layout.tiles[9] })}
          {Hexagon({ tile: layout.tiles[10] })}
          {Hexagon({ tile: layout.tiles[11] })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Spacer({ ratio: 0.5 })}
          {Hexagon({ tile: layout.tiles[12] })}
          {Hexagon({ tile: layout.tiles[13] })}
          {Hexagon({ tile: layout.tiles[14] })}
          {Hexagon({ tile: layout.tiles[15] })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Spacer({ ratio: 1 })}
          {Hexagon({ tile: layout.tiles[16] })}
          {Hexagon({ tile: layout.tiles[17] })}
          {Hexagon({ tile: layout.tiles[18] })}
        </div>
      </div>
    </div>
  );
}
