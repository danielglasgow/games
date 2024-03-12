import { Dispatch, SetStateAction, useState } from "react";
import { AppControl } from "./control";
import { Controller } from "./control/controller";
import { CONTROL_MANAGER } from "./control/manager";

interface SidePanelState {
  showConfirm: boolean;
}

export class SidePanelControl extends Controller {
  constructor(
    parent: Controller,
    private readonly state: SidePanelState,
    private readonly setState: Dispatch<SetStateAction<SidePanelState>>
  ) {
    super(parent);
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


export function SidePanel(app: AppControl) {
  const [state, setState] = useState({showConfirm: false});
  const control = new SidePanelControl(app, state, setState);
  app.registerSidepanelControl(control);
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
      <button style={{ margin: "10px", width: "20vmin" }} onClick={() => CONTROL_MANAGER.hideAllVertexIndicators()}>
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
