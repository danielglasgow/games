import { useState } from "react";
import { AppControl } from "../control";
import { BoardLayout } from "../server/types";
import { BoardControl } from "./control";
import { HEX_OVERALY_OFFSET_VMIN } from "./dimensions";
import { Hexagon, Spacer } from "./hexagon";
import { GameState } from "../game/state";

interface BoardProps {
  layout: BoardLayout;
  state: GameState;
}

export default function Board(props: BoardProps) {
  // const [state, setState] = useState({});
  //const control = new BoardControl(parent, state, setState);
  //parent.registerBoardControl(control);
  const totalColumns = 7;
  const midPoint = Math.floor(totalColumns / 2);
  const columns = props.layout.columns.map((column, index) => {
    const hexagons = column.map((layout) => <Hexagon layout={layout} state={props.state} />);
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
