let lastId = 0;

export const newId = (prefix = "field-") => {
  lastId++;
  return `${prefix}${lastId}`;
};
