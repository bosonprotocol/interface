import { subgraph } from "@bosonprotocol/react-kit";
import Loading from "components/ui/Loading";
import {
  ExtendedProgressStatus,
  useRenderTemplate
} from "lib/utils/hooks/useRenderTemplate";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { CONFIG } from "../../lib/config";
import SimpleError from "../error/SimpleError";

interface Props {
  offerId: string | undefined;
  offerData: subgraph.OfferFieldsFragment | undefined;
}

export default function License({ offerId, offerData }: Props) {
  const templateUrl = CONFIG.rNFTLicenseTemplate as string; // TODO: get the template from the offer metadata
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
  if (isLoading) {
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
