/**
 * Data Freshness Decay Utility
 * Calculates the decay percentage and status of a dataset over time.
 */

export const calculateFreshness = (createdAt) => {
  if (!createdAt) {
    return {
      score: 100,
      label: "Fresh (100%)",
      isStale: false,
      ageInDays: 0,
      badgeColor: "rgba(255, 255, 255, 0.2)",
      textColor: "#aaa"
    };
  }

  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  const diffHours = Math.max(0, (now - createdTime) / (1000 * 60 * 60));
  const ageInDays = Math.floor(diffHours / 24);

  // Freshness Decay Formula:
  // Starts at 100%. Loses ~10% per day.
  let score = Math.max(15, Math.round(100 - (diffHours / 24) * 12));

  let label = `Fresh (${score}%)`;
  let isStale = false;
  let badgeColor = "rgba(255, 255, 255, 0.1)";
  let textColor = "#9ca3af";

  if (ageInDays >= 5 || score <= 40) {
    isStale = true;
    label = `Stale (${score}%)`;
    badgeColor = "rgba(245, 158, 11, 0.2)";
    textColor = "#f59e0b"; // Orange accent
  } else if (ageInDays >= 2 || score <= 70) {
    isStale = true;
    label = `Degrading (${score}%)`;
    badgeColor = "rgba(245, 158, 11, 0.15)";
    textColor = "#fbbf24"; // Warm amber/orange
  } else if (diffHours >= 12) {
    label = `Good (${score}%)`;
    badgeColor = "rgba(255, 255, 255, 0.08)";
    textColor = "#d1d5db";
  }

  return {
    score,
    label,
    isStale,
    ageInDays,
    diffHours: Math.round(diffHours),
    badgeColor,
    textColor
  };
};
