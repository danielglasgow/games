import { HEX_DIAMETER_VMIN, HEX_OVERALY_OFFSET_VMIN, ROAD_SPACING_VMIN, HEX_HEIGHT_VMIN } from "./dimensions";


export function Spacer({ ratio }: { ratio: number }) {
  const height = (HEX_HEIGHT_VMIN + ROAD_SPACING_VMIN) * ratio;
  return <div style={{ height: height + "vmin" }}></div>;
}

export function Hexagon({ src }: { src: string }) {
  return (
    <div>
      <img
        src={src}
        style={{
          verticalAlign: "middle",
          marginTop: (ROAD_SPACING_VMIN / 2) + "vmin",
          marginBottom: (ROAD_SPACING_VMIN / 2) + "vmin",
          width: HEX_DIAMETER_VMIN + "vmin",
          marginLeft: HEX_OVERALY_OFFSET_VMIN + "vmin",
        }}
      />
    </div>
  );
}
