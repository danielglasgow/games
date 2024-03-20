import city from "../assets/buildings/blue/city.svg";
import settlement from "../assets/buildings/blue/settlement.svg";
import { Building as BuildingType } from "../server/types";
import { PLACEMENT_INDICATOR_VMIN } from "./dimensions";

export function Building(building: BuildingType) {
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
