import { Dispatch, SetStateAction } from "react";
import { PlacementAction } from "./actions/placement";
import { BoardControl } from "./board/types";
import { EdgeId, GameState, HexId, VertexId } from "./server/types";
import { AppState } from "./types";

export class AppControl {
  constructor(
    private readonly app: AppState,
    private readonly setState: Dispatch<SetStateAction<AppState>>
  ) {}

  private pendingAction?: { confirm: () => Promise<GameState> };

  cancel() {
    this.pendingAction = undefined;
  }

  confirm() {
    if (!this.pendingAction) {
      throw new Error("Cannot confirm without a pending action");
    }
    const statePromise = this.pendingAction.confirm();
    this.lock();
    this.setState({ ...this.app });
    this.pendingAction = undefined;
    statePromise.then((state) => {
      this.unlock();
      this.updateServerState(state);
    });
  }

  placeSettlement() {
    this.setState({
      ...this.app,
      activeAction: "PLACE_SETTLEMENT",
      board: this.app.board.update({
        indicators: { vertex: true, roads: false },
      }),
    });
  }

  getBoardControl(): BoardControl {
    return {
      clickVertexIndicator: (vertex: VertexId) => {
        this.hideVertexIndicators();
        switch (this.app.activeAction) {
          case "PLACE_SETTLEMENT":
            const action = new PlacementAction();
            action.startConfirmPlacement(vertex);
            this.pendingAction = action;
        }
      },
      clickEdgeIndicator: (road: EdgeId) => {},
      clickHex: (hex: HexId) => {},
    };
  }

  private hideVertexIndicators() {
    this.setState({
      ...this.app,
      board: this.app.board.update({
        indicators: { vertex: false, roads: false },
      }),
    });
  }

  private showVertexIndicators() {
    this.setState({
      ...this.app,
      board: this.app.board.update({
        indicators: { vertex: true, roads: false },
      }),
    });
  }

  private updateServerState(server: GameState) {
    this.setState({
      ...this.app,
      server,
      board: this.app.board.update(server),
    });
  }

  private lock() {
    this.setState({ ...this.app, isLocked: true });
  }

  private unlock() {
    this.setState({ ...this.app, isLocked: false });
  }
}
