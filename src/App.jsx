import React, { useState, useEffect, useCallback, useRef, Fragment, Component } from 'react'
import {
  EQUIPMENT, STAFF_TEMPLATES, ACQUISITION_OPTIONS, MARKETING_OPTIONS,
  INSURANCE_PLANS, OFFICE_UPGRADES, RANDOM_EVENTS, PROCEDURES,
  SPACE_OPTIONS, BUILDOUT_ITEMS, RELATIONSHIP_TYPES, PRESSURE_METRICS,
  BUILDOUT_COST_PER_SQFT, REVENUE_PER_SQFT_TARGET,
  DIFFICULTY_MODES, EXPERT_EVENTS, calculateScore,
  TRAINING_PROGRAMS, OPPOSING_FORCES,
  CONSULTANTS, checkConsultantRequirements,
  getLeaderboard, saveToLeaderboard, getLeaderboardByMode, getLeaderboardModes, getPracticeStyle,
  generateChallengeCode, codeToSeed, generateChallengeSchedule, generateChallengeCandidates,
  saveChallenge, getChallengeResults, getAllChallenges, generateSeasonFeedback, compareChallengeResults,
  HELL_EVENTS, KEY_DECISIONS,
  MONTHLY_LOAN_PAYMENT_RATE, LATE_PAYMENT_PENALTY_RATE, LOAN_WARNING_DAYS,
  INSURANCE_REIMBURSEMENT_DELAY, CREDENTIALING_DAYS,
  generateStaffMember, calculateDailyStats, generatePatientName, pickProcedure,
  calculatePressures,
  LOCATION_OPTIONS, getLocationAdvice, getSynergyMultipliers, getRegionalManagerPenalty,
  calculateAllLocationStats, MULTI_LOCATION_EVENTS,
  updateAssociateLoyalty, computeFlightRisk, associateDeparture,
  generateAcquisitionOptions, PROBLEM_POOL,
  getStaffingRecommendation, FEE_SCHEDULE_EXAMPLES,
  SPECIALIST_ROLES, isProvider,
} from './gameData'

