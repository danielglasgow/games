import { useState } from "react";
import "./App.css";
import Board from "./board";
import { AppControl } from "./control";
import { SidePanel } from "./sidepanel";
import { AppState } from "./types";

function App({ app }: { app: AppState }) {
  const [state, setState] = useState(app);
  const control = new AppControl(state, setState);
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {Board({layout: state.server.board}, control)}
        </div>
        {SidePanel(control)}
      </div>
    </div>
  );
}

export default App;
