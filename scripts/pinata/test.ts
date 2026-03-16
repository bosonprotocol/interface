import config from "dotenv";
import { PinataSDK } from "pinata";

config.config();
if (!process.env.PINATA_JWT) {
  throw new Error("PINATA_JWT is not defined in the environment variables");
}

if (!process.env.PINATA_GROUP_ID) {
  throw new Error(
    "PINATA_GROUP_ID is not defined in the environment variables"
  );
}

const pinataJwt = process.env.PINATA_JWT;
const pinataGroupId = process.env.PINATA_GROUP_ID;
const pinata = new PinataSDK({
  pinataJwt
});

async function test() {
  try {
    const result = await pinata.testAuthentication();
    console.log("Pinata authentication successful:", result);
  } catch (error) {
    throw new Error(`Pinata authentication failed : ${error}`);
  }
  const gatewayConfig = pinata.gateways.config;
  console.log("Pinata gateway configuration:", gatewayConfig);
}
test()
  .then(() => {
    console.log("Test completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
