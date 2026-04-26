import React from "react";
import ProductDetails from "../ProductDetails/ProductDetails";

const RelaxedFitShorts = () => {
  const productData = {
    id: 8,
    name: "Relaxed Fit Shorts",
    price: 120,
    image: "/assets/relaxed-fit-shorts.svg",
    rating: 4.5
  };

  return <ProductDetails productData={productData} />;
};

export default RelaxedFitShorts;
