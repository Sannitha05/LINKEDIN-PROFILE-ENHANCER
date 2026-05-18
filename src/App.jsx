import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { calculateProfileScore, getGeminiApiKey, setGeminiApiKey } from './utils/aiEngine';
import ScorePanel from './components/ScorePanel';
import KeywordOptimizer from './components/KeywordOptimizer';
import HeadlineGenerator from './components/HeadlineGenerator';
import AboutEnhancer from './components/AboutEnhancer';
import ExperienceEnhancer from './components/ExperienceEnhancer';

// ─── Initial State ────────────────────────────────────────────────────
const DEFAULT_PROFILE = {
  headline: '',
  about: '',
  selectedKeywords: [],
  experiences: [{ role: '', company: '', duration: '', description: '' }],
};

const TABS = [
  { id: 'profile',    icon: '👤', label: 'Profile Input' },
  { id: 'headline',  icon: '✍️', label: 'Headline AI' },
  { id: 'about',     icon: '📝', label: 'About AI' },
  { id: 'experience',icon: '💼', label: 'Experience' },
  { id: 'keywords',  icon: '🔑', label: 'Keywords' },
  { id: 'settings',  icon: '⚙️', label: 'AI Settings' },
];

// ─── Toast Component ──────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const icons = { success: '✅', info: 'ℹ️', warning: '⚠️' };
  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">{icons[type] || '✅'}</span>
      <span className="toast-text">{message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 'auto', fontSize: '16px' }}
      >
        ×
      </button>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────
