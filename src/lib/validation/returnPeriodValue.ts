import { CONFIG } from "./../config";

function returnPeriodValue(msg: string) {
  return this.test("returnPeriodValue", function (value: string) {
    const numberValue = value && Number(value);

    if (numberValue && numberValue < CONFIG.minimumReturnPeriodInDays) {
      throw this.createError({
        path: this.path,
        message:
          msg ||
          `The value should be equal or more than ${CONFIG.minimumReturnPeriodInDays}`
      });
    }
    return true;
  });
}
export default returnPeriodValue;
