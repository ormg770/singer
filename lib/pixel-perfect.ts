export const PRE_SAVE_URL = "https://ffm.to/d3x4n0";
// Release midnight in UTC−4; an explicit offset keeps every visitor in sync.
export const RELEASE_AT = "2026-10-26T00:00:00-04:00";

export function getCountdown(now: number) {
  const seconds = Math.max(
    0,
    Math.floor((Date.parse(RELEASE_AT) - now) / 1000),
  );
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
    released: now >= Date.parse(RELEASE_AT),
  };
}
