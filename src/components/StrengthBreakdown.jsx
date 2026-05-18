import React, { useState } from 'react';
import { getScoreColor } from '../utils/aiEngine';

export default function StrengthBreakdown({ checks }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="strength-list">
      {checks.map((c) => {
        const icon = c.passed ? '✓' : c.partial ? '◑' : '✗';
        const statusClass = c.passed ? 'pass' : c.partial ? 'warn' : 'fail';
        const pct = Math.round((c.earned / c.weight) * 100);

        return (
          <div
            key={c.id}
            className="strength-item"
            onClick={() => setExpanded(expanded === c.id ? null : c.id)}
            style={{ cursor: 'pointer', flexDirection: 'column', gap: '10px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%' }}>
              <div className={`strength-check ${statusClass}`}>{icon}</div>
              <div className="strength-info">
                <div className="strength-name">{c.name}</div>
                {expanded === c.id && (
                  <div className="strength-note" style={{ marginTop: '4px' }}>
                    {c.note}
                  </div>
                )}
              </div>
              <div
                className="strength-score"
                style={{ color: getScoreColor(pct) }}
              >
                {c.earned}/{c.weight}
              </div>
            </div>
            <div className="progress-track" style={{ margin: '0 0 0 42px' }}>
              <div
                className="progress-fill"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${getScoreColor(pct)}, ${getScoreColor(pct)}AA)`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
