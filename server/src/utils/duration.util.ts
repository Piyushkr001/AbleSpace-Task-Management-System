/**
 * Parses duration string (e.g. "7d", "24h", "60m", "3600s") into milliseconds.
 * Defaults to 7 days (604800000 ms) if invalid or omitted.
 */
export function parseDurationToMs(durationStr: string): number {
  if (!durationStr || typeof durationStr !== "string") {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const match = durationStr.trim().match(/^(\d+)\s*([smhd])?$/i);
  if (!match) {
    const parsedNum = Number(durationStr);
    return isNaN(parsedNum) ? 7 * 24 * 60 * 60 * 1000 : parsedNum * 1000;
  }

  const value = parseInt(match[1], 10);
  const unit = (match[2] || "s").toLowerCase();

  switch (unit) {
    case "d":
      return value * 24 * 60 * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "m":
      return value * 60 * 1000;
    case "s":
    default:
      return value * 1000;
  }
}
