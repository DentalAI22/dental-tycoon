// ─── LOAN PAYMENT SYSTEM ───
export const MONTHLY_LOAN_PAYMENT_RATE = 0.02; // 2% of principal per month
export const LATE_PAYMENT_PENALTY_RATE = 0.05; // 5% penalty on missed amount
export const LOAN_WARNING_DAYS = 5; // warn X days before payment due

// ─── DIFFICULTY MODES ───
// Difficulty = practice SIZE and COMPLEXITY.
// Beginner = small solo startup, not much money, fewer moving parts.
// Intermediate = mid-size practice, more staff, real problems.
// Expert = large multi-doctor practice, big loan, huge overhead, everything can go wrong.
// Hell Mode = special event — worst conditions possible, highest potential score.
export const DIFFICULTY_MODES = [
  {
    id: 'beginner', name: 'Solo Startup', icon: '🟢',
    subtitle: 'Small Practice, Big Dreams',
    description: 'A small solo practice startup. $500K loan, 1-2 operatories. Staff drama and equipment breakdowns turned OFF so you can focus on the fundamentals: get patients, treat them well, control costs.',
    loanAmount: 500000,
    gameDuration: 90,         // 90-day season
    rentMultiplier: 1.0,
    salaryMultiplier: 1.0,
    eventFrequency: 0.3,      // very few random events
    patientGrowthBonus: 1.3,   // patients come a bit easier
    maintenanceMultiplier: 1.0,
    supplyMultiplier: 1.0,
    startingReputation: 3.0,
    overdraftLimit: -100000,
    showHints: true,
    interestRate: 0.06,
    staffDramaEnabled: false,
    equipBreakdownEnabled: false,
    insuranceAuditsEnabled: false,
    cashSpiralEnabled: false,
    competitorEventsEnabled: false,
    features: ['90-day season', '$500K loan', 'Helpful tips', 'No staff drama', 'No breakdowns', 'Learn the basics'],
  },
  {
    id: 'intermediate', name: 'Growing Practice', icon: '🟡',
    subtitle: 'Real Dentistry, Real Problems',
    description: 'A mid-size practice with real challenges. $750K loan, 3-4 operatories. Staff have morale issues, equipment breaks, insurance companies audit you. You need to hire right, train well, and balance growth with overhead.',
    loanAmount: 750000,
    gameDuration: 180,        // 6-month season
    rentMultiplier: 1.0,
    salaryMultiplier: 1.0,
    eventFrequency: 1.0,
    patientGrowthBonus: 1.0,
    maintenanceMultiplier: 1.0,
    supplyMultiplier: 1.0,
    startingReputation: 3.0,
    overdraftLimit: -100000,
    showHints: false,
    interestRate: 0.06,
    staffDramaEnabled: true,
    equipBreakdownEnabled: true,
    insuranceAuditsEnabled: true,
    cashSpiralEnabled: true,
    competitorEventsEnabled: false,
    features: ['180-day season', '$750K loan', 'Staff drama ON', 'Equipment breaks', 'Insurance audits', 'Full management'],
  },
  {
    id: 'expert', name: 'Multi-Doctor Empire', icon: '🔴',
    subtitle: 'Big Practice, Big Risk',
    description: 'A large multi-doctor practice. $1.2M loan — massive overhead. You need to produce $2-3M/year just to stay afloat. Associates, specialists, big staff. Competitors poach your people, patients expect premium service, one bad month and the cash spiral starts.',
    loanAmount: 1200000,
    gameDuration: 365,        // full year
    rentMultiplier: 1.0,
    salaryMultiplier: 1.0,
    eventFrequency: 1.3,
    patientGrowthBonus: 0.8,
    maintenanceMultiplier: 1.0,
    supplyMultiplier: 1.0,
    startingReputation: 3.0,
    overdraftLimit: -100000,
    showHints: false,
    interestRate: 0.06,
    staffDramaEnabled: true,
    equipBreakdownEnabled: true,
    insuranceAuditsEnabled: true,
    cashSpiralEnabled: true,
    competitorEventsEnabled: true,
    expertEventsEnabled: true,
    multiOffice: true,
    features: ['365-day season', '$1.2M loan', 'Staff poaching', 'Competitors', 'Malpractice', 'Embezzlement', 'Must produce to survive'],
  },
  {
    id: 'hell', name: 'Hell Mode', icon: '💀',
    subtitle: 'Everything Goes Wrong',
    description: 'SPECIAL EVENT. $1.5M loan, 365 days, aggressive competitors, staff constantly threatening to leave, equipment breaks weekly, insurance clawbacks, malpractice suits, embezzlement. The highest scores in the game come from surviving this. Can you?',
    loanAmount: 1500000,
    gameDuration: 365,
    rentMultiplier: 1.2,
    salaryMultiplier: 1.15,
    eventFrequency: 2.0,       // events happen DOUBLE
    patientGrowthBonus: 0.6,   // patients are very hard to attract
    maintenanceMultiplier: 1.3,
    supplyMultiplier: 1.2,
    startingReputation: 2.5,   // start with bad reviews
    overdraftLimit: -50000,    // very tight
    showHints: false,
    interestRate: 0.07,
    staffDramaEnabled: true,
    equipBreakdownEnabled: true,
    insuranceAuditsEnabled: true,
    cashSpiralEnabled: true,
    competitorEventsEnabled: true,
    expertEventsEnabled: true,
    hellMode: true,            // triggers extra-harsh events
    multiOffice: true,
    scoreMultiplier: 1.5,      // 50% score bonus for surviving hell
    features: ['365 days', '$1.5M loan', '2x events', 'Brutal competition', 'Score x1.5 multiplier', 'Only for the fearless'],
  },
];

// ─── SCORING SYSTEM ───
// 1-1000 scale with 10 categories. Enough granularity for competitive leaderboards.
// Every category gets a 0-100 sub-score. Weighted total maps to 1-1000.
// The ultimate game: attract patients, treat them well, convert them, keep overhead down.

function scoreFromRange(value, thresholds) {
  // thresholds = [[threshold, score], ...] — sorted best to worst
  for (const [thresh, sc] of thresholds) {
    if (value >= thresh) return sc;
  }
  return thresholds[thresholds.length - 1][1];
}

function gradeFromScore(score) {
  if (score >= 95) return { grade: 'A+', color: '#22c55e' };
  if (score >= 85) return { grade: 'A', color: '#22c55e' };
  if (score >= 75) return { grade: 'B+', color: '#22c55e' };
  if (score >= 65) return { grade: 'B', color: '#4ade80' };
  if (score >= 55) return { grade: 'C+', color: '#eab308' };
  if (score >= 45) return { grade: 'C', color: '#eab308' };
  if (score >= 35) return { grade: 'D+', color: '#f97316' };
  if (score >= 25) return { grade: 'D', color: '#ef4444' };
  if (score >= 15) return { grade: 'F+', color: '#ef4444' };
  return { grade: 'F', color: '#ef4444' };
}

export function calculateScore(gameState, stats) {
  const day = gameState.day;
  if (day < 10) return null; // too early

  const monthlyRevenue = stats.dailyRevenue * 30;
  const monthlyCosts = stats.totalDailyCosts * 30;
  const monthlyProfit = stats.dailyProfit * 30;
  const overheadRatio = monthlyRevenue > 0 ? monthlyCosts / monthlyRevenue : 1;
  const profitMargin = monthlyRevenue > 0 ? monthlyProfit / monthlyRevenue : -1;
  const revenuePerSqft = stats.annualRevenuePerSqft || 0;

  const categories = {};

  // ── 1. OVERHEAD CONTROL (weight: 15%) ──
  // Lower is better. Industry benchmark: 55-60% is good, under 50% is excellent
  const ohScore = scoreFromRange(1 - overheadRatio, [
    [0.55, 98], [0.48, 92], [0.42, 85], [0.38, 78], [0.33, 68],
    [0.28, 58], [0.22, 45], [0.15, 32], [0.05, 18], [0, 5],
  ]);
  categories.overhead = {
    name: 'Overhead Control', icon: '💸', score: ohScore, ...gradeFromScore(ohScore), weight: 15,
    value: `${Math.round(overheadRatio * 100)}%`, target: '<60%',
    tip: overheadRatio > 0.7 ? 'Too much staff, space, or equipment relative to revenue' : overheadRatio < 0.5 ? 'Excellent cost control' : 'Room to trim costs',
  };

  // ── 2. PROFITABILITY (weight: 15%) ──
  const pmScore = scoreFromRange(profitMargin, [
    [0.45, 98], [0.38, 92], [0.32, 85], [0.25, 75], [0.18, 65],
    [0.12, 55], [0.06, 42], [0.02, 28], [0, 15], [-1, 3],
  ]);
  categories.profitMargin = {
    name: 'Profitability', icon: '📈', score: pmScore, ...gradeFromScore(pmScore), weight: 15,
    value: `${Math.round(profitMargin * 100)}%`, target: '30%+',
    tip: profitMargin < 0 ? 'Losing money — revenue must exceed costs' : profitMargin < 0.15 ? 'Thin margins — overhead may be too high' : 'Healthy profits',
  };

  // ── 3. PATIENT ATTRACTION & GROWTH (weight: 12%) ──
  // How well did you grow your patient base? Measured by final patient count relative to days played
  const patientsPerDay = gameState.patients / Math.max(day, 1);
  const paScore = scoreFromRange(patientsPerDay, [
    [5, 98], [3.5, 90], [2.5, 80], [1.8, 70], [1.2, 58],
    [0.8, 45], [0.5, 32], [0.2, 18], [0, 5],
  ]);
  categories.patientGrowth = {
    name: 'Patient Attraction', icon: '🧲', score: paScore, ...gradeFromScore(paScore), weight: 12,
    value: `${gameState.patients} patients`, target: 'Steady growth',
    tip: gameState.patients < 30 ? 'Marketing and reputation drive new patients' : gameState.patients > 200 ? 'Strong patient base — protect it' : 'Growing nicely',
  };

  // ── 4. PATIENT SATISFACTION (weight: 12%) ──
  const sat = stats.satisfactionScore;
  const satScore = scoreFromRange(sat, [
    [0.90, 98], [0.82, 90], [0.74, 80], [0.66, 70], [0.58, 58],
    [0.50, 45], [0.40, 32], [0.30, 18], [0, 5],
  ]);
  categories.satisfaction = {
    name: 'Patient Satisfaction', icon: '😊', score: satScore, ...gradeFromScore(satScore), weight: 12,
    value: `${Math.round(sat * 100)}%`, target: '80%+',
    tip: sat < 0.5 ? 'Staff attitude, cleanliness, wait times all affect satisfaction' : 'Patients are happy with your practice',
  };

  // ── 5. REPUTATION (weight: 10%) ──
  const rep = gameState.reputation;
  const repScore = scoreFromRange(rep, [
    [4.8, 98], [4.5, 92], [4.2, 84], [3.8, 74], [3.5, 64],
    [3.0, 50], [2.5, 35], [2.0, 20], [0, 5],
  ]);
  categories.reputation = {
    name: 'Online Reputation', icon: '⭐', score: repScore, ...gradeFromScore(repScore), weight: 10,
    value: `${rep.toFixed(1)} stars`, target: '4.0+',
    tip: rep < 3.0 ? 'Bad reviews kill patient acquisition' : rep >= 4.5 ? 'Premium reputation — charge premium fees' : 'Build reviews through great experiences',
  };

  // ── 6. SPACE UTILIZATION (weight: 8%) ──
  const sqftScore = scoreFromRange(revenuePerSqft, [
    [220, 98], [180, 90], [150, 80], [120, 68], [90, 55],
    [60, 40], [30, 25], [0, 8],
  ]);
  categories.spaceUtilization = {
    name: 'Space Utilization', icon: '📐', score: sqftScore, ...gradeFromScore(sqftScore), weight: 8,
    value: `$${revenuePerSqft}/sqft/yr`, target: '$150+',
    tip: revenuePerSqft < 80 ? 'Too much space for your patient volume' : 'Efficient use of space',
  };

  // ── 7. STAFF MANAGEMENT (weight: 10%) ──
  const staffCount = gameState.staff.length;
  const avgMorale = staffCount > 0 ? gameState.staff.reduce((s, m) => s + m.morale, 0) / staffCount : 0;
  const avgSkill = staffCount > 0 ? gameState.staff.reduce((s, m) => s + m.skill, 0) / staffCount : 0;
  const hasDentist = gameState.staff.some(s => s.role === 'Dentist' || s.role === 'Specialist');
  const hasFrontDesk = gameState.staff.some(s => s.role === 'Front Desk' || s.role === 'Office Manager');
  // Composite: morale (40%), skill (30%), having key roles (30%)
  const roleScore = (hasDentist ? 50 : 0) + (hasFrontDesk ? 50 : 0);
  const staffScore = Math.min(100, Math.round(
    (avgMorale * 0.4) + (avgSkill * 0.3) + (roleScore * 0.3)
  ));
  categories.staffManagement = {
    name: 'Staff Management', icon: '👥', score: staffCount === 0 ? 5 : staffScore, ...gradeFromScore(staffCount === 0 ? 5 : staffScore), weight: 10,
    value: `${staffCount} staff, ${Math.round(avgMorale)} morale`, target: 'Skilled & happy team',
    tip: avgMorale < 40 ? 'Burned out staff quit and make mistakes' : avgSkill < 50 ? 'Invest in training to boost skills' : 'Team is solid',
  };

  // ── 8. TRAINING & DEVELOPMENT (weight: 5%) ──
  const completedTraining = (gameState.completedTraining || []).length;
  const trainScore = scoreFromRange(completedTraining, [
    [5, 98], [4, 88], [3, 75], [2, 60], [1, 40], [0, 10],
  ]);
  categories.training = {
    name: 'Training & Development', icon: '🎓', score: trainScore, ...gradeFromScore(trainScore), weight: 5,
    value: `${completedTraining} programs`, target: '3+ programs',
    tip: completedTraining === 0 ? 'Training offsets hiring friction and builds skills' : 'Good investment in your team',
  };

  // ── 9. INSURANCE STRATEGY (weight: 8%) ──
  const accepted = gameState.acceptedInsurance || [];
  const hasCash = accepted.includes('cash_only');
  const insPlans = accepted.filter(id => id !== 'cash_only');
  const hmoCount = insPlans.filter(id => {
    const p = INSURANCE_PLANS.find(plan => plan.id === id);
    return p && (p.type === 'hmo' || p.type === 'medicaid');
  }).length;
  // Good strategy: not too many plans, good mix, cash patients if rep supports it
  // HMO-aware scoring: reward well-run HMO practices
  const capacityUsage = stats.effectiveCapacity > 0 ? stats.actualPatients / stats.effectiveCapacity : 0;
  const isAdequatelyStaffed = !stats.understaffedPenalty;
  let insScore = 50; // baseline
  if (accepted.length === 0) insScore = 20; // no insurance at all — risky
  else if (hasCash && insPlans.length <= 2 && rep >= 3.5) insScore = 92; // premium mix
  else if (hasCash && insPlans.length <= 3) insScore = 78;
  else if (insPlans.length >= 6) insScore = 25; // way too many plans
  else if (hmoCount >= 2 && isAdequatelyStaffed && overheadRatio < 0.55 && capacityUsage < 0.85) insScore = 85; // lean HMO machine
  else if (hmoCount >= 2 && isAdequatelyStaffed && overheadRatio < 0.65) insScore = 70; // HMO working but tight
  else if (hmoCount >= 2 && !isAdequatelyStaffed) insScore = 40; // volume without staff
  else if (insPlans.length >= 4 && hmoCount >= 2) insScore = 35; // HMO mess
  else if (insPlans.length <= 3) insScore = 68; // decent selectivity
  else insScore = 45; // somewhat bloated
  // Bonus for cash share
  if (hasCash && (stats.effectiveCashShare || 0) > 0.15) insScore = Math.min(100, insScore + 10);
  categories.insuranceStrategy = {
    name: 'Insurance Strategy', icon: '🏥', score: insScore, ...gradeFromScore(insScore), weight: 8,
    value: `${accepted.length} plans${hasCash ? ' + cash' : ''}`, target: 'Selective & strategic',
    tip: accepted.length >= 5 ? 'Too many plans — admin costs and cannibalization hurting you' :
         hasCash && rep >= 4 ? 'Cash patient base is growing with reputation' :
         'Be strategic — drop low-value plans as reputation builds',
  };

  // ── 10. CASH MANAGEMENT (weight: 5%) ──
  const cashScore = scoreFromRange(gameState.cash, [
    [500000, 98], [300000, 90], [200000, 82], [100000, 72], [50000, 60],
    [20000, 48], [0, 30], [-20000, 15], [-50000, 5],
  ]);
  categories.cashManagement = {
    name: 'Cash Management', icon: '💰', score: cashScore, ...gradeFromScore(cashScore), weight: 5,
    value: `$${gameState.cash.toLocaleString()}`, target: 'Positive & growing',
    tip: gameState.cash < 0 ? 'Negative cash triggers spiral — cut costs NOW' : gameState.cash > 200000 ? 'Strong reserves' : 'Keep building reserves',
  };

  // ── 11. EMPIRE MANAGEMENT (conditional — only when multi-location) ──
  const locCount = 1 + (gameState.locations || []).length;
  if (locCount > 1) {
    const allLocs = gameState.locations || [];
    const hasRM = locCount <= 3 || gameState.hasRegionalManager;
    const avgLocRep = allLocs.length > 0 ? allLocs.reduce((s, l) => s + (l.reputation || 3), 0) / allLocs.length : 0;
    let empScore = 30; // base
    if (locCount >= 2) empScore += 10;
    if (locCount >= 3) empScore += 10;
    if (locCount >= 5) empScore += 10;
    if (hasRM) empScore += 15;
    if (avgLocRep >= 4.0) empScore += 15;
    if (avgLocRep >= 3.5) empScore += 10;
    empScore = Math.min(100, empScore);
    categories.empireManagement = {
      name: 'Empire Management', icon: '🏢', score: empScore, ...gradeFromScore(empScore), weight: 8,
      value: `${locCount} locations`, target: 'All profitable + managed',
      tip: !hasRM && locCount > 3 ? 'Hire a Regional Manager — you\'re losing 15% efficiency' : locCount <= 2 ? 'Expand to unlock synergies' : 'Growing empire',
    };
    // Redistribute weights: reduce overhead 15→13, profit 15→14, cash 5→3
    if (categories.overhead) categories.overhead.weight = 13;
    if (categories.profitMargin) categories.profitMargin.weight = 14;
    if (categories.cashManagement) categories.cashManagement.weight = 3;
  }

  // ── CALCULATE OVERALL (1-1000) ──
  const categoryList = Object.values(categories);
  const totalWeight = categoryList.reduce((s, c) => s + c.weight, 0);
  // Weighted average of sub-scores (each 0-100), then scale to 1-1000
  const weightedAvg = categoryList.reduce((s, c) => s + (c.score * c.weight), 0) / totalWeight;
  // Map to 1-1000 with some non-linearity to spread the middle
  // A perfect 100 avg = 1000, a 50 avg = ~500, a 0 avg = 1
  // Apply difficulty score multiplier (Hell Mode = 1.5x)
  const scoreMultiplier = gameState.scoreMultiplier || 1;
  const overall = Math.max(1, Math.min(1000, Math.round(weightedAvg * 10 * scoreMultiplier)));

  // Letter grade from the 1000 scale
  let overallGrade, overallColor;
  if (overall >= 900) { overallGrade = 'A+'; overallColor = '#22c55e'; }
  else if (overall >= 800) { overallGrade = 'A'; overallColor = '#22c55e'; }
  else if (overall >= 700) { overallGrade = 'B+'; overallColor = '#22c55e'; }
  else if (overall >= 600) { overallGrade = 'B'; overallColor = '#4ade80'; }
  else if (overall >= 500) { overallGrade = 'C+'; overallColor = '#eab308'; }
  else if (overall >= 400) { overallGrade = 'C'; overallColor = '#eab308'; }
  else if (overall >= 300) { overallGrade = 'D+'; overallColor = '#f97316'; }
  else if (overall >= 200) { overallGrade = 'D'; overallColor = '#ef4444'; }
  else { overallGrade = 'F'; overallColor = '#ef4444'; }

  return {
    categories,
    grades: categories, // backward compat
    overall,
    overallGrade,
    overallColor,
    metrics: {
      overheadRatio: Math.round(overheadRatio * 100),
      profitMargin: Math.round(profitMargin * 100),
      monthlyRevenue,
      monthlyProfit,
      revenuePerSqft,
    },
  };
}

