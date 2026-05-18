// ─── AI Simulation Engine ───────────────────────────────────────────
// Simulates AI-powered analysis; replace with real API calls as needed.

export const ATS_KEYWORDS = {
  tech: [
    'React.js', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker',
    'Kubernetes', 'CI/CD', 'REST API', 'GraphQL', 'PostgreSQL', 'MongoDB',
    'Redux', 'Git', 'Agile', 'Scrum', 'Microservices', 'Machine Learning',
    'Data Analysis', 'Cloud Computing', 'DevOps', 'System Design',
  ],
  soft: [
    'Leadership', 'Problem Solving', 'Communication', 'Collaboration',
    'Critical Thinking', 'Adaptability', 'Time Management', 'Innovation',
    'Strategic Planning', 'Stakeholder Management',
  ],
  business: [
    'Project Management', 'Product Development', 'Cross-functional',
    'ROI', 'KPI', 'Business Intelligence', 'Growth Strategy', 'A/B Testing',
    'User Research', 'Market Analysis',
  ],
};

export const HEADLINE_TEMPLATES = [
  '{role} | Building {impact} at {company_type} | Passionate about {domain}',
  'Senior {role} → Driving {metric} Growth | {tech} Expert | Open to {opportunity}',
  '{role} specializing in {domain} | {credential} | Creating {impact}',
  'Full-Stack {role} | {tech} • {tech2} • {tech3} | {impact}',
  '{adjective} {role} | {domain} Enthusiast | Helping {target} {outcome}',
];

export const ABOUT_FRAMEWORKS = {
  star: {
    name: 'STAR Method',
    icon: '⭐',
    desc: 'Situation, Task, Action, Result',
    prompt: 'Craft a compelling narrative using STAR methodology',
  },
  value: {
    name: 'Value Prop',
    icon: '💎',
    desc: 'What you do, who you help, how',
    prompt: 'Highlight your unique value proposition',
  },
  story: {
    name: 'Story Arc',
    icon: '📖',
    desc: 'Journey, challenge, transformation',
    prompt: 'Tell your professional story arc',
  },
};

export function computeProfileMetrics(profile, baseScore) {
  // 1. Recruiter Visibility (Max 100)
  // Highly dependent on a strong headline, keywords, and location
  let visibility = baseScore * 0.8;
  if (profile.headline && profile.headline.length > 40) visibility += 10;
  if (profile.location) visibility += 5;
  if (profile.selectedKeywords && profile.selectedKeywords.length >= 8) visibility += 5;
  visibility = Math.min(100, Math.max(0, Math.round(visibility)));

  // 2. ATS Compatibility (Max 100)
  // Highly dependent on keyword density and quantified results in work experience
  let ats = baseScore * 0.75;
  if (profile.selectedKeywords && profile.selectedKeywords.length >= 6) ats += 10;
  const hasQuantified = profile.experiences && profile.experiences.some(
    (e) => e.description && /\d+%|\d+x|\$\d+|\d+ (users|clients|teams)/i.test(e.description)
  );
  if (hasQuantified) ats += 15;
  ats = Math.min(100, Math.max(0, Math.round(ats)));

  // 3. Profile Completeness (Max 100)
  // Straightforward check of all standard sections
  let completeness = 0;
  if (profile.name) completeness += 10;
  if (profile.headline) completeness += 20;
  if (profile.about) completeness += 20;
  if (profile.location) completeness += 10;
  if (profile.targetRole) completeness += 10;
  if (profile.experiences && profile.experiences.filter(e => e.role).length >= 1) completeness += 20;
  if (profile.selectedKeywords && profile.selectedKeywords.length >= 3) completeness += 10;
  completeness = Math.min(100, Math.max(0, Math.round(completeness)));

  // 4. Engagement Potential (Max 100)
  // Highly dependent on about framework quality and structured headlines
  let engagement = baseScore * 0.7;
  if (profile.about && profile.about.length > 200) engagement += 15;
  if (profile.headline && profile.headline.includes('|')) engagement += 15;
  engagement = Math.min(100, Math.max(0, Math.round(engagement)));

  return {
    visibility,
    ats,
    completeness,
    engagement,
  };
}

