import { Dispatch, SetStateAction, useContext, useState } from "react";
import { GameContext } from "./game/context";

interface SidePanelState {
  showConfirm: boolean;
}

export class SidePanelControl {
  constructor(
    private readonly state: SidePanelState,
    private readonly setState: Dispatch<SetStateAction<SidePanelState>>
  ) {
  }

  private confirmResolver: (isConfirmed: boolean) => void = () => {};

  confirmResult() {
    this.setState({...this.state, showConfirm: true});
    return new Promise((resolve) => {
      this.confirmResolver = resolve;
    });
  }

  // Figure out how to make these private
  cancel() {
    this.confirmResolver(false);
  }

  confirm() {
    this.confirmResolver(true);
  }
}


export function SidePanel() {
  const game = useContext(GameContext);
  const [state, setState] = useState({showConfirm: false});
  const control = new SidePanelControl(state, setState);
  return (
    <div
      id="actionbox"
      style={{
        marginLeft: "10vmin",
        width: "30vmin",
        height: "80vmin",
        background: "#f6b26bff",
        float: "right",
      }}
    >
      <button style={{ margin: "10px", width: "20vmin" }}>
        Place Settlement
      </button>
      <button style={{ margin: "10px", width: "20vmin" }}>Place City</button>
      <button style={{ margin: "10px", width: "20vmin" }}>Place Road</button>
      <button style={{ margin: "10px", width: "20vmin" }} onClick={() => game.control.hideAllVertexIndicators()}>
        Turn Off All Vertex Indicators 
      </button>
      <div>
        {state.showConfirm && (
          <button
            style={{ margin: "10px", width: "20vmin" }}
            onClick={() => control.cancel()}
          >
            Confirm
          </button>
        )}
        {state.showConfirm && (
          <button
            style={{ margin: "10px", width: "20vmin" }}
            onClick={() => control.confirm()}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
