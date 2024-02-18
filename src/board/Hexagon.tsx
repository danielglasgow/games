import { SCALE } from './dimensions';

const X_Y_RATIO = 1.1568;
const Y_OFFSET_RATIO = 0.22;
const SPACING_RATIO = 0.02;
const SPACING = SCALE * SPACING_RATIO;
const X = SCALE;
const Y = SCALE / X_Y_RATIO;

export function Spacer({ ratio }: { ratio: number }) {
  const height = (Y + 2 * SPACING) * ratio;
  return <div style={{ height: height + "vmin" }}></div>
}

export function Hexagon({ src }: { src: string }) {
  const marginLeft = -1 * (SCALE * Y_OFFSET_RATIO - (SPACING * 2)) + "vmin";
  return <div>
    <img src={src} style={{ verticalAlign: "middle", marginTop: SPACING + "vmin", marginBottom: SPACING + "vmin", width: X + "vmin", marginLeft }} />
  </div>
}