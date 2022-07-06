export const getDateTimestamp = (date: string) => {
  const number = Number(date);

  return !isNaN(number) ? number * 1000 : 0;
};
