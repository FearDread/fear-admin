import React from 'react';

const STREAKS = 25; // matches the 25 :nth-child rules in dark-theme.css

/** Animated black aurora. Render once near the root of the layout. */
const Aurora = () => (
    <div className="aurora-bg" aria-hidden="true">
        {Array.from({ length: STREAKS }, (_, i) => (
            <div className="rainbow" key={i} />
        ))}
        <div className="h" />
        <div className="v" />
    </div>
);

export default Aurora;