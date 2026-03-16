import Cloudflare from "cloudflare";
import config from "dotenv";

config.config();
if (!process.env.CLOUDFLARE_API_TOKEN) {
  throw new Error(
    "CLOUDFLARE_API_TOKEN is not defined in the environment variables"
  );
}

const SUBDOMAIN = "testing";
const TARGET = "boson-dapp-testing.mypinata.cloud";

const client = new Cloudflare({
  apiToken: process.env["CLOUDFLARE_API_TOKEN"] // This is the default and can be omitted
});

async function test() {
  let zone;
  try {
    const zones = await client.zones.list({
      name: "bosonapp.io"
    });
    console.log("Zones:", zones);
    zone = zones.result[0];
    if (!zone) {
      throw new Error("Zone not found for bosonapp.io");
    }
  } catch (error) {
    throw new Error(`Error fetching zones: ${error}`);
  }
  let dnsRecord;
  try {
    const dnsRecords = await client.dns.records.list({
      zone_id: zone.id,
      type: "CNAME",
      name: { exact: SUBDOMAIN } // TODO: can not retrieve the existing record without exact match?
    });
    console.log("DNS Records:", dnsRecords);
    dnsRecord = dnsRecords.result[0];
  } catch (error) {
    throw new Error(`Error fetching DNS records: ${error}`);
  }
  const params = {
    zone_id: zone.id,
    ttl: 1, // AUTO
    name: SUBDOMAIN,
    proxied: true,
    content: TARGET
  };
  let response;
  try {
    if (!dnsRecord) {
      response = await client.dns.records.create({
        type: "CNAME",
        ...params,
        comment:
          "Created by Cloudflare SDK test script on " + new Date().toISOString()
      });
    } else {
      response = await client.dns.records.update(dnsRecord.id, {
        type: "CNAME",
        ...params,
        comment:
          "Updated by Cloudflare SDK test script on " + new Date().toISOString()
      });
    }
    console.log("Create/Update DNS Record Response:", response);
  } catch (error) {
    throw new Error(`Error creating or updating DNS record: ${error}`);
  }
}

test()
  .then(() => {
    console.log("Test completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Test encountered an error:", error);
    process.exit(1);
  });
