import { Dispatch, SetStateAction, useState } from "react";
import { Controller, events } from "../control/controller";
import { Building, VertexId } from "../server/types";
import { BoardControl } from "./control";
import {
  HEX_DIAMETER_VMIN,
  HEX_HEIGHT_VMIN,
  HEX_SIDE_VMIN,
  ROAD_SPACING_VMIN,
} from "./dimensions";

const PLACEMENT_INDICATOR_PCT = 20;
const PLACEMENT_INDICATOR_VMIN =
  HEX_DIAMETER_VMIN * (PLACEMENT_INDICATOR_PCT / 100);

const Y_FUGDE = (HEX_DIAMETER_VMIN / HEX_HEIGHT_VMIN - 1) / 2; // I have no idea why this works, but it does
const VERTEX_Y_OFFSET = -1 * (ROAD_SPACING_VMIN / 2) - Y_FUGDE;

const X_FUGDE = 1 - HEX_HEIGHT_VMIN / HEX_DIAMETER_VMIN; // I have no idea why this works, but it does
const LEFT_VERTEX_X_OFFSET = HEX_SIDE_VMIN / 2 - ROAD_SPACING_VMIN - X_FUGDE;
const RIGHT_VERTEX_X_OFFSET = HEX_DIAMETER_VMIN - LEFT_VERTEX_X_OFFSET;

export interface VertexState {
  readonly showIndicator: boolean;
  readonly building?: Building;
}

export interface VertexProps {
  location: VertexId;
}

export class VertexControl extends Controller {
  constructor(
    parent: Controller,
    private readonly state: VertexState,
    private readonly setState: Dispatch<SetStateAction<VertexState>>
  ) {
    super(parent);
  }

  showIndicator() {
    this.setState({ ...this.state, showIndicator: true });
  }

  hideIndicator() {
    this.setState({ ...this.state, showIndicator: false });
  }

  setBuilding(building: Building) {
    this.setState({ ...this.state, building });
  }

  removeBuilding() {
    this.setState({ ...this.state, building: undefined });
  }
}

export function Vertex(props: VertexProps) {
  const [showIndicator, setShowIndicator] = useState(false);
  switch (props.location.side) {
    case "LEFT":
      return (
        <div
          style={{
            borderRadius: "50%",
            border: showIndicator ? "1px solid black" :  "1px solid transparent",
            background: "transparent",
            width: PLACEMENT_INDICATOR_VMIN + "vmin",
            height: PLACEMENT_INDICATOR_VMIN + "vmin",
            left: LEFT_VERTEX_X_OFFSET - PLACEMENT_INDICATOR_VMIN / 2 + "vmin",
            top: VERTEX_Y_OFFSET - PLACEMENT_INDICATOR_VMIN / 2 + "vmin",
            position: "absolute",
            zIndex: 1,
          }}
          onClick={() => setShowIndicator(!showIndicator)}
        ></div>
      );
    case "RIGHT":
      return (
        <div
          style={{
            borderRadius: "50%",
            border: showIndicator ? "1px solid black" :  "1px solid transparent",
            background: "transparent",
            width: PLACEMENT_INDICATOR_VMIN + "vmin",
            height: PLACEMENT_INDICATOR_VMIN + "vmin",
            left: RIGHT_VERTEX_X_OFFSET - PLACEMENT_INDICATOR_VMIN / 2 + "vmin",
            top: VERTEX_Y_OFFSET - PLACEMENT_INDICATOR_VMIN / 2 + "vmin",
            position: "absolute",
            zIndex: 1,
          }}
          onClick={() => setShowIndicator(!showIndicator)}
        ></div>
      );
  }
  return <div></div>;
}
