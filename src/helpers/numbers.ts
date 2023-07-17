export const prettifyPrice = (value: number) => {
  const maximumFractionDigits = value < 1 ? 10 : value >= 10 ? 2 : 3;

  if (value < 1 && value > 0.001) {
    return new Intl.NumberFormat('en', {}).format(value);
  }

  return new Intl.NumberFormat('en', { maximumFractionDigits }).format(value);
};
