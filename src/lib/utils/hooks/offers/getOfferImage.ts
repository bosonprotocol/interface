export default (offerId: string, offerName: string | null | undefined) => {
  if (offerName?.toLocaleLowerCase().includes("boson t-shirt")) {
    return "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson+shirt+gif.gif";
  }
  if (offerName?.toLocaleLowerCase().includes("boson neon sign")) {
    return "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson+shirt.16.gif";
  }
  return `https://picsum.photos/seed/${offerId}/700`;
};
