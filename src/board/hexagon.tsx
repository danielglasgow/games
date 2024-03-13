import {
  HEX_DIAMETER_VMIN,
  HEX_HEIGHT_VMIN,
  HEX_OVERALY_OFFSET_VMIN,
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
import {
  HexId,
  HexLayout,
  Number,
  Resource,
  VertexId,
  isResource,
} from "../server/types";
import { Vertex } from "./vertex";

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

interface HexProps {
  layout: HexLayout;
}

interface HexState {
  isBlocked: false;
}

export function Hexagon(props: HexProps) {
  // const [state, setState] = useState({ isBlocked: false });
  const layout = props.layout;
  if (isResource(layout)) {
    return HexContainer(
      ResourceHex({
        background: RESOURCE_BACKGROUNDS[layout.resource],
        number: NUMBER_BACKGROUNDS[layout.number],
      }),
      layout.location
    );
  }
  if (layout.geography === "DESERT") {
    return HexContainer(HexBackground(desert), layout.location);
  } else if (layout.geography === "OCEAN") {
    return HexContainer(HexBackground(ocean), layout.location);
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
      <Vertex location={new VertexId(location, "LEFT")} />
      <Vertex location={new VertexId(location, "RIGHT")} />
    </div>
  );
}

function ResourceHex({
  background,
  number,
}: {
  background: string;
  number: string;
}) {
  return (
    <div>
      {HexBackground(background)}
      {HexNumber(number)}
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
