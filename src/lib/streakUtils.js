// Streak management utilities

export function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

export function getYesterdayDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function isStreakAlive(lastActiveDate) {
  if (!lastActiveDate) return false;
  const today = getTodayDate();
  const yesterday = getYesterdayDate();
  return lastActiveDate === today || lastActiveDate === yesterday;
}

export function hasCompletedTodaysSprint(lastActiveDate) {
  return lastActiveDate === getTodayDate();
}

export function calculateNewStreak(currentStreak, lastActiveDate) {
  const today = getTodayDate();
  const yesterday = getYesterdayDate();
  if (lastActiveDate === today) return currentStreak; // already done today
  if (lastActiveDate === yesterday) return currentStreak + 1; // continuing streak
  return 1; // streak broken, start fresh
}