import { BoardControl } from "../board/control";
import { SERVER } from "../server/fake";
import { GameState, VertexId } from "../server/types";
import { SidePanelControl } from "../sidepanel";

interface Action<Input, Output> {
  execute(input: Input): Promise<Output>;
}

export class PlacementAction {
  private vertex?: VertexId;

  startConfirmPlacement(vertex: VertexId) {
    this.vertex = vertex;
  }

  confirm(): Promise<GameState> {
    if (!this.vertex) {
      throw new Error("Attempt to place settlement with no location");
    }
    return SERVER.placeSettlement(this.vertex);
  }
}

export class ConfirmSettlement implements Action<VertexId, void | GameState> {
  constructor(private readonly sidepanel: SidePanelControl) {}

  async execute(input: VertexId) {
    const result = await this.sidepanel.confirmResult();
    if (result) {
      return SERVER.placeSettlement(input);
    }
  }
}

export class PlaceInitialSettlement implements Action<null, VertexId> {
  constructor(private readonly board: BoardControl) {}

  async execute() {
    console.log("EXECUTE ACTION");
    this.board.showAllVertexIndicators();
    console.log("DONE BOARD SHOW VERTEX INDEICATORS");
    //this.board.showVertexIndicators(legalPlacementVertecies(this.state));
    const vertexId = await this.board.nextVertexSelection();
    console.log("NEXT VERTEX SELECTION");
    this.board.setBuilding(vertexId, "SETTLEMENT");
    this.board.hideVertexIndicators();
    return Promise.resolve(vertexId);
  }
}

export function chain<T>(
  startAction: Action<null, T>,
  endAction: Action<T, void | GameState>
) {
  const execute = async () => {
    const result = await startAction.execute(null);
    return endAction.execute(result);
  };
  return { execute };
}

function legalPlacementVertecies(state: GameState) {
  return [];
}
