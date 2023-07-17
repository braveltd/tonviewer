export function findMinAndMax(numbers: number[]): { min: number | undefined; max: number | undefined } {
  return numbers.reduce(
    (acc, curr) => {
      const { min, max } = acc;

      if (min === undefined || curr < min) {
        acc.min = curr;
      }

      if (max === undefined || curr > max) {
        acc.max = curr;
      }

      return acc;
    },
    { min: undefined, max: undefined }
  );
}
