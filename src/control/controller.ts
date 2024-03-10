import { GameState, VertexId } from "../server/types";

type EventType = "VERTEX_CLICKED" | "SERVER_STATE_UPDATED";

class Event<T> {
  constructor(readonly type: EventType) {}
}

type EventHandlerFn<T> = (data: T) => boolean;

interface EventHandler<T> {
  readonly event: Event<T>;
  readonly fn: EventHandlerFn<T>;
}

export const events = {
  VERTEX_CLICKED: new Event<VertexId>("VERTEX_CLICKED"),
  SERVER_STATE_UPDATED: new Event<GameState>("SERVER_STATE_UPDATED"),
};

export abstract class Controller {
  private readonly handlers: EventHandler<unknown>[] = [];
  // private readonly children: Controller[] = [];

  constructor(private readonly parent?: Controller) {
    //parent?.children.push(this);
  }

  protected listen<T>(event: Event<T>, fn: EventHandlerFn<T>) {
    const handler = this.getHandler(event);
    if (!handler) {
      this.handlers.push({ event, fn } as EventHandler<unknown>);
    } else {
      throw new Error("Listener already registered for event: " + event.type);
    }
  }

  protected unlisten(type: Event<object>) {
    // TODO(danielglasgow): Implmenent
  }

  /*sendDown<T>(event: Event<T>, data: T) {
    for (const child of this.children) {
      child.handleDown(event, data);
    }
  }

  private handleDown<T>(event: Event<T>, data: T) {
    const result = this.handle(event, data);
    if (!result) {
      this.sendDown(event, data);
    }
  }*/

  sendUp<T>(event: Event<T>, data: T) {
    console.log("SEND UP: " + event.type + " data: " + data);
    if (!this.parent) {
      throw new Error(
        "Base controller received unhandled event: " + event.type
      );
    }
    this.parent.handleUp(event, data);
  }

  private handleUp<T>(event: Event<T>, data: T) {
    const result = this.handle(event, data);
    if (!result) {
      this.sendUp(event, data);
    }
  }

  private handle<T>(event: Event<T>, data: T) {
    const handler = this.getHandler(event);
    if (handler) {
      return handler.fn(data);
    }
    return false;
  }

  private getHandler<T>(event: Event<T>): EventHandler<T> | undefined {
    for (const handler of this.handlers) {
      if (handler.event.type === event.type) {
        return handler;
      }
    }
  }
}
