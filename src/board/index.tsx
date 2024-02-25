import { HEX_OVERALY_OFFSET_VMIN } from "./dimensions";
import { Hexagon, Spacer } from "./hexagon";
import { BoardState } from "./state";
import { BoardControl } from "./types";

export interface Board {
  state: BoardState,
  control: BoardControl,
}

export default function Board({
  board
}: {
  board: Board;
}) {
  const totalColumns = 7;
  const midPoint = Math.floor(totalColumns / 2);
  const columns = board.state.columns().map((column, index) => {
    const hexagons = column.map((hex) => Hexagon({ hex, control: board.control }));
    return (
      <div
        style={{ display: "flex", flexDirection: "column" }}
        key={`column${index}`}
      >
        {Spacer({ ratio: Math.abs(midPoint - index) * 0.5 })}
        {hexagons}
      </div>
    );
  });
  return (
    <div id="board">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          paddingLeft: HEX_OVERALY_OFFSET_VMIN * -1 + "vmin",
        }}
      >
        {columns}
      </div>
    </div>
  );
}
