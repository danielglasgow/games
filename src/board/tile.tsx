import { SCALE } from './dimensions';

const X_Y_RATIO = 1.1568;
const X = SCALE;
const Y = SCALE / X_Y_RATIO;

const Y_SPACING_RATIO = 0.02;
const Y_SPACING = SCALE * Y_SPACING_RATIO;

const Y_OVERLAY_OFFSET_RATIO = 0.22;
export const Y_OVERALY_OFFSET = -1 * (SCALE * Y_OVERLAY_OFFSET_RATIO - (Y_SPACING * 2));

export function Spacer({ ratio }: { ratio: number }) {
  const height = (Y + 2 * Y_SPACING) * ratio;
  return <div style={{ height: height + "vmin" }}></div>
}

export function Hexagon({ src }: { src: string }) {
  return <div>
    <img src={src} style={{ verticalAlign: "middle", marginTop: Y_SPACING + "vmin", marginBottom: Y_SPACING + "vmin", width: X + "vmin", marginLeft: Y_OVERALY_OFFSET + "vmin" }} />
  </div>
}