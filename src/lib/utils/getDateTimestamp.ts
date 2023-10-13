export const getDateTimestamp = (date: string | undefined | null) => {
  const number = Number(date);

  return !isNaN(number) ? number * 1000 : 0;
};
