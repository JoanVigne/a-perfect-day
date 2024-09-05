export const formatDate = (
  dateString: string,
  includeWeekday: boolean
): string => {
  const date = new Date(dateString);
  const userLocale = navigator.language || "en-US"; // Default to 'en-US' if navigator.language is not available
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
  };
  if (includeWeekday) {
    options.weekday = "long";
  }
  return date.toLocaleDateString(userLocale, options);
};
