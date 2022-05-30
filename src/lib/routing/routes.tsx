import App from "@components/app";
import Layout from "@components/Layout";
import React from "react";
import { RouteObject } from "react-router-dom";

import { UrlParameters } from "./query-parameters";

export const BosonRoutes = {
  Root: "/",
  Explore: "/explore",
  ExplorePage: "/explore/page",
  ExplorePageByIndex: `/explore/page/:${UrlParameters.page}`,
  CreateOffer: "/create-offer"
};

export const OffersRoutes = {
  Root: "/offers",
  OfferDetail: `/offers/:${UrlParameters.offerId}`
};

const CreateOffer = React.lazy(
  () => import("../../pages/create-offer/CreateOffer")
);
const Explore = React.lazy(() => import("../../pages/explore/Explore"));
const Landing = React.lazy(() => import("../../pages/landing/Landing"));
const OfferDetail = React.lazy(() => import("../../pages/offers/OfferDetail"));

const Loading = () => (
  <Layout>
    <p>Loading...</p>
  </Layout>
);
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: BosonRoutes.Root,
        element: (
          <React.Suspense fallback={<Loading />}>
            <Landing />
          </React.Suspense>
        )
      },
      ...[
        BosonRoutes.Explore,
        BosonRoutes.ExplorePage,
        BosonRoutes.ExplorePageByIndex
      ].map((route) => ({
        path: route,
        element: (
          <React.Suspense fallback={<Loading />}>
            <Explore />
          </React.Suspense>
        )
      })),
      {
        path: BosonRoutes.CreateOffer,
        element: (
          <React.Suspense fallback={<Loading />}>
            <CreateOffer />
          </React.Suspense>
        )
      },
      {
        path: OffersRoutes.Root,
        element: (
          <React.Suspense fallback={<Loading />}>
            <Explore />
          </React.Suspense>
        )
      },
      {
        path: OffersRoutes.OfferDetail,
        element: (
          <React.Suspense fallback={<Loading />}>
            <OfferDetail />
          </React.Suspense>
        )
      },
      {
        path: "*",
        element: (
          <main style={{ padding: "1rem" }}>
            <p>Page not found</p>
          </main>
        )
      }
    ]
  }
];