// ─── EXPERT MODE: ADDITIONAL EVENTS ───
export const EXPERT_EVENTS = [
  { id: 'staff_poached', message: '{staff} was poached by a competitor offering higher pay!', type: 'negative', chance: 0.025, requiresStaff: true, firesStaff: true },
  { id: 'insurance_clawback', message: 'Insurance clawback! They want $8,000 back for "overcoding."', type: 'negative', cashEffect: -8000, reputationEffect: -0.1, chance: 0.02 },
  { id: 'malpractice_scare', message: 'A patient is threatening a malpractice lawsuit. Legal fees: $10,000', type: 'negative', cashEffect: -10000, reputationEffect: -0.2, chance: 0.01 },
  { id: 'competitor_marketing', message: 'A competitor launched an aggressive marketing campaign. Your new patient flow dropped.', type: 'negative', patientEffect: -12, chance: 0.03 },
  { id: 'associate_wants_buyIn', message: 'Your top dentist wants to buy in as a partner — or they\'ll leave.', type: 'warning', chance: 0.02, requiresStaff: true },
  { id: 'supply_chain_issue', message: 'Supply chain disruption! Key supplies delayed. Limited procedures this week.', type: 'negative', cashEffect: -3000, chance: 0.02 },
  { id: 'state_audit', message: 'State dental board audit. Extra compliance costs: $5,000', type: 'negative', cashEffect: -5000, chance: 0.015 },
  { id: 'embezzlement', message: 'Discovered front desk was skimming payments! Lost $15,000 before catching it.', type: 'negative', cashEffect: -15000, chance: 0.005, requiresStaff: true, firesStaff: true },
];

// ─── HELL MODE: EXTRA EVENTS ───
export const HELL_EVENTS = [
  { id: 'hell_mass_quit', message: 'Three staff members organized a walkout! "We deserve better." Morale crisis.', type: 'negative', chance: 0.015, requiresStaff: true, moraleEffect: -20 },
  { id: 'hell_flood', message: 'Pipe burst flooded the entire office! 3 days closed, $25,000 in damage.', type: 'negative', cashEffect: -25000, chance: 0.01 },
  { id: 'hell_double_audit', message: 'IRS AND state dental board auditing you simultaneously. Legal fees: $20,000.', type: 'negative', cashEffect: -20000, reputationEffect: -0.3, chance: 0.01 },
  { id: 'hell_viral_review', message: 'A patient\'s negative TikTok about your practice went viral. Reputation tanking.', type: 'negative', reputationEffect: -0.5, patientEffect: -20, chance: 0.01 },
  { id: 'hell_competitor_poach_all', message: 'A corporate DSO is offering your entire team 30% raises. Everyone is tempted.', type: 'negative', moraleEffect: -15, chance: 0.02, requiresStaff: true },
  { id: 'hell_equipment_recall', message: 'FDA recall on your primary equipment! Must replace immediately. $30,000.', type: 'negative', cashEffect: -30000, chance: 0.008 },
  { id: 'hell_malpractice_suit', message: 'Full malpractice lawsuit filed. Attorney fees mounting: $40,000 so far.', type: 'negative', cashEffect: -40000, reputationEffect: -0.4, chance: 0.005 },
  { id: 'hell_rent_spike', message: 'Landlord selling building — new owner raising rent 25% effective immediately!', type: 'negative', chance: 0.01, rentIncrease: 0.25 },
  { id: 'hell_insurance_drop', message: 'Your highest-paying insurance plan dropped you from their network!', type: 'negative', chance: 0.01, reputationEffect: -0.1 },
  { id: 'hell_supply_shortage', message: 'National supply shortage — had to buy premium supplies at 3x cost. $8,000 extra.', type: 'negative', cashEffect: -8000, chance: 0.02 },
];

// ─── KEY DECISIONS ───
// These are game-pausing decision moments that force a strategic trade-off.
// Each decision has 2-3 options with clear opposing consequences.
// They trigger at specific day thresholds or conditions.
export const KEY_DECISIONS = [
  {
    id: 'associate_offer', day: 30, minDifficulty: 'intermediate',
    condition: (gs) => gs.staff.some(s => s.role === 'Dentist') && gs.patients >= 40,
    title: 'Associate Opportunity',
    description: 'Dr. Rivera, an experienced dentist, wants to join your practice. She brings 50 existing patients but demands a $180K salary and partnership track.',
    options: [
      { id: 'hire', label: 'Hire Dr. Rivera', icon: '✅',
        description: '+50 patients, +1 dentist ($180K/yr). More revenue capacity but big salary commitment.',
        effects: { patientBoost: 50, addStaff: { role: 'Dentist', skill: 82, attitude: 70, salary: 180000 } },
        consequence: 'Revenue went up but so did overhead. The associate brought patients but also expectations.' },
      { id: 'pass', label: 'Pass — Stay Solo', icon: '❌',
        description: 'Keep overhead low. You can\'t see as many patients but your margins stay tight.',
        effects: {},
        consequence: 'Stayed lean. Missed the growth opportunity but kept full control.' },
      { id: 'negotiate', label: 'Counter-Offer ($140K)', icon: '🤝',
        description: 'Offer $140K. She might accept (60% chance) or walk and take 10 patients with her.',
        effects: { negotiation: true, successChance: 0.6, successEffects: { patientBoost: 40, addStaff: { role: 'Dentist', skill: 82, attitude: 55, salary: 140000 } }, failEffects: { patientBoost: -10, reputationEffect: -0.1 } },
        consequence: 'The negotiation was a gamble — cheaper if it worked, costly in reputation if it didn\'t.' },
    ],
  },
  {
    id: 'insurance_exclusive', day: 45, minDifficulty: 'beginner',
    condition: (gs) => (gs.acceptedInsurance || []).length >= 1,
    title: 'Exclusive Insurance Deal',
    description: 'Delta Dental offers you a "Preferred Provider" deal: they\'ll send you 30% more patients, but you must drop all other insurance plans and accept their rates exclusively for 90 days.',
    options: [
      { id: 'accept', label: 'Go Exclusive', icon: '🔵',
        description: '+30% Delta patients, but you lose ALL other insurance plans for 90 days.',
        effects: { patientBoost: 25, lockInsurance: 'delta', lockDuration: 90 },
        consequence: 'Went all-in on Delta. Volume was guaranteed but reimbursement rates locked you in.' },
      { id: 'decline', label: 'Keep Your Options', icon: '🚫',
        description: 'Stay diversified. No patient boost but freedom to adjust your insurance mix.',
        effects: {},
        consequence: 'Kept insurance flexibility. No guaranteed patients but no lock-in either.' },
    ],
  },
  {
    id: 'equipment_deal', day: 60, minDifficulty: 'beginner',
    condition: (gs) => gs.cash > 30000,
    title: 'Equipment Flash Sale',
    description: 'A nearby practice is closing. They\'re selling a CEREC milling machine (normally $140K) for $75K — but it\'s today only. Same-day crowns could transform your revenue.',
    options: [
      { id: 'buy', label: 'Buy It ($75K)', icon: '🏭',
        description: 'Get CEREC at 46% off. Same-day crowns = huge revenue. But $75K is a lot of cash right now.',
        effects: { cashEffect: -75000, addEquipment: 'cerec' },
        consequence: 'Bought the CEREC at a steal. Revenue per patient jumped — but only if you had the patient volume to use it.' },
      { id: 'pass', label: 'Too Risky Right Now', icon: '💰',
        description: 'Keep your cash reserves. Equipment sitting idle costs maintenance with no return.',
        effects: {},
        consequence: 'Passed on the deal. Kept cash safe. The CEREC would have been great — if you could fill the chairs.' },
    ],
  },
  {
    id: 'staff_stealing', day: 75, minDifficulty: 'intermediate',
    condition: (gs) => gs.staff.length >= 2,
    title: 'Employee Caught Stealing',
    description: 'Your office manager was caught taking supplies home and padding vendor invoices. Estimated $5,000 lost. She\'s your best front desk person — losing her disrupts everything.',
    options: [
      { id: 'fire', label: 'Fire Immediately', icon: '🚪',
        description: 'Zero tolerance. Lose your best front desk person. Patient flow drops 40% until you hire replacement.',
        effects: { fireRole: 'Office Manager', moraleBoost: 5 },
        consequence: 'Fired the thief. Staff respected the integrity, but the front desk was a mess for weeks.' },
      { id: 'warning', label: 'Final Warning + Docked Pay', icon: '⚠️',
        description: 'Keep capacity but risk continued theft. Dock $2,000 from pay. Other staff may lose respect.',
        effects: { cashEffect: 2000, moraleEffect: -8, reputationEffect: -0.05 },
        consequence: 'Gave a second chance. Some staff thought you were weak. The stealing may or may not have stopped.' },
    ],
  },
  {
    id: 'dso_buyout', day: 120, minDifficulty: 'intermediate',
    condition: (gs) => gs.patients >= 100 && gs.reputation >= 3.5,
    title: 'Corporate Buyout Offer',
    description: (gs) => {
      const debt = gs.debt || 0;
      const salePrice = 400000;
      const net = salePrice - debt;
      if (debt <= 0) return `A DSO offers to buy your practice for $${salePrice.toLocaleString()} + keep you as a salaried dentist at $250K/year. You'd lose ownership but eliminate all risk. No outstanding debt — the full $${salePrice.toLocaleString()} is yours.`;
      if (net > 0) return `A DSO offers $${salePrice.toLocaleString()} for your practice. But you still owe $${debt.toLocaleString()} on your loan. After settling the debt, you'd walk away with $${net.toLocaleString()}. You can't sell without paying off the loan first — the bank gets paid before you do.`;
      return `A DSO offers $${salePrice.toLocaleString()} for your practice. But you owe $${debt.toLocaleString()} — MORE than the sale price. Selling would cover part of the debt but you'd still owe $${Math.abs(net).toLocaleString()}. This is a bad deal, but it stops the bleeding.`;
    },
    options: (gs) => {
      const debt = gs.debt || 0;
      const salePrice = 400000;
      const net = salePrice - debt;
      const opts = [];
      if (net > 0) {
        opts.push({ id: 'sell', label: 'Sell to the DSO', icon: '🏢',
          description: `Sell for $${salePrice.toLocaleString()}. Loan of $${debt.toLocaleString()} gets paid off from proceeds. You walk away with $${net.toLocaleString()}.`,
          effects: { dsoSell: true, salePrice, endGame: true, endReason: 'Sold to DSO' },
          consequence: `Sold the practice. The bank took $${debt.toLocaleString()} off the top. You walked away with $${net.toLocaleString()}. Safe, but you gave up the upside.` });
      } else {
        opts.push({ id: 'sell', label: 'Sell (Still Owe Money)', icon: '🏢',
          description: `Sale price doesn't cover your $${debt.toLocaleString()} debt. You'd still owe $${Math.abs(net).toLocaleString()} after selling. But it stops the overhead bleeding.`,
          effects: { dsoSell: true, salePrice, endGame: true, endReason: 'Sold to DSO (underwater)' },
          consequence: `Sold the practice underwater. The $${salePrice.toLocaleString()} went straight to the bank but didn't cover the full $${debt.toLocaleString()} debt. You still owe $${Math.abs(net).toLocaleString()}.` });
      }
      opts.push({ id: 'decline', label: 'Keep Building', icon: '💪',
        description: 'Bet on yourself. The practice could be worth much more — or much less — by season end.',
        effects: { reputationEffect: 0.1, moraleBoost: 5 },
        consequence: 'Turned down the buyout. Staff were inspired. But the risk was all on you from here.' });
      return opts;
    },
  },
  {
    id: 'marketing_war', day: 90, minDifficulty: 'intermediate',
    condition: (gs) => gs.patients >= 50,
    title: 'Competitor Price War',
    description: 'A new corporate practice opened nearby offering free cleanings and $99 whitening. Your new patient flow just dropped 40%. How do you respond?',
    options: [
      { id: 'match', label: 'Match Their Prices', icon: '💸',
        description: 'Slash prices to compete. Keep volume but crush your margins.',
        effects: { patientBoost: 15, revenueMultiplier: 0.75, duration: 60 },
        consequence: 'Entered the price war. Kept patients but revenue per patient tanked. Margins got crushed.' },
      { id: 'premium', label: 'Double Down on Quality', icon: '⭐',
        description: 'Invest $15K in patient experience upgrades. Lose some price-shoppers but attract quality patients.',
        effects: { cashEffect: -15000, reputationEffect: 0.3, patientBoost: -10 },
        consequence: 'Went premium. Lost the bargain hunters but built a reputation that attracted better patients long-term.' },
      { id: 'wait', label: 'Do Nothing — Wait Them Out', icon: '⏳',
        description: 'Corporate practices often burn through cash and leave. But you\'ll bleed patients for 60+ days.',
        effects: { patientBoost: -20, duration: 60 },
        consequence: 'Waited it out. Patient count dropped painfully. Either the competitor folded eventually, or they didn\'t.' },
    ],
  },
  {
    id: 'expansion_choice', day: 150, minDifficulty: 'expert',
    condition: (gs) => gs.patients >= 150 && gs.cash >= 100000,
    title: 'Expansion Crossroads',
    description: 'You\'re maxing out your space. A prime location opened next door. Expand into it ($200K buildout, $4K/mo rent increase) or optimize what you have?',
    options: [
      { id: 'expand', label: 'Expand Next Door', icon: '🏗️',
        description: '$200K buildout + $4K/mo rent. 3 more operatories. Double the capacity, double the overhead.',
        effects: { cashEffect: -200000, rentIncrease: 4000, opsBoost: 3 },
        consequence: 'Expanded the practice. Revenue ceiling went way up — but so did the burn rate. Had to fill those chairs fast.' },
      { id: 'optimize', label: 'Optimize Current Space', icon: '⚙️',
        description: 'Invest $50K in efficiency: better scheduling, premium equipment, extended hours.',
        effects: { cashEffect: -50000, revenueMultiplier: 1.15, duration: 90 },
        consequence: 'Squeezed more out of existing space. Smart and lean, but there\'s a ceiling to how much you can optimize.' },
    ],
  },
  {
    id: 'staff_raise_demand', day: 100, minDifficulty: 'intermediate',
    condition: (gs) => gs.staff.length >= 3,
    title: 'Staff Demanding Raises',
    description: 'Your three longest-tenured staff members came to you together. They want a 15% raise or they\'re leaving. They\'re your best people. Replacing them would cost months of training.',
    options: [
      { id: 'give_raise', label: 'Give the Raises', icon: '💰',
        description: '+15% salary for 3 staff. Overhead goes up but you keep your best people.',
        effects: { salaryIncrease: 0.15, moraleBoost: 20, targetCount: 3 },
        consequence: 'Gave the raises. Overhead jumped but the team was loyal and productive.' },
      { id: 'partial', label: 'Offer 8% + Training', icon: '🎓',
        description: '8% raise + free CE course. Some may accept, one might still leave.',
        effects: { salaryIncrease: 0.08, moraleBoost: 10, targetCount: 3, quitChance: 0.3 },
        consequence: 'Compromised. Most stayed but one felt undervalued.' },
      { id: 'refuse', label: 'Hold the Line', icon: '✋',
        description: 'No raises. 50% chance they follow through and quit. If they stay, morale is shot.',
        effects: { moraleEffect: -15, quitChance: 0.5 },
        consequence: 'Refused the raises. It was a bold stand — either you called their bluff or lost your best people.' },
    ],
  },
  {
    id: 'medicaid_contract', day: 60, minDifficulty: 'intermediate',
    condition: (gs) => (gs.acceptedInsurance || []).length <= 3 && gs.patients < 100,
    title: 'Medicaid Contract Opportunity',
    description: 'The state Medicaid program needs providers in your area. They\'ll guarantee 100+ patients/month but at 35% reimbursement. It would fill your chairs but fundamentally change your practice model.',
    options: [
      { id: 'accept', label: 'Take the Contract', icon: '🏥',
        description: '+100 patients instantly. But 35% reimbursement, massive admin, and your practice becomes a volume shop.',
        effects: { patientBoost: 100, addInsurance: 'medicaid' },
        consequence: 'Took the Medicaid contract. Chairs were full but margins were razor thin. A completely different business model.' },
      { id: 'decline', label: 'Stay the Course', icon: '🚫',
        description: 'Keep building your patient base the hard way. Better margins when it works, but empty chairs hurt.',
        effects: {},
        consequence: 'Turned down Medicaid. The chairs were emptier but the patients you had paid better.' },
    ],
  },
  {
    id: 'tech_investment', day: 110, minDifficulty: 'beginner',
    condition: (gs) => gs.cash > 50000 && !gs.equipment.includes('intraoral_scanner'),
    title: 'Technology Crossroads',
    description: 'Your patients are asking about digital impressions. An iTero rep is offering a lease deal: $800/month for 36 months vs buying outright for $35K. Digital impressions boost satisfaction and treatment acceptance.',
    options: [
      { id: 'buy', label: 'Buy Outright ($35K)', icon: '💵',
        description: 'Own it. Higher upfront cost but no monthly payments. Pays for itself in 6-8 months.',
        effects: { cashEffect: -35000, addEquipment: 'intraoral_scanner' },
        consequence: 'Bought the scanner outright. Big hit to cash but no ongoing lease payments eating into margins.' },
      { id: 'lease', label: 'Lease ($800/mo)', icon: '📋',
        description: 'Lower upfront, but $28.8K over 36 months. Keeps cash available but adds monthly overhead.',
        effects: { addEquipment: 'intraoral_scanner', monthlyOverhead: 800 },
        consequence: 'Leased the scanner. Preserved cash but added another monthly bill to the overhead.' },
      { id: 'wait', label: 'Not Right Now', icon: '⏳',
        description: 'Patients will keep asking. You might lose some to practices that have this tech.',
        effects: { patientBoost: -5, reputationEffect: -0.05 },
        consequence: 'Held off on the tech. Some patients went elsewhere for the "modern" experience.' },
    ],
  },
  // ── Multi-location decisions ──
  {
    id: 'open_second_office', day: 120, minDifficulty: 'expert',
    condition: (gs) => gs.patients >= 120 && gs.cash >= 200000 && gs.reputation >= 3.5 && (!gs.locations || gs.locations.length === 0),
    title: 'Time to Expand?',
    description: 'Your practice is thriving. A commercial space opened up 10 minutes away. Your accountant says you have the cash flow. Your coach says "this is how empires start — or how debt spirals begin."',
    options: [
      { id: 'satellite', label: 'Open Satellite ($150K)', icon: '🏥',
        description: 'Small hygiene-focused office. Low risk way to test expansion. Needs a hygienist and front desk.',
        effects: { openLocation: 'satellite' },
        consequence: 'Opened a satellite office. Revenue potential grew — but so did the management burden.' },
      { id: 'full_branch', label: 'Open Full Branch ($300K)', icon: '🏢',
        description: 'Full practice with associate dentist. Big investment, big potential. Needs a full team.',
        effects: { openLocation: 'full_branch' },
        consequence: 'Opened a full branch office. Major overhead commitment — had to fill those chairs fast.' },
      { id: 'wait', label: 'Not Yet — Keep Optimizing', icon: '⏳',
        description: 'Focus on maximizing the current practice first. Expansion can wait.',
        effects: {},
        consequence: 'Held off on expansion. Focused on profitability. Smart or a missed opportunity?' },
    ],
  },
  {
    id: 'associate_flight_crisis', day: 0, minDifficulty: 'expert',
    condition: (gs) => gs.staff.some(s => s.isAssociate && s.flightRisk === 'critical'),
    title: 'Associate at the Breaking Point',
    description: 'Your top associate is about to leave. They produce significant revenue and patients are attached to them. If they go, they take patients with them.',
    options: [
      { id: 'raise', label: 'Major Raise (+25%)', icon: '💰',
        description: 'Expensive but may buy loyalty. No guarantee they stay long-term.',
        effects: { associateRaise: 0.25 },
        consequence: 'Gave a big raise to keep the associate. Overhead jumped but avoided losing patients.' },
      { id: 'partnership', label: 'Offer Partnership Track', icon: '🤝',
        description: 'Promise equity in 2 years. Costs nothing now but commits you to sharing ownership.',
        effects: { associatePartnership: true },
        consequence: 'Offered a partnership track. The associate felt valued — for now. But you committed to sharing the practice.' },
      { id: 'let_go', label: 'Let Them Go', icon: '🚪',
        description: 'Accept the loss. Start building patient relationships under your brand instead.',
        effects: { associateDepart: true },
        consequence: 'Let the associate leave. Lost patients and momentum, but the practice brand is now stronger than any one doctor.' },
    ],
  },
  {
    id: 'need_regional_manager', day: 0, minDifficulty: 'expert',
    condition: (gs) => (gs.locations || []).length >= 3 && !gs.hasRegionalManager,
    title: 'Your Empire Needs Management',
    description: 'With 4+ locations, you can\'t be everywhere. Staff are confused about policies, supplies are duplicated, and nobody knows who\'s in charge when you\'re not there.',
    options: [
      { id: 'hire_rm', label: 'Hire Regional Manager ($120K/yr)', icon: '🏢',
        description: 'Professional management. Eliminates the efficiency penalty across all locations.',
        effects: { hireRegionalManager: true },
        consequence: 'Hired a Regional Manager. Overhead went up but all locations ran smoother.' },
      { id: 'delay', label: 'I Can Handle It', icon: '💪',
        description: 'Save the salary but all locations continue suffering 15% efficiency loss and morale bleed.',
        effects: {},
        consequence: 'Tried to manage everything personally. Staff morale suffered and efficiency stayed low.' },
    ],
  },
  // ── HMO Strategic Decisions ──
  {
    id: 'hmo_network_expansion', day: 30, minDifficulty: 'beginner',
    condition: (gs) => (gs.acceptedInsurance || []).some(id => { const p = INSURANCE_PLANS.find(pl => pl.id === id); return p?.type === 'hmo'; }),
    title: 'HMO Network Expansion',
    description: 'A large HMO network wants to assign 200 more members to your practice. More capitation revenue, but you\'ll need to hire additional staff to handle the volume.',
    options: [
      { id: 'accept', label: 'Accept 200 Members', icon: '✅',
        description: '+200 patients (HMO). Capitation checks grow significantly. But you must hire or drown in volume.',
        effects: { patientBoost: 200 },
        consequence: 'Accepted the HMO expansion. Capitation checks grew but the volume was intense. Had to staff up fast or quality suffered.' },
      { id: 'decline', label: 'Decline — Stay Manageable', icon: '🚫',
        description: 'Keep current panel size. No extra revenue but no extra risk either.',
        effects: {},
        consequence: 'Declined the expansion. Stayed manageable. The capitation upside was tempting but the staffing risk was real.' },
    ],
  },
  {
    id: 'capitation_renegotiation', day: 60, minDifficulty: 'beginner',
    condition: (gs) => {
      const hmoCount = (gs.acceptedInsurance || []).filter(id => { const p = INSURANCE_PLANS.find(pl => pl.id === id); return p?.type === 'hmo' || p?.type === 'medicaid'; }).length;
      return hmoCount >= 2;
    },
    title: 'Capitation Renegotiation',
    description: 'Your HMO contracts are up for renewal. You can push for 15% higher capitation rates, but there\'s a 40% chance they drop you entirely. Or accept current terms.',
    options: [
      { id: 'negotiate', label: 'Push for 15% More', icon: '💰',
        description: '60% chance of higher rates (+15% capitation). 40% chance they drop your lowest HMO plan entirely.',
        effects: { negotiation: true, successChance: 0.6, successEffects: { capitationBoost: 0.15 }, failEffects: { dropLowestHMO: true } },
        consequence: 'Pushed for higher rates. It was a gamble — either your margins improved or you lost an HMO panel.' },
      { id: 'accept', label: 'Accept Current Terms', icon: '📋',
        description: 'Keep existing rates. Predictable and safe.',
        effects: {},
        consequence: 'Accepted current terms. Predictable income, no surprises.' },
    ],
  },
];