// ─── Profile Scoring Engine ──────────────────────────────────────────
export function calculateProfileScore(profile) {
  const checks = [
    {
      id: 'headline',
      name: 'Headline',
      weight: 15,
      check: (p) => p.headline && p.headline.length > 20,
      note: (p) =>
        p.headline?.length > 20
          ? 'Great headline length'
          : 'Add a compelling headline (>20 chars)',
    },
    {
      id: 'about',
      name: 'About Section',
      weight: 20,
      check: (p) => p.about && p.about.length > 100,
      note: (p) =>
        p.about?.length > 100
          ? 'Well-written summary'
          : 'Expand your summary (>100 chars)',
    },
    {
      id: 'experience',
      name: 'Work Experience',
      weight: 25,
      check: (p) => p.experiences && p.experiences.filter((e) => e.role).length >= 1,
      note: (p) =>
        p.experiences?.some((e) => e.role)
          ? 'Experience added'
          : 'Add at least one experience',
    },
    {
      id: 'skills',
      name: 'Skills (ATS)',
      weight: 20,
      check: (p) => p.selectedKeywords && p.selectedKeywords.length >= 5,
      note: (p) =>
        p.selectedKeywords?.length >= 5
          ? `${p.selectedKeywords.length} skills selected`
          : `Add at least 5 skills (${p.selectedKeywords?.length || 0}/5)`,
    },
    {
      id: 'keywords',
      name: 'Keyword Density',
      weight: 10,
      check: (p) => p.selectedKeywords && p.selectedKeywords.length >= 8,
      note: (p) =>
        p.selectedKeywords?.length >= 8
          ? 'Good keyword coverage'
          : 'Add more keywords for ATS',
    },
    {
      id: 'achievements',
      name: 'Quantified Results',
      weight: 10,
      check: (p) =>
        p.experiences &&
        p.experiences.some(
          (e) => e.description && /\d+%|\d+x|\$\d+|\d+ (users|clients|teams)/i.test(e.description)
        ),
      note: (p) =>
        p.experiences?.some((e) =>
          /\d+%|\d+x|\$\d+|\d+ (users|clients|teams)/i.test(e.description || '')
        )
          ? 'Has quantified achievements'
          : 'Add metrics to experience (%, $, x)',
    },
  ];

  const results = checks.map((c) => {
    const passed = c.check(profile);
    const partial = !passed && c.id === 'skills' && profile.selectedKeywords?.length >= 2;
    return {
      ...c,
      passed,
      partial,
      earned: passed ? c.weight : partial ? Math.round(c.weight * 0.5) : 0,
      note: c.note(profile),
    };
  });

  const total = results.reduce((sum, r) => sum + r.earned, 0);
  const metrics = computeProfileMetrics(profile, total);
  return { score: total, checks: results, metrics };
}

// ─── AI Headline Generator ───────────────────────────────────────────
// ─── Gemini API Management ───────────────────────────────────────────
export function getGeminiApiKey() {
  return localStorage.getItem('BOOST_GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function setGeminiApiKey(key) {
  if (key) {
    localStorage.setItem('BOOST_GEMINI_API_KEY', key);
  } else {
    localStorage.removeItem('BOOST_GEMINI_API_KEY');
  }
}

async function callGeminiAPI(prompt) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error("No Gemini API key configured.");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Invalid response structure from Gemini API");
  return text;
}

// ─── AI Headline Generator ───────────────────────────────────────────
export async function generateHeadlines(profile) {
  const apiKey = getGeminiApiKey();
  if (apiKey) {
    try {
      const prompt = `You are an expert executive resume writer and LinkedIn optimization specialist.
Generate exactly 5 highly compelling, recruiter-optimized LinkedIn headlines based on the professional profile details below.
Each headline should be search-optimized (ATS friendly), include key technical/soft skills, highlight value/impact, and strictly fit under 220 characters.

Guidelines:
- Return exactly 5 headlines, one per line.
- Do not number the headlines (do not start with 1, 2, etc.) or add any bullet points.
- Do not write any explanations, introductory text, or concluding text. Just return the 5 lines.

Profile details:
- Name: ${profile.name || 'Professional'}
- Current Headline: ${profile.headline || 'None'}
- Target Role: ${profile.targetRole || 'Not specified'}
- Industry: ${profile.industry || 'Technology'}
- Years of Experience: ${profile.yearsExp || 'Not specified'}
- Skills/Keywords: ${profile.selectedKeywords?.join(', ') || 'None'}
- Work Experience: ${JSON.stringify(profile.experiences || [])}`;

      const text = await callGeminiAPI(prompt);
      const headlines = text
        .split('\n')
        .map((l) => l.trim().replace(/^[-•*\d\.\s]+/, '')) // Strip bullet points, numbers, etc.
        .filter((l) => l.length > 10);
      if (headlines.length >= 3) {
        return headlines.slice(0, 5);
      }
    } catch (e) {
      console.warn('Gemini headline generation failed, falling back to simulated templates', e);
    }
  }

  // Fallback simulated headlines (same as before)
  const role = profile.headline?.split('|')[0]?.trim() || profile.experiences?.[0]?.role || 'Professional';
  const skills = profile.selectedKeywords?.slice(0, 3) || ['Tech', 'Innovation'];
  const domain = skills[0] || 'Technology';
  return [
    `${role} | Driving Innovation with ${skills[0] || 'Cutting-Edge Tech'} | Open to Senior Opportunities`,
    `Senior ${role} → ${skills[0]} & ${skills[1] || 'Cloud'} Expert | Building Scalable Solutions`,
    `${role} | ${skills.join(' • ')} | Helping Teams Deliver 10x Results`,
    `Passionate ${role} | ${domain} Specialist | Top 1% LinkedIn Creator in Tech`,
    `${role} @ Scale | ${skills[0]} Leader | Driving ${Math.floor(Math.random() * 40 + 20)}% Efficiency Gains`,
  ];
}


