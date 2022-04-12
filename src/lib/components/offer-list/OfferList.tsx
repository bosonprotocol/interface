import Offer from "../offer/Offer";

// TODO: get this data from somewhere else
const offersDataList = Array(50)
  .fill(0)
  .map((_v, idx) => ({
    id: `${idx}`,
    offerImg: "https://picsum.photos/100",
    title: `title ${idx}`,
    sellerImg: "https://picsum.photos/20",
    sellerName: `seller name ${idx}`,
    priceInEth: `${Math.random() * 10}`
  }));

export default function OfferList() {
  return (
    <div>
      {offersDataList.map((offerData) => (
        <Offer
          key={offerData.id}
          id={offerData.id}
          offerImg={offerData.offerImg}
          title={offerData.title}
          sellerImg={offerData.sellerImg}
          sellerName={offerData.sellerName}
          priceInEth={offerData.priceInEth}
        />
      ))}
    </div>
  );
}
