import { Dispatch, SetStateAction, useState } from "react";
import { CONTROL_MANAGER } from "../control/manager";
import {
  HEX_HEIGHT_VMIN,
  HEX_SIDE_VMIN,
  INDICATOR_X_HEX_LEFT,
  INDICATOR_X_HEX_MIDDLE,
  INDICATOR_X_HEX_RIGHT,
  INDICATOR_Y_HEX_TOP,
  PLACEMENT_INDICATOR_VMIN,
  ROAD_OVERLAY_OFFSET_VMIN,
  ROAD_SPACING_VMIN,
} from "./dimensions";
import { EdgeLocation } from "./location";

// Once the indicator centered along the left / right edge of the hex box,
// how much to shift it to get it into position
const X_OFFSET = HEX_SIDE_VMIN / 4 - ROAD_OVERLAY_OFFSET_VMIN / 2;

interface EdgeProps {
  location: EdgeLocation;
}


export class EdgeControl {
  constructor(
    private readonly setShowIndicator: Dispatch<SetStateAction<boolean>>,
  ) {}

  showIndicator() {
    this.setShowIndicator(true);
  }

  hideIndicator() {
    this.setShowIndicator(false);
  }
}


export function Edge(props: EdgeProps) {
  const [showIndicator, setShowIndicator] = useState(false);
  const control = new EdgeControl(setShowIndicator);
  CONTROL_MANAGER.registerEdge(props.location, control);
  switch (props.location.position) {
    case "TOP":
      return TopEdge(showIndicator);
    case "LEFT":
      return LeftEdge(showIndicator);
    case "RIGHT":
      return RightEdge(showIndicator);
  } 
}

export function TopEdge(showIndicator: boolean) {
  return (
    <div
      style={{
        borderRadius: "50%",
        border: showIndicator ? "1px solid black" : "1px solid transparent",
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

function LeftEdge(showIndicator: boolean) {
  return (
    <div
      style={{
        borderRadius: "50%",
        border: showIndicator ? "1px solid black" : "1px solid transparent",
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

function RightEdge(showIndicator: boolean) {
  return (
    <div
      style={{
        borderRadius: "50%",
        border: showIndicator ? "1px solid black" : "1px solid transparent",
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
