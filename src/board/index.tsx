import wood from '../assets/wood.svg';
import { Hexagon, Spacer, Y_OVERALY_OFFSET } from './tile';


export default function Board() {
  return <div id="board">
    <div style={{ display: "flex", flexDirection: "row", paddingLeft: (Y_OVERALY_OFFSET * -1) + "vmin" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {Spacer({ ratio: 1 })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {Spacer({ ratio: 0.5 })}
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
        {Spacer({ ratio: 0.5 })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {Spacer({ ratio: 1 })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
        {Hexagon({ src: wood })}
      </div>
    </div>
  </div>
}