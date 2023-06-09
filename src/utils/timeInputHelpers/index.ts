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
  const secondsDurationRounded = Math.ceil(secondsDuration);
  const seconds = secondsDurationRounded % 60;
  const minutes = (secondsDurationRounded - seconds) / 60;
  return [prefixZeros(minutes), prefixZeros(seconds)];
};
