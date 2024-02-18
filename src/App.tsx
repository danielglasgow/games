import './App.css';
import Board from './board';

function App() {
  return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    {Board()}
  </div>
}

export default App;
