export const parseStringToBoolean = (value: string | undefined): boolean => {
  if (value === undefined) return false;
  return value === 'true';
};

export const booleanToString = (value: boolean | undefined): string => {
  if (value === undefined) return 'false';
  return value ? 'true' : 'false';
};

export const stringToNumber = (value: string | undefined): number => {
  if (value === undefined) return 0;
  return Number(value);
};

export const numberToString = (value: number | undefined): string => {
  if (value === undefined) return '';
  return String(value);
};
