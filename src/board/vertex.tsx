import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Game, GameContext } from "../game/context";
import { Building as BuildingType } from "../server/types";
import { Building } from "./building";
import {
  HEX_SIDE_VMIN,
  INDICATOR_X_HEX_LEFT,
  INDICATOR_X_HEX_RIGHT,
  INDICATOR_Y_HEX_TOP,
  PLACEMENT_INDICATOR_VMIN,
  ROAD_SPACING_VMIN,
} from "./dimensions";
import { VertexLocation } from "./location";

const X_OFFSET = HEX_SIDE_VMIN / 4 + ROAD_SPACING_VMIN;

interface VertexProps {
  location: VertexLocation;
}

interface OpenVertexProps extends VertexProps {
  pendingBuilding?: BuildingType;
}

interface BuiltVertexProps extends VertexProps {
  fixedBuilding: BuildingType;
}

export interface VertexControl {
readonly location: VertexLocation;
  showIndicator(): void;
  hideIndicator(): void;
  setBuilding(building: BuildingType): void;
  removeBuilding(): void;
}

interface VertexControlInternal {
  onClick(): void;
}

class OpenVertexControl implements VertexControl, VertexControlInternal {
  private readonly type = "OPEN_VERTEX";
  constructor(
    readonly game: Game,
    readonly location: VertexLocation,
    private readonly setShowIndicator: Dispatch<SetStateAction<boolean>>,
    private readonly setBuildingState: Dispatch<
      SetStateAction<BuildingType | undefined>
    >
  ) {
    game.control.registerVertex(this);
  }

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

  onClick() {
    this.game.control.onVertexClick(this.location); 
  }

  static isInstance(control: VertexControl): control is OpenVertexControl {
    return (control as OpenVertexControl).type === "OPEN_VERTEX";
  }
}

class BuiltVertexControl implements VertexControl, VertexControlInternal {
  private readonly type = "BUILT_VERTEX";
  constructor(
    readonly game: Game,
    readonly location: VertexLocation,
    private readonly setShowIndicator: Dispatch<SetStateAction<boolean>>
  ) {
    game.control.registerVertex(this);
  }

  showIndicator() {
    this.setShowIndicator(true);
  }

  hideIndicator() {
    this.setShowIndicator(false);
  }

  setBuilding() {
    throw new Error(
      "Cannot place building on built vertex: " + this.location.key()
    );
  }

  removeBuilding() {
    throw new Error(
      "Cannot remove building from built vertex: " + this.location.key()
    );
  }

  onClick() {
    this.game.control.onVertexClick(this.location); 
  }

  static isInstance(control: VertexControl): control is BuiltVertexControl {
    return (control as BuiltVertexControl).type === "BUILT_VERTEX";
  }
}

export function Vertex(props: VertexProps) {
  const { location } = props;
  const game = useContext(GameContext);
  const fixedBuilding = game.state.getFixedBuilding(location);
  if (fixedBuilding) {
    return <BuiltVertex location={props.location} fixedBuilding={fixedBuilding} />;
  }
  if (game.state.isBuildingAllowed(location)) {
    return <OpenVertex location={location} pendingBuilding={game.state.getPendingBuilding(location)} />;
  }
  return <div></div>;
}

// TODO(danielglasgow): Fix Typing
function getStyles(side: "LEFT" | "RIGHT", showIndicator: boolean): any {
  switch (side) {
    case "LEFT":
      return {
        borderRadius: "50%",
        border: showIndicator ? "1px solid black" : "1px solid transparent",
        background: "transparent",
        width: PLACEMENT_INDICATOR_VMIN + "vmin",
        height: PLACEMENT_INDICATOR_VMIN + "vmin",
        left: INDICATOR_X_HEX_LEFT + X_OFFSET + "vmin",
        top: INDICATOR_Y_HEX_TOP - ROAD_SPACING_VMIN / 2 + "vmin",
        position: "absolute",
        zIndex: 1,
      };
    case "RIGHT":
      return {
        borderRadius: "50%",
        border: showIndicator ? "1px solid black" : "1px solid transparent",
        background: "transparent",
        width: PLACEMENT_INDICATOR_VMIN + "vmin",
        height: PLACEMENT_INDICATOR_VMIN + "vmin",
        top: INDICATOR_Y_HEX_TOP - ROAD_SPACING_VMIN / 2 + "vmin",
        left: INDICATOR_X_HEX_RIGHT - X_OFFSET + "vmin",
        position: "absolute",
        zIndex: 1,
      };
  }
}

function BuiltVertex(props: BuiltVertexProps) {
  const game = useContext(GameContext);
  const [showIndicator, setShowIndicator] = useState(false);
  const control = new BuiltVertexControl(game, props.location, setShowIndicator);
  return (
    <div
      style={getStyles(props.location.side, showIndicator)}
      onClick={() => control.onClick()}
    >
      {Building(props.fixedBuilding)}
    </div>
  );
}

function OpenVertex(props: OpenVertexProps) {
  const game = useContext(GameContext);
  const [showIndicator, setShowIndicator] = useState(false);
  const [building, setBuilding] = useState(props.pendingBuilding);
  const control = new OpenVertexControl(
    game,
    props.location,
    setShowIndicator,
    setBuilding
  );
  return (
    <div
      style={getStyles(props.location.side, showIndicator)}
      onClick={() => control.onClick()}
    >
      {building && Building(building)}
    </div>
  );
}


