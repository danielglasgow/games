import { PlacementAction } from "./actions/placement";
import { BoardControl } from "./board/types";
import { EdgeId, GameState, HexId, VertexId } from "./server/types";
import { AppState } from "./types";

export class AppControl {
  constructor(
    private readonly server: GameState,
    private readonly app: AppState
  ) {}

  private pendingAction?: {confirm: () => Promise<GameState>}; 

  cancel() {
    this.pendingAction = undefined;
  }

  confirm() {
    if (!this.pendingAction) {
      throw new Error('No pending action');
    }
    this.pendingAction?.confirm().then((state) => {
      this.pendingAction = undefined;
    });
  }

  getBoardControl(): BoardControl {
    return {
      clickVertexIndicator: (vertex: VertexId) => {
        this.app.board.hideVertexIndicators();
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
}
