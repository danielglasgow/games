import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Building as BuildingType, VertexId } from "../server/types";
import {
  HEX_DIAMETER_VMIN,
  HEX_SIDE_VMIN,
  INDICATOR_Y_HEX_TOP,
  INDICATOR_X_HEX_LEFT,
  INDICATOR_X_HEX_RIGHT,
  PLACEMENT_INDICATOR_VMIN,
  ROAD_SPACING_VMIN
} from "./dimensions";

import city from "../assets/buildings/blue/city.svg";
import settlement from "../assets/buildings/blue/settlement.svg";
import { CONTROL_MANAGER } from "../control/manager";
import { GameContext } from "../game/context";

const X_OFFSET = HEX_SIDE_VMIN / 4 + ROAD_SPACING_VMIN;

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

export class VertexControl {
  constructor(
    private readonly setShowIndicator: Dispatch<SetStateAction<boolean>>,
    private readonly setBuildingState: Dispatch<
      SetStateAction<BuildingType | undefined>
    >
  ) {}

  showIndicator() {
    this.setShowIndicator(true);
  }

  hideIndicator() {
    this.setShowIndicator(false);
  }

  setBuilding(building: BuildingType) {
    this.setBuildingState(building);
  }

  removeBuilding() {
    this.setBuildingState(undefined);
  }
}

export function Vertex(props: VertexProps) {
  const game = useContext(GameContext);
  const fixedBuilding = game.getFixedBuilding(props.location);
  if (fixedBuilding) {
    return <BuiltVertex location={props.location} building={fixedBuilding} />;
  }
  const pendingBuilding = game.getPendingBuilding(props.location);
  if (!game.isBuildingAllowed(props.location)) {
    if (pendingBuilding) {
      throw new Error(
        "Illegal board state, found pending building on vertex where building is not legal: " +
          props.location
      );
    }
    return ClosedVertex(props.location);
  }
  return <OpenVertex location={props.location} building={pendingBuilding} />;
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
            left: INDICATOR_X_HEX_LEFT + X_OFFSET + "vmin",
            top: INDICATOR_Y_HEX_TOP - ROAD_SPACING_VMIN / 2 + "vmin",
            position: "absolute",
            zIndex: 1,
          }}
          onClick={() => CONTROL_MANAGER.onVertexClick(props.location)}
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
            top: INDICATOR_Y_HEX_TOP - ROAD_SPACING_VMIN / 2 + "vmin",
            left: INDICATOR_X_HEX_RIGHT - X_OFFSET + "vmin",
            position: "absolute",
            zIndex: 1,
          }}
          onClick={() => CONTROL_MANAGER.onVertexClick(props.location)}
        >
          {Building(props.building)}
        </div>
      );
  }
}

function OpenVertex(props: OpenVertexProps) {
  const game = useContext(GameContext);
  const [showIndicator, setShowIndicator] = useState(
    !props.building && game.isVertexPlacementActive()
  );
  const [building, setBuilding] = useState(props.building);
  CONTROL_MANAGER.registerOpenVertex(
    props.location,
    new VertexControl(setShowIndicator, setBuilding)
  );
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
            top: INDICATOR_Y_HEX_TOP - ROAD_SPACING_VMIN / 2 + "vmin",
            left: INDICATOR_X_HEX_LEFT + X_OFFSET + "vmin",
            position: "absolute",
            zIndex: 1,
          }}
          onClick={() => CONTROL_MANAGER.onVertexClick(props.location)}
        >
          {building && Building(building)}
        </div>
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
            top: INDICATOR_Y_HEX_TOP - ROAD_SPACING_VMIN / 2 + "vmin",
            left: INDICATOR_X_HEX_RIGHT - X_OFFSET + "vmin",
            position: "absolute",
            zIndex: 1,
          }}
          onClick={() => CONTROL_MANAGER.onVertexClick(props.location)}
        >
          {building && Building(building)}
        </div>
      );
  }
}

function ClosedVertex(location: VertexId) {
  switch (location.side) {
    case "LEFT":
      return (
        <div
          style={{
            borderRadius: "50%",
            background: "transparent",
            width: PLACEMENT_INDICATOR_VMIN + "vmin",
            height: PLACEMENT_INDICATOR_VMIN + "vmin",
            top: INDICATOR_Y_HEX_TOP - ROAD_SPACING_VMIN / 2 + "vmin",
            left: INDICATOR_X_HEX_LEFT + X_OFFSET + "vmin",
            position: "absolute",
            zIndex: 1,
          }}
        ></div>
      );
    case "RIGHT":
      return (
        <div
          style={{
            borderRadius: "50%",
            background: "transparent",
            width: PLACEMENT_INDICATOR_VMIN + "vmin",
            height: PLACEMENT_INDICATOR_VMIN + "vmin",
            top: INDICATOR_Y_HEX_TOP - ROAD_SPACING_VMIN / 2 + "vmin",
            left: INDICATOR_X_HEX_RIGHT - X_OFFSET + "vmin",
            position: "absolute",
            zIndex: 1,
          }}
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
