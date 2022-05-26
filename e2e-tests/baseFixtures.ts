/* eslint @typescript-eslint/no-explicit-any: 0 */
import { expect as baseExpect, test as baseTest } from "@playwright/test";
// import * as crypto from "crypto";
// import * as fs from "fs";
// import * as path from "path";

// const istanbulCLIOutput = path.join(process.cwd(), ".nyc_output");

// export function generateUUID(): string {
//   return crypto.randomBytes(16).toString("hex");
// }

// export const test = baseTest.extend({
//   context: async ({ context }, use) => {
//     await context.addInitScript(() =>
//       window.addEventListener("beforeunload", () =>
//         (window as any).collectIstanbulCoverage(
//           JSON.stringify((window as any).__coverage__)
//         )
//       )
//     );
//     await fs.promises.mkdir(istanbulCLIOutput, { recursive: true });
//     await context.exposeFunction(
//       "collectIstanbulCoverage",
//       (coverageJSON: string) => {
//         // TODO: have no clue why it's undefined?
//         // lib: https://github.com/mxschmitt/playwright-test-coverage
//         console.log("coverageJSON", coverageJSON);
//         if (coverageJSON)
//           fs.writeFileSync(
//             path.join(
//               istanbulCLIOutput,
//               `playwright_coverage_${generateUUID()}.json`
//             ),
//             coverageJSON
//           );
//       }
//     );
//     await use(context);
//     for (const page of context.pages()) {
//       await page.evaluate(() =>
//         (window as any).collectIstanbulCoverage(
//           JSON.stringify((window as any).__coverage__)
//         )
//       );
//     }
//   }
// });

export const test = baseTest;
export const expect = baseExpect;

module.exports = {
  test,
  expect
};
