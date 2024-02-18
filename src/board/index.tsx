import wood from "../assets/wood.svg";
import { HEX_OVERALY_OFFSET_VMIN } from "./dimensions";
import { Hexagon, Spacer } from "./tile";

export default function Board() {
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
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Spacer({ ratio: 0.5 })}
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Spacer({ ratio: 0.5 })}
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {Spacer({ ratio: 1 })}
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
          {Hexagon({ src: wood })}
        </div>
      </div>
    </div>
  );
}