// ─── AI About Generator ──────────────────────────────────────────────
export async function generateAbout(profile, framework = 'star') {
  const apiKey = getGeminiApiKey();
  const frameworkName = ABOUT_FRAMEWORKS[framework]?.name || 'STAR Method';
  const frameworkDesc = ABOUT_FRAMEWORKS[framework]?.desc || '';

  if (apiKey) {
    try {
      const skills = profile.selectedKeywords?.join(', ') || 'relevant skills';
      const prompt = `You are an expert executive resume writer and LinkedIn career coach.
Write an outstanding, professional, and highly engaging LinkedIn 'About' section based on the user's profile and the specified framework: "${frameworkName}" (${frameworkDesc}).

Framework Instructions:
- STAR Method: Structure the story using Situation, Task, Action, and Result. Include key technical challenges and quantified achievements.
- Value Prop: Focus on what the user does, who they help, how they do it, and the unique value they bring to a company.
- Story Arc: Focus on the user's professional journey, key career transitions/challenges, and what motivates them.

Guidelines:
- Integrate these skills/keywords naturally: ${skills}.
- Write in the first-person ('I') with a professional, confident, and warm tone.
- Make it highly readable with bullet points and short paragraphs. Avoid dense blocks of text.
- Do not include markdown code block syntax (like \`\`\`), meta-commentary, introductory text, or concluding text (e.g. "Here is your about section"). Just return the final formatted 'About' text.

User Profile:
- Name: ${profile.name || 'Professional'}
- Current Headline: ${profile.headline || 'None'}
- Target Role: ${profile.targetRole || 'Not specified'}
- Industry: ${profile.industry || 'Technology'}
- Years of Experience: ${profile.yearsExp || 'Not specified'}
- Work Experience: ${JSON.stringify(profile.experiences || [])}`;

      const text = await callGeminiAPI(prompt);
      if (text && text.trim().length > 50) {
        return text.trim();
      }
    } catch (e) {
      console.warn('Gemini About section generation failed, falling back to simulated templates', e);
    }
  }

  // Fallback simulated templates
  const role = profile.experiences?.[0]?.role || 'Software Professional';
  const company = profile.experiences?.[0]?.company || 'leading tech companies';
  const skills = profile.selectedKeywords?.slice(0, 4).join(', ') || 'technology and innovation';

  const templates = {
    star: `🚀 With ${profile.experiences?.length || '5'}+ years driving transformational outcomes at ${company}, I specialize in ${skills}.

**Situation:** The tech industry demands professionals who can bridge strategy and execution—delivering results that move the needle.

**Task:** As a ${role}, I've been entrusted with architecting solutions that scale, mentor teams that excel, and align technical vision with business objectives.

**Action:** I leverage ${skills} to build systems that are resilient, performant, and user-centric. Whether leading cross-functional sprints or deep-diving into system design, I bring clarity to complexity.

**Result:** → Reduced system latency by 40% | → Increased team velocity by 30% | → Delivered $2M+ in efficiency gains

📬 Let's connect if you're building something ambitious.`,

    value: `💡 I help ${company.includes('startup') ? 'startups' : 'forward-thinking organizations'} build ${skills} solutions that scale.

**What I do:** ${role} — architecting robust systems, leading engineering teams, and transforming business requirements into elegant technical solutions.

**Who I help:** CTOs, VPs of Engineering, and Product Leaders who need a trusted technical partner to accelerate delivery without sacrificing quality.

**How I'm different:** I combine deep ${skills} expertise with strong business acumen — ensuring every line of code maps back to measurable impact.

✨ Core strengths: ${skills}

📩 Open to: Senior/Lead roles, Advisory positions, and high-impact collaborations.`,

    story: `📍 It started with a simple question: *"How do we make this 10x better?"*

That question has guided my entire career as a ${role}. From my early days at ${company} to now, I've been obsessed with turning complex challenges into elegant, scalable solutions using ${skills}.

**Chapter 1 — The Foundation:** Honed my craft in ${skills}, learning that great software is as much about people as it is about code.

**Chapter 2 — The Growth:** Led teams, shipped products used by thousands, and discovered my passion for mentoring the next generation of engineers.

**Chapter 3 — The Impact:** Today, I'm focused on building technology that creates real-world change — measurable, meaningful, and lasting.

The story isn't over. What chapter are you writing? Let's connect. 🤝`,
  };

  return templates[framework] || templates.star;
}

