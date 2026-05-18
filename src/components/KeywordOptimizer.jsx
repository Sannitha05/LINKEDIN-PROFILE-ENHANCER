import React, { useState } from 'react';
import { ATS_KEYWORDS } from '../utils/aiEngine';

const CATEGORIES = [
  { key: 'tech', label: '⚡ Technical', color: 'var(--primary-light)' },
  { key: 'soft', label: '🤝 Soft Skills', color: 'var(--accent-light)' },
  { key: 'business', label: '📊 Business', color: 'var(--success-light)' },
];

export default function KeywordOptimizer({ selected, onToggle }) {
  const [activeCategory, setActiveCategory] = useState('tech');
  const [search, setSearch] = useState('');

  const keywords = ATS_KEYWORDS[activeCategory].filter((k) =>
    k.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className="btn btn-sm"
            style={{
              background:
                activeCategory === cat.key
                  ? 'rgba(10,102,194,0.2)'
                  : 'transparent',
              border: `1px solid ${
                activeCategory === cat.key ? 'rgba(10,102,194,0.5)' : 'var(--border)'
              }`,
              color:
                activeCategory === cat.key ? 'var(--primary-light)' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        className="form-input"
        placeholder="Search keywords..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '10px 16px', fontSize: '14px' }}
      />

      {/* Selected count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Click to add to your profile
        </span>
        <span className="badge badge-blue">
          {selected.length} selected
        </span>
      </div>

      {/* Keywords Grid */}
      <div className="keywords-grid">
        {keywords.map((kw) => {
          const isSelected = selected.includes(kw);
          return (
            <button
              key={kw}
              className={`keyword-chip ${isSelected ? 'selected' : ''}`}
              onClick={() => onToggle(kw)}
              style={{
                background: isSelected
                  ? 'rgba(10,102,194,0.3)'
                  : 'rgba(10,102,194,0.08)',
                borderColor: isSelected ? 'var(--primary-light)' : 'rgba(10,102,194,0.2)',
                color: isSelected ? 'white' : 'var(--text-accent)',
              }}
            >
              {isSelected ? '✓' : '+'} {kw}
            </button>
          );
        })}
      </div>

      {/* Selected Keywords */}
      {selected.length > 0 && (
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '16px',
            marginTop: '4px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-muted)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            Your Selected Skills
          </div>
          <div className="keywords-grid">
            {selected.map((kw) => (
              <button
                key={kw}
                className="keyword-chip selected"
                onClick={() => onToggle(kw)}
                title="Click to remove"
                style={{
                  background: 'rgba(16,185,129,0.15)',
                  borderColor: 'rgba(16,185,129,0.4)',
                  color: 'var(--success-light)',
                }}
              >
                ✓ {kw}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
