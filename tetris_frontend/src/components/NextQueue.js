import React from 'react';
import MiniMatrix from './MiniMatrix';

// PUBLIC_INTERFACE
function NextQueue({ nextQueue }) {
  /** Shows upcoming pieces (preview). */
  const items = nextQueue.slice(0, 3);

  return (
    <div className="panel" aria-label="Next pieces">
      <h3 className="panelTitle">Next</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        {items.map((type, idx) => (
          <MiniMatrix key={`${type}-${idx}`} type={type} />
        ))}
      </div>
    </div>
  );
}

export default NextQueue;
