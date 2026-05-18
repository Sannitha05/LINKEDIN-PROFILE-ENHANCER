import React, { useState } from 'react';
import { enhanceExperience } from '../utils/aiEngine';

const EMPTY_EXP = { role: '', company: '', duration: '', description: '' };

export default function ExperienceEnhancer({ experiences, onChange }) {
  const [expanded, setExpanded] = useState(0);
  const [enhancing, setEnhancing] = useState(null);
  const [enhanced, setEnhanced] = useState({});

  const addExperience = () => {
    onChange([...experiences, { ...EMPTY_EXP }]);
    setExpanded(experiences.length);
  };

  const updateExp = (idx, field, value) => {
    const updated = experiences.map((e, i) =>
      i === idx ? { ...e, [field]: value } : e
    );
    onChange(updated);
  };

  const removeExp = (idx) => {
    onChange(experiences.filter((_, i) => i !== idx));
    setExpanded(Math.max(0, idx - 1));
  };

  const enhance = async (idx) => {
    setEnhancing(idx);
    try {
      const result = await enhanceExperience(experiences[idx].description, experiences[idx].role);
      setEnhanced((prev) => ({ ...prev, [idx]: result }));
    } catch (e) {
      console.error("Experience enhancement error:", e);
    } finally {
      setEnhancing(null);
    }
  };

  const applyEnhanced = (idx) => {
    updateExp(idx, 'description', enhanced[idx]);
    setEnhanced((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Tips bar */}
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}
      >
        💡 Use <strong style={{ color: 'var(--warning)' }}>result-oriented bullets</strong> — start with
        strong action verbs and include <strong style={{ color: 'var(--warning)' }}>quantified metrics</strong>{' '}
        (%, $, x) for maximum ATS impact.
      </div>

      {/* Experience List */}
      {experiences.map((exp, idx) => (
        <div key={idx} className="experience-item">
          {/* Header */}
          <div
            className="experience-header"
            onClick={() => setExpanded(expanded === idx ? null : idx)}
          >
            <div className="exp-title-group">
              <div className="exp-role">
                {exp.role || (
                  <span style={{ color: 'var(--text-muted)' }}>New Experience</span>
                )}
              </div>
              {exp.company && (
                <div className="exp-company">
                  {exp.company}
                  {exp.duration && ` · ${exp.duration}`}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {exp.description && (
                <span className="badge badge-green" style={{ fontSize: '11px' }}>
                  Has content
                </span>
              )}
              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '18px',
                  transition: 'transform 0.2s',
                  transform: expanded === idx ? 'rotate(180deg)' : 'none',
                }}
              >
                ▾
              </span>
            </div>
          </div>

          {/* Body */}
          {expanded === idx && (
            <div className="experience-body">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                  marginBottom: '14px',
                }}
              >
                <div className="form-group">
                  <label className="form-label">Job Title / Role *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Senior Software Engineer"
                    value={exp.role}
                    onChange={(e) => updateExp(idx, 'role', e.target.value)}
                    id={`exp-role-${idx}`}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Google"
                    value={exp.company}
                    onChange={(e) => updateExp(idx, 'company', e.target.value)}
                    id={`exp-company-${idx}`}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Duration</label>
                <input
                  className="form-input"
                  placeholder="e.g. Jan 2022 – Present · 2 yrs"
                  value={exp.duration}
                  onChange={(e) => updateExp(idx, 'duration', e.target.value)}
                  id={`exp-duration-${idx}`}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">
                  Responsibilities & Achievements
                  <span style={{ marginLeft: '6px', fontWeight: '400', color: 'var(--text-muted)' }}>
                    (use bullet points)
                  </span>
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="• Built a microservices architecture that reduced latency by 40%&#10;• Led a team of 6 engineers across 3 time zones&#10;• Shipped 12 features resulting in 25% revenue growth"
                  value={exp.description}
                  onChange={(e) => updateExp(idx, 'description', e.target.value)}
                  style={{ minHeight: '140px' }}
                  id={`exp-desc-${idx}`}
                />
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <button
                  className={`btn ${enhancing === idx ? 'btn-outline' : 'btn-primary'} btn-sm`}
                  onClick={() => enhance(idx)}
                  disabled={enhancing === idx}
                  id={`enhance-exp-${idx}`}
                >
                  {enhancing === idx ? (
                    <><div className="spinner" style={{ width: '14px', height: '14px' }} /> Enhancing...</>
                  ) : (
                    '✨ AI Enhance'
                  )}
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}
                  onClick={() => removeExp(idx)}
                  id={`remove-exp-${idx}`}
                >
                  🗑 Remove
                </button>
              </div>

              {/* Enhanced Preview */}
              {enhanced[idx] && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '18px',
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(10,102,194,0.04))',
                    border: '1px solid rgba(16,185,129,0.25)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--success-light)' }}>
                      ✨ AI Enhanced Version
                    </span>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => applyEnhanced(idx)}
                      id={`apply-exp-${idx}`}
                    >
                      ✓ Apply
                    </button>
                  </div>
                  <pre
                    style={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      lineHeight: '1.8',
                      margin: 0,
                    }}
                  >
                    {enhanced[idx]}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Add Experience */}
      <button
        className="btn btn-outline"
        onClick={addExperience}
        style={{
          border: '1px dashed rgba(255,255,255,0.15)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          width: '100%',
          justifyContent: 'center',
          color: 'var(--text-muted)',
        }}
        id="add-experience-btn"
      >
        + Add Work Experience
      </button>
    </div>
  );
}