// ─── MULTI-LOCATION EXPANSION SYSTEM ───
// Available on Expert and Hell difficulty (multiOffice: true).
// Each location is a mini-practice with its own staff, patients, equipment.
// One shared bank account. More locations = synergy + overhead.
export const LOCATION_OPTIONS = [
  {
    id: 'satellite', name: 'Satellite Office', icon: '🏥',
    sqft: 1200, rent: 3500, maxOps: 2, setupCost: 150000, buildoutDays: 30,
    description: 'Small secondary location. Low overhead, ideal for hygiene-focused satellite. Start here to test expansion.',
    minReputation: 3.5, minPatients: 100, minCash: 200000,
    staffMinimum: { 'Hygienist': 1, 'Front Desk': 1 },
  },
  {
    id: 'full_branch', name: 'Full Branch Office', icon: '🏢',
    sqft: 2500, rent: 6500, maxOps: 5, setupCost: 300000, buildoutDays: 60,
    description: 'Full second practice with associate dentist. High upfront cost, big revenue potential. Needs a strong team.',
    minReputation: 3.8, minPatients: 150, minCash: 400000,
    staffMinimum: { 'Dentist': 1, 'Hygienist': 1, 'Front Desk': 1, 'Dental Assistant': 1 },
  },
  {
    id: 'premium_branch', name: 'Premium Practice', icon: '🏛️',
    sqft: 3500, rent: 9000, maxOps: 7, setupCost: 500000, buildoutDays: 90,
    description: 'High-end location in an affluent area. Premium patients, premium costs. Only attempt with proven cash flow.',
    minReputation: 4.2, minPatients: 250, minCash: 600000,
    staffMinimum: { 'Dentist': 1, 'Specialist': 1, 'Hygienist': 2, 'Front Desk': 1, 'Dental Assistant': 1 },
  },
];

// Location placement advisor — procedural tips based on location type
export function getLocationAdvice(locationType, existingLocations) {
  const locCount = existingLocations.length;
  const areas = [
    { name: 'Northside', demo: 'Growing families, school district nearby', competition: 'Low — no dental offices within 2 miles', type: 'suburban' },
    { name: 'Downtown', demo: 'Young professionals, lunch-break patients', competition: 'High — 3 practices within walking distance', type: 'urban' },
    { name: 'Westside', demo: 'Retirees and established families', competition: 'Moderate — 1 older practice nearby', type: 'suburban' },
    { name: 'Eastgate', demo: 'Mixed income, underserved area', competition: 'Very low — nearest dentist is 5 miles', type: 'underserved' },
    { name: 'Lakewood', demo: 'Affluent neighborhood, high expectations', competition: 'Moderate — boutique practices nearby', type: 'affluent' },
    { name: 'Riverside', demo: 'New development, rapidly growing population', competition: 'Low — area is still building out', type: 'growth' },
  ];
  const area = areas[(locCount + Date.now()) % areas.length];
  const tips = [];
  tips.push(`Area: ${area.name} — ${area.demo}`);
  tips.push(`Competition: ${area.competition}`);
  if (locationType === 'satellite' && area.type === 'underserved') tips.push('Great fit! Satellites thrive in underserved areas with low competition.');
  if (locationType === 'premium_branch' && area.type !== 'affluent') tips.push('Warning: Premium practices need affluent demographics to sustain high fees.');
  if (locCount >= 2) tips.push('Tip: Don\'t cluster locations too close — cannibalize your own patient base.');
  if (locCount >= 3) tips.push('At 4+ locations you\'ll need a Regional Manager or efficiency drops 15%.');
  return { area: area.name, tips };
}

// ─── BUYING SYNERGY ───
export function getSynergyMultipliers(locationCount) {
  const supplyDiscount = Math.min(0.15, Math.max(0, (locationCount - 1) * 0.05));
  const maintenanceDiscount = locationCount >= 3 ? 0.12 : locationCount >= 2 ? 0.08 : 0;
  const insuranceBonus = Math.min(0.06, Math.max(0, (locationCount - 1) * 0.02));
  const marketingDemandBonus = 1 + Math.max(0, (locationCount - 1) * 0.03);
  return {
    supplies: 1 - supplyDiscount,
    maintenance: 1 - maintenanceDiscount,
    insuranceReimbursementBonus: insuranceBonus,
    marketingDemandBonus,
    supplyDiscountPct: Math.round(supplyDiscount * 100),
    maintenanceDiscountPct: Math.round(maintenanceDiscount * 100),
    insuranceBonusPct: Math.round(insuranceBonus * 100),
  };
}

// ─── REGIONAL MANAGER PENALTY ───
export function getRegionalManagerPenalty(locationCount, hasRegionalManager) {
  if (locationCount <= 3 || hasRegionalManager) return null;
  return {
    efficiencyPenalty: 0.85,
    moralePenalty: -0.2,
    reputationPenalty: -0.005,
    description: 'No regional manager! Your locations are running without coordination — 15% efficiency loss.',
  };
}

// ─── ASSOCIATE MECHANICS ───
// Associates are hired dentists who are NOT the owner. They build patient
// attachment over time — great for revenue but risky if they leave.
// An associate-driven practice has weaker patient loyalty to the brand.

export function updateAssociateLoyalty(associate, gameState) {
  let delta = 0;
  // Tenure comfort
  if (associate.daysEmployed > 90) delta += 0.02;
  if (associate.daysEmployed > 365) delta += 0.01;
  // Pay satisfaction (market rate ~$150K for associates)
  const payRatio = associate.salary / 150000;
  if (payRatio >= 1.2) delta += 0.05;
  else if (payRatio >= 1.0) delta += 0.02;
  else if (payRatio < 0.85) delta -= 0.08;
  // Morale
  if (associate.morale > 70) delta += 0.02;
  if (associate.morale < 40) delta -= 0.05;
  // High producer + underpaid = danger
  const isHighProducer = (associate.productionLast30 || 0) > 40000;
  if (isHighProducer && payRatio < 1.0) delta -= 0.1;
  if (isHighProducer && payRatio >= 1.15) delta += 0.03;
  // Partnership track
  if (associate.partnershipOffered) delta += 0.03;
  // Cash trouble
  if (gameState.cash < 0) delta -= 0.03;
  return Math.max(0, Math.min(100, (associate.loyalty || 65) + delta));
}

export function computeFlightRisk(loyalty) {
  if (loyalty > 80) return 'low';
  if (loyalty > 60) return 'medium';
  if (loyalty > 40) return 'high';
  return 'critical';
}

export function associateDeparture(totalPatients, associate) {
  const attachmentRatio = (associate.patientAttachment || 0) / Math.max(totalPatients, 1);
  const patientsLost = Math.min(
    associate.patientAttachment || 0,
    Math.floor(totalPatients * Math.min(attachmentRatio, 0.25))
  );
  return {
    patientsLost,
    reputationHit: -0.2 - (patientsLost > 20 ? 0.1 : 0),
    moraleHit: -8,
    message: `Dr. ${associate.name} left to start their own practice! They took ${patientsLost} patients.`,
  };
}

// ─── MULTI-LOCATION EVENTS ───
export const MULTI_LOCATION_EVENTS = [
  { id: 'loc_staff_confusion', message: 'Staff at your satellite office are frustrated — "Nobody told us about the new policy!" Coordination breakdown.', type: 'negative', chance: 0.03, moraleEffect: -5,
    condition: (gs) => (gs.locations || []).length >= 2 && !gs.hasRegionalManager },
  { id: 'loc_supply_waste', message: 'Both offices ordered the same supplies independently. $3,000 wasted on duplicates.', type: 'negative', chance: 0.02, cashEffect: -3000,
    condition: (gs) => (gs.locations || []).length >= 1 && !gs.hasRegionalManager },
  { id: 'loc_brand_boost', message: 'Patients love the multiple locations! "You\'re a real established practice." Reputation boost.', type: 'positive', chance: 0.02, reputationEffect: 0.15,
    condition: (gs) => (gs.locations || []).length >= 1 },
  { id: 'loc_emergency_cover', message: 'A provider called in sick — with multiple offices you shifted a hygienist from another location to cover!', type: 'positive', chance: 0.02, reputationEffect: 0.05,
    condition: (gs) => (gs.locations || []).length >= 1 },
  { id: 'loc_associate_networking', message: 'Your associate was spotted at a dental entrepreneurship meetup. They might be planning something...', type: 'warning', chance: 0.02,
    condition: (gs) => gs.staff.some(s => s.isAssociate && computeFlightRisk(s.loyalty || 65) === 'high') },
  { id: 'loc_lease_issue', message: 'Landlord at your second location wants to renegotiate the lease — rent going up 10%.', type: 'negative', chance: 0.015,
    condition: (gs) => (gs.locations || []).length >= 1 },
];

// ─── CALCULATE ALL LOCATION STATS (wrapper) ───
// Calls existing calculateDailyStats for primary + each location, returns aggregate.
export function calculateAllLocationStats(gameState) {
  const primaryStats = calculateDailyStats(gameState);
  const locationCount = 1 + (gameState.locations || []).length;
  const synergy = getSynergyMultipliers(locationCount);
  const rmPenalty = getRegionalManagerPenalty(locationCount, gameState.hasRegionalManager);

  const locationStats = (gameState.locations || []).map(loc => {
    // Skip stats for locations still under construction
    if (loc.buildingDaysLeft && loc.buildingDaysLeft > 0) {
      return {
        locationId: loc.id, locationName: loc.name, underConstruction: true,
        daysLeft: loc.buildingDaysLeft,
        dailyRevenue: 0, totalDailyCosts: Math.round(loc.rent / 30), dailyProfit: -Math.round(loc.rent / 30),
        actualPatients: 0, effectiveCapacity: 0,
      };
    }
    const virtualState = {
      equipment: loc.equipment || [], staff: loc.staff || [],
      reputation: loc.reputation || 3.0, patients: loc.patients || 0,
      activeMarketing: loc.activeMarketing || [], acceptedInsurance: loc.acceptedInsurance || [],
      officeUpgrades: loc.officeUpgrades || [], relationships: loc.relationships || {},
      cleanliness: loc.cleanliness || 50, builtOutRooms: loc.builtOutRooms || [],
      sqft: loc.sqft, maxOps: loc.maxOps, rent: loc.rent,
      debt: 0, interestRate: 0, cash: gameState.cash,
      activeTraining: [], completedTraining: [], trainingCompleteDays: {},
      activeConsultantBuffs: [],
    };
    const stats = calculateDailyStats(virtualState);
    // Apply synergy discounts
    stats.dailySupplies = Math.round(stats.dailySupplies * synergy.supplies);
    stats.dailyMaintenance = Math.round(stats.dailyMaintenance * synergy.maintenance);
    // Apply RM penalty
    if (rmPenalty) {
      stats.dailyRevenue = Math.round(stats.dailyRevenue * rmPenalty.efficiencyPenalty);
    }
    stats.totalDailyCosts = stats.dailySalaries + stats.dailyOverhead + stats.dailyMarketing + stats.dailyUpgradeCosts;
    stats.dailyProfit = stats.dailyRevenue - stats.totalDailyCosts;
    return { locationId: loc.id, locationName: loc.name, ...stats };
  });

  const allStats = [primaryStats, ...locationStats];
  return {
    primary: primaryStats,
    locations: locationStats,
    aggregate: {
      totalDailyRevenue: allStats.reduce((s, st) => s + (st.dailyRevenue || 0), 0),
      totalDailyCosts: allStats.reduce((s, st) => s + (st.totalDailyCosts || 0), 0) + primaryStats.dailyLoanPayment,
      totalDailyProfit: allStats.reduce((s, st) => s + (st.dailyProfit || 0), 0),
      totalPatientsSeen: allStats.reduce((s, st) => s + (st.actualPatients || 0), 0),
      totalCapacity: allStats.reduce((s, st) => s + (st.effectiveCapacity || 0), 0),
      locationCount,
    },
    synergy,
    rmPenalty,
  };
}

// ─── TRAINING PROGRAMS ───
// Training helps offset the negative effects of hiring new staff, growth pressure, etc.
export const TRAINING_PROGRAMS = [
  { id: 'new_hire_orientation', name: 'New Hire Orientation', cost: 2000, duration: 14,
    icon: '📖', description: 'Two-week onboarding for new staff. Reduces friction when adding team members.',
    moraleBoost: 8, skillBoost: 5, newHireOnly: true },
  { id: 'team_building', name: 'Team Building Workshop', cost: 3000, duration: 1,
    icon: '🤝', description: 'Off-site team building day. Improves communication and reduces conflicts.',
    moraleBoost: 12, conflictReduction: 0.5 },
  { id: 'clinical_ce', name: 'Clinical CE Course', cost: 5000, duration: 3,
    icon: '🎓', description: 'Continuing education for clinical staff. Improves skills and procedure quality.',
    skillBoost: 8, revenueBoost: 0.05, clinicalOnly: true },
  { id: 'customer_service', name: 'Customer Service Training', cost: 2500, duration: 2,
    icon: '😊', description: 'Train front-facing staff on patient experience. Boosts satisfaction scores.',
    satisfactionBoost: 10, reputationBoost: 0.1 },
  { id: 'compliance_training', name: 'OSHA & Compliance', cost: 3500, duration: 1,
    icon: '📋', description: 'Annual compliance and safety training. Reduces violation risk.',
    cleanlinessBoost: 10, complianceBoost: true },
  { id: 'leadership', name: 'Leadership Development', cost: 8000, duration: 5,
    icon: '⭐', description: 'Leadership training for senior staff. Reduces turnover, improves team dynamics.',
    moraleBoost: 15, turnoverReduction: 0.3 },
];

// ─── OPPOSING FORCES TIPS ───
// Hints that show the push-pull nature of decisions
export const OPPOSING_FORCES = [
  { action: 'Hiring an Associate', positive: 'More revenue capacity, more procedures available', negative: 'Higher overhead, staff friction, need training program to integrate', tip: 'Run a New Hire Orientation to smooth the transition' },
  { action: 'Heavy Marketing Spend', positive: 'More new patients, faster growth', negative: 'If capacity can\'t keep up: long waits, rushed care, bad reviews', tip: 'Match marketing to your current capacity — don\'t outgrow your chairs' },
  { action: 'Accepting More Insurance', positive: 'Larger patient pool, more volume', negative: 'Lower reimbursement per procedure, more admin work', tip: 'Over time, drop low-paying plans as your reputation builds' },
  { action: 'Premium Equipment', positive: 'Higher revenue procedures, better outcomes', negative: 'Huge upfront cost, expensive maintenance, sitting idle if no patients', tip: 'Buy equipment that matches your current patient volume' },
  { action: 'Larger Space', positive: 'Room to grow, more operatories, impressive to patients', negative: 'Rent bleeds cash every day whether busy or not', tip: 'Revenue per sqft is your key metric — track it closely' },
  { action: 'High Staff Pay', positive: 'Better talent, happier team, lower turnover', negative: 'Overhead ratio climbs, less profit per dollar earned', tip: 'Invest in morale through culture, not just salary' },
  { action: 'Dropping Insurance Plans', positive: 'Higher per-patient revenue, simpler billing', negative: 'Lose access to that patient pool, volume may drop', tip: 'Only drop plans when you have enough demand to fill chairs without them' },
  { action: 'Growing Too Fast', positive: 'Revenue climbs, practice looks successful', negative: 'Quality drops, staff burns out, complaints rise, equipment breaks', tip: 'Sustainable growth > rapid growth every time' },
];

