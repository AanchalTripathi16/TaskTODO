/**
 * Formats a date string to a consistent format
 * Uses explicit locale and options to ensure server/client consistency
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

