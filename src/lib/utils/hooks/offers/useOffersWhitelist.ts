import { useConfigContext } from "components/config/ConfigContext";
import { useQuery } from "react-query";
import * as Yup from "yup";
const offersWhitelistSchema = Yup.array(Yup.string().required()).required();
export const useOffersWhitelist = () => {
  const {
    config: { envConfig }
  } = useConfigContext();
  return useQuery(
    ["useOffersWhitelist", envConfig.configId, envConfig.offersWhiteList],
    async () => {
      const response = await fetch(envConfig.offersWhiteList);
      if (!response.ok) {
        throw new Error(`Error fetching offers list: ${response.statusText}`);
      }
      const data = await response.json();
      const offersWhiteList = await offersWhitelistSchema.validate(data);
      return Array.from(new Set(offersWhiteList));
    },
    { enabled: true }
  );
};