// ─── CONSULTANTS ───
// Expensive advisors that provide boosts IF your practice has the right foundation.
// Each consultant has requirements — if you don't meet them, you waste the money and get a warning.
export const CONSULTANTS = [
  {
    id: 'growth_consultant', name: 'Growth Strategist', cost: 25000, icon: '📈',
    description: 'A high-powered consultant who develops an aggressive patient acquisition strategy. Requires a strong team to execute.',
    successEffect: { patientBoost: 40, reputationBoost: 0.3, duration: 60 },
    failMessage: 'The growth consultant presented a great plan, but your team couldn\'t execute it. Staff were confused and frustrated. Next time, make sure you have the right players in place.',
    failEffect: { moraleEffect: -10, cashWaste: 25000 },
    requirements: [
      { check: 'minStaff', value: 3, label: 'At least 3 staff members', desc: 'Need a team to execute the plan' },
      { check: 'hasDentist', label: 'At least 1 Dentist on staff', desc: 'Can\'t grow without a provider' },
      { check: 'hasFrontDesk', label: 'Front desk staff', desc: 'Someone needs to handle the patient flow' },
      { check: 'hasMarketing', label: 'At least 1 active marketing channel', desc: 'Growth plan needs marketing infrastructure' },
    ],
  },
  {
    id: 'efficiency_consultant', name: 'Operations Efficiency Expert', cost: 35000, icon: '⚙️',
    description: 'Streamlines your workflows and reduces waste. Requires trained staff and decent equipment to implement changes.',
    successEffect: { overheadReduction: 0.15, satisfactionBoost: 10, duration: 90 },
    failMessage: 'The efficiency expert identified major improvements, but your team resisted the changes. Untrained staff couldn\'t adapt to new systems. Invest in training first.',
    failEffect: { moraleEffect: -15, cashWaste: 35000 },
    requirements: [
      { check: 'minStaff', value: 4, label: 'At least 4 staff members', desc: 'Need enough staff to restructure workflows' },
      { check: 'avgMorale', value: 50, label: 'Staff morale above 50', desc: 'Low morale = resistance to change' },
      { check: 'hasTraining', label: 'At least 1 completed training program', desc: 'Staff need baseline training to adopt new processes' },
      { check: 'minEquipment', value: 4, label: 'At least 4 pieces of equipment', desc: 'Need infrastructure to optimize' },
    ],
  },
  {
    id: 'financial_consultant', name: 'Financial Advisor', cost: 15000, icon: '💰',
    description: 'Restructures your finances, negotiates better rates, and identifies waste. Needs financial data (30+ days) to analyze.',
    successEffect: { debtReduction: 50000, interestReduction: 0.005, duration: 0 },
    failMessage: 'The financial advisor couldn\'t help — your practice is too new to analyze. Come back after you\'ve been operating for at least 30 days with some revenue.',
    failEffect: { cashWaste: 15000 },
    requirements: [
      { check: 'minDay', value: 30, label: 'Operating for 30+ days', desc: 'Need financial history to analyze' },
      { check: 'hasRevenue', label: 'Generating daily revenue', desc: 'Need revenue data to optimize' },
      { check: 'hasDebt', label: 'Outstanding debt to restructure', desc: 'No point if you\'re debt-free' },
    ],
  },
  {
    id: 'branding_consultant', name: 'Brand & Reputation Specialist', cost: 20000, icon: '🌟',
    description: 'Transforms your practice image. Requires a clean office and satisfied patients to build on.',
    successEffect: { reputationBoost: 0.5, patientBoost: 25, duration: 45 },
    failMessage: 'The branding specialist toured your office and said "I can\'t put lipstick on this." Fix your cleanliness and patient satisfaction before investing in image.',
    failEffect: { reputationEffect: -0.1, cashWaste: 20000 },
    requirements: [
      { check: 'minCleanliness', value: 60, label: 'Cleanliness above 60', desc: 'Can\'t rebrand a dirty office' },
      { check: 'minReputation', value: 2.5, label: 'Reputation above 2.5 stars', desc: 'Need a foundation to build on' },
      { check: 'minPatients', value: 30, label: 'At least 30 patients', desc: 'Need an existing base for word-of-mouth' },
    ],
  },
  {
    id: 'hr_consultant', name: 'HR & Culture Consultant', cost: 18000, icon: '🤝',
    description: 'Fixes toxic team dynamics and builds culture. Only works if you have enough staff and some existing training investment.',
    successEffect: { moraleBoost: 25, turnoverReduction: 0.5, duration: 60 },
    failMessage: 'The HR consultant found deep issues but couldn\'t make progress. You need more staff and at least one training program completed before culture work can stick.',
    failEffect: { moraleEffect: -5, cashWaste: 18000 },
    requirements: [
      { check: 'minStaff', value: 3, label: 'At least 3 staff members', desc: 'Need a team to build culture with' },
      { check: 'hasTraining', label: 'At least 1 completed training', desc: 'Training shows commitment to development' },
      { check: 'avgMorale', value: 30, label: 'Staff morale above 30', desc: 'Staff too burned out to engage otherwise' },
    ],
  },
  {
    id: 'tech_consultant', name: 'Dental Technology Advisor', cost: 30000, icon: '🖥️',
    description: 'Maximizes ROI on your equipment and identifies technology gaps. Requires existing equipment investment to optimize.',
    successEffect: { revenueBoost: 0.1, equipmentEfficiency: 0.2, duration: 90 },
    failMessage: 'The tech advisor looked around and said "There\'s nothing here to optimize." You need more equipment and operatories before tech consulting makes sense.',
    failEffect: { cashWaste: 30000 },
    requirements: [
      { check: 'minEquipment', value: 5, label: 'At least 5 pieces of equipment', desc: 'Need a tech stack to optimize' },
      { check: 'minOps', value: 2, label: 'At least 2 operatories', desc: 'Need multiple ops to improve workflow' },
      { check: 'hasSpecialtyEquip', label: 'At least 1 specialty/diagnostic item', desc: 'Need advanced equipment to maximize' },
    ],
  },
];

// Check if consultant requirements are met
export function checkConsultantRequirements(consultant, gameState, stats) {
  const results = [];
  for (const req of consultant.requirements) {
    let met = false;
    switch (req.check) {
      case 'minStaff': met = gameState.staff.length >= req.value; break;
      case 'hasDentist': met = gameState.staff.some(s => s.role === 'Dentist' || s.role === 'Specialist'); break;
      case 'hasFrontDesk': met = gameState.staff.some(s => s.role === 'Front Desk' || s.role === 'Office Manager'); break;
      case 'hasMarketing': met = (gameState.activeMarketing || []).length > 0; break;
      case 'avgMorale': {
        const avg = gameState.staff.length > 0 ? gameState.staff.reduce((s, m) => s + m.morale, 0) / gameState.staff.length : 0;
        met = avg >= req.value; break;
      }
      case 'hasTraining': met = (gameState.completedTraining || []).length > 0; break;
      case 'minEquipment': met = gameState.equipment.length >= req.value; break;
      case 'minDay': met = gameState.day >= req.value; break;
      case 'hasRevenue': met = stats.dailyRevenue > 0; break;
      case 'hasDebt': met = gameState.debt > 0; break;
      case 'minCleanliness': met = (gameState.cleanliness || 50) >= req.value; break;
      case 'minReputation': met = gameState.reputation >= req.value; break;
      case 'minPatients': met = gameState.patients >= req.value; break;
      case 'minOps': {
        const ops = (gameState.builtOutRooms || []).filter(r => r === 'basic_ops' || r === 'premium_ops').length;
        met = ops >= req.value; break;
      }
      case 'hasSpecialtyEquip': {
        met = gameState.equipment.some(eq => {
          const def = EQUIPMENT.find(e => e.id === eq);
          return def && (def.category === 'specialty' || def.category === 'diagnostic');
        }); break;
      }
      default: met = true;
    }
    results.push({ ...req, met });
  }
  return results;
}

// ─── CHALLENGE MODE (Seed-Based) ───
// Generates a deterministic seed so two players get the same random events, candidates, and market conditions.
// Players make different decisions but face the same world.

// Simple seeded PRNG (mulberry32)
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Generate a short shareable challenge code
export function generateChallengeCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// Convert a challenge code to a numeric seed
export function codeToSeed(code) {
  let seed = 0;
  for (let i = 0; i < code.length; i++) {
    seed = (seed * 31 + code.charCodeAt(i)) | 0;
  }
  return Math.abs(seed);
}

// Generate the predetermined events schedule for a challenge season
// This creates a list of "what happens on each day" so both players face identical conditions
export function generateChallengeSchedule(seed, gameDuration, difficultyId) {
  const rng = mulberry32(seed);
  const schedule = {};

  for (let day = 1; day <= gameDuration; day++) {
    const dayEvents = [];

    // Determine if a random event fires today (same roll for both players)
    const eventRoll = rng();
    const eventIndex = Math.floor(rng() * RANDOM_EVENTS.length);
    if (eventRoll < 0.08) { // ~8% chance per day
      dayEvents.push({ type: 'random_event', eventIndex });
    }

    // Expert events on expert difficulty
    if (difficultyId === 'expert') {
      const expertRoll = rng();
      const expertIndex = Math.floor(rng() * EXPERT_EVENTS.length);
      if (expertRoll < 0.04) {
        dayEvents.push({ type: 'expert_event', eventIndex: expertIndex });
      }
    }

    // Equipment breakdown roll
    const breakdownRoll = rng();
    if (breakdownRoll < 0.02) {
      dayEvents.push({ type: 'equipment_breakdown' });
    }

    // Rent increase chance
    if (day % 90 === 0 && rng() < 0.3) {
      dayEvents.push({ type: 'rent_increase', amount: 0.05 + rng() * 0.1 });
    }

    if (dayEvents.length > 0) {
      schedule[day] = dayEvents;
    }
  }

  return schedule;
}

// Generate predetermined staff candidates for a challenge
// Both players see the exact same candidates at the same times
export function generateChallengeCandidates(seed, count) {
  const rng = mulberry32(seed + 1000); // offset seed for candidates
  const candidates = [];
  for (let i = 0; i < count; i++) {
    const templateIndex = Math.floor(rng() * STAFF_TEMPLATES.length);
    const template = STAFF_TEMPLATES[templateIndex];
    const skill = Math.floor(rng() * (template.skillRange[1] - template.skillRange[0])) + template.skillRange[0];
    const attitude = Math.floor(rng() * 60) + 40;
    const reliability = Math.floor(rng() * 50) + 50;
    const salaryVariance = rng() * 0.3 - 0.15;
    const salary = Math.round(template.baseSalary * (1 + salaryVariance));
    const firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    candidates.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      role: template.role, icon: template.icon,
      skill, attitude, reliability, salary,
      canSeePatients: template.canSeePatients || false,
      patientsPerDay: template.patientsPerDay || 0,
      morale: 60 + Math.floor(rng() * 30),
      daysEmployed: 0,
    });
  }
  return candidates;
}

// Save/load challenge results for comparison
const CHALLENGE_KEY = 'dental_tycoon_challenges';

export function saveChallenge(challengeCode, playerName, result) {
  try {
    const challenges = JSON.parse(localStorage.getItem(CHALLENGE_KEY) || '{}');
    if (!challenges[challengeCode]) challenges[challengeCode] = [];
    challenges[challengeCode].push({
      playerName,
      date: new Date().toISOString(),
      ...result,
    });
    localStorage.setItem(CHALLENGE_KEY, JSON.stringify(challenges));
  } catch { /* storage full */ }
}

export function getChallengeResults(challengeCode) {
  try {
    const challenges = JSON.parse(localStorage.getItem(CHALLENGE_KEY) || '{}');
    return challenges[challengeCode] || [];
  } catch { return []; }
}

export function getAllChallenges() {
  try {
    return JSON.parse(localStorage.getItem(CHALLENGE_KEY) || '{}');
  } catch { return {}; }
}

// Generate post-season feedback based on performance
export function generateSeasonFeedback(gameState, stats, difficulty) {
  const feedback = [];
  const score = calculateScore(gameState, stats);
  if (!score) return feedback;

  // Overhead analysis
  if (score.grades.overhead.score >= 80) {
    feedback.push({ area: 'Overhead Control', grade: score.grades.overhead.grade, type: 'strength',
      text: 'You kept your overhead under control. This is the #1 factor in practice profitability.' });
  } else if (score.grades.overhead.score < 50) {
    feedback.push({ area: 'Overhead Control', grade: score.grades.overhead.grade, type: 'weakness',
      text: `Your overhead ratio was ${score.metrics.overheadRatio}%. Target is under 60%. You may have too much staff, space, or equipment relative to revenue.` });
  }

  // Profit analysis
  if (score.grades.profitMargin.score >= 80) {
    feedback.push({ area: 'Profitability', grade: score.grades.profitMargin.grade, type: 'strength',
      text: 'Strong profit margins. You balanced revenue growth with cost control effectively.' });
  } else if (score.grades.profitMargin.score < 50) {
    feedback.push({ area: 'Profitability', grade: score.grades.profitMargin.grade, type: 'weakness',
      text: `Profit margin was only ${score.metrics.profitMargin}%. Revenue per patient may be too low (bad insurance mix?) or costs too high.` });
  }

  // Revenue per sqft
  if (score.grades.revenuePerSqft.score >= 75) {
    feedback.push({ area: 'Space Utilization', grade: score.grades.revenuePerSqft.grade, type: 'strength',
      text: 'Good revenue per square foot. Your space is being used efficiently.' });
  } else if (score.grades.revenuePerSqft.score < 40) {
    feedback.push({ area: 'Space Utilization', grade: score.grades.revenuePerSqft.grade, type: 'weakness',
      text: `Only $${score.metrics.revenuePerSqft}/sqft/year. You may have too much space for your patient volume. Consider a smaller office next time.` });
  }

  // Reputation
  if (score.grades.reputation.score >= 85) {
    feedback.push({ area: 'Reputation', grade: score.grades.reputation.grade, type: 'strength',
      text: 'Excellent reputation! Patients love your practice. This drives cash patient growth.' });
  } else if (score.grades.reputation.score < 50) {
    feedback.push({ area: 'Reputation', grade: score.grades.reputation.grade, type: 'weakness',
      text: 'Low reputation hurts patient acquisition and blocks premium insurance plans. Focus on satisfaction, cleanliness, and not overbooking.' });
  }

  // Satisfaction
  if (score.grades.satisfaction.score >= 70) {
    feedback.push({ area: 'Patient Satisfaction', grade: score.grades.satisfaction.grade, type: 'strength',
      text: 'Patients are happy. Good staff attitudes and office quality make the difference.' });
  } else if (score.grades.satisfaction.score < 40) {
    feedback.push({ area: 'Patient Satisfaction', grade: score.grades.satisfaction.grade, type: 'weakness',
      text: 'Patient satisfaction is low. This comes from staff attitude, wait times, cleanliness, and overbooking.' });
  }

  // Insurance mix analysis
  const accepted = gameState.acceptedInsurance || [];
  const hmoCount = accepted.filter(id => {
    const p = INSURANCE_PLANS.find(plan => plan.id === id);
    return p && (p.type === 'hmo' || p.type === 'medicaid');
  }).length;
  if (accepted.length >= 5) {
    feedback.push({ area: 'Insurance Strategy', grade: 'C', type: 'tip',
      text: 'You accepted too many insurance plans. This increases admin costs and cannibalizes your cash patients. Be more selective.' });
  }
  if (hmoCount >= 2 && gameState.staff.length < 5) {
    feedback.push({ area: 'HMO Strategy', grade: 'D', type: 'tip',
      text: 'HMO understaffed. Volume without capacity = burnout and lost revenue. You needed more assistants and front desk to make the volume play work.' });
  }
  if (hmoCount >= 2 && gameState.staff.length >= 5 && overheadRatio < 0.65) {
    feedback.push({ area: 'HMO Strategy', grade: 'B', type: 'strength',
      text: 'High-volume HMO practice — thin margins but large panel. Capitation checks kept you afloat. Well staffed and lean.' });
  }
  if (hmoCount >= 1 && hmoCount < 3 && accepted.filter(id => { const p = INSURANCE_PLANS.find(plan => plan.id === id); return p?.type === 'ppo'; }).length >= 2) {
    feedback.push({ area: 'Insurance Mix', grade: 'B', type: 'tip',
      text: 'Smart mix — PPO margins funded growth while HMO filled chairs. This balance is hard to maintain but rewarding when it works.' });
  }
  if (accepted.includes('cash_only') && accepted.length > 3) {
    feedback.push({ area: 'Cash vs Insurance', grade: 'C', type: 'tip',
      text: 'You had cash patients but also many insurance plans. Those insurance plans were stealing your cash patients (cannibalization). Pick a lane.' });
  }

  // Staffing analysis
  if (gameState.staff.length === 0) {
    feedback.push({ area: 'Staffing', grade: 'F', type: 'weakness',
      text: 'You ended with no staff. A practice cannot run without people.' });
  } else {
    const avgMorale = gameState.staff.reduce((s, m) => s + m.morale, 0) / gameState.staff.length;
    if (avgMorale < 35) {
      feedback.push({ area: 'Staff Morale', grade: 'D', type: 'weakness',
        text: `Average morale was ${Math.round(avgMorale)}. Burned-out staff quit, make mistakes, and drive patients away. Invest in training and culture.` });
    }
  }

  // Cash position
  if (gameState.cash < 0) {
    feedback.push({ area: 'Cash Management', grade: 'F', type: 'weakness',
      text: `You ended in the red ($${gameState.cash.toLocaleString()}). The #1 reason practices fail is running out of cash before revenue catches up.` });
  } else if (gameState.cash > 200000) {
    feedback.push({ area: 'Cash Management', grade: 'A', type: 'strength',
      text: 'Healthy cash reserves. You avoided the cash spiral that kills most startups.' });
  }

  // ── REAL-WORLD DENTAL PRACTICE TIPS ──
  // Always add 2-3 actionable tips based on what happened in their game
  const tips = [];

  // Revenue per patient benchmark
  const revPerPatient = gameState.patients > 0 ? Math.round((stats.dailyRevenue * 365) / gameState.patients) : 0;
  if (revPerPatient < 400) {
    tips.push('Real-world benchmark: the average dental practice generates $500-$750 per patient of record annually. Your revenue per patient is low — focus on case acceptance and treatment planning.');
  } else if (revPerPatient > 600) {
    tips.push('Your revenue per patient is strong. In real practices, this comes from thorough exams, proper diagnosis, and a hygiene department that hands off treatment opportunities to the doctor.');
  }

  // Hygiene/doctor balance
  const hasDentist = gameState.staff.some(s => s.role === 'Dentist' || s.role === 'Specialist');
  const hasHygienist = gameState.staff.some(s => s.role === 'Hygienist');
  if (hasDentist && !hasHygienist) {
    tips.push('You have a doctor but no hygienist. In a real practice, the hygiene department is your pipeline — hygienists clean teeth, identify issues, and hand off treatment to the doctor. Without hygiene, you\'re leaving money on the table.');
  }
  if (hasHygienist && hasDentist) {
    tips.push('Good setup: hygienist + doctor is the core revenue engine. In real practices, a solid hygiene recall program generates 30-40% of total revenue and feeds treatment opportunities to the doctor through exams.');
  }

  // Marketing → Front Desk → Hygiene → Doctor pipeline
  const hasFrontDesk = gameState.staff.some(s => s.role === 'Front Desk' || s.role === 'Office Manager');
  const hasMarketing = (gameState.activeMarketing || []).length > 0;
  if (hasMarketing && !hasFrontDesk) {
    tips.push('You invested in marketing but have no front desk staff. In reality, marketing dollars are wasted if nobody answers the phone. The patient journey is: Marketing → Phone Call → Front Desk → Hygienist → Doctor. Break any link and patients are lost.');
  }
  if (!hasMarketing && gameState.patients < 50) {
    tips.push('No marketing with a small patient base is a slow death. New practices need aggressive marketing to build patient volume. Word of mouth alone takes 2-3 years to sustain a practice.');
  }

  // Insurance float reality
  if (gameState.day <= 60) {
    tips.push('Early cash crunch is normal. In real dental startups, insurance reimbursements take 30-45 days. You\'re treating patients today but won\'t see the money for a month. Smart owners budget 3-6 months of operating expenses as reserves.');
  }

  // Debt management
  if (gameState.debt > 0 && gameState.debt > gameState.cash * 3) {
    tips.push('Your debt-to-cash ratio is concerning. In real practice acquisitions, banks typically want to see the practice generating enough to cover loan payments within 12-18 months. Prioritize revenue growth over expansion.');
  }

  // Add top 2-3 tips to feedback
  tips.slice(0, 3).forEach(tip => {
    feedback.push({ area: 'Real-World Tip', type: 'tip', text: tip });
  });

  return feedback;
}

