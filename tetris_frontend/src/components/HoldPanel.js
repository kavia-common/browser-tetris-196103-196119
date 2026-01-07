import React from 'react';
import MiniMatrix from './MiniMatrix';

// PUBLIC_INTERFACE
function HoldPanel({ hold, canHold }) {
  /** Shows currently held piece and whether hold is available this turn. */
  return (
    <div className="panel" aria-label="Hold piece">
      <h3 className="panelTitle">Hold</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        {hold ? <MiniMatrix type={hold} /> : <div style={{ color: 'var(--muted)', fontSize: 12 }}>Empty</div>}
        <div style={{ color: canHold ? 'var(--muted)' : 'var(--error)', fontSize: 12 }}>
          {canHold ? 'Press C to hold' : 'Hold used'}
        </div>
      </div>
    </div>
  );
}

export default HoldPanel;
