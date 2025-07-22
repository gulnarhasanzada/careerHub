export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US').format(date);
}

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};