// ═══════════════════════════════════════════════════════
// ERROR BOUNDARY — catches render crashes and shows fallback
// ═══════════════════════════════════════════════════════
class GameErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('Game render crash:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="game-over" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚠️</div>
          <h1 style={{ color: '#eab308' }}>Something Went Wrong</h1>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>The game encountered an error. Your progress has been saved to the leaderboard.</p>
          <p style={{ color: '#64748b', fontSize: '11px', marginBottom: '20px' }}>{this.state.error?.message}</p>
          <button className="start-btn" onClick={() => window.location.reload()} style={{ margin: '0 auto' }}>
            <span className="btn-icon">🔄</span>
            <div><div className="btn-title">Restart Game</div></div>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════
// TITLE SCREEN
// ═══════════════════════════════════════════════════════
function TitleScreen({ onStart, onChallenge, onLeaderboard }) {
  return (
    <div className="title-screen">
      <div className="title-content">
        <div className="tooth-icon">🦷</div>
        <h1 className="title">DENTAL TYCOON</h1>
        <p className="subtitle">Build Your Practice. Grow Your Empire.</p>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '30px', maxWidth: '450px', margin: '0 auto 30px', lineHeight: 1.5 }}>
          Run a dental practice from the ground up. Every season ends with a comprehensive performance review with real practice management insights and tips.
        </p>
        <div className="start-options">
          <button className="start-btn" onClick={() => onStart('scratch')}>
            <span className="btn-icon">🏗️</span>
            <div>
              <div className="btn-title">Start from Scratch</div>
              <div className="btn-desc">Empty office. Build your dream practice from nothing.</div>
            </div>
          </button>
          <button className="start-btn" onClick={() => onStart('acquire')} style={{ borderColor: '#a78bfa' }}>
            <span className="btn-icon">🏢</span>
            <div>
              <div className="btn-title">Acquire a Practice</div>
              <div className="btn-desc">Buy an existing practice. Inherit staff, patients, and problems.</div>
            </div>
          </button>

          {/* Challenge Mode — prominently featured */}
          <button className="start-btn" onClick={() => onChallenge()} style={{ borderColor: '#eab308', background: 'rgba(234,179,8,0.08)', position: 'relative' }}>
            <span className="btn-icon">🏆</span>
            <div>
              <div className="btn-title" style={{ color: '#eab308' }}>Challenge a Friend</div>
              <div className="btn-desc">Play the SAME season as a friend — same events, same market, different decisions. Compare scores and see who runs the better practice!</div>
            </div>
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#eab308', color: '#0a1628', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>COMPETE</span>
          </button>

          {/* Leaderboard — with inline top score preview */}
          <button className="start-btn" onClick={() => onLeaderboard()} style={{ borderColor: '#a78bfa', background: 'rgba(167,139,250,0.08)', position: 'relative' }}>
            <span className="btn-icon">📊</span>
            <div>
              <div className="btn-title" style={{ color: '#a78bfa' }}>Leaderboard</div>
              <div className="btn-desc">
                {(() => {
                  const board = getLeaderboard();
                  if (board.length === 0) return 'No scores yet — be the first to claim #1!';
                  return `Top score: ${board[0].overallScore}/1000 (${board[0].overallGrade}) · ${board.length} game${board.length !== 1 ? 's' : ''} played`;
                })()}
              </div>
            </div>
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#a78bfa', color: '#0a1628', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>
              {getLeaderboard().length || 0}
            </span>
          </button>
        </div>

        {/* Season feedback promo */}
        <div style={{ marginTop: '24px', padding: '12px 16px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', maxWidth: '450px', margin: '24px auto 0' }}>
          <div style={{ fontSize: '13px', color: '#60a5fa', fontWeight: 'bold', marginBottom: '4px' }}>📊 Every Season = A Learning Experience</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
            Complete a season and receive detailed feedback on your management decisions — overhead control, staffing, insurance strategy, patient growth, and real-world dental practice tips you can actually use.
          </div>
        </div>

        {/* Feedback link */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <a href="mailto:feedback@dentaltycoon.com?subject=Dental%20Tycoon%20Feedback&body=Hey%20-%20I%20have%20some%20feedback%20on%20Dental%20Tycoon%3A%0A%0A"
            style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none', borderBottom: '1px solid rgba(100,116,139,0.3)', paddingBottom: '1px' }}>
            Have feedback? Drop us a note
          </a>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LEADERBOARD SCREEN (from title)
// ═══════════════════════════════════════════════════════
function LeaderboardScreen({ onBack }) {
  const [tab, setTab] = useState('all');
  const board = getLeaderboard();

  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const ONE_WEEK = 7 * ONE_DAY;

  const filtered = tab === 'all' ? board
    : tab === 'daily' ? board.filter(e => e.date && (now - new Date(e.date).getTime()) < ONE_DAY)
    : tab === 'weekly' ? board.filter(e => e.date && (now - new Date(e.date).getTime()) < ONE_WEEK)
    : board;

  const modes = getLeaderboardModes();

  const gradeColor = (grade) => {
    if (!grade) return '#94a3b8';
    if (grade.startsWith('A')) return '#22c55e';
    if (grade.startsWith('B')) return '#3b82f6';
    if (grade.startsWith('C')) return '#eab308';
    if (grade.startsWith('D')) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="acquire-screen" style={{ textAlign: 'center' }}>
      <h2 className="acquire-title">Leaderboard</h2>
      <p className="acquire-sub">Top scores across all players on this device</p>

      {/* Time filter tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Time' },
          { id: 'weekly', label: 'This Week' },
          { id: 'daily', label: 'Today' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            background: tab === t.id ? 'rgba(59,130,246,0.2)' : 'rgba(30,41,59,0.6)',
            border: `1px solid ${tab === t.id ? 'rgba(59,130,246,0.5)' : 'rgba(100,116,139,0.2)'}`,
            color: tab === t.id ? '#60a5fa' : '#94a3b8',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Leaderboard table */}
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '40px 20px', color: '#64748b', fontStyle: 'italic' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏆</div>
            <div style={{ fontSize: '15px', marginBottom: '6px' }}>No scores yet{tab !== 'all' ? ` for ${tab === 'daily' ? 'today' : 'this week'}` : ''}</div>
            <div style={{ fontSize: '12px' }}>Complete a season to land on the leaderboard!</div>
          </div>
        ) : (
          filtered.slice(0, 20).map((entry, i) => (
            <div key={entry.id || i} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', marginBottom: '6px',
              background: i === 0 ? 'rgba(234,179,8,0.08)' : i === 1 ? 'rgba(192,192,192,0.05)' : i === 2 ? 'rgba(205,127,50,0.05)' : 'rgba(30,41,59,0.4)',
              border: `1px solid ${i === 0 ? 'rgba(234,179,8,0.3)' : i === 1 ? 'rgba(192,192,192,0.2)' : i === 2 ? 'rgba(205,127,50,0.2)' : 'rgba(148,163,184,0.08)'}`,
              borderRadius: '10px', textAlign: 'left',
            }}>
              {/* Rank */}
              <div style={{ fontSize: i < 3 ? '20px' : '14px', fontWeight: 'bold', color: i === 0 ? '#eab308' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#64748b', minWidth: '30px', textAlign: 'center' }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </div>

              {/* Score + Grade */}
              <div style={{ minWidth: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontFamily: 'Fredoka One', color: gradeColor(entry.overallGrade) }}>{entry.overallScore || 0}</div>
                <div style={{ fontSize: '11px', color: gradeColor(entry.overallGrade), fontWeight: 'bold' }}>{entry.overallGrade || '—'}</div>
              </div>

              {/* Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>
                  {entry.difficulty || 'Unknown'} · {entry.outcome === 'Bankrupt' ? '💀 Bankrupt' : '✅ Completed'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span>Day {entry.day || '?'}</span>
                  <span>{entry.finalPatients || entry.patients || 0} pts</span>
                  <span>${(entry.finalCash || 0).toLocaleString()}</span>
                  {entry.finalReputation && <span>{Number(entry.finalReputation).toFixed(1)}⭐</span>}
                </div>
              </div>

              {/* Date */}
              <div style={{ fontSize: '10px', color: '#475569', textAlign: 'right', minWidth: '50px' }}>
                {entry.date ? new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Difficulty breakdown */}
      {modes.length > 1 && tab === 'all' && (
        <div style={{ maxWidth: '550px', margin: '20px auto 0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Best by Difficulty</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {modes.map(mode => {
              const best = getLeaderboardByMode(mode)[0];
              if (!best) return null;
              return (
                <div key={mode} style={{ padding: '8px 14px', background: 'rgba(30,41,59,0.6)', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.1)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>{mode}</div>
                  <div style={{ fontSize: '16px', fontFamily: 'Fredoka One', color: gradeColor(best.overallGrade) }}>{best.overallScore}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button className="back-btn" onClick={onBack}>← Back to Menu</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DIFFICULTY SELECTION SCREEN
// ═══════════════════════════════════════════════════════
function DifficultySelectionScreen({ onSelect, onBack, startMode }) {
  const isAcquire = startMode === 'acquire';

  const systemToggles = [
    { key: 'staffDramaEnabled', label: 'Staff Drama', desc: 'Conflicts, quitting, burnout' },
    { key: 'equipBreakdownEnabled', label: 'Equipment Breakdowns', desc: 'Chairs break, need repair' },
    { key: 'insuranceAuditsEnabled', label: 'Insurance Audits', desc: 'Clawbacks, compliance' },
    { key: 'cashSpiralEnabled', label: 'Cash Spiral', desc: 'Escalating consequences when broke' },
    { key: 'competitorEventsEnabled', label: 'Competitors', desc: 'Poaching, aggressive marketing' },
    { key: 'expertEventsEnabled', label: 'Expert Events', desc: 'Embezzlement, malpractice, state audits' },
  ];

  return (
    <div className="acquire-screen">
      <h2 className="acquire-title">{isAcquire ? 'Choose Your Acquisition' : 'Choose Your Difficulty'}</h2>
      <p className="acquire-sub">{isAcquire
        ? 'Bigger practice = bigger revenue potential, but also bigger loan, bigger overhead, and more that can go wrong. Small and simple is easier to manage. Big and complex is where the real money — and real risk — lives.'
        : 'Same loan, same market. Difficulty controls how many systems you have to manage — beginners get training wheels, experts get chaos.'
      }</p>
      <div className="practice-list">
        {DIFFICULTY_MODES.filter(mode => !mode.startModes || mode.startModes.includes(startMode)).map(mode => {
          const modeName = isAcquire ? (mode.acquireName || mode.name) : mode.name;
          const modeSubtitle = isAcquire ? (mode.acquireSubtitle || mode.subtitle) : mode.subtitle;
          const modeDesc = isAcquire ? (mode.acquireDescription || mode.description) : mode.description;
          const modeFeatures = isAcquire ? (mode.acquireFeatures || mode.features) : mode.features;

          return (
            <div key={mode.id} className="practice-card" onClick={() => onSelect(mode)}>
              <h3 className="practice-name">{mode.icon} {modeName}</h3>
              <p className="practice-desc" style={{ fontStyle: 'italic', color: '#94a3b8' }}>{modeSubtitle}</p>
              <p className="practice-desc">{modeDesc}</p>
              <div className="practice-stats">
                <div className="pstat"><span className="pstat-label">{isAcquire ? 'Purchase Price' : 'Loan'}</span><span className="pstat-val">${(mode.loanAmount / 1000).toFixed(0)}K @ {Math.round(mode.interestRate * 100)}%</span></div>
                <div className="pstat"><span className="pstat-label">Season</span><span className="pstat-val">{mode.gameDuration} days</span></div>
                <div className="pstat"><span className="pstat-label">Overdraft</span><span className="pstat-val red">-${Math.abs(mode.overdraftLimit / 1000).toFixed(0)}K</span></div>
                <div className="pstat"><span className="pstat-label">Patient Growth</span><span className="pstat-val">{mode.patientGrowthBonus > 1 ? 'Easier' : mode.patientGrowthBonus < 1 ? 'Harder' : 'Normal'}</span></div>
              </div>
              {/* System Toggles — what's ON and OFF */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Systems Active</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {systemToggles.map(toggle => {
                    const isOn = mode[toggle.key];
                    return (
                      <span key={toggle.key} title={toggle.desc} style={{
                        fontSize: '10px', padding: '2px 8px', borderRadius: '10px',
                        background: isOn ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                        color: isOn ? '#ef4444' : '#22c55e',
                      }}>{isOn ? toggle.label : `No ${toggle.label}`}</span>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {modeFeatures.map((feat, i) => (
                  <span key={i} style={{
                    fontSize: '10px', padding: '3px 8px', borderRadius: '10px',
                    background: mode.id === 'expert' ? 'rgba(239,68,68,0.15)' : mode.id === 'beginner' ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
                    color: mode.id === 'expert' ? '#ef4444' : mode.id === 'beginner' ? '#22c55e' : '#eab308',
                  }}>{feat}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <button className="back-btn" onClick={onBack}>Back</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CHALLENGE SETUP SCREEN (1v1 + Group Tournament)
// ═══════════════════════════════════════════════════════
function ChallengeSetupScreen({ onStartChallenge, onJoinChallenge, onBack }) {
  const [mode, setMode] = useState(null); // 'create' | 'join' | 'view'
  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [viewCode, setViewCode] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY_MODES[1]);

  const handleCreate = () => {
    const code = generateChallengeCode();
    onStartChallenge({ code, playerName: playerName || 'Player 1', difficulty: selectedDifficulty });
  };

  const handleJoin = () => {
    if (joinCode.length < 4) return;
    onJoinChallenge({ code: joinCode.toUpperCase(), playerName: playerName || 'Player 2', difficulty: selectedDifficulty });
  };

  // View tournament standings for a code
  if (mode === 'view') {
    const results = viewCode.length >= 4 ? getChallengeResults(viewCode.toUpperCase()) : [];
    const sorted = [...results].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
    const gradeColor = (grade) => {
      if (!grade) return '#94a3b8';
      if (grade.startsWith('A')) return '#22c55e';
      if (grade.startsWith('B')) return '#3b82f6';
      if (grade.startsWith('C')) return '#eab308';
      if (grade.startsWith('D')) return '#f97316';
      return '#ef4444';
    };
    return (
      <div className="acquire-screen" style={{ maxWidth: '600px' }}>
        <h2 className="acquire-title">Tournament Standings</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Challenge Code</label>
          <input type="text" value={viewCode} onChange={e => setViewCode(e.target.value.toUpperCase())}
            placeholder="Enter code to view..." maxLength={6}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#eab308', fontSize: '20px', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '4px' }}
          />
        </div>
        {sorted.length > 0 ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {sorted.length} player{sorted.length !== 1 ? 's' : ''} competing
              </div>
            </div>
            {sorted.map((entry, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', marginBottom: '6px',
                background: i === 0 ? 'rgba(234,179,8,0.1)' : i === 1 ? 'rgba(192,192,192,0.06)' : i === 2 ? 'rgba(205,127,50,0.06)' : 'rgba(30,41,59,0.4)',
                border: `1px solid ${i === 0 ? 'rgba(234,179,8,0.3)' : i === 1 ? 'rgba(192,192,192,0.2)' : i === 2 ? 'rgba(205,127,50,0.2)' : 'rgba(148,163,184,0.08)'}`,
                borderRadius: '10px',
              }}>
                <div style={{ fontSize: i < 3 ? '20px' : '14px', fontWeight: 'bold', color: i === 0 ? '#eab308' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#64748b', minWidth: '30px', textAlign: 'center' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div style={{ minWidth: '55px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontFamily: 'Fredoka One', color: gradeColor(entry.overallGrade) }}>{entry.overallScore || 0}</div>
                  <div style={{ fontSize: '10px', color: gradeColor(entry.overallGrade), fontWeight: 'bold' }}>{entry.overallGrade || '—'}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 600 }}>{entry.playerName || 'Anonymous'}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span>${(entry.finalCash || 0).toLocaleString()}</span>
                    <span>{entry.finalPatients || entry.patients || 0} pts</span>
                    <span>{entry.finalReputation ? Number(entry.finalReputation).toFixed(1) : '?'}⭐</span>
                    <span>{entry.outcome === 'Bankrupt' ? '💀' : '✅'}</span>
                  </div>
                </div>
              </div>
            ))}
            {sorted.length >= 2 && (
              <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(30,41,59,0.4)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Score spread: {sorted[sorted.length - 1].overallScore || 0} — {sorted[0].overallScore || 0} ({(sorted[0].overallScore || 0) - (sorted[sorted.length - 1].overallScore || 0)} point gap)
                </div>
              </div>
            )}
          </div>
        ) : viewCode.length >= 4 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏟️</div>
            <div>No results for this code yet</div>
            <div style={{ fontSize: '11px', marginTop: '4px' }}>Join the challenge and be the first to compete!</div>
          </div>
        ) : null}
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button className="back-btn" onClick={() => setMode(null)}>Back</button>
          {viewCode.length >= 4 && (
            <button className="start-btn" style={{ flex: 1 }} onClick={() => { setJoinCode(viewCode); setMode('join'); }}>
              <span className="btn-icon">🎮</span>
              <div><div className="btn-title">Join This Challenge</div></div>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!mode) {
    const allChallenges = Object.keys(getAllChallenges());
    return (
      <div className="acquire-screen">
        <h2 className="acquire-title">Challenge Mode</h2>
        <p className="acquire-sub">Play the same season as friends. Same events, same candidates, same market — different decisions. Share a code with 2, 10, or 30 people and see who runs the best practice.</p>
        <div className="practice-list">
          <div className="practice-card" onClick={() => setMode('create')} style={{ borderLeft: '3px solid #eab308' }}>
            <h3 className="practice-name">Start a Challenge</h3>
            <p className="practice-desc">Generate a unique code. Share it with 1 friend or 30 — everyone plays the exact same season. Compare on a live leaderboard.</p>
          </div>
          <div className="practice-card" onClick={() => setMode('join')} style={{ borderLeft: '3px solid #3b82f6' }}>
            <h3 className="practice-name">Join a Challenge</h3>
            <p className="practice-desc">Enter a friend's code to play their season. Your score gets added to the group standings.</p>
          </div>
          <div className="practice-card" onClick={() => setMode('view')} style={{ borderLeft: '3px solid #a78bfa' }}>
            <h3 className="practice-name">View Tournament</h3>
            <p className="practice-desc">Check standings for any challenge code. See who's winning, score spreads, and how everyone performed.</p>
          </div>
        </div>
        {/* Show existing tournaments */}
        {allChallenges.length > 0 && (
          <div style={{ marginTop: '15px' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>Your Tournaments</h3>
            {allChallenges.slice(0, 8).map(code => {
              const results = getChallengeResults(code);
              const sorted = [...results].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
              const topPlayer = sorted[0];
              return (
                <div key={code} onClick={() => { setViewCode(code); setMode('view'); }}
                  style={{ padding: '10px 12px', background: 'rgba(30,41,59,0.4)', borderRadius: '8px', marginBottom: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(148,163,184,0.08)' }}>
                  <div style={{ fontFamily: 'monospace', color: '#eab308', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px' }}>{code}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', color: '#e2e8f0' }}>
                      {results.length} player{results.length !== 1 ? 's' : ''}
                      {topPlayer && <span style={{ color: '#64748b' }}> · Leader: {topPlayer.playerName} ({topPlayer.overallScore || '?'}pts)</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#475569' }}>→</span>
                </div>
              );
            })}
          </div>
        )}
        <button className="back-btn" onClick={onBack}>Back</button>
      </div>
    );
  }

  return (
    <div className="acquire-screen">
      <h2 className="acquire-title">{mode === 'create' ? 'Start a Challenge' : 'Join a Challenge'}</h2>
      <p className="acquire-sub" style={{ marginBottom: '15px' }}>
        {mode === 'create'
          ? 'Share the generated code with anyone — friends, coworkers, your study group. Everyone plays the same season.'
          : 'Enter the challenge code to play the same season as the group.'}
      </p>

      {/* Player name */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Your Name</label>
        <input
          type="text" value={playerName} onChange={e => setPlayerName(e.target.value)}
          placeholder="Enter your name..."
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#e2e8f0', fontSize: '14px' }}
        />
      </div>

      {/* Join code input */}
      {mode === 'join' && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Challenge Code</label>
          <input
            type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-letter code..."
            maxLength={6}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#eab308', fontSize: '20px', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '4px' }}
          />
          {joinCode.length === 6 && (() => {
            const existing = getChallengeResults(joinCode.toUpperCase());
            if (existing.length > 0) {
              return (
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#22c55e' }}>
                  Found! {existing.length} player{existing.length !== 1 ? 's' : ''} competing: {existing.slice(0, 5).map(r => r.playerName).join(', ')}{existing.length > 5 ? ` +${existing.length - 5} more` : ''}
                </div>
              );
            }
            return <div style={{ marginTop: '6px', fontSize: '11px', color: '#94a3b8' }}>No one has played this code yet — you'll be the first!</div>;
          })()}
        </div>
      )}

      {/* Difficulty selection */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Difficulty</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {DIFFICULTY_MODES.map(d => (
            <button key={d.id} onClick={() => setSelectedDifficulty(d)}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', border: `2px solid ${selectedDifficulty.id === d.id ? '#eab308' : '#334155'}`,
                background: selectedDifficulty.id === d.id ? 'rgba(234,179,8,0.1)' : '#1e293b', color: '#e2e8f0', cursor: 'pointer',
              }}>
              <div style={{ fontSize: '16px' }}>{d.icon}</div>
              <div style={{ fontSize: '12px' }}>{d.name}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>{d.gameDuration}d</div>
            </button>
          ))}
        </div>
      </div>

      <div className="buildout-actions" style={{ marginTop: '15px' }}>
        <button className="back-btn" onClick={() => setMode(null)}>Back</button>
        <button className="start-btn buildout-proceed" onClick={mode === 'create' ? handleCreate : handleJoin}
          disabled={mode === 'join' && joinCode.length < 4}>
          <span className="btn-icon">{mode === 'create' ? '🎲' : '🏆'}</span>
          <div>
            <div className="btn-title">{mode === 'create' ? 'Generate & Play' : 'Join & Play'}</div>
            <div className="btn-desc">{mode === 'create' ? 'Creates a shareable code' : `Play challenge ${joinCode}`}</div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CHALLENGE COMPARE / TOURNAMENT SCREEN
// ═══════════════════════════════════════════════════════
function ChallengeCompareScreen({ challengeCode, myResult, onBack }) {
  const allResults = getChallengeResults(challengeCode);
  const sorted = [...allResults].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
  const myRank = sorted.findIndex(r => r.playerName === myResult.playerName && r.date === myResult.date) + 1;
  const otherResults = allResults.filter(r => r.playerName !== myResult.playerName || r.date !== myResult.date);
  const isGroupTournament = allResults.length >= 3;

  const gradeColor = (grade) => {
    if (!grade) return '#94a3b8';
    if (grade.startsWith('A')) return '#22c55e';
    if (grade.startsWith('B')) return '#3b82f6';
    if (grade.startsWith('C')) return '#eab308';
    if (grade.startsWith('D')) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="acquire-screen" style={{ maxWidth: '700px' }}>
      <h2 className="acquire-title">{isGroupTournament ? 'Tournament Results' : 'Challenge Results'}</h2>
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <div style={{ fontSize: '24px', fontFamily: 'monospace', color: '#eab308', fontWeight: 'bold', letterSpacing: '4px' }}>{challengeCode}</div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          {allResults.length} player{allResults.length !== 1 ? 's' : ''} competing
          {myRank > 0 && <span> · You are <strong style={{ color: myRank <= 3 ? '#eab308' : '#e2e8f0' }}>#{myRank}</strong></span>}
        </div>
      </div>

      {/* Group Tournament Leaderboard (3+ players) */}
      {isGroupTournament && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', textAlign: 'center' }}>Tournament Standings</h3>
          {sorted.map((entry, i) => {
            const isMe = entry.playerName === myResult.playerName && entry.date === myResult.date;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', marginBottom: '5px',
                background: isMe ? 'rgba(234,179,8,0.12)' : i === 0 ? 'rgba(234,179,8,0.06)' : 'rgba(30,41,59,0.4)',
                border: `1px solid ${isMe ? 'rgba(234,179,8,0.4)' : i === 0 ? 'rgba(234,179,8,0.2)' : 'rgba(148,163,184,0.08)'}`,
                borderRadius: '10px',
              }}>
                <div style={{ fontSize: i < 3 ? '18px' : '13px', fontWeight: 'bold', color: i === 0 ? '#eab308' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#64748b', minWidth: '28px', textAlign: 'center' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div style={{ minWidth: '50px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontFamily: 'Fredoka One', color: gradeColor(entry.overallGrade) }}>{entry.overallScore || 0}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>
                    {entry.playerName || 'Anonymous'} {isMe && <span style={{ fontSize: '10px', color: '#eab308' }}>(You)</span>}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', display: 'flex', gap: '6px' }}>
                    <span>{entry.overallGrade}</span>
                    <span>${(entry.finalCash || 0).toLocaleString()}</span>
                    <span>{entry.finalPatients || 0} pts</span>
                    <span>{entry.outcome === 'Bankrupt' ? '💀' : '✅'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* My result card */}
      <div style={{ padding: '12px', background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: '10px', marginBottom: '12px' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#eab308', marginBottom: '6px' }}>{myResult.playerName} (You){myRank > 0 ? ` — #${myRank}` : ''}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'Fredoka One', color: gradeColor(myResult.overallGrade) }}>{myResult.overallGrade}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>{myResult.overallScore || '?'}/1000</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#e2e8f0' }}>${(myResult.finalCash || 0).toLocaleString()}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Cash</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#e2e8f0' }}>{myResult.finalPatients || 0}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Patients</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#e2e8f0' }}>{Number(myResult.finalReputation || 0).toFixed(1)}</div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Stars</div>
          </div>
        </div>
      </div>

      {/* 1v1 Comparison (show for 2 players, or top comparisons for groups) */}
      {otherResults.length > 0 && (
        <div>
          <h3 style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>{isGroupTournament ? 'Your Best Head-to-Head' : 'Head-to-Head'}</h3>
          {(isGroupTournament ? otherResults.slice(0, 2) : otherResults).map((other, idx) => {
            const comparisons = compareChallengeResults(myResult, other);
            return (
              <div key={idx} style={{ marginBottom: '12px', padding: '10px', background: 'rgba(30,41,59,0.3)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#e2e8f0', marginBottom: '6px', fontWeight: 'bold', textAlign: 'center' }}>
                  {myResult.playerName} vs {other.playerName}
                </div>
                {comparisons.map((comp, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '4px 6px', background: 'rgba(15,23,42,0.3)', borderRadius: '4px', marginBottom: '2px', fontSize: '12px' }}>
                    <div style={{ flex: 1, color: comp.winner === 1 ? '#22c55e' : '#94a3b8', textAlign: 'right' }}>
                      {comp.format === 'currency' ? `$${(comp.p1 || 0).toLocaleString()}` :
                       comp.format === 'percent_lower_better' ? `${comp.p1}%` :
                       comp.format === 'stars' ? `${Number(comp.p1 || 0).toFixed(1)}` :
                       comp.p1}
                    </div>
                    <div style={{ width: '110px', textAlign: 'center', color: '#64748b', fontSize: '10px' }}>{comp.category}</div>
                    <div style={{ flex: 1, color: comp.winner === 2 ? '#22c55e' : '#94a3b8' }}>
                      {comp.format === 'currency' ? `$${(comp.p2 || 0).toLocaleString()}` :
                       comp.format === 'percent_lower_better' ? `${comp.p2}%` :
                       comp.format === 'stars' ? `${Number(comp.p2 || 0).toFixed(1)}` :
                       comp.p2}
                    </div>
                  </div>
                ))}
                {comparisons.filter(c => c.insight).slice(0, 2).map((comp, i) => (
                  <div key={`insight-${i}`} style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic', marginTop: '3px', paddingLeft: '8px' }}>
                    {comp.insight}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {otherResults.length === 0 && (
        <div style={{ padding: '16px', background: 'rgba(234,179,8,0.08)', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#eab308', marginBottom: '4px' }}>Waiting for challengers!</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Share <strong style={{ color: '#eab308', fontFamily: 'monospace', letterSpacing: '2px' }}>{challengeCode}</strong> with friends. Everyone who plays gets ranked on the tournament board.</div>
        </div>
      )}

      <button className="back-btn" onClick={onBack} style={{ marginTop: '15px' }}>Back to Menu</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SCORE CARD
// ═══════════════════════════════════════════════════════
function ScoreCard({ gameState, stats, difficulty }) {
  const score = calculateScore(gameState, stats);
  if (!score) return (
    <div style={{ padding: '15px', textAlign: 'center', color: '#64748b' }}>
      <p>Score available after Day 10</p>
      <p style={{ fontSize: '11px' }}>Keep playing to see your practice report card!</p>
    </div>
  );

  const catList = Object.entries(score.categories);

  return (
    <div className="scorecard">
      <div className="score-overall">
        <div className="score-grade" style={{ color: score.overallColor, borderColor: score.overallColor }}>{score.overallGrade}</div>
        <div>
          <div className="score-overall-label">Overall Score</div>
          <div className="score-overall-pts" style={{ color: score.overallColor }}>{score.overall} / 1000</div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>Difficulty: {difficulty?.name || 'Intermediate'} | Day {gameState.day}</div>
        </div>
      </div>
      <div className="score-categories">
        {catList.map(([key, cat]) => (
          <div key={key} className="score-cat-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px' }}>{cat.icon}</span>
              <div>
                <div className="score-cat-name">{cat.name} <span style={{ color: '#475569', fontSize: '9px' }}>({cat.weight}%)</span></div>
                <div className="score-cat-detail">{cat.value} <span style={{ color: '#475569' }}>target: {cat.target}</span></div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '50px', height: '4px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${cat.score}%`, height: '100%', background: cat.color, borderRadius: '2px' }} />
              </div>
              <div className="score-cat-grade" style={{ color: cat.color, minWidth: '24px' }}>{cat.grade}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Tips for weakest areas */}
      {(() => {
        const weakest = catList.filter(([, c]) => c.score < 50).sort((a, b) => a[1].score - b[1].score).slice(0, 2);
        if (weakest.length === 0) return null;
        return (
          <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(239,68,68,0.08)', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 'bold', marginBottom: '4px' }}>Focus Areas</div>
            {weakest.map(([key, cat]) => (
              <div key={key} style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '2px' }}>
                {cat.icon} <strong>{cat.name}:</strong> {cat.tip}
              </div>
            ))}
          </div>
        );
      })()}
      <div className="score-financials">
        <div className="score-fin-row">
          <span>Monthly Revenue</span>
          <span className="green">${score.metrics.monthlyRevenue.toLocaleString()}</span>
        </div>
        <div className="score-fin-row">
          <span>Monthly Profit</span>
          <span className={score.metrics.monthlyProfit >= 0 ? 'green' : 'red'}>
            {score.metrics.monthlyProfit >= 0 ? '+' : ''}${score.metrics.monthlyProfit.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// OPPOSING FORCES TIPS
// ═══════════════════════════════════════════════════════
function OpposingForcesTips({ show }) {
  const [expanded, setExpanded] = useState(null);
  if (!show) return null;
  return (
    <div style={{ marginTop: '10px' }}>
      <h4 className="mgmt-subtitle">Key Trade-offs to Watch</h4>
      <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '8px' }}>Every decision has opposing forces. Tap to learn more.</p>
      {OPPOSING_FORCES.map((force, i) => (
        <div key={i} className="toggle-card" onClick={() => setExpanded(expanded === i ? null : i)} style={{ cursor: 'pointer' }}>
          <div className="toggle-info">
            <div className="toggle-name">{force.action}</div>
            {expanded === i && (
              <div style={{ marginTop: '6px', fontSize: '11px' }}>
                <div style={{ color: '#22c55e', marginBottom: '3px' }}>+ {force.positive}</div>
                <div style={{ color: '#ef4444', marginBottom: '3px' }}>- {force.negative}</div>
                <div style={{ color: '#3b82f6', fontStyle: 'italic' }}>Tip: {force.tip}</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SPACE SELECTION SCREEN
// ═══════════════════════════════════════════════════════
function SpaceSelectionScreen({ onSelect, onBack }) {
  return (
    <div className="acquire-screen">
      <h2 className="acquire-title">Choose Your Space</h2>
      <p className="acquire-sub">This is your biggest decision. Bigger space = more potential revenue, but rent burns cash every day with ZERO patients. Choose wisely.</p>
      <div className="practice-list">
        {SPACE_OPTIONS.map(space => (
          <div key={space.id} className="practice-card" onClick={() => onSelect(space)}>
            <h3 className="practice-name">{space.name}</h3>
            <p className="practice-desc">{space.description}</p>
            <div className="practice-stats">
              <div className="pstat"><span className="pstat-label">Square Feet</span><span className="pstat-val">{space.sqft.toLocaleString()} sqft</span></div>
              <div className="pstat"><span className="pstat-label">Monthly Rent</span><span className="pstat-val red">${space.rent.toLocaleString()}/mo</span></div>
              <div className="pstat"><span className="pstat-label">Max Operatories</span><span className="pstat-val">{space.maxOps}</span></div>
              <div className="pstat"><span className="pstat-label">Annual Rent</span><span className="pstat-val red">${(space.rent * 12).toLocaleString()}/yr</span></div>
            </div>
            <div style={{ marginTop: '12px', borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: '10px' }}>
              <div style={{ fontSize: '11px', marginBottom: '4px' }}><span style={{ color: '#22c55e', fontWeight: 600 }}>Pros:</span> <span style={{ color: '#94a3b8' }}>{space.pros}</span></div>
              <div style={{ fontSize: '11px' }}><span style={{ color: '#ef4444', fontWeight: 600 }}>Cons:</span> <span style={{ color: '#94a3b8' }}>{space.cons}</span></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
        <p style={{ color: '#eab308', fontSize: '13px', fontStyle: 'italic' }}>Remember: You start with ZERO patients. Rent is due whether you have patients or not. Budget for marketing!</p>
      </div>
      <button className="back-btn" onClick={onBack}>Back</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BUILDOUT SCREEN
// ═══════════════════════════════════════════════════════
// ─── STARTUP COACH ───
// Analyzes current state and gives the single most important piece of advice right now.
function getCoachTip(phase, state) {
  const tips = [];

  if (phase === 'buildout') {
    const { builtRooms, remainingBudget, initialBudget, space, opsCount } = state;
    const budgetUsedPct = 1 - (remainingBudget / initialBudget);
    const hasWaiting = builtRooms.includes('waiting_area') || builtRooms.includes('premium_waiting');
    const hasSterilization = builtRooms.includes('sterilization');

    if (builtRooms.length === 0) {
      return { icon: '👋', text: "Welcome! This is where you design your office. You MUST build a waiting area, sterilization room, and at least 1 operatory before moving on. Don't blow your whole budget here — you still need to buy equipment, hire staff, and start marketing.", priority: 'info' };
    }
    if (!hasWaiting) {
      tips.push({ icon: '🪑', text: 'You need a waiting area! Patients need somewhere to sit before they\'re seen. This is required.', priority: 'critical' });
    }
    if (!hasSterilization) {
      tips.push({ icon: '🧹', text: 'No sterilization room yet. You literally can\'t sterilize instruments without one — this is required.', priority: 'critical' });
    }
    if (opsCount === 0) {
      tips.push({ icon: '🦷', text: 'Build at least 1 operatory! This is the room where you actually treat patients. No ops = no patients.', priority: 'critical' });
    }
    if (budgetUsedPct > 0.6) {
      tips.push({ icon: '💸', text: `You've spent ${Math.round(budgetUsedPct * 100)}% of your loan on buildout. That's aggressive. You still need dental chairs ($15-50K each), a dentist ($130-200K/yr salary), front desk staff, and marketing. Make sure you have enough left.`, priority: 'warning' });
    }
    if (opsCount >= 1 && hasWaiting && hasSterilization && budgetUsedPct < 0.35) {
      tips.push({ icon: '✅', text: `Looking good! You've got the essentials built and plenty of budget left for equipment and staff. Each operatory needs a dental chair and a provider to use it. Don't build 4 ops if you can only afford 1 dentist.`, priority: 'good' });
    }
    if (opsCount >= 3) {
      tips.push({ icon: '⚠️', text: `${opsCount} operatories is ambitious. Each one needs a dental chair (~$25K+), a provider (dentist/hygienist), and a dental assistant. That's ~$200K+ per year per operatory in staffing. Make sure your budget supports it.`, priority: 'warning' });
    }
    if (opsCount >= 1 && opsCount <= 2 && hasWaiting && hasSterilization) {
      tips.push({ icon: '💡', text: `Pro tip: A real startup usually needs 2-3 operatories. One for the dentist, one for the hygienist, and maybe a spare. But every room you build costs money to equip and staff.`, priority: 'info' });
    }
  }

  if (phase === 'setup') {
    const { equipment, staff, marketing, insurance, cash, monthlyBurn, monthsOfRunway, hasChair, hasDentist, hasFrontDesk, hasMarketing, activeTab, diff } = state;
    const chairCount = equipment.filter(eq => {
      const def = EQUIPMENT.find(e => e.id === eq);
      return def && def.patientsPerDay > 0;
    }).length;
    const dentistCount = staff.filter(s => isProvider(s)).length;
    const hygienistCount = staff.filter(s => s.role === 'Hygienist').length;
    const assistantCount = staff.filter(s => s.role === 'Dental Assistant').length;

    // Tab-specific coaching
    if (activeTab === 'equip') {
      if (!hasChair) {
        return { icon: '🚨', text: "PRIORITY #1: Buy a dental chair. It's the single most important purchase — without one, you cannot see a single patient. Everything else is secondary.", priority: 'critical' };
      }
      if (chairCount === 1 && cash > 80000) {
        tips.push({ icon: '💡', text: "You have 1 chair. That's enough to start, but your dentist can only see ~8-12 patients/day in it. A second chair lets a hygienist work simultaneously, nearly doubling throughput.", priority: 'info' });
      }
      if (chairCount > dentistCount + hygienistCount) {
        tips.push({ icon: '⚠️', text: `You have ${chairCount} chair(s) but only ${dentistCount + hygienistCount} provider(s) who can use them. Empty chairs cost maintenance but generate zero revenue. Hire providers or return extra chairs.`, priority: 'warning' });
      }
      if (equipment.length === 0) {
        tips.push({ icon: '🔧', text: "You have no equipment at all. At minimum you need: 1 dental chair, basic instruments. An X-ray unit and sterilization equipment are highly recommended for a real practice.", priority: 'critical' });
      }
    }

    if (activeTab === 'staff') {
      if (!hasDentist) {
        return { icon: '🚨', text: "You NEED a dentist. No dentist = no one to diagnose or treat patients. This is your #1 hire. Look for high skill (clinical quality) and decent attitude (patient satisfaction).", priority: 'critical' };
      }
      if (hasDentist && !hasFrontDesk) {
        tips.push({ icon: '📞', text: "No front desk person! You'll lose ~60% of potential patients without someone answering phones and scheduling. This should be your #2 hire after the dentist.", priority: 'warning' });
      }
      if (hasDentist && hasFrontDesk && assistantCount === 0) {
        tips.push({ icon: '🩺', text: "Consider hiring a dental assistant. They help the dentist work faster and see more patients per day. Not critical for Day 1 but becomes important quickly.", priority: 'info' });
      }
      if (hasDentist && hasFrontDesk && hygienistCount === 0 && chairCount >= 2) {
        tips.push({ icon: '🪥', text: "You have multiple chairs — a hygienist could use the second one for cleanings and exams. Hygienists see their own patients and generate separate revenue.", priority: 'info' });
      }
      if (staff.length >= 4 && monthsOfRunway < 3) {
        tips.push({ icon: '💸', text: `You have ${staff.length} staff but only ${monthsOfRunway} months of cash runway. Payroll is your biggest expense. It takes time to build patient volume — if you run out of cash before patients come, it's game over.`, priority: 'warning' });
      }
    }

    if (activeTab === 'mktg') {
      if (!hasMarketing) {
        return { icon: '🚨', text: "This is NOT optional. A new practice with zero marketing gets ZERO patients. Nobody knows you exist. Turn on at least 1-2 channels. Google Ads + a website is the modern minimum.", priority: 'critical' };
      }
      if (marketing.length === 1) {
        tips.push({ icon: '📢', text: "One marketing channel is a start, but diversifying helps. If your one channel underperforms, you have no backup. 2-3 channels is the sweet spot for a startup.", priority: 'info' });
      }
      if (marketing.length >= 3 && monthsOfRunway < 3) {
        tips.push({ icon: '💸', text: `${marketing.length} channels is great for visibility, but marketing costs add up. Make sure your cash can sustain this burn rate for a few months while you build volume.`, priority: 'warning' });
      }
    }

    if (activeTab === 'ins') {
      const hmoInsurance = insurance.filter(id => { const p = INSURANCE_PLANS.find(pl => pl.id === id); return p?.type === 'hmo' || p?.type === 'medicaid'; });
      const ppoInsurance = insurance.filter(id => { const p = INSURANCE_PLANS.find(pl => pl.id === id); return p?.type === 'ppo' || p?.type === 'premium_ppo'; });
      if (insurance.length === 0) {
        tips.push({ icon: '💡', text: "No insurance yet. That's OK — cash-only practices exist and have the highest margins. But you'll grow MUCH slower without insurance panels driving patients to you. Most startups need 1-2 PPO plans.", priority: 'info' });
      }
      if (hmoInsurance.length === 1 && insurance.length <= 3) {
        tips.push({ icon: '🏥', text: "HMO = capitation. Monthly per-member pay, not per visit. Low per-visit revenue but it adds up with volume. You'll need more staff to handle the throughput.", priority: 'info' });
      }
      if (hmoInsurance.length >= 1 && staff.length < 4) {
        tips.push({ icon: '🚨', text: "#1 reason HMO practices fail: not enough staff for the volume. Hire an extra assistant + front desk person ASAP or you'll bleed efficiency.", priority: 'warning' });
      }
      if (hmoInsurance.length >= 2 && staff.length >= 5) {
        tips.push({ icon: '✅', text: "Volume practice is humming. Capitation revenue is steady, staff seems adequate, overhead looks controlled. Keep it tight.", priority: 'good' });
      }
      if (hmoInsurance.length >= 1 && ppoInsurance.length >= 2) {
        tips.push({ icon: '⚖️', text: "Tricky balance: PPO patients expect a personal touch while HMO expects efficiency. Make sure you have enough staff for both styles.", priority: 'info' });
      }
      if (insurance.length >= 4) {
        tips.push({ icon: '⚠️', text: `${insurance.length} plans is a lot. Each one has admin costs, and insurance patients pay less than cash patients. You may be cannibalizing your best revenue. Quality over quantity.`, priority: 'warning' });
      }
    }

    // General state-aware tips (shown when tab-specific tips don't fire)
    if (tips.length === 0) {
      if (hasChair && hasDentist && hasFrontDesk && hasMarketing && monthsOfRunway >= 2) {
        tips.push({ icon: '🚀', text: "You're looking ready to launch! You have the essentials: chair, dentist, front desk, marketing, and cash runway. Review your setup one more time and hit Launch when you're confident.", priority: 'good' });
      } else if (monthsOfRunway < 2 && monthlyBurn > 0) {
        tips.push({ icon: '🔥', text: `Danger: ${monthsOfRunway} month(s) of runway. Revenue takes time to build. You'll be burning $${monthlyBurn.toLocaleString()}/mo from Day 1 with very few patients. Either cut costs or make sure you have enough cash to survive.`, priority: 'critical' });
      }
    }
  }

  // Return highest priority tip
  const priorityOrder = ['critical', 'warning', 'info', 'good'];
  tips.sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority));
  return tips[0] || null;
}

function CoachBanner({ tip }) {
  if (!tip) return null;
  const colors = {
    critical: { bg: 'rgba(239,68,68,0.12)', border: '#ef4444', text: '#fca5a5' },
    warning: { bg: 'rgba(234,179,8,0.10)', border: '#eab308', text: '#fde68a' },
    info: { bg: 'rgba(59,130,246,0.10)', border: '#3b82f6', text: '#93c5fd' },
    good: { bg: 'rgba(34,197,94,0.10)', border: '#22c55e', text: '#86efac' },
  };
  const c = colors[tip.priority] || colors.info;
  return (
    <div style={{
      padding: '10px 14px', marginBottom: '12px',
      background: c.bg, border: `1px solid ${c.border}33`,
      borderLeft: `4px solid ${c.border}`, borderRadius: '8px',
      display: 'flex', alignItems: 'flex-start', gap: '10px',
    }}>
      <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{tip.icon}</span>
      <div>
        <div style={{ fontSize: '10px', color: c.border, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px', fontWeight: 'bold' }}>
          {tip.priority === 'critical' ? 'Coach Says — DO THIS NOW' : tip.priority === 'warning' ? 'Coach Warning' : tip.priority === 'good' ? 'Coach — Looking Good!' : 'Coach Tip'}
        </div>
        <div style={{ fontSize: '12px', color: c.text, lineHeight: 1.5 }}>{tip.text}</div>
      </div>
    </div>
  );
}

function BuildoutScreen({ space, difficulty, onComplete, onBack }) {
  const initialBudget = difficulty?.loanAmount || 750000;
  const baseBuildoutCost = space.baseBuildoutCost || Math.round(space.sqft * 125); // lease deposit, permits, plumbing, electrical, HVAC, IT infrastructure
  const [builtRooms, setBuiltRooms] = useState([]);
  const [cashSpent, setCashSpent] = useState(0);

  const usedSqft = builtRooms.reduce((sum, id) => {
    const item = BUILDOUT_ITEMS.find(b => b.id === id);
    return sum + (item ? item.sqftNeeded : 0);
  }, 0);
  const remainingSqft = space.sqft - usedSqft;
  const remainingBudget = initialBudget - baseBuildoutCost - cashSpent;

  const opsCount = builtRooms.filter(r => r === 'basic_ops' || r === 'premium_ops').length;

  const canBuild = (item) => {
    const cost = item.costPerSqft * item.sqftNeeded;
    if (cost > remainingBudget) return false;
    if (item.sqftNeeded > remainingSqft) return false;
    if ((item.id === 'basic_ops' || item.id === 'premium_ops') && opsCount >= space.maxOps) return false;
    // Non-repeatable items (except operatories)
    if (item.id !== 'basic_ops' && item.id !== 'premium_ops' && builtRooms.includes(item.id)) return false;
    return true;
  };

  const buildItem = (item) => {
    if (!canBuild(item)) return;
    const cost = item.costPerSqft * item.sqftNeeded;
    setBuiltRooms(prev => [...prev, item.id]);
    setCashSpent(prev => prev + cost);
  };

  const removeItem = (index) => {
    const removedId = builtRooms[index];
    const item = BUILDOUT_ITEMS.find(b => b.id === removedId);
    if (!item) return;
    const cost = item.costPerSqft * item.sqftNeeded;
    setBuiltRooms(prev => prev.filter((_, i) => i !== index));
    setCashSpent(prev => prev - cost);
  };

  const hasWaiting = builtRooms.includes('waiting_area') || builtRooms.includes('premium_waiting');
  const hasSterilization = builtRooms.includes('sterilization');
  const hasOps = opsCount >= 1;
  const canProceed = hasWaiting && hasSterilization && hasOps;

  const handleProceed = () => {
    if (!canProceed) return;
    onComplete({
      builtOutRooms: builtRooms,
      cashRemaining: remainingBudget,
      baseBuildoutCost: baseBuildoutCost,
      space: space,
    });
  };

  const coachTip = getCoachTip('buildout', {
    builtRooms, remainingBudget, initialBudget, space, opsCount,
  });

  return (
    <div className="acquire-screen">
      <h2 className="acquire-title">Build Out Your Space</h2>
      <p className="acquire-sub">{space.name} - {space.sqft.toLocaleString()} sqft | Rent: ${space.rent.toLocaleString()}/mo</p>
      <div style={{ maxWidth: '600px', margin: '0 auto 16px', padding: '10px 16px', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '8px', fontSize: '12px', color: '#94a3b8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Loan Amount:</span><span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>${initialBudget.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Base Buildout (lease, permits, plumbing, HVAC, IT):</span><span style={{ color: '#ef4444', fontWeight: 'bold' }}>-${baseBuildoutCost.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Room & Operatory Buildout:</span><span style={{ color: '#ef4444', fontWeight: 'bold' }}>-${cashSpent.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(148,163,184,0.2)', paddingTop: '4px' }}>
          <span style={{ fontWeight: 'bold' }}>Remaining for Equipment, Staff & Reserves:</span><span style={{ color: remainingBudget < 50000 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>${remainingBudget.toLocaleString()}</span>
        </div>
      </div>

      <CoachBanner tip={coachTip} />

      <div className="buildout-layout">
        {/* Budget & Space Summary */}
        <div className="buildout-summary">
          <div className="buildout-stat-row">
            <div className="buildout-stat">
              <div className="buildout-stat-label">Remaining Budget</div>
              <div className={`buildout-stat-value ${remainingBudget < 100000 ? 'red' : 'green'}`}>
                ${remainingBudget.toLocaleString()}
              </div>
            </div>
            <div className="buildout-stat">
              <div className="buildout-stat-label">Remaining Space</div>
              <div className={`buildout-stat-value ${remainingSqft < 100 ? 'red' : ''}`}>
                {remainingSqft.toLocaleString()} sqft
              </div>
            </div>
            <div className="buildout-stat">
              <div className="buildout-stat-label">Operatories</div>
              <div className="buildout-stat-value">{opsCount} / {space.maxOps}</div>
            </div>
          </div>

          {/* Space usage bar */}
          <div className="buildout-space-bar-container">
            <div className="buildout-space-bar-label">Space Usage: {usedSqft} / {space.sqft} sqft</div>
            <div className="bar" style={{ height: '10px' }}>
              <div className="bar-fill" style={{
                width: `${Math.min(100, (usedSqft / space.sqft) * 100)}%`,
                background: usedSqft > space.sqft * 0.9 ? '#ef4444' : usedSqft > space.sqft * 0.7 ? '#eab308' : '#22c55e'
              }} />
            </div>
          </div>

          {/* Requirements */}
          <div className="buildout-requirements">
            <span className="buildout-req-title">Requirements:</span>
            <span className={`buildout-req ${hasWaiting ? 'met' : ''}`}>Waiting Area {hasWaiting ? '✓' : '✗'}</span>
            <span className={`buildout-req ${hasSterilization ? 'met' : ''}`}>Sterilization {hasSterilization ? '✓' : '✗'}</span>
            <span className={`buildout-req ${hasOps ? 'met' : ''}`}>1+ Operatory {hasOps ? '✓' : '✗'}</span>
          </div>
        </div>

        <div className="buildout-columns">
          {/* Available Items */}
          <div className="buildout-available">
            <h3 className="mgmt-title">Available Buildout Items</h3>
            {BUILDOUT_ITEMS.map(item => {
              const cost = item.costPerSqft * item.sqftNeeded;
              const available = canBuild(item);
              const alreadyBuilt = item.id !== 'basic_ops' && item.id !== 'premium_ops' && builtRooms.includes(item.id);
              return (
                <div key={item.id} className="shop-item">
                  <span className="shop-icon">{item.icon}</span>
                  <div className="shop-info">
                    <div className="shop-name">
                      {item.name}
                      {item.required && <span className="owned-badge" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>Required</span>}
                      {alreadyBuilt && <span className="owned-badge">Built</span>}
                    </div>
                    <div className="shop-detail">
                      {item.sqftNeeded} sqft | ${cost.toLocaleString()}
                      {item.satisfactionBonus ? ` | +${item.satisfactionBonus} satisfaction` : ''}
                      {item.cleanlinessBonus ? ` | +${item.cleanlinessBonus} cleanliness` : ''}
                      {item.moraleBonus ? ` | +${item.moraleBonus} morale` : ''}
                      {item.revenueBonus ? ` | +$${item.revenueBonus} revenue` : ''}
                    </div>
                    <div className="shop-detail">{item.description}</div>
                  </div>
                  {alreadyBuilt ? (
                    <span className="owned-label">Built</span>
                  ) : (
                    <button
                      className={`buy-btn ${!available ? 'disabled' : ''}`}
                      onClick={() => buildItem(item)}
                      disabled={!available}
                    >
                      ${(cost / 1000).toFixed(0)}K
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Built Items */}
          <div className="buildout-built">
            <h3 className="mgmt-title">Your Buildout</h3>
            {builtRooms.length === 0 && <p className="empty-msg">Nothing built yet. Select items from the left.</p>}
            {builtRooms.map((id, index) => {
              const item = BUILDOUT_ITEMS.find(b => b.id === id);
              if (!item) return null;
              const cost = item.costPerSqft * item.sqftNeeded;
              return (
                <div key={index} className="shop-item">
                  <span className="shop-icon">{item.icon}</span>
                  <div className="shop-info">
                    <div className="shop-name">{item.name}</div>
                    <div className="shop-detail">{item.sqftNeeded} sqft | ${cost.toLocaleString()}</div>
                  </div>
                  <button className="fire-btn" style={{ width: 'auto', padding: '4px 10px' }} onClick={() => removeItem(index)}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {remainingBudget < 100000 && (
          <div className="alert alert-warning" style={{ marginBottom: '12px' }}>
            Budget getting tight! Remember you'll need cash for: equipment, staff salaries, and MARKETING. Without marketing spend, you'll have zero patients.
          </div>
        )}
        {remainingBudget > 500000 && (
          <div className="alert alert-warning" style={{ marginBottom: '12px' }}>
            You still have a lot of budget. Consider building more operatories or premium finishes — but don't overspend! You need reserves for equipment, staff, and marketing.
          </div>
        )}

        <div className="buildout-actions">
          <button className="back-btn" onClick={onBack}>Back</button>
          <button
            className={`start-btn buildout-proceed ${!canProceed ? 'disabled' : ''}`}
            onClick={handleProceed}
            disabled={!canProceed}
            style={{ opacity: canProceed ? 1 : 0.4 }}
          >
            <span className="btn-icon">🦷</span>
            <div>
              <div className="btn-title">Proceed to Equipment</div>
              <div className="btn-desc">Budget remaining: ${remainingBudget.toLocaleString()}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SETUP PHASE — Buy equipment, hire staff, start marketing before Day 1
// ═══════════════════════════════════════════════════════
function SetupPhaseScreen({ buildoutData, difficulty, onComplete, onBack }) {
  const diff = difficulty || DIFFICULTY_MODES[1];
  const space = buildoutData?.space || SPACE_OPTIONS[1];
  const [cash, setCash] = useState(buildoutData?.cashRemaining || diff.loanAmount);
  const [equipment, setEquipment] = useState([]);
  const [staff, setStaff] = useState([]);
  const [marketing, setMarketing] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [activeTab, setActiveTab] = useState('equip');
  const [candidates, setCandidates] = useState(() => STAFF_TEMPLATES.flatMap(t => [generateStaffMember(t), generateStaffMember(t), Math.random() > 0.5 ? generateStaffMember(t) : null].filter(Boolean)));
  const [roleFilter, setRoleFilter] = useState('all');

  const refreshCandidates = () => setCandidates(STAFF_TEMPLATES.flatMap(t => [generateStaffMember(t), generateStaffMember(t), Math.random() > 0.5 ? generateStaffMember(t) : null].filter(Boolean)));

  const buyEquip = (item) => {
    if (cash < item.cost) return;
    setCash(c => c - item.cost);
    setEquipment(e => [...e, item.id]);
  };

  const removeEquip = (index) => {
    const id = equipment[index];
    const def = EQUIPMENT.find(e => e.id === id);
    if (def) setCash(c => c + def.cost);
    setEquipment(e => e.filter((_, i) => i !== index));
  };

  const hireStaff = (candidate) => {
    setStaff(s => [...s, { ...candidate, salary: Math.round(candidate.salary * diff.salaryMultiplier) }]);
    refreshCandidates();
  };

  const removeStaff = (index) => {
    setStaff(s => s.filter((_, i) => i !== index));
  };

  const toggleMarketing = (id) => {
    setMarketing(m => m.includes(id) ? m.filter(x => x !== id) : [...m, id]);
  };

  const toggleInsurance = (id) => {
    setInsurance(ins => ins.includes(id) ? ins.filter(x => x !== id) : [...ins, id]);
  };

  // Calculate ongoing monthly costs to show burn rate
  const monthlySalaries = staff.reduce((sum, s) => sum + s.salary, 0) / 12;
  const monthlyMarketing = marketing.reduce((sum, id) => {
    const mkt = MARKETING_OPTIONS.find(m => m.id === id);
    return sum + (mkt?.monthlyCost || 0);
  }, 0);
  const monthlyInsAdmin = insurance.reduce((sum, id) => {
    const plan = INSURANCE_PLANS.find(p => p.id === id);
    return sum + (plan?.adminCost || 0);
  }, 0);
  const monthlyRent = Math.round(space.rent * diff.rentMultiplier);
  const totalMonthlyBurn = Math.round(monthlySalaries + monthlyMarketing + monthlyInsAdmin + monthlyRent);
  const monthsOfRunway = totalMonthlyBurn > 0 ? Math.floor(cash / totalMonthlyBurn) : 99;

  const hasChair = equipment.some(eq => {
    const def = EQUIPMENT.find(e => e.id === eq);
    return def && def.patientsPerDay > 0;
  });
  const hasDentist = staff.some(s => isProvider(s));
  const hasFrontDesk = staff.some(s => s.role === 'Front Desk' || s.role === 'Office Manager');
  const hasAnyMarketing = marketing.length > 0;
  const hasCompressor = equipment.includes('compressor');
  const hasVacuum = equipment.includes('vacuum_pump');

  const readinessChecks = [
    { label: 'Dental chair (patients need somewhere to sit!)', met: hasChair },
    { label: 'Dentist or Specialist (someone to treat patients)', met: hasDentist },
    { label: 'Air compressor (powers all handpieces)', met: hasCompressor },
    { label: 'Vacuum/suction pump (required for procedures)', met: hasVacuum },
    { label: 'Front desk (someone to greet and schedule)', met: hasFrontDesk },
    { label: 'Marketing active (no marketing = no patients)', met: hasAnyMarketing },
    { label: `Cash reserves (${monthsOfRunway}+ months of runway)`, met: monthsOfRunway >= 2 },
  ];
  const readyCount = readinessChecks.filter(r => r.met).length;

  const handleLaunch = () => {
    onComplete({
      ...buildoutData,
      equipment,
      staff,
      activeMarketing: marketing,
      acceptedInsurance: insurance,
      cashRemaining: cash,
    });
  };

  const setupTabs = [
    { id: 'equip', label: 'Equipment', icon: '🔧' },
    { id: 'staff', label: 'Staff', icon: '👥' },
    { id: 'mktg', label: 'Marketing', icon: '📢' },
    { id: 'ins', label: 'Insurance', icon: '🏥' },
  ];

  return (
    <div className="acquire-screen" style={{ maxWidth: '900px' }}>
      <h2 className="acquire-title">Setup Your Practice</h2>
      <p className="acquire-sub">
        Before Day 1: Allocate your remaining ${cash.toLocaleString()} to equipment, staff, and marketing.
        Nothing is free — if you don't buy a chair, patients have nowhere to sit!
      </p>

      {/* Budget & Burn Rate Summary */}
      <div className="buildout-summary" style={{ marginBottom: '15px' }}>
        <div className="buildout-stat-row">
          <div className="buildout-stat">
            <div className="buildout-stat-label">Remaining Cash</div>
            <div className={`buildout-stat-value ${cash < 50000 ? 'red' : 'green'}`}>${cash.toLocaleString()}</div>
          </div>
          <div className="buildout-stat">
            <div className="buildout-stat-label">Monthly Burn Rate</div>
            <div className="buildout-stat-value red">${totalMonthlyBurn.toLocaleString()}/mo</div>
          </div>
          <div className="buildout-stat">
            <div className="buildout-stat-label">Runway</div>
            <div className={`buildout-stat-value ${monthsOfRunway < 2 ? 'red' : monthsOfRunway < 4 ? '' : 'green'}`}>
              {monthsOfRunway} months
            </div>
          </div>
          <div className="buildout-stat">
            <div className="buildout-stat-label">Season</div>
            <div className="buildout-stat-value">{diff.gameDuration} days</div>
          </div>
        </div>

        {/* Readiness Checklist */}
        <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Launch Readiness ({readyCount}/{readinessChecks.length})
          </div>
          {readinessChecks.map((check, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginBottom: '2px' }}>
              <span style={{ color: check.met ? '#22c55e' : '#ef4444' }}>{check.met ? '✓' : '✗'}</span>
              <span style={{ color: check.met ? '#94a3b8' : '#ef4444' }}>{check.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Coach Banner */}
      <CoachBanner tip={getCoachTip('setup', {
        equipment, staff, marketing, insurance, cash,
        monthlyBurn: totalMonthlyBurn, monthsOfRunway,
        hasChair, hasDentist, hasFrontDesk, hasMarketing: hasAnyMarketing,
        activeTab, diff,
      })} />

      {/* Tab Navigation */}
      <div className="mgmt-tabs" style={{ gridTemplateColumns: `repeat(${setupTabs.length}, 1fr)`, marginBottom: '12px' }}>
        {setupTabs.map(t => (
          <button key={t.id} className={`mgmt-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            <span>{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="mgmt-content" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {/* Equipment */}
        {activeTab === 'equip' && (
          <div>
            <h3 className="mgmt-title">Buy Equipment</h3>
            {!hasChair && <div className="alert alert-danger">You have NO dental chairs. Patients literally can't be seen without one!</div>}
            {equipment.length > 0 && (
              <>
                <h4 className="mgmt-subtitle">Your Equipment</h4>
                {equipment.map((id, i) => {
                  const def = EQUIPMENT.find(e => e.id === id);
                  return (
                    <div key={i} className="shop-item">
                      <span className="shop-icon">{def?.icon || '📦'}</span>
                      <div className="shop-info">
                        <div className="shop-name">{def?.name}</div>
                        <div className="shop-detail">${def?.cost.toLocaleString()} · ${def?.maintenanceCost}/mo maint</div>
                      </div>
                      <button className="fire-btn" style={{ width: 'auto', padding: '4px 10px' }} onClick={() => removeEquip(i)}>Return</button>
                    </div>
                  );
                })}
              </>
            )}
            <h4 className="mgmt-subtitle">Available</h4>
            {EQUIPMENT.map(item => (
              <div key={item.id} className="shop-item">
                <span className="shop-icon">{item.icon}</span>
                <div className="shop-info">
                  <div className="shop-name">{item.name}</div>
                  <div className="shop-detail">
                    {item.patientsPerDay ? `+${item.patientsPerDay} patients/day` : ''}
                    {item.revenueBonus ? ` +$${item.revenueBonus} rev` : ''}
                    {item.satisfactionBonus ? ` +${item.satisfactionBonus} sat` : ''}
                    {item.cleanlinessBonus ? ` +${item.cleanlinessBonus} clean` : ''}
                    {` · $${item.maintenanceCost}/mo maint`}
                  </div>
                </div>
                <button className={`buy-btn ${cash < item.cost ? 'disabled' : ''}`} onClick={() => buyEquip(item)} disabled={cash < item.cost}>
                  ${(item.cost / 1000).toFixed(0)}K
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Staff */}
        {activeTab === 'staff' && (
          <div>
            <h3 className="mgmt-title">Hire Staff</h3>
            {!hasDentist && <div className="alert alert-danger">No dentist! You can't see patients without a provider.</div>}
            {!hasFrontDesk && <div className="alert alert-warning">No front desk! Patient flow reduced 60% without one.</div>}
            {staff.length > 0 && (
              <>
                <h4 className="mgmt-subtitle">Your Team</h4>
                {staff.map((member, i) => (
                  <div key={i} className="shop-item">
                    <span className="shop-icon">{member.icon}</span>
                    <div className="shop-info">
                      <div className="shop-name">{member.name} ({member.role})</div>
                      <div className="shop-detail">Skill {member.skill} · Attitude {member.attitude} · ${(member.salary / 1000).toFixed(0)}K/yr</div>
                    </div>
                    <button className="fire-btn" style={{ width: 'auto', padding: '4px 10px' }} onClick={() => removeStaff(i)}>Remove</button>
                  </div>
                ))}
                <div style={{ fontSize: '11px', color: '#eab308', marginTop: '4px' }}>
                  Monthly payroll: ${Math.round(monthlySalaries).toLocaleString()}/mo
                </div>
              </>
            )}
            <h4 className="mgmt-subtitle">Candidates</h4>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {['all', 'Dentist', 'Hygienist', 'Dental Assistant', 'Front Desk', 'Office Manager', 'Specialists'].map(r => (
                <button key={r} onClick={() => setRoleFilter(r)} style={{
                  fontSize: '10px', padding: '3px 8px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  background: roleFilter === r ? 'rgba(59,130,246,0.3)' : 'rgba(30,41,59,0.5)',
                  color: roleFilter === r ? '#93c5fd' : '#94a3b8',
                }}>{r === 'all' ? 'All' : r}</button>
              ))}
            </div>
            <div className="candidates">
              {candidates.filter(c => roleFilter === 'all' || c.role === roleFilter || (roleFilter === 'Specialists' && SPECIALIST_ROLES.includes(c.role))).map(c => (
                <div key={c.id} style={{ padding: '10px', marginBottom: '6px', background: 'rgba(30,41,59,0.5)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{c.personality?.icon || c.icon} {c.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.role} · <span style={{ color: '#64748b', fontStyle: 'italic' }}>{c.personality?.name || 'Standard'}</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#eab308' }}>{'$'}{(Math.round(c.salary * diff.salaryMultiplier) / 1000).toFixed(0)}{'K/yr'}</div>
                      <button className="hire-btn" onClick={() => hireStaff(c)} style={{ fontSize: '10px', padding: '3px 12px', marginTop: '2px' }}>Hire</button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: '3px', marginBottom: '6px' }}>
                    {[{ label: 'Skill', val: c.skill }, { label: 'Attitude', val: c.attitude }, { label: 'Reliability', val: c.reliability }].map(s => (
                      <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                        <span style={{ width: '55px', color: '#94a3b8' }}>{s.label}</span>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(30,41,59,0.8)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${s.val}%`, height: '100%', borderRadius: '3px', background: s.val > 70 ? '#22c55e' : s.val > 50 ? '#eab308' : '#ef4444' }} />
                        </div>
                        <span style={{ width: '20px', textAlign: 'right', color: s.val > 70 ? '#22c55e' : s.val > 50 ? '#eab308' : '#ef4444' }}>{s.val}</span>
                      </div>
                    ))}
                  </div>
                  {c.isSpecialist && (
                    <div style={{ fontSize: '10px', padding: '4px 6px', marginBottom: '4px', background: 'rgba(168,85,247,0.1)', borderRadius: '4px', borderLeft: '2px solid #a855f7' }}>
                      <div style={{ color: '#c084fc', fontWeight: 600 }}>Specialist: {c.role}</div>
                      <div style={{ color: '#94a3b8' }}>{c.specialty}</div>
                      <div style={{ color: '#eab308' }}>Fee split: You keep {Math.round((1 - c.feeScheduleSplit) * 100)}% of their production</div>
                      {c.frictionChance > 0.10 && <div style={{ color: '#ef4444' }}>High friction risk — may cause staff conflicts</div>}
                    </div>
                  )}
                  <div style={{ fontSize: '10px', lineHeight: '1.5' }}>
                    {c.strength && <div style={{ color: '#4ade80' }}>{'+ '}{c.strength}</div>}
                    {c.weakness && <div style={{ color: '#fbbf24' }}>{'- '}{c.weakness}</div>}
                    {c.redFlag && <div style={{ color: '#ef4444' }}>{'🚩 '}{c.redFlag}</div>}
                    {c.trainable && <div style={{ color: '#3b82f6' }}>{'🎓 Coachable — responds well to training'}</div>}
                    {c.trainable === false && <div style={{ color: '#ef4444' }}>{'🚫 Untrainable — set in their ways'}</div>}
                    {c.quirk && <div style={{ color: '#64748b', fontStyle: 'italic' }}>{'"'}{c.quirk}{'"'}</div>}
                  </div>
                </div>
              ))}
            </div>
            <button className="refresh-btn" onClick={refreshCandidates}>New Candidates</button>
          </div>
        )}

        {/* Marketing */}
        {activeTab === 'mktg' && (
          <div>
            <h3 className="mgmt-title">Marketing Channels</h3>
            {!hasAnyMarketing && <div className="alert alert-danger">NO marketing active! You will get ZERO patients without marketing. This is not optional for a startup!</div>}
            <p className="mgmt-desc">Select marketing channels to start on Day 1. Costs are monthly and come out of your cash reserves.</p>
            {MARKETING_OPTIONS.map(mkt => {
              const isActive = marketing.includes(mkt.id);
              return (
                <div key={mkt.id} className={`toggle-card ${isActive ? 'active' : ''}`}>
                  <span className="toggle-icon">{mkt.icon}</span>
                  <div className="toggle-info">
                    <div className="toggle-name">{mkt.name}</div>
                    <div className="toggle-detail">+{mkt.patientBoost} patients · ${mkt.monthlyCost.toLocaleString()}/mo</div>
                  </div>
                  <button className={`toggle-btn ${isActive ? 'on' : 'off'}`} onClick={() => toggleMarketing(mkt.id)}>
                    {isActive ? 'Active' : 'Start'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Insurance */}
        {activeTab === 'ins' && (
          <div>
            <h3 className="mgmt-title">Insurance Plans</h3>
            <p className="mgmt-desc">Accept insurance to access patients. More plans = more volume but lower fees and higher admin costs. Choose carefully!</p>
            <div style={{ marginBottom: '8px', padding: '8px', background: 'rgba(30,41,59,0.4)', borderRadius: '6px', fontSize: '11px', color: '#94a3b8' }}>
              Starting a practice? Most new dentists start with 1-2 PPO plans (Delta + one other) to fill chairs. Don't accept everything — each plan has admin costs and eats into your cash patient revenue later. HMO/Medicaid = high volume, low pay — a different business model entirely.
            </div>
            {INSURANCE_PLANS.map(plan => {
              const isAccepted = insurance.includes(plan.id);
              const isHMO = plan.type === 'hmo' || plan.type === 'medicaid';
              const isPremium = plan.type === 'premium_ppo';
              const isCash = plan.type === 'cash';
              const meetsRep = !plan.minReputation || diff.startingReputation >= plan.minReputation;
              const typeBadge = isHMO ? { label: 'HMO', color: '#ef4444' }
                : isPremium ? { label: 'PREMIUM', color: '#22c55e' }
                : isCash ? { label: 'CASH', color: '#eab308' }
                : plan.type === 'medicaid' ? { label: 'MEDICAID', color: '#a855f7' }
                : { label: 'PPO', color: '#3b82f6' };
              return (
                <div key={plan.id} className={`toggle-card ${isAccepted ? 'active' : ''}`} style={{ opacity: meetsRep ? 1 : 0.5 }}>
                  <span className="toggle-icon">{plan.icon}</span>
                  <div className="toggle-info">
                    <div className="toggle-name">{plan.name}
                      <span style={{ fontSize: '9px', marginLeft: '6px', padding: '1px 5px', borderRadius: '4px', background: `${typeBadge.color}22`, color: typeBadge.color }}>{typeBadge.label}</span>
                    </div>
                    <div className="toggle-detail">
                      {Math.round(plan.reimbursementRate * 100)}% reimb · +{Math.round(plan.patientPool * 100)}% patients
                      {plan.adminCost > 0 ? ` · $${plan.adminCost}/mo admin` : ' · No admin cost'}
                    </div>
                    {plan.minReputation > 0 && !meetsRep && (
                      <div className="toggle-detail" style={{ color: '#eab308', fontSize: '10px' }}>
                        Requires {plan.minReputation}+ stars (you start at {diff.startingReputation})
                      </div>
                    )}
                    {plan.description && <div className="toggle-detail" style={{ color: '#64748b', fontStyle: 'italic' }}>{plan.description}</div>}
                  </div>
                  <button className={`toggle-btn ${isAccepted ? 'on' : 'off'}`} onClick={() => {
                    if (!meetsRep && !isAccepted) return;
                    toggleInsurance(plan.id);
                  }} style={!meetsRep && !isAccepted ? { opacity: 0.5 } : {}}>
                    {isAccepted ? 'Drop' : meetsRep ? 'Accept' : 'Locked'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Warnings */}
      {cash < 30000 && (
        <div className="alert alert-danger" style={{ marginTop: '10px' }}>
          Cash is critically low! You need reserves to survive the first months with no revenue.
        </div>
      )}
      {monthsOfRunway < 2 && totalMonthlyBurn > 0 && (
        <div className="alert alert-warning" style={{ marginTop: '10px' }}>
          Your burn rate is ${totalMonthlyBurn.toLocaleString()}/mo but you only have {monthsOfRunway} month{monthsOfRunway !== 1 ? 's' : ''} of runway. You'll run out of cash before patients come in!
        </div>
      )}

      {/* Launch */}
      <div className="buildout-actions" style={{ marginTop: '15px' }}>
        <button className="back-btn" onClick={onBack}>Back to Buildout</button>
        <button
          className="start-btn buildout-proceed"
          onClick={handleLaunch}
          style={{ opacity: readyCount >= 3 ? 1 : 0.7 }}
        >
          <span className="btn-icon">🚀</span>
          <div>
            <div className="btn-title">
              {readyCount === readinessChecks.length ? 'Launch Practice!' :
               readyCount >= 3 ? 'Launch (Not Fully Ready)' : 'Launch Anyway (Risky!)'}
            </div>
            <div className="btn-desc">
              ${cash.toLocaleString()} cash · {staff.length} staff · {equipment.length} equipment · {diff.gameDuration}-day season
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ACQUIRE SCREEN (Generated Practices)
// ═══════════════════════════════════════════════════════
function AcquireScreen({ difficulty, onSelect, onBack }) {
  const [options, setOptions] = useState(() => generateAcquisitionOptions(difficulty));

  const regenerate = () => setOptions(generateAcquisitionOptions(difficulty));

  return (
    <div className="acquire-screen">
      <h2 className="acquire-title">Acquire a Practice</h2>
      <p className="acquire-sub">{difficulty.icon} {difficulty.name} — Each practice comes with its own history, staff, and problems. Choose wisely.</p>
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <div className="alert-info" style={{ display: 'inline-block', maxWidth: '500px' }}>
          Look for: low problem count, decent reputation, reasonable price. Red badges = problems you'll need to fix on Day 1.
        </div>
      </div>
      <div className="practice-list">
        {options.map(option => (
          <div key={option.id} className="practice-card" style={{ width: '360px' }}>
            <h3 className="practice-name">{option.name}</h3>
            {/* Problem badges */}
            {option.problems.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                {option.problems.map(pId => {
                  const prob = PROBLEM_POOL.find(p => p.id === pId);
                  return prob ? (
                    <span key={pId} className={`problem-badge ${prob.severity}`} title={prob.description}>
                      {prob.label}
                    </span>
                  ) : null;
                })}
              </div>
            )}
            <p className="practice-desc">{option.story}</p>
            <div className="practice-stats">
              <div className="pstat"><span className="pstat-label">Price</span><span className="pstat-val">${(option.price / 1000).toFixed(0)}K</span></div>
              <div className="pstat"><span className="pstat-label">Patients</span><span className="pstat-val">{option.patients}{option.attritionHit > 0 ? ` (was ${option.statedPatients})` : ''}</span></div>
              <div className="pstat"><span className="pstat-label">Rating</span><span className="pstat-val">{option.reputation.toFixed(1)} ⭐</span></div>
              <div className="pstat"><span className="pstat-label">Staff</span><span className="pstat-val">{option.staff.length}</span></div>
              <div className="pstat"><span className="pstat-label">Monthly Rev</span><span className="pstat-val">${(option.monthlyRevenue / 1000).toFixed(0)}K</span></div>
              <div className="pstat"><span className="pstat-label">Cleanliness</span><span className="pstat-val">{option.cleanliness}/100</span></div>
              <div className="pstat"><span className="pstat-label">Sqft</span><span className="pstat-val">{option.sqft.toLocaleString()}</span></div>
              <div className="pstat"><span className="pstat-label">Rent</span><span className="pstat-val red">${option.rent.toLocaleString()}/mo</span></div>
              <div className="pstat"><span className="pstat-label">Operatories</span><span className="pstat-val">{option.actualOps || option.maxOps}</span></div>
              <div className="pstat"><span className="pstat-label">Sqft/Op</span><span className="pstat-val" style={{ color: (option.sqftPerOp || 500) > 550 ? '#ef4444' : (option.sqftPerOp || 500) > 450 ? '#eab308' : '#22c55e' }}>{option.sqftPerOp || Math.round(option.sqft / (option.actualOps || option.maxOps))}</span></div>
            </div>
            {option.attritionHit > 0 && (
              <div style={{ marginTop: '6px', fontSize: '11px', color: '#eab308', fontWeight: 600 }}>
                ⚠ ~{option.attritionHit} patients expected to leave during ownership transition
              </div>
            )}
            {option.insurances?.includes('premier') && (
              <div style={{ marginTop: '6px', padding: '6px 8px', fontSize: '11px', color: '#ef4444', fontWeight: 600, background: 'rgba(239,68,68,0.1)', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                RED FLAG: Heavy Delta Premier patients. As a new owner, your fee schedule drops ~25% on these patients. Same work, same overhead — 25% less revenue. Factor this into your valuation.
              </div>
            )}
            <button className="buy-btn" style={{ width: '100%', marginTop: '12px', padding: '10px', fontSize: '14px', fontWeight: 700 }}
              onClick={() => onSelect(option)}>
              Acquire for ${(option.price / 1000).toFixed(0)}K
            </button>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button className="refresh-btn" style={{ display: 'inline-block', width: 'auto', padding: '10px 24px' }} onClick={regenerate}>
          Regenerate Practices
        </button>
      </div>
      <button className="back-btn" onClick={onBack}>Back</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// FIX WINDOW SCREEN
// ═══════════════════════════════════════════════════════
function FixWindowScreen({ practice, difficulty, onComplete, onBack }) {
  const loanAmount = difficulty.loanAmount;
  const totalDebt = loanAmount; // asset purchase — you owe the bank for the loan, that's it
  const startingCash = loanAmount - practice.price;

  const [cash, setCash] = useState(startingCash);
  const [staff, setStaff] = useState(() => {
    return practice.staff.map((s, i) => {
      const template = STAFF_TEMPLATES.find(t => t.role === s.role);
      return {
        id: Date.now() + i + Math.random(),
        name: `${['Sarah','Mike','Jessica','David','Emily','James','Ashley','Chris'][i] || 'Staff'} ${['Johnson','Smith','Williams','Brown','Davis','Miller'][i] || 'Doe'}`,
        role: s.role,
        icon: template?.icon || '👤',
        skill: s.skill,
        attitude: s.attitude,
        reliability: s.reliability || 60,
        salary: Math.round((template?.baseSalary || 50000) * difficulty.salaryMultiplier),
        canSeePatients: template?.canSeePatients || false,
        patientsPerDay: template?.patientsPerDay || 0,
        morale: s.morale || 50,
        daysEmployed: Math.floor(Math.random() * 365),
      };
    });
  });
  const [equipment, setEquipment] = useState([...practice.equipment]);
  const [insurance, setInsurance] = useState([...practice.insurances]);
  const [marketing, setMarketing] = useState([]);
  const [cleanliness, setCleanliness] = useState(practice.cleanliness);
  const [candidates] = useState(() => {
    return STAFF_TEMPLATES.slice(0, 4).map(t => generateStaffMember(t));
  });
  const [problemStatus, setProblemStatus] = useState(() => {
    const s = {};
    practice.problems.forEach(p => { s[p] = 'active'; });
    return s;
  });

  const fireStaff = (staffId) => {
    const member = staff.find(s => s.id === staffId);
    if (!member) return;
    const severance = Math.round(member.salary / 12);
    setCash(prev => prev - severance);
    setStaff(prev => prev.filter(s => s.id !== staffId));
  };

  const hireStaff = (candidate) => {
    if (cash < candidate.salary / 12) return;
    setCash(prev => prev - Math.round(candidate.salary / 12));
    setStaff(prev => [...prev, { ...candidate, daysEmployed: 0 }]);
  };

  const buyEquipment = (equipId) => {
    const eq = EQUIPMENT.find(e => e.id === equipId);
    if (!eq || cash < eq.cost) return;
    setCash(prev => prev - eq.cost);
    setEquipment(prev => [...prev, equipId]);
  };

  const toggleInsurance = (planId) => {
    if (insurance.includes(planId)) {
      setInsurance(prev => prev.filter(id => id !== planId));
    } else {
      const plan = INSURANCE_PLANS.find(p => p.id === planId);
      if (plan && practice.reputation >= plan.minReputation) {
        setInsurance(prev => [...prev, planId]);
      }
    }
  };

  const startMarketing = (mktId) => {
    if (marketing.length >= 1) return;
    const mkt = MARKETING_OPTIONS.find(m => m.id === mktId);
    if (!mkt || cash < mkt.monthlyCost) return;
    setMarketing([mktId]);
  };

  const investInCleaning = (amount) => {
    if (cash < amount) return;
    setCash(prev => prev - amount);
    setCleanliness(prev => Math.min(100, prev + Math.round(amount / 100)));
  };

  // Check problem resolution — only update if something changed
  useEffect(() => {
    setProblemStatus(prev => {
      const ns = { ...prev };
      let changed = false;
      if (ns.dirty_office === 'active' && cleanliness >= 50) { ns.dirty_office = 'resolved'; changed = true; }
      if (ns.low_morale === 'active') {
        const avgMorale = staff.length > 0 ? staff.reduce((s, m) => s + m.morale, 0) / staff.length : 0;
        if (avgMorale >= 45 || staff.length === 0) { ns.low_morale = 'resolved'; changed = true; }
      }
      if (ns.staff_drama === 'active') {
        const hasLowSkill = staff.some(s => s.skill < 30);
        const hasLowMorale = staff.some(s => s.morale < 20);
        if (!hasLowSkill && !hasLowMorale) { ns.staff_drama = 'resolved'; changed = true; }
      }
      if (ns.no_marketing === 'active' && marketing.length > 0) { ns.no_marketing = 'resolved'; changed = true; }
      if (ns.insurance_mess === 'active') {
        const hmoCount = insurance.filter(id => { const p = INSURANCE_PLANS.find(pl => pl.id === id); return p?.type === 'hmo'; }).length;
        if (hmoCount === 0 && insurance.length <= 3) { ns.insurance_mess = 'resolved'; changed = true; }
      }
      if (ns.equipment_outdated === 'active') {
        const hasDiagnostic = equipment.some(id => { const e = EQUIPMENT.find(eq => eq.id === id); return e?.category === 'diagnostic'; });
        if (hasDiagnostic) { ns.equipment_outdated = 'resolved'; changed = true; }
      }
      return changed ? ns : prev;
    });
  }, [staff, equipment, insurance, marketing, cleanliness]);

  const handleProceed = () => {
    onComplete({
      practice,
      staff,
      equipment,
      insurance,
      marketing,
      cleanliness,
      cashRemaining: cash,
      totalDebt,
    });
  };

  return (
    <div className="acquire-screen">
      <h2 className="acquire-title">Due Diligence & Day 1 Fixes</h2>
      <p className="acquire-sub">You have your first day. Make the critical fixes now — the clock starts tomorrow.</p>

      {/* Cash display */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <div style={{ fontSize: '28px', fontFamily: 'Fredoka One', color: cash > 50000 ? '#22c55e' : cash > 20000 ? '#eab308' : '#ef4444' }}>
          ${cash.toLocaleString()} remaining
        </div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>Total debt: ${totalDebt.toLocaleString()} at {Math.round(difficulty.interestRate * 100)}%</div>
      </div>

      {/* Problem badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '20px' }}>
        {practice.problems.map(pId => {
          const prob = PROBLEM_POOL.find(p => p.id === pId);
          const resolved = problemStatus[pId] === 'resolved';
          return prob ? (
            <span key={pId} className={`problem-badge ${resolved ? 'resolved' : prob.severity}`}>
              {resolved ? '✓ ' : ''}{prob.label}
            </span>
          ) : null;
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Left column: Staff */}
        <div>
          <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '10px' }}>Current Staff</h3>
          {staff.map(s => (
            <div key={s.id} className="staff-card" style={{ marginBottom: '8px' }}>
              <div className="staff-top">
                <span className="staff-icon">{s.icon}</span>
                <div className="staff-info">
                  <div className="staff-name">{s.name}</div>
                  <div className="staff-role">{s.role} · Skill {s.skill} · Morale {s.morale}</div>
                </div>
                <div className="staff-salary">${Math.round(s.salary / 12).toLocaleString()}/mo</div>
              </div>
              <div className="stat-bars">
                <div className="stat-row"><span>Skill</span><div className="bar"><div className="bar-fill" style={{ width: `${s.skill}%`, background: s.skill > 60 ? '#22c55e' : s.skill > 40 ? '#eab308' : '#ef4444' }} /></div><span>{s.skill}</span></div>
                <div className="stat-row"><span>Attitude</span><div className="bar"><div className="bar-fill" style={{ width: `${s.attitude}%`, background: s.attitude > 60 ? '#22c55e' : s.attitude > 40 ? '#eab308' : '#ef4444' }} /></div><span>{s.attitude}</span></div>
                <div className="stat-row"><span>Morale</span><div className="bar"><div className="bar-fill" style={{ width: `${s.morale}%`, background: s.morale > 50 ? '#22c55e' : s.morale > 30 ? '#eab308' : '#ef4444' }} /></div><span>{s.morale}</span></div>
              </div>
              <button className="fire-btn" onClick={() => fireStaff(s.id)}>
                Fire (${Math.round(s.salary / 12).toLocaleString()} severance)
              </button>
            </div>
          ))}

          <h4 style={{ color: '#94a3b8', fontSize: '13px', margin: '12px 0 6px' }}>Available Candidates</h4>
          {candidates.map(c => (
            <div key={c.id} className="candidate-card" style={{ marginBottom: '6px' }}>
              <span className="cand-icon">{c.icon}</span>
              <div className="cand-info">
                <div className="cand-name">{c.name}</div>
                <div className="cand-detail">{c.role} · Skill {c.skill} · ${Math.round(c.salary / 12).toLocaleString()}/mo</div>
              </div>
              <button className="hire-btn" onClick={() => hireStaff(c)}
                disabled={cash < c.salary / 12}>Hire</button>
            </div>
          ))}
        </div>

        {/* Right column: Equipment, Insurance, Marketing, Cleaning */}
        <div>
          {/* Equipment — chairs + diagnostic/essential */}
          <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '10px' }}>Equipment</h3>
          {(() => {
            const opsCount = (practice.builtOutRooms || []).filter(r => r === 'basic_ops' || r === 'premium_ops').length;
            const chairCount = equipment.filter(id => { const e = EQUIPMENT.find(eq => eq.id === id); return e?.category === 'operatory'; }).length;
            return (
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                Chairs: {chairCount} / {opsCount} operatories built
              </div>
            );
          })()}
          {EQUIPMENT.filter(e => e.category === 'operatory' || e.category === 'diagnostic' || e.category === 'essential').map(eq => {
            const owned = equipment.filter(id => id === eq.id).length;
            const isChair = eq.category === 'operatory';
            const opsCount = (practice.builtOutRooms || []).filter(r => r === 'basic_ops' || r === 'premium_ops').length;
            const totalChairs = equipment.filter(id => { const e = EQUIPMENT.find(equ => equ.id === id); return e?.category === 'operatory'; }).length;
            const canBuyMore = isChair ? totalChairs < opsCount : owned === 0;
            return (
              <div key={eq.id} className="shop-item" style={{ marginBottom: '4px' }}>
                <span className="shop-icon">{eq.icon}</span>
                <div className="shop-info">
                  <div className="shop-name">{eq.name} {owned > 0 ? `(${owned})` : ''}</div>
                  <div className="shop-detail">${eq.cost.toLocaleString()}{isChair ? ` · ${eq.patientsPerDay} pts/day` : ''}</div>
                </div>
                {canBuyMore ? (
                  <button className={`buy-btn ${cash < eq.cost ? 'disabled' : ''}`}
                    onClick={() => buyEquipment(eq.id)} disabled={cash < eq.cost}>Buy</button>
                ) : (
                  <span className="owned-label">{isChair ? 'Full' : 'Owned'}</span>
                )}
              </div>
            );
          })}

          {/* Insurance */}
          <h3 style={{ color: '#fff', fontSize: '16px', margin: '16px 0 10px' }}>Insurance Plans</h3>
          {INSURANCE_PLANS.slice(0, 6).map(plan => (
            <div key={plan.id} className={`toggle-card ${insurance.includes(plan.id) ? 'active' : ''}`} style={{ marginBottom: '4px' }}>
              <span className="toggle-icon">{plan.icon}</span>
              <div className="toggle-info">
                <div className="toggle-name">{plan.name}</div>
                <div className="toggle-detail">{Math.round(plan.reimbursementRate * 100)}% reimburse</div>
              </div>
              <button className={`toggle-btn ${insurance.includes(plan.id) ? 'on' : 'off'}`}
                onClick={() => toggleInsurance(plan.id)}>
                {insurance.includes(plan.id) ? 'Drop' : 'Add'}
              </button>
            </div>
          ))}

          {/* Marketing */}
          <h3 style={{ color: '#fff', fontSize: '16px', margin: '16px 0 10px' }}>Start Marketing</h3>
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Pick 1 channel to launch on Day 1</div>
          {MARKETING_OPTIONS.slice(0, 4).map(mkt => (
            <div key={mkt.id} className={`toggle-card ${marketing.includes(mkt.id) ? 'active' : ''}`} style={{ marginBottom: '4px' }}>
              <span className="toggle-icon">{mkt.icon}</span>
              <div className="toggle-info">
                <div className="toggle-name">{mkt.name}</div>
                <div className="toggle-detail">${mkt.monthlyCost}/mo</div>
              </div>
              <button className={`toggle-btn ${marketing.includes(mkt.id) ? 'on' : 'off'}`}
                onClick={() => marketing.includes(mkt.id) ? setMarketing([]) : startMarketing(mkt.id)}>
                {marketing.includes(mkt.id) ? 'Cancel' : 'Start'}
              </button>
            </div>
          ))}

          {/* Cleaning */}
          <h3 style={{ color: '#fff', fontSize: '16px', margin: '16px 0 10px' }}>Office Cleaning</h3>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
            Cleanliness: <span style={{ color: cleanliness > 60 ? '#22c55e' : cleanliness > 40 ? '#eab308' : '#ef4444', fontWeight: 700 }}>{cleanliness}/100</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[2000, 3500, 5000].map(amt => (
              <button key={amt} className={`buy-btn ${cash < amt ? 'disabled' : ''}`}
                style={{ flex: 1, textAlign: 'center', padding: '8px' }}
                onClick={() => investInCleaning(amt)} disabled={cash < amt}>
                ${(amt / 1000).toFixed(1)}K Clean (+{Math.round(amt / 100)})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '25px' }}>
        <button className="buy-btn" style={{ padding: '14px 40px', fontSize: '16px', fontWeight: 700 }}
          onClick={handleProceed}>
          Open for Business
        </button>
      </div>
      <button className="back-btn" onClick={onBack}>Back to Practice Selection</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ANIMATED PATIENT (walks across office)
// ═══════════════════════════════════════════════════════
function AnimatedPatient({ patient }) {
  const stageColors = { arriving: '#60a5fa', waiting: '#eab308', treating: '#22c55e', leaving: '#94a3b8' };
  const stageLabels = { arriving: 'Arriving', waiting: 'Waiting', treating: patient.procedure || 'Treatment', leaving: patient.satisfied ? 'Happy 😊' : 'Upset 😤' };

  return (
    <div className={`anim-patient stage-${patient.stage}`} style={{ '--delay': patient.delay + 's' }}>
      <div className="patient-avatar">{patient.satisfied === false ? '😤' : patient.stage === 'treating' ? '😬' : '🧑'}</div>
      <div className="patient-info">
        <div className="patient-name">{patient.name}</div>
        <div className="patient-status" style={{ color: stageColors[patient.stage] }}>{stageLabels[patient.stage]}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PRESSURE DASHBOARD
// ═══════════════════════════════════════════════════════
function PressureDashboard({ gameState, stats }) {
  const pressures = calculatePressures(gameState, stats);

  const metrics = [
    { key: 'growth', ...PRESSURE_METRICS.growth },
    { key: 'staffHappiness', ...PRESSURE_METRICS.staffHappiness },
    { key: 'patientVolume', ...PRESSURE_METRICS.patientVolume },
    { key: 'equipmentLevel', ...PRESSURE_METRICS.equipmentLevel },
    { key: 'cleanliness', ...PRESSURE_METRICS.cleanliness },
    { key: 'overhead', ...PRESSURE_METRICS.overhead },
  ];

  return (
    <div className="pressure-dashboard">
      <div className="pressure-title">Practice Health</div>
      <div className="pressure-grid">
        {metrics.map(metric => {
          const p = pressures[metric.key] || { level: 'good', label: 'OK', color: '#22c55e' };
          const levelClass = p.color === '#22c55e' ? 'good' : p.color === '#eab308' ? 'warning' : 'danger';
          return (
            <div key={metric.key} className={`pressure-meter ${levelClass}`}>
              <div className="pressure-meter-header">
                <span className="pressure-icon">{metric.icon}</span>
                <span className="pressure-name">{metric.name}</span>
              </div>
              <div className="pressure-indicator" style={{ borderColor: p.color }}>
                <div className="pressure-dot" style={{ background: p.color }} />
                <span className="pressure-label" style={{ color: p.color }}>{p.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// OFFICE VISUAL
// ═══════════════════════════════════════════════════════
function OfficeVisual({ equipment, staff, activePatients, officeUpgrades }) {
  const chairs = equipment.filter(eq => {
    const def = EQUIPMENT.find(e => e.id === eq);
    return def && def.patientsPerDay > 0;
  });
  const diagnostics = equipment.filter(eq => {
    const def = EQUIPMENT.find(e => e.id === eq);
    return def && def.category === 'diagnostic';
  });
  const comforts = equipment.filter(eq => {
    const def = EQUIPMENT.find(e => e.id === eq);
    return def && (def.category === 'comfort' || def.category === 'cosmetic' || def.category === 'specialty');
  });

  return (
    <div className="office-visual">
      {/* Waiting Room */}
      <div className="office-room waiting-room">
        <div className="room-label">Waiting Room</div>
        <div className="room-content">
          {(officeUpgrades || []).includes('coffee_bar') && <span className="room-item" title="Coffee Bar">☕</span>}
          {(officeUpgrades || []).includes('kids_corner') && <span className="room-item" title="Kids Corner">🧸</span>}
          {(officeUpgrades || []).includes('waiting_room') && <span className="room-item" title="Renovated">🛋️</span>}
          {activePatients.filter(p => p.stage === 'waiting').map(p => (
            <span key={p.id} className="room-person" title={p.name}>🧑</span>
          ))}
          {activePatients.filter(p => p.stage === 'waiting').length === 0 && <span className="room-empty">Empty</span>}
        </div>
      </div>

      {/* Front Desk */}
      <div className="office-room front-desk">
        <div className="room-label">Front Desk</div>
        <div className="room-content">
          {staff.filter(s => s.role === 'Front Desk' || s.role === 'Office Manager').map(s => (
            <span key={s.id} className="room-staff" title={`${s.name} (${s.role})`}>{s.icon}</span>
          ))}
          {(officeUpgrades || []).includes('digital_forms') && <span className="room-item" title="Digital Check-in">📱</span>}
          {staff.filter(s => s.role === 'Front Desk' || s.role === 'Office Manager').length === 0 &&
            <span className="room-empty warning">No Staff!</span>}
          {activePatients.filter(p => p.stage === 'arriving').map(p => (
            <span key={p.id} className="room-person arriving" title={p.name}>🚶</span>
          ))}
        </div>
      </div>

      {/* Operatories */}
      <div className="operatories">
        <div className="room-label">Operatories ({chairs.length})</div>
        <div className="op-grid">
          {chairs.map((eq, i) => {
            const def = EQUIPMENT.find(e => e.id === eq);
            const patientInChair = activePatients.find(p => p.stage === 'treating' && p.chairIndex === i);
            const staffInRoom = staff.find(s => s.canSeePatients && activePatients.some(p => p.stage === 'treating' && p.chairIndex === i && p.provider === s.id));
            return (
              <div key={i} className={`op-room ${patientInChair ? 'occupied' : 'empty'}`}>
                <span className="op-chair">{def?.icon || '🪑'}</span>
                {patientInChair ? (
                  <div className="op-info">
                    <span className="op-patient">🧑 {patientInChair.name.split(' ')[0]}</span>
                    <span className="op-procedure">{patientInChair.procedure}</span>
                  </div>
                ) : (
                  <span className="op-empty-label">Open</span>
                )}
              </div>
            );
          })}
          {chairs.length === 0 && <div className="op-room empty"><span className="room-empty warning">No Chairs!</span></div>}
        </div>
      </div>

      {/* Equipment Room */}
      {(diagnostics.length > 0 || comforts.length > 0) && (
        <div className="office-room equipment-room">
          <div className="room-label">Equipment</div>
          <div className="room-content">
            {[...diagnostics, ...comforts].map((eq, i) => {
              const def = EQUIPMENT.find(e => e.id === eq);
              return <span key={i} className="room-item" title={def?.name}>{def?.icon || '📦'}</span>;
            })}
          </div>
        </div>
      )}

      {/* Exit - patients leaving */}
      {activePatients.filter(p => p.stage === 'leaving').length > 0 && (
        <div className="office-room exit-area">
          <div className="room-label">Checkout</div>
          <div className="room-content">
            {activePatients.filter(p => p.stage === 'leaving').map(p => (
              <span key={p.id} className={`room-person ${p.satisfied ? 'happy' : 'unhappy'}`} title={p.name}>
                {p.satisfied ? '😊' : '😤'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MANAGEMENT SIDEBAR TABS
// ═══════════════════════════════════════════════════════
function ManagementPanel({ gameState, setGameState, stats, difficulty }) {
  const [tab, setTab] = useState('staff');
  const [hiringCandidates, setHiringCandidates] = useState([]);

  const [roleFilter, setRoleFilter] = useState('all');
  const refreshCandidates = () => {
    setHiringCandidates(STAFF_TEMPLATES.flatMap(t => [generateStaffMember(t), generateStaffMember(t), Math.random() > 0.5 ? generateStaffMember(t) : null].filter(Boolean)));
  };
  useEffect(() => { refreshCandidates(); }, []);

  const hire = (candidate) => {
    setGameState(prev => ({
      ...prev,
      staff: [...prev.staff, candidate],
      totalHires: (prev.totalHires || 0) + 1,
      log: [...prev.log, { day: prev.day, text: `Hired ${candidate.name} (${candidate.role}) at $${(candidate.salary / 1000).toFixed(0)}K/yr`, type: 'positive' }],
      eventLog: [...(prev.eventLog || []), { day: prev.day, type: 'hire', detail: `Hired ${candidate.role} (${candidate.name})`, skill: candidate.skill }],
    }));
    refreshCandidates();
  };

  const fire = (id) => {
    setGameState(prev => {
      const member = prev.staff.find(s => s.id === id);
      return {
        ...prev,
        staff: prev.staff.filter(s => s.id !== id),
        totalFires: (prev.totalFires || 0) + 1,
        log: [...prev.log, { day: prev.day, text: `Fired ${member?.name || 'staff member'}.`, type: 'negative' }],
        eventLog: [...(prev.eventLog || []), { day: prev.day, type: 'fire', detail: `Fired ${member?.role || 'staff'} (${member?.name || 'unknown'})` }],
      };
    });
  };

  const buyEquipment = (item) => {
    if (gameState.cash < item.cost) return;
    setGameState(prev => ({
      ...prev,
      cash: prev.cash - item.cost,
      equipment: [...prev.equipment, item.id],
      log: [...prev.log, { day: prev.day, text: `Purchased ${item.name} for $${item.cost.toLocaleString()}`, type: 'info' }],
    }));
  };

  const toggleMarketing = (id) => {
    setGameState(prev => {
      const active = prev.activeMarketing || [];
      const isActive = active.includes(id);
      const channelsUsed = prev.marketingChannelsUsed || [];
      return {
        ...prev,
        activeMarketing: isActive ? active.filter(m => m !== id) : [...active, id],
        marketingChannelsUsed: !isActive && !channelsUsed.includes(id) ? [...channelsUsed, id] : channelsUsed,
        log: [...prev.log, { day: prev.day, text: isActive ? `Stopped ${MARKETING_OPTIONS.find(m => m.id === id)?.name}` : `Started ${MARKETING_OPTIONS.find(m => m.id === id)?.name}`, type: 'info' }],
      };
    });
  };

  const toggleInsurance = (id) => {
    const plan = INSURANCE_PLANS.find(p => p.id === id);
    if (!plan) return;
    setGameState(prev => {
      const accepted = prev.acceptedInsurance || [];
      const isAccepted = accepted.includes(id);
      // Check minReputation for credentialing
      if (!isAccepted && plan.minReputation && prev.reputation < plan.minReputation) {
        return {
          ...prev,
          log: [...prev.log, { day: prev.day, text: `Cannot credential with ${plan.name} — requires ${plan.minReputation}+ star reputation (you have ${prev.reputation.toFixed(1)})`, type: 'negative' }],
        };
      }
      const newCredentialDays = { ...(prev.insuranceCredentialDays || {}) };
      if (!isAccepted) {
        newCredentialDays[id] = prev.day; // track when this plan was added for credentialing delay
      } else {
        delete newCredentialDays[id];
      }
      return {
        ...prev,
        acceptedInsurance: isAccepted ? accepted.filter(i => i !== id) : [...accepted, id],
        insuranceCredentialDays: newCredentialDays,
        log: [...prev.log, { day: prev.day, text: isAccepted ? `Dropped ${plan.name}` : `Now accepting ${plan.name} — credentialing takes ~${CREDENTIALING_DAYS} days before full reimbursements`, type: isAccepted ? 'info' : 'warning' }],
      };
    });
  };

  const buyUpgrade = (upgrade) => {
    if (gameState.cash < upgrade.cost) return;
    if ((gameState.officeUpgrades || []).includes(upgrade.id)) return;
    setGameState(prev => ({
      ...prev,
      cash: prev.cash - upgrade.cost,
      officeUpgrades: [...(prev.officeUpgrades || []), upgrade.id],
      log: [...prev.log, { day: prev.day, text: `Upgraded: ${upgrade.name} for $${upgrade.cost.toLocaleString()}`, type: 'positive' }],
    }));
  };

  const investRelationship = (relType) => {
    const costs = { supply_rep: 500, equipment_tech: 1000, referring_docs: 1500, lab: 1000, landlord: 2000 };
    const cost = costs[relType.id] || 1000;
    if (gameState.cash < cost) return;
    setGameState(prev => {
      const currentRels = { ...(prev.relationships || {}) };
      const currentVal = currentRels[relType.id] || 50;
      const gain = Math.max(5, Math.floor((100 - currentVal) * 0.2));
      currentRels[relType.id] = Math.min(100, currentVal + gain);
      return {
        ...prev,
        cash: prev.cash - cost,
        relationships: currentRels,
        log: [...prev.log, { day: prev.day, text: `Invested $${cost.toLocaleString()} in ${relType.name} relationship (+${gain})`, type: 'positive' }],
      };
    });
  };

  const buildRoom = (item) => {
    const cost = item.costPerSqft * item.sqftNeeded;
    if (gameState.cash < cost) return;
    const usedSqft = (gameState.builtOutRooms || []).reduce((sum, id) => {
      const bi = BUILDOUT_ITEMS.find(b => b.id === id);
      return sum + (bi ? bi.sqftNeeded : 0);
    }, 0);
    const totalSqft = gameState.sqft || 0;
    if (item.sqftNeeded > totalSqft - usedSqft) return;

    const opsCount = (gameState.builtOutRooms || []).filter(r => r === 'basic_ops' || r === 'premium_ops').length;
    const maxOps = gameState.maxOps || 10;
    if ((item.id === 'basic_ops' || item.id === 'premium_ops') && opsCount >= maxOps) return;

    // Non-repeatable check
    if (item.id !== 'basic_ops' && item.id !== 'premium_ops' && (gameState.builtOutRooms || []).includes(item.id)) return;

    setGameState(prev => ({
      ...prev,
      cash: prev.cash - cost,
      builtOutRooms: [...(prev.builtOutRooms || []), item.id],
      log: [...prev.log, { day: prev.day, text: `Built ${item.name} (${item.sqftNeeded} sqft, $${cost.toLocaleString()})`, type: 'positive' }],
    }));
  };

  const startTraining = (program) => {
    if (gameState.cash < program.cost) return;
    if ((gameState.activeTraining || []).some(t => t.id === program.id)) return;
    // Stackable programs can be re-done, but respect maxStacks
    if (program.stackable && program.maxStacks) {
      const completedCount = (gameState.completedTraining || []).filter(id => id === program.id).length;
      if (completedCount >= program.maxStacks) return;
    }
    setGameState(prev => ({
      ...prev,
      cash: prev.cash - program.cost,
      totalTrainingSpend: (prev.totalTrainingSpend || 0) + program.cost,
      activeTraining: [...(prev.activeTraining || []), { id: program.id, daysLeft: program.duration, startDay: prev.day }],
      log: [...prev.log, { day: prev.day, text: `Started training: ${program.name} ($${program.cost.toLocaleString()})`, type: 'info' }],
    }));
  };

  const tabs = [
    { id: 'staff', label: 'Staff', icon: '👥' },
    { id: 'training', label: 'Train', icon: '🎓' },
    { id: 'equipment', label: 'Equip', icon: '🔧' },
    { id: 'marketing', label: 'Mktg', icon: '📢' },
    { id: 'insurance', label: 'Ins', icon: '🏥' },
    { id: 'upgrades', label: 'Upgrade', icon: '🏗️' },
    { id: 'buildout', label: 'Build', icon: '🔨' },
    { id: 'relationships', label: 'Relate', icon: '🤝' },
    { id: 'finances', label: 'Finance', icon: '💰' },
    { id: 'consult', label: 'Consult', icon: '🧠' },
    { id: 'score', label: 'Score', icon: '🏆' },
    ...(difficulty?.multiOffice ? [{ id: 'locations', label: 'Offices', icon: '🏢' }] : []),
  ];

  // Buildout tab calculations
  const usedSqft = (gameState.builtOutRooms || []).reduce((sum, id) => {
    const bi = BUILDOUT_ITEMS.find(b => b.id === id);
    return sum + (bi ? bi.sqftNeeded : 0);
  }, 0);
  const totalSqft = gameState.sqft || 0;
  const remainingSqft = totalSqft - usedSqft;
  const opsCount = (gameState.builtOutRooms || []).filter(r => r === 'basic_ops' || r === 'premium_ops').length;
  const maxOps = gameState.maxOps || 10;

  return (
    <div className="mgmt-panel">
      <div className="mgmt-tabs" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map(t => (
          <button key={t.id} className={`mgmt-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <span>{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="mgmt-content">
        {/* ── STAFF TAB ── */}
        {tab === 'staff' && (
          <div>
            <h3 className="mgmt-title">Your Team ({gameState.staff.length})</h3>
            {!stats.hasFrontDesk && <div className="alert alert-warning">No front desk staff! Patient flow reduced by 60%.</div>}
            {gameState.staff.filter(s => s.canSeePatients).length === 0 && <div className="alert alert-danger">No providers! You can't see patients without a Dentist or Hygienist.</div>}
            {gameState.staff.length === 0 && <p className="empty-msg">No staff yet. Hire below!</p>}
            <div className="staff-list">
              {gameState.staff.map(member => {
                const tmpl = STAFF_TEMPLATES.find(t => t.role === member.role);
                const isOverpaid = tmpl && member.salary > tmpl.baseSalary * 1.1 && member.skill < 55;
                const isBadLongTimer = member.daysEmployed > 90 && member.attitude < 40;
                return (
                <div key={member.id} className="staff-card">
                  <div className="staff-top">
                    <span className="staff-icon">{member.icon}</span>
                    <div className="staff-info">
                      <div className="staff-name">{member.name}</div>
                      <div className="staff-role">{member.role}
                        {member.personality && <span style={{ fontSize: '9px', marginLeft: '6px', color: '#64748b' }}>{member.personality.icon} {member.personality.name}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="staff-salary">{'$'}{(member.salary / 1000).toFixed(0)}{'K/yr'}</div>
                      <div style={{ fontSize: '9px', color: '#64748b' }}>Day {member.daysEmployed || 0}</div>
                    </div>
                  </div>
                  {/* Strength / Weakness / Warnings */}
                  {(member.strength || member.weakness || isOverpaid || isBadLongTimer) && (
                    <div style={{ fontSize: '10px', lineHeight: '1.4', marginBottom: '4px', padding: '4px 6px', background: 'rgba(30,41,59,0.3)', borderRadius: '4px' }}>
                      {member.strength && <div style={{ color: '#4ade80' }}>{'+ '}{member.strength}</div>}
                      {member.weakness && <div style={{ color: '#fbbf24' }}>{'- '}{member.weakness}</div>}
                      {isOverpaid && <div style={{ color: '#ef4444', fontWeight: 600 }}>{'💸 Overpaid — skill doesn\'t justify salary'}</div>}
                      {isBadLongTimer && <div style={{ color: '#ef4444', fontWeight: 600 }}>{'🚩 Long-timer with attitude problems — consider replacing'}</div>}
                    </div>
                  )}
                  <div className="stat-bars">
                    <div className="stat-row"><span>Skill</span><div className="bar"><div className="bar-fill" style={{ width: `${member.skill}%`, background: member.skill > 70 ? '#22c55e' : member.skill > 50 ? '#eab308' : '#ef4444' }} /></div><span>{member.skill}</span></div>
                    <div className="stat-row"><span>Attitude</span><div className="bar"><div className="bar-fill" style={{ width: `${member.attitude}%`, background: member.attitude > 70 ? '#22c55e' : member.attitude > 50 ? '#eab308' : '#ef4444' }} /></div><span>{member.attitude}</span></div>
                    <div className="stat-row"><span>Morale</span><div className="bar"><div className="bar-fill" style={{ width: `${member.morale}%`, background: member.morale > 70 ? '#22c55e' : member.morale > 40 ? '#eab308' : '#ef4444' }} /></div><span>{member.morale}</span></div>
                    {member.isAssociate && (
                      <div className="stat-row"><span>Loyalty</span><div className="bar"><div className="bar-fill" style={{ width: `${member.loyalty || 65}%`, background: (member.loyalty || 65) > 70 ? '#22c55e' : (member.loyalty || 65) > 40 ? '#eab308' : '#ef4444' }} /></div><span>{Math.round(member.loyalty || 65)}</span></div>
                    )}
                  </div>
                  {member.isAssociate && (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '9px', padding: '2px 6px', borderRadius: '4px',
                        background: member.flightRisk === 'critical' ? 'rgba(239,68,68,0.25)' : member.flightRisk === 'high' ? 'rgba(234,179,8,0.25)' : member.flightRisk === 'medium' ? 'rgba(59,130,246,0.15)' : 'rgba(34,197,94,0.15)',
                        color: member.flightRisk === 'critical' ? '#ef4444' : member.flightRisk === 'high' ? '#eab308' : member.flightRisk === 'medium' ? '#3b82f6' : '#22c55e',
                      }}>
                        {member.flightRisk === 'critical' ? '🚨 CRITICAL' : member.flightRisk === 'high' ? '⚠️ HIGH RISK' : member.flightRisk === 'medium' ? '👀 WATCH' : '✅ STABLE'} flight risk
                      </span>
                      {member.patientAttachment > 0 && (
                        <span style={{ fontSize: '9px', color: '#94a3b8' }}>{member.patientAttachment} pts attached</span>
                      )}
                      {member.wantsPartnership && !member.partnershipOffered && (
                        <button style={{ fontSize: '9px', padding: '2px 8px', background: 'rgba(234,179,8,0.2)', border: '1px solid #eab308', borderRadius: '4px', color: '#eab308', cursor: 'pointer' }}
                          onClick={() => setGameState(prev => ({
                            ...prev,
                            staff: prev.staff.map(s => s.id === member.id ? { ...s, partnershipOffered: true, loyalty: Math.min(100, (s.loyalty || 65) + 25) } : s),
                            log: [...prev.log, { day: prev.day, text: `Offered partnership track to Dr. ${member.name}. Loyalty boosted.`, type: 'positive' }],
                          }))}>
                          Offer Partnership
                        </button>
                      )}
                      {member.partnershipOffered && <span style={{ fontSize: '9px', color: '#22c55e' }}>Partnership offered</span>}
                    </div>
                  )}
                  {member.isRegionalManager && (
                    <div style={{ fontSize: '9px', padding: '2px 6px', display: 'inline-block', borderRadius: '4px', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', marginBottom: '4px' }}>
                      Managing {gameState.locationCount || 1} locations
                    </div>
                  )}
                  <button className="fire-btn" onClick={() => fire(member.id)}>Fire</button>
                </div>
                );
              })}
            </div>
            <h4 className="mgmt-subtitle">Available Candidates</h4>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {['all', 'Dentist', 'Hygienist', 'Dental Assistant', 'Front Desk', 'Office Manager', 'Specialists'].map(r => (
                <button key={r} onClick={() => setRoleFilter(r)} style={{
                  fontSize: '10px', padding: '3px 8px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  background: roleFilter === r ? 'rgba(59,130,246,0.3)' : 'rgba(30,41,59,0.5)',
                  color: roleFilter === r ? '#93c5fd' : '#94a3b8',
                }}>{r === 'all' ? 'All' : r}</button>
              ))}
            </div>
            <div className="candidates">
              {hiringCandidates.filter(c => roleFilter === 'all' || c.role === roleFilter || (roleFilter === 'Specialists' && SPECIALIST_ROLES.includes(c.role))).map(c => (
                <div key={c.id} style={{ padding: '10px', marginBottom: '6px', background: 'rgba(30,41,59,0.5)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{c.personality?.icon || c.icon} {c.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.role} · <span style={{ color: '#64748b', fontStyle: 'italic' }}>{c.personality?.name || 'Standard'}</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#eab308' }}>{'$'}{(c.salary / 1000).toFixed(0)}{'K/yr'}</div>
                      <button className="hire-btn" onClick={() => hire(c)} style={{ fontSize: '10px', padding: '3px 12px', marginTop: '2px' }}>Hire</button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: '3px', marginBottom: '6px' }}>
                    {[{ label: 'Skill', val: c.skill }, { label: 'Attitude', val: c.attitude }, { label: 'Reliability', val: c.reliability }].map(s => (
                      <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                        <span style={{ width: '55px', color: '#94a3b8' }}>{s.label}</span>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(30,41,59,0.8)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${s.val}%`, height: '100%', borderRadius: '3px', background: s.val > 70 ? '#22c55e' : s.val > 50 ? '#eab308' : '#ef4444' }} />
                        </div>
                        <span style={{ width: '20px', textAlign: 'right', color: s.val > 70 ? '#22c55e' : s.val > 50 ? '#eab308' : '#ef4444' }}>{s.val}</span>
                      </div>
                    ))}
                  </div>
                  {c.isSpecialist && (
                    <div style={{ fontSize: '10px', padding: '4px 6px', marginBottom: '4px', background: 'rgba(168,85,247,0.1)', borderRadius: '4px', borderLeft: '2px solid #a855f7' }}>
                      <div style={{ color: '#c084fc', fontWeight: 600 }}>Specialist: {c.role}</div>
                      <div style={{ color: '#94a3b8' }}>{c.specialty}</div>
                      <div style={{ color: '#eab308' }}>Fee split: You keep {Math.round((1 - c.feeScheduleSplit) * 100)}% of their production</div>
                      {c.frictionChance > 0.10 && <div style={{ color: '#ef4444' }}>High friction risk — may cause staff conflicts</div>}
                    </div>
                  )}
                  <div style={{ fontSize: '10px', lineHeight: '1.5' }}>
                    {c.strength && <div style={{ color: '#4ade80' }}>{'+ '}{c.strength}</div>}
                    {c.weakness && <div style={{ color: '#fbbf24' }}>{'- '}{c.weakness}</div>}
                    {c.redFlag && <div style={{ color: '#ef4444' }}>{'🚩 '}{c.redFlag}</div>}
                    {c.trainable && <div style={{ color: '#3b82f6' }}>{'🎓 Coachable — responds well to training'}</div>}
                    {c.trainable === false && <div style={{ color: '#ef4444' }}>{'🚫 Untrainable — set in their ways'}</div>}
                    {c.quirk && <div style={{ color: '#64748b', fontStyle: 'italic' }}>{'"'}{c.quirk}{'"'}</div>}
                  </div>
                </div>
              ))}
            </div>
            <button className="refresh-btn" onClick={refreshCandidates}>New Candidates</button>
          </div>
        )}

        {/* ── EQUIPMENT TAB ── */}
        {tab === 'equipment' && (
          <div>
            <h3 className="mgmt-title">Equipment Shop</h3>
            <p className="cash-display">Cash: <span className={gameState.cash > 50000 ? 'green' : 'red'}>${gameState.cash.toLocaleString()}</span></p>
            {['operatory', 'diagnostic', 'specialty', 'cosmetic', 'comfort', 'essential'].map(cat => {
              const items = EQUIPMENT.filter(e => e.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat}>
                  <h4 className="category-label">{cat.charAt(0).toUpperCase() + cat.slice(1)}</h4>
                  {items.map(item => {
                    const owned = gameState.equipment.filter(e => e === item.id).length;
                    return (
                      <div key={item.id} className="shop-item">
                        <span className="shop-icon">{item.icon}</span>
                        <div className="shop-info">
                          <div className="shop-name">{item.name} {owned > 0 && <span className="owned-badge">x{owned}</span>}</div>
                          <div className="shop-detail">
                            {item.patientsPerDay ? `+${item.patientsPerDay} patients/day` : ''}
                            {item.revenueBonus ? `+$${item.revenueBonus} revenue` : ''}
                            {item.satisfactionBonus ? `+${item.satisfactionBonus} satisfaction` : ''}
                            {item.cleanlinessBonus ? ` +${item.cleanlinessBonus} cleanliness` : ''}
                          </div>
                        </div>
                        <button className={`buy-btn ${gameState.cash < item.cost ? 'disabled' : ''}`} onClick={() => buyEquipment(item)} disabled={gameState.cash < item.cost}>
                          ${(item.cost / 1000).toFixed(0)}K
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* ── MARKETING TAB ── */}
        {tab === 'marketing' && (
          <div>
            <h3 className="mgmt-title">Marketing</h3>
            {gameState.patients < 30 && !(gameState.activeMarketing || []).length && (
              <div className="alert alert-danger">You have almost no patients! Without marketing, no one knows you exist. Start marketing NOW or you'll bleed cash.</div>
            )}
            <p className="mgmt-desc">Boost patient flow and reputation. Costs are monthly. Essential for new practices!</p>
            {MARKETING_OPTIONS.map(mkt => {
              const isActive = (gameState.activeMarketing || []).includes(mkt.id);
              return (
                <div key={mkt.id} className={`toggle-card ${isActive ? 'active' : ''}`}>
                  <span className="toggle-icon">{mkt.icon}</span>
                  <div className="toggle-info">
                    <div className="toggle-name">{mkt.name}</div>
                    <div className="toggle-detail">
                      +{mkt.patientBoost} patients · {mkt.reputationBoost > 0 ? `+rep` : ''} · ${mkt.monthlyCost.toLocaleString()}/mo
                    </div>
                  </div>
                  <button className={`toggle-btn ${isActive ? 'on' : 'off'}`} onClick={() => toggleMarketing(mkt.id)}>
                    {isActive ? 'Active' : 'Start'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── INSURANCE TAB ── */}
        {tab === 'insurance' && (() => {
          const practiceStyle = getPracticeStyle(gameState.acceptedInsurance);
          const accepted = gameState.acceptedInsurance || [];
          const acceptedDetails = accepted.filter(id => id !== 'cash_only').map(id => INSURANCE_PLANS.find(p => p.id === id)).filter(Boolean);
          const totalCannibal = acceptedDetails.reduce((sum, p) => sum + (p.cashCannibalization || 0), 0);
          const hasCash = accepted.includes('cash_only');
          const hasHMO = acceptedDetails.some(p => p.type === 'hmo' || p.type === 'medicaid');
          const margins = stats?.perPlanMargins || [];
          const blendedMargin = margins.length > 0 ? Math.round(margins.reduce((s, m) => s + m.margin, 0) / margins.length) : 0;
          const staffRec = stats?.staffingRec;
          const capitationMonthly = Math.round((stats?.capitationRevenue || 0) * 30);
          return (
          <div>
            <h3 className="mgmt-title">Insurance Plans</h3>
            <p className="mgmt-desc">More insurance = more patients, but lower fees and higher admin costs. Over time, smart practices DROP low-paying plans as reputation grows and cash patients come in.</p>

            {/* Practice Style Badge */}
            <div style={{ padding: '10px', marginBottom: '10px', background: 'rgba(30,41,59,0.6)', borderRadius: '8px', borderLeft: `3px solid ${practiceStyle.color}` }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: practiceStyle.color }}>{practiceStyle.style}</div>
              {practiceStyle.desc && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>{practiceStyle.desc}</div>}
              {accepted.length > 0 && (
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span>Plans: {accepted.length}</span>
                  <span>Avg Rate: {stats ? `${Math.round((stats.avgInsuranceRate || 1) * 100)}%` : '—'}</span>
                  {hasCash && <span>Cash Share: {stats ? `${Math.round((stats.effectiveCashShare || 0) * 100)}%` : '—'}</span>}
                  {stats?.hmoCapacityPenalty < 1 && <span style={{ color: '#ef4444' }}>HMO Capacity Hit: -{Math.round((1 - stats.hmoCapacityPenalty) * 100)}%</span>}
                  {stats?.blendedNoShowRate > 0.08 && <span style={{ color: '#eab308' }}>No-show rate: {Math.round(stats.blendedNoShowRate * 100)}%</span>}
                </div>
              )}
            </div>

            {/* Treatment Acceptance Rate */}
            {(() => {
              const baseAcceptance = stats?.blendedTreatmentAcceptance || 0.85;
              const bonus = gameState.treatmentAcceptanceBonus || 0;
              const effective = Math.min(0.98, baseAcceptance);
              const color = effective > 0.85 ? '#22c55e' : effective > 0.70 ? '#eab308' : '#ef4444';
              return (
                <div style={{ padding: '8px 10px', marginBottom: '10px', background: 'rgba(30,41,59,0.5)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Treatment Acceptance Rate</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      {bonus > 0 ? `Base ${Math.round((effective - bonus) * 100)}% + ${Math.round(bonus * 100)}% from training` : 'Invest in Case Acceptance Training to boost this'}
                    </div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color }}>{Math.round(effective * 100)}%</div>
                </div>
              );
            })()}

            {/* Per-Plan Profitability Table */}
            {margins.length > 0 && (
              <div style={{ padding: '10px', marginBottom: '10px', background: 'rgba(30,41,59,0.5)', borderRadius: '8px', border: '1px solid rgba(100,116,139,0.2)' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>Plan Margins (per patient)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '4px 12px', fontSize: '11px' }}>
                  <div style={{ color: '#64748b', fontWeight: 600 }}>Plan</div>
                  <div style={{ color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Rev/pt</div>
                  <div style={{ color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Cost/pt</div>
                  <div style={{ color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Margin</div>
                  {margins.map(m => (
                    <Fragment key={m.planId}>
                      <div style={{ color: '#e2e8f0' }}>{m.icon} {m.planName}</div>
                      <div style={{ textAlign: 'right', color: '#22c55e' }}>{'$'}{m.revPerPatient}</div>
                      <div style={{ textAlign: 'right', color: '#ef4444' }}>{'$'}{m.costPerPatient}</div>
                      <div style={{ textAlign: 'right', color: m.status === 'good' ? '#22c55e' : m.status === 'warning' ? '#eab308' : '#ef4444' }}>
                        {'$'}{m.margin}
                      </div>
                    </Fragment>
                  ))}
                </div>
                {capitationMonthly > 0 && (() => {
                  const capPlans = acceptedDetails.filter(p => p.capitationMonthly);
                  const avgCap = capPlans.length > 0 ? capPlans.reduce((s, p) => s + p.capitationMonthly, 0) / capPlans.length : 1;
                  const estMembers = avgCap > 0 ? Math.round(capitationMonthly / avgCap) : 0;
                  return (
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#22c55e', borderTop: '1px solid rgba(100,116,139,0.2)', paddingTop: '6px' }}>
                      {'HMO Capitation: +$'}{capitationMonthly.toLocaleString()}{'/mo ('}{estMembers}{' members)'}
                    </div>
                  );
                })()}
                <div style={{ marginTop: '4px', fontSize: '10px', color: '#64748b' }}>
                  {'Blended margin: $'}{blendedMargin}{'/patient'}
                </div>
              </div>
            )}

            {/* Volume Alerts — HMO staffing */}
            {hasHMO && staffRec && staffRec.understaffed && (
              <div className="alert alert-warning" style={{ marginBottom: '10px' }}>
                {staffRec.recommendation}
              </div>
            )}
            {hasHMO && staffRec && !staffRec.understaffed && capitationMonthly > 0 && (
              <div style={{ padding: '8px 10px', marginBottom: '10px', background: 'rgba(34,197,94,0.1)', borderRadius: '8px', borderLeft: '3px solid #22c55e', fontSize: '11px', color: '#4ade80' }}>
                {'Volume practice working! Capitation: +$'}{capitationMonthly.toLocaleString()}{'/mo. Keep staff up, overhead low.'}
              </div>
            )}
            {blendedMargin > 0 && blendedMargin < 100 && (
              <div className="alert alert-warning" style={{ marginBottom: '10px' }}>
                {'Blended margin $'}{blendedMargin}{'/pt. Below $100 — consider dropping your lowest performer.'}
              </div>
            )}

            {/* Cannibalization Warning */}
            {hasCash && totalCannibal > 0.15 && (
              <div className="alert alert-warning" style={{ marginBottom: '10px' }}>
                Cash Cannibalization: {Math.round(totalCannibal * 100)}% of your cash patients are switching to insurance billing. You're losing {hasCash ? 'premium fees' : 'revenue'}. Drop insurance plans to protect your cash patient base.
              </div>
            )}

            {gameState.reputation >= 4.0 && (
              <div className="alert alert-info" style={{ marginBottom: '10px' }}>
                Your reputation is strong! Consider dropping low-reimbursement plans and focusing on fee-for-service. Cash patients pay full fees with zero admin overhead.
              </div>
            )}
            {accepted.length >= 4 && (
              <div className="alert alert-warning" style={{ marginBottom: '10px' }}>
                You're accepting {accepted.length} plans. Admin costs are eating your margins. Each plan costs money to manage — do you need them all?
              </div>
            )}

            {/* Patient Population Guide — collapsible */}
            <details style={{ marginBottom: '10px', background: 'rgba(30,41,59,0.4)', borderRadius: '8px', padding: '10px' }}>
              <summary style={{ cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>How to Handle Each Patient Type</summary>
              <div style={{ marginTop: '8px', fontSize: '11px', lineHeight: '1.5' }}>
                <div style={{ marginBottom: '6px' }}><strong style={{ color: '#3b82f6' }}>PPO:</strong> <span style={{ color: '#94a3b8' }}>Core patients. Moderate fees, predictable scheduling. Focus on treatment acceptance. Most profitable at 2-3 PPOs.</span></div>
                <div style={{ marginBottom: '6px' }}><strong style={{ color: '#ef4444' }}>HMO/Capitation:</strong> <span style={{ color: '#94a3b8' }}>Volume game. Low per-visit pay but monthly capitation check per assigned member. Need: more assistants for fast turnover, extra front desk for verification, efficient scheduling. Margins thin per patient but pie is huge if you run lean. Think assembly line, not boutique.</span></div>
                <div style={{ marginBottom: '6px' }}><strong style={{ color: '#a855f7' }}>Medicaid:</strong> <span style={{ color: '#94a3b8' }}>Lowest reimbursement, highest admin. Only viable at extreme volume with minimal overhead. Most practices lose money here.</span></div>
                <div><strong style={{ color: '#eab308' }}>Cash/FFS:</strong> <span style={{ color: '#94a3b8' }}>Dream patients. Full fees, no admin. But they want clean offices, 5-star reviews, premium experience. Earned through reputation.</span></div>
              </div>
            </details>

            {INSURANCE_PLANS.map(plan => {
              const isAccepted = accepted.includes(plan.id);
              const isRisky = plan.reimbursementRate < 0.55;
              const isHMO = plan.type === 'hmo' || plan.type === 'medicaid';
              const isPremium = plan.type === 'premium_ppo';
              const isCash = plan.type === 'cash';
              const meetsRep = !plan.minReputation || gameState.reputation >= plan.minReputation;
              const typeBadge = isHMO ? { label: 'HMO', color: '#ef4444' }
                : isPremium ? { label: 'PREMIUM', color: '#22c55e' }
                : isCash ? { label: 'CASH', color: '#eab308' }
                : plan.type === 'medicaid' ? { label: 'MEDICAID', color: '#a855f7' }
                : { label: 'PPO', color: '#3b82f6' };
              // Profitability border color from per-plan margins
              const planMargin = margins.find(m => m.planId === plan.id);
              const profBorderColor = planMargin ? (planMargin.status === 'good' ? '#22c55e' : planMargin.status === 'warning' ? '#eab308' : '#ef4444') : 'transparent';
              return (
                <div key={plan.id} className={`toggle-card ${isAccepted ? 'active' : ''}`} style={{ opacity: meetsRep ? 1 : 0.6, borderLeft: isAccepted && planMargin ? `3px solid ${profBorderColor}` : undefined }}>
                  <span className="toggle-icon">{plan.icon}</span>
                  <div className="toggle-info">
                    <div className="toggle-name">{plan.name}
                      <span style={{ fontSize: '9px', marginLeft: '6px', padding: '1px 5px', borderRadius: '4px', background: `${typeBadge.color}22`, color: typeBadge.color }}>{typeBadge.label}</span>
                      {isRisky && <span style={{ fontSize: '9px', color: '#ef4444', marginLeft: '4px' }}>LOW REIMB</span>}
                      {plan.capitationMonthly && <span style={{ fontSize: '9px', color: '#22c55e', marginLeft: '4px' }}>{'$'}{plan.capitationMonthly}{'/mo cap'}</span>}
                    </div>
                    <div className="toggle-detail">
                      {Math.round(plan.reimbursementRate * 100)}% reimbursement · +{Math.round(plan.patientPool * 100)}% patient pool
                      {plan.adminCost > 0 ? ` · $${plan.adminCost}/mo admin` : ' · No admin cost'}
                    </div>
                    {isAccepted && planMargin && planMargin.status === 'danger' && (
                      <div className="toggle-detail" style={{ color: '#ef4444', fontSize: '10px', fontWeight: 600 }}>
                        {'Margin: $'}{planMargin.margin}{'/pt — Costing more than it earns. Consider dropping.'}
                      </div>
                    )}
                    {isAccepted && planMargin && planMargin.status === 'warning' && (
                      <div className="toggle-detail" style={{ color: '#eab308', fontSize: '10px' }}>
                        {'Margin: $'}{planMargin.margin}{'/pt — Thin margins. Watch overhead.'}
                      </div>
                    )}
                    {plan.cashCannibalization > 0 && hasCash && (
                      <div className="toggle-detail" style={{ color: '#ef4444', fontSize: '10px' }}>
                        Eats {Math.round(plan.cashCannibalization * 100)}% of your cash patients
                      </div>
                    )}
                    {plan.staffDemand > 1.1 && (
                      <div className="toggle-detail" style={{ color: '#eab308', fontSize: '10px' }}>
                        Staff demand: {plan.staffDemand}x — needs more hands
                      </div>
                    )}
                    {plan.minReputation > 0 && !meetsRep && (
                      <div className="toggle-detail" style={{ color: '#eab308', fontSize: '10px' }}>
                        Requires {plan.minReputation}+ stars to credential (you have {gameState.reputation.toFixed(1)})
                      </div>
                    )}
                    {plan.marginTip && <div className="toggle-detail" style={{ color: '#64748b', fontStyle: 'italic' }}>{plan.marginTip}</div>}
                  </div>
                  <button className={`toggle-btn ${isAccepted ? 'on' : 'off'}`} onClick={() => toggleInsurance(plan.id)}
                    style={!meetsRep && !isAccepted ? { opacity: 0.5 } : {}}>
                    {isAccepted ? 'Drop' : meetsRep ? 'Accept' : 'Locked'}
                  </button>
                </div>
              );
            })}
            {/* Fee Schedule Comparison — the core economics lesson */}
            <details style={{ marginTop: '10px', background: 'rgba(30,41,59,0.4)', borderRadius: '8px', padding: '10px' }}>
              <summary style={{ cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>Fee Schedule: What Each Plan Actually Pays</summary>
              <div style={{ marginTop: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse', color: '#cbd5e1' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(100,116,139,0.3)' }}>
                      <th style={{ textAlign: 'left', padding: '4px 6px', color: '#94a3b8' }}>Procedure</th>
                      <th style={{ textAlign: 'right', padding: '4px 6px', color: '#eab308' }}>Cash</th>
                      <th style={{ textAlign: 'right', padding: '4px 6px', color: '#22c55e' }}>Premier</th>
                      <th style={{ textAlign: 'right', padding: '4px 6px', color: '#3b82f6' }}>PPO</th>
                      <th style={{ textAlign: 'right', padding: '4px 6px', color: '#ef4444' }}>HMO</th>
                      <th style={{ textAlign: 'right', padding: '4px 6px', color: '#a855f7' }}>Medicaid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FEE_SCHEDULE_EXAMPLES.map(row => (
                      <tr key={row.code} style={{ borderBottom: '1px solid rgba(100,116,139,0.1)' }}>
                        <td style={{ padding: '3px 6px', color: '#94a3b8' }}>{row.procedure}</td>
                        <td style={{ textAlign: 'right', padding: '3px 6px', color: '#eab308', fontWeight: 600 }}>${row.cashFee}</td>
                        <td style={{ textAlign: 'right', padding: '3px 6px', color: '#22c55e' }}>${Math.round(row.cashFee * row.premierRate)}</td>
                        <td style={{ textAlign: 'right', padding: '3px 6px', color: '#3b82f6' }}>${Math.round(row.cashFee * row.ppoRate)}</td>
                        <td style={{ textAlign: 'right', padding: '3px 6px', color: '#ef4444' }}>${Math.round(row.cashFee * row.hmoRate)}</td>
                        <td style={{ textAlign: 'right', padding: '3px 6px', color: '#a855f7' }}>${Math.round(row.cashFee * row.medicaidRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: '6px', fontSize: '10px', color: '#64748b', fontStyle: 'italic' }}>
                  Same procedure, same chair time, same overhead — wildly different revenue. This is why insurance mix matters more than patient count.
                </div>
              </div>
            </details>

            <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(30,41,59,0.4)', borderRadius: '8px', fontSize: '11px', color: '#64748b' }}>
              <strong style={{ color: '#94a3b8' }}>The Insurance Trap:</strong> New practices accept everything to fill chairs. Smart practices eventually drop low-paying plans as reputation builds. The goal: fill chairs with high-value patients, not just any patients.
              {hasCash && <span style={{ display: 'block', marginTop: '4px', color: '#eab308' }}>Watch your cannibalization! Each insurance plan steals some patients who would have paid cash.</span>}
            </div>
          </div>
        );})()}

        {/* ── UPGRADES TAB ── */}
        {tab === 'upgrades' && (
          <div>
            <h3 className="mgmt-title">Office Upgrades</h3>
            <p className="cash-display">Cash: <span className={gameState.cash > 50000 ? 'green' : 'red'}>${gameState.cash.toLocaleString()}</span></p>
            {OFFICE_UPGRADES.map(upg => {
              const owned = (gameState.officeUpgrades || []).includes(upg.id);
              return (
                <div key={upg.id} className="shop-item">
                  <span className="shop-icon">{upg.icon}</span>
                  <div className="shop-info">
                    <div className="shop-name">{upg.name} {owned && <span className="owned-badge">Owned</span>}</div>
                    <div className="shop-detail">
                      {upg.satisfactionBonus ? `+${upg.satisfactionBonus} satisfaction` : ''}
                      {upg.patientBoost ? ` · +${upg.patientBoost} patients` : ''}
                      {upg.operatorySlots ? ` · +${upg.operatorySlots} operatory slots` : ''}
                      {upg.cleanlinessBonus ? ` · +${upg.cleanlinessBonus} cleanliness` : ''}
                      {upg.monthlyCost ? ` · $${upg.monthlyCost.toLocaleString()}/mo` : ''}
                    </div>
                  </div>
                  {!owned ? (
                    <button className={`buy-btn ${gameState.cash < upg.cost ? 'disabled' : ''}`} onClick={() => buyUpgrade(upg)} disabled={gameState.cash < upg.cost}>
                      {upg.cost > 0 ? `$${(upg.cost / 1000).toFixed(0)}K` : 'Free'}
                    </button>
                  ) : (
                    <span className="owned-label">Installed</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── BUILDOUT TAB ── */}
        {tab === 'buildout' && (
          <div>
            <h3 className="mgmt-title">Space & Buildout</h3>
            <div className="finance-grid" style={{ marginBottom: '12px' }}>
              <div className="fin-card">
                <div className="fin-label">Total Space</div>
                <div className="fin-value">{totalSqft.toLocaleString()} sqft</div>
              </div>
              <div className="fin-card">
                <div className="fin-label">Used Space</div>
                <div className="fin-value">{usedSqft.toLocaleString()} sqft</div>
              </div>
              <div className="fin-card">
                <div className="fin-label">Available Space</div>
                <div className={`fin-value ${remainingSqft < 100 ? 'red' : 'green'}`}>{remainingSqft.toLocaleString()} sqft</div>
              </div>
              <div className="fin-card">
                <div className="fin-label">Revenue/sqft (annual)</div>
                <div className={`fin-value ${stats.annualRevenuePerSqft >= REVENUE_PER_SQFT_TARGET ? 'green' : 'red'}`}>${stats.annualRevenuePerSqft}</div>
              </div>
              <div className="fin-card">
                <div className="fin-label">Operatories</div>
                <div className="fin-value">{opsCount} / {maxOps}</div>
              </div>
              <div className="fin-card">
                <div className="fin-label">Monthly Rent</div>
                <div className="fin-value red">${Math.round(gameState.rent || 0).toLocaleString()}</div>
              </div>
            </div>

            {/* Space usage bar */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Space Usage: {Math.round((usedSqft / Math.max(totalSqft, 1)) * 100)}%</div>
              <div className="bar" style={{ height: '8px' }}>
                <div className="bar-fill" style={{
                  width: `${Math.min(100, (usedSqft / Math.max(totalSqft, 1)) * 100)}%`,
                  background: usedSqft > totalSqft * 0.9 ? '#ef4444' : usedSqft > totalSqft * 0.7 ? '#eab308' : '#22c55e'
                }} />
              </div>
            </div>

            {/* Current rooms */}
            <h4 className="mgmt-subtitle">Built Rooms</h4>
            {(gameState.builtOutRooms || []).length === 0 && <p className="empty-msg">No rooms built yet.</p>}
            {(() => {
              const roomCounts = {};
              (gameState.builtOutRooms || []).forEach(id => {
                roomCounts[id] = (roomCounts[id] || 0) + 1;
              });
              return Object.entries(roomCounts).map(([id, count]) => {
                const item = BUILDOUT_ITEMS.find(b => b.id === id);
                if (!item) return null;
                return (
                  <div key={id} className="shop-item">
                    <span className="shop-icon">{item.icon}</span>
                    <div className="shop-info">
                      <div className="shop-name">{item.name} {count > 1 && <span className="owned-badge">x{count}</span>}</div>
                      <div className="shop-detail">{item.sqftNeeded * count} sqft used</div>
                    </div>
                  </div>
                );
              });
            })()}

            {/* Build new rooms */}
            {remainingSqft > 0 && (
              <>
                <h4 className="mgmt-subtitle">Build New Rooms</h4>
                <p className="cash-display">Cash: <span className={gameState.cash > 50000 ? 'green' : 'red'}>${gameState.cash.toLocaleString()}</span></p>
                {BUILDOUT_ITEMS.map(item => {
                  const cost = item.costPerSqft * item.sqftNeeded;
                  const canAfford = gameState.cash >= cost;
                  const hasSpace = item.sqftNeeded <= remainingSqft;
                  const isNonRepeat = item.id !== 'basic_ops' && item.id !== 'premium_ops';
                  const alreadyBuilt = isNonRepeat && (gameState.builtOutRooms || []).includes(item.id);
                  const opsMaxed = (item.id === 'basic_ops' || item.id === 'premium_ops') && opsCount >= maxOps;
                  const canBuild = canAfford && hasSpace && !alreadyBuilt && !opsMaxed;

                  if (alreadyBuilt) return null;
                  if (opsMaxed && (item.id === 'basic_ops' || item.id === 'premium_ops')) return null;

                  return (
                    <div key={item.id} className="shop-item">
                      <span className="shop-icon">{item.icon}</span>
                      <div className="shop-info">
                        <div className="shop-name">{item.name}</div>
                        <div className="shop-detail">
                          {item.sqftNeeded} sqft | ${cost.toLocaleString()}
                          {item.satisfactionBonus ? ` | +${item.satisfactionBonus} sat` : ''}
                          {item.cleanlinessBonus ? ` | +${item.cleanlinessBonus} clean` : ''}
                          {item.moraleBonus ? ` | +${item.moraleBonus} morale` : ''}
                        </div>
                      </div>
                      <button
                        className={`buy-btn ${!canBuild ? 'disabled' : ''}`}
                        onClick={() => buildRoom(item)}
                        disabled={!canBuild}
                      >
                        ${(cost / 1000).toFixed(0)}K
                      </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* ── RELATIONSHIPS TAB ── */}
        {tab === 'relationships' && (
          <div>
            <h3 className="mgmt-title">Relationships</h3>
            <p className="mgmt-desc">Maintain key relationships to unlock bonuses and avoid penalties.</p>
            {RELATIONSHIP_TYPES.map(relType => {
              const value = (gameState.relationships || {})[relType.id] || 50;
              const barColor = value > 70 ? '#22c55e' : value > 40 ? '#eab308' : '#ef4444';
              const statusLabel = value > 70 ? 'Good' : value > 40 ? 'Neutral' : 'Poor';
              const costs = { supply_rep: 500, equipment_tech: 1000, referring_docs: 1500, lab: 1000, landlord: 2000 };
              const cost = costs[relType.id] || 1000;
              const canInvest = gameState.cash >= cost;

              return (
                <div key={relType.id} className="relationship-card">
                  <div className="rel-header">
                    <span className="rel-icon">{relType.icon}</span>
                    <div className="rel-info">
                      <div className="rel-name">{relType.name}</div>
                      <div className="rel-desc">{relType.description}</div>
                    </div>
                  </div>
                  <div className="rel-bar-row">
                    <span className="rel-value-label">{Math.round(value)}</span>
                    <div className="bar" style={{ flex: 1, height: '8px' }}>
                      <div className="bar-fill" style={{ width: `${value}%`, background: barColor }} />
                    </div>
                    <span className="rel-status" style={{ color: barColor }}>{statusLabel}</span>
                  </div>
                  <div className="rel-bonuses">
                    {value > 70 ? (
                      <div className="rel-bonus-text green">{relType.bonusGood}</div>
                    ) : value < 30 ? (
                      <div className="rel-bonus-text red">{relType.bonusBad}</div>
                    ) : (
                      <div className="rel-bonus-text" style={{ color: '#64748b' }}>Neutral - no bonuses or penalties</div>
                    )}
                  </div>
                  <button
                    className={`buy-btn ${!canInvest ? 'disabled' : ''}`}
                    onClick={() => investRelationship(relType)}
                    disabled={!canInvest}
                    style={{ width: '100%', marginTop: '6px', textAlign: 'center' }}
                  >
                    Invest in Relationship (${cost.toLocaleString()})
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── FINANCES TAB ── */}
        {tab === 'finances' && (
          <div>
            <h3 className="mgmt-title">Financial Overview</h3>
            <div className="finance-grid">
              <div className="fin-card">
                <div className="fin-label">Cash on Hand</div>
                <div className={`fin-value ${gameState.cash > 0 ? 'green' : 'red'}`}>${gameState.cash.toLocaleString()}</div>
              </div>
              <div className="fin-card">
                <div className="fin-label">Outstanding Debt</div>
                <div className="fin-value red">${gameState.debt.toLocaleString()}</div>
              </div>
              <div className="fin-card">
                <div className="fin-label">Daily Revenue</div>
                <div className="fin-value green">${stats.dailyRevenue.toLocaleString()}</div>
                {stats.capitationRevenue > 0 && (
                  <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                    {'Procedures: $'}{(stats.dailyRevenue - stats.capitationRevenue).toLocaleString()}{' · Capitation: $'}{stats.capitationRevenue.toLocaleString()}
                  </div>
                )}
              </div>
              <div className="fin-card">
                <div className="fin-label">Monthly Revenue (est)</div>
                <div className="fin-value green">${(stats.dailyRevenue * 30).toLocaleString()}</div>
                {stats.capitationRevenue > 0 && (
                  <div style={{ fontSize: '9px', color: '#22c55e', marginTop: '2px' }}>
                    {'incl. $'}{Math.round(stats.capitationRevenue * 30).toLocaleString()}{'/mo capitation'}
                  </div>
                )}
              </div>
              <div className="fin-card">
                <div className="fin-label">Daily Salaries</div>
                <div className="fin-value red">-${stats.dailySalaries.toLocaleString()}</div>
              </div>
              <div className="fin-card">
                <div className="fin-label">Daily Overhead</div>
                <div className="fin-value red">-${stats.dailyOverhead.toLocaleString()}</div>
                <div style={{ fontSize: '9px', color: '#64748b', marginTop: '3px', lineHeight: 1.4 }}>
                  Supplies: ${stats.dailySupplies}{stats.supplyCreep > 1.01 ? <span style={{ color: '#ef4444' }}> (+{Math.round((stats.supplyCreep - 1) * 100)}% creep!)</span> : ''} · Rent: ${stats.dailyRent} · Maint: ${stats.dailyMaintenance} · Ins Admin: ${stats.dailyInsuranceAdmin}
                </div>
                {stats.supplyPerPatient > 20 && (
                  <div style={{ fontSize: '9px', color: '#ef4444', marginTop: '2px' }}>
                    ⚠ ${stats.supplyPerPatient}/patient — above $18 benchmark. Improve supply rep relationship!
                  </div>
                )}
              </div>
              <div className="fin-card">
                <div className="fin-label">Daily Marketing</div>
                <div className="fin-value red">-${stats.dailyMarketing.toLocaleString()}</div>
              </div>
              <div className="fin-card">
                <div className="fin-label">Daily Loan Interest ({Math.round((gameState.interestRate || 0.06) * 100)}%)</div>
                <div className="fin-value red">-${stats.dailyLoanPayment.toLocaleString()}</div>
              </div>
              <div className="fin-card highlight">
                <div className="fin-label">Daily Profit</div>
                <div className={`fin-value ${stats.dailyProfit >= 0 ? 'green' : 'red'}`}>
                  {stats.dailyProfit >= 0 ? '+' : ''}${stats.dailyProfit.toLocaleString()}
                </div>
              </div>
              <div className="fin-card highlight">
                <div className="fin-label">Monthly Profit (est)</div>
                <div className={`fin-value ${stats.dailyProfit >= 0 ? 'green' : 'red'}`}>
                  {stats.dailyProfit >= 0 ? '+' : ''}${(stats.dailyProfit * 30).toLocaleString()}
                </div>
              </div>
            </div>
            {gameState.debt > 0 && (() => {
              const daysSincePayment = gameState.day - (gameState.lastLoanPaymentDay || 0);
              const daysUntilDue = 30 - daysSincePayment;
              const nextPayment = Math.round(gameState.debt * MONTHLY_LOAN_PAYMENT_RATE);
              return (
                <div>
                  {/* Next payment info */}
                  <div style={{ padding: '10px', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: '#94a3b8' }}>Next Payment Due</span>
                      <span style={{ color: daysUntilDue <= 5 ? '#ef4444' : '#eab308', fontWeight: 'bold' }}>Day {gameState.day + daysUntilDue} ({daysUntilDue} days)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: '#94a3b8' }}>Payment Amount</span>
                      <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>${nextPayment.toLocaleString()}</span>
                    </div>
                    {gameState.cash < nextPayment && (
                      <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>
                        Not enough cash! Shortfall: ${(nextPayment - gameState.cash).toLocaleString()} — penalties will apply.
                      </div>
                    )}
                    {(gameState.missedPayments || 0) > 0 && (
                      <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>
                        Missed payments: {gameState.missedPayments} — bank penalties accumulating!
                      </div>
                    )}
                  </div>
                  <button
                    className={`pay-debt-btn ${gameState.cash < 10000 ? 'disabled' : ''}`}
                    onClick={() => {
                      const payment = Math.min(gameState.cash, Math.min(50000, gameState.debt));
                      if (payment <= 0) return;
                      setGameState(prev => ({
                        ...prev,
                        cash: prev.cash - payment,
                        debt: prev.debt - payment,
                        log: [...prev.log, { day: prev.day, text: `Made extra loan payment of $${payment.toLocaleString()}. Remaining: $${(prev.debt - payment).toLocaleString()}`, type: 'info' }],
                      }));
                    }}
                    disabled={gameState.cash < 10000}
                  >
                    Make Extra $50K Payment (Reduce Principal)
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── TRAINING TAB ── */}
        {tab === 'training' && (
          <div>
            <h3 className="mgmt-title">Training & Development</h3>
            <p className="mgmt-desc">Training programs offset the negative effects of growth, hiring, and high volume. Every decision has trade-offs — training helps smooth them out.</p>

            {/* Active training */}
            {(gameState.activeTraining || []).length > 0 && (
              <>
                <h4 className="mgmt-subtitle">Active Training</h4>
                {(gameState.activeTraining || []).map((active, i) => {
                  const prog = TRAINING_PROGRAMS.find(p => p.id === active.id);
                  if (!prog) return null;
                  return (
                    <div key={i} className="shop-item" style={{ borderLeft: '3px solid #3b82f6' }}>
                      <span className="shop-icon">{prog.icon}</span>
                      <div className="shop-info">
                        <div className="shop-name">{prog.name} <span className="owned-badge" style={{ background: 'rgba(59,130,246,0.2)', color: '#3b82f6' }}>In Progress</span></div>
                        <div className="shop-detail">{active.daysLeft} day{active.daysLeft !== 1 ? 's' : ''} remaining</div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Completed training count */}
            {(gameState.completedTraining || []).length > 0 && (
              <div className="alert alert-info" style={{ background: 'rgba(34,197,94,0.1)', borderColor: '#22c55e', marginBottom: '10px' }}>
                {(gameState.completedTraining || []).length} training program{(gameState.completedTraining || []).length !== 1 ? 's' : ''} completed. Your team is benefiting from the investment!
              </div>
            )}

            <h4 className="mgmt-subtitle">Available Programs</h4>
            <p className="cash-display">Cash: <span className={gameState.cash > 50000 ? 'green' : 'red'}>${gameState.cash.toLocaleString()}</span></p>
            {TRAINING_PROGRAMS.map(prog => {
              const isActive = (gameState.activeTraining || []).some(t => t.id === prog.id);
              const recentlyCompleted = (gameState.completedTraining || []).includes(prog.id) &&
                gameState.day - ((gameState.trainingCompleteDays || {})[prog.id] || 0) < 60;
              const canAfford = gameState.cash >= prog.cost;

              return (
                <div key={prog.id} className="shop-item">
                  <span className="shop-icon">{prog.icon}</span>
                  <div className="shop-info">
                    <div className="shop-name">{prog.name}
                      {isActive && <span className="owned-badge" style={{ background: 'rgba(59,130,246,0.2)', color: '#3b82f6' }}>Running</span>}
                      {recentlyCompleted && <span className="owned-badge" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>Active Buff</span>}
                    </div>
                    <div className="shop-detail">
                      {prog.duration} day{prog.duration !== 1 ? 's' : ''} | ${prog.cost.toLocaleString()}
                      {prog.moraleBoost ? ` | +${prog.moraleBoost} morale` : ''}
                      {prog.skillBoost ? ` | +${prog.skillBoost} skill` : ''}
                      {prog.satisfactionBoost ? ` | +${prog.satisfactionBoost} satisfaction` : ''}
                    </div>
                    <div className="shop-detail">{prog.description}</div>
                  </div>
                  {isActive ? (
                    <span className="owned-label">Running</span>
                  ) : (
                    <button
                      className={`buy-btn ${!canAfford ? 'disabled' : ''}`}
                      onClick={() => startTraining(prog)}
                      disabled={!canAfford || isActive}
                    >
                      ${(prog.cost / 1000).toFixed(1)}K
                    </button>
                  )}
                </div>
              );
            })}

            <OpposingForcesTips show={true} />
          </div>
        )}

        {/* ── CONSULTANTS TAB ── */}
        {tab === 'consult' && (
          <div>
            <h3 className="mgmt-title">Consultants</h3>
            <p className="mgmt-desc">Hire expensive consultants for rapid improvements — but only if your practice has the right foundation. Hiring a consultant without the right team in place wastes your money.</p>

            {/* Active consultant buffs */}
            {(gameState.activeConsultantBuffs || []).length > 0 && (
              <>
                <h4 className="mgmt-subtitle">Active Consultant Effects</h4>
                {(gameState.activeConsultantBuffs || []).map((buff, i) => {
                  const cons = CONSULTANTS.find(c => c.id === buff.consultantId);
                  return (
                    <div key={i} className="shop-item" style={{ borderLeft: '3px solid #22c55e' }}>
                      <span className="shop-icon">{cons?.icon || '🧠'}</span>
                      <div className="shop-info">
                        <div className="shop-name">{cons?.name || 'Consultant'} <span className="owned-badge" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>Active</span></div>
                        <div className="shop-detail">{buff.daysLeft} day{buff.daysLeft !== 1 ? 's' : ''} of benefits remaining</div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            <h4 className="mgmt-subtitle">Available Consultants</h4>
            <p className="cash-display">Cash: <span className={gameState.cash > 50000 ? 'green' : 'red'}>${gameState.cash.toLocaleString()}</span></p>

            {CONSULTANTS.map(consultant => {
              const reqResults = checkConsultantRequirements(consultant, gameState, stats);
              const allMet = reqResults.every(r => r.met);
              const metCount = reqResults.filter(r => r.met).length;
              const canAfford = gameState.cash >= consultant.cost;
              const isOnCooldown = (gameState.consultantCooldowns || {})[consultant.id] > gameState.day;
              const hasActiveBuff = (gameState.activeConsultantBuffs || []).some(b => b.consultantId === consultant.id);

              return (
                <div key={consultant.id} className="relationship-card" style={{ marginBottom: '12px' }}>
                  <div className="rel-header">
                    <span className="rel-icon" style={{ fontSize: '1.5rem' }}>{consultant.icon}</span>
                    <div className="rel-info">
                      <div className="rel-name">{consultant.name}</div>
                      <div className="rel-desc">{consultant.description}</div>
                      <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600, marginTop: '4px' }}>
                        Cost: ${consultant.cost.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Requirements checklist */}
                  <div style={{ margin: '8px 0', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Requirements ({metCount}/{reqResults.length} met)
                    </div>
                    {reqResults.map((req, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginBottom: '2px' }}>
                        <span style={{ color: req.met ? '#22c55e' : '#ef4444' }}>{req.met ? '✓' : '✗'}</span>
                        <span style={{ color: req.met ? '#94a3b8' : '#ef4444' }}>{req.label}</span>
                      </div>
                    ))}
                  </div>

                  {!allMet && (
                    <div style={{ fontSize: '10px', color: '#eab308', fontStyle: 'italic', marginBottom: '6px' }}>
                      Missing requirements. You can still hire, but the money will be wasted and your team will be frustrated.
                    </div>
                  )}

                  {isOnCooldown && (
                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px' }}>
                      Cooldown: Available again in {(gameState.consultantCooldowns || {})[consultant.id] - gameState.day} days
                    </div>
                  )}

                  <button
                    className={`buy-btn ${(!canAfford || isOnCooldown || hasActiveBuff) ? 'disabled' : ''}`}
                    style={{ width: '100%', textAlign: 'center', padding: '8px',
                      background: allMet ? undefined : 'rgba(234,179,8,0.2)',
                      borderColor: allMet ? undefined : '#eab308',
                    }}
                    onClick={() => {
                      if (!canAfford || isOnCooldown || hasActiveBuff) return;
                      const reqCheck = checkConsultantRequirements(consultant, gameState, stats);
                      const success = reqCheck.every(r => r.met);

                      if (success) {
                        setGameState(prev => ({
                          ...prev,
                          cash: prev.cash - consultant.cost,
                          totalConsultantSpend: (prev.totalConsultantSpend || 0) + consultant.cost,
                          patients: prev.patients + (consultant.successEffect.patientBoost || 0),
                          reputation: Math.min(5, prev.reputation + (consultant.successEffect.reputationBoost || 0)),
                          debt: Math.max(0, prev.debt - (consultant.successEffect.debtReduction || 0)),
                          interestRate: Math.max(0.03, (prev.interestRate || 0.06) - (consultant.successEffect.interestReduction || 0)),
                          activeConsultantBuffs: [
                            ...(prev.activeConsultantBuffs || []),
                            ...(consultant.successEffect.duration > 0 ? [{
                              consultantId: consultant.id,
                              daysLeft: consultant.successEffect.duration,
                              effect: consultant.successEffect,
                            }] : []),
                          ],
                          consultantCooldowns: {
                            ...(prev.consultantCooldowns || {}),
                            [consultant.id]: prev.day + 90,
                          },
                          staff: consultant.successEffect.moraleBoost
                            ? prev.staff.map(s => ({ ...s, morale: Math.min(100, s.morale + consultant.successEffect.moraleBoost) }))
                            : prev.staff,
                          log: [...prev.log, {
                            day: prev.day,
                            text: `${consultant.name} engagement SUCCESS! ${consultant.successEffect.patientBoost ? `+${consultant.successEffect.patientBoost} patients. ` : ''}${consultant.successEffect.reputationBoost ? `+${consultant.successEffect.reputationBoost} reputation. ` : ''}${consultant.successEffect.debtReduction ? `$${consultant.successEffect.debtReduction.toLocaleString()} debt reduced. ` : ''}Your team executed the plan perfectly.`,
                            type: 'positive',
                          }],
                        }));
                      } else {
                        const failedReqs = reqCheck.filter(r => !r.met).map(r => r.label).join(', ');
                        setGameState(prev => ({
                          ...prev,
                          cash: prev.cash - consultant.cost,
                          totalConsultantSpend: (prev.totalConsultantSpend || 0) + consultant.cost,
                          consultantCooldowns: {
                            ...(prev.consultantCooldowns || {}),
                            [consultant.id]: prev.day + 45,
                          },
                          staff: consultant.failEffect.moraleEffect
                            ? prev.staff.map(s => ({ ...s, morale: Math.max(10, s.morale + consultant.failEffect.moraleEffect) }))
                            : prev.staff,
                          reputation: Math.max(0, prev.reputation + (consultant.failEffect.reputationEffect || 0)),
                          log: [...prev.log, {
                            day: prev.day,
                            text: `${consultant.name} FAILED! $${consultant.cost.toLocaleString()} wasted. ${consultant.failMessage} Missing: ${failedReqs}`,
                            type: 'negative',
                          }],
                        }));
                      }
                    }}
                    disabled={!canAfford || isOnCooldown || hasActiveBuff}
                  >
                    {hasActiveBuff ? 'Already Active' : isOnCooldown ? 'On Cooldown' :
                      allMet ? `Hire - $${(consultant.cost / 1000).toFixed(0)}K` :
                      `Hire Anyway - $${(consultant.cost / 1000).toFixed(0)}K (Risky!)`}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SCORE TAB ── */}
        {/* ── LOCATIONS TAB ── */}
        {tab === 'locations' && (
          <div>
            <h3 className="mgmt-title">Your Dental Empire</h3>

            {/* Regional Manager Warning */}
            {(gameState.locationCount || 1) >= 4 && !gameState.hasRegionalManager && (
              <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🚨</span>
                <div>
                  <strong>You need a Regional Manager!</strong> With {gameState.locationCount} locations and no RM, all offices suffer a 15% efficiency penalty and morale bleeds daily.
                </div>
              </div>
            )}

            {/* Synergy Display */}
            {(gameState.locationCount || 1) > 1 && (() => {
              const syn = getSynergyMultipliers(gameState.locationCount || 1);
              return (
                <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#22c55e', marginBottom: '6px' }}>📦 Buying Synergy ({gameState.locationCount} locations)</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Supplies: <span style={{ color: '#22c55e' }}>-{Math.round((1 - syn.supplies) * 100)}%</span></span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Maintenance: <span style={{ color: '#22c55e' }}>-{Math.round((1 - syn.maintenance) * 100)}%</span></span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Insurance Bonus: <span style={{ color: '#22c55e' }}>+{Math.round(syn.insuranceReimbursementBonus * 100)}%</span></span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Demand Boost: <span style={{ color: '#22c55e' }}>+{Math.round((syn.marketingDemandBonus - 1) * 100)}%</span></span>
                  </div>
                </div>
              );
            })()}

            {/* Main Office Card */}
            <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '22px' }}>🏥</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>Main Office (HQ)</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{gameState.sqft || 0} sqft · {(gameState.builtOutRooms || []).filter(r => r === 'basic_ops' || r === 'premium_ops').length} operatories</div>
                  </div>
                </div>
                <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '10px', background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>Primary</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                <div style={{ textAlign: 'center', padding: '6px', background: 'rgba(15,23,42,0.5)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Patients</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>{gameState.patients}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '6px', background: 'rgba(15,23,42,0.5)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Revenue</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#22c55e' }}>${stats.dailyRevenue.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '6px', background: 'rgba(15,23,42,0.5)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Rating</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#eab308' }}>{gameState.reputation.toFixed(1)} ⭐</div>
                </div>
                <div style={{ textAlign: 'center', padding: '6px', background: 'rgba(15,23,42,0.5)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>Staff</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>{gameState.staff.filter(s => !s.assignedLocationId).length}</div>
                </div>
              </div>
            </div>

            {/* Branch Location Cards */}
            {(gameState.locations || []).map((loc, idx) => (
              <div key={loc.id} style={{
                background: 'rgba(30,41,59,0.5)', border: `1px solid ${loc.buildoutDaysLeft > 0 ? 'rgba(234,179,8,0.2)' : 'rgba(59,130,246,0.2)'}`,
                borderRadius: '10px', padding: '12px', marginBottom: '10px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '22px' }}>{loc.icon || '🏢'}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>{loc.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{loc.sqft} sqft · {loc.maxOps} max ops · ${(loc.rent || 0).toLocaleString()}/mo rent</div>
                    </div>
                  </div>
                  {loc.buildoutDaysLeft > 0 ? (
                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '10px', background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>
                      🔨 {loc.buildoutDaysLeft}d left
                    </span>
                  ) : (
                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '10px', background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                      ✅ Open
                    </span>
                  )}
                </div>
                {loc.buildoutDaysLeft > 0 ? (
                  <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#eab308', marginBottom: '4px' }}>Under Construction</div>
                    <div style={{ height: '6px', background: 'rgba(234,179,8,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: '3px', background: '#eab308',
                        width: `${((1 - loc.buildoutDaysLeft / (LOCATION_OPTIONS.find(o => o.id === loc.type)?.buildoutDays || 30)) * 100)}%`,
                        transition: 'width 0.3s',
                      }} />
                    </div>
                    <div style={{ fontSize: '9px', color: '#64748b', marginTop: '4px' }}>Rent still due during buildout</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    <div style={{ textAlign: 'center', padding: '6px', background: 'rgba(15,23,42,0.5)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '9px', color: '#64748b' }}>Patients</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>{loc.patients || 0}</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px', background: 'rgba(15,23,42,0.5)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '9px', color: '#64748b' }}>Revenue</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#22c55e' }}>${(loc.lastDayRevenue || 0).toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px', background: 'rgba(15,23,42,0.5)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '9px', color: '#64748b' }}>Rating</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#eab308' }}>{(loc.reputation || 3.0).toFixed(1)} ⭐</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px', background: 'rgba(15,23,42,0.5)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '9px', color: '#64748b' }}>Staff</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>{gameState.staff.filter(s => s.assignedLocationId === loc.id).length}</div>
                    </div>
                  </div>
                )}

                {/* Staff Transfer for open locations */}
                {loc.buildoutDaysLeft <= 0 && (
                  <div style={{ marginTop: '8px', borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Transfer Staff Here:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {gameState.staff.filter(s => !s.assignedLocationId && s.role !== 'Regional Manager').map(s => (
                        <button key={s.id} onClick={() => {
                          setGameState(prev => ({
                            ...prev,
                            staff: prev.staff.map(st => st.id === s.id ? { ...st, assignedLocationId: loc.id } : st),
                            log: [...prev.log, { day: prev.day, text: `Transferred ${s.name} (${s.role}) to ${loc.name}`, type: 'info' }],
                          }));
                        }} style={{
                          fontSize: '9px', padding: '3px 8px', borderRadius: '6px',
                          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                          color: '#3b82f6', cursor: 'pointer',
                        }}>
                          {s.icon} {s.name.split(' ')[0]}
                        </button>
                      ))}
                      {gameState.staff.filter(s => !s.assignedLocationId && s.role !== 'Regional Manager').length === 0 && (
                        <span style={{ fontSize: '9px', color: '#475569' }}>No unassigned staff at HQ</span>
                      )}
                    </div>
                    {/* Staff assigned to this location with recall button */}
                    {gameState.staff.filter(s => s.assignedLocationId === loc.id).length > 0 && (
                      <div style={{ marginTop: '6px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Assigned here:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {gameState.staff.filter(s => s.assignedLocationId === loc.id).map(s => (
                            <button key={s.id} onClick={() => {
                              setGameState(prev => ({
                                ...prev,
                                staff: prev.staff.map(st => st.id === s.id ? { ...st, assignedLocationId: null } : st),
                                log: [...prev.log, { day: prev.day, text: `Recalled ${s.name} (${s.role}) back to HQ`, type: 'info' }],
                              }));
                            }} style={{
                              fontSize: '9px', padding: '3px 8px', borderRadius: '6px',
                              background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)',
                              color: '#eab308', cursor: 'pointer',
                            }}>
                              {s.icon} {s.name.split(' ')[0]} ✕
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Open New Location */}
            <div style={{ marginTop: '12px', borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: '12px' }}>
              <h4 className="mgmt-subtitle">Open New Location</h4>
              {LOCATION_OPTIONS.map(opt => {
                const meetsRep = gameState.reputation >= opt.minReputation;
                const meetsPats = gameState.patients >= opt.minPatients;
                const meetsCash = gameState.cash >= opt.minCash;
                const canAfford = gameState.cash >= opt.setupCost;
                const meetsAll = meetsRep && meetsPats && meetsCash && canAfford;
                const advice = getLocationAdvice(gameState, opt);

                return (
                  <div key={opt.id} style={{
                    background: 'rgba(30,41,59,0.4)', border: `1px solid ${meetsAll ? 'rgba(34,197,94,0.3)' : 'rgba(71,85,105,0.3)'}`,
                    borderRadius: '10px', padding: '12px', marginBottom: '8px',
                    opacity: meetsAll ? 1 : 0.7,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div>
                        <span style={{ fontSize: '16px', marginRight: '6px' }}>{opt.icon}</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>{opt.name}</span>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: canAfford ? '#22c55e' : '#ef4444' }}>${(opt.setupCost / 1000).toFixed(0)}K</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '6px' }}>
                      {opt.sqft} sqft · {opt.maxOps} ops · ${opt.rent.toLocaleString()}/mo rent · {opt.buildoutDays} day buildout
                    </div>

                    {/* Prerequisites */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: meetsRep ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: meetsRep ? '#22c55e' : '#ef4444' }}>
                        {meetsRep ? '✓' : '✗'} {opt.minReputation}+ stars
                      </span>
                      <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: meetsPats ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: meetsPats ? '#22c55e' : '#ef4444' }}>
                        {meetsPats ? '✓' : '✗'} {opt.minPatients}+ patients
                      </span>
                      <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: meetsCash ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: meetsCash ? '#22c55e' : '#ef4444' }}>
                        {meetsCash ? '✓' : '✗'} ${(opt.minCash / 1000).toFixed(0)}K+ cash
                      </span>
                    </div>

                    {/* Placement Advice */}
                    {advice && (
                      <div style={{ fontSize: '10px', color: '#3b82f6', background: 'rgba(59,130,246,0.08)', padding: '6px 8px', borderRadius: '6px', marginBottom: '8px' }}>
                        💡 {advice}
                      </div>
                    )}

                    {/* Staff Requirements */}
                    <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '6px' }}>
                      Minimum staff: {Object.entries(opt.staffMinimum).map(([role, count]) => `${count} ${role}`).join(', ')}
                    </div>

                    <button
                      disabled={!meetsAll}
                      onClick={() => {
                        if (!meetsAll) return;
                        setGameState(prev => {
                          const newLoc = {
                            id: `loc_${Date.now()}`,
                            type: opt.id,
                            name: `${opt.name} #${(prev.locations || []).length + 2}`,
                            icon: opt.icon,
                            sqft: opt.sqft,
                            maxOps: opt.maxOps,
                            rent: opt.rent,
                            buildoutDaysLeft: opt.buildoutDays,
                            patients: 0,
                            reputation: Math.max(2.5, prev.reputation - 1.0),
                            cleanliness: 80,
                            equipment: [],
                            builtOutRooms: [],
                            acceptedInsurance: [...(prev.acceptedInsurance || [])],
                            lastDayRevenue: 0,
                            lastDayCost: 0,
                            openedDay: prev.day,
                          };
                          return {
                            ...prev,
                            cash: prev.cash - opt.setupCost,
                            locations: [...(prev.locations || []), newLoc],
                            locationCount: (prev.locationCount || 1) + 1,
                            log: [...prev.log, { day: prev.day, text: `🏗️ Broke ground on ${newLoc.name}! Buildout: ${opt.buildoutDays} days. Cost: $${opt.setupCost.toLocaleString()}`, type: 'positive' }],
                          };
                        });
                      }}
                      style={{
                        width: '100%', padding: '8px', fontSize: '12px', fontWeight: 700,
                        background: meetsAll ? 'rgba(34,197,94,0.2)' : 'rgba(71,85,105,0.2)',
                        border: `1px solid ${meetsAll ? '#22c55e' : '#475569'}`,
                        borderRadius: '8px', color: meetsAll ? '#22c55e' : '#475569',
                        cursor: meetsAll ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {meetsAll ? `Open ${opt.name}` : 'Prerequisites Not Met'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'score' && (
          <div>
            <h3 className="mgmt-title">Practice Report Card</h3>
            <p className="mgmt-desc">Your practice graded on overhead, profitability, and key metrics. The real measure of a dental practice is how efficiently you earn.</p>
            <ScoreCard gameState={gameState} stats={stats} difficulty={difficulty} />

            {/* Per-Mode Leaderboard */}
            <LeaderboardPanel gameState={gameState} stats={stats} difficulty={difficulty} setGameState={setGameState} />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LEADERBOARD PANEL (Per-Mode Tabs)
// ═══════════════════════════════════════════════════════
function LeaderboardPanel({ gameState, stats, difficulty, setGameState }) {
  const [lbTab, setLbTab] = useState(difficulty?.name || 'All');
  const modes = getLeaderboardModes();
  const allTabs = ['All', ...DIFFICULTY_MODES.map(m => m.name).filter(n => modes.includes(n) || n === difficulty?.name)];
  const uniqueTabs = [...new Set(allTabs)];

  const board = lbTab === 'All' ? getLeaderboard() : getLeaderboardByMode(lbTab);

  const renderEntry = (entry, i) => (
    <div key={entry.id || i} style={{
      display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px',
      background: i === 0 ? 'rgba(234,179,8,0.1)' : 'rgba(30,41,59,0.3)',
      borderRadius: '6px', marginBottom: '4px', fontSize: '11px',
      borderLeft: i < 3 ? `3px solid ${i === 0 ? '#eab308' : i === 1 ? '#94a3b8' : '#cd7f32'}` : 'none',
    }}>
      <span style={{ fontWeight: 700, color: i === 0 ? '#eab308' : '#94a3b8', minWidth: '20px' }}>#{i + 1}</span>
      <span style={{ flex: 1, color: '#cbd5e1' }}>
        {lbTab === 'All' ? `${entry.difficulty} · ` : ''}Day {entry.day} · {entry.outcome || ''}
      </span>
      <span style={{ color: '#94a3b8', fontSize: '10px' }}>{entry.overallGrade}</span>
      <span style={{ fontFamily: 'Fredoka One', fontSize: '14px', color: entry.overallScore >= 700 ? '#22c55e' : entry.overallScore >= 500 ? '#eab308' : '#ef4444' }}>
        {entry.overallScore}
      </span>
    </div>
  );

  return (
    <div style={{ marginTop: '15px', borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: '12px' }}>
      <h4 className="mgmt-subtitle">Leaderboard</h4>
      {/* Tabs */}
      <div className="lb-tabs">
        {uniqueTabs.map(tab => (
          <button key={tab} className={`lb-tab ${lbTab === tab ? 'active' : ''}`}
            onClick={() => setLbTab(tab)}>{tab}</button>
        ))}
      </div>
      {board.length === 0
        ? <p className="empty-msg">No entries yet for {lbTab}. Complete a run to save your score!</p>
        : board.slice(0, 10).map(renderEntry)
      }
      {calculateScore(gameState, stats) && (
        <button className="buy-btn" style={{ width: '100%', marginTop: '8px', textAlign: 'center', padding: '8px' }}
          onClick={() => {
            const s = calculateScore(gameState, stats);
            if (!s) return;
            saveToLeaderboard({
              overallScore: s.overall, overallGrade: s.overallGrade,
              profitMargin: s.metrics.profitMargin, overheadRatio: s.metrics.overheadRatio,
              monthlyRevenue: s.metrics.monthlyRevenue, day: gameState.day,
              patients: gameState.patients, difficulty: difficulty?.name || 'Intermediate',
            });
            setGameState(prev => ({ ...prev, log: [...prev.log, { day: prev.day, text: 'Score saved to leaderboard!', type: 'positive' }] }));
          }}>
          Save Current Score to Leaderboard
        </button>
      )}
      {/* Online leaderboard placeholder */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <span style={{ fontSize: '11px', color: '#475569', cursor: 'default' }}>
          Global Leaderboard (Coming Soon) — Online leaderboards are being built. For now, challenge a friend with Challenge Mode!
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// KEY DECISION POPUP
// ═══════════════════════════════════════════════════════
function KeyDecisionPopup({ decision, onChoose }) {
  const desc = typeof decision.description === 'function' ? decision.description(decision._gameState || {}) : decision.description;
  const opts = typeof decision.options === 'function' ? decision.options(decision._gameState || {}) : decision.options;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '550px', width: '100%', background: '#0f172a',
        border: '2px solid #eab308', borderRadius: '16px', padding: '24px',
        boxShadow: '0 0 60px rgba(234,179,8,0.2)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#eab308', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>Decision Required</div>
          <h2 style={{ fontSize: '22px', color: '#e2e8f0', margin: 0 }}>{decision.title}</h2>
        </div>
        <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '20px', textAlign: 'center' }}>
          {desc}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {opts.map(opt => (
            <button
              key={opt.id}
              onClick={() => onChoose(decision, opt)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '14px 16px', background: 'rgba(30,41,59,0.6)',
                border: '1px solid #334155', borderRadius: '10px',
                cursor: 'pointer', textAlign: 'left', color: '#e2e8f0',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#eab308'; e.currentTarget.style.background = 'rgba(234,179,8,0.08)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.background = 'rgba(30,41,59,0.6)'; }}
            >
              <span style={{ fontSize: '24px', lineHeight: 1 }}>{opt.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '4px' }}>{opt.label}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>{opt.description}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ marginTop: '14px', padding: '8px', background: 'rgba(234,179,8,0.06)', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#64748b' }}>Game is PAUSED. Choose carefully — this decision shapes your practice.</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// GAME SCREEN (main)
// ═══════════════════════════════════════════════════════
function GameScreen({ startMode, acquisitionChoice, fixWindowData, buildoutData, difficulty, challengeData, onChallengeComplete }) {
  const diff = difficulty || DIFFICULTY_MODES[1]; // default to intermediate

  const [gameState, setGameState] = useState(() => {
    if (startMode === 'scratch') {
      const bd = buildoutData || {};
      const space = bd.space || SPACE_OPTIONS[1];
      const loanAmount = diff.loanAmount;
      const hasChair = (bd.equipment || []).some(eq => {
        const def = EQUIPMENT.find(e => e.id === eq);
        return def && def.patientsPerDay > 0;
      });
      const hasDentist = (bd.staff || []).some(s => isProvider(s));
      const hasMarketing = (bd.activeMarketing || []).length > 0;

      const hasCompressor = (bd.equipment || []).includes('compressor');
      const hasVacuum = (bd.equipment || []).includes('vacuum_pump');

      const setupWarnings = [];
      if (!hasChair) setupWarnings.push('NO dental chairs — patients have nowhere to sit!');
      if (!hasDentist) setupWarnings.push('NO dentist — you can\'t treat anyone!');
      if (!hasCompressor) setupWarnings.push('NO air compressor — your handpieces won\'t work! You literally cannot drill.');
      if (!hasVacuum) setupWarnings.push('NO vacuum/suction pump — you can\'t do procedures without suction!');
      if (!hasMarketing) setupWarnings.push('NO marketing — nobody knows you exist!');

      return {
        cash: bd.cashRemaining || loanAmount,
        debt: loanAmount,
        day: 1,
        gameDuration: diff.gameDuration,
        patients: 0,
        reputation: diff.startingReputation,
        equipment: bd.equipment || [],
        staff: bd.staff || [],
        activeMarketing: bd.activeMarketing || [],
        acceptedInsurance: bd.acceptedInsurance || [],
        officeUpgrades: [],
        activeTraining: [],
        completedTraining: [],
        trainingCompleteDays: {},
        activeConsultantBuffs: [],
        consultantCooldowns: {},
        speed: 0,
        difficulty: diff.id,
        interestRate: diff.interestRate,
        log: [
          { day: 1, text: `Day 1! $${(loanAmount / 1000).toFixed(0)}K loan at ${Math.round(diff.interestRate * 100)}%. ${diff.gameDuration}-day season starts NOW. Cash: $${(bd.cashRemaining || loanAmount).toLocaleString()}`, type: 'warning' },
          ...(setupWarnings.map(w => ({ day: 1, text: `WARNING: ${w}`, type: 'negative' }))),
          ...(setupWarnings.length === 0 ? [{ day: 1, text: 'Practice is set up! Hit play to start seeing patients.', type: 'positive' }] : []),
          ...(diff.showHints ? [{ day: 1, text: 'TIP: Check Training tab and Consultants tab for growth tools. Score tab tracks your grades!', type: 'info' }] : []),
        ],
        revenueHistory: [],
        cleanliness: 50,
        relationships: { supply_rep: 50, equipment_tech: 50, referring_docs: 30, lab: 50, landlord: 60 },
        builtOutRooms: bd.builtOutRooms || [],
        sqft: space.sqft,
        maxOps: space.maxOps,
        rent: Math.round(space.rent * diff.rentMultiplier),
        scoreMultiplier: diff.scoreMultiplier || 1,
        lastLoanPaymentDay: 0,
        missedPayments: 0,
        insuranceCredentialDays: {},
        decisionHistory: [],
        triggeredDecisions: [],
        locations: [],
        hasRegionalManager: false,
        locationCount: 1,
        // Tracking for scorecard
        totalHires: 0, totalFires: 0, totalStaffQuit: 0,
        totalMarketingSpend: 0, marketingChannelsUsed: [],
        totalTrainingSpend: 0, totalConsultantSpend: 0,
        totalRevenue: 0, totalExpenses: 0,
        peakPatients: 0, peakCash: 0, worstCash: 0,
        bestMonthRevenue: 0, worstMonthRevenue: Infinity,
        totalPatientsServed: 0,
        eventLog: [], // key moments for feedback
      };
    } else {
      // Acquisition path — use fixWindowData from the Fix Window screen
      const fw = fixWindowData || {};
      const opt = fw.practice || acquisitionChoice || {};
      const staffMembers = (fw.staff || []).map(s => ({ ...s }));
      const totalDebt = fw.totalDebt || (opt.price || 0) + diff.loanAmount;
      const cashRemaining = fw.cashRemaining != null ? fw.cashRemaining : 100000;
      return {
        cash: cashRemaining, debt: totalDebt, day: 1,
        gameDuration: diff.gameDuration,
        patients: opt.patients || 100, reputation: Math.min(opt.reputation || 3.0, diff.startingReputation + 1),
        equipment: [...(fw.equipment || opt.equipment || [])], staff: staffMembers,
        activeMarketing: fw.marketing || [], acceptedInsurance: fw.insurance || opt.insurances || [],
        officeUpgrades: [], activeTraining: [], completedTraining: [], trainingCompleteDays: {},
        activeConsultantBuffs: [], consultantCooldowns: {},
        speed: 0, difficulty: diff.id, interestRate: diff.interestRate,
        log: [
          { day: 1, text: `Acquired "${opt.name}" for $${((opt.price || 0) / 1000).toFixed(0)}K. ${diff.gameDuration}-day season. Cash: $${cashRemaining.toLocaleString()}`, type: 'info' },
          ...(opt.problems || []).map(p => {
            const prob = PROBLEM_POOL.find(pp => pp.id === p);
            return { day: 1, text: `Issue: ${prob?.label || p} — ${prob?.description || ''}`, type: 'negative' };
          }),
        ],
        revenueHistory: [],
        cleanliness: fw.cleanliness || opt.cleanliness || 50,
        relationships: opt.relationships || { supply_rep: 50, equipment_tech: 50, referring_docs: 50, lab: 50, landlord: 50 },
        builtOutRooms: opt.builtOutRooms || [],
        sqft: opt.sqft || 2000,
        maxOps: opt.maxOps || Math.max(...SPACE_OPTIONS.filter(sp => sp.sqft <= (opt.sqft || 2000)).map(sp => sp.maxOps), 4),
        rent: Math.round((opt.rent || 5000) * diff.rentMultiplier),
        scoreMultiplier: diff.scoreMultiplier || 1,
        lastLoanPaymentDay: 0,
        missedPayments: 0,
        insuranceCredentialDays: {},
        decisionHistory: [],
        triggeredDecisions: [],
        locations: [],
        hasRegionalManager: false,
        locationCount: 1,
        // Tracking for scorecard
        totalHires: 0, totalFires: 0, totalStaffQuit: 0,
        totalMarketingSpend: 0, marketingChannelsUsed: [],
        totalTrainingSpend: 0, totalConsultantSpend: 0,
        totalRevenue: 0, totalExpenses: 0,
        peakPatients: 0, peakCash: 0, worstCash: 0,
        bestMonthRevenue: 0, worstMonthRevenue: Infinity,
        totalPatientsServed: 0,
        eventLog: [],
      };
    }
  });

  const [activePatients, setActivePatients] = useState([]);
  const [eventPopup, setEventPopup] = useState(null);
  const [pendingDecision, setPendingDecision] = useState(null);
  const speedBeforeDecision = useRef(0);

  // Challenge mode: pre-generate deterministic event schedule so both players face identical events
  const challengeSchedule = useRef(null);
  if (challengeData?.code && !challengeSchedule.current) {
    const seed = codeToSeed(challengeData.code);
    challengeSchedule.current = generateChallengeSchedule(seed, diff.gameDuration, diff.id);
  }
  const stats = (() => { try { return calculateDailyStats(gameState); } catch (e) { console.error('calculateDailyStats error:', e); return { dailyRevenue: 0, totalDailyCosts: 0, dailyProfit: 0, actualPatients: 0, reputationChange: 0, satisfactionScore: 50, annualRevenuePerSqft: 0 }; } })();

  // ── Handle Key Decision choice ──
  const handleDecision = useCallback((decision, chosenOption) => {
    const effects = chosenOption.effects || {};
    setGameState(prev => {
      let updated = { ...prev };
      const newLog = [...updated.log];

      // Log the decision
      newLog.push({ day: updated.day, text: `DECISION: ${decision.title} → ${chosenOption.label}`, type: 'milestone' });

      // Cash effect
      if (effects.cashEffect) {
        updated.cash += effects.cashEffect;
        if (effects.cashEffect < 0) newLog.push({ day: updated.day, text: `Spent $${Math.abs(effects.cashEffect).toLocaleString()}`, type: 'negative' });
        if (effects.cashEffect > 0) newLog.push({ day: updated.day, text: `Received $${effects.cashEffect.toLocaleString()}`, type: 'positive' });
      }

      // Patient boost
      if (effects.patientBoost) {
        updated.patients = Math.max(0, updated.patients + effects.patientBoost);
        newLog.push({ day: updated.day, text: `${effects.patientBoost > 0 ? '+' : ''}${effects.patientBoost} patients`, type: effects.patientBoost > 0 ? 'positive' : 'negative' });
      }

      // Reputation effect
      if (effects.reputationEffect) {
        updated.reputation = Math.max(0, Math.min(5, updated.reputation + effects.reputationEffect));
      }

      // Morale effect (all staff)
      if (effects.moraleEffect) {
        updated.staff = updated.staff.map(s => ({ ...s, morale: Math.max(10, Math.min(100, s.morale + effects.moraleEffect)) }));
      }

      // Morale boost (all staff)
      if (effects.moraleBoost && !effects.targetCount) {
        updated.staff = updated.staff.map(s => ({ ...s, morale: Math.max(10, Math.min(100, s.morale + effects.moraleBoost)) }));
      }

      // Add staff member
      if (effects.addStaff) {
        const template = STAFF_TEMPLATES.find(t => t.role === effects.addStaff.role);
        const newStaff = {
          id: Date.now() + Math.random(),
          name: ['Dr. Rivera', 'Dr. Chen', 'Dr. Park', 'Alex Morgan', 'Jamie Lee'][Math.floor(Math.random() * 5)],
          role: effects.addStaff.role,
          icon: template?.icon || '👤',
          skill: effects.addStaff.skill || 60,
          attitude: effects.addStaff.attitude || 60,
          reliability: 70,
          salary: Math.round((effects.addStaff.salary || template?.baseSalary || 50000) * diff.salaryMultiplier),
          canSeePatients: template?.canSeePatients || false,
          patientsPerDay: template?.patientsPerDay || 0,
          morale: 70,
          daysEmployed: 0,
        };
        updated.staff = [...updated.staff, newStaff];
        newLog.push({ day: updated.day, text: `${newStaff.name} (${newStaff.role}) joined the team!`, type: 'positive' });
      }

      // Fire a role
      if (effects.fireRole) {
        const idx = updated.staff.findIndex(s => s.role === effects.fireRole);
        if (idx !== -1) {
          const fired = updated.staff[idx];
          updated.staff = updated.staff.filter((_, i) => i !== idx);
          newLog.push({ day: updated.day, text: `${fired.name} (${fired.role}) was fired.`, type: 'negative' });
        }
      }

      // Salary increase for top staff
      if (effects.salaryIncrease && effects.targetCount) {
        const sorted = [...updated.staff].sort((a, b) => b.daysEmployed - a.daysEmployed);
        const targets = sorted.slice(0, effects.targetCount);
        updated.staff = updated.staff.map(s => {
          if (targets.find(t => t.id === s.id)) {
            return {
              ...s,
              salary: Math.round(s.salary * (1 + effects.salaryIncrease)),
              morale: Math.min(100, s.morale + (effects.moraleBoost || 0)),
            };
          }
          return s;
        });
        newLog.push({ day: updated.day, text: `Gave ${effects.targetCount} senior staff a ${Math.round(effects.salaryIncrease * 100)}% raise.`, type: 'info' });

        // Quit chance — one of the targets might leave
        if (effects.quitChance && Math.random() < effects.quitChance) {
          const quitter = targets[targets.length - 1]; // least senior of the targets
          if (quitter) {
            updated.staff = updated.staff.filter(s => s.id !== quitter.id);
            updated.totalStaffQuit = (updated.totalStaffQuit || 0) + 1;
            newLog.push({ day: updated.day, text: `${quitter.name} quit anyway despite the offer.`, type: 'negative' });
          }
        }
      }

      // Quit chance without salary (e.g. refuse raises)
      if (effects.quitChance && !effects.salaryIncrease) {
        const sorted = [...updated.staff].sort((a, b) => b.daysEmployed - a.daysEmployed);
        const atRisk = sorted.slice(0, 3);
        atRisk.forEach(s => {
          if (Math.random() < effects.quitChance) {
            updated.staff = updated.staff.filter(st => st.id !== s.id);
            updated.totalStaffQuit = (updated.totalStaffQuit || 0) + 1;
            newLog.push({ day: updated.day, text: `${s.name} followed through and quit!`, type: 'negative' });
          }
        });
      }

      // Add equipment
      if (effects.addEquipment) {
        if (!updated.equipment.includes(effects.addEquipment)) {
          updated.equipment = [...updated.equipment, effects.addEquipment];
          const eqDef = EQUIPMENT.find(e => e.id === effects.addEquipment);
          newLog.push({ day: updated.day, text: `New equipment: ${eqDef?.name || effects.addEquipment}`, type: 'positive' });
        }
      }

      // Monthly overhead increase (e.g. lease)
      if (effects.monthlyOverhead) {
        updated.rent = (updated.rent || 0) + effects.monthlyOverhead;
        newLog.push({ day: updated.day, text: `Monthly overhead increased by $${effects.monthlyOverhead.toLocaleString()}/mo`, type: 'negative' });
      }

      // Rent increase
      if (effects.rentIncrease) {
        updated.rent = (updated.rent || 0) + effects.rentIncrease;
        newLog.push({ day: updated.day, text: `Rent increased by $${effects.rentIncrease.toLocaleString()}/mo`, type: 'negative' });
      }

      // Ops boost (expansion)
      if (effects.opsBoost) {
        updated.maxOps = (updated.maxOps || 4) + effects.opsBoost;
        newLog.push({ day: updated.day, text: `Added ${effects.opsBoost} operatories! Max now: ${updated.maxOps}`, type: 'positive' });
      }

      // Revenue multiplier (temporary)
      if (effects.revenueMultiplier && effects.duration) {
        updated.activeConsultantBuffs = [...(updated.activeConsultantBuffs || []), {
          id: `decision_${decision.id}`,
          name: chosenOption.label,
          revenueBoost: effects.revenueMultiplier - 1,
          daysLeft: effects.duration,
        }];
      }

      // Lock insurance (exclusive deal)
      if (effects.lockInsurance) {
        // Keep only the specified insurance, drop others
        const kept = updated.acceptedInsurance.filter(id => id.toLowerCase().includes(effects.lockInsurance));
        const dropped = updated.acceptedInsurance.length - kept.length;
        updated.acceptedInsurance = kept;
        if (dropped > 0) newLog.push({ day: updated.day, text: `Dropped ${dropped} insurance plan(s) for exclusive deal.`, type: 'warning' });
      }

      // Add insurance
      if (effects.addInsurance) {
        if (!(updated.acceptedInsurance || []).includes(effects.addInsurance)) {
          updated.acceptedInsurance = [...(updated.acceptedInsurance || []), effects.addInsurance];
          newLog.push({ day: updated.day, text: `Added ${effects.addInsurance} insurance.`, type: 'info' });
        }
      }

      // Negotiation (success/fail chance)
      if (effects.negotiation) {
        const success = Math.random() < (effects.successChance || 0.5);
        const resolvedEffects = success ? effects.successEffects : effects.failEffects;
        if (success) {
          newLog.push({ day: updated.day, text: 'Negotiation succeeded!', type: 'positive' });
        } else {
          newLog.push({ day: updated.day, text: 'Negotiation failed.', type: 'negative' });
        }
        // Apply resolved effects recursively (simple version — just patient + staff + rep)
        if (resolvedEffects?.patientBoost) updated.patients = Math.max(0, updated.patients + resolvedEffects.patientBoost);
        if (resolvedEffects?.reputationEffect) updated.reputation = Math.max(0, Math.min(5, updated.reputation + resolvedEffects.reputationEffect));
        if (resolvedEffects?.addStaff) {
          const template = STAFF_TEMPLATES.find(t => t.role === resolvedEffects.addStaff.role);
          updated.staff = [...updated.staff, {
            id: Date.now() + Math.random(), name: 'Dr. Rivera',
            role: resolvedEffects.addStaff.role, icon: template?.icon || '👤',
            skill: resolvedEffects.addStaff.skill || 60, attitude: resolvedEffects.addStaff.attitude || 60,
            reliability: 70, salary: Math.round((resolvedEffects.addStaff.salary || 50000) * diff.salaryMultiplier),
            canSeePatients: template?.canSeePatients || false, patientsPerDay: template?.patientsPerDay || 0,
            morale: 65, daysEmployed: 0,
          }];
        }
      }

      // DSO sell — settle debt from sale proceeds
      if (effects.dsoSell) {
        const salePrice = effects.salePrice || 400000;
        const debtOwed = updated.debt || 0;
        const netProceeds = salePrice - debtOwed;
        updated.cash += salePrice; // add sale price
        if (debtOwed > 0) {
          const debtPaid = Math.min(debtOwed, salePrice);
          updated.cash -= debtPaid; // bank takes their cut first
          updated.debt = Math.max(0, debtOwed - salePrice);
          newLog.push({ day: updated.day, text: `Practice sold for $${salePrice.toLocaleString()}. Bank collected $${debtPaid.toLocaleString()} to settle loan.${netProceeds > 0 ? ` Net proceeds: $${netProceeds.toLocaleString()}` : ` Still owe: $${Math.abs(netProceeds).toLocaleString()}`}`, type: netProceeds > 0 ? 'positive' : 'negative' });
        } else {
          newLog.push({ day: updated.day, text: `Practice sold for $${salePrice.toLocaleString()}. No outstanding debt — full amount is yours!`, type: 'positive' });
        }
        updated.dsoSalePrice = salePrice;
        updated.dsoDebtSettled = Math.min(debtOwed, salePrice);
        updated.dsoNetProceeds = netProceeds;
      }

      // End game (DSO buyout or other)
      if (effects.endGame) {
        updated.day = updated.gameDuration || diff.gameDuration; // force season complete
        updated.endReason = effects.endReason || 'Game ended by decision.';
        newLog.push({ day: updated.day, text: updated.endReason, type: 'milestone' });
      }

      // Open new location
      if (effects.openLocation) {
        const locDef = LOCATION_OPTIONS.find(l => l.id === effects.openLocation);
        if (locDef && updated.cash >= locDef.setupCost) {
          updated.cash -= locDef.setupCost;
          const newLoc = {
            id: `loc_${Date.now()}`, name: locDef.name, type: locDef.id,
            sqft: locDef.sqft, maxOps: locDef.maxOps, rent: locDef.rent,
            patients: 0, reputation: Math.max(2.5, updated.reputation - 0.5),
            equipment: [], staff: [], activeMarketing: [], acceptedInsurance: [...(updated.acceptedInsurance || [])],
            officeUpgrades: [], builtOutRooms: ['basic_ops', 'waiting_area', 'sterilization'],
            cleanliness: 80, revenueHistory: [],
            relationships: { supply_rep: 40, equipment_tech: 40, referring_docs: 20, lab: 50, landlord: 50 },
            buildingDaysLeft: locDef.buildoutDays,
          };
          updated.locations = [...(updated.locations || []), newLoc];
          updated.locationCount = 1 + updated.locations.length;
          newLog.push({ day: updated.day, text: `New ${locDef.name} opening! $${locDef.setupCost.toLocaleString()} invested. Construction: ${locDef.buildoutDays} days.`, type: 'milestone' });
        }
      }

      // Associate raise (flight risk response)
      if (effects.associateRaise) {
        const critAssoc = updated.staff.find(s => s.isAssociate && s.flightRisk === 'critical');
        if (critAssoc) {
          updated.staff = updated.staff.map(s => s.id === critAssoc.id ? {
            ...s, salary: Math.round(s.salary * (1 + effects.associateRaise)), loyalty: Math.min(100, (s.loyalty || 50) + 20),
          } : s);
        }
      }

      // Associate partnership offer
      if (effects.associatePartnership) {
        const critAssoc = updated.staff.find(s => s.isAssociate && s.flightRisk === 'critical');
        if (critAssoc) {
          updated.staff = updated.staff.map(s => s.id === critAssoc.id ? {
            ...s, partnershipOffered: true, loyalty: Math.min(100, (s.loyalty || 50) + 30),
          } : s);
        }
      }

      // Associate depart (let them go)
      if (effects.associateDepart) {
        const critAssoc = updated.staff.find(s => s.isAssociate && s.flightRisk === 'critical');
        if (critAssoc) {
          const dep = associateDeparture(updated.patients, critAssoc);
          updated.staff = updated.staff.filter(s => s.id !== critAssoc.id);
          updated.patients = Math.max(0, updated.patients - dep.patientsLost);
          updated.reputation = Math.max(0, updated.reputation + dep.reputationHit);
          updated.staff = updated.staff.map(s => ({ ...s, morale: Math.max(10, s.morale + dep.moraleHit) }));
          newLog.push({ day: updated.day, text: dep.message, type: 'negative' });
        }
      }

      // Hire regional manager
      if (effects.hireRegionalManager) {
        const rmTemplate = STAFF_TEMPLATES.find(t => t.role === 'Regional Manager');
        if (rmTemplate) {
          const rm = generateStaffMember(rmTemplate);
          updated.staff = [...updated.staff, rm];
          updated.hasRegionalManager = true;
          newLog.push({ day: updated.day, text: `${rm.name} hired as Regional Manager! All locations now coordinated.`, type: 'positive' });
        }
      }

      // Save to decision history
      updated.decisionHistory = [...(updated.decisionHistory || []), {
        id: decision.id,
        day: updated.day,
        title: decision.title,
        chosenOption: chosenOption.id,
        chosenLabel: chosenOption.label,
        chosenIcon: chosenOption.icon,
        consequence: chosenOption.consequence,
      }];

      updated.log = newLog.slice(-100);
      return updated;
    });

    // Clear the pending decision and restore speed
    setPendingDecision(null);
    setGameState(prev => ({ ...prev, speed: speedBeforeDecision.current || 1 }));
  }, [diff]);

  // Pause game when a decision triggers
  useEffect(() => {
    if (pendingDecision) {
      speedBeforeDecision.current = gameState.speed;
      setGameState(prev => ({ ...prev, speed: 0 }));
    }
  }, [pendingDecision]);

  // Patient animation system
  const advanceDay = useCallback(() => {
    setGameState(prev => {
      // Guard: stop processing if season is over or bankrupt
      const seasonDone = prev.day >= (prev.gameDuration || diff.gameDuration);
      const bankrupt = prev.cash < diff.overdraftLimit;
      if (seasonDone || bankrupt) return prev;

      const s = calculateDailyStats(prev);
      const newLog = [...prev.log];
      let cashDelta = s.dailyProfit;
      let repDelta = s.reputationChange;
      let patientDelta = 0;
      let cleanlinessChange = 0;
      let relationshipChanges = {};
      let moraleChangeFromBuildout = 0;
      let rentChange = 0;

      // Process training programs
      let updatedTraining = [...(prev.activeTraining || [])];
      let newCompletedTraining = [...(prev.completedTraining || [])];
      let trainingCompleteDays = { ...(prev.trainingCompleteDays || {}) };
      let trainingMoraleBoost = 0;
      let trainingSkillBoost = 0;
      let treatmentAcceptanceBoostDelta = 0;

      updatedTraining = updatedTraining.map(t => ({ ...t, daysLeft: t.daysLeft - 1 }));
      const justCompleted = updatedTraining.filter(t => t.daysLeft <= 0);
      updatedTraining = updatedTraining.filter(t => t.daysLeft > 0);

      justCompleted.forEach(completed => {
        const prog = TRAINING_PROGRAMS.find(p => p.id === completed.id);
        if (!prog) return;
        newCompletedTraining = [...newCompletedTraining.filter(id => id !== prog.id), prog.id];
        trainingCompleteDays[prog.id] = prev.day;
        newLog.push({ day: prev.day, text: `Training completed: ${prog.name}! Your team is stronger.`, type: 'positive' });
        if (prog.moraleBoost) trainingMoraleBoost += prog.moraleBoost;
        if (prog.skillBoost) trainingSkillBoost += prog.skillBoost;
        if (prog.cleanlinessBoost) cleanlinessChange += prog.cleanlinessBoost;
        if (prog.satisfactionBoost) repDelta += (prog.reputationBoost || 0);
        if (prog.treatmentAcceptanceBoost) {
          treatmentAcceptanceBoostDelta += prog.treatmentAcceptanceBoost;
          newLog.push({ day: prev.day, text: `Treatment acceptance improved by +${Math.round(prog.treatmentAcceptanceBoost * 100)}%! Your team closes more cases now.`, type: 'positive' });
        }
      });

      // Active training buffs (completed within last 60 days)
      const hasRecentTeamBuilding = newCompletedTraining.includes('team_building') &&
        prev.day - (trainingCompleteDays['team_building'] || 0) < 60;
      const hasRecentLeadership = newCompletedTraining.includes('leadership') &&
        prev.day - (trainingCompleteDays['leadership'] || 0) < 90;

      // Process consultant buffs (decrement days)
      let updatedConsultantBuffs = (prev.activeConsultantBuffs || [])
        .map(b => ({ ...b, daysLeft: b.daysLeft - 1 }))
        .filter(b => b.daysLeft > 0);

      // Consultant ongoing effects
      const hasEfficiencyBuff = updatedConsultantBuffs.some(b => b.consultantId === 'efficiency_consultant');
      const hasTechBuff = updatedConsultantBuffs.some(b => b.consultantId === 'tech_consultant');

      // Cleanliness degradation
      cleanlinessChange -= 0.1; // base degradation
      cleanlinessChange -= s.actualPatients * 0.02; // per patient

      // Equipment cleanliness bonuses
      prev.equipment.forEach(eq => {
        const def = EQUIPMENT.find(e => e.id === eq);
        if (def?.cleanlinessBonus) cleanlinessChange += def.cleanlinessBonus * 0.01;
      });

      // Upgrade cleanliness bonuses
      (prev.officeUpgrades || []).forEach(id => {
        const upg = OFFICE_UPGRADES.find(u => u.id === id);
        if (upg?.cleanlinessBonus) cleanlinessChange += upg.cleanlinessBonus * 0.01;
      });

      // Buildout cleanliness bonuses
      (prev.builtOutRooms || []).forEach(id => {
        const item = BUILDOUT_ITEMS.find(b => b.id === id);
        if (item?.cleanlinessBonus) cleanlinessChange += item.cleanlinessBonus * 0.005;
      });

      // Break room morale bonus
      const hasBreakRoom = (prev.builtOutRooms || []).includes('break_room');
      const hasPrivateOffice = (prev.builtOutRooms || []).includes('private_office');
      if (hasBreakRoom) moraleChangeFromBuildout += 0.05;
      if (hasPrivateOffice) moraleChangeFromBuildout += 0.02;

      // Relationships drift toward 50
      const currentRels = { ...(prev.relationships || {}) };
      RELATIONSHIP_TYPES.forEach(relType => {
        const current = currentRels[relType.id] || 50;
        if (current > 52) {
          relationshipChanges[relType.id] = -0.05;
        } else if (current < 48) {
          relationshipChanges[relType.id] = 0.05;
        }
      });

      // ── Random events — filtered by difficulty toggles ──
      // In challenge mode, events come from a predetermined schedule so both players
      // face identical situations. The OUTCOMES still depend on each player's state
      // (staff morale, cash reserves, cleanliness, etc.) — that's where skill matters.
      let allEvents = [...RANDOM_EVENTS];
      if (diff.expertEventsEnabled) allEvents = [...allEvents, ...EXPERT_EVENTS];
      if (diff.hellMode) allEvents = [...allEvents, ...HELL_EVENTS];

      // Filter events based on difficulty toggles
      allEvents = allEvents.filter(event => {
        if (!diff.staffDramaEnabled && (event.id === 'staff_conflict' || event.id === 'staff_quits' || event.id === 'staff_burnout')) return false;
        if (!diff.equipBreakdownEnabled && (event.id === 'equipment_break' || event.id === 'equipment_major_break')) return false;
        if (!diff.insuranceAuditsEnabled && (event.id === 'insurance_audit' || event.id === 'insurance_clawback')) return false;
        if (!diff.competitorEventsEnabled && (event.id === 'new_competitor' || event.id === 'competitor_marketing' || event.id === 'staff_poached')) return false;
        return true;
      });

      // Determine which events fire today
      let eventsToFire = [];
      const schedule = challengeSchedule.current;

      if (schedule && schedule[prev.day]) {
        // CHALLENGE MODE: use predetermined events — identical for both players
        for (const scheduled of schedule[prev.day]) {
          if (scheduled.type === 'random_event') {
            const event = allEvents[scheduled.eventIndex % allEvents.length];
            if (event) eventsToFire.push(event);
          } else if (scheduled.type === 'expert_event') {
            const expertAll = [...EXPERT_EVENTS, ...(diff.hellMode ? HELL_EVENTS : [])];
            const event = expertAll[scheduled.eventIndex % expertAll.length];
            if (event) eventsToFire.push(event);
          } else if (scheduled.type === 'equipment_breakdown') {
            // Handled below in equipment breakdown section
          } else if (scheduled.type === 'rent_increase') {
            rentChange += (prev.rent || 0) * (scheduled.amount || 0.05);
            newLog.push({ day: prev.day, text: `Landlord raised rent by ${Math.round((scheduled.amount || 0.05) * 100)}%!`, type: 'negative' });
          }
        }
      } else if (!schedule) {
        // NORMAL MODE: random rolls determine events
        for (const event of allEvents) {
          const adjustedChance = event.chance * diff.eventFrequency;
          const conflictReduction = hasRecentTeamBuilding && (event.id === 'staff_conflict' || event.id === 'staff_quits') ? 0.5 : 1;
          const turnoverReduction = hasRecentLeadership && event.firesStaff ? 0.7 : 1;
          if (Math.random() > adjustedChance * conflictReduction * turnoverReduction) continue;
          eventsToFire.push(event);
          break; // max 1 random event per day in normal mode
        }
      }

      // Process the event(s) — both challenge and normal mode flow through here
      // Outcomes depend on player state: staff with high morale resist walkouts,
      // clean offices avoid violations, cash reserves absorb financial hits
      for (let event of eventsToFire.slice(0, 2)) { // max 2 events per day
        if (event.requiresStaff && prev.staff.length === 0) continue;

        const currentCleanliness = prev.cleanliness || 50;
        if (event.requiresLowCleanliness && currentCleanliness >= 40) continue;
        if (event.requiresHighCleanliness && currentCleanliness < 80) continue;

        if (event.requiresGoodRelationship) {
          const relVal = currentRels[event.requiresGoodRelationship] || 50;
          if (relVal < 65) continue;
        }

        if (event.requiresHighVolume) {
          if (s.effectiveCapacity > 0 && s.actualPatients / s.effectiveCapacity < 0.85) continue;
        }

        if (event.requiresHighGrowth) {
          if (prev.revenueHistory.length < 10) continue;
          const recentGrowth = (prev.revenueHistory[prev.revenueHistory.length - 1] - prev.revenueHistory[prev.revenueHistory.length - 10]) / Math.max(prev.revenueHistory[prev.revenueHistory.length - 10], 1);
          if (recentGrowth < 0.25) continue;
        }

        let msg = event.message;
        let targetStaff = null;
        if (event.requiresStaff) {
          const candidates = event.requiresLowMorale
            ? prev.staff.filter(s => s.morale < 40)
            : prev.staff;
          if (candidates.length === 0) continue;
          // In challenge mode, pick staff deterministically (first match) instead of random
          targetStaff = schedule ? candidates[0] : candidates[Math.floor(Math.random() * candidates.length)];
          msg = msg.replace('{staff}', targetStaff.name);
        }

        // ── Safety measures matter here ──
        // Training reduces conflict/turnover impact
        if (hasRecentTeamBuilding && (event.id === 'staff_conflict' || event.id === 'staff_quits')) {
          if (event.moraleEffect) {
            // Team building halves the morale damage
            event = { ...event, moraleEffect: Math.round(event.moraleEffect * 0.5) };
            msg += ' (Team building training softened the blow.)';
          }
        }
        if (hasRecentLeadership && event.firesStaff) {
          // Leadership training gives 50% chance to retain the staff member
          if (Math.random() < 0.5 || (schedule && prev.day % 2 === 0)) {
            msg += ' (Your leadership training convinced them to stay!)';
            event = { ...event, firesStaff: false };
          }
        }

        newLog.push({ day: prev.day, text: msg, type: event.type });
        if (event.cashEffect) cashDelta += event.cashEffect;
        if (event.reputationEffect) repDelta += event.reputationEffect;
        if (event.patientEffect) patientDelta += event.patientEffect;
        if (event.moraleEffect) {
          prev = {
            ...prev,
            staff: prev.staff.map(st => ({
              ...st,
              morale: Math.max(10, Math.min(100, st.morale + event.moraleEffect))
            }))
          };
        }
        if (event.firesStaff && targetStaff) {
          prev = { ...prev, staff: prev.staff.filter(s => s.id !== targetStaff.id) };
        }

        if (event.affectsRelationship) {
          const relId = event.affectsRelationship;
          if (event.type === 'negative') {
            relationshipChanges[relId] = (relationshipChanges[relId] || 0) - 3;
          } else if (event.type === 'positive') {
            relationshipChanges[relId] = (relationshipChanges[relId] || 0) + 3;
          }
        }

        if (event.rentIncrease) {
          rentChange += (prev.rent || 0) * event.rentIncrease;
        }

        if (event.type === 'positive' || event.cashEffect < -3000 || event.firesStaff) {
          setEventPopup({ message: msg, type: event.type });
          setTimeout(() => setEventPopup(null), 3000);
        }
      }

      // Low cleanliness triggers
      const newCleanliness = Math.max(0, Math.min(100, (prev.cleanliness || 50) + cleanlinessChange));
      if (newCleanliness < 25 && Math.random() < 0.05) {
        newLog.push({ day: prev.day, text: 'Patients are complaining about the office cleanliness!', type: 'negative' });
        repDelta -= 0.1;
        patientDelta -= 2;
      }
      if (newCleanliness < 15 && Math.random() < 0.03) {
        newLog.push({ day: prev.day, text: 'Health violation warning! Your office is below cleanliness standards.', type: 'negative' });
        cashDelta -= 1500;
        repDelta -= 0.2;
      }

      // Cash spiral warnings — things get worse fast when you're bleeding money
      // (Turned OFF for beginner — they still go bankrupt but without the escalating consequences)
      if (prev.cash < 0 && prev.cash > -20000) {
        if (prev.day % 7 === 0) newLog.push({ day: prev.day, text: 'WARNING: Cash is negative! Creditors are calling. Cut costs or find revenue NOW.', type: 'negative' });
      }
      if (diff.cashSpiralEnabled && prev.cash < -20000) {
        // Staff morale drops when they hear the practice is in trouble
        moraleChangeFromBuildout -= 0.3;
        if (prev.day % 5 === 0) newLog.push({ day: prev.day, text: 'CRITICAL: Staff are hearing rumors about financial trouble. Morale dropping.', type: 'negative' });
        // Suppliers start charging more
        if (Math.random() < 0.1) {
          cashDelta -= 2000;
          newLog.push({ day: prev.day, text: 'Suppliers demanding cash-on-delivery. Extra $2,000 in rush charges.', type: 'negative' });
        }
      }
      if (diff.cashSpiralEnabled && prev.cash < -50000 && Math.random() < 0.05) {
        // Staff may walk out
        const availableStaff = prev.staff.filter(s => s.morale < 40);
        if (availableStaff.length > 0) {
          const leaver = availableStaff[Math.floor(Math.random() * availableStaff.length)];
          newLog.push({ day: prev.day, text: `${leaver.name} quit! "I haven't been paid in weeks. I'm done."`, type: 'negative' });
          prev = { ...prev, staff: prev.staff.filter(s => s.id !== leaver.id), totalStaffQuit: (prev.totalStaffQuit || 0) + 1 };
        }
      }

      // Equipment breakdown decisions (creates operational pressure) — OFF for beginner
      // In challenge mode, breakdowns come from the schedule. In normal mode, random roll.
      const breakdownToday = schedule
        ? (schedule[prev.day] || []).some(e => e.type === 'equipment_breakdown')
        : Math.random() < 0.02 * diff.eventFrequency;
      if (diff.equipBreakdownEnabled && breakdownToday) {
        const equipTechRel = prev.relationships?.equipment_tech || 50;
        const supplyRepRel = prev.relationships?.supply_rep || 50;

        // All breakable equipment — chairs, compressors, pumps, diagnostics, everything
        const breakableEquip = prev.equipment.filter(eq => {
          const def = EQUIPMENT.find(e => e.id === eq);
          return def && def.breakdownChance && Math.random() < def.breakdownChance * 2;
        });

        if (breakableEquip.length > 0) {
          const brokenId = schedule ? breakableEquip[0] : breakableEquip[Math.floor(Math.random() * breakableEquip.length)];
          const def = EQUIPMENT.find(e => e.id === brokenId);
          const repairCost = Math.round(def.cost * 0.15);
          const isCritical = def.criticalEquipment; // compressor or vacuum pump

          // Equipment rep relationship determines outcome
          if (equipTechRel > 75 && Math.random() < 0.4) {
            // Great relationship = sometimes free fix with fun narrative
            const freeFixStories = [
              `${def.name} started acting up, but luckily your equipment rep owed you one from that golf game last week — ran out and fixed it for FREE!`,
              `${def.name} went down, but your equipment tech happened to be in the area and swung by — no charge. "You always take care of me," he said.`,
              `${def.name} broke mid-morning, but one call to your equipment rep and he was here in 20 minutes. Free repair — perks of a good relationship.`,
              `The ${def.name.toLowerCase()} made a terrible noise. Your equipment guy picked up on the first ring. "I'll be there in 15." No bill. That's what relationships are for.`,
            ];
            newLog.push({ day: prev.day, text: freeFixStories[prev.day % freeFixStories.length], type: 'positive' });
            if (isCritical) patientDelta -= 1; // minor disruption even with quick fix
          } else if (equipTechRel > 60) {
            // Good relationship = discounted fix
            const actualCost = Math.round(repairCost * 0.6);
            newLog.push({ day: prev.day, text: `${def.name} needs repair! Cost: $${actualCost.toLocaleString()} (good tech relationship = 40% off).${isCritical ? ' PRACTICE STOPPED until fixed.' : ''}`, type: 'negative' });
            cashDelta -= actualCost;
            patientDelta -= isCritical ? (Math.floor(Math.random() * 3) + 3) : (Math.floor(Math.random() * 2) + 1);
          } else {
            // Bad/no relationship = full price, slow response, more patient loss
            const penaltyMult = equipTechRel < 30 ? 1.3 : 1.0; // bad relationship = price gouging
            const actualCost = Math.round(repairCost * penaltyMult);
            const badRepStories = isCritical ? [
              `${def.name} DIED. No relationship with an equipment tech means you're calling around begging for emergency service. $${actualCost.toLocaleString()} and half the day lost.`,
              `The ${def.name.toLowerCase()} quit working. You don't have a tech on speed dial so you're Googling repair services at 8am. $${actualCost.toLocaleString()} emergency call.`,
            ] : [
              `${def.name} needs repair! Cost: $${actualCost.toLocaleString()}. No tech relationship means full price and slow service.`,
            ];
            newLog.push({ day: prev.day, text: badRepStories[prev.day % badRepStories.length], type: 'negative' });
            cashDelta -= actualCost;
            patientDelta -= isCritical ? (Math.floor(Math.random() * 4) + 4) : (Math.floor(Math.random() * 3) + 1);
          }
        }
      }

      // Supply expense creep warning (every 60 days, check if supplies are getting out of control)
      if (prev.day % 60 === 0 && prev.day > 0) {
        const supplyRel = prev.relationships?.supply_rep || 50;
        if (supplyRel < 40) {
          newLog.push({ day: prev.day, text: `Supply costs are creeping up! Without a good supply rep relationship, nobody is negotiating your prices. Gloves, composites, impression material — it all adds up. Your cost per patient is above benchmark.`, type: 'warning' });
        } else if (supplyRel > 70) {
          newLog.push({ day: prev.day, text: `Your supply rep just locked in bulk pricing for the quarter. Good relationships = better margins on consumables.`, type: 'positive' });
        }
      }

      // Insurance credentialing check — lose plans if reputation drops below minimum
      const currentRep = Math.max(0, Math.min(5, prev.reputation + repDelta));
      let updatedInsurance = [...(prev.acceptedInsurance || [])];
      const droppedPlans = [];
      updatedInsurance = updatedInsurance.filter(id => {
        const plan = INSURANCE_PLANS.find(p => p.id === id);
        if (plan && plan.minReputation && currentRep < plan.minReputation - 0.2) {
          droppedPlans.push(plan.name);
          return false;
        }
        return true;
      });
      if (droppedPlans.length > 0) {
        newLog.push({ day: prev.day, text: `Lost credentialing: ${droppedPlans.join(', ')}. Your reputation dropped too low to keep these plans.`, type: 'negative' });
      }

      // Patient growth — SLOW for new practices, modified by difficulty
      const growthBonus = diff.patientGrowthBonus;
      const hasActiveMarketing = (prev.activeMarketing || []).length > 0;
      if (prev.patients < 10) {
        if (hasActiveMarketing && s.actualPatients > 0 && Math.random() < 0.15 * growthBonus) patientDelta += 1;
      } else if (prev.patients < 50) {
        if (prev.reputation > 3.5 && Math.random() < 0.3 * growthBonus) patientDelta += 1;
        if (hasActiveMarketing && Math.random() < 0.3 * growthBonus) patientDelta += 1;
      } else if (prev.patients < 150) {
        if (prev.reputation > 3.5) patientDelta += Math.floor(Math.random() * 2 * growthBonus);
        if (hasActiveMarketing) patientDelta += Math.floor(Math.random() * 2 * growthBonus);
      } else {
        if (prev.reputation > 3.5) patientDelta += Math.floor(Math.random() * 3 * growthBonus);
        else if (prev.reputation < 2.5) patientDelta -= Math.floor(Math.random() * 3);
      }

      // ── ASSOCIATE DAILY PROCESSING (before morale update so changes persist) ──
      const associates = prev.staff.filter(st => st.isAssociate);
      if (associates.length > 0) {
        let updatedStaffForAssoc = [...prev.staff];
        for (const assoc of associates) {
          const idx = updatedStaffForAssoc.findIndex(st => st.id === assoc.id);
          if (idx === -1) continue;
          const a = { ...updatedStaffForAssoc[idx] };
          a.loyalty = updateAssociateLoyalty(a, prev);
          a.flightRisk = computeFlightRisk(a.loyalty);
          const providerCount = prev.staff.filter(st => st.canSeePatients).length;
          const dailyProd = providerCount > 0 ? Math.round(s.dailyRevenue / providerCount) : 0;
          a.production = (a.production || 0) + dailyProd;
          a.productionLast30 = (a.productionLast30 || 0) * 0.97 + dailyProd;
          const attachGrowth = Math.floor((s.actualPatients || 0) * 0.03);
          a.patientAttachment = Math.min((a.patientAttachment || 0) + attachGrowth, Math.floor(prev.patients * 0.3));
          if (a.flightRisk === 'high' && prev.day % 14 === 0) {
            newLog.push({ day: prev.day, text: `Dr. ${a.name} seems restless. Taking long lunches, making calls. (Flight risk: HIGH)`, type: 'warning' });
          }
          if (a.flightRisk === 'critical' && prev.day % 7 === 0) {
            newLog.push({ day: prev.day, text: `ALERT: Dr. ${a.name} was seen visiting a real estate office. They may be planning to leave!`, type: 'negative' });
          }
          if (a.flightRisk === 'critical' && Math.random() < 0.02) {
            const dep = associateDeparture(prev.patients, a);
            newLog.push({ day: prev.day, text: dep.message, type: 'negative' });
            patientDelta += -dep.patientsLost;
            repDelta += dep.reputationHit;
            updatedStaffForAssoc = updatedStaffForAssoc.filter(st => st.id !== a.id);
            updatedStaffForAssoc = updatedStaffForAssoc.map(st => ({ ...st, morale: Math.max(10, st.morale + dep.moraleHit) }));
            setEventPopup({ message: dep.message, type: 'negative' });
            setTimeout(() => setEventPopup(null), 4000);
            continue;
          }
          if (a.daysEmployed > 270 && a.productionLast30 > 40000 && a.loyalty < 70 && !a.wantsPartnership) {
            a.wantsPartnership = true;
            newLog.push({ day: prev.day, text: `Dr. ${a.name} wants to discuss a partnership or buy-in.`, type: 'warning' });
          }
          updatedStaffForAssoc[idx] = a;
        }
        prev = { ...prev, staff: updatedStaffForAssoc };
      }

      // Staff morale changes (training boosts applied)
      const updatedStaff = prev.staff.map(s => ({
        ...s,
        daysEmployed: s.daysEmployed + 1,
        skill: Math.min(100, s.skill + (trainingSkillBoost > 0 ? trainingSkillBoost * 0.1 : 0)),
        morale: Math.max(10, Math.min(100,
          s.morale
          + (s.attitude > 60 ? 0.1 : -0.1)
          + (prev.cash < 0 ? -0.5 : 0)
          + moraleChangeFromBuildout
          + (trainingMoraleBoost > 0 ? trainingMoraleBoost * 0.1 : 0)
        )),
      }));

      // Apply relationship changes
      const updatedRelationships = { ...currentRels };
      Object.entries(relationshipChanges).forEach(([relId, change]) => {
        updatedRelationships[relId] = Math.max(0, Math.min(100, (updatedRelationships[relId] || 50) + change));
      });

      // Key Decision check — pause the game for strategic choices
      const diffOrder = ['beginner', 'intermediate', 'expert', 'hell'];
      const diffLevel = diffOrder.indexOf(diff.id);
      const triggered = prev.triggeredDecisions || [];
      for (const decision of KEY_DECISIONS) {
        if (triggered.includes(decision.id)) continue; // already triggered
        const minLevel = diffOrder.indexOf(decision.minDifficulty || 'beginner');
        if (diffLevel < minLevel) continue; // difficulty too low
        if (prev.day < decision.day) continue; // not time yet
        // Check within a window (±10 days) so decisions don't all stack on exact days
        if (prev.day > decision.day + 10) continue;
        if (decision.condition && !decision.condition(prev)) continue;
        // Trigger this decision — pause the game (attach gameState for dynamic descriptions)
        setPendingDecision({ ...decision, _gameState: prev });
        // Mark as triggered so it doesn't repeat
        prev = { ...prev, triggeredDecisions: [...triggered, decision.id] };
        break; // only one decision per day
      }

      // ── MULTI-LOCATION DAILY PROCESSING ──
      let updatedLocations = [...(prev.locations || [])];
      if (updatedLocations.length > 0) {
        const locCount = 1 + updatedLocations.length;
        const synergy = getSynergyMultipliers(locCount);
        const rmPenalty = getRegionalManagerPenalty(locCount, prev.hasRegionalManager);

        updatedLocations = updatedLocations.map(loc => {
          loc = { ...loc };
          // Buildout countdown
          if (loc.buildingDaysLeft && loc.buildingDaysLeft > 0) {
            loc.buildingDaysLeft -= 1;
            cashDelta -= Math.round(loc.rent / 30); // rent due during construction
            if (loc.buildingDaysLeft <= 0) {
              newLog.push({ day: prev.day, text: `${loc.name} construction complete! Office is now OPEN.`, type: 'positive' });
            }
            return loc;
          }
          // Calculate this location's daily stats
          const locVirtual = {
            equipment: loc.equipment || [], staff: loc.staff || [],
            reputation: loc.reputation || 3.0, patients: loc.patients || 0,
            activeMarketing: loc.activeMarketing || [], acceptedInsurance: loc.acceptedInsurance || [],
            officeUpgrades: loc.officeUpgrades || [], relationships: loc.relationships || {},
            cleanliness: loc.cleanliness || 50, builtOutRooms: loc.builtOutRooms || [],
            sqft: loc.sqft, maxOps: loc.maxOps, rent: loc.rent,
            debt: 0, interestRate: 0, cash: prev.cash,
            activeTraining: [], completedTraining: [], trainingCompleteDays: {},
            activeConsultantBuffs: [],
          };
          const locStats = calculateDailyStats(locVirtual);
          // Apply synergy
          let locProfit = locStats.dailyProfit;
          locProfit += Math.round(locStats.dailySupplies * (1 - synergy.supplies)); // savings
          locProfit += Math.round(locStats.dailyMaintenance * (1 - synergy.maintenance));
          // RM penalty
          if (rmPenalty) {
            locProfit = Math.round(locProfit * rmPenalty.efficiencyPenalty);
            loc.staff = (loc.staff || []).map(st => ({
              ...st, morale: Math.max(10, st.morale + rmPenalty.moralePenalty),
            }));
          }
          cashDelta += locProfit;
          // Patient growth for this location
          const hasLocMarketing = (loc.activeMarketing || []).length > 0;
          if (hasLocMarketing && loc.patients < 200) {
            const growthChance = 0.08 * diff.patientGrowthBonus;
            if (Math.random() < growthChance) loc.patients = (loc.patients || 0) + 1;
          }
          // Reputation drift
          if (locStats.actualPatients > 0) {
            loc.reputation = Math.max(0, Math.min(5, (loc.reputation || 3) + locStats.reputationChange));
          }
          // Cleanliness drift
          loc.cleanliness = Math.max(0, Math.min(100, (loc.cleanliness || 50) - 0.1));
          // Revenue history
          loc.revenueHistory = [...(loc.revenueHistory || []), locStats.dailyRevenue].slice(-90);
          return loc;
        });
        prev = { ...prev, locations: updatedLocations, locationCount: 1 + updatedLocations.length };

        // Multi-location events
        for (const evt of MULTI_LOCATION_EVENTS) {
          if (Math.random() > (evt.chance || 0.02)) continue;
          if (evt.condition && !evt.condition(prev)) continue;
          newLog.push({ day: prev.day, text: evt.message, type: evt.type });
          if (evt.cashEffect) cashDelta += evt.cashEffect;
          if (evt.reputationEffect) repDelta += evt.reputationEffect;
          if (evt.moraleEffect) {
            prev = { ...prev, staff: prev.staff.map(st => ({ ...st, morale: Math.max(10, Math.min(100, st.morale + evt.moraleEffect)) })) };
          }
          break; // max 1 multi-loc event per day
        }
      }

      // Monthly summary + MANDATORY LOAN PAYMENT
      if (prev.day % 30 === 0) {
        const monthNum = prev.day / 30;
        const thisMonthRev = s.dailyRevenue * 30;
        prev = {
          ...prev,
          bestMonthRevenue: Math.max(prev.bestMonthRevenue || 0, thisMonthRev),
          worstMonthRevenue: Math.min(prev.worstMonthRevenue ?? thisMonthRev, thisMonthRev),
        };
        newLog.push({
          day: prev.day,
          text: `═══ MONTH ${monthNum} ═══ Rev: $${thisMonthRev.toLocaleString()}/mo | Patients: ${prev.patients + patientDelta} | Rating: ${(prev.reputation + repDelta).toFixed(1)}⭐ | Clean: ${Math.round(newCleanliness)}`,
          type: 'milestone',
        });

        // Mandatory monthly loan payment
        if (prev.debt > 0) {
          const requiredPayment = Math.round(prev.debt * MONTHLY_LOAN_PAYMENT_RATE);
          const availableCash = prev.cash + cashDelta;
          if (availableCash >= requiredPayment) {
            // Full payment
            cashDelta -= requiredPayment;
            prev = { ...prev, debt: prev.debt - requiredPayment, lastLoanPaymentDay: prev.day };
            newLog.push({ day: prev.day, text: `Monthly loan payment: $${requiredPayment.toLocaleString()} (principal reduction). Remaining debt: $${prev.debt.toLocaleString()}`, type: 'info' });
          } else {
            // Partial payment + penalty
            const partialPayment = Math.max(0, availableCash);
            const shortfall = requiredPayment - partialPayment;
            const penalty = Math.round(shortfall * LATE_PAYMENT_PENALTY_RATE);
            cashDelta -= partialPayment;
            prev = {
              ...prev,
              debt: prev.debt - partialPayment + penalty,
              lastLoanPaymentDay: prev.day,
              missedPayments: (prev.missedPayments || 0) + 1,
            };
            repDelta -= 0.1; // reputation hit for missed payment
            newLog.push({ day: prev.day, text: `MISSED LOAN PAYMENT! Could only pay $${partialPayment.toLocaleString()} of $${requiredPayment.toLocaleString()} due. Penalty: $${penalty.toLocaleString()} added to debt. Reputation damaged.`, type: 'negative' });
            if ((prev.missedPayments || 0) >= 2) {
              newLog.push({ day: prev.day, text: `WARNING: ${prev.missedPayments} consecutive missed payments. The bank is watching closely. Further defaults may trigger loan acceleration.`, type: 'negative' });
            }
          }
        }
      }

      const newRevHistory = [...prev.revenueHistory, s.dailyRevenue].slice(-90);

      return {
        ...prev,
        day: prev.day + 1,
        cash: prev.cash + cashDelta,
        reputation: Math.max(0, Math.min(5, prev.reputation + repDelta)),
        patients: Math.max(0, prev.patients + patientDelta),
        staff: updatedStaff,
        log: newLog.slice(-100),
        revenueHistory: newRevHistory,
        cleanliness: newCleanliness,
        relationships: updatedRelationships,
        rent: (prev.rent || 0) + rentChange,
        acceptedInsurance: updatedInsurance,
        activeTraining: updatedTraining,
        completedTraining: newCompletedTraining,
        trainingCompleteDays: trainingCompleteDays,
        activeConsultantBuffs: updatedConsultantBuffs,
        treatmentAcceptanceBonus: Math.min(0.24, (prev.treatmentAcceptanceBonus || 0) + treatmentAcceptanceBoostDelta),
        // Cumulative tracking for scorecard
        totalRevenue: (prev.totalRevenue || 0) + Math.max(0, s.dailyRevenue),
        totalExpenses: (prev.totalExpenses || 0) + s.totalDailyCosts,
        totalMarketingSpend: (prev.totalMarketingSpend || 0) + (s.dailyMarketing || 0),
        totalPatientsServed: (prev.totalPatientsServed || 0) + s.actualPatients,
        peakPatients: Math.max(prev.peakPatients || 0, prev.patients + patientDelta),
        peakCash: Math.max(prev.peakCash || 0, prev.cash + cashDelta),
        worstCash: Math.min(prev.worstCash ?? prev.cash, prev.cash + cashDelta),
      };
    });

    // Generate animated patients
    setGameState(prev => {
      const s = calculateDailyStats(prev);
      const chairs = prev.equipment.filter(eq => {
        const def = EQUIPMENT.find(e => e.id === eq);
        return def && def.patientsPerDay > 0;
      });

      const newPatients = [];
      for (let i = 0; i < Math.min(s.actualPatients, 6); i++) {
        const proc = pickProcedure(prev.equipment, prev.staff);
        const provider = prev.staff.find(st => st.canSeePatients);
        newPatients.push({
          id: Date.now() + Math.random(),
          name: generatePatientName(),
          stage: 'arriving',
          chairIndex: i % Math.max(chairs.length, 1),
          procedure: proc.name,
          revenue: proc.revenue,
          provider: provider?.id,
          satisfied: Math.random() < s.satisfactionScore + 0.2,
          delay: i * 0.3,
        });
      }
      setActivePatients(newPatients);

      // Animate through stages
      if (newPatients.length > 0) {
        setTimeout(() => setActivePatients(p => p.map(pat => ({ ...pat, stage: 'waiting' }))), 400);
        setTimeout(() => setActivePatients(p => p.map(pat => ({ ...pat, stage: 'treating' }))), 1200);
        setTimeout(() => setActivePatients(p => p.map(pat => ({ ...pat, stage: 'leaving' }))), 2500);
        setTimeout(() => setActivePatients([]), 3500);
      }

      return prev;
    });
  }, []);

  useEffect(() => {
    if (gameState.speed === 0) return;
    const speeds = { 1: 4000, 2: 2000, 3: 800, 4: 200 };
    const interval = setInterval(advanceDay, speeds[gameState.speed] || 4000);
    return () => clearInterval(interval);
  }, [gameState.speed, advanceDay]);

  const cashColor = gameState.cash > 100000 ? '#22c55e' : gameState.cash > 0 ? '#eab308' : '#ef4444';
  const isGameOver = gameState.cash < diff.overdraftLimit;
  const isSeasonComplete = gameState.day >= (gameState.gameDuration || diff.gameDuration);
  const score = calculateScore(gameState, stats);
  const savedEndRef = useRef(false);

  // Cash warning spiral
  useEffect(() => {
    if (gameState.cash < 0 && gameState.cash > diff.overdraftLimit && gameState.speed > 0) {
      // Don't stop, but log warnings
      if (gameState.cash < -10000 && !gameState._warnedCritical) {
        setGameState(prev => ({
          ...prev,
          _warnedCritical: true,
          log: [...prev.log, { day: prev.day, text: 'CRITICAL: Cash is deeply negative! You are hemorrhaging money. Cut costs NOW or close the doors.', type: 'negative' }],
        }));
      }
    }
  }, [gameState.cash]);

  // Stop game when season ends or goes bankrupt
  useEffect(() => {
    if ((isGameOver || isSeasonComplete) && gameState.speed !== 0) {
      console.log('[DENTAL TYCOON] Game ended!', { isGameOver, isSeasonComplete, day: gameState.day, cash: gameState.cash, gameDuration: gameState.gameDuration || diff.gameDuration });
      setGameState(prev => ({ ...prev, speed: 0 }));
    }
  }, [isGameOver, isSeasonComplete]);

  // Auto-save to leaderboard (and challenge) on game end
  useEffect(() => {
    if ((isGameOver || isSeasonComplete) && score && !savedEndRef.current) {
      savedEndRef.current = true;
      const resultData = {
        overallScore: score.overall,
        overallGrade: score.overallGrade,
        profitMargin: score.metrics.profitMargin,
        overheadRatio: score.metrics.overheadRatio,
        monthlyRevenue: score.metrics.monthlyRevenue,
        monthlyProfit: score.metrics.monthlyProfit,
        finalCash: gameState.cash,
        finalPatients: gameState.patients,
        finalReputation: gameState.reputation,
        staffCount: gameState.staff.length,
        insuranceCount: (gameState.acceptedInsurance || []).length,
        day: gameState.day,
        patients: gameState.patients,
        difficulty: diff.name,
        outcome: isGameOver ? 'Bankrupt' : 'Completed',
        feedback: generateSeasonFeedback(gameState, stats, diff),
        decisions: gameState.decisionHistory || [],
      };
      saveToLeaderboard(resultData);
      // Save to challenge if in challenge mode
      if (challengeData?.code) {
        saveChallenge(challengeData.code, challengeData.playerName, resultData);
      }
    }
  }, [isGameOver, isSeasonComplete]);

  // ═══════════════════════════════════════════════════════
  // END-OF-GAME SCREEN — MUST RENDER WHEN SEASON ENDS
  // ═══════════════════════════════════════════════════════
  const isDsoSold = gameState.endReason && gameState.endReason.includes('Sold to DSO');
  const isEndScreen = isSeasonComplete || isGameOver;

  // DEBUG: Log every render cycle so we can trace the issue
  if (gameState.day > 1) {
    console.log('[DT] render:', { day: gameState.day, gameDuration: gameState.gameDuration || diff.gameDuration, cash: gameState.cash, overdraft: diff.overdraftLimit, isSeasonComplete, isGameOver, isEndScreen, speed: gameState.speed });
  }

  if (isEndScreen) {
    console.log('[DT] *** END SCREEN RENDERING ***', { isGameOver, isSeasonComplete, isDsoSold, scoreAvailable: !!score, day: gameState.day });

    // SAFETY: wrap in try-catch so a calculation error doesn't blank the screen
    try {

    const isBankrupt = isGameOver;
    let feedback = [];
    try { feedback = generateSeasonFeedback(gameState, stats, diff); } catch (e) { console.error('[DT] feedback error:', e); }

    // SAFETY: If calculateScore returned null, create a default score object so the UI doesn't crash
    const safeScore = score || {
      overall: 0,
      overallGrade: 'N/A',
      overallColor: '#64748b',
      categories: {
        staffingHR: { score: 0, grade: 'N/A', color: '#64748b', label: 'Staffing & HR', detail: 'No data' },
        doctorMgmt: { score: 0, grade: 'N/A', color: '#64748b', label: 'Doctor Management', detail: 'No data' },
        training: { score: 0, grade: 'N/A', color: '#64748b', label: 'Training', detail: 'No data' },
        marketingGrowth: { score: 0, grade: 'N/A', color: '#64748b', label: 'Marketing & Growth', detail: 'No data' },
        financial: { score: 0, grade: 'N/A', color: '#64748b', label: 'Financial', detail: 'No data' },
        patientCare: { score: 0, grade: 'N/A', color: '#64748b', label: 'Patient Care', detail: 'No data' },
      },
      metrics: { monthlyRevenue: 0, monthlyCosts: 0, monthlyProfit: 0, profitMargin: 0, overheadRatio: 0 },
    };
    console.log('[DT] Score:', score ? 'calculated' : 'USING FALLBACK', safeScore.overall);

    const modeBoard = score ? getLeaderboardByMode(diff.name) : [];
    const rank = score ? modeBoard.findIndex(e => e.overallScore <= score.overall) : -1;
    const isNewHigh = score && (modeBoard.length === 0 || score.overall > (modeBoard[0]?.overallScore || 0));

    // Compute practice archetype based on play style
    const archetype = (() => {
      const cats = safeScore.categories;
      const fin = cats.financial?.score || 0;
      const mkt = cats.marketingGrowth?.score || 0;
      const staff = cats.staffingHR?.score || 0;
      const care = cats.patientCare?.score || 0;
      const train = cats.training?.score || 0;
      const doc = cats.doctorMgmt?.score || 0;
      if (safeScore.overall >= 850) return { name: 'Elite Practice', icon: '👑', desc: 'Top-tier management across every category. You\'d crush it in the real world.' };
      if (safeScore.overall >= 700 && fin >= 75) return { name: 'Profit Machine', icon: '💎', desc: 'Strong margins, lean operations. The banks love you.' };
      if (mkt >= 80 && care >= 70) return { name: 'Growth Engine', icon: '🚀', desc: 'Aggressive marketing paired with solid patient care. Classic expansion model.' };
      if (staff >= 80 && train >= 70) return { name: 'People-First Practice', icon: '🤝', desc: 'You invested in your team. Low turnover, high morale — the Costco of dentistry.' };
      if (care >= 85) return { name: 'Patient Champion', icon: '⭐', desc: '5-star care, loyal patients. Revenue follows reputation.' };
      if (doc >= 80 && staff >= 60) return { name: 'Clinical Powerhouse', icon: '🔬', desc: 'Elite providers, strong clinical outcomes. Specialists drive premium revenue.' };
      if (fin >= 70 && mkt < 40) return { name: 'Silent Earner', icon: '🤫', desc: 'Profitable but invisible. More marketing could have doubled your growth.' };
      if (mkt >= 70 && fin < 40) return { name: 'Money Pit', icon: '🕳️', desc: 'Patients everywhere, profit nowhere. You marketed before you had the systems to handle it.' };
      if (safeScore.overall >= 500) return { name: 'Solid Practice', icon: '🏥', desc: 'Middle of the pack. Some categories strong, others need work.' };
      if (isBankrupt) return { name: 'Cautionary Tale', icon: '📉', desc: 'Every bankrupt practice teaches a lesson. The question is whether you learn it.' };
      if (!score) return { name: 'Practice Owner', icon: '🦷', desc: 'You gave it a shot.' };
      return { name: 'Work in Progress', icon: '🔧', desc: 'Lots of room to grow. Focus on your weakest categories next run.' };
    })();

    // Key stats for the "by the numbers" section
    const keyStats = [
      { label: 'Days Survived', value: gameState.day, icon: '📅' },
      { label: 'Total Revenue', value: `$${(gameState.totalRevenue || 0).toLocaleString()}`, icon: '💵' },
      { label: 'Patients Served', value: (gameState.totalPatientsServed || 0).toLocaleString(), icon: '🧑‍🤝‍🧑' },
      { label: 'Staff Hired', value: gameState.totalHires || 0, icon: '📋' },
      { label: 'Staff Lost', value: (gameState.totalFires || 0) + (gameState.totalStaffQuit || 0), icon: '🚪' },
      { label: 'Peak Cash', value: `$${(gameState.peakCash || 0).toLocaleString()}`, icon: '📈' },
      { label: 'Worst Cash', value: `$${(gameState.worstCash || 0).toLocaleString()}`, icon: '📉' },
      { label: 'Peak Patients', value: gameState.peakPatients || 0, icon: '🏔️' },
      { label: 'Training Spend', value: `$${(gameState.totalTrainingSpend || 0).toLocaleString()}`, icon: '🎓' },
      { label: 'Marketing Spend', value: `$${(gameState.totalMarketingSpend || 0).toLocaleString()}`, icon: '📢' },
    ];

    return (
      <div className="game-over" style={{ background: isBankrupt
        ? 'linear-gradient(180deg, #1a0a0a 0%, #0a1628 30%)'
        : isDsoSold ? 'linear-gradient(180deg, #0a1628 0%, #1a2a3e 50%, #0a1628 100%)'
        : 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 40%, #0a1628 100%)',
        paddingBottom: '40px',
      }}>

        {/* ── HEADER: Outcome Banner ── */}
        {isBankrupt ? (
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>💀</div>
            <h1 style={{ color: '#ef4444', fontFamily: 'Fredoka One', fontSize: '2rem', margin: '0 0 4px' }}>PRACTICE CLOSED</h1>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Bankrupt on Day {gameState.day} of {gameState.gameDuration || diff.gameDuration}</p>
            <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>Final debt: ${Math.abs(gameState.cash).toLocaleString()}</p>
          </div>
        ) : isDsoSold ? (
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🏢</div>
            <h1 style={{ color: (gameState.dsoNetProceeds || 0) > 0 ? '#60a5fa' : '#ef4444', fontFamily: 'Fredoka One', fontSize: '2rem', margin: '0 0 4px' }}>PRACTICE SOLD</h1>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Sold to DSO on Day {gameState.day}</p>
            <div style={{ margin: '12px auto', maxWidth: '360px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <div style={{ padding: '8px', background: 'rgba(30,41,59,0.6)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: '#64748b' }}>Sale Price</div>
                <div style={{ fontSize: '1rem', color: '#22c55e', fontWeight: 'bold' }}>${(gameState.dsoSalePrice || 400000).toLocaleString()}</div>
              </div>
              <div style={{ padding: '8px', background: 'rgba(30,41,59,0.6)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: '#64748b' }}>Debt Paid</div>
                <div style={{ fontSize: '1rem', color: '#ef4444', fontWeight: 'bold' }}>-${(gameState.dsoDebtSettled || 0).toLocaleString()}</div>
              </div>
              <div style={{ padding: '8px', background: 'rgba(30,41,59,0.6)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '9px', color: '#64748b' }}>Net</div>
                <div style={{ fontSize: '1rem', color: (gameState.dsoNetProceeds || 0) > 0 ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                  {(gameState.dsoNetProceeds || 0) > 0 ? '+' : ''}${(gameState.dsoNetProceeds || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🏆</div>
            <h1 style={{ color: '#22c55e', fontFamily: 'Fredoka One', fontSize: '2rem', margin: '0 0 4px' }}>SEASON COMPLETE!</h1>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{diff.gameDuration} days of practice management complete</p>
          </div>
        )}

        <p style={{ color: '#475569', fontSize: '12px', textAlign: 'center', margin: '0 0 16px' }}>{diff.icon} {diff.name} Mode</p>

        {/* ── PRACTICE ARCHETYPE ── */}
        <div style={{ margin: '0 auto 16px', maxWidth: '450px', padding: '14px 18px', background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(167,139,250,0.08))', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '4px' }}>{archetype.icon}</div>
          <div style={{ fontSize: '16px', fontFamily: 'Fredoka One', color: '#e2e8f0', marginBottom: '4px' }}>{archetype.name}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>{archetype.desc}</div>
        </div>

        {/* ── BIG SCORE ── */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '4rem', fontFamily: 'Fredoka One', color: safeScore.overallColor, lineHeight: 1, textShadow: `0 0 40px ${safeScore.overallColor}33` }}>
              {safeScore.overall}
            </div>
            <div style={{ fontSize: '1rem', color: safeScore.overallColor, fontWeight: 600, marginTop: '2px' }}>/ 1000 — {safeScore.overallGrade}</div>
            {isNewHigh && (
              <div style={{ marginTop: '8px', fontSize: '14px', fontFamily: 'Fredoka One', color: '#eab308', animation: 'pulse 1.5s ease-in-out infinite' }}>
                New High Score for {diff.name}!
              </div>
            )}
            <p style={{ color: '#64748b', fontSize: '11px', margin: '4px 0 0' }}>
              Rank #{rank === -1 ? modeBoard.length + 1 : rank + 1} on {diff.name} leaderboard
            </p>
          </div>

        {/* ── CATEGORY BREAKDOWN ── */}
          <div style={{ margin: '0 auto 20px', maxWidth: '480px' }}>
            <h3 style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center', marginBottom: '10px' }}>Performance Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {Object.entries(safeScore.categories).map(([key, cat]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'rgba(30,41,59,0.5)', borderRadius: '8px', borderLeft: `3px solid ${cat.color}` }}>
                  <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{cat.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>{cat.name}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{cat.weight}% weight</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden', marginBottom: '3px' }}>
                      <div style={{ width: `${cat.score}%`, height: '100%', background: `linear-gradient(90deg, ${cat.color}88, ${cat.color})`, borderRadius: '3px', transition: 'width 1s ease-out' }} />
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{cat.value}</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '36px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: cat.color, fontFamily: 'Fredoka One' }}>{cat.grade}</div>
                    <div style={{ fontSize: '9px', color: '#64748b' }}>{cat.score}/100</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        {/* ── FINANCIAL DASHBOARD ── */}
        <div style={{ margin: '0 auto 20px', maxWidth: '480px' }}>
          <h3 style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center', marginBottom: '10px' }}>Financial Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
            <div style={{ padding: '10px', background: 'rgba(30,41,59,0.6)', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Final Cash</div>
              <div style={{ fontSize: '1.1rem', fontFamily: 'Fredoka One', color: gameState.cash > 0 ? '#22c55e' : '#ef4444', marginTop: '2px' }}>${gameState.cash.toLocaleString()}</div>
            </div>
            <div style={{ padding: '10px', background: 'rgba(30,41,59,0.6)', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Profit</div>
                  <div style={{ fontSize: '1.1rem', fontFamily: 'Fredoka One', color: safeScore.metrics.monthlyProfit >= 0 ? '#22c55e' : '#ef4444', marginTop: '2px' }}>${Math.round(safeScore.metrics.monthlyProfit).toLocaleString()}</div>
                </div>
                <div style={{ padding: '10px', background: 'rgba(30,41,59,0.6)', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Overhead</div>
                  <div style={{ fontSize: '1.1rem', fontFamily: 'Fredoka One', color: safeScore.metrics.overheadRatio < 65 ? '#22c55e' : safeScore.metrics.overheadRatio < 75 ? '#eab308' : '#ef4444', marginTop: '2px' }}>{safeScore.metrics.overheadRatio}%</div>
                </div>
            <div style={{ padding: '10px', background: 'rgba(30,41,59,0.6)', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reputation</div>
              <div style={{ fontSize: '1.1rem', fontFamily: 'Fredoka One', color: gameState.reputation >= 4 ? '#22c55e' : gameState.reputation >= 3 ? '#eab308' : '#ef4444', marginTop: '2px' }}>{gameState.reputation.toFixed(1)} ⭐</div>
            </div>
            <div style={{ padding: '10px', background: 'rgba(30,41,59,0.6)', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Patients</div>
              <div style={{ fontSize: '1.1rem', fontFamily: 'Fredoka One', color: '#cbd5e1', marginTop: '2px' }}>{gameState.patients}</div>
            </div>
            <div style={{ padding: '10px', background: 'rgba(30,41,59,0.6)', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Team Size</div>
              <div style={{ fontSize: '1.1rem', fontFamily: 'Fredoka One', color: '#cbd5e1', marginTop: '2px' }}>{gameState.staff.length}</div>
            </div>
          </div>
        </div>

        {/* ── BY THE NUMBERS ── */}
        <div style={{ margin: '0 auto 20px', maxWidth: '480px' }}>
          <h3 style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center', marginBottom: '10px' }}>By The Numbers</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
            {keyStats.map((stat, i) => (
              <div key={i} style={{ padding: '8px 4px', background: 'rgba(30,41,59,0.4)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', marginBottom: '2px' }}>{stat.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#e2e8f0' }}>{stat.value}</div>
                <div style={{ fontSize: '8px', color: '#64748b', lineHeight: 1.2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEASON REPORT CARD (Strengths, Weaknesses, Tips) ── */}
        {feedback.length > 0 && (
          <div style={{ margin: '0 auto 20px', maxWidth: '480px' }}>
            <h3 style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center', marginBottom: '10px' }}>
              {isBankrupt ? 'What Went Wrong' : 'Season Report Card'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {feedback.map((fb, i) => (
                <div key={i} style={{
                  padding: '10px 12px', background: 'rgba(30,41,59,0.4)', borderRadius: '8px',
                  borderLeft: `3px solid ${fb.type === 'strength' ? '#22c55e' : fb.type === 'weakness' ? '#ef4444' : '#eab308'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                      background: fb.type === 'strength' ? 'rgba(34,197,94,0.15)' : fb.type === 'weakness' ? 'rgba(239,68,68,0.15)' : 'rgba(234,179,8,0.15)',
                      color: fb.type === 'strength' ? '#22c55e' : fb.type === 'weakness' ? '#ef4444' : '#eab308',
                    }}>
                      {fb.type === 'strength' ? 'Strength' : fb.type === 'weakness' ? 'Needs Work' : 'Pro Tip'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>{fb.area}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.5 }}>{fb.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── KEY DECISIONS REPLAY ── */}
        {gameState.decisionHistory && gameState.decisionHistory.length > 0 && (
          <div style={{ margin: '0 auto 20px', maxWidth: '480px' }}>
            <h3 style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center', marginBottom: '10px' }}>Key Decisions</h3>
            {gameState.decisionHistory.map((d, i) => (
              <div key={i} style={{ padding: '10px 12px', marginBottom: '5px', background: 'rgba(30,41,59,0.5)', borderRadius: '8px', borderLeft: '3px solid #eab308' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#e2e8f0' }}>{d.chosenIcon} {d.title}</span>
                  <span style={{ fontSize: '10px', color: '#475569', background: 'rgba(30,41,59,0.6)', padding: '2px 6px', borderRadius: '4px' }}>Day {d.day}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#3b82f6', marginBottom: '2px' }}>Chose: {d.chosenLabel}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>{d.consequence}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── CHALLENGE CODE ── */}
        {challengeData?.code && (
          <div style={{ margin: '0 auto 16px', maxWidth: '480px', padding: '14px', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#eab308', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Challenge Code</div>
            <div style={{ fontSize: '32px', fontFamily: 'monospace', color: '#eab308', fontWeight: 'bold', letterSpacing: '8px' }}>{challengeData.code}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Share this code — your friend plays the exact same season</div>
          </div>
        )}

        {/* ── PROFIT & LOSS STATEMENT ── */}
          <div style={{ margin: '0 auto 20px', maxWidth: '480px' }}>
            <h3 style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center', marginBottom: '10px' }}>Profit & Loss Statement</h3>
            <div style={{ background: 'rgba(30,41,59,0.5)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(148,163,184,0.1)' }}>
              {/* Revenue */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Revenue</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px' }}>
                  <span style={{ color: '#94a3b8' }}>Total Season Revenue</span>
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>${(gameState.totalRevenue || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px' }}>
                  <span style={{ color: '#94a3b8' }}>Monthly Run Rate</span>
                  <span style={{ color: '#22c55e' }}>${Math.round(safeScore.metrics.monthlyRevenue).toLocaleString()}/mo</span>
                </div>
              </div>
              <div style={{ height: '1px', background: 'rgba(148,163,184,0.15)', margin: '6px 0' }} />
              {/* Expenses */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Expenses</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px' }}>
                  <span style={{ color: '#94a3b8' }}>Total Season Expenses</span>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>-${(gameState.totalExpenses || 0).toLocaleString()}</span>
                </div>
                {(gameState.totalMarketingSpend || 0) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 12px', fontSize: '11px' }}>
                    <span style={{ color: '#64748b' }}>Marketing</span>
                    <span style={{ color: '#94a3b8' }}>-${(gameState.totalMarketingSpend || 0).toLocaleString()}</span>
                  </div>
                )}
                {(gameState.totalTrainingSpend || 0) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 12px', fontSize: '11px' }}>
                    <span style={{ color: '#64748b' }}>Training</span>
                    <span style={{ color: '#94a3b8' }}>-${(gameState.totalTrainingSpend || 0).toLocaleString()}</span>
                  </div>
                )}
                {(gameState.totalConsultantSpend || 0) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0 2px 12px', fontSize: '11px' }}>
                    <span style={{ color: '#64748b' }}>Consultants</span>
                    <span style={{ color: '#94a3b8' }}>-${(gameState.totalConsultantSpend || 0).toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '12px' }}>
                  <span style={{ color: '#94a3b8' }}>Overhead Ratio</span>
                  <span style={{ color: safeScore.metrics.overheadRatio < 65 ? '#22c55e' : safeScore.metrics.overheadRatio < 75 ? '#eab308' : '#ef4444' }}>{safeScore.metrics.overheadRatio}%</span>
                </div>
              </div>
              <div style={{ height: '2px', background: 'rgba(148,163,184,0.2)', margin: '6px 0' }} />
              {/* Net */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', fontWeight: 'bold' }}>
                <span style={{ color: '#e2e8f0' }}>Net Profit/Loss</span>
                <span style={{ color: ((gameState.totalRevenue || 0) - (gameState.totalExpenses || 0)) >= 0 ? '#22c55e' : '#ef4444', fontFamily: 'Fredoka One' }}>
                  {((gameState.totalRevenue || 0) - (gameState.totalExpenses || 0)) >= 0 ? '+' : ''}${((gameState.totalRevenue || 0) - (gameState.totalExpenses || 0)).toLocaleString()}
                </span>
              </div>
              {/* Visual bar */}
              {(gameState.totalRevenue || 0) > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '2px', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ flex: Math.max(1, ((gameState.totalRevenue || 0) - (gameState.totalExpenses || 0))), background: '#22c55e', borderRadius: '6px 0 0 6px' }} title="Profit" />
                    <div style={{ flex: Math.max(1, gameState.totalExpenses || 0), background: '#ef4444', borderRadius: '0 6px 6px 0' }} title="Expenses" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                    <span>Profit: {Math.round(((gameState.totalRevenue || 1) - (gameState.totalExpenses || 0)) / (gameState.totalRevenue || 1) * 100)}%</span>
                    <span>Expenses: {Math.round((gameState.totalExpenses || 0) / (gameState.totalRevenue || 1) * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        {/* ── RANK & SAVE CONFIRMATION ── */}
        <p style={{ color: '#475569', fontSize: '11px', textAlign: 'center', margin: '8px 0 16px' }}>Score saved to leaderboard</p>

        {/* ── ACTION BUTTONS ── */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', margin: '0 auto 20px', maxWidth: '480px' }}>
          {/* Challenge a Friend — share button with clipboard copy */}
          <button className="start-btn" onClick={() => {
            const shareCode = challengeData?.code || generateChallengeCode();
            const shareScore = safeScore.overall;
            const shareGrade = safeScore.overallGrade;
            const shareText = `I scored ${shareScore.toLocaleString()}/1000 (${shareGrade}) on Dental Tycoon! Can you beat me? Challenge code: ${shareCode} — play at dentaltycoon.com`;
            if (navigator.share) {
              navigator.share({ title: 'Dental Tycoon Challenge', text: shareText }).catch(() => {});
            } else if (navigator.clipboard) {
              navigator.clipboard.writeText(shareText).then(() => {
                alert('Challenge copied to clipboard! Send it to a friend.');
              }).catch(() => {
                prompt('Copy this challenge:', shareText);
              });
            } else {
              prompt('Copy this challenge:', shareText);
            }
          }} style={{ borderColor: '#eab308', background: 'rgba(234,179,8,0.08)' }}>
            <span className="btn-icon">🏆</span>
            <div><div className="btn-title" style={{ color: '#eab308' }}>Challenge a Friend</div><div className="btn-desc">Share your score</div></div>
          </button>

          {challengeData?.code && onChallengeComplete && (
            <button className="start-btn" onClick={() => {
              onChallengeComplete({
                overallScore: safeScore.overall, overallGrade: safeScore.overallGrade,
                profitMargin: safeScore.metrics.profitMargin, overheadRatio: safeScore.metrics.overheadRatio,
                finalCash: gameState.cash, finalPatients: gameState.patients,
                finalReputation: gameState.reputation, staffCount: gameState.staff.length,
                insuranceCount: (gameState.acceptedInsurance || []).length,
                playerName: challengeData.playerName,
                feedback,
              });
            }} style={{ borderColor: '#a78bfa' }}>
              <span className="btn-icon">📊</span>
              <div><div className="btn-title">View Results</div><div className="btn-desc">Compare scores</div></div>
            </button>
          )}

          <button className="start-btn" onClick={() => window.location.reload()}>
            <span className="btn-icon">🔄</span>
            <div><div className="btn-title">{isBankrupt ? 'Try Again' : 'Play Again'}</div><div className="btn-desc">New season</div></div>
          </button>

          <button className="start-btn" onClick={() => window.location.href = '/'} style={{ borderColor: '#64748b' }}>
            <span className="btn-icon">🏠</span>
            <div><div className="btn-title">Back to Home</div><div className="btn-desc">Main menu</div></div>
          </button>
        </div>

        {/* ── FEEDBACK / CONTACT (anonymous) ── */}
        <div style={{ margin: '0 auto 16px', maxWidth: '480px', padding: '14px', background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(59,130,246,0.06))', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#22c55e', marginBottom: '6px' }}>Have feedback? Ideas? Found a bug?</div>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '10px' }}>
            Help make Dental Tycoon better. We read every message.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`mailto:feedback@dentaltycoon.com?subject=${encodeURIComponent(`Dental Tycoon Feedback [${safeScore.overallGrade}]`)}&body=${encodeURIComponent(`Score: ${safeScore.overall}/1000\nDifficulty: ${diff.name}\nOutcome: ${isBankrupt ? 'Bankrupt' : isDsoSold ? 'DSO Sale' : 'Completed'}\n\n--- My feedback ---\n\n`)}`}
              style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', color: '#22c55e', fontWeight: 'bold', fontSize: '12px', textDecoration: 'none' }}>
              Send Feedback
            </a>
            <a href={`mailto:consult@dentaltycoon.com?subject=${encodeURIComponent('Practice Consultation Request')}&body=${encodeURIComponent('I just played Dental Tycoon and would like to discuss real dental practice management.\n\n')}`}
              style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', fontWeight: 'bold', fontSize: '12px', textDecoration: 'none' }}>
              Get Real Advice
            </a>
          </div>
          <div style={{ fontSize: '10px', color: '#475569', marginTop: '8px' }}>Your email is only used to reply — we never share it</div>
        </div>
      </div>
    );

    } catch (endScreenError) {
      console.error('[DT] END SCREEN CRASH:', endScreenError);
      return (
        <div className="game-over" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', color: '#ef4444', marginBottom: '16px' }}>
            {isGameOver ? '💸 GAME OVER' : '🏁 SEASON COMPLETE'}
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '8px' }}>Day {gameState.day} | Cash: ${(gameState.cash || 0).toLocaleString()}</p>
          <p style={{ color: '#94a3b8', marginBottom: '8px' }}>Patients: {gameState.patients || 0} | Reputation: {(gameState.reputation || 0).toFixed(1)}</p>
          {score && <p style={{ color: '#22c55e', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Score: {score.overall}/1000 ({score.overallGrade})</p>}
          <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '24px' }}>
            Detailed scorecard encountered an error. Score data shown above.
            <br />Check console for details: {endScreenError.message}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="start-btn" onClick={() => setScreen('home')} style={{ borderColor: '#3b82f6' }}>
              <span className="btn-icon">🏠</span>
              <div><div className="btn-title">Home</div></div>
            </button>
            <button className="start-btn" onClick={() => { setGameState(prev => ({ ...prev, day: 0, cash: diff.startingCash || 50000 })); setScreen('game'); }} style={{ borderColor: '#22c55e' }}>
              <span className="btn-icon">🔄</span>
              <div><div className="btn-title">Play Again</div></div>
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="game-screen">
      {/* Event Popup */}
      {eventPopup && (
        <div className={`event-popup ${eventPopup.type}`}>
          {eventPopup.message}
        </div>
      )}

      {/* Key Decision Popup */}
      {pendingDecision && <KeyDecisionPopup decision={pendingDecision} onChoose={handleDecision} />}

      {/* Location Selector Bar — only when multi-office active and locations exist */}
      {diff.multiOffice && (gameState.locations || []).length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
          background: 'rgba(15,23,42,0.9)', borderBottom: '1px solid rgba(148,163,184,0.1)',
          overflowX: 'auto',
        }}>
          <span style={{ fontSize: '10px', color: '#64748b', marginRight: '4px' }}>📍 Offices:</span>
          <button
            style={{
              fontSize: '11px', padding: '4px 12px', borderRadius: '6px',
              background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.3)',
              color: '#eab308', cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            🏥 Main Office
          </button>
          {(gameState.locations || []).map(loc => (
            <button key={loc.id} style={{
              fontSize: '11px', padding: '4px 12px', borderRadius: '6px',
              background: loc.buildoutDaysLeft > 0 ? 'rgba(71,85,105,0.2)' : 'rgba(59,130,246,0.1)',
              border: `1px solid ${loc.buildoutDaysLeft > 0 ? 'rgba(71,85,105,0.3)' : 'rgba(59,130,246,0.3)'}`,
              color: loc.buildoutDaysLeft > 0 ? '#64748b' : '#3b82f6',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              {loc.icon} {loc.name} {loc.buildoutDaysLeft > 0 ? `(${loc.buildoutDaysLeft}d)` : `· ${loc.patients || 0} pts`}
            </button>
          ))}
          <span style={{ fontSize: '10px', color: '#64748b', marginLeft: 'auto' }}>
            {gameState.locationCount || 1} total
          </span>
        </div>
      )}

      {/* Regional Manager Alert Banner */}
      {diff.multiOffice && (gameState.locationCount || 1) >= 4 && !gameState.hasRegionalManager && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
          background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.2)',
          fontSize: '12px', color: '#ef4444',
        }}>
          🚨 <strong>Warning:</strong> {gameState.locationCount} locations without a Regional Manager — all offices suffer 15% efficiency penalty!
          <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: 'auto' }}>Hire one in the Staff tab</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-left">
          <span className="top-tooth">🦷</span>
          <h2 className="top-title">Dental Tycoon</h2>
          <span className="day-badge">Day {gameState.day} / {gameState.gameDuration || diff.gameDuration}</span>
          <span className="day-badge" style={{ background: diff.id === 'hell' ? 'rgba(239,68,68,0.3)' : diff.id === 'expert' ? 'rgba(239,68,68,0.2)' : diff.id === 'beginner' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)', color: diff.id === 'hell' ? '#ef4444' : diff.id === 'expert' ? '#ef4444' : diff.id === 'beginner' ? '#22c55e' : '#eab308' }}>{diff.icon} {diff.name}{diff.scoreMultiplier > 1 ? ` (${diff.scoreMultiplier}x)` : ''}</span>
          {score && <span className="day-badge" style={{ background: 'rgba(59,130,246,0.2)', color: score.overallColor }}>{score.overall} {score.overallGrade}</span>}
          {challengeData?.code && <span className="day-badge" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308', fontFamily: 'monospace', letterSpacing: '2px' }}>{challengeData.code}</span>}
        </div>
        <div className="top-stats">
          <div className="top-stat">
            <span className="ts-label">Cash</span>
            <span className="ts-value" style={{ color: cashColor }}>${gameState.cash.toLocaleString()}</span>
          </div>
          <div className="top-stat">
            <span className="ts-label">Debt</span>
            <span className="ts-value" style={{ color: '#ef4444' }}>${gameState.debt.toLocaleString()}</span>
          </div>
          <div className="top-stat">
            <span className="ts-label">Rating</span>
            <span className="ts-value">{gameState.reputation.toFixed(1)} ⭐</span>
          </div>
          <div className="top-stat">
            <span className="ts-label">Patients</span>
            <span className="ts-value">{gameState.patients}</span>
          </div>
          <div className="top-stat">
            <span className="ts-label">Daily P/L</span>
            <span className="ts-value" style={{ color: stats.dailyProfit >= 0 ? '#22c55e' : '#ef4444' }}>
              {stats.dailyProfit >= 0 ? '+' : ''}${stats.dailyProfit.toLocaleString()}
            </span>
          </div>
          <div className="top-stat">
            <span className="ts-label">Clean</span>
            <span className="ts-value" style={{ color: (gameState.cleanliness || 50) > 70 ? '#22c55e' : (gameState.cleanliness || 50) > 40 ? '#eab308' : '#ef4444' }}>
              {Math.round(gameState.cleanliness || 50)}%
            </span>
          </div>
        </div>
        <div className="speed-controls">
          {[
            { speed: 0, label: '⏸' },
            { speed: 1, label: '▶' },
            { speed: 2, label: '▶▶' },
            { speed: 3, label: '▶▶▶' },
            { speed: 4, label: '⚡' },
          ].map(s => (
            <button
              key={s.speed}
              className={`speed-btn ${gameState.speed === s.speed ? 'active' : ''}`}
              onClick={() => setGameState(prev => ({ ...prev, speed: s.speed }))}
            >
              {s.label}
            </button>
          ))}
          {/* DEV SHORTCUT: Force end screen for testing */}
          <button
            className="speed-btn"
            style={{ background: '#ef4444', color: '#fff', fontSize: '9px', padding: '2px 6px', marginLeft: '8px' }}
            onClick={() => {
              console.log('[DT] DEV: Forcing end screen by setting day = gameDuration');
              setGameState(prev => ({ ...prev, day: prev.gameDuration || diff.gameDuration, speed: 0 }));
            }}
            title="DEV: Skip to end screen"
          >
            🏁 END
          </button>
        </div>
      </div>

      {/* Loan Payment Warning Banner */}
      {gameState.debt > 0 && (() => {
        const daysSincePayment = gameState.day - (gameState.lastLoanPaymentDay || 0);
        const daysUntilDue = 30 - daysSincePayment;
        const nextPayment = Math.round(gameState.debt * MONTHLY_LOAN_PAYMENT_RATE);
        if (daysUntilDue <= LOAN_WARNING_DAYS && daysUntilDue > 0) {
          const urgent = daysUntilDue <= 2;
          return (
            <div className={`loan-warning ${urgent ? 'urgent' : ''}`}>
              💰 LOAN PAYMENT DUE IN {daysUntilDue} DAY{daysUntilDue !== 1 ? 'S' : ''}: ${nextPayment.toLocaleString()} — {gameState.cash >= nextPayment ? 'You have enough cash' : 'WARNING: Not enough cash!'}
            </div>
          );
        }
        if (daysUntilDue <= 0 && daysSincePayment >= 30) {
          return (
            <div className="loan-warning urgent">
              💰 LOAN PAYMENT OVERDUE! ${nextPayment.toLocaleString()} due NOW — penalties accumulating!
            </div>
          );
        }
        return null;
      })()}

      {/* Main Content */}
      <div className="game-body">
        {/* Left side: Office + Log */}
        <div className="game-main">
          {/* Quick Stats Row */}
          <div className="quick-stats">
            <div className="qs-card">
              <div className="qs-label">Patients Today</div>
              <div className="qs-value">{stats.actualPatients} / {stats.effectiveCapacity}</div>
            </div>
            <div className="qs-card">
              <div className="qs-label">Revenue</div>
              <div className="qs-value green">${stats.dailyRevenue.toLocaleString()}</div>
            </div>
            <div className="qs-card">
              <div className="qs-label">Costs</div>
              <div className="qs-value red">${stats.totalDailyCosts.toLocaleString()}</div>
            </div>
            <div className="qs-card">
              <div className="qs-label">Satisfaction</div>
              <div className="qs-value">{Math.round(stats.satisfactionScore * 100)}%</div>
            </div>
            <div className="qs-card">
              <div className="qs-label">Staff</div>
              <div className="qs-value">{gameState.staff.length}</div>
            </div>
          </div>

          {/* Pressure Dashboard */}
          <PressureDashboard gameState={gameState} stats={stats} />

          {/* Office Visual */}
          <OfficeVisual
            equipment={gameState.equipment}
            staff={gameState.staff}
            activePatients={activePatients}
            officeUpgrades={gameState.officeUpgrades}
          />

          {/* Revenue Chart (simple) */}
          {gameState.revenueHistory.length > 5 && (
            <div className="chart-container">
              <h4 className="chart-title">Revenue Trend (Last {gameState.revenueHistory.length} Days)</h4>
              <div className="mini-chart">
                {gameState.revenueHistory.slice(-60).map((rev, i) => {
                  const max = Math.max(...gameState.revenueHistory.slice(-60), 1);
                  return (
                    <div key={i} className="chart-bar" style={{ height: `${(rev / max) * 100}%` }} title={`$${rev}`} />
                  );
                })}
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div className="log-section">
            <h4 className="log-title">Activity Log</h4>
            <div className="log-entries">
              {[...gameState.log].reverse().slice(0, 30).map((entry, i) => (
                <div key={i} className={`log-entry ${entry.type || ''}`}>
                  <span className="log-day">D{entry.day || '?'}</span>
                  {entry.text || entry}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: Management Panel */}
        <ManagementPanel gameState={gameState} setGameState={setGameState} stats={stats} difficulty={diff} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('title');
  const [startMode, setStartMode] = useState(null);   // 'scratch' | 'acquire'
  const [difficulty, setDifficulty] = useState(null);
  const [acquisitionChoice, setAcquisitionChoice] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [buildoutData, setBuildoutData] = useState(null);
  const [fixWindowData, setFixWindowData] = useState(null);
  const [challengeData, setChallengeData] = useState(null);
  const [challengeResult, setChallengeResult] = useState(null);

  // Title → choose path first, then difficulty
  const handleStart = (mode) => {
    setChallengeData(null);
    setStartMode(mode);
    setScreen('difficulty');
  };

  const handleChallenge = () => {
    setScreen('challengeSetup');
  };

  const handleStartChallenge = ({ code, playerName, difficulty: diff }) => {
    setChallengeData({ code, playerName });
    setDifficulty(diff);
    setStartMode('scratch');
    setScreen('spaceSelection');
  };

  const handleJoinChallenge = ({ code, playerName, difficulty: diff }) => {
    setChallengeData({ code, playerName });
    setDifficulty(diff);
    setStartMode('scratch');
    setScreen('spaceSelection');
  };

  // After difficulty, route based on startMode
  const handleDifficultySelect = (mode) => {
    setDifficulty(mode);
    if (startMode === 'scratch') {
      setScreen('spaceSelection');
    } else {
      setScreen('acquire');
    }
  };

  const handleSpaceSelect = (space) => {
    setSelectedSpace(space);
    setScreen('buildout');
  };

  const handleBuildoutComplete = (data) => {
    setBuildoutData(data);
    setScreen('setup');
  };

  const handleSetupComplete = (setupData) => {
    setBuildoutData(setupData);
    setScreen('game');
  };

  // Acquire flow: pick practice → fix window → game
  const handleAcquirePick = (option) => {
    setAcquisitionChoice(option);
    setScreen('fixWindow');
  };

  const handleFixWindowComplete = (fixData) => {
    setFixWindowData(fixData);
    setStartMode('acquire');
    setScreen('game');
  };

  // ── SCREEN RENDERING ROUTER ──
  if (screen === 'title') return <TitleScreen onStart={handleStart} onChallenge={handleChallenge} onLeaderboard={() => setScreen('leaderboard')} />;
  if (screen === 'leaderboard') return <LeaderboardScreen onBack={() => setScreen('title')} />;
  if (screen === 'challengeSetup') return <ChallengeSetupScreen onStartChallenge={handleStartChallenge} onJoinChallenge={handleJoinChallenge} onBack={() => setScreen('title')} />;
  if (screen === 'challengeCompare') return <ChallengeCompareScreen challengeCode={challengeData?.code} myResult={challengeResult} onBack={() => { setChallengeData(null); setChallengeResult(null); setScreen('title'); }} />;
  if (screen === 'difficulty') return <DifficultySelectionScreen onSelect={handleDifficultySelect} onBack={() => setScreen('title')} startMode={startMode} />;
  if (screen === 'spaceSelection') return <SpaceSelectionScreen onSelect={handleSpaceSelect} onBack={() => setScreen('difficulty')} />;
  if (screen === 'buildout') return <BuildoutScreen space={selectedSpace} difficulty={difficulty} onComplete={handleBuildoutComplete} onBack={() => setScreen('spaceSelection')} />;
  if (screen === 'setup') return <SetupPhaseScreen buildoutData={buildoutData} difficulty={difficulty} onComplete={handleSetupComplete} onBack={() => setScreen('buildout')} />;
  if (screen === 'acquire') return <AcquireScreen difficulty={difficulty} onSelect={handleAcquirePick} onBack={() => setScreen('difficulty')} />;
  if (screen === 'fixWindow') return <FixWindowScreen practice={acquisitionChoice} difficulty={difficulty} onComplete={handleFixWindowComplete} onBack={() => setScreen('acquire')} />;
  return (
    <GameErrorBoundary>
      <GameScreen startMode={startMode} acquisitionChoice={acquisitionChoice} fixWindowData={fixWindowData} buildoutData={buildoutData} difficulty={difficulty}
        challengeData={challengeData} onChallengeComplete={(result) => { setChallengeResult(result); setScreen('challengeCompare'); }} />
    </GameErrorBoundary>
  );
}
