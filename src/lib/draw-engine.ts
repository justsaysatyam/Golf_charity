import { Score } from './types';

/**
 * Draw Engine - Core logic for monthly prize draws
 */

// Generate random winning numbers (5 unique numbers between 1-45)
export function generateRandomNumbers(): number[] {
  const numbers: Set<number> = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

// Generate weighted numbers based on score frequency analysis
export function generateWeightedNumbers(allScores: Score[]): number[] {
  if (allScores.length === 0) return generateRandomNumbers();

  // Count frequency of each score value
  const frequency: Map<number, number> = new Map();
  for (let i = 1; i <= 45; i++) frequency.set(i, 0);
  
  allScores.forEach((score) => {
    const current = frequency.get(score.score_value) || 0;
    frequency.set(score.score_value, current + 1);
  });

  // Create weighted pool - less frequent scores have higher weight
  const maxFreq = Math.max(...Array.from(frequency.values()));
  const weightedPool: number[] = [];

  frequency.forEach((freq, num) => {
    const weight = maxFreq - freq + 1;
    for (let i = 0; i < weight; i++) {
      weightedPool.push(num);
    }
  });

  // Pick 5 unique from weighted pool
  const selected: Set<number> = new Set();
  let attempts = 0;
  while (selected.size < 5 && attempts < 1000) {
    const idx = Math.floor(Math.random() * weightedPool.length);
    selected.add(weightedPool[idx]);
    attempts++;
  }

  // Fallback if not enough unique
  while (selected.size < 5) {
    selected.add(Math.floor(Math.random() * 45) + 1);
  }

  return Array.from(selected).sort((a, b) => a - b);
}

// Calculate match count between user scores and winning numbers
export function calculateMatches(
  userScores: number[],
  winningNumbers: number[]
): { matchedNumbers: number[]; matchCount: number } {
  const winSet = new Set(winningNumbers);
  const matchedNumbers = userScores.filter((score) => winSet.has(score));
  const uniqueMatches = Array.from(new Set(matchedNumbers));
  return {
    matchedNumbers: uniqueMatches,
    matchCount: uniqueMatches.length,
  };
}

// Calculate prize pool distribution
export function calculatePrizePool(
  activeSubscribers: number,
  monthlyRate: number = 9.99,
  rolloverAmount: number = 0
): {
  totalPool: number;
  fiveMatchPool: number;
  fourMatchPool: number;
  threeMatchPool: number;
} {
  // Assuming charity percentage is separate, this is the prize pool portion
  const totalRevenue = activeSubscribers * monthlyRate;
  const prizePoolPercentage = 0.7; // 70% goes to prize pool (30% ops + charity handled separately)
  const totalPool = totalRevenue * prizePoolPercentage;

  return {
    totalPool: totalPool + rolloverAmount,
    fiveMatchPool: totalPool * 0.4 + rolloverAmount, // 40% + rollover
    fourMatchPool: totalPool * 0.35, // 35%
    threeMatchPool: totalPool * 0.25, // 25%
  };
}

// Determine match type
export function getMatchType(matchCount: number): '5_match' | '4_match' | '3_match' | null {
  if (matchCount >= 5) return '5_match';
  if (matchCount === 4) return '4_match';
  if (matchCount === 3) return '3_match';
  return null;
}

// Split prize among winners
export function splitPrize(prizePool: number, winnerCount: number): number {
  if (winnerCount === 0) return 0;
  return Math.floor((prizePool / winnerCount) * 100) / 100;
}

// Full draw execution
export function executeDraw(
  allUserScores: Map<string, number[]>,
  drawType: 'random' | 'weighted',
  allScoresFlat: Score[],
  prizePool: { fiveMatchPool: number; fourMatchPool: number; threeMatchPool: number }
): {
  winningNumbers: number[];
  results: Array<{
    userId: string;
    matchedNumbers: number[];
    matchCount: number;
    matchType: '5_match' | '4_match' | '3_match' | null;
  }>;
  winners: {
    fiveMatch: string[];
    fourMatch: string[];
    threeMatch: string[];
  };
  prizes: {
    fiveMatchPrize: number;
    fourMatchPrize: number;
    threeMatchPrize: number;
  };
  jackpotRollover: number;
} {
  // Generate winning numbers
  const winningNumbers =
    drawType === 'weighted'
      ? generateWeightedNumbers(allScoresFlat)
      : generateRandomNumbers();

  // Check each user's scores against winning numbers
  const results: Array<{
    userId: string;
    matchedNumbers: number[];
    matchCount: number;
    matchType: '5_match' | '4_match' | '3_match' | null;
  }> = [];

  const winners = {
    fiveMatch: [] as string[],
    fourMatch: [] as string[],
    threeMatch: [] as string[],
  };

  allUserScores.forEach((scores, userId) => {
    const { matchedNumbers, matchCount } = calculateMatches(scores, winningNumbers);
    const matchType = getMatchType(matchCount);

    results.push({ userId, matchedNumbers, matchCount, matchType });

    if (matchType === '5_match') winners.fiveMatch.push(userId);
    if (matchType === '4_match') winners.fourMatch.push(userId);
    if (matchType === '3_match') winners.threeMatch.push(userId);
  });

  // Calculate prizes
  const fiveMatchPrize = splitPrize(prizePool.fiveMatchPool, winners.fiveMatch.length);
  const fourMatchPrize = splitPrize(prizePool.fourMatchPool, winners.fourMatch.length);
  const threeMatchPrize = splitPrize(prizePool.threeMatchPool, winners.threeMatch.length);

  // Jackpot rollover if no 5-match winner
  const jackpotRollover = winners.fiveMatch.length === 0 ? prizePool.fiveMatchPool : 0;

  return {
    winningNumbers,
    results,
    winners,
    prizes: { fiveMatchPrize, fourMatchPrize, threeMatchPrize },
    jackpotRollover,
  };
}
