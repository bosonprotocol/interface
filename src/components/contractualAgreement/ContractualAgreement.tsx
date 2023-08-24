import { subgraph } from "@bosonprotocol/react-kit";
import { Loading } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { ProgressStatus } from "../../lib/types/progressStatus";
import useOffer from "../../lib/utils/hooks/offer/useOffer";
import { useRenderTemplate } from "../../lib/utils/hooks/useRenderTemplate";
import SimpleError from "../error/SimpleError";

interface Props {
  offerId: string | undefined;
  offerData: subgraph.OfferFieldsFragment | undefined;
}

const getTemplate = (
  offer: subgraph.OfferFieldsFragment | undefined
): string | undefined => {
  return (offer?.metadata as subgraph.ProductV1MetadataEntity)?.exchangePolicy
    ?.template;
};

export default function ContractualAgreement({ offerId, offerData }: Props) {
  const { config } = useConfigContext();
  const { data: offerFetched, isFetching } = useOffer(
    {
      offerId: offerId || ""
    },
    {
      enabled: !!offerId && !getTemplate(offerData)
    }
  );
  const offer = offerFetched || offerData;
  const template = getTemplate(offer);
  const templateUrl =
    !template || template === "fairExchangePolicy"
      ? (config.buyerSellerAgreementTemplate as string)
      : template;
  const { renderStatus, renderResult } = useRenderTemplate(
    offerId,
    offerData,
    templateUrl
  );

  const isLoading =
    renderStatus === ProgressStatus.LOADING ||
    renderStatus === ProgressStatus.IDLE;
  const isError = renderStatus === ProgressStatus.ERROR;

  if (isError) {
    return <SimpleError />;
  }
  if (isLoading || isFetching) {
    return <Loading />;
  }
  return (
    <ReactMarkdown
      children={renderResult}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
    ></ReactMarkdown>
  );
}
