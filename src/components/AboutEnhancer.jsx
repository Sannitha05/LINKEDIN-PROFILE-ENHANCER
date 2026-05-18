import React, { useState } from 'react';
import { generateAbout, ABOUT_FRAMEWORKS } from '../utils/aiEngine';

export default function AboutEnhancer({ profile, onApply }) {
  const [framework, setFramework] = useState('star');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(profile.about?.length || 0);

  const generate = async () => {
    setLoading(true);
    setOutput('');
    try {
      const result = await generateAbout(profile, framework);
      setOutput(result);
    } catch (e) {
      console.error("About generation error:", e);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Framework Selector */}
      <div>
        <div className="form-label" style={{ marginBottom: '10px' }}>Choose Writing Framework</div>
        <div className="about-frameworks">
          {Object.entries(ABOUT_FRAMEWORKS).map(([key, fw]) => (
            <div
              key={key}
              className={`framework-card ${framework === key ? 'selected' : ''}`}
              onClick={() => setFramework(key)}
              id={`framework-${key}`}
            >
              <div className="framework-icon">{fw.icon}</div>
              <div className="framework-name">{fw.name}</div>
              <div className="framework-desc">{fw.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LinkedIn About Limits info */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: '🎯 Recommended', value: '1,500–2,000 chars' },
          { label: '📏 LinkedIn Max', value: '2,600 chars' },
          { label: '⚡ ATS Ideal', value: 'Use keywords naturally' },
        ].map((tip) => (
          <div
            key={tip.label}
            style={{
              flex: 1,
              minWidth: '140px',
              padding: '12px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tip.label}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '4px' }}>{tip.value}</div>
          </div>
        ))}
      </div>

      {/* Current About */}
      <div className="form-group">
        <label className="form-label">
          Your Current About Section
          <span style={{ marginLeft: '8px', fontWeight: '400', color: charCount > 2600 ? 'var(--danger)' : 'var(--text-muted)' }}>
            ({charCount}/2600)
          </span>
        </label>
        <textarea
          className="form-textarea"
          placeholder="Paste your current About section here, or leave blank to generate from scratch..."
          defaultValue={profile.about}
          onChange={(e) => setCharCount(e.target.value.length)}
          style={{ minHeight: '130px' }}
        />
      </div>

      {/* Generate Button */}
      <button
        className={`btn ${loading ? 'btn-outline' : 'btn-primary'} btn-lg`}
        onClick={generate}
        disabled={loading}
        style={{ alignSelf: 'flex-start' }}
        id="generate-about-btn"
      >
        {loading ? (
          <>
            <div className="spinner" />
            Crafting your story...
          </>
        ) : (
          <>✨ Generate {ABOUT_FRAMEWORKS[framework].name} About</>
        )}
      </button>

      {/* AI Output */}
      {output && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-label">AI-Generated About Section</div>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(10,102,194,0.06), rgba(99,102,241,0.04))',
              border: '1px solid rgba(10,102,194,0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              fontSize: '14px',
              color: 'var(--text-primary)',
              lineHeight: '1.9',
              whiteSpace: 'pre-wrap',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '14px',
                right: '16px',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--accent-light)',
              }}
            >
              ✨ AI · {ABOUT_FRAMEWORKS[framework].name}
            </span>
            {output}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-outline btn-sm" onClick={copy} id="copy-about-btn">
              {copied ? <span className="copy-feedback">✓ Copied!</span> : '📋 Copy to Clipboard'}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => onApply(output)} id="apply-about-btn">
              ✓ Apply to Profile
            </button>
            <button className="btn btn-secondary btn-sm" onClick={generate} id="regen-about-btn">
              🔄 Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
