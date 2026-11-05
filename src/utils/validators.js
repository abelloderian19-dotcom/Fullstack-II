export function isValidChileanRun(run) {
  if (!/^\d{6,8}[0-9k]$/i.test(run)) {
    return false;
  }

  const body = run.slice(0, -1);
  const digit = run.slice(-1).toUpperCase();
  let sum = 0;
  let factor = 2;

  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }

  const remainder = 11 - (sum % 11);
  const expected = remainder === 11 ? "0" : remainder === 10 ? "K" : String(remainder);
  return digit === expected;
}
