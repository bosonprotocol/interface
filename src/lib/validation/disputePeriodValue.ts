import { CONFIG } from "./../config";

function disputePeriodValue(msg: string) {
  return this.test("disputePeriodValue", function (value: string) {
    const numberValue = value && Number(value);

    if (numberValue && numberValue < CONFIG.minimumDisputePeriodInDays) {
      throw this.createError({
        path: this.path,
        message:
          msg ||
          `The value should be equal or more than ${CONFIG.minimumDisputePeriodInDays}`
      });
    }
    return true;
  });
}
export default disputePeriodValue;
