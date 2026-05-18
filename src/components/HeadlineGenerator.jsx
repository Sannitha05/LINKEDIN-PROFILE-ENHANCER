import React, { useState } from 'react';
import { generateHeadlines } from '../utils/aiEngine';

export default function HeadlineGenerator({ profile, onApply }) {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    setGenerated(false);
    try {
      const result = await generateHeadlines(profile);
      setHeadlines(result);
      setGenerated(true);
    } catch (e) {
      console.error("Headline generation error:", e);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text, idx) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tips */}
      <div
        style={{
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: '1.7',
        }}
      >
        💡 <strong style={{ color: 'var(--accent-light)' }}>Pro tip:</strong> A great LinkedIn headline
        includes your role, a unique value proposition, and relevant keywords recruiters search for.
        Ideal length: <strong style={{ color: 'var(--text-primary)' }}>120–220 characters</strong>.
      </div>

      {/* Current Headline Preview */}
      {profile.headline && (
        <div>
          <div className="form-label" style={{ marginBottom: '8px' }}>Current Headline</div>
          <div
            style={{
              padding: '14px 18px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '15px',
              color: 'var(--text-primary)',
            }}
          >
            {profile.headline}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '6px',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                color:
                  profile.headline.length < 100
                    ? 'var(--warning)'
                    : profile.headline.length <= 220
                    ? 'var(--success-light)'
                    : 'var(--danger)',
              }}
            >
              {profile.headline.length} / 220 chars
            </span>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        className={`btn ${loading ? 'btn-outline' : 'btn-primary'} btn-lg`}
        onClick={generate}
        disabled={loading}
        style={{ alignSelf: 'flex-start' }}
        id="generate-headlines-btn"
      >
        {loading ? (
          <>
            <div className="spinner" />
            Generating AI Headlines...
          </>
        ) : (
          <>✨ Generate AI Headlines</>
        )}
      </button>

      {/* Generated Headlines */}
      {generated && headlines.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-label">AI-Generated Headlines — Pick your favorite</div>
          {headlines.map((h, idx) => (
            <div
              key={idx}
              className="ai-output"
              style={{ cursor: 'default' }}
            >
              <div
                className="ai-output-text"
                style={{ paddingRight: '0', fontSize: '14px', lineHeight: '1.6' }}
              >
                {h}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {h.length} chars
                </span>
                <div style={{ flex: 1 }} />
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => copy(h, idx)}
                  id={`copy-headline-${idx}`}
                >
                  {copied === idx ? (
                    <span className="copy-feedback">✓ Copied!</span>
                  ) : (
                    '📋 Copy'
                  )}
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onApply(h)}
                  id={`apply-headline-${idx}`}
                >
                  ✓ Use This
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!generated && !loading && (
        <div className="empty-state">
          <div className="empty-icon">✨</div>
          <div className="empty-title">No headlines yet</div>
          <div className="empty-desc">
            Fill in your profile details then click Generate to get AI-powered headlines.
          </div>
        </div>
      )}
    </div>
  );
}
