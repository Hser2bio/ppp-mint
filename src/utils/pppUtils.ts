import * as PPPConstants from './pppConstants';

export function abbreviatedNumber(value: number, fixed = 1) {
  if (value < 1e3) return value;
  if (value >= 1e3 && value < 1e6) return +(value / 1e3).toFixed(fixed) + 'K';
  if (value >= 1e6 && value < 1e9) return +(value / 1e6).toFixed(fixed) + 'M';
  if (value >= 1e9 && value < 1e12) return +(value / 1e9).toFixed(fixed) + 'B';
  if (value >= 1e12) return +(value / 1e12).toFixed(fixed) + 'T';
}

export const LAMPORTS_PER_SOL = 1000000000;

export function lamportsToSol(lamports: number): number {
  return Math.abs(lamports) / LAMPORTS_PER_SOL;
}

export function debug(val: any) {
  if (PPPConstants.DEBUG) console.log(val);
}

