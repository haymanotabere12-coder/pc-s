/**
 * Formats numbers into Ethiopian Birr (ETB) currency string
 * e.g., 185000 -> "185,000 ETB" or "185,000 ብር"
 */
export const formatETB = (amount) => {
  const num = Number(amount) || 0;
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ETB`;
};

export const formatBirr = (amount) => {
  const num = Number(amount) || 0;
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ብር`;
};

export const formatPrice = (amount) => {
  return formatETB(amount);
};
