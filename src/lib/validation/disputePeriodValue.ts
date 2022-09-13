function disputePeriodValue(msg: string) {
  return this.test("disputePeriodValue", function (value: string) {
    const numberValue = value && Number(value);

    if (numberValue && numberValue < 30) {
      throw this.createError({
        path: this.path,
        message: msg || "The value should be equal or more than 30"
      });
    }
    return true;
  });
}
export default disputePeriodValue;
