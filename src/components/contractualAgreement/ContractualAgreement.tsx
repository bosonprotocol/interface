import { subgraph } from "@bosonprotocol/react-kit";
import { Loading } from "@bosonprotocol/react-kit";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { CONFIG } from "../../lib/config";
import { ProgressStatus } from "../../lib/types/progressStatus";
import { useRenderTemplate } from "../../lib/utils/hooks/useRenderTemplate";
import SimpleError from "../error/SimpleError";

interface Props {
  offerId: string | undefined;
  offerData: subgraph.OfferFieldsFragment | undefined;
}

export default function ContractualAgreement({ offerId, offerData }: Props) {
  // TODO: get the template from the offer metadata (BP390 - https://app.asana.com/0/1200803815983047/1203080300620356)
  const templateUrl = CONFIG.buyerSellerAgreementTemplate as string;
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
