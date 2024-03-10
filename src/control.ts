import { Dispatch, SetStateAction } from "react";
import { Action } from "./actions";
import {
  ConfirmSettlement,
  PlaceInitialSettlement,
  chain,
} from "./actions/placement";
import { BoardControl } from "./board/control";
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
  private board: BoardControl | null = null;
  private sidepanel: SidePanelControl | null = null;

  register(app: AppState, setState: Dispatch<SetStateAction<AppState>>) {
    this.app = app;
    this.setState = setState;
  }

  async startInitialPlacement() {
    console.log("START PLACE SETTLEMENT");
    if (this.board == null) {
      throw new Error("Cannot start initial placement if board is unset");
    }
    if (this.sidepanel == null) {
      throw new Error("Cannot start intial placement if sidepanel is unset");
    }
    const action = chain(
      new PlaceInitialSettlement(this.board),
      new ConfirmSettlement(this.sidepanel)
    );
    const server = await action.execute();
    console.log("EXECUTE DONE");
    if (server) {
      //this.setState({ ...this.app, server });
    } else {
      // clear out any partial state leftover from an incomplete action
      //this.setState({ ...this.app });
    }
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

  registerBoardControl(board: BoardControl) {
    this.board = board;
  }

  registerSidepanelControl(sidepanel: SidePanelControl) {
    this.sidepanel = sidepanel;
  }
}