// Compare two challenge results and generate comparison insights
export function compareChallengeResults(result1, result2) {
  const comparisons = [];

  // Overall score
  const scoreDiff = (result1.overallScore || 0) - (result2.overallScore || 0);
  comparisons.push({
    category: 'Overall Score',
    p1: result1.overallScore || 0, p2: result2.overallScore || 0,
    winner: scoreDiff > 0 ? 1 : scoreDiff < 0 ? 2 : 0,
    insight: Math.abs(scoreDiff) > 20 ? 'Significant gap — very different management styles led to very different outcomes.' :
             Math.abs(scoreDiff) > 10 ? 'Moderate difference — a few key decisions separated the scores.' :
             'Close match! Both players managed similarly.',
  });

  // Overhead
  comparisons.push({
    category: 'Overhead Ratio',
    p1: result1.overheadRatio || 0, p2: result2.overheadRatio || 0,
    winner: (result1.overheadRatio || 100) < (result2.overheadRatio || 100) ? 1 : 2,
    format: 'percent_lower_better',
    insight: Math.abs((result1.overheadRatio || 0) - (result2.overheadRatio || 0)) > 15
      ? 'Big overhead difference — one player ran much leaner. Staff count and space size are the usual culprits.'
      : 'Similar overhead management.',
  });

  // Final cash
  comparisons.push({
    category: 'Final Cash',
    p1: result1.finalCash || 0, p2: result2.finalCash || 0,
    winner: (result1.finalCash || 0) > (result2.finalCash || 0) ? 1 : 2,
    format: 'currency',
  });

  // Patients
  comparisons.push({
    category: 'Final Patients',
    p1: result1.finalPatients || 0, p2: result2.finalPatients || 0,
    winner: (result1.finalPatients || 0) > (result2.finalPatients || 0) ? 1 : 2,
  });

  // Reputation
  comparisons.push({
    category: 'Final Reputation',
    p1: result1.finalReputation || 0, p2: result2.finalReputation || 0,
    winner: (result1.finalReputation || 0) > (result2.finalReputation || 0) ? 1 : 2,
    format: 'stars',
  });

  // Staff count
  comparisons.push({
    category: 'Staff Size',
    p1: result1.staffCount || 0, p2: result2.staffCount || 0,
    winner: 0, // no winner — just different strategies
    insight: (result1.staffCount || 0) !== (result2.staffCount || 0)
      ? 'Different staffing strategies. More staff = more capacity but higher overhead.'
      : 'Same team size.',
  });

  // Insurance strategy
  comparisons.push({
    category: 'Insurance Plans',
    p1: result1.insuranceCount || 0, p2: result2.insuranceCount || 0,
    winner: 0,
    insight: (result1.insuranceCount || 0) !== (result2.insuranceCount || 0)
      ? 'Different insurance strategies. More plans = more volume but lower per-patient revenue and cash cannibalization.'
      : 'Same insurance approach.',
  });

  return comparisons;
}

// ─── LEADERBOARD ───
const LEADERBOARD_KEY = 'dental_tycoon_leaderboard';

export function getLeaderboard() {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function saveToLeaderboard(entry) {
  const board = getLeaderboard();
  board.push({
    ...entry,
    date: new Date().toISOString(),
    id: Date.now(),
  });
  // Sort by overall score descending, keep top 20
  board.sort((a, b) => b.overallScore - a.overallScore);
  const trimmed = board.slice(0, 20);
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
  } catch { /* storage full */ }
  return trimmed;
}

export function clearLeaderboard() {
  localStorage.removeItem(LEADERBOARD_KEY);
}

export function getLeaderboardByMode(modeName) {
  return getLeaderboard().filter(e => e.difficulty === modeName).sort((a, b) => b.overallScore - a.overallScore);
}

export function getLeaderboardModes() {
  const board = getLeaderboard();
  return [...new Set(board.map(e => e.difficulty).filter(Boolean))];
}

// ─── BUILDOUT / SPACE ───
export const BUILDOUT_COST_PER_SQFT = 225; // $200-250 range
export const REVENUE_PER_SQFT_TARGET = 150; // annual revenue per sqft benchmark
export const INSURANCE_REIMBURSEMENT_DELAY = 30; // days before insurance payments start coming in
export const CREDENTIALING_DAYS = 14; // days to credential with a new insurance carrier

export const SPACE_OPTIONS = [
  { id: 'tiny', name: 'Small Suite', sqft: 1000, rent: 2500, maxOps: 2,
    baseBuildoutCost: 125000, // lease deposit, permits, plumbing, electrical, HVAC, IT
    description: 'A modest 1,000 sqft suite in a strip mall. Low overhead, but very limited space. You\'ll cap out quickly if things go well.',
    pros: 'Low rent, low risk', cons: 'No room to expand, max 2 operatories' },
  { id: 'small', name: 'Standard Office', sqft: 1800, rent: 4500, maxOps: 4,
    baseBuildoutCost: 200000,
    description: '1,800 sqft in a medical building. Enough for a solid solo practice with room for 1-2 associates.',
    pros: 'Balanced cost, room for 4 ops', cons: 'May outgrow it in 2-3 years' },
  { id: 'medium', name: 'Professional Space', sqft: 3000, rent: 7500, maxOps: 6,
    baseBuildoutCost: 325000,
    description: '3,000 sqft standalone space. Built for growth. But $7,500/mo rent bleeds cash fast with no patients.',
    pros: '6 ops, room for full team', cons: '$90K/yr rent burns cash fast at startup' },
  { id: 'large', name: 'Large Practice', sqft: 5000, rent: 12000, maxOps: 10,
    baseBuildoutCost: 550000,
    description: '5,000 sqft prime location. A gamble — massive potential but $12K/mo rent with zero patients could bankrupt you in months.',
    pros: '10 ops, massive revenue ceiling', cons: '$144K/yr rent — you WILL lose money for months' },
];

export const BUILDOUT_ITEMS = [
  { id: 'basic_ops', name: 'Basic Operatory Buildout', costPerSqft: 350, sqftNeeded: 130, icon: '🔨', description: 'Plumbing, electrical, cabinetry, flooring for one operatory. ~$45K each.', required: true },
  { id: 'premium_ops', name: 'Premium Operatory Buildout', costPerSqft: 475, sqftNeeded: 160, icon: '✨', description: 'High-end finishes, extra storage, better ergonomics. ~$76K each.' },
  { id: 'waiting_area', name: 'Waiting Area', costPerSqft: 225, sqftNeeded: 200, icon: '🛋️', description: 'Reception desk, seating, check-in area. ~$45K', required: true, satisfactionBonus: 5 },
  { id: 'premium_waiting', name: 'Premium Waiting Area', costPerSqft: 375, sqftNeeded: 300, icon: '💎', description: 'Upscale waiting with beverage bar, TVs, kids area. ~$112K', satisfactionBonus: 20 },
  { id: 'sterilization', name: 'Sterilization Center', costPerSqft: 350, sqftNeeded: 100, icon: '🧼', description: 'Dedicated sterilization and instrument processing. ~$35K', required: true, cleanlinessBonus: 15 },
  { id: 'lab', name: 'In-House Lab', costPerSqft: 400, sqftNeeded: 150, icon: '🔬', description: 'On-site lab for quicker crown turnaround. ~$60K', revenueBonus: 200 },
  { id: 'xray_room', name: 'X-Ray Suite', costPerSqft: 450, sqftNeeded: 80, icon: '📡', description: 'Dedicated imaging room with lead lining. ~$36K' },
  { id: 'break_room', name: 'Staff Break Room', costPerSqft: 225, sqftNeeded: 120, icon: '☕', description: 'Kitchen and lounge for staff. ~$27K', moraleBonus: 10 },
  { id: 'private_office', name: 'Private Office', costPerSqft: 275, sqftNeeded: 100, icon: '🏢', description: 'Doctor\'s private office. ~$27K', moraleBonus: 5 },
  { id: 'consultation', name: 'Consultation Room', costPerSqft: 300, sqftNeeded: 100, icon: '💬', description: 'Private room for treatment planning. ~$30K', satisfactionBonus: 8, revenueBonus: 100 },
];

// ─── EQUIPMENT ───
export const EQUIPMENT = [
  // Operatory chairs — these determine patient capacity
  { id: 'basic_chair', name: 'Basic Dental Chair', cost: 15000, patientsPerDay: 4, icon: '🦷', category: 'operatory', maintenanceCost: 50, breakdownChance: 0.03,
    description: 'Functional but basic. Gets the job done. Patients won\'t complain, but won\'t be impressed.' },
  { id: 'premium_chair', name: 'Premium Dental Chair', cost: 35000, patientsPerDay: 6, icon: '💺', category: 'operatory', maintenanceCost: 80, breakdownChance: 0.02, satisfactionBonus: 5,
    description: 'Ergonomic design, memory foam, patient controls. Better throughput and comfort.' },
  { id: 'elite_chair', name: 'Elite Operatory Suite', cost: 75000, patientsPerDay: 8, icon: '👑', category: 'operatory', maintenanceCost: 150, breakdownChance: 0.015, satisfactionBonus: 10,
    description: 'Top-of-the-line. Built-in monitor, massage, heated seats. Patients feel like VIPs. Massive revenue per chair.' },
  // Diagnostic
  { id: 'xray', name: 'Digital X-Ray', cost: 25000, revenueBonus: 150, icon: '📡', category: 'diagnostic', maintenanceCost: 100, breakdownChance: 0.02,
    description: 'Essential for diagnosis. Opens up fillings, crowns, root canals.' },
  { id: 'panoramic_xray', name: 'Panoramic X-Ray (Pano)', cost: 60000, revenueBonus: 300, icon: '🖥️', category: 'diagnostic', maintenanceCost: 200, breakdownChance: 0.025,
    description: 'Full-mouth imaging. Needed for implant planning, ortho cases, and complex treatment.' },
  { id: 'cbct', name: 'CBCT 3D Scanner', cost: 150000, revenueBonus: 600, icon: '🔬', category: 'diagnostic', maintenanceCost: 400, breakdownChance: 0.03,
    description: '3D cone beam imaging. Premium diagnostic tool. Huge revenue but expensive to maintain.' },
  { id: 'intraoral_camera', name: 'Intraoral Camera', cost: 4000, revenueBonus: 100, icon: '📸', category: 'diagnostic', maintenanceCost: 15, breakdownChance: 0.01, satisfactionBonus: 5,
    description: 'Shows patients what you see. Increases treatment acceptance and trust.' },
  { id: 'intraoral_scanner', name: 'Intraoral Scanner (iTero)', cost: 35000, revenueBonus: 250, icon: '🔍', category: 'diagnostic', maintenanceCost: 100, breakdownChance: 0.02, satisfactionBonus: 8,
    description: 'Digital impressions. No more goop. Patients love it. Pairs with CEREC for same-day crowns.' },
  // Essential
  { id: 'sterilizer', name: 'Sterilizer/Autoclave', cost: 8000, icon: '🧼', category: 'essential', maintenanceCost: 30, breakdownChance: 0.02, cleanlinessBonus: 10,
    description: 'REQUIRED for any practice. Sterilizes instruments between patients.' },
  { id: 'autoclave', name: 'Premium Autoclave System', cost: 18000, icon: '♨️', category: 'essential', maintenanceCost: 60, breakdownChance: 0.015, cleanlinessBonus: 20,
    description: 'Fast-cycle autoclave with tracking. Better compliance, faster turnaround.' },
  { id: 'air_purifier', name: 'HEPA Air Purification', cost: 6000, icon: '🌀', category: 'essential', maintenanceCost: 30, breakdownChance: 0.005, cleanlinessBonus: 12, satisfactionBonus: 3,
    description: 'Medical-grade air filtration. Reduces airborne contaminants.' },
  { id: 'compressor', name: 'Dental Air Compressor', cost: 5000, icon: '💨', category: 'essential', maintenanceCost: 40, breakdownChance: 0.02,
    description: 'Powers your handpieces. Without this, your drills don\'t work.' },
  // Specialty — high revenue, high cost
  { id: 'laser', name: 'Soft Tissue Laser', cost: 45000, revenueBonus: 400, icon: '✨', category: 'specialty', maintenanceCost: 150, breakdownChance: 0.025,
    description: 'Gum treatments, frenectomies, whitening boost. Specialists love these.' },
  { id: 'hard_laser', name: 'Hard Tissue Laser (Waterlase)', cost: 90000, revenueBonus: 600, icon: '⚡', category: 'specialty', maintenanceCost: 250, breakdownChance: 0.03,
    description: 'Can drill teeth without anesthetic in some cases. Huge patient appeal. Very expensive.' },
  { id: 'cerec', name: 'CEREC Milling Machine', cost: 140000, revenueBonus: 900, icon: '🏭', category: 'specialty', maintenanceCost: 400, breakdownChance: 0.035,
    description: 'Same-day crowns, inlays, onlays. No temporary, no second visit. Revenue machine but costly to maintain.' },
  { id: 'cad_cam', name: 'CAD/CAM Design System', cost: 80000, revenueBonus: 500, icon: '🖨️', category: 'specialty', maintenanceCost: 250, breakdownChance: 0.025,
    description: 'Digital treatment design. Pairs with CEREC for full digital workflow.' },
  // Cosmetic
  { id: 'whitening_system', name: 'Zoom Whitening System', cost: 12000, revenueBonus: 200, icon: '💎', category: 'cosmetic', maintenanceCost: 40, breakdownChance: 0.01,
    description: 'In-office whitening. High-margin procedure. Patients ask for it by name.' },
  // Comfort — satisfaction focused
  { id: 'nitrous', name: 'Nitrous Oxide System', cost: 5000, revenueBonus: 100, satisfactionBonus: 10, icon: '😶‍🌫️', category: 'comfort', maintenanceCost: 25, breakdownChance: 0.01,
    description: 'Laughing gas. Reduces anxiety. Huge patient satisfaction boost.' },
  { id: 'tv_ceilings', name: 'Ceiling-Mounted TVs', cost: 3000, satisfactionBonus: 15, icon: '📺', category: 'comfort', maintenanceCost: 10, breakdownChance: 0.005,
    description: 'Netflix during your filling. Patients love the distraction.' },
  { id: 'massage_chairs', name: 'Massage Waiting Chairs', cost: 8000, satisfactionBonus: 12, icon: '💆', category: 'comfort', maintenanceCost: 20, breakdownChance: 0.01,
    description: 'Premium waiting experience. First impression matters.' },
];

// ─── STAFF PERSONALITIES ───
export const STAFF_PERSONALITIES = [
  { id: 'rockstar', name: 'The Rockstar', icon: '⭐', desc: 'Top performer but knows it',
    skillMod: 15, attitudeMod: -10, reliabilityMod: 0, salaryMod: 0.25,
    trainable: true, // coaching can fix the ego
    strength: 'Exceptional clinical skills — patients request them by name',
    weakness: 'Ego — clashes with team, expects special treatment',
    redFlag: null },
  { id: 'reliable', name: 'Steady Eddie', icon: '🐢', desc: 'Never calls in sick, never wows you',
    skillMod: -5, attitudeMod: 10, reliabilityMod: 20, salaryMod: 0,
    trainable: true, // can develop skills with training
    strength: 'Never misses a day — rock-solid dependability',
    weakness: 'Won\'t go above and beyond — does the minimum',
    redFlag: null },
  { id: 'newgrad', name: 'Fresh Graduate', icon: '🎓', desc: 'Cheap, eager, needs training',
    skillMod: -20, attitudeMod: 15, reliabilityMod: -5, salaryMod: -0.20,
    trainable: true, // best ROI on training investment
    strength: 'Low salary, eager to learn — best training ROI',
    weakness: 'Slow, makes mistakes early, needs supervision',
    redFlag: null },
  { id: 'veteran', name: 'Old Guard', icon: '👴', desc: '20 years experience, set in their ways',
    skillMod: 10, attitudeMod: -15, reliabilityMod: 10, salaryMod: 0.15,
    trainable: false, // set in their ways, won't change
    strength: 'Deep experience — handles complex cases with ease',
    weakness: 'Resists change — "we\'ve always done it this way"',
    redFlag: null },
  { id: 'drama', name: 'Office Gossip', icon: '🗣️', desc: 'Great with patients, toxic backstage',
    skillMod: 0, attitudeMod: -20, reliabilityMod: -10, salaryMod: 0,
    trainable: false, // drama is personality, not a skill gap
    strength: 'Patients absolutely love them',
    weakness: 'Drags down team morale with drama and gossip',
    redFlag: 'Multiple short stints on resume' },
  { id: 'overqualified', name: 'Overqualified', icon: '🎯', desc: 'Why do they want THIS job?',
    skillMod: 20, attitudeMod: 5, reliabilityMod: -15, salaryMod: 0.30,
    trainable: false, // doesn't need training, needs a challenge
    strength: 'Exceptional abilities across the board',
    weakness: 'Will leave for a better offer — flight risk',
    redFlag: 'May quit after 30-60 days' },
  { id: 'warmBody', name: 'Warm Body', icon: '🫠', desc: 'Shows up. That\'s about it.',
    skillMod: -15, attitudeMod: -10, reliabilityMod: -15, salaryMod: -0.15,
    trainable: false, // fundamentally checked out
    strength: 'Cheap and available immediately',
    weakness: 'Low skill, low effort, low reliability',
    redFlag: 'You get what you pay for' },
  { id: 'pleaser', name: 'People Pleaser', icon: '😊', desc: 'Will say yes to everything',
    skillMod: -5, attitudeMod: 20, reliabilityMod: 5, salaryMod: -0.05,
    trainable: true, // can build confidence with training
    strength: 'Great bedside manner, keeps the peace',
    weakness: 'Avoids conflict, won\'t push back when needed',
    redFlag: null },
  { id: 'hustler', name: 'The Hustler', icon: '💪', desc: 'Works hard, plays hard',
    skillMod: 5, attitudeMod: 5, reliabilityMod: -10, salaryMod: 0.10,
    trainable: true, // coaching helps channel the energy
    strength: 'High productivity — gets through patients fast',
    weakness: 'Cuts corners when busy, occasional mistakes',
    redFlag: null },
  { id: 'entitled', name: 'The Entitled One', icon: '👑', desc: 'Expects special treatment',
    skillMod: 5, attitudeMod: -25, reliabilityMod: 0, salaryMod: 0.20,
    trainable: false, // entitlement is core personality
    strength: 'Competent when happy and getting their way',
    weakness: 'Constant complaints, demands raises, poisons culture',
    redFlag: 'Will demand a raise within 30 days' },
];

const STAFF_QUIRKS = [
  'Always 5 minutes late', 'Brings donuts on Fridays', 'Checks phone constantly',
  'Hums while working', 'Extremely organized', 'Forgets to clock out',
  'Takes hour-long lunches', 'First one in, last one out', 'Calls in sick on Mondays',
  'Overshares personal life', 'Keeps desk spotless', 'Leaves passive-aggressive notes',
  'Always has coffee in hand', 'Plays music too loud', 'Volunteers for everything',
  'Disappears during lunch rush', 'Remembers every patient\'s name', 'Complains about parking',
  'Eats smelly food in break room', 'Decorates their workspace excessively',
];

// ─── STAFF ───
export const STAFF_TEMPLATES = [
  { role: 'Hygienist', baseSalary: 75000, skillRange: [40, 90], icon: '🧑‍⚕️', canSeePatients: true, patientsPerDay: 8 },
  { role: 'Dentist', baseSalary: 150000, skillRange: [50, 95], icon: '👨‍⚕️', canSeePatients: true, patientsPerDay: 10 },
  { role: 'Specialist', baseSalary: 220000, skillRange: [65, 98], icon: '🏅', canSeePatients: true, patientsPerDay: 6 },
  { role: 'Front Desk', baseSalary: 40000, skillRange: [30, 85], icon: '💁', canSeePatients: false },
  { role: 'Dental Assistant', baseSalary: 45000, skillRange: [35, 88], icon: '👩‍⚕️', canSeePatients: false },
  { role: 'Office Manager', baseSalary: 65000, skillRange: [40, 90], icon: '📋', canSeePatients: false },
  { role: 'Regional Manager', baseSalary: 120000, skillRange: [50, 85], icon: '🏢', canSeePatients: false, isManagement: true },
];

const FIRST_NAMES = ['Sarah','Mike','Jessica','David','Emily','James','Ashley','Chris','Amanda','Ryan','Lisa','Tom','Rachel','Kevin','Maria','Brandon','Nicole','Tyler','Megan','Josh','Lauren','Andrew','Brittany','Matt','Stephanie','Daniel','Heather','Justin','Amber','Eric'];
const LAST_NAMES = ['Johnson','Smith','Williams','Brown','Davis','Miller','Wilson','Taylor','Clark','Hall','Garcia','Martinez','Lee','Walker','Young','Allen','King','Wright','Scott','Green'];

