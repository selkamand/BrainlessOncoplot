export function cumSum(arr) {
  let sum = 0;
  return arr.reduce((result, currentValue) => {
    sum += currentValue;
    result.push(sum);
    return result;
  }, []);
}
