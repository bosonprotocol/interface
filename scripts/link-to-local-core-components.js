/* eslint-disable @typescript-eslint/no-var-requires */
const { program } = require("commander");
const { symlinkSync, existsSync, rmSync, cpSync } = require("fs");
const { resolve } = require("path");

program
  .description(
    "Link local Core-Components build directories to the current node_modules tree"
  )
  .argument("<CC_REPO>", "Core Components local repository")
  .option("--link", "Use symbolic links instead of hard copy")
  .parse(process.argv);

const [ccRepo] = program.args;
const opts = program.opts();
const mode = opts.link ? "link" : "copy";
const folders = ["src", "dist"];

const packages = [
  { path: "common", mode, folders },
  { path: "core-sdk", mode, folders },
  { path: "ethers-sdk", mode, folders },
  { path: "ipfs-storage", mode, folders },
  { path: "metadata", mode, folders },
  { path: "react-kit", mode: "copy", folders } // <-- react-kit symlink causes some problems
];

async function main() {
  for (const package of packages) {
    for (const folder of package.folders) {
      const target = `${resolve(ccRepo, "packages", package.path, folder)}`;
      if (!existsSync(target)) {
        console.error(`Target ${target} does not exist.`);
        continue;
      }
      const linkPath = `${resolve(
        __dirname,
        "..",
        "node_modules/@bosonprotocol",
        package.path,
        folder
      )}`;
      while (existsSync(linkPath)) {
        // remove linkPath first
        rmSync(linkPath, { recursive: true });
        await new Promise((r) => setTimeout(r, 200));
      }
      if (package.mode === "link") {
        console.log(`Create link ${linkPath} --> ${target}`);
        symlinkSync(target, linkPath, "junction");
      }
      if (package.mode === "copy") {
        console.log(`Copy ${target} into ${linkPath}`);
        cpSync(target, linkPath, {
          recursive: true,
          force: true,
          preserveTimestamps: true
        });
      }
    }
  }
}

main()
  .then(() => console.log("success"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