export function generateStaffMember(template, options = {}) {
  // Pick a random personality
  const personality = STAFF_PERSONALITIES[Math.floor(Math.random() * STAFF_PERSONALITIES.length)];
  const quirk = STAFF_QUIRKS[Math.floor(Math.random() * STAFF_QUIRKS.length)];

  // Base stats + personality modifiers (clamped)
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const baseSkill = Math.floor(Math.random() * (template.skillRange[1] - template.skillRange[0])) + template.skillRange[0];
  const baseAttitude = Math.floor(Math.random() * 60) + 40;
  const baseReliability = Math.floor(Math.random() * 50) + 50;

  const skill = clamp(baseSkill + personality.skillMod, 10, 98);
  const attitude = clamp(baseAttitude + personality.attitudeMod, 15, 95);
  const reliability = clamp(baseReliability + personality.reliabilityMod, 20, 95);

  // Salary: base variance + personality mod (proportional to value)
  const salaryVariance = (Math.random() * 0.2 - 0.1);
  const salary = Math.round(template.baseSalary * (1 + salaryVariance + personality.salaryMod));

  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const member = {
    id: Date.now() + Math.random(),
    name: `${firstName} ${lastName}`,
    role: template.role, icon: template.icon,
    skill, attitude, reliability, salary,
    personality: { id: personality.id, name: personality.name, icon: personality.icon, desc: personality.desc },
    strength: personality.strength,
    weakness: personality.weakness,
    redFlag: personality.redFlag || null,
    trainable: personality.trainable !== false,
    quirk,
    canSeePatients: template.canSeePatients || false,
    patientsPerDay: template.patientsPerDay || 0,
    morale: 60 + Math.floor(Math.random() * 30),
    daysEmployed: 0,
    assignedLocationId: options.locationId || null,
  };
  // Associate tracking for hired dentists (not the owner)
  if ((template.role === 'Dentist' || template.role === 'Specialist') && !options.isOwner) {
    member.isAssociate = true;
    member.loyalty = 65;
    member.production = 0;
    member.productionLast30 = 0;
    member.patientAttachment = 0;
    member.flightRisk = 'low';
    member.wantsPartnership = false;
    member.partnershipOffered = false;
  }
  // Regional manager flag
  if (template.isManagement) {
    member.isRegionalManager = true;
  }
  return member;
}

// ─── PROCEDURES ───
export const PROCEDURES = [
  { id: 'cleaning', name: 'Cleaning', revenue: 150, time: 1, frequency: 0.4, requiredRole: 'Hygienist', icon: '🪥' },
  { id: 'filling', name: 'Filling', revenue: 250, time: 1, frequency: 0.25, requiredRole: 'Dentist', icon: '🦷' },
  { id: 'crown', name: 'Crown', revenue: 1200, time: 2, frequency: 0.1, requiredRole: 'Dentist', icon: '👑' },
  { id: 'root_canal', name: 'Root Canal', revenue: 1500, time: 2, frequency: 0.05, requiredRole: 'Dentist', icon: '🔧' },
  { id: 'extraction', name: 'Extraction', revenue: 300, time: 1, frequency: 0.08, requiredRole: 'Dentist', icon: '🔨' },
  { id: 'whitening', name: 'Whitening', revenue: 500, time: 1, frequency: 0.07, requiredEquipment: 'whitening_system', icon: '💎' },
  { id: 'implant', name: 'Implant', revenue: 3000, time: 3, frequency: 0.03, requiredRole: 'Specialist', icon: '🏗️' },
  { id: 'veneer', name: 'Veneer', revenue: 1800, time: 2, frequency: 0.02, requiredRole: 'Specialist', icon: '✨' },
];

// ─── MARKETING ───
// Some channels are stackable (spend more = more results). Others are one-time activations.
export const MARKETING_OPTIONS = [
  { id: 'google_ads', name: 'Google Ads (Basic)', monthlyCost: 2000, patientBoost: 5, reputationBoost: 0.01, icon: '🔍', stackable: false,
    description: 'Basic Google presence. Patients search "dentist near me" and find you.' },
  { id: 'google_ads_premium', name: 'Google Ads (Premium)', monthlyCost: 5000, patientBoost: 12, reputationBoost: 0.02, icon: '🔍', stackable: false,
    description: 'Aggressive Google spend. Top placement, retargeting, landing pages. Expensive but powerful.' },
  { id: 'social_media', name: 'Social Media Management', monthlyCost: 1500, patientBoost: 3, reputationBoost: 0.02, icon: '📱', stackable: false,
    description: 'Instagram, Facebook, TikTok. Build brand awareness over time.' },
  { id: 'social_ads', name: 'Paid Social Ads', monthlyCost: 3000, patientBoost: 7, reputationBoost: 0.01, icon: '📢', stackable: false,
    description: 'Targeted ads on social platforms. Complements organic social media.' },
  { id: 'mailers', name: 'Direct Mail Campaign', monthlyCost: 3000, patientBoost: 8, reputationBoost: 0, icon: '📬', stackable: false,
    description: 'New mover mailers and neighborhood drops. Reliable but costs add up.' },
  { id: 'mailers_premium', name: 'Premium Mailer Blitz', monthlyCost: 6000, patientBoost: 15, reputationBoost: 0, icon: '📬', stackable: false,
    description: 'Double the mailers, wider radius. Saturation marketing. Very expensive per patient acquired.' },
  { id: 'billboard', name: 'Billboard', monthlyCost: 5000, patientBoost: 10, reputationBoost: 0.01, icon: '🪧', stackable: false,
    description: 'Highway billboard. Great brand awareness but hard to track ROI.' },
  { id: 'community_event', name: 'Community Events', monthlyCost: 2500, patientBoost: 4, reputationBoost: 0.05, icon: '🎪', stackable: false,
    description: 'Sponsor local events, free screenings. Best for reputation, slower patient acquisition.' },
  { id: 'referral_program', name: 'Patient Referral Program', monthlyCost: 1000, patientBoost: 6, reputationBoost: 0.03, icon: '🤝', stackable: false,
    description: 'Pay existing patients for referrals. Only works if you have patients who like you.' },
  { id: 'seo', name: 'SEO & Website', monthlyCost: 2000, patientBoost: 4, reputationBoost: 0.02, icon: '🌐', stackable: false,
    description: 'Professional website and SEO. Slow build but compounds over time.' },
];

// ─── INSURANCE ───
// Each plan has: reimbursement rate (% of fees you actually get), patient pool (% more patients),
// adminCost (monthly overhead for billing/credentialing), clawbackRisk (chance of audits/clawbacks),
// type: 'ppo' | 'hmo' | 'medicaid' | 'premium_ppo' | 'cash'
// minReputation: minimum reputation to get/stay credentialed
// cashCannibalization: how much this plan steals from your cash patient pool (0-1)
//
// KEY MECHANIC: If you accept insurance AND have cash patients, some "cash" patients will discover
// you take their insurance and switch — you lose the premium fee. More plans = more cannibalization.
export const INSURANCE_PLANS = [
  { id: 'delta', name: 'Delta Dental PPO', reimbursementRate: 0.70, patientPool: 0.30, adminCost: 500, clawbackRisk: 0.02, icon: '🔵',
    type: 'ppo', minReputation: 0, cashCannibalization: 0.15,
    noShowRate: 0.05, treatmentAcceptance: 0.85, emergencyRate: 0.10, staffDemand: 1.0,
    marginTip: 'Bread & butter — moderate fees, decent volume. Watch admin costs with multiple PPOs.',
    description: 'Most popular PPO. Solid volume, 30% fee cut. Every practice starts here.' },
  { id: 'metlife', name: 'MetLife PPO', reimbursementRate: 0.72, patientPool: 0.20, adminCost: 400, clawbackRisk: 0.015, icon: '🟦',
    type: 'ppo', minReputation: 3.0, cashCannibalization: 0.12,
    noShowRate: 0.06, treatmentAcceptance: 0.80, emergencyRate: 0.10, staffDemand: 1.0,
    marginTip: 'Bread & butter — moderate fees, decent volume. Watch admin costs with multiple PPOs.',
    description: 'Slightly better reimbursement than Delta. Requires 3.0+ stars to credential.' },
  { id: 'cigna', name: 'Cigna PPO', reimbursementRate: 0.65, patientPool: 0.18, adminCost: 400, clawbackRisk: 0.025, icon: '🟢',
    type: 'ppo', minReputation: 0, cashCannibalization: 0.10,
    noShowRate: 0.07, treatmentAcceptance: 0.78, emergencyRate: 0.10, staffDemand: 1.0,
    marginTip: 'Bread & butter — moderate fees, decent volume. Watch admin costs with multiple PPOs.',
    description: 'Lower reimbursement. Adds volume but watch the margins.' },
  { id: 'aetna', name: 'Aetna PPO', reimbursementRate: 0.60, patientPool: 0.15, adminCost: 350, clawbackRisk: 0.03, icon: '🟣',
    type: 'ppo', minReputation: 0, cashCannibalization: 0.08,
    noShowRate: 0.08, treatmentAcceptance: 0.75, emergencyRate: 0.10, staffDemand: 1.0,
    marginTip: 'Bread & butter — moderate fees, decent volume. Watch admin costs with multiple PPOs.',
    description: 'Low reimbursement. Pure volume play — dangerous for small practices.' },
  { id: 'premier', name: 'Delta Premier (High-Tier)', reimbursementRate: 0.82, patientPool: 0.10, adminCost: 300, clawbackRisk: 0.01, icon: '💎',
    type: 'premium_ppo', minReputation: 4.0, cashCannibalization: 0.20,
    noShowRate: 0.03, treatmentAcceptance: 0.90, emergencyRate: 0.05, staffDemand: 0.9,
    marginTip: 'Highest margins in insurance. Protect your reputation to keep credentialing.',
    description: 'Premium PPO tier. Best reimbursement but REQUIRES 4.0+ stars. Fewer patients but they pay near-cash rates. Competitive to get.' },
  { id: 'united_hmo', name: 'United Healthcare HMO', reimbursementRate: 0.45, patientPool: 0.30, adminCost: 700, clawbackRisk: 0.04, icon: '🔴',
    type: 'hmo', minReputation: 0, cashCannibalization: 0.05,
    noShowRate: 0.12, treatmentAcceptance: 0.55, emergencyRate: 0.25, staffDemand: 1.3,
    capitationMonthly: 18,
    marginTip: 'Thin margins, BIG pie. You need volume, speed, and more staff. Think assembly line, not boutique.',
    description: 'HMO = capitated payments. Massive volume but terrible per-patient revenue. You get paid a flat monthly rate per patient regardless of treatment. Must run LEAN.' },
  { id: 'dhmo', name: 'Dental HMO (DHMO)', reimbursementRate: 0.40, patientPool: 0.25, adminCost: 600, clawbackRisk: 0.03, icon: '🟠',
    type: 'hmo', minReputation: 0, cashCannibalization: 0.03,
    noShowRate: 0.15, treatmentAcceptance: 0.50, emergencyRate: 0.30, staffDemand: 1.4,
    capitationMonthly: 14,
    marginTip: 'Thin margins, BIG pie. You need volume, speed, and more staff. Think assembly line, not boutique.',
    description: 'Even cheaper than regular HMO. Pure volume game. Cheap chairs, fast turnover. Can work if you run a tight ship.' },
  { id: 'medicaid', name: 'Medicaid', reimbursementRate: 0.35, patientPool: 0.20, adminCost: 800, clawbackRisk: 0.05, icon: '🟤',
    type: 'medicaid', minReputation: 0, cashCannibalization: 0.02,
    noShowRate: 0.20, treatmentAcceptance: 0.40, emergencyRate: 0.35, staffDemand: 1.5,
    capitationMonthly: 10,
    marginTip: 'Thinnest margins. Only works at extreme volume with minimal overhead.',
    description: 'Lowest reimbursement in dentistry. Huge admin burden. Audits common. But unlimited patient pool if you can stomach the margins.' },
  { id: 'cash_only', name: 'Fee-for-Service (Cash)', reimbursementRate: 1.0, patientPool: 0.05, adminCost: 0, clawbackRisk: 0, icon: '💵',
    type: 'cash', minReputation: 3.5, cashCannibalization: 0,
    noShowRate: 0.02, treatmentAcceptance: 0.95, emergencyRate: 0.05, staffDemand: 0.8,
    marginTip: 'Maximum margin per patient. No admin, no clawbacks. Earned through reputation.',
    description: 'THE DREAM. Full fees, zero admin, zero clawbacks. But patients are picky — they want clean offices, great reviews, and a premium experience. Grows with reputation.' },
];

// Calculate the "practice style" based on insurance mix
export function getPracticeStyle(acceptedInsurance) {
  if (!acceptedInsurance || acceptedInsurance.length === 0) return { style: 'No Insurance', color: '#64748b' };
  const plans = acceptedInsurance.map(id => INSURANCE_PLANS.find(p => p.id === id)).filter(Boolean);
  const hmoCount = plans.filter(p => p.type === 'hmo' || p.type === 'medicaid').length;
  const hasCash = acceptedInsurance.includes('cash_only');
  const hasPremium = plans.some(p => p.type === 'premium_ppo');
  const totalPlans = plans.length;

  if (hasCash && totalPlans === 1) return { style: 'Boutique Cash Practice', color: '#eab308', desc: 'Low volume, high revenue per patient. Premium experience required.' };
  if (hasCash && totalPlans <= 3 && hasPremium) return { style: 'Premium Practice', color: '#22c55e', desc: 'High-value patients, premium PPO + cash mix. Sweet spot for profitability.' };
  if (hmoCount >= 2) return { style: 'Volume/HMO Practice', color: '#ef4444', desc: 'High volume, low margins. Must run ultra-lean. Cheap equipment OK.' };
  if (hmoCount === 1 && totalPlans >= 3) return { style: 'Mixed Volume Practice', color: '#eab308', desc: 'Blending HMO volume with PPO margins. Tricky to balance.' };
  if (totalPlans >= 5) return { style: 'Insurance-Heavy Practice', color: '#ef4444', desc: 'Accepting everything. High admin costs, cash patients are being cannibalized.' };
  if (totalPlans >= 3) return { style: 'Standard PPO Practice', color: '#3b82f6', desc: 'Typical insurance mix. Bread-and-butter dentistry.' };
  return { style: 'Limited Panel', color: '#94a3b8', desc: 'Selective insurance. Fewer patients but better margins.' };
}

// ─── RELATIONSHIPS ───
export const RELATIONSHIP_TYPES = [
  { id: 'supply_rep', name: 'Supply Rep', icon: '📦',
    description: 'Your dental supply representative. Good relationship = discounts on supplies, faster delivery.',
    bonusGood: 'Supply costs -20%', bonusBad: 'Supply costs +30%, slow deliveries' },
  { id: 'equipment_tech', name: 'Equipment Tech', icon: '🔧',
    description: 'The technician who fixes your equipment. Good relationship = fast repairs, priority service.',
    bonusGood: 'Repairs same-day, -50% repair costs', bonusBad: 'Repairs take 3-5 days, equipment downtime' },
  { id: 'referring_docs', name: 'Referring Doctors', icon: '🏥',
    description: 'Other doctors who send patients to you. Good relationship = steady referral stream.',
    bonusGood: '+15 patients/month from referrals', bonusBad: 'Referrals dry up' },
  { id: 'lab', name: 'Dental Lab', icon: '🔬',
    description: 'The lab that makes your crowns and prosthetics. Good relationship = quality work, fast turnaround.',
    bonusGood: 'Lab work quality +30%, 3-day turnaround', bonusBad: 'Remakes needed, 2-week waits, patient complaints' },
  { id: 'landlord', name: 'Landlord', icon: '🏠',
    description: 'Your building landlord. Good relationship = maintenance handled fast, lease flexibility.',
    bonusGood: 'Quick repairs, rent negotiable', bonusBad: 'Slow repairs, rent increases' },
];

// ─── COMPETING PRESSURES ───
// These are the diametrically opposed forces the player must balance
export const PRESSURE_METRICS = {
  growth: {
    name: 'Growth Rate', icon: '📈',
    tooLow: 'Stagnant — not enough new patients, reputation declining',
    tooHigh: 'Growing too fast — quality suffering, staff overwhelmed, mistakes happening',
    ideal: 'Steady growth — manageable pace, quality maintained',
  },
  staffHappiness: {
    name: 'Staff Satisfaction', icon: '😊',
    tooLow: 'Staff burnout — calling in sick, quitting, bad attitudes with patients',
    tooHigh: 'Pampered staff — very high overhead, complacent, low productivity',
    ideal: 'Content team — good morale, reasonable costs, productive',
  },
  patientVolume: {
    name: 'Patient Volume', icon: '👥',
    tooLow: 'Empty chairs — bleeding money on overhead with no revenue',
    tooHigh: 'Overbooked — long waits, rushed care, complaints, mistakes',
    ideal: 'Right-sized — chairs filled but not overwhelmed',
  },
  equipmentLevel: {
    name: 'Equipment Investment', icon: '🔧',
    tooLow: 'Outdated — limited procedures, breakdowns, patients notice',
    tooHigh: 'Over-invested — expensive equipment sitting idle, huge maintenance costs',
    ideal: 'Right-fit — equipment matches patient volume and procedure mix',
  },
  cleanliness: {
    name: 'Cleanliness & Compliance', icon: '🧼',
    tooLow: 'Dirty practice — health violations, patient complaints, liability risk',
    ideal: 'Clean and compliant — patients trust you, no issues',
  },
  overhead: {
    name: 'Overhead Ratio', icon: '💸',
    tooHigh: 'Overhead crushing profits — too much staff, too much space, too much equipment',
    ideal: 'Overhead under 60% — healthy margins',
  },
};

// ─── RANDOM EVENTS ───
export const RANDOM_EVENTS = [
  // Equipment
  { id: 'equipment_break', message: 'A piece of equipment broke down! Repair cost: $2,000', type: 'negative', cashEffect: -2000, reputationEffect: -0.05, chance: 0.04, affectsRelationship: 'equipment_tech' },
  { id: 'equipment_major_break', message: 'Major equipment failure! A chair is out of commission until repaired. -$5,000', type: 'negative', cashEffect: -5000, chance: 0.015, affectsRelationship: 'equipment_tech' },
  // Staff
  { id: 'staff_sick', message: '{staff} called in sick today.', type: 'negative', revenueMultiplier: 0.8, chance: 0.05, requiresStaff: true },
  { id: 'staff_quits', message: '{staff} quit unexpectedly! (Low morale)', type: 'negative', chance: 0.03, requiresStaff: true, requiresLowMorale: true, firesStaff: true },
  { id: 'staff_conflict', message: 'Two staff members are having a conflict. Office tension is high.', type: 'warning', chance: 0.03, requiresStaff: true, moraleEffect: -5 },
  { id: 'staff_burnout', message: '{staff} is showing signs of burnout from being overworked.', type: 'warning', chance: 0.04, requiresStaff: true, requiresHighVolume: true, moraleEffect: -8 },
  // Patients / Reviews
  { id: 'great_review', message: 'A patient left a glowing 5-star review!', type: 'positive', reputationEffect: 0.15, patientEffect: 5, chance: 0.04 },
  { id: 'bad_review', message: 'An angry patient left a 1-star review! "Long wait times and felt rushed."', type: 'negative', reputationEffect: -0.2, patientEffect: -3, chance: 0.03 },
  { id: 'celebrity_patient', message: 'A local celebrity visited your practice!', type: 'positive', reputationEffect: 0.3, patientEffect: 15, chance: 0.008 },
  { id: 'patient_complaint_dirty', message: 'A patient complained about cleanliness. "The office didn\'t feel clean."', type: 'negative', reputationEffect: -0.15, chance: 0.02, requiresLowCleanliness: true },
  { id: 'patient_wait_complaint', message: 'Multiple patients complained about long wait times today.', type: 'negative', reputationEffect: -0.1, chance: 0.03, requiresHighVolume: true },
  // Financial
  { id: 'insurance_audit', message: 'Insurance company is auditing your claims. Legal fees: $5,000', type: 'negative', cashEffect: -5000, chance: 0.015 },
  { id: 'supply_costs_up', message: 'Supply costs increased this month. -$1,500', type: 'negative', cashEffect: -1500, chance: 0.04, affectsRelationship: 'supply_rep' },
  { id: 'supply_deal', message: 'Your supply rep got you a great deal! Saved $2,000 this month.', type: 'positive', cashEffect: 2000, chance: 0.02, requiresGoodRelationship: 'supply_rep' },
  // Relationships
  { id: 'referral_boom', message: 'A referring doctor sent 10 new patients your way!', type: 'positive', patientEffect: 10, chance: 0.025, requiresGoodRelationship: 'referring_docs' },
  { id: 'referral_lost', message: 'A referring doctor stopped sending patients — heard about long wait times.', type: 'negative', patientEffect: -8, chance: 0.02, affectsRelationship: 'referring_docs' },
  { id: 'lab_remake', message: 'The dental lab sent back a bad crown. Patient needs to come back. Remake cost: $300', type: 'negative', cashEffect: -300, reputationEffect: -0.05, chance: 0.03, affectsRelationship: 'lab' },
  { id: 'lab_fast', message: 'Lab rushed a case for you — patient thrilled with same-week crown!', type: 'positive', reputationEffect: 0.1, chance: 0.02, requiresGoodRelationship: 'lab' },
  // Facilities
  { id: 'pipe_burst', message: 'A pipe burst in the office! Emergency repairs: $8,000', type: 'negative', cashEffect: -8000, chance: 0.008, affectsRelationship: 'landlord' },
  { id: 'hvac_issue', message: 'AC went out. Office is uncomfortable. Patients and staff unhappy.', type: 'negative', cashEffect: -2000, chance: 0.015, moraleEffect: -3, affectsRelationship: 'landlord' },
  { id: 'rent_increase', message: 'Landlord is raising rent by 10% next month.', type: 'negative', chance: 0.01, rentIncrease: 0.1, affectsRelationship: 'landlord' },
  // Compliance
  { id: 'health_inspection', message: 'Surprise health inspection!', type: 'warning', chance: 0.015, requiresCleanliness: true },
  { id: 'health_inspection_pass', message: 'Health inspection PASSED with flying colors! Reputation boost.', type: 'positive', reputationEffect: 0.2, chance: 0.01, requiresHighCleanliness: true },
  { id: 'health_violation', message: 'Health inspection found violations! Fine: $3,000. Must fix within 30 days.', type: 'negative', cashEffect: -3000, reputationEffect: -0.3, chance: 0.01, requiresLowCleanliness: true },
  // Growth events
  { id: 'award', message: 'Your practice won "Best Dentist" in the local paper!', type: 'positive', reputationEffect: 0.4, patientEffect: 20, chance: 0.008 },
  { id: 'new_competitor', message: 'A new dental practice opened nearby! Competition heating up.', type: 'negative', patientEffect: -8, chance: 0.015 },
  { id: 'growing_pains', message: 'Growing too fast — scheduling mistakes, double-booked patients, complaints rising.', type: 'negative', reputationEffect: -0.15, chance: 0.03, requiresHighGrowth: true },
  // HMO/Capitation events
  { id: 'hmo_patient_surge', message: '+5 walk-in HMO patients today! Staff scrambling to keep up.', type: 'warning', patientEffect: 5, chance: 0.03, requiresHMO: true },
  { id: 'capitation_audit', message: 'HMO capitation audit! Discrepancies found in patient records. -$3,000', type: 'negative', cashEffect: -3000, chance: 0.02, requiresHMO: true, requiresLowFrontDeskSkill: true },
  { id: 'hmo_staff_burnout', message: 'Staff exhausted from high HMO volume. Morale dropping fast.', type: 'negative', moraleEffect: -12, chance: 0.025, requiresHMO: true, requiresHighVolume: true },
];

