import { VertexLocation } from "../board";
import {
  Building,
  GameState as ServerGameState,
  VertexId,
} from "../server/types";

export interface GameState {
  getFixedBuilding(vertex: VertexLocation): Building | undefined;
  getPendingBuilding(vertex: VertexLocation): Building | undefined;
  getVertecies(): ReadonlyArray<VertexLocation>;
  isBuildingAllowed(vertex: VertexLocation): boolean;
  isEmpty(vertex: VertexLocation): boolean;
}

export function createGameState(state: ServerGameState): GameState {
  return new ServerGameStateWrapper(state);
}

export function createUninitializedGameState(): GameState {
  return new UninitiliazedGameState();
}

class UninitiliazedGameState implements GameState {
  getFixedBuilding(vertex: VertexLocation): Building | undefined {
    throw new Error("GameState not initialized");
  }
  getPendingBuilding(vertex: VertexLocation): Building | undefined {
    throw new Error("GameState not initialized");
  }
  getVertecies(): VertexLocation[] {
    throw new Error("GameState not initialized");
  }
  isBuildingAllowed(vertex: VertexLocation): boolean {
    throw new Error("GameState not initialized");
  }
  isEmpty(vertex: VertexLocation): boolean {
    throw new Error("GameState not initialized");
  }
  isVertexPlacementActive(): boolean {
    throw new Error("GameState not initialized");
  }
}

class ServerGameStateWrapper implements GameState {
  constructor(private readonly state: ServerGameState) {}

  getTurn() {
    return this.state.turn;
  }

  getFixedBuilding(vertex: VertexLocation): Building | undefined {
    const settlement = byLocation(this.state.settlements).get(vertex);
    const city = byLocation(this.state.cities).get(vertex);
    if (settlement && city) {
      throw new Error(
        "Illegal board state, found both settlement and city on vertex: " +
          vertex
      );
    }
    if (settlement) {
      return "SETTLEMENT";
    }
    if (city) {
      return "CITY";
    }
  }

  getPendingBuilding(vertex: VertexLocation): Building | undefined {
    return undefined;
  }

  getVertecies() {
    return this.state.board.vertices.map((v) => new VertexLocation(v));
  }

  isBuildingAllowed(vertex: VertexLocation) {
    if (vertex.isExteriorOf(this.state.board)) {
      return false;
    }
    return vertex.adjacentVertecies().every((v) => this.isEmpty(v));
  }

  isEmpty(vertex: VertexLocation) {
    return (
      byLocation(this.state.settlements)
        .values()
        .every((location) => !location.equals(vertex)) &&
      byLocation(this.state.cities)
        .values()
        .every((location) => !location.equals(vertex))
    );
  }

  private cityLocations() {
    return this.state.cities.map((c) => new VertexLocation(c.location));
  }

  private settlementLocations() {
    return this.state.settlements.map((s) => new VertexLocation(s.location));
  }
}

class ByLocation<T> {
  constructor(
    private readonly array: ReadonlyArray<VertexLocation>,
    private readonly map: { [k: string]: T }
  ) {}
  get(location: VertexLocation) {
    return this.map[location.key()];
  }
  values(): ReadonlyArray<VertexLocation> {
    return this.array;
  }
}

function byLocation<T extends { location: VertexId }>(array: ReadonlyArray<T>) {
  const locations: { [k: string]: T } = {};
  const values: VertexLocation[] = [];
  for (const x of array) {
    const location = new VertexLocation(x.location);
    locations[location.key()] = x;
    values.push(location);
  }
  return new ByLocation(Object.freeze(values), Object.freeze(locations));
}
