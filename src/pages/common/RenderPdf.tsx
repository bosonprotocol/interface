/* eslint @typescript-eslint/no-var-requires: off */
import { Button } from "@bosonprotocol/react-kit";
import { useCallback, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import styled from "styled-components";

import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { colors } from "../../lib/styles/colors";

const Wrapper = styled.div`
  padding: 2rem 0;
`;
const PDFDocumentWrapper = styled.div`
  canvas {
    width: 100% !important;
    height: auto !important;
    + div {
      display: none;
      + div {
        display: none;
      }
    }
  }
`;

const FIRST_PAGE = 1;

interface Props {
  filePath: string;
  title: string;
  scrollable?: boolean;
}
export default function RenderPdf({
  filePath,
  title,
  scrollable = true
}: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(FIRST_PAGE);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handlePrev = useCallback(() => {
    setPageNumber(pageNumber - 1);
  }, [pageNumber, setPageNumber]);

  const handleNext = useCallback(() => {
    setPageNumber(pageNumber + 1);
  }, [pageNumber, setPageNumber]);

  return (
    <Wrapper>
      <Typography tag="h2" color={colors.secondary}>
        {title || ""}
      </Typography>
      <PDFDocumentWrapper>
        <Document file={filePath} onLoadSuccess={onDocumentLoadSuccess}>
          {scrollable ? (
            Array.from(Array(numPages).keys()).map((n) => (
              <Page pageNumber={n + 1} width={2000} key={`page_${n}`} />
            ))
          ) : (
            <Page pageNumber={pageNumber} width={2000} />
          )}
        </Document>
      </PDFDocumentWrapper>
      {numPages > 0 && !scrollable && (
        <Grid>
          <Button
            onClick={handlePrev}
            variant="primaryFill"
            disabled={pageNumber === 1}
          >
            Previous Page
          </Button>
          <Typography tag="p">
            Page&nbsp;&nbsp;<b>{pageNumber}</b>&nbsp;&nbsp;of&nbsp;&nbsp;
            {numPages}
          </Typography>
          <Button
            onClick={handleNext}
            variant="primaryFill"
            disabled={pageNumber >= numPages}
          >
            Next Page
          </Button>
        </Grid>
      )}
    </Wrapper>
  );
}
