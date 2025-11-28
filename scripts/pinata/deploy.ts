import config from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { PinataSDK } from "pinata";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
console.log(__filename);
config.config();

if (!process.env.PINATA_JWT) {
  throw new Error("PINATA_JWT is not defined in the environment variables");
}

if (!process.env.PINATA_GROUP_ID) {
  throw new Error(
    "PINATA_GROUP_ID is not defined in the environment variables"
  );
}

if (!process.env.REACT_APP_IPFS_IMAGE_GATEWAY) {
  throw new Error(
    "REACT_APP_IPFS_IMAGE_GATEWAY is not defined in the environment variables"
  );
}

const DIRECTORY_TO_UPLOAD = path.join(__dirname, "../../build");
const FILENAME_IN_PINATA = "build";

const pinataJwt = process.env.PINATA_JWT;
const pinataGroupId = process.env.PINATA_GROUP_ID;
let gateway = process.env.REACT_APP_IPFS_IMAGE_GATEWAY;
gateway = gateway.endsWith("/") ? gateway.slice(0, -1) : gateway;
const pinata = new PinataSDK({
  pinataJwt,
  pinataGateway: gateway.replace("https://", "").replace("/ipfs", "")
});

/**
 * Builds an array of File objects from all files in a directory
 * @param parentDir - The directory path to search
 * @returns Array of File objects conforming to W3C File API
 */
async function buildFileArray(parentDir: string): Promise<File[]> {
  const fileArray: File[] = [];

  // Check if the directory exists
  if (!fs.existsSync(parentDir)) {
    throw new Error(`Directory does not exist: ${parentDir}`);
  }

  // Check if it's actually a directory
  const stats = fs.statSync(parentDir);
  if (!stats.isDirectory()) {
    throw new Error(`Path is not a directory: ${parentDir}`);
  }

  /**
   * Recursively traverse directories and collect files
   * @param currentPath - Current path being processed
   * @param relativePath - Relative path from parent directory
   */
  function traverseDirectory(currentPath: string, relativePath = "") {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const itemStats = fs.statSync(itemPath);
      const relativeItemPath = path.join(relativePath, item);

      if (itemStats.isDirectory()) {
        // Recursively process subdirectories
        traverseDirectory(itemPath, relativeItemPath);
      } else if (itemStats.isFile()) {
        // Read file content and create File object
        const fileContent = fs.readFileSync(itemPath);
        const blob = new Blob([fileContent]);

        // Create File object with proper name and last modified date
        const file = new File([blob], relativeItemPath.replace(/\\/g, "/"), {
          type: getMimeType(itemPath),
          lastModified: itemStats.mtime.getTime()
        });

        fileArray.push(file);
      }
    }
  }

  /**
   * Get MIME type based on file extension
   * @param filePath - Path to the file
   * @returns MIME type string
   */
  function getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".txt": "text/plain",
      ".md": "text/markdown",
      ".ts": "application/typescript",
      ".tsx": "application/typescript",
      ".xml": "application/xml",
      ".ico": "image/x-icon",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
      ".ttf": "font/ttf",
      ".eot": "application/vnd.ms-fontobject"
    };

    return mimeTypes[ext] || "application/octet-stream";
  }

  // Start traversing from the parent directory
  traverseDirectory(parentDir);

  return fileArray;
}

async function deploy() {
  try {
    const result = await pinata.testAuthentication();
    console.log("Pinata authentication successful:", result);
  } catch (error) {
    throw new Error(`Pinata authentication failed : ${error}`);
  }
  const groups = await pinata.groups.public.list();
  console.log("Available groups:", groups);
  const group = await pinata.groups.public.get({
    groupId: pinataGroupId
  });
  if (!group) {
    throw new Error("Group not found");
  }
  console.log("Retrieved group:", group);
  const [build] = await pinata.files.public
    .list()
    .name(FILENAME_IN_PINATA)
    .then((res) => {
      return res.files;
    });
  if (build) {
    console.log("build file:", build);
    const deleteResponse = await pinata.files.public
      .delete([build.id])
      .then((res) => {
        console.log("build file deleted");
        return res;
      })
      .catch((error) => {
        throw new Error(`Failed to delete build file: ${error}`);
      });
    console.log("Final delete response:", deleteResponse);
  }
  const files = await buildFileArray(DIRECTORY_TO_UPLOAD);
  console.log(`Uploading ${files.length} files from build directory...`);
  const uploadResponse = await pinata.upload.public
    .fileArray(files)
    .group(pinataGroupId)
    .name(FILENAME_IN_PINATA)
    .key(pinataJwt)
    .then((res) => {
      console.log("Build directory uploaded to Pinata:", res);
      return res;
    })
    .catch((error) => {
      throw new Error(`Failed to upload build directory: ${error}`);
    });
  console.log("Upload response:", uploadResponse);
  console.log(`Website available at: ${gateway}/${uploadResponse.cid}/#/dapp`);
}

deploy()
  .then(() => {
    console.log("Deployment completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment encountered an error:", error);
    process.exit(1);
  });
