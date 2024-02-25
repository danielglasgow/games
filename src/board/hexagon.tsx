import {
  HEX_DIAMETER_VMIN,
  HEX_HEIGHT_VMIN,
  HEX_OVERALY_OFFSET_VMIN,
  HEX_SIDE_VMIN,
  ROAD_SPACING_VMIN,
} from "./dimensions";

import brick from "../assets/brick.svg";
import desert from "../assets/desert.svg";
import ocean from "../assets/ocean.svg";
import ore from "../assets/ore.svg";
import sheep from "../assets/sheep.svg";
import wheat from "../assets/wheat.svg";
import wood from "../assets/wood.svg";

import eight from "../assets/numbers/eight.svg";
import eleven from "../assets/numbers/eleven.svg";
import five from "../assets/numbers/five.svg";
import four from "../assets/numbers/four.svg";
import nine from "../assets/numbers/nine.svg";
import six from "../assets/numbers/six.svg";
import ten from "../assets/numbers/ten.svg";
import three from "../assets/numbers/three.svg";
import twelve from "../assets/numbers/twelve.svg";
import two from "../assets/numbers/two.svg";
import {  Hex, HexId, HexState, Number, Resource, isResource } from "./types";

const NUMBER_SIZE_PCT = 50;
const PLACEMENT_INDICATOR_PCT = 20;
const PLACEMENT_INDICATOR_VMIN =
  HEX_DIAMETER_VMIN * (PLACEMENT_INDICATOR_PCT / 100);

const Y_FUGDE = (HEX_DIAMETER_VMIN / HEX_HEIGHT_VMIN - 1) / 2; // I have no idea why this works, but it does
const VERTEX_Y_OFFSET = -1 * (ROAD_SPACING_VMIN / 2) - Y_FUGDE;

const X_FUGDE = 1 - HEX_HEIGHT_VMIN / HEX_DIAMETER_VMIN; // I have no idea why this works, but it does
const LEFT_VERTEX_X_OFFSET = HEX_SIDE_VMIN / 2 - ROAD_SPACING_VMIN - X_FUGDE;
const RIGHT_VERTEX_X_OFFSET = HEX_DIAMETER_VMIN - LEFT_VERTEX_X_OFFSET;

const RESOURCE_BACKGROUNDS: { [key in Resource]: string } = {
  ORE: ore,
  BRICK: brick,
  WHEAT: wheat,
  WOOD: wood,
  SHEEP: sheep,
};

const NUMBER_BACKGROUNDS: { [key in Number]: string } = {
  TWO: two,
  THREE: three,
  FOUR: four,
  FIVE: five,
  SIX: six,
  EIGHT: eight,
  NINE: nine,
  TEN: ten,
  ELEVEN: eleven,
  TWELVE: twelve,
};

export function Spacer({ ratio }: { ratio: number }) {
  const height = (HEX_HEIGHT_VMIN + ROAD_SPACING_VMIN) * ratio;
  return <div style={{ height: height + "vmin" }}></div>;
}

export function Hexagon({ hex }: { hex: Hex }) {
  const layout = hex.layout;
  if (isResource(layout)) {
    return HexContainer(
      ResourceHex(
        {
          background: RESOURCE_BACKGROUNDS[layout.resource],
          number: NUMBER_BACKGROUNDS[layout.number],
        },
        hex.state
      ),
      hex.layout.location
    );
  }
  if (layout.geography === "DESERT") {
    return HexContainer(DesertHex(hex.state), hex.layout.location);
  } else if (layout.geography === "OCEAN") {
    return HexContainer(OceanHex(hex.state), hex.layout.location);
  }
  throw new Error("Unknown hex type");
}

function HexContainer(content: JSX.Element, location: HexId) {
  return (
    <div
      key={`${location.row},${location.col}`}
      style={{
        position: "relative",
        marginTop: ROAD_SPACING_VMIN / 2 + "vmin",
        marginBottom: ROAD_SPACING_VMIN / 2 + "vmin",
        width: HEX_DIAMETER_VMIN + "vmin",
        height: HEX_HEIGHT_VMIN + "vmin",
        marginLeft: HEX_OVERALY_OFFSET_VMIN + "vmin",
      }}
    >
      {content}
    </div>
  );
}

function ResourceHex(
  { background, number }: { background: string; number: string },
  state: HexState
) {
  return (
    <div>
      {HexBackground(background)}
      {HexNumber(number)}
      {VertexIndicators(state)}
    </div>
  );
}

function DesertHex(state: HexState) {
  return (
    <div>
      {HexBackground(desert)}
      {VertexIndicators(state)}
    </div>
  );
}

function OceanHex(state: HexState) {
  return (
    <div>
      {HexBackground(ocean)}
      {VertexIndicators(state)}
    </div>
  );
}

function HexNumber(src: string) {
  return (
    <div>
      <img
        src={src}
        style={{
          verticalAlign: "middle",
          left: (100 - NUMBER_SIZE_PCT) / 2 + "%",
          top: (100 - NUMBER_SIZE_PCT) / 2 + "%",
          width: NUMBER_SIZE_PCT + "%",
          height: NUMBER_SIZE_PCT + "%",
          position: "absolute",
          zIndex: 1,
        }}
      />
    </div>
  );
}

function HexBackground(src: string) {
  return (
    <div>
      <img
        src={src}
        style={{
          verticalAlign: "middle",
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />
    </div>
  );
}

function VertexIndicators(hex: HexState) {
  if (hex.leftVertex === "OPEN" && hex.rightVertex === "OPEN") {
    return (
      <div>
        {LeftVertexIndicator()}
        {RightVertexIndicator()}
      </div>
    );
  }
  if (hex.leftVertex === "OPEN") {
    return <div>{LeftVertexIndicator()}</div>;
  }
  if (hex.rightVertex === "OPEN") {
    return <div>{RightVertexIndicator()}</div>;
  }
  return <div></div>;
}

function LeftVertexIndicator() {
  return (
    <div
      style={{
        borderRadius: "50%",
        border: "1px solid black",
        background: "transparent",
        width: PLACEMENT_INDICATOR_VMIN + "vmin",
        height: PLACEMENT_INDICATOR_VMIN + "vmin",
        left: LEFT_VERTEX_X_OFFSET - PLACEMENT_INDICATOR_VMIN / 2 + "vmin",
        top: VERTEX_Y_OFFSET - PLACEMENT_INDICATOR_VMIN / 2 + "vmin",
        position: "absolute",
        zIndex: 1,
      }}
    ></div>
  );
}

function RightVertexIndicator() {
  return (
    <div
      style={{
        borderRadius: "50%",
        border: "1px solid black",
        background: "transparent",
        width: PLACEMENT_INDICATOR_VMIN + "vmin",
        height: PLACEMENT_INDICATOR_VMIN + "vmin",
        left: RIGHT_VERTEX_X_OFFSET - PLACEMENT_INDICATOR_VMIN / 2 + "vmin",
        top: VERTEX_Y_OFFSET - PLACEMENT_INDICATOR_VMIN / 2 + "vmin",
        position: "absolute",
        zIndex: 1,
      }}
    ></div>
  );
}
