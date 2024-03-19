import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Game, GameContext } from "../game";
import {
  HEX_HEIGHT_VMIN,
  HEX_SIDE_VMIN,
  INDICATOR_X_HEX_LEFT,
  INDICATOR_X_HEX_MIDDLE,
  INDICATOR_X_HEX_RIGHT,
  INDICATOR_Y_HEX_TOP,
  PLACEMENT_INDICATOR_VMIN,
  ROAD_LENGTH_VMIN,
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
    readonly game: Game,
    readonly location: EdgeLocation,
    private readonly setShowIndicator: Dispatch<SetStateAction<boolean>>,
    private readonly setHasRoad: Dispatch<SetStateAction<boolean>>
  ) {}

  showIndicator() {
    this.setShowIndicator(true);
  }

  hideIndicator() {
    this.setShowIndicator(false);
  }

  placeRoad() {
    this.setHasRoad(true);
  }

  removeRoad() {
    this.setHasRoad(false);
  }

  onClick() {
    this.game.turn.onEdgeClicked(this.location);
  }
}

export function Edge(props: EdgeProps) {
  const game = useContext(GameContext);
  if (game.state.hasRoad(props.location)) {
    return Road(props);
  } else {
    return OpenEdge(props);
  }
}

function OpenEdge(props: EdgeProps) {
  const game = useContext(GameContext);
  const [showIndicator, setShowIndicator] = useState(false);
  const [hasRoad, setHasRoad] = useState(false);
  const control = new EdgeControl(
    game,
    props.location,
    setShowIndicator,
    setHasRoad
  );
  game.control.attachEdge(control);
  return (
    <div>
      <div
        style={{
          borderRadius: "50%",
          border: showIndicator ? "1px solid black" : "1px solid transparent",
          background: "transparent",
          position: "absolute",
          zIndex: 1,
          width: PLACEMENT_INDICATOR_VMIN + "vmin",
          height: PLACEMENT_INDICATOR_VMIN + "vmin",
          ...getInidcatorPositionStyles(props.location.position),
        }}
        onClick={() => control.onClick()}
      ></div>
      {hasRoad && Road(props)}
    </div>
  );
}

function Road(props: EdgeProps) {
  return (
    <div
      style={{
        background: "blue",
        position: "absolute",
        zIndex: -1,
        ...getRoadDimensionStyles(props.location.position),
      }}
    ></div>
  );
}

function getRoadDimensionStyles(position: "LEFT" | "RIGHT" | "TOP") {
  let adj = (ROAD_LENGTH_VMIN - PLACEMENT_INDICATOR_VMIN) / 2;
  const adjTop = (ROAD_LENGTH_VMIN - PLACEMENT_INDICATOR_VMIN) / 2;
  const { top, left } = getInidcatorPosition(position);
  switch (position) {
    case "TOP":
      return {
        top: top + "vmin",
        left: left - adjTop + "vmin",
        height: PLACEMENT_INDICATOR_VMIN + "vmin",
        width: ROAD_LENGTH_VMIN + "vmin",
      };
    case "LEFT":
      return {
        top: top - adj + "vmin",
        left: left + "vmin",
        rotate: "30deg",
        height: ROAD_LENGTH_VMIN + "vmin",
        width: PLACEMENT_INDICATOR_VMIN + "vmin",
      };
    case "RIGHT":
      return {
        top: top - adj + "vmin",
        left: left + "vmin",
        rotate: "-30deg",
        height: ROAD_LENGTH_VMIN + "vmin",
        width: PLACEMENT_INDICATOR_VMIN + "vmin",
      };
  }
}

function getInidcatorPositionStyles(position: "LEFT" | "RIGHT" | "TOP") {
  const { top, left } = getInidcatorPosition(position);
  return { top: top + "vmin", left: left + "vmin" };
}

function getInidcatorPosition(position: "LEFT" | "RIGHT" | "TOP") {
  switch (position) {
    case "TOP":
      return {
        top: INDICATOR_Y_HEX_TOP - ROAD_SPACING_VMIN / 2,
        left: INDICATOR_X_HEX_MIDDLE,
      };
    case "LEFT":
      return {
        top: INDICATOR_Y_HEX_TOP + HEX_HEIGHT_VMIN / 4,
        left: INDICATOR_X_HEX_LEFT + X_OFFSET,
      };
    case "RIGHT":
      return {
        top: INDICATOR_Y_HEX_TOP + HEX_HEIGHT_VMIN / 4,
        left: INDICATOR_X_HEX_RIGHT - X_OFFSET,
      };
  }
}
