import {
  parseIntSafe,
  prefixZeros,
  getDuration,
  getMinutesSeconds,
  getPercentage
} from './utils'


test('parseIntSafe', () => {
  expect(parseIntSafe(1)).toBe(1);
  expect(parseIntSafe(NaN)).toBe(0);
  expect(parseIntSafe('99')).toBe(99);
  expect(parseIntSafe('abc')).toBe(0);
});

test('prefixZeros', () => {
  expect(prefixZeros(1)).toBe('01');
  expect(prefixZeros(NaN)).toBe('00');
  expect(prefixZeros('99')).toBe('99');
  expect(prefixZeros('999')).toBe('999');
});

test('getDuration', () => {
  expect(getDuration('', '')).toBe(0);
  expect(getDuration('1', '1')).toBe(61);
  expect(getDuration('10', '99')).toBe(699);
});

test('getMinutesSeconds', () => {
  expect(getMinutesSeconds(1)).toEqual(['00', '01']);
  expect(getMinutesSeconds(61)).toEqual(['01', '01']);
  expect(getMinutesSeconds(123)).toEqual(['02', '03']);
});

test('getPercentage', () => {
  expect(getPercentage(4, 4)).toBe(75);
  expect(getPercentage(3, 4)).toBe(50);
  expect(getPercentage(2, 4)).toBe(25);
  expect(getPercentage(1, 4)).toBe(0);
  expect(getPercentage(0, 4)).toBe(0);
  expect(getPercentage(-1, 4)).toBe(0);
});
