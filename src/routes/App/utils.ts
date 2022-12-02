export const parseIntSafe = (value: string | number) => {
  let intValue = typeof(value) === 'number' ? value : parseInt(value);
  return isNaN(intValue) ? 0 : intValue;
};

export const prefixZeros = (value: string | number) => {
  let prefixedValue = `${parseIntSafe(value)}`;
  while (prefixedValue.length < 2) {
    prefixedValue = `0${prefixedValue}`
  }
  return prefixedValue;
};

export const getDuration = (minutes: string, seconds: string) => {
  return parseIntSafe(minutes) * 60 + parseIntSafe(seconds);
};

export const getMinutesSeconds = (secondsDuration: number) => {
  const seconds = secondsDuration % 60;
  const minutes = (secondsDuration - seconds) / 60;
  return [prefixZeros(minutes), prefixZeros(seconds)]
};

export const getPercentage = (current: number, total: number) => {
  if (current > 0) {
    return (current - 1) / total * 100;
  } else {
    return 0;
  }
};
