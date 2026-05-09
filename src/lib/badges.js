// QuantDrill Achievement System
import { BADGES_PART_1 } from './badgesDataPart1';
import { BADGES_PART_2 } from './badgesDataPart2';
import { BADGES_PART_3 } from './badgesDataPart3';

export const BADGES = [
  ...BADGES_PART_1,
  ...BADGES_PART_2,
  ...BADGES_PART_3,
];

export const CATEGORY_LABELS = {
  mental_math:        '⚡ Mental Math',
  percentages_growth: '📈 % & Growth',
  business_math:      '💼 Business Math',
  market_sizing:      '🌍 Market Sizing',
  gmat_quant:         '🎯 GMAT/GRE Quant',
  daily:              '🔀 Daily Mix',
  general:            '🏅 General',
  streaks:            '🔥 Streaks',
  volume:             '🚀 Volume',
  accuracy:           '✨ Accuracy',
  speed:              '⚡ Speed',
  mastery:            '👑 Mastery',
  difficulty:         '🔥 Difficulty',
  time_of_day:        '⏰ Time of Day',
  special:            '🎯 Special Milestones',
  fun:                '🎊 Fun & Personality',
};

/** Compute full badge context from sessions + streak */
export function computeBadgeContext(sessions, streak) {
  const totalDrills = sessions.length;
  const catCount = {};
  const catBest = {};
  const catAccSum = {};
  const catAvgAcc = {};
  let maxScore = 0;

  for (const s of sessions) {
    const cat = s.category || 'daily';
    catCount[cat] = (catCount[cat] || 0) + 1;
    if (!catBest[cat] || s.score > catBest[cat]) catBest[cat] = s.score;
    if (s.score > maxScore) maxScore = s.score;
    catAccSum[cat] = (catAccSum[cat] || 0) + (s.accuracy || 0);
  }

  for (const cat of Object.keys(catCount)) {
    catAvgAcc[cat] = Math.round(catAccSum[cat] / catCount[cat]);
  }

  return { totalDrills, streak, catCount, catBest, catAvgAcc, maxScore };
}

/** Premium badges require this set of IDs — unlockable only with premium */
export const PREMIUM_BADGE_IDS = new Set([
  'streak_30', 'drills_500', 'perfect_score',
  'mental_elite', 'compound_master', 'boardroom_ready', 'case_cracker', 'quant_elite',
]);