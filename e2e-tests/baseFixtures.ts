import { test as baseTest } from "@playwright/test";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

const istanbulCLIOutput = path.join(process.cwd(), ".nyc_output");

export function generateUUID(): string {
  return crypto.randomBytes(16).toString("hex");
}

export const test = baseTest.extend({
  context: async ({ context }, use) => {
    await context.addInitScript(() =>
      window.addEventListener("beforeunload", () => {
        console.log("window coverage", (window as any).__coverage__);
        return (window as any).collectIstanbulCoverage(
          JSON.stringify((window as any).__coverage__)
        );
      })
    );
    await fs.promises.mkdir(istanbulCLIOutput, { recursive: true });
    await context.exposeFunction(
      "collectIstanbulCoverage",
      (coverageJSON: string) => {
        console.log({ coverageJSON });
        if (coverageJSON) {
          fs.writeFileSync(
            path.join(
              istanbulCLIOutput,
              `playwright_coverage_${generateUUID()}.json`
            ),
            coverageJSON
          );
        }
      }
    );
    await use(context);
    for (const page of context.pages()) {
      await page.evaluate(() =>
        (window as any).collectIstanbulCoverage(
          JSON.stringify((window as any).__coverage__)
        )
      );
    }
  }
});

export const expect = test.expect;
