import Buyer from "./buyer/Buyer";
import Seller from "./seller/Seller";

interface Props {
  profileType: "seller" | "buyer";
}
function ProfilePage({ profileType }: Props) {
  switch (profileType) {
    case "seller":
      return <Seller />;
    case "buyer":
      return <Buyer />;

    default:
      return null;
  }
}

export default ProfilePage;
