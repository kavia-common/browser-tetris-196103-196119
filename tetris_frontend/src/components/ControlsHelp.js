import React from 'react';

// PUBLIC_INTERFACE
function ControlsHelp() {
  /** Minimal in-app help showing keyboard controls. */
  return (
    <div className="help" aria-label="Controls help">
      <h3>Controls</h3>
      <ul>
        <li><kbd>←</kbd>/<kbd>→</kbd> move</li>
        <li><kbd>↓</kbd> soft drop</li>
        <li><kbd>Space</kbd> hard drop</li>
        <li><kbd>↑</kbd> rotate CW</li>
        <li><kbd>Z</kbd> rotate CCW, <kbd>X</kbd> rotate CW</li>
        <li><kbd>C</kbd> hold</li>
        <li><kbd>P</kbd> pause/resume</li>
      </ul>
    </div>
  );
}

export default ControlsHelp;
