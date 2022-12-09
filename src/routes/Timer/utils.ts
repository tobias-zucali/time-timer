export const parseIntSafe = (value: string | number) => {
  let intValue = typeof(value) === 'number' ? value : parseInt(value);
  return isNaN(intValue) ? 0 : intValue;
};

export const prefixZeros = (value: string | number) => {
  let prefixedValue = `${parseIntSafe(value)}`;
  while (prefixedValue.length < 2) {
    prefixedValue = `0${prefixedValue}`;
  }
  return prefixedValue;
};

export const getSecondsDuration = (
  minutes: string,
  seconds: string,
) => parseIntSafe(minutes) * 60 + parseIntSafe(seconds);

export const getMinutesSeconds = (secondsDuration: number) => {
  const seconds = secondsDuration % 60;
  const minutes = (secondsDuration - seconds) / 60;
  return [prefixZeros(minutes), prefixZeros(Math.ceil(seconds))];
};
