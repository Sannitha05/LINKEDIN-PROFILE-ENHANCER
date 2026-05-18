import React from 'react';
import ScoreRing from './ScoreRing';
import StrengthBreakdown from './StrengthBreakdown';
import { getScoreColor } from '../utils/aiEngine';

const METRICS = [
  { id: 'visibility', icon: '👁️', name: 'Recruiter Visibility', max: 100 },
  { id: 'ats', icon: '🤖', name: 'ATS Compatibility', max: 100 },
  { id: 'completeness', icon: '📊', name: 'Profile Completeness', max: 100 },
  { id: 'engagement', icon: '💬', name: 'Engagement Potential', max: 100 },
];

export default function ScorePanel({ score, checks, metrics = {} }) {
  const activeMetrics = {
    visibility: metrics.visibility ?? Math.min(100, Math.round(score * 0.95)),
    ats: metrics.ats ?? Math.min(100, Math.round(score * 0.9)),
    completeness: metrics.completeness ?? Math.min(100, Math.round(score * 1.02)),
    engagement: metrics.engagement ?? Math.min(100, Math.round(score * 0.85)),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Overall Score */}
      <div className="score-panel">
        <div className="score-panel-title">Profile Strength Score</div>
        <div className="score-ring-container">
          <ScoreRing score={score} />
        </div>

        {/* Sub-metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {METRICS.map((m) => {
            const val = activeMetrics[m.id];
            return (
              <div key={m.id} className="metric-row">
                <span className="metric-icon">{m.icon}</span>
                <div className="metric-info">
                  <div className="metric-name">{m.name}</div>
                  <div className="metric-bar-wrapper">
                    <div className="progress-track" style={{ flex: 1 }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${val}%`,
                          background: `linear-gradient(90deg, ${getScoreColor(val)}, ${getScoreColor(val)}88)`,
                        }}
                      />
                    </div>
                    <span className="metric-score">{val}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown */}
      <div className="glass-card" style={{ padding: '22px' }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          📋 Score Breakdown
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>
            Click to see tips
          </span>
        </div>
        <StrengthBreakdown checks={checks} />
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(10,102,194,0.1), rgba(99,102,241,0.08))',
          border: '1px solid rgba(10,102,194,0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}
        >
          🎯 Quick Wins
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {checks
            .filter((c) => !c.passed)
            .slice(0, 3)
            .map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}
              >
                <span style={{ color: 'var(--warning)', marginTop: '1px', flexShrink: 0 }}>→</span>
                <span>{c.note}</span>
              </div>
            ))}
          {checks.filter((c) => !c.passed).length === 0 && (
            <div style={{ fontSize: '13px', color: 'var(--success-light)', textAlign: 'center' }}>
              🎉 All criteria met! Great profile!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
