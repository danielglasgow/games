import {
  HEX_DIAMETER_VMIN,
  HEX_HEIGHT_VMIN,
  HEX_SIDE_VMIN,
  INDICATOR_Y_HEX_TOP,
  INDICATOR_X_HEX_LEFT,
  INDICATOR_X_HEX_RIGHT,
  PLACEMENT_INDICATOR_VMIN,
  ROAD_OVERLAY_OFFSET_VMIN,
  ROAD_SPACING_VMIN,
  INDICATOR_X_HEX_MIDDLE,
} from "./dimensions";

// Once the indicator centered along the left / right edge of the hex box,
// how much to shift it to get it into position
const X_OFFSET = HEX_SIDE_VMIN / 4 - ROAD_OVERLAY_OFFSET_VMIN / 2;

export function TopEdge() {
  return (
    <div
      style={{
        borderRadius: "50%",
        border: "1px solid black",
        background: "transparent",
        position: "absolute",
        zIndex: 1,
        width: PLACEMENT_INDICATOR_VMIN + "vmin",
        height: PLACEMENT_INDICATOR_VMIN + "vmin",
        top: INDICATOR_Y_HEX_TOP - ROAD_SPACING_VMIN / 2 + "vmin",
        left: INDICATOR_X_HEX_MIDDLE + "vmin",
      }}
    ></div>
  );
}

export function LeftEdge() {
  return (
    <div
      style={{
        borderRadius: "50%",
        border: "1px solid black",
        background: "transparent",
        position: "absolute",
        zIndex: 1,
        width: PLACEMENT_INDICATOR_VMIN + "vmin",
        height: PLACEMENT_INDICATOR_VMIN + "vmin",
        top: INDICATOR_Y_HEX_TOP + HEX_HEIGHT_VMIN / 4 + "vmin",
        left: INDICATOR_X_HEX_LEFT + X_OFFSET + "vmin",
      }}
    ></div>
  );
}

export function RightEdge() {
  return (
    <div
      style={{
        borderRadius: "50%",
        border: "1px solid black",
        background: "transparent",
        position: "absolute",
        zIndex: 1,
        width: PLACEMENT_INDICATOR_VMIN + "vmin",
        height: PLACEMENT_INDICATOR_VMIN + "vmin",
        top: INDICATOR_Y_HEX_TOP + HEX_HEIGHT_VMIN / 4 + "vmin",
        left: INDICATOR_X_HEX_RIGHT - X_OFFSET + "vmin",
      }}
    ></div>
  );
}
