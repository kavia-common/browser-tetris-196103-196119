import React from 'react';

// PUBLIC_INTERFACE
function Overlay({
  title,
  text,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimary,
  onSecondary,
  showPrimary = true,
}) {
  /** Modal-like overlay displayed on top of the board for pause/game-over states. */
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="overlayCard">
        <h2 className="overlayTitle">{title}</h2>
        <p className="overlayText">{text}</p>
        <div className="actions" style={{ justifyContent: 'center' }}>
          {showPrimary && (
            <button className="btn btnPrimary" onClick={onPrimary} type="button">
              {primaryActionLabel}
            </button>
          )}
          <button className="btn btnDanger" onClick={onSecondary} type="button">
            {secondaryActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Overlay;
