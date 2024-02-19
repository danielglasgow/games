import {
  HEX_DIAMETER_VMIN,
  HEX_HEIGHT_VMIN,
  HEX_OVERALY_OFFSET_VMIN,
  ROAD_SPACING_VMIN,
} from "./dimensions";

import brick from "../assets/brick.svg";
import desert from "../assets/desert.svg";
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
import { Number, Resource, Tile } from "./types";

const NUMBER_SIZE_PCT = 50;

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

export function Hexagon({ tile }: { tile: Tile }) {
  if (tile === "DESERT") {
    return Hex({ background: desert });
  } else {
    return Hex({
      background: RESOURCE_BACKGROUNDS[tile.resource],
      number: NUMBER_BACKGROUNDS[tile.number],
    });
  }
}

function Hex(content: { background: string; number?: string }) {
  return (
    <div
      style={{
        position: "relative",
        marginTop: ROAD_SPACING_VMIN / 2 + "vmin",
        marginBottom: ROAD_SPACING_VMIN / 2 + "vmin",
        width: HEX_DIAMETER_VMIN + "vmin",
        height: HEX_HEIGHT_VMIN + "vmin",
        marginLeft: HEX_OVERALY_OFFSET_VMIN + "vmin",
      }}
    >
      {InnerHex(content)}
    </div>
  );
}

function InnerHex({
  background,
  number,
}: {
  background: string;
  number?: string;
}) {
  if (number) {
    return (
      <div>
        {HexBackground(background)}
        {HexNumber(number)}
      </div>
    );
  } else {
    return <div>{HexBackground(background)}</div>;
  }
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
