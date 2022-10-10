import { ethers } from "ethers";

import { CONFIG } from "../../../config";

// lens contract info can all be found on the deployed
// contract address on polygon.
export const getLensHub = (signer: ethers.Signer) =>
  new ethers.Contract(
    CONFIG.lens.LENS_HUB_CONTRACT!,
    CONFIG.lens.LENS_HUB_ABI,
    signer
  );
export const getLensPeriphery = (signer: ethers.Signer) =>
  new ethers.Contract(
    CONFIG.lens.LENS_PERIPHERY_CONTRACT!,
    CONFIG.lens.LENS_PERIPHERY_ABI,
    signer
  );