// ─── Experience Enhancer ─────────────────────────────────────────────
export async function enhanceExperience(description, role) {
  const apiKey = getGeminiApiKey();
  if (apiKey) {
    try {
      const prompt = `You are an expert resume writer and ATS optimization specialist.
Rewrite the following work experience description for the role of "${role || 'Professional'}" to be highly result-oriented, professional, and impactful.

Requirements:
- Begin each bullet point with a strong, diverse action verb (e.g., "Spearheaded", "Architected", "Optimized", "Formulated").
- Integrate quantified achievements, metrics, and business outcomes where possible (such as efficiency improvements, percentage gains, time savings, or revenue growth). If specific numbers are not present in the original description, extrapolate highly realistic, industry-standard metrics appropriate for a "${role || 'Professional'}" role to make the accomplishments stand out.
- Ensure the output is formatted as a clear, list of bullet points using the '•' character.
- Return ONLY the final bulleted list. Do not include any explanations, introductory remarks, or concluding text.

Original Description:
${description || 'Generic job duties'}`;

      const text = await callGeminiAPI(prompt);
      if (text && text.trim().length > 10) {
        return text.trim();
      }
    } catch (e) {
      console.warn('Gemini experience enhancement failed, falling back to simulated template', e);
    }
  }

  if (!description) {
    return `• Architected and deployed scalable ${role} solutions serving 50,000+ daily active users, achieving 99.9% uptime SLA\n• Led cross-functional team of 8 engineers, reducing sprint velocity by 35% through process optimization and Agile methodologies\n• Drove $1.2M in cost savings by migrating legacy infrastructure to cloud-native microservices architecture\n• Mentored 4 junior engineers, with 2 promoted within 12 months of intensive coaching`;
  }

  // Enhance existing description with action verbs and metrics
  const enhanced = description
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const trimmed = line.replace(/^[-•*]\s*/, '').trim();
      if (!trimmed) return '';

      // Add strong action verbs if missing
      const actionVerbs = ['Architected', 'Spearheaded', 'Optimized', 'Drove', 'Orchestrated', 'Engineered', 'Pioneered'];
      const verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];

      // Add a metric if none exists
      const hasMetric = /\d+[%x$]|\d+ (users|clients|teams|engineers)/i.test(trimmed);
      const metrics = ['reducing time-to-market by 30%', 'improving performance by 45%', 'saving 200+ engineering hours monthly', 'increasing user retention by 28%'];
      const metric = metrics[Math.floor(Math.random() * metrics.length)];

      if (!hasMetric) {
        return `• ${verb} ${trimmed}, ${metric}`;
      }
      return `• ${verb} ${trimmed}`;
    })
    .filter(Boolean)
    .join('\n');

  return enhanced;
}

// ─── Score Color Utility ─────────────────────────────────────────────
export function getScoreColor(score) {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#F59E0B';
  if (score >= 40) return '#6366F1';
  return '#EF4444';
}

export function getScoreLabel(score) {
  if (score >= 80) return 'All-Star';
  if (score >= 60) return 'Advanced';
  if (score >= 40) return 'Intermediate';
  return 'Beginner';
}

export function getScoreLabelColor(score) {
  if (score >= 80) return 'badge-green';
  if (score >= 60) return 'badge-amber';
  if (score >= 40) return 'badge-purple';
  return 'badge-red';
}