// ─── OFFICE UPGRADES ───
export const OFFICE_UPGRADES = [
  { id: 'digital_forms', name: 'Digital Check-in System', cost: 8000, satisfactionBonus: 7, icon: '📱' },
  { id: 'parking_lot', name: 'Better Parking', cost: 15000, patientBoost: 5, icon: '🅿️' },
  { id: 'signage', name: 'Professional Signage', cost: 5000, reputationBoost: 0.1, patientBoost: 3, icon: '🪧' },
  { id: 'cleaning_service', name: 'Professional Cleaning Service', cost: 0, monthlyCost: 1500, cleanlinessBonus: 25, icon: '🧹' },
  { id: 'compliance_training', name: 'Annual Compliance Training', cost: 3000, cleanlinessBonus: 10, icon: '📋' },
  { id: 'patient_portal', name: 'Patient Portal/App', cost: 15000, satisfactionBonus: 10, patientBoost: 5, icon: '💻' },
  { id: 'music_system', name: 'Ambient Music System', cost: 2000, satisfactionBonus: 5, icon: '🎵' },
];

// ─── ACQUISITION OPTIONS ───
export const ACQUISITION_OPTIONS = [
  {
    id: 'small', name: 'Small Solo Practice', price: 250000,
    description: 'A small practice with 2 operatories, aging equipment, and a small patient base. The previous dentist retired.',
    patients: 80, reputation: 3.2, sqft: 1200, rent: 3000,
    equipment: ['basic_chair', 'basic_chair', 'xray', 'sterilizer'],
    builtOutRooms: ['basic_ops', 'basic_ops', 'waiting_area', 'sterilization'],
    staff: [
      { role: 'Front Desk', skill: 45, attitude: 70, reliability: 60 },
      { role: 'Dental Assistant', skill: 55, attitude: 50, reliability: 65 },
    ],
    monthlyRevenue: 25000, insurances: ['delta'],
    relationships: { supply_rep: 50, equipment_tech: 40, referring_docs: 30, lab: 55, landlord: 60 },
    cleanliness: 55,
  },
  {
    id: 'medium', name: 'Growing Family Practice', price: 500000,
    description: 'A well-run family practice with 4 operatories, decent equipment, and solid reviews. Owner is relocating.',
    patients: 250, reputation: 4.1, sqft: 2200, rent: 5500,
    equipment: ['basic_chair', 'basic_chair', 'premium_chair', 'premium_chair', 'xray', 'panoramic_xray', 'sterilizer'],
    builtOutRooms: ['basic_ops', 'basic_ops', 'premium_ops', 'premium_ops', 'waiting_area', 'sterilization', 'xray_room', 'break_room'],
    staff: [
      { role: 'Hygienist', skill: 72, attitude: 80, reliability: 75 },
      { role: 'Front Desk', skill: 65, attitude: 85, reliability: 80 },
      { role: 'Dental Assistant', skill: 60, attitude: 70, reliability: 70 },
      { role: 'Dental Assistant', skill: 50, attitude: 60, reliability: 55 },
    ],
    monthlyRevenue: 55000, insurances: ['delta', 'cigna'],
    relationships: { supply_rep: 65, equipment_tech: 60, referring_docs: 55, lab: 70, landlord: 65 },
    cleanliness: 70,
  },
  {
    id: 'large', name: 'Established Multi-Doctor Practice', price: 900000,
    description: 'A large practice with 6 operatories, modern equipment, and a strong patient base. But the staff has morale issues and cleanliness has slipped.',
    patients: 500, reputation: 3.8, sqft: 3500, rent: 9000,
    equipment: ['premium_chair','premium_chair','premium_chair','premium_chair','basic_chair','basic_chair','panoramic_xray','xray','sterilizer','laser','autoclave'],
    builtOutRooms: ['premium_ops','premium_ops','premium_ops','premium_ops','basic_ops','basic_ops','premium_waiting','sterilization','xray_room','lab','break_room','private_office'],
    staff: [
      { role: 'Hygienist', skill: 80, attitude: 40, reliability: 60 },
      { role: 'Hygienist', skill: 65, attitude: 55, reliability: 50 },
      { role: 'Front Desk', skill: 70, attitude: 35, reliability: 45 },
      { role: 'Front Desk', skill: 50, attitude: 75, reliability: 80 },
      { role: 'Dental Assistant', skill: 75, attitude: 45, reliability: 55 },
      { role: 'Dental Assistant', skill: 60, attitude: 60, reliability: 70 },
    ],
    monthlyRevenue: 95000, insurances: ['delta', 'cigna', 'aetna'],
    relationships: { supply_rep: 45, equipment_tech: 35, referring_docs: 60, lab: 50, landlord: 40 },
    cleanliness: 45,
  },
];

// ─── ACQUISITION PRACTICE GENERATION ───
const PRACTICE_TYPES = ['Family Dentistry', 'Dental Group', 'Smile Center', 'Dental Associates', 'Oral Health Center'];

const PROBLEM_POOL = [
  { id: 'low_morale', label: 'Low Staff Morale', severity: 'warning', description: 'Staff morale is critically low.' },
  { id: 'bad_reputation', label: 'Bad Reputation', severity: 'danger', description: 'Online reviews are terrible.' },
  { id: 'equipment_outdated', label: 'Outdated Equipment', severity: 'warning', description: 'Only basic chairs, no diagnostic equipment.' },
  { id: 'high_overhead', label: 'High Overhead', severity: 'warning', description: 'Rent and staffing costs are bloated.' },
  { id: 'dirty_office', label: 'Dirty Office', severity: 'danger', description: 'The office is filthy. Patients notice.' },
  { id: 'insurance_mess', label: 'Insurance Mess', severity: 'warning', description: 'Too many low-paying plans cannibalize revenue.' },
  { id: 'staff_drama', label: 'Staff Drama', severity: 'danger', description: 'Key staff member about to quit, another is unskilled.' },
  { id: 'debt_heavy', label: 'Heavy Debt', severity: 'danger', description: 'Previous owner left significant unpaid debts.' },
  { id: 'no_marketing', label: 'Zero Marketing', severity: 'warning', description: 'No marketing — patient base is declining.' },
  { id: 'embezzlement_aftermath', label: 'Embezzlement', severity: 'danger', description: 'Cash went missing. Trust is broken.' },
];

