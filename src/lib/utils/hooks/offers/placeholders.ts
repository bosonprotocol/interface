import { MOCK } from "../../../../pages/offers/mock/mock";

const keys = ["boson t-shirt", "boson neon sign", "boson sweatshirt"] as const;

const offerNameToOfferImage: Record<typeof keys[number], string> = {
  "boson t-shirt":
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-t-shirt-FINAL.gif",
  "boson neon sign":
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-sign-FINAL.gif",
  "boson sweatshirt":
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-sweatshirt-FINAL.gif"
} as const;

export const getOfferImage = (
  offerId: string,
  offerName: string | null | undefined
): string => {
  const lowerCaseOfferName = offerName?.toLocaleLowerCase();
  const url =
    offerNameToOfferImage[
      lowerCaseOfferName as keyof typeof offerNameToOfferImage
    ];
  if (url) {
    return url;
  }
  return `https://picsum.photos/seed/${offerId}/700`;
};

type ShippingInformation = Readonly<{
  shipping: string;
  shippingTable: Readonly<
    {
      name: "EU" | "US" | "UK" | "Asia" | "South America";
      value: string;
    }[]
  >;
}>;

const offerNameToShippingInformation: Record<
  typeof keys[number],
  ShippingInformation
> = {
  "boson t-shirt": {
    shipping:
      "Once redeemed, this item can be collected at the Boson Protocol stall on Floor 3 of the Mithril Market Area at EthCC.",
    shippingTable: [
      {
        name: "EU",
        value: "N/A"
      },
      {
        name: "US",
        value: "N/A"
      },
      {
        name: "UK",
        value: "N/A"
      },
      {
        name: "Asia",
        value: "N/A"
      },
      {
        name: "South America",
        value: "N/A"
      }
    ]
  },
  "boson neon sign": {
    shipping:
      "Once redeemed, this item can be collected at the Boson Protocol stall on Floor 3 of the Mithril Market Area at EthCC.",
    shippingTable: [
      {
        name: "EU",
        value: "N/A"
      },
      {
        name: "US",
        value: "N/A"
      },
      {
        name: "UK",
        value: "N/A"
      },
      {
        name: "Asia",
        value: "N/A"
      },
      {
        name: "South America",
        value: "N/A"
      }
    ]
  },
  "boson sweatshirt": {
    shipping:
      "Once redeemed, this item can be collected at the Boson Protocol stall on Floor 3 of the Mithril Market Area at EthCC.",
    shippingTable: [
      {
        name: "EU",
        value: "N/A"
      },
      {
        name: "US",
        value: "N/A"
      },
      {
        name: "UK",
        value: "N/A"
      },
      {
        name: "Asia",
        value: "N/A"
      },
      {
        name: "South America",
        value: "N/A"
      }
    ]
  }
} as const;

export const getOfferShippingInformation = (
  offerName: string
): ShippingInformation => {
  const lowerCaseOfferName = offerName.toLocaleLowerCase();
  const shippingInfo =
    offerNameToShippingInformation[
      lowerCaseOfferName as keyof typeof offerNameToShippingInformation
    ];
  if (shippingInfo) {
    return shippingInfo;
  }
  return {
    shipping: MOCK.shipping,
    shippingTable: MOCK.shippingTable
  };
};

const offerNameToOfferArtist: Record<typeof keys[number], string> = {
  "boson t-shirt": "Boson Protocol",
  "boson neon sign": "Boson Protocol",
  "boson sweatshirt": "Boson Protocol"
} as const;

export const getOfferArtist = (offerName: string) => {
  const lowerCaseOfferName = offerName.toLocaleLowerCase();
  const artist =
    offerNameToOfferArtist[
      lowerCaseOfferName as keyof typeof offerNameToOfferImage
    ] || "";
  return artist;
};

