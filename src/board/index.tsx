import { HEX_OVERALY_OFFSET_VMIN } from "./dimensions";
import { BoardState } from "./state";
import { Hexagon, Spacer } from "./tile";

export default function Board({ board }: { board: BoardState }) {
  const totalColumns = 7;
  const midPoint = Math.floor(totalColumns / 2);
  const columns = board.columns().map((column, index) => {
    const hexagons = column.map(tile => Hexagon({ tile }));
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
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
