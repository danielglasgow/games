const SCALE = 0.75; // 0-1
const ROAD_FACTOR = 0.92;
const BUFFER_VMIN = 2; // Extra space around the board to ensure all tiles fit at scale 1.0
const ROWS = 7;
const COLUMNS = 7;

// DO NOT TUNE BELOW HERE

/** How much space between hexagons tiles (i.e the width of a road). */
export const ROAD_SPACING_VMIN = SCALE * ROAD_FACTOR;

// How far to shift hexagons to maintain road spacing for roads that do not run directly east-west
const ROAD_OVERLAY_OFFSET_VMIN = ROAD_SPACING_VMIN * Math.sqrt(3);

const BOARD_SIZE_VMIN = (100 - BUFFER_VMIN) * SCALE;

const ROWS_ROAD_COUNT = ROWS - 1;
// The height of the board, measured in hexagon sides
const HEIGHT_HEX_SIDE = Math.sqrt(3) * ROWS;
// How many vmin a hexagon side should be, if the board is to be scaled based on its vertical size
const ROW_HEX_SIDE_VMIN =
  (BOARD_SIZE_VMIN - ROWS_ROAD_COUNT * ROAD_SPACING_VMIN) / HEIGHT_HEX_SIDE;

const COLUMNS_ROAD_COUNT = COLUMNS - 1;
// The width of the board, measured in hexagon sides
const WIDTH_HEX_SIDE = 2 + (COLUMNS - 1) * (3 / 2);
// How many vmin a hexagon side should be, if the board is to be scaled based on its horizontal size
const COLUMN_HEX_SIDE_VMIN =
  (BOARD_SIZE_VMIN - COLUMNS_ROAD_COUNT * ROAD_OVERLAY_OFFSET_VMIN) /
  WIDTH_HEX_SIDE;

/** Length of on the six sides of a hexagon */
export const HEX_SIDE_VMIN = Math.min(ROW_HEX_SIDE_VMIN, COLUMN_HEX_SIDE_VMIN);

export const HEX_HEIGHT_VMIN = HEX_SIDE_VMIN * Math.sqrt(3);

/** Distance between two opposite points on a hexagon. */
export const HEX_DIAMETER_VMIN = 2 * HEX_SIDE_VMIN;

/** How much to shift hexagon columns so that they fit together, with spacing left over for roads. */
export const HEX_OVERALY_OFFSET_VMIN =
  -1 * (HEX_SIDE_VMIN / 2 - ROAD_OVERLAY_OFFSET_VMIN);