const ACQUISITION_SCALING = {
  beginner:     { priceRange: [150000, 300000], patientRange: [40, 100], staffRange: [1, 2], problemRange: [0, 1], sqftRange: [800, 1200], repRange: [2.8, 3.5], revenuePerPatient: 280 },
  intermediate: { priceRange: [250000, 600000], patientRange: [80, 300], staffRange: [2, 4], problemRange: [1, 2], sqftRange: [1200, 2500], repRange: [2.5, 4.0], revenuePerPatient: 220 },
  expert:       { priceRange: [500000, 1000000], patientRange: [200, 600], staffRange: [4, 8], problemRange: [2, 3], sqftRange: [2000, 4000], repRange: [2.0, 4.2], revenuePerPatient: 180 },
  hell:         { priceRange: [700000, 1200000], patientRange: [300, 800], staffRange: [5, 10], problemRange: [3, 4], sqftRange: [3000, 5000], repRange: [1.5, 3.5], revenuePerPatient: 160 },
};

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min, max, decimals = 1) { return parseFloat((Math.random() * (max - min) + min).toFixed(decimals)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function generatePracticeName() {
  return `${pick(LAST_NAMES)} ${pick(PRACTICE_TYPES)}`;
}

function generatePracticeStaff(count, problems) {
  const hasLowMorale = problems.includes('low_morale');
  const hasStaffDrama = problems.includes('staff_drama');
  const rolePool = ['Front Desk', 'Dental Assistant', 'Hygienist', 'Dental Assistant', 'Hygienist', 'Front Desk', 'Office Manager'];
  const staff = [];
  for (let i = 0; i < count; i++) {
    const role = i < rolePool.length ? rolePool[i] : pick(rolePool);
    const template = STAFF_TEMPLATES.find(t => t.role === role);
    if (!template) continue;
    const skill = randInt(template.skillRange[0], template.skillRange[1]);
    const baseAttitude = randInt(40, 85);
    const baseMorale = randInt(50, 80);
    const member = {
      role, skill,
      attitude: hasLowMorale ? Math.min(baseAttitude, randInt(25, 45)) : baseAttitude,
      reliability: randInt(45, 85),
      morale: hasLowMorale ? randInt(20, 35) : baseMorale,
    };
    // Staff drama: one about to quit, one unskilled
    if (hasStaffDrama && i === 0) { member.skill = randInt(15, 30); member.attitude = randInt(20, 40); }
    if (hasStaffDrama && i === 1) { member.morale = randInt(10, 20); member.attitude = randInt(15, 30); }
    staff.push(member);
  }
  return staff;
}

function generatePracticeEquipment(sqft, problems) {
  const outdated = problems.includes('equipment_outdated');
  const ops = Math.max(2, Math.floor(sqft / 500));
  const equip = [];
  for (let i = 0; i < ops; i++) equip.push('basic_chair');
  if (!outdated) {
    equip.push('xray');
    if (sqft >= 2000) equip.push('panoramic_xray');
    if (Math.random() > 0.5) equip.push('intraoral_camera');
  }
  equip.push('sterilizer');
  return equip;
}

function generatePracticeInsurances(problems) {
  const mess = problems.includes('insurance_mess');
  if (mess) return ['delta', 'cigna', 'aetna', 'united_hmo', 'dhmo'];
  const base = ['delta'];
  if (Math.random() > 0.4) base.push('cigna');
  if (Math.random() > 0.6) base.push('metlife');
  return base;
}

function generateBuiltRooms(sqft) {
  const ops = Math.max(2, Math.floor(sqft / 500));
  const rooms = [];
  for (let i = 0; i < ops; i++) rooms.push(i < Math.ceil(ops / 2) ? 'premium_ops' : 'basic_ops');
  rooms.push('waiting_area', 'sterilization');
  if (sqft >= 1500) rooms.push('xray_room');
  if (sqft >= 2000) rooms.push('break_room');
  if (sqft >= 2500) rooms.push('lab');
  if (sqft >= 3000) rooms.push('private_office');
  return rooms;
}

function buildStory(name, problems, patients, reputation) {
  const ownerName = name.split(' ')[0];
  const reasons = ['retired after 30 years', 'relocated out of state', 'passed away unexpectedly', 'pivoted to consulting', 'burned out and walked away'];
  let story = `Dr. ${ownerName} ${pick(reasons)}. `;
  if (patients > 200) story += `The practice had a solid patient base of ${patients} but `;
  else story += `The practice was small with only ${patients} patients and `;
  if (reputation < 2.5) story += 'reviews have tanked. ';
  else if (reputation < 3.5) story += 'has been declining without leadership. ';
  else story += 'was well-regarded in the community. ';
  const problemDescs = {
    low_morale: 'Staff morale is very low — expect attitude problems.',
    bad_reputation: 'Online reviews are brutal. Rebuilding trust will take time.',
    equipment_outdated: 'Equipment is ancient — only basic chairs, no imaging.',
    high_overhead: 'Overhead is bloated. Too much staff and space for the patient count.',
    dirty_office: 'The office needs a deep clean. Patients have complained.',
    insurance_mess: 'Loaded with low-paying insurance plans that cannibalize revenue.',
    staff_drama: 'One key staff member is about to quit and another has very low skills.',
    debt_heavy: 'The previous owner left unpaid debts you\'ll inherit.',
    no_marketing: 'Zero marketing in place. Patient count has been dropping.',
    embezzlement_aftermath: 'Cash went missing under the previous owner. Staff trust is shattered.',
  };
  problems.forEach(p => { if (problemDescs[p]) story += problemDescs[p] + ' '; });
  return story.trim();
}

export function generateAcquisitionOptions(difficulty) {
  const diffId = difficulty?.id || 'intermediate';
  const scaling = ACQUISITION_SCALING[diffId] || ACQUISITION_SCALING.intermediate;
  const options = [];

  for (let i = 0; i < 3; i++) {
    const name = generatePracticeName();
    const problemCount = randInt(scaling.problemRange[0], scaling.problemRange[1]);
    const problems = shuffle(PROBLEM_POOL).slice(0, problemCount).map(p => p.id);
    const patients = randInt(scaling.patientRange[0], scaling.patientRange[1]);
    const sqft = randInt(scaling.sqftRange[0], scaling.sqftRange[1]);
    const reputation = randFloat(scaling.repRange[0], scaling.repRange[1]);
    const price = randInt(scaling.priceRange[0], scaling.priceRange[1]);
    const staffCount = randInt(scaling.staffRange[0], scaling.staffRange[1]);
    const baseRent = Math.round(sqft * randFloat(2.5, 4.0) / 12); // monthly rent
    const rent = problems.includes('high_overhead') ? Math.round(baseRent * 1.3) : baseRent;
    const monthlyRevenue = Math.round(patients * scaling.revenuePerPatient / 12);
    const cleanliness = problems.includes('dirty_office') ? randInt(15, 30) : randInt(40, 75);
    const existingDebt = problems.includes('debt_heavy') ? randInt(100000, 200000) : 0;
    const embezzlementLoss = problems.includes('embezzlement_aftermath') ? randInt(20000, 50000) : 0;
    const maxOps = Math.max(2, Math.floor(sqft / 400));

    options.push({
      id: `gen_${Date.now()}_${i}`,
      name,
      story: buildStory(name, problems, patients, reputation),
      price,
      patients,
      reputation: problems.includes('bad_reputation') ? Math.min(reputation, randFloat(1.5, 2.5)) : reputation,
      sqft,
      rent,
      maxOps,
      equipment: generatePracticeEquipment(sqft, problems),
      builtOutRooms: generateBuiltRooms(sqft),
      staff: generatePracticeStaff(staffCount, problems),
      insurances: generatePracticeInsurances(problems),
      relationships: {
        supply_rep: randInt(30, 65),
        equipment_tech: randInt(25, 60),
        referring_docs: randInt(20, 55),
        lab: randInt(35, 65),
        landlord: randInt(40, 70),
      },
      cleanliness,
      problems,
      monthlyRevenue,
      existingDebt,
      embezzlementLoss,
    });
  }
  return options;
}

export { PROBLEM_POOL };

// ─── PATIENT NAMES ───
const PATIENT_FIRST = ['Alex','Jordan','Taylor','Morgan','Casey','Riley','Quinn','Sam','Pat','Jamie','Drew','Avery','Blake','Cameron','Dakota'];
export function generatePatientName() {
  return PATIENT_FIRST[Math.floor(Math.random() * PATIENT_FIRST.length)] + ' ' + LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
}

export function pickProcedure(equipment, staff) {
  const available = PROCEDURES.filter(p => {
    if (p.requiredEquipment && !equipment.includes(p.requiredEquipment)) return false;
    if (p.requiredRole && !staff.some(s => s.role === p.requiredRole)) return false;
    return true;
  });
  const totalFreq = available.reduce((sum, p) => sum + p.frequency, 0);
  let roll = Math.random() * totalFreq;
  for (const proc of available) { roll -= proc.frequency; if (roll <= 0) return proc; }
  return available[0] || PROCEDURES[0];
}

// ─── PRESSURE CALCULATIONS ───
export function calculatePressures(gameState, stats) {
  const pressures = {};
  const { staff, equipment, patients, revenueHistory } = gameState;

  // Growth pressure: compare recent patient growth
  const recentGrowth = revenueHistory.length > 10
    ? (revenueHistory[revenueHistory.length - 1] - revenueHistory[revenueHistory.length - 10]) / Math.max(revenueHistory[revenueHistory.length - 10], 1)
    : 0;
  if (recentGrowth > 0.3) pressures.growth = { level: 'high', label: 'Growing Too Fast', color: '#ef4444' };
  else if (recentGrowth < -0.1) pressures.growth = { level: 'low', label: 'Declining', color: '#ef4444' };
  else if (recentGrowth > 0.05) pressures.growth = { level: 'good', label: 'Healthy Growth', color: '#22c55e' };
  else pressures.growth = { level: 'flat', label: 'Stagnant', color: '#eab308' };

  // Staff happiness pressure
  const avgMorale = staff.length > 0 ? staff.reduce((s, m) => s + m.morale, 0) / staff.length : 50;
  if (avgMorale > 85) pressures.staffHappiness = { level: 'high', label: 'High Cost / Complacent', color: '#eab308', value: avgMorale };
  else if (avgMorale < 40) pressures.staffHappiness = { level: 'low', label: 'Burnout Risk', color: '#ef4444', value: avgMorale };
  else pressures.staffHappiness = { level: 'good', label: 'Content', color: '#22c55e', value: avgMorale };

  // Patient volume pressure
  const utilization = stats.effectiveCapacity > 0 ? stats.actualPatients / stats.effectiveCapacity : 0;
  if (utilization > 0.9) pressures.patientVolume = { level: 'high', label: 'Overbooked', color: '#ef4444', value: Math.round(utilization * 100) };
  else if (utilization < 0.3) pressures.patientVolume = { level: 'low', label: 'Empty Chairs', color: '#ef4444', value: Math.round(utilization * 100) };
  else pressures.patientVolume = { level: 'good', label: 'Well Balanced', color: '#22c55e', value: Math.round(utilization * 100) };

  // Equipment vs patients pressure
  const totalEquipCost = equipment.reduce((sum, eq) => {
    const def = EQUIPMENT.find(e => e.id === eq);
    return sum + (def ? def.cost : 0);
  }, 0);
  const equipRatio = patients > 0 ? totalEquipCost / patients : totalEquipCost;
  if (equipRatio > 2000 && patients < 50) pressures.equipmentLevel = { level: 'high', label: 'Over-Invested', color: '#ef4444' };
  else if (equipment.filter(e => EQUIPMENT.find(d => d.id === e)?.patientsPerDay).length < 2) pressures.equipmentLevel = { level: 'low', label: 'Under-Equipped', color: '#eab308' };
  else pressures.equipmentLevel = { level: 'good', label: 'Right-Sized', color: '#22c55e' };

  // Cleanliness pressure
  const cleanliness = gameState.cleanliness || 50;
  if (cleanliness > 80) pressures.cleanliness = { level: 'good', label: 'Spotless', color: '#22c55e', value: cleanliness };
  else if (cleanliness < 40) pressures.cleanliness = { level: 'low', label: 'Violation Risk', color: '#ef4444', value: cleanliness };
  else pressures.cleanliness = { level: 'mid', label: 'Needs Attention', color: '#eab308', value: cleanliness };

  // Overhead ratio
  const overheadRatio = stats.dailyRevenue > 0 ? stats.totalDailyCosts / stats.dailyRevenue : 1;
  if (overheadRatio > 0.8) pressures.overhead = { level: 'high', label: `${Math.round(overheadRatio * 100)}% — Crushing`, color: '#ef4444', value: Math.round(overheadRatio * 100) };
  else if (overheadRatio > 0.6) pressures.overhead = { level: 'mid', label: `${Math.round(overheadRatio * 100)}% — Tight`, color: '#eab308', value: Math.round(overheadRatio * 100) };
  else pressures.overhead = { level: 'good', label: `${Math.round(overheadRatio * 100)}% — Healthy`, color: '#22c55e', value: Math.round(overheadRatio * 100) };

  return pressures;
}

// ─── GAME CALCULATIONS ───
export function calculateDailyStats(gameState) {
  const { equipment, staff, reputation, patients, activeMarketing, acceptedInsurance, officeUpgrades, relationships, cleanliness, builtOutRooms, sqft } = gameState;

  // Capacity from chairs (limited by built operatories)
  const builtOps = (builtOutRooms || []).filter(r => r === 'basic_ops' || r === 'premium_ops').length;
  let totalCapacity = 0;
  const chairs = equipment.filter(eq => EQUIPMENT.find(e => e.id === eq)?.patientsPerDay > 0);
  chairs.slice(0, builtOps).forEach(eq => {
    const def = EQUIPMENT.find(e => e.id === eq);
    if (def) totalCapacity += def.patientsPerDay;
  });

  // Provider capacity
  const providers = staff.filter(s => s.canSeePatients);
  const providerCapacity = providers.reduce((sum, s) => sum + (s.patientsPerDay || 6), 0);
  const effectiveCapacity = Math.min(totalCapacity, providerCapacity);

  const hasFrontDesk = staff.some(s => s.role === 'Front Desk' || s.role === 'Office Manager');
  const frontDeskPenalty = hasFrontDesk ? 1 : 0.4;

  const assistants = staff.filter(s => s.role === 'Dental Assistant').length;
  const assistantBonus = Math.min(assistants * 0.1, 0.3);

  // Insurance patient pool
  const insurancePatientBoost = (acceptedInsurance || []).reduce((sum, id) => {
    const plan = INSURANCE_PLANS.find(p => p.id === id);
    return sum + (plan ? plan.patientPool : 0);
  }, 0);

  // Marketing boost
  const marketingPatientBoost = (activeMarketing || []).reduce((sum, id) => {
    const mkt = MARKETING_OPTIONS.find(m => m.id === id);
    return sum + (mkt ? mkt.patientBoost : 0);
  }, 0);

  // Referring docs relationship bonus
  const refRelationship = (relationships || {}).referring_docs || 50;
  const referralBonus = refRelationship > 70 ? 15 : refRelationship > 50 ? 5 : 0;

  // Satisfaction from buildout + equipment + upgrades + cleanliness
  const buildoutSat = (builtOutRooms || []).reduce((sum, id) => {
    const item = BUILDOUT_ITEMS.find(b => b.id === id);
    return sum + (item?.satisfactionBonus || 0);
  }, 0);
  const equipSat = equipment.reduce((sum, eq) => {
    const def = EQUIPMENT.find(e => e.id === eq);
    return sum + (def?.satisfactionBonus || 0);
  }, 0);
  const upgradeSat = (officeUpgrades || []).reduce((sum, id) => {
    const upg = OFFICE_UPGRADES.find(u => u.id === id);
    return sum + (upg?.satisfactionBonus || 0);
  }, 0);
  const cleanlinessSat = ((cleanliness || 50) - 50) * 0.3; // cleanliness above 50 adds satisfaction

  // Patient demand
  // CRITICAL: New practices with 0 patients get NOTHING without marketing.
  // Organic walk-ins are extremely rare. You MUST invest in marketing to build a patient base.
  const basePatients = patients / 30;

  // Organic walk-ins: tiny trickle only if you have some reputation and marketing/signage
  // A brand new practice with 0 patients and no marketing = 0 patients
  const hasAnyMarketing = (activeMarketing || []).length > 0;
  const hasSignage = (officeUpgrades || []).includes('signage');
  let organicWalkIns = 0;
  if (patients === 0 && !hasAnyMarketing && !hasSignage) {
    // Completely new, no marketing = maybe 1 walk-in every few days if lucky
    organicWalkIns = Math.random() < 0.1 ? 1 : 0;
  } else if (patients < 20 && !hasAnyMarketing) {
    // Very few patients, no marketing = very slow
    organicWalkIns = Math.random() < 0.2 ? 1 : 0;
  } else if (patients < 50) {
    // Small base, still building
    organicWalkIns = Math.random() < 0.4 ? 1 : 0;
  }

  // INSURANCE CANNIBALIZATION MODEL
  // Key insight: patients who WOULD pay cash discover you take their insurance and switch.
  // More insurance plans accepted = more cannibalization of your cash patient revenue.
  // This is the #1 trap new practices fall into.
  const hasCashPlan = (acceptedInsurance || []).includes('cash_only');
  const insurancePlansOnly = (acceptedInsurance || []).filter(id => id !== 'cash_only');
  const insurancePlanDetails = insurancePlansOnly.map(id => INSURANCE_PLANS.find(p => p.id === id)).filter(Boolean);

  // Calculate total cannibalization — each plan eats into your cash patients
  const totalCannibalization = insurancePlanDetails.reduce((sum, plan) => sum + (plan.cashCannibalization || 0), 0);
  // Cash patient share after cannibalization
  const baseCashShare = hasCashPlan ? Math.min(0.35, Math.max(0.02, (reputation - 3) * 0.12 + 0.05)) : 0;
  const effectiveCashShare = Math.max(0, baseCashShare - totalCannibalization);

  let avgInsuranceRate;
  if (insurancePlansOnly.length === 0 && !hasCashPlan) {
    avgInsuranceRate = 1; // no insurance at all = cash by default but tiny pool
  } else if (insurancePlansOnly.length === 0 && hasCashPlan) {
    avgInsuranceRate = 1.0; // pure cash practice — full fees
  } else {
    // Weighted blend: insurance patients at their rates, remaining cash patients at full fee
    const insRate = insurancePlanDetails.reduce((sum, plan) => sum + plan.reimbursementRate, 0) / insurancePlanDetails.length;
    avgInsuranceRate = insRate * (1 - effectiveCashShare) + 1.0 * effectiveCashShare;
  }

  // HMO penalty: HMO patients take longer to process (more paperwork) reducing effective capacity slightly
  const hmoPlans = insurancePlanDetails.filter(p => p.type === 'hmo' || p.type === 'medicaid');
  const hmoCapacityPenalty = hmoPlans.length > 0 ? 1 - (hmoPlans.length * 0.05) : 1; // 5% capacity reduction per HMO plan

  // Apply HMO capacity penalty — HMO patients need more admin processing time
  const adjustedCapacity = Math.floor(effectiveCapacity * hmoCapacityPenalty);

  const demandMultiplier = (reputation / 5) * 1.5;
  // Marketing is the main driver for new practices, existing patient base drives established ones
  const marketingDailyPatients = hasAnyMarketing ? (marketingPatientBoost + referralBonus) / 30 : 0;
  const rawDemand = (basePatients + marketingDailyPatients) * demandMultiplier * (1 + insurancePatientBoost) * frontDeskPenalty;
  const dailyDemand = Math.max(organicWalkIns, Math.floor(rawDemand));
  const actualPatients = Math.min(dailyDemand, Math.floor(adjustedCapacity * (1 + assistantBonus)));

  // Revenue
  // Reputation-based fee premium: high reputation = patients pay more / accept higher fees
  // A 5-star practice can charge premium fees. A 2-star practice has to discount to fill chairs.
  const reputationFeeMultiplier = 0.8 + (reputation / 5) * 0.4; // ranges from 0.8x at 0 stars to 1.2x at 5 stars
  let revenuePerPatient = 250 * reputationFeeMultiplier;
  equipment.forEach(eq => {
    const def = EQUIPMENT.find(e => e.id === eq);
    if (def && def.revenueBonus) revenuePerPatient += def.revenueBonus / Math.max(actualPatients, 1);
  });
  // Buildout revenue bonuses
  (builtOutRooms || []).forEach(id => {
    const item = BUILDOUT_ITEMS.find(b => b.id === id);
    if (item?.revenueBonus) revenuePerPatient += item.revenueBonus / Math.max(actualPatients, 1);
  });

  const avgSkill = staff.length > 0 ? staff.reduce((sum, s) => sum + s.skill, 0) / staff.length : 50;
  const skillMultiplier = 0.7 + (avgSkill / 100) * 0.6;

  // Lab relationship affects revenue (bad lab = remakes = lost revenue)
  const labRelationship = (relationships || {}).lab || 50;
  const labMultiplier = labRelationship > 70 ? 1.05 : labRelationship < 30 ? 0.9 : 1;

  // ── HMO/CAPITATION MECHANICS ──
  // 1. No-show reduction — blend no-show rates across accepted plans
  const allAcceptedPlans = (acceptedInsurance || []).map(id => INSURANCE_PLANS.find(p => p.id === id)).filter(Boolean);
  const totalPool = allAcceptedPlans.reduce((s, p) => s + p.patientPool, 0) || 1;
  const blendedNoShowRate = allAcceptedPlans.length > 0
    ? allAcceptedPlans.reduce((s, p) => s + (p.noShowRate || 0.05) * p.patientPool, 0) / totalPool
    : 0.05;
  const patientsAfterNoShows = Math.round(actualPatients * (1 - blendedNoShowRate));

  // 2. Treatment acceptance — lower acceptance = less elective revenue
  const blendedTreatmentAcceptance = allAcceptedPlans.length > 0
    ? allAcceptedPlans.reduce((s, p) => s + (p.treatmentAcceptance || 0.85) * p.patientPool, 0) / totalPool
    : 0.85;
  const acceptanceMultiplier = 0.6 + (blendedTreatmentAcceptance * 0.4); // floor 0.6x

  // 3. Staff demand check — HMO volume needs more staff or satisfaction drops
  const blendedStaffDemand = allAcceptedPlans.length > 0
    ? allAcceptedPlans.reduce((s, p) => s + (p.staffDemand || 1.0) * p.patientPool, 0) / totalPool
    : 1.0;
  const staffNeeded = Math.ceil(actualPatients * blendedStaffDemand / 6);
  const understaffed = staff.length < staffNeeded;
  const understaffedPenalty = understaffed ? 0.85 : 1.0;

  // 4. Capitation revenue stream — monthly per-member income for HMO/Medicaid
  const capitationPlans = allAcceptedPlans.filter(p => p.capitationMonthly);
  const capitationRevenue = capitationPlans.reduce((sum, plan) => {
    const planMembers = Math.floor(patients * plan.patientPool / totalPool);
    return sum + planMembers * plan.capitationMonthly;
  }, 0) / 30; // daily capitation

  // 5. Emergency scheduling inefficiency
  const blendedEmergencyRate = allAcceptedPlans.length > 0
    ? allAcceptedPlans.reduce((s, p) => s + (p.emergencyRate || 0.10) * p.patientPool, 0) / totalPool
    : 0.10;
  const emergencyPenalty = 1 - (blendedEmergencyRate * 0.15); // up to ~5% drag

  // Apply HMO mechanics as multipliers to revenue
  const baseRevenue = patientsAfterNoShows * revenuePerPatient * skillMultiplier * avgInsuranceRate * labMultiplier;
  let dailyRevenue = Math.round(baseRevenue * acceptanceMultiplier * emergencyPenalty * understaffedPenalty + capitationRevenue);

  // Insurance reimbursement delay — first 30 days, insurance money hasn't come in yet
  // You're treating patients and submitting claims, but checks don't arrive for ~30 days
  const gameDay = gameState.day || 1;
  const insuranceShare = insurancePlanDetails.length > 0 ? (1 - effectiveCashShare) : 0;
  if (gameDay <= INSURANCE_REIMBURSEMENT_DELAY && insuranceShare > 0) {
    // Only collect cash-pay revenue during the float period
    // Gradually ramp up: at day 1 = 0% insurance revenue, day 30 = 100%
    const floatProgress = gameDay / INSURANCE_REIMBURSEMENT_DELAY;
    const insRevenuePortion = dailyRevenue * insuranceShare;
    const cashRevenuePortion = dailyRevenue * (1 - insuranceShare);
    dailyRevenue = Math.round(cashRevenuePortion + insRevenuePortion * floatProgress);
  }

  // Credentialing delay — newly added insurance plans don't produce patients immediately
  // Plans added mid-game have a credentialing period tracked in gameState.insuranceCredentialDays
  const credentialDays = gameState.insuranceCredentialDays || {};
  const uncredentialedPlans = allAcceptedPlans.filter(p => {
    const startDay = credentialDays[p.id];
    return startDay && (gameDay - startDay) < CREDENTIALING_DAYS;
  });
  if (uncredentialedPlans.length > 0 && allAcceptedPlans.length > 0) {
    const credentialedShare = 1 - (uncredentialedPlans.length / allAcceptedPlans.length);
    dailyRevenue = Math.round(dailyRevenue * (0.5 + 0.5 * credentialedShare)); // partial revenue while credentialing
  }

  // Costs
  const dailySalaries = Math.round(staff.reduce((sum, s) => sum + s.salary, 0) / 365);

  // Equipment maintenance (affected by equipment_tech relationship)
  const techRelationship = (relationships || {}).equipment_tech || 50;
  const maintenanceMultiplier = techRelationship > 70 ? 0.7 : techRelationship < 30 ? 1.5 : 1;
  const dailyMaintenance = Math.round(equipment.reduce((sum, eq) => {
    const def = EQUIPMENT.find(e => e.id === eq);
    return sum + (def?.maintenanceCost || 0);
  }, 0) / 30 * maintenanceMultiplier);

  // Supply costs (affected by supply_rep relationship)
  const supplyRelationship = (relationships || {}).supply_rep || 50;
  const supplyMultiplier = supplyRelationship > 70 ? 0.8 : supplyRelationship < 30 ? 1.3 : 1;
  const dailySupplies = Math.round(actualPatients * 15 * supplyMultiplier);

  // Insurance admin overhead — each plan costs money to manage
  const dailyInsuranceAdmin = Math.round((acceptedInsurance || []).reduce((sum, id) => {
    const plan = INSURANCE_PLANS.find(p => p.id === id);
    return sum + (plan?.adminCost || 0);
  }, 0) / 30);

  const dailyRent = Math.round((gameState.rent || 0) / 30);
  const dailyOverhead = dailyMaintenance + dailySupplies + dailyRent + dailyInsuranceAdmin;

  const dailyMarketing = Math.round((activeMarketing || []).reduce((sum, id) => {
    const mkt = MARKETING_OPTIONS.find(m => m.id === id);
    return sum + (mkt ? mkt.monthlyCost : 0);
  }, 0) / 30);

  const dailyUpgradeCosts = Math.round((officeUpgrades || []).reduce((sum, id) => {
    const upg = OFFICE_UPGRADES.find(u => u.id === id);
    return sum + (upg?.monthlyCost || 0);
  }, 0) / 30);

  const interestRate = gameState.interestRate || 0.06;
  const dailyLoanPayment = Math.round((gameState.debt * interestRate) / 365);
  const totalDailyCosts = dailySalaries + dailyOverhead + dailyMarketing + dailyUpgradeCosts + dailyLoanPayment;
  const dailyProfit = dailyRevenue - totalDailyCosts;

  // Revenue per sqft (annual)
  const annualRevenuePerSqft = sqft > 0 ? Math.round((dailyRevenue * 365) / sqft) : 0;

  // Reputation changes
  const avgAttitude = staff.length > 0 ? staff.reduce((sum, s) => sum + s.attitude, 0) / staff.length : 50;
  const satisfactionScore = Math.min(1, ((avgSkill * 0.3 + avgAttitude * 0.2) / 100) + (buildoutSat + equipSat + upgradeSat + cleanlinessSat) / 500);
  const marketingRepBoost = (activeMarketing || []).reduce((sum, id) => {
    const mkt = MARKETING_OPTIONS.find(m => m.id === id);
    return sum + (mkt ? mkt.reputationBoost : 0);
  }, 0) / 30;

  // Apply understaffed penalty to satisfaction
  const adjustedSatisfaction = satisfactionScore * understaffedPenalty;

  // Per-plan margin calculation
  const perPlanMargins = allAcceptedPlans.filter(p => p.type !== 'cash').map(plan => {
    const revPerPatient = Math.round(revenuePerPatient * plan.reimbursementRate * skillMultiplier * labMultiplier);
    const costPerPatient = Math.round((plan.adminCost / 30) / Math.max(actualPatients, 1) + 15); // admin share + supplies
    const margin = revPerPatient - costPerPatient;
    const status = margin > 120 ? 'good' : margin >= 80 ? 'warning' : 'danger';
    return { planId: plan.id, planName: plan.name, revPerPatient, costPerPatient, margin, status, icon: plan.icon };
  });

  // Staffing recommendation
  const staffingRec = {
    currentStaff: staff.length,
    recommendedStaff: staffNeeded,
    understaffed,
    recommendation: understaffed
      ? `Your ${capitationPlans.length > 0 ? 'HMO ' : ''}volume needs ${staffNeeded - staff.length} more staff. You're losing 15% efficiency. Hire assistants and front desk.`
      : `Staff levels adequate for current volume.`,
    penaltyActive: understaffed,
  };

  let reputationChange = 0;
  if (actualPatients > 0) {
    reputationChange = (adjustedSatisfaction - 0.5) * 0.02 + marketingRepBoost;
    if (actualPatients < dailyDemand * 0.5) reputationChange -= 0.01;
    // Overbooked penalty
    if (effectiveCapacity > 0 && actualPatients / effectiveCapacity > 0.9) reputationChange -= 0.005;
    // Cleanliness affects reputation
    if ((cleanliness || 50) < 40) reputationChange -= 0.01;
  }

  return {
    totalCapacity, effectiveCapacity, providerCapacity, builtOps,
    dailyDemand, actualPatients,
    dailyRevenue, dailySalaries, dailyMaintenance, dailySupplies, dailyRent,
    dailyOverhead, dailyInsuranceAdmin, dailyMarketing, dailyUpgradeCosts, dailyLoanPayment,
    totalDailyCosts, dailyProfit,
    reputationChange, satisfactionScore: adjustedSatisfaction,
    hasFrontDesk, assistantBonus,
    annualRevenuePerSqft,
    hmoCapacityPenalty, effectiveCashShare, totalCannibalization,
    avgInsuranceRate, adjustedCapacity,
    // HMO/Capitation metrics
    capitationRevenue: Math.round(capitationRevenue),
    blendedNoShowRate,
    blendedTreatmentAcceptance,
    understaffedPenalty: understaffed,
    patientsAfterNoShows,
    perPlanMargins,
    staffingRec,
    blendedStaffDemand,
    blendedEmergencyRate,
  };
}

// ─── STAFFING RECOMMENDATION HELPER ───
export function getStaffingRecommendation(gameState, stats) {
  if (!stats || !stats.staffingRec) {
    return { currentStaff: (gameState.staff || []).length, recommendedStaff: 0, understaffed: false, recommendation: 'No data yet.', penaltyActive: false };
  }
  return stats.staffingRec;
}
