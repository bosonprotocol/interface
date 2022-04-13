export interface Offer {
  id: string;
  price: string;
  seller: Seller;
  exchangeToken: ExchangeToken;
  metadata: Metadata;
}

export interface ExchangeToken {
  symbol: string;
}

export interface Metadata {
  title: string;
  description: string;
  additionalProperties: null;
}

export interface Seller {
  id: string;
  address: string;
}
