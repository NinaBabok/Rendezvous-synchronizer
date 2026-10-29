/**
 * Formats a duration in minutes into a human-readable string.
 * - From 60 min, writes in hours like "1 hr" or "1 hr 40 min" (e.g. 110 min -> "1 hr 50 min").
 * - Under 60 min, writes like "45 min".
 * - 0 min writes like "0 min".
 */
export function formatMinutesDiff(minutes: number): string {
  const totalMins = Math.max(0, Math.round(minutes));
  if (totalMins === 0) return '0 min';
  if (totalMins < 60) return `${totalMins} min`;

  const hours = Math.floor(totalMins / 60);
  const remainingMins = totalMins % 60;

  if (remainingMins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMins} min`;
}

/**
 * Compact version for badges/tight grid cells (e.g. "1h 40m", "1h", "45m")
 */
export function formatMinutesDiffCompact(minutes: number): string {
  const totalMins = Math.max(0, Math.round(minutes));
  if (totalMins === 0) return '0m';
  if (totalMins < 60) return `${totalMins}m`;

  const hours = Math.floor(totalMins / 60);
  const remainingMins = totalMins % 60;

  if (remainingMins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMins}m`;
}
