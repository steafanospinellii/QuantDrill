// BrainSprint Question Generator
// Generates randomized mental math / business questions by type and difficulty

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function percentageChange(difficulty) {
  const configs = {
    easy: { base: [100, 200, 500], pct: [10, 20, 25, 50] },
    medium: { base: [120, 250, 375, 840], pct: [15, 30, 40, 60, 75] },
    hard: { base: [137, 284, 612, 948], pct: [12, 17, 33, 62, 87] },
  };
  const cfg = configs[difficulty];
  const base = pick(cfg.base);
  const pct = pick(cfg.pct);
  const direction = pick(['increase', 'decrease']);
  const result = direction === 'increase'
    ? Math.round(base * (1 + pct / 100))
    : Math.round(base * (1 - pct / 100));
  return {
    type: 'percentage_change',
    prompt: `A product costs $${base}. After a ${pct}% ${direction}, what is the new price?`,
    correct_answer: result,
    difficulty,
  };
}

function multiplication(difficulty) {
  let a, b;
  if (difficulty === 'easy') { a = rand(2, 12); b = rand(2, 12); }
  else if (difficulty === 'medium') { a = rand(12, 25); b = rand(12, 25); }
  else { a = rand(25, 99); b = rand(11, 19); }
  return {
    type: 'multiplication',
    prompt: `${a} × ${b} = ?`,
    correct_answer: a * b,
    difficulty,
  };
}

function division(difficulty) {
  let b, result;
  if (difficulty === 'easy') { b = pick([2, 4, 5, 10]); result = rand(10, 50); }
  else if (difficulty === 'medium') { b = pick([3, 6, 7, 8, 9]); result = rand(10, 80); }
  else { b = pick([7, 8, 9, 11, 12]); result = rand(20, 120); }
  const a = b * result;
  return {
    type: 'division',
    prompt: `${a} ÷ ${b} = ?`,
    correct_answer: result,
    difficulty,
  };
}

function growthRate(difficulty) {
  const configs = {
    easy: { years: [1, 2], rate: [10, 20, 50, 100] },
    medium: { years: [2, 3], rate: [15, 25, 30, 40] },
    hard: { years: [2, 3, 4], rate: [12, 18, 22, 35] },
  };
  const cfg = configs[difficulty];
  const base = pick([100, 200, 400, 500, 1000]);
  const rate = pick(cfg.rate);
  const years = pick(cfg.years);
  // Simplified: only 1-2 years to keep it mental
  let result = base;
  for (let i = 0; i < years; i++) result = Math.round(result * (1 + rate / 100));
  const yearLabel = years === 1 ? 'year' : 'years';
  return {
    type: 'growth_rate',
    prompt: `Revenue is $${base}M and grows ${rate}% annually. After ${years} ${yearLabel}, what is it? ($M)`,
    correct_answer: result,
    difficulty,
  };
}

function businessMath(difficulty) {
  const types = ['margin', 'revenue', 'cagr_simple'];
  const t = pick(types);

  if (t === 'margin') {
    const revenue = pick([100, 200, 500, 800, 1000]);
    const margin_pct = pick(difficulty === 'easy' ? [10, 20, 25, 50] : [15, 22, 35, 40, 60]);
    const profit = Math.round(revenue * margin_pct / 100);
    return {
      type: 'business_math',
      prompt: `Revenue = $${revenue}M, Margin = ${margin_pct}%. What is profit? ($M)`,
      correct_answer: profit,
      difficulty,
    };
  }

  if (t === 'revenue') {
    const price = pick(difficulty === 'easy' ? [10, 20, 50] : [15, 25, 40, 75]);
    const units = pick(difficulty === 'easy' ? [100, 200, 500] : [120, 250, 350, 480]);
    return {
      type: 'business_math',
      prompt: `Price = $${price}, Units sold = ${units.toLocaleString()}. What is revenue?`,
      correct_answer: price * units,
      difficulty,
    };
  }

  // Simple 2-period CAGR-style
  const start = pick([100, 200, 250, 400]);
  const end_mult = pick(difficulty === 'easy' ? [2, 4] : [1.5, 3, 5]);
  const end_val = Math.round(start * end_mult);
  return {
    type: 'business_math',
    prompt: `A company grew from $${start}M to $${end_val}M. By what factor did it grow?`,
    correct_answer: end_mult,
    difficulty,
  };
}

