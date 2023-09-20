import { subgraph } from "@bosonprotocol/react-kit";
import SimpleError from "components/error/SimpleError";
import Loading from "components/ui/Loading";
import { CONFIG } from "lib/config";
import { ProgressStatus } from "lib/types/progressStatus";
import { useRenderTemplate } from "lib/utils/hooks/useRenderTemplate";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface Props {
  offerData: subgraph.OfferFieldsFragment;
}

export function BuyerSellerAgreementModal({ offerData }: Props) {
  const templateUrl = CONFIG.buyerSellerAgreementTemplate as string;
  const { renderStatus, renderResult } = useRenderTemplate(
    undefined,
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
