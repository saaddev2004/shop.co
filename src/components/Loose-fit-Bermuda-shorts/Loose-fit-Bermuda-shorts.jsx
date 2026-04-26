import React from "react";
import ProductDetails from "../ProductDetails/ProductDetails";

const LooseFitBermudaShorts = () => {
  const productData = {
    id: 7,
    name: "Loose Fit Bermuda Shorts",
    price: 350,
    image: "/assets/loose-fit-shorts.svg",
    rating: 4.5
  };

  return <ProductDetails productData={productData} />;
};

export default LooseFitBermudaShorts;
