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


export class ConfirmSettlement implements Action<VertexId, void|GameState> {
  constructor(
    private readonly board: BoardControl,
    private readonly sidepanel: SidePanelControl
  ) {}

  async execute(input: VertexId) {
    const result = await this.sidepanel.confirmResult();
    if (result) {
      return SERVER.placeSettlement(input);
    } 
    return Promise.resolve();
  }
}

export class PlaceInitialSettlement implements Action<never, VertexId> {
  constructor(
    private readonly board: BoardControl,
    private readonly state: GameState
  ) {}

  async execute() {
    this.board.showVertexIndicators(legalPlacementVertecies(this.state));
    const vertexId = await this.board.nextVertexSelection();
    this.board.setBuilding(vertexId, "SETTLEMENT");
    return Promise.resolve(vertexId);
  }
}

function legalPlacementVertecies(state: GameState) {
  return [];
}
