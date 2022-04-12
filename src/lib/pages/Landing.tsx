import CardList from "lib/components/offer-list/OfferList";
import { CenteredRow, Row } from "lib/styles/layout";

export default function Landing() {
  return (
    <>
      <img src="https://assets.website-files.com/6058b6a3587b6e155196ebbb/6058b6a3587b6e13c296ec58_logo.png" />
      <Row>
        <div>
          <h1>Boson dapp</h1>
          <div>
            <div>
              <input placeholder="Search by Brand" />
              <button>Go</button>
            </div>
            <CenteredRow>
              <button>or Explore</button>
            </CenteredRow>
          </div>
        </div>
        <CenteredRow>
          <img src="https://picsum.photos/600" />
        </CenteredRow>
      </Row>
      <CardList />
    </>
  );
}
