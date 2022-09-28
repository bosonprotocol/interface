import { Loading } from "@bosonprotocol/react-kit";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { useRenderTemplate } from "../../lib/utils/hooks/useRenderTemplate";
import SimpleError from "../error/SimpleError";

interface Props {
  offerId: string;
}

export default function License({ offerId }: Props) {
  const { renderStatus, renderResult } = useRenderTemplate(offerId);

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
