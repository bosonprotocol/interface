import { Loading } from "@bosonprotocol/react-kit";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { CONFIG } from "../../lib/config";
import { useRenderTemplate } from "../../lib/utils/hooks/useRenderTemplate";
import SimpleError from "../error/SimpleError";

interface Props {
  offerId: string;
}

export default function ContractualAgreement({ offerId }: Props) {
  const templateUrl = CONFIG.buyerSellerAgreementTemplate as string; // TODO: get the template from the offer metadata
  const { renderStatus, renderResult } = useRenderTemplate(
    offerId,
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
