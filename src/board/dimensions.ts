const SCALE = 0.7; // 0-1 -- must correspond to grid percentage in App.tsx
const ROAD_FACTOR = 0.92;
const BUFFER_VMIN = 2; // Extra space around the board to ensure all tiles fit at scale 1.0
const ROWS = 7;
const COLUMNS = 7;
const PLACEMENT_INDICATOR_PCT = 20;
const ROAD_LENGTH_PCT = 40;

// DO NOT TUNE BELOW HERE

/** How much space between hexagons tiles (i.e the width of a road). */
export const ROAD_SPACING_VMIN = SCALE * ROAD_FACTOR;

// How far to shift hexagons to maintain road spacing for roads that do not run directly east-west
export const ROAD_OVERLAY_OFFSET_VMIN = ROAD_SPACING_VMIN * Math.sqrt(3);

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

////// INDICATOR DIMENSIONS /////////

export const PLACEMENT_INDICATOR_VMIN =
  HEX_DIAMETER_VMIN * (PLACEMENT_INDICATOR_PCT / 100);

export const ROAD_LENGTH_VMIN = HEX_DIAMETER_VMIN * (ROAD_LENGTH_PCT / 100);

// Moves the indicator outside the top of the hex box
const OUTSIDE_TOP = -1 * PLACEMENT_INDICATOR_VMIN;
// Moves the indicator outside to the left side of the hex box
const OUTSIDE_LEFT = -1 * PLACEMENT_INDICATOR_VMIN;
// Moves the indicator outside the right side of the hex box
const OUTSIDE_RIGHT = HEX_DIAMETER_VMIN;

/**
 * Placement indicator positioned so the hex box's top border splits the indicator
 * (i.e. so that the indicator could be foldered over the X axis)
 */
export const INDICATOR_Y_HEX_TOP = OUTSIDE_TOP + PLACEMENT_INDICATOR_VMIN / 2;

/**
 * Placement indicator positioned so the hex box's left border splits the indicator
 * (i.e. so that the indicator could be foldered over the Y axis)
 */
export const INDICATOR_X_HEX_LEFT = OUTSIDE_LEFT + PLACEMENT_INDICATOR_VMIN / 2;

/**
 * Placement indicator positioned so the hex box's right border splits the indicator
 * (i.e. so that the indicator could be foldered over the Y axis)
 */
export const INDICATOR_X_HEX_RIGHT =
  OUTSIDE_RIGHT - PLACEMENT_INDICATOR_VMIN / 2;

/**
 * Placement indicator positioned so the left/right middle of the hex box splits the indicator
 * (i.e. so that the indicator could be foldered over the Y axis)
 */
export const INDICATOR_X_HEX_MIDDLE =
  INDICATOR_X_HEX_LEFT + HEX_DIAMETER_VMIN / 2;
