import { Dispatch, SetStateAction, useState } from "react";
import { Controller } from "../control/controller";
import { Building as BuildingType, VertexId } from "../server/types";
import {
  HEX_DIAMETER_VMIN,
  HEX_HEIGHT_VMIN,
  HEX_SIDE_VMIN,
  ROAD_SPACING_VMIN,
} from "./dimensions";

import city from "../assets/buildings/blue/city.svg";
import settlement from "../assets/buildings/blue/settlement.svg";
import { GameState } from "../game/state";

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
  readonly building?: BuildingType;
}

export interface VertexProps {
  location: VertexId;
}

export interface OpenVertexProps extends VertexProps {
  building?: BuildingType;
}

export interface BuiltVertexProps extends VertexProps {
  building: BuildingType;
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

  setBuilding(building: BuildingType) {
    this.setState({ ...this.state, building });
  }

  removeBuilding() {
    this.setState({ ...this.state, building: undefined });
  }
}

export function Vertex(props: {location: VertexId, state: GameState}) {
  const fixedBuilding = props.state.getFixedBuilding(props.location);
  if (fixedBuilding) {
    return <BuiltVertex location={props.location} building={fixedBuilding} />;
  }
  return <OpenVertex location={props.location}/>;

}

function BuiltVertex(props: BuiltVertexProps) {
  switch (props.location.side) {
    case "LEFT":
      return (
        <div
          style={{
            borderRadius: "50%",
            background: "transparent",
            width: PLACEMENT_INDICATOR_VMIN + "vmin",
            height: PLACEMENT_INDICATOR_VMIN + "vmin",
            left: LEFT_VERTEX_X_OFFSET - PLACEMENT_INDICATOR_VMIN / 2 + "vmin",
            top: VERTEX_Y_OFFSET - PLACEMENT_INDICATOR_VMIN / 2 + "vmin",
            position: "absolute",
            zIndex: 1,
          }}
        >
          {Building(props.building)}
        </div>
      );
    case "RIGHT":
      return (
        <div
          style={{
            borderRadius: "50%",
            background: "transparent",
            width: PLACEMENT_INDICATOR_VMIN + "vmin",
            height: PLACEMENT_INDICATOR_VMIN + "vmin",
            left: RIGHT_VERTEX_X_OFFSET - PLACEMENT_INDICATOR_VMIN / 2 + "vmin",
            top: VERTEX_Y_OFFSET - PLACEMENT_INDICATOR_VMIN / 2 + "vmin",
            position: "absolute",
            zIndex: 1,
          }}
        >
          {Building(props.building)}
        </div>
      );
  }
}

function OpenVertex(props: VertexProps) {
  const [showIndicator, setShowIndicator] = useState(false);
  switch (props.location.side) {
    case "LEFT":
      return (
        <div
          style={{
            borderRadius: "50%",
            border: showIndicator ? "1px solid black" : "1px solid transparent",
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
            border: showIndicator ? "1px solid black" : "1px solid transparent",
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
}

function Building(building?: BuildingType) {
  if (!building) {
    return <div></div>;
  }
  switch (building) {
    case "SETTLEMENT":
      return <Settlement />;
    case "CITY":
      return <City />;
  }
}

// Aligning them middle of the settlement / City doesn't look as good as aligining to the middle of the base rectangel (i.e. without the roof)
const BUILDING_Y_FUDGE = 0.25 * PLACEMENT_INDICATOR_VMIN;

const SETTLEMENT_SCALE = 1.25;
const SETTLEMENT_WIDTH_VMIN = PLACEMENT_INDICATOR_VMIN * SETTLEMENT_SCALE;
const SETTLEMENT_HEIGHT_VMIN = PLACEMENT_INDICATOR_VMIN * SETTLEMENT_SCALE;
const SETTLEMENT_X_OFFSET =
  -1 * ((SETTLEMENT_WIDTH_VMIN - PLACEMENT_INDICATOR_VMIN) / 2);

const SETTLEMENT_Y_OFFSET =
  -1 * ((SETTLEMENT_HEIGHT_VMIN - PLACEMENT_INDICATOR_VMIN) / 2) -
  BUILDING_Y_FUDGE;

function Settlement() {
  return (
    <div>
      <img
        src={settlement}
        style={{
          width: SETTLEMENT_WIDTH_VMIN + "vmin",
          height: SETTLEMENT_HEIGHT_VMIN + "vmin",
          left: SETTLEMENT_X_OFFSET + "vmin",
          top: SETTLEMENT_Y_OFFSET + "vmin",
          position: "absolute",
        }}
      />
    </div>
  );
}

const CITY_SCALE = 2;
const CITY_WIDTH_VMIN = PLACEMENT_INDICATOR_VMIN * CITY_SCALE;
const CITY_HEIGHT_VMIN = PLACEMENT_INDICATOR_VMIN * CITY_SCALE;
const CITY_X_OFFSET = -1 * ((CITY_WIDTH_VMIN - PLACEMENT_INDICATOR_VMIN) / 2);
const CITY_Y_OFFSET =
  -1 * ((CITY_HEIGHT_VMIN - PLACEMENT_INDICATOR_VMIN) / 2) - BUILDING_Y_FUDGE;

function City() {
  return (
    <div>
      <img
        src={city}
        style={{
          width: CITY_WIDTH_VMIN + "vmin",
          height: CITY_HEIGHT_VMIN + "vmin",
          left: CITY_X_OFFSET + "vmin",
          top: CITY_Y_OFFSET + "vmin",
          position: "absolute",
        }}
      />
    </div>
  );
}
