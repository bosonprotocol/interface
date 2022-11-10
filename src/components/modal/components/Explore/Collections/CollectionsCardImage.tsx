import { Image } from "@bosonprotocol/react-kit";
import { CameraSlash } from "phosphor-react";

import { colors } from "../../../../../lib/styles/colors";
import { getImageUrl } from "../../../../../lib/utils/images";

function CollectionsCardImage({ imageSource }: any) {
  const imageUrl = getImageUrl(imageSource, { height: 500 });

  const imageProps = {
    src: imageUrl,
    preloadConfig: {
      errorIcon: <CameraSlash size={32} color={colors.white} />
    }
  };
  return <Image {...imageProps} />;
}

export default CollectionsCardImage;
