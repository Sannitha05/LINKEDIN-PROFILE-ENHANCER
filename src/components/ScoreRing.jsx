import React, { useEffect, useState } from 'react';
import { getScoreColor, getScoreLabel, getScoreLabelColor } from '../utils/aiEngine';

const RADIUS = 65;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreRing({ score, size = 160 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const badgeClass = getScoreLabelColor(score);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = CIRCUMFERENCE - (animatedScore / 100) * CIRCUMFERENCE;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-block',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color + 'AA'} />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx="80"
          cy="80"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
        />

        {/* Progress arc */}
        <circle
          cx="80"
          cy="80"
          r={RADIUS}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'url(#glow)',
          }}
        />
      </svg>

      {/* Center text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '36px',
            fontWeight: '800',
            color: color,
            lineHeight: 1,
            transition: 'color 0.5s ease',
          }}
        >
          {animatedScore}
        </div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--text-muted)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          / 100
        </div>
        <span className={`badge ${badgeClass}`} style={{ fontSize: '10px', padding: '2px 8px', marginTop: '2px' }}>
          {label}
        </span>
      </div>
    </div>
  );
}