function Navbar({ score }) {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <a href="#" className="navbar-brand">
            <div className="navbar-logo">🚀</div>
            <div className="navbar-title">
              Profile<span>Boost</span>
            </div>
          </a>
          <div className="navbar-actions">
            <div className="navbar-badge">
              <div className="status-dot" />
              AI Active
            </div>
            {score > 0 && (
              <div
                style={{
                  padding: '6px 16px',
                  background: 'rgba(10,102,194,0.15)',
                  border: '1px solid rgba(10,102,194,0.3)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--primary-light)',
                }}
              >
                Score: {score}/100
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────
function Hero({ onStart }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-eyebrow">
          <span>✨</span> AI-Powered LinkedIn Optimizer
        </div>
        <h1>
          Land More Interviews with a{' '}
          <span className="text-gradient">Stronger LinkedIn</span>
        </h1>
        <p className="hero-desc">
          Analyze your profile, boost your ATS score, generate compelling headlines,
          and craft a professional summary — all powered by AI, in minutes.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={onStart} id="get-started-btn">
            🚀 Enhance My Profile
          </button>
          <button className="btn btn-secondary btn-lg" onClick={onStart} id="view-demo-btn">
            👁 See How It Works
          </button>
        </div>

        <div className="hero-stats">
          {[
            { number: '94%', label: 'ATS Pass Rate' },
            { number: '3.2×', label: 'More Recruiter Views' },
            { number: '50+', label: 'Keyword Templates' },
            { number: '5 min', label: 'To Optimize' },
          ].map((s) => (
            <div key={s.label} className="hero-stat">
              <div className="hero-stat-number">{s.number}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Profile Input Tab ────────────────────────────────────────────────
function ProfileInputTab({ profile, onChange }) {
  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Basic Info */}
      <div className="glass-card">
        <div className="section-title">👤 Basic Profile Info</div>
        <p className="section-subtitle">
          Fill in your current LinkedIn details — we'll analyze and improve them.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="full-name">Full Name</label>
            <input
              id="full-name"
              className="form-input"
              placeholder="e.g. Alex Johnson"
              value={profile.name || ''}
              onChange={(e) => onChange({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="current-headline">Current LinkedIn Headline</label>
            <input
              id="current-headline"
              className="form-input"
              placeholder="e.g. Software Engineer at Google | React • Node.js • AWS"
              value={profile.headline}
              onChange={(e) => onChange({ ...profile, headline: e.target.value })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Recruiter sees this first — make it count
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: (profile.headline?.length || 0) > 100 ? 'var(--success-light)' : 'var(--warning)',
                }}
              >
                {profile.headline?.length || 0}/220
              </span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="location">Location</label>
            <input
              id="location"
              className="form-input"
              placeholder="e.g. San Francisco, CA"
              value={profile.location || ''}
              onChange={(e) => onChange({ ...profile, location: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* About */}
      <div className="glass-card">
        <div className="section-title">📝 About / Summary</div>
        <p className="section-subtitle">Paste your current LinkedIn About section (or leave blank).</p>
        <div className="form-group">
          <textarea
            id="about-input"
            className="form-textarea"
            placeholder="I am a passionate software engineer with 5+ years of experience..."
            value={profile.about}
            onChange={(e) => onChange({ ...profile, about: e.target.value })}
            style={{ minHeight: '160px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              LinkedIn allows up to 2,600 characters
            </span>
            <span
              style={{
                fontSize: '12px',
                color: (profile.about?.length || 0) > 100 ? 'var(--success-light)' : 'var(--text-muted)',
              }}
            >
              {profile.about?.length || 0} chars
            </span>
          </div>
        </div>
      </div>

      {/* Target Role */}
      <div className="glass-card">
        <div className="section-title">🎯 Target Role & Industry</div>
        <p className="section-subtitle">Help the AI tailor suggestions for your dream job.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="target-role">Target Job Title</label>
            <input
              id="target-role"
              className="form-input"
              placeholder="e.g. Senior Software Engineer"
              value={profile.targetRole || ''}
              onChange={(e) => onChange({ ...profile, targetRole: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="target-industry">Industry</label>
            <select
              id="target-industry"
              className="form-select"
              value={profile.industry || ''}
              onChange={(e) => onChange({ ...profile, industry: e.target.value })}
            >
              <option value="">Select industry...</option>
              <option value="tech">Technology</option>
              <option value="finance">Finance & Banking</option>
              <option value="healthcare">Healthcare</option>
              <option value="marketing">Marketing</option>
              <option value="consulting">Consulting</option>
              <option value="education">Education</option>
              <option value="design">Design & Creative</option>
              <option value="data">Data & Analytics</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="years-exp">Years of Experience</label>
            <select
              id="years-exp"
              className="form-select"
              value={profile.yearsExp || ''}
              onChange={(e) => onChange({ ...profile, yearsExp: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="0-1">0–1 years (Entry)</option>
              <option value="2-4">2–4 years (Junior)</option>
              <option value="5-8">5–8 years (Mid-level)</option>
              <option value="9-12">9–12 years (Senior)</option>
              <option value="13+">13+ years (Executive)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="job-type">Open To</label>
            <select
              id="job-type"
              className="form-select"
              value={profile.jobType || ''}
              onChange={(e) => onChange({ ...profile, jobType: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="full-time">Full-time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
              <option value="freelance">Freelance</option>
              <option value="part-time">Part-time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Profile tip */}
      <div
        style={{
          padding: '16px 20px',
          background: 'rgba(99,102,241,0.07)',
          border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: 'var(--radius-lg)',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: '1.7',
        }}
      >
        ✅ <strong style={{ color: 'var(--accent-light)' }}>Next steps:</strong> After filling this in,
        visit the <strong style={{ color: 'var(--text-primary)' }}>Keywords</strong> tab to add ATS skills,
        then use <strong style={{ color: 'var(--text-primary)' }}>Headline AI</strong> and{' '}
        <strong style={{ color: 'var(--text-primary)' }}>About AI</strong> to generate optimized content.
      </div>
    </div>
  );
}

// ─── AI Settings Tab ──────────────────────────────────────────────────
function AISettingsTab({ showToast, onKeyChange }) {
  const [apiKey, setApiKeyState] = useState(getGeminiApiKey());
  const [testState, setTestState] = useState('idle'); // 'idle' | 'testing' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = () => {
    setGeminiApiKey(apiKey);
    showToast('Gemini API Key saved successfully! ⚙️');
    if (onKeyChange) onKeyChange(!!apiKey);
  };

  const handleClear = () => {
    setGeminiApiKey('');
    setApiKeyState('');
    showToast('Gemini API Key cleared.');
    setTestState('idle');
    if (onKeyChange) onKeyChange(false);
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      setErrorMsg('Please enter an API Key first.');
      setTestState('error');
      return;
    }
    setTestState('testing');
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hello, respond with exactly "Connected"' }] }],
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim()) {
        setTestState('success');
        showToast('Connection test succeeded! 🟢');
      } else {
        throw new Error('Empty response from model.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Invalid API Key or API error. Please verify and try again.');
      setTestState('error');
    }
  };

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-card" style={{ padding: '24px' }}>
        <div className="section-title">⚙️ Google Gemini AI Settings</div>
        <p className="section-subtitle">
          Configure a real-time Gemini API key to push the content generation and optimization accuracy to **90%+**.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="api-key-input">Gemini API Key</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                id="api-key-input"
                type="password"
                className="form-input"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                style={{ flex: 1, fontFamily: 'monospace', letterSpacing: apiKey ? '0.15em' : 'normal' }}
              />
              {apiKey && (
                <button
                  className="btn btn-outline"
                  onClick={handleClear}
                  style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)', padding: '0 16px' }}
                >
                  🗑 Clear
                </button>
              )}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Your key is saved locally in your browser and never sent to any third-party server besides Google.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleSave}>
              💾 Save API Key
            </button>
            <button
              className={`btn ${testState === 'testing' ? 'btn-outline' : 'btn-secondary'}`}
              onClick={handleTestConnection}
              disabled={testState === 'testing'}
            >
              {testState === 'testing' ? 'Testing...' : '🔌 Test Connection'}
            </button>
          </div>

          {testState === 'success' && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#34d399',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              🟢 Connection Successful! Live AI Mode is fully active.
            </div>
          )}

          {testState === 'error' && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#fca5a5',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              ❌ Connection Failed: {errorMsg}
            </div>
          )}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <div className="section-title">🔑 How to get a Free Gemini API Key?</div>
        <ol style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '2', paddingLeft: '20px', margin: '10px 0 0 0' }}>
          <li>
            Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-light)', fontWeight: '600', textDecoration: 'underline' }}>Google AI Studio</a>.
          </li>
          <li>Log in with your Google account.</li>
          <li>Click the blue <strong>"Get API Key"</strong> button in the top left.</li>
          <li>Click <strong>"Create API Key"</strong>, select/create a project, and copy the key.</li>
          <li>Paste the key in the input box above and click <strong>"Save API Key"</strong>!</li>
        </ol>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard'
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [toast, setToast] = useState(null);
  const [showTip, setShowTip] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(!!getGeminiApiKey());

  // Scoring
  const { score, checks, metrics } = calculateProfileScore(profile);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const handleProfileChange = (updated) => {
    setProfile(updated);
  };

  const handleKeywordToggle = (kw) => {
    setProfile((prev) => {
      const sel = prev.selectedKeywords.includes(kw)
        ? prev.selectedKeywords.filter((k) => k !== kw)
        : [...prev.selectedKeywords, kw];
      return { ...prev, selectedKeywords: sel };
    });
  };

  const handleApplyHeadline = (h) => {
    setProfile((prev) => ({ ...prev, headline: h }));
    showToast('Headline applied to your profile! ✨');
    setActiveTab('profile');
  };

  const handleApplyAbout = (text) => {
    setProfile((prev) => ({ ...prev, about: text }));
    showToast('About section updated! 🎉');
    setActiveTab('profile');
  };

  const handleExperienceChange = (exps) => {
    setProfile((prev) => ({ ...prev, experiences: exps }));
  };

  // Tab content rendering
  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInputTab profile={profile} onChange={handleProfileChange} />;
      case 'headline':
        return (
          <div className="tab-content glass-card">
            <div className="section-title">✍️ AI Headline Generator</div>
            <p className="section-subtitle">Generate 5 recruiter-optimized headlines instantly.</p>
            <HeadlineGenerator profile={profile} onApply={handleApplyHeadline} />
          </div>
        );
      case 'about':
        return (
          <div className="tab-content glass-card">
            <div className="section-title">📝 AI About Section</div>
            <p className="section-subtitle">Generate a compelling professional summary using proven frameworks.</p>
            <AboutEnhancer profile={profile} onApply={handleApplyAbout} />
          </div>
        );
      case 'experience':
        return (
          <div className="tab-content glass-card">
            <div className="section-title">💼 Experience Enhancer</div>
            <p className="section-subtitle">Rewrite your roles with result-oriented, ATS-friendly bullet points.</p>
            <ExperienceEnhancer
              experiences={profile.experiences}
              onChange={handleExperienceChange}
            />
          </div>
        );
      case 'keywords':
        return (
          <div className="tab-content glass-card">
            <div className="section-title">🔑 ATS Keyword Optimizer</div>
            <p className="section-subtitle">
              Select skills recruiters search for — boosts your ATS ranking by up to 3×.
            </p>
            <KeywordOptimizer selected={profile.selectedKeywords} onToggle={handleKeywordToggle} />
          </div>
        );
      case 'settings':
        return <AISettingsTab showToast={showToast} onKeyChange={setHasApiKey} />;
      default:
        return null;
    }
  };

  // Landing page
  if (view === 'landing') {
    return (
      <>
        <Navbar score={0} />
        <Hero onStart={() => setView('dashboard')} />

        {/* Feature Cards */}
        <section style={{ padding: '0 0 80px' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  background: 'rgba(10,102,194,0.1)',
                  border: '1px solid rgba(10,102,194,0.2)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  color: 'var(--primary-light)',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                Everything You Need
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}
              >
                5 Powerful Features
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                Everything you need to go from overlooked to irresistible on LinkedIn.
              </p>
            </div>

            <div className="features-grid">
              {[
                {
                  icon: '📊',
                  color: 'rgba(10,102,194,0.15)',
                  title: 'Profile Scoring',
                  desc: 'Real-time profile strength score across 6 dimensions — see exactly what to fix.',
                },
                {
                  icon: '🔑',
                  color: 'rgba(99,102,241,0.15)',
                  title: 'ATS Keywords',
                  desc: '50+ recruiter-searched keywords across Technical, Soft, and Business categories.',
                },
                {
                  icon: '✍️',
                  color: 'rgba(16,185,129,0.12)',
                  title: 'AI Headlines',
                  desc: 'Generate 5 tailored headlines using your role, skills, and value proposition.',
                },
                {
                  icon: '📝',
                  color: 'rgba(245,158,11,0.12)',
                  title: 'About Generator',
                  desc: 'Craft your story using STAR, Value Prop, or Story Arc professional frameworks.',
                },
                {
                  icon: '💼',
                  color: 'rgba(239,68,68,0.1)',
                  title: 'Experience AI',
                  desc: 'Transform bland job duties into punchy, metric-driven achievement bullets.',
                },
                {
                  icon: '🎯',
                  color: 'rgba(6,182,212,0.1)',
                  title: 'Smart Suggestions',
                  desc: 'Prioritized, actionable Quick Wins so you always know what to do next.',
                },
              ].map((f) => (
                <div key={f.title} className="feature-card" onClick={() => setView('dashboard')}>
                  <div
                    className="feature-icon-wrap"
                    style={{ background: f.color }}
                  >
                    {f.icon}
                  </div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                  <span className="feature-arrow">→</span>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setView('dashboard')}
                id="cta-bottom-btn"
              >
                🚀 Start Optimizing Now — It's Free
              </button>
            </div>
          </div>
        </section>

        <footer className="app-footer">
          <div className="container">
            <p>© 2025 ProfileBoost · AI-Powered LinkedIn Profile Enhancer · Built with React.js</p>
          </div>
        </footer>
      </>
    );
  }

  // Dashboard
  return (
    <>
      <Navbar score={score} />

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <main className="dashboard">
        <div className="container">
          {/* Back + Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '28px 0 24px',
              flexWrap: 'wrap',
            }}
          >
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setView('landing')}
              id="back-btn"
            >
              ← Back
            </button>
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(22px, 4vw, 32px)',
                  fontWeight: '800',
                  lineHeight: 1.2,
                }}
              >
                Profile Enhancer{' '}
                <span className="text-gradient">Dashboard</span>
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Fill in your profile, then use each AI tool to optimize it
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                {hasApiKey ? (
                  <span
                    style={{
                      padding: '4px 10px',
                      background: 'rgba(16,185,129,0.12)',
                      border: '1px solid rgba(16,185,129,0.25)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#34d399',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    🟢 Live AI Mode
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveTab('settings')}
                    style={{
                      padding: '4px 10px',
                      background: 'rgba(245,158,11,0.12)',
                      border: '1px solid rgba(245,158,11,0.25)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#fbbf24',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      borderStyle: 'solid',
                      outline: 'none',
                    }}
                    title="Click to configure your Gemini API Key for premium accuracy"
                  >
                    ⚠️ Simulated AI Mode (Click to upgrade)
                  </button>
                )}
              </div>
            </div>
            {profile.name && (
              <div
                style={{
                  marginLeft: 'auto',
                  padding: '8px 18px',
                  background: 'rgba(10,102,194,0.12)',
                  border: '1px solid rgba(10,102,194,0.25)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--primary-light)',
                }}
              >
                👤 {profile.name}
              </div>
            )}
          </div>

          {/* Tab Bar */}
          <div className="tabs" style={{ marginBottom: '24px' }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`tab ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
                id={`tab-${t.id}`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="dashboard-grid">
            {/* Sidebar */}
            <aside className="sidebar">
              <ScorePanel score={score} checks={checks} metrics={metrics} />
            </aside>

            {/* Main Content */}
            <div className="main-panel">
              {renderTab()}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Tip */}
      {showTip && (
        <div className="floating-tip" onClick={() => setShowTip(false)}>
          <span style={{ fontSize: '20px' }}>💡</span>
          <div>
            <strong>Start with Keywords</strong> — they boost your score the fastest!
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setShowTip(false); }}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '18px', marginLeft: '8px' }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
