import { subgraph } from "@bosonprotocol/react-kit";
import { Loading } from "@bosonprotocol/react-kit";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { CONFIG } from "../../lib/config";
import { useRenderTemplate } from "../../lib/utils/hooks/useRenderTemplate";
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

  const isLoading = renderStatus === "loading" || renderStatus === "idle";
  const isError = renderStatus === "error";

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
