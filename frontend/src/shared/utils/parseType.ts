export const parseStringToBoolean = (value: string): boolean => {
  return value === 'true';
};

export const booleanToString = (value: boolean): string => {
  return value ? 'true' : 'false';
};
