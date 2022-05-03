import { UrlParameters } from "lib/routing/query-parameters";
import { useOffer } from "lib/utils/hooks/useOffers";
import { useParams } from "react-router-dom";

export default () => {
  const { [UrlParameters.offerId]: offerId } = useParams();
  if (!offerId) {
    return <p>Offer id not defined</p>;
  }
  const {
    data: offer,
    isError,
    isLoading
  } = useOffer({
    offerId
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div data-testid="errorOffer">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!offer) {
    return <div data-testid="notFound">This offer does not exist</div>;
  }
  return (
    <>
      <p>Offer detail page id:{offerId}</p>
      <pre>{JSON.stringify(offer)}</pre>
    </>
  );
};