const offerNameToOfferDescription: Record<typeof keys[number], string> = {
  "boson t-shirt":
    "The first exclusive physical drop on Boson Protocol v2-alpha for our Ethereum friends. The exclusive Boson-Tee mesmerises with its neon green colours and black sidebars, rounding off the beautiful design with its impressive quality. We think it’s only right that the crazy-ones at EthCC are the first to receive it.",
  "boson neon sign":
    "Decorate your room with the amazing Boson neon sign, which not only adds color to your room but brings positive energy in you as well. It will remind you that the future of commerce is decentralized, built on smart contracts, and enables users to share in the value they create.",
  "boson sweatshirt":
    "DeFi summer is an old memory, JPEGs are down bad, CeFi is insolvent. The Boson sweatshirt gives you the warmth and protection you need for the crypto winter. We hope it will give our Ethereum friends the warmth and comfort to continue building amazing applications that bring us into the next crypto summer."
} as const;

export const getOfferDescription = (offerName: string) => {
  const lowerCaseOfferName = offerName.toLocaleLowerCase();
  const artist =
    offerNameToOfferDescription[
      lowerCaseOfferName as keyof typeof offerNameToOfferDescription
    ] || "";
  return artist;
};

type ProductData = Readonly<{ name: string; value: string }[]>;
const offerNameToProductData: Record<typeof keys[number], ProductData> = {
  "boson t-shirt": [{ name: "Material", value: "100% Cotton" }],
  "boson neon sign": [
    { name: "Materials", value: "Plexiglass, Silicone, LED, Plywood" },
    { name: "Dimensions", value: "30 cm width x 20 cm height" }
  ],
  "boson sweatshirt": [
    { name: "Materials", value: "85% Cotton; 15% Polyester" }
  ]
} as const;

export const getOfferProductData = (offerName: string): ProductData => {
  const lowerCaseOfferName = offerName.toLocaleLowerCase();
  const productData =
    offerNameToProductData[
      lowerCaseOfferName as keyof typeof offerNameToProductData
    ];
  return productData;
};

const bosonDescription =
  "Boson Protocol is Web3’s commerce Layer, enabling the decentralized commercial exchange of any physical thing as a redeemable, tradeable NFT. No need to trust centralized intermediaries or sellers. Instead Boson is an efficient, optimistic, fair-exchange protocol built using smart contracts encoded with game theory, with escalation to independent dispute resolvers. Simply purchase the redeemable NFT and get the physical item, or your money back.";
const offerNameToArtistDescription: Record<typeof keys[number], string> = {
  "boson t-shirt": bosonDescription,
  "boson neon sign": bosonDescription,
  "boson sweatshirt": bosonDescription
} as const;

export const getOfferArtistDescription = (offerName: string): string => {
  const lowerCaseOfferName = offerName.toLocaleLowerCase();
  const artistDescription =
    offerNameToArtistDescription[
      lowerCaseOfferName as keyof typeof offerNameToArtistDescription
    ];
  return artistDescription;
};

const offerNameToImageList: Record<typeof keys[number], Readonly<string[]>> = {
  "boson t-shirt": [
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-tshirt-front.png",
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-tshirt-right.png",
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-tshirt-back.png",
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-tshirt-left.png"
  ] as const,
  "boson neon sign": [
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-sign-front.png",
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-sign-right.png",
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-sign-left.png",
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-sign-side.png"
  ] as const,
  "boson sweatshirt": [
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-sweatshirt-front.png",
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-sweatshirt-right.png",
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-sweatshirt-back.png",
    "https://bsn-portal-development-image-upload-storage.s3.amazonaws.com/boson-sweatshirt-left.png"
  ] as const
} as const;

export const getOfferImageList = (offerName: string): Readonly<string[]> => {
  const lowerCaseOfferName = offerName.toLocaleLowerCase();
  const imageList =
    offerNameToImageList[
      lowerCaseOfferName as keyof typeof offerNameToImageList
    ];
  return imageList;
};
