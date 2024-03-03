import { Dispatch, SetStateAction } from "react";
import { Action } from "./actions";
import { Controller } from "./control/controller";
import { GameState } from "./server/types";
import { AppState } from "./types";

export class AppControl extends Controller {
  constructor(
    private readonly app: AppState,
    private readonly setState: Dispatch<SetStateAction<AppState>>
  ) {
    super()
  }

  private actionResolver: (action: Action) => void = () => {};

  async startGameLoop() {
    while (true) {
      const action = await this.nextAction();
      const server = await action.execute();
      if (server) {
        this.setState({...this.app, server})
      } else {
        // clear out any partial state leftover from an incomplete action
        this.setState({...this.app});
      }
    }
  }

  private async nextAction(): Promise<Action> {
    return new Promise(resolve => {
      this.actionResolver = resolve;
    });
  }

  private setAction(action: Action) {
    this.actionResolver(action);
  }

  private lock() {
    this.setState({ ...this.app, isLocked: true });
  }

  private unlock() {
    this.setState({ ...this.app, isLocked: false });
  }
}
