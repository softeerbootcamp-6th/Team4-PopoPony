export const parseStringToBoolean = (value: string): boolean => {
  return value === 'true';
};

export const booleanToString = (value: boolean | undefined): string => {
  if (value === undefined) return 'false';
  return value ? 'true' : 'false';
};
