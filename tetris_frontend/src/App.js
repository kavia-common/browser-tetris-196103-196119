import React from 'react';
import './App.css';
import Game from './pages/Game';

// PUBLIC_INTERFACE
function App() {
  /** Root application component for the browser-based Tetris game. */
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
