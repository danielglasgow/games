import { Dispatch, SetStateAction } from "react";
import { Action } from "./actions";
import { Controller } from "./control/controller";
import { SidePanelControl } from "./sidepanel";
import { AppState } from "./types";

export class AppControl extends Controller {
  constructor(
    private app: AppState|null,
    private setState: Dispatch<SetStateAction<AppState>>|null
  ) {
    super();
  }

  private actionResolver: (action: Action) => void = () => {};
  private sidepanel: SidePanelControl | null = null;

  register(app: AppState, setState: Dispatch<SetStateAction<AppState>>) {
    this.app = app;
    this.setState = setState;
  }


  private async nextAction(): Promise<Action> {
    return new Promise((resolve) => {
      this.actionResolver = resolve;
    });
  }

  private setAction(action: Action) {
    //this.actionResolver(action);
  }

  /*private lock() {
    this.setState({ ...this.app, isLocked: true });
  }

  private unlock() {
    this.setState({ ...this.app, isLocked: false });
  }*/

  registerSidepanelControl(sidepanel: SidePanelControl) {
    this.sidepanel = sidepanel;
  }
}
