import './App.css';
import wood from './assets/wood.svg';
import {Hexagon, Spacer} from './board/Hexagon';

const UNIT = "vmin"
const HEX_WIDTH = 20;
const HEX_X_Y_RATIO = 1.1568;
const SPACING_RATIO = 0.02;
const SPACING = HEX_WIDTH * SPACING_RATIO
const HEX_SIZE = HEX_WIDTH + UNIT;
const Y_HEIGHT = HEX_WIDTH / HEX_X_Y_RATIO;
const SHIFT = Y_HEIGHT / 2 - (HEX_WIDTH * 0.008);

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {Spacer({ratio: 1})}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {Spacer({ratio: 0.5})}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {Spacer({ratio: 0.5})}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {Spacer({ratio: 1})}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
      </div>
    </div>
  );
}

export default App;