function marketSizing(difficulty) {
  const scenarios = [
    {
      prompt: 'A city has 1M people. If 20% own a car and pay $500/yr for insurance, what is the market size? ($M)',
      answer: 100,
    },
    {
      prompt: 'A country has 50M households. 40% subscribe to streaming at $15/mo. Annual market size? ($B, round)',
      answer: Math.round(50 * 0.4 * 15 * 12 / 1000),
    },
    {
      prompt: 'Office building has 2,000 workers. Each drinks 2 coffees/day at $3 each. Annual coffee spend? ($K)',
      answer: Math.round(2000 * 2 * 3 * 250 / 1000),
    },
  ];
  const s = pick(scenarios);
  return {
    type: 'market_sizing',
    prompt: s.prompt,
    correct_answer: s.answer,
    difficulty,
  };
}

export function generateQuestion(difficulty = 'medium') {
  const generators = [percentageChange, multiplication, division, growthRate, businessMath, marketSizing];
  const weights = {
    easy: [2, 3, 3, 1, 1, 1],
    medium: [2, 2, 2, 2, 2, 1],
    hard: [1, 2, 2, 2, 2, 2],
  };
  const w = weights[difficulty];
  const pool = [];
  generators.forEach((g, i) => { for (let j = 0; j < w[i]; j++) pool.push(g); });
  const gen = pick(pool);
  return gen(difficulty);
}

export function generateSession(difficulty = 'medium', count = 10) {
  return Array.from({ length: count }, () => generateQuestion(difficulty));
}

export function calculateScore(results, difficulty) {
  const multiplier = { easy: 0.8, medium: 1.0, hard: 1.3 }[difficulty];
  let baseScore = 0;
  results.forEach(r => {
    if (r.correct) {
      const speedBonus = Math.max(0, 1 - r.timeTaken / r.timeLimit);
      baseScore += 8 + speedBonus * 2;
    }
  });
  const raw = Math.round(baseScore * multiplier);
  return Math.min(100, raw);
}

export function getSpeedRating(avgTime, difficulty) {
  const thresholds = {
    easy: { lightning: 3, fast: 6, average: 10 },
    medium: { lightning: 4, fast: 8, average: 12 },
    hard: { lightning: 5, fast: 10, average: 14 },
  };
  const t = thresholds[difficulty];
  if (avgTime <= t.lightning) return 'Lightning ⚡';
  if (avgTime <= t.fast) return 'Fast 🔥';
  if (avgTime <= t.average) return 'Average';
  return 'Slow 🐢';
}

export function getPercentile(score, difficulty) {
  // Simulated percentile curve
  const base = { easy: 60, medium: 72, hard: 85 }[difficulty];
  if (score >= 90) return Math.min(99, base + 25);
  if (score >= 75) return base + 15;
  if (score >= 60) return base;
  if (score >= 40) return base - 15;
  return base - 25;
}

export function getTimerSeconds(difficulty) {
  return { easy: 15, medium: 12, hard: 8 }[difficulty];
}

export function checkAnswer(userAnswer, correctAnswer) {
  const ua = parseFloat(String(userAnswer).replace(/,/g, ''));
  const ca = parseFloat(correctAnswer);
  if (isNaN(ua)) return false;
  // Allow 1% tolerance for floating-point edge cases
  return Math.abs(ua - ca) <= Math.abs(ca) * 0.01 || Math.abs(ua - ca) < 0.5;
}