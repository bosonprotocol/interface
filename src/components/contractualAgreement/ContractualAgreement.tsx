import { Loading, subgraph } from "@bosonprotocol/react-kit";
import { CONFIG } from "lib/config";
import {
  ExtendedProgressStatus,
  useRenderTemplate
} from "lib/utils/hooks/useRenderTemplate";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import useOffer from "../../lib/utils/hooks/offer/useOffer";
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
      ? (CONFIG.buyerSellerAgreementTemplate as string)
      : template;
  const { renderStatus, renderResult } = useRenderTemplate(
    offerId,
    offerData,
    templateUrl
  );

  const isLoading =
    renderStatus === ExtendedProgressStatus.LOADING ||
    renderStatus === ExtendedProgressStatus.IDLE ||
    renderStatus === ExtendedProgressStatus.TRY_WITH_OFFER_ID;
  const isError = renderStatus === ExtendedProgressStatus.ERROR;

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
