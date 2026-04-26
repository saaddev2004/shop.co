import React from "react";
import ProductDetails from "../ProductDetails/ProductDetails";

const SkinnyFitJeans = () => {
  const productData = {
    id: 1,
    name: "Skinny Fit Jeans",
    price: 120,
    image: "/assets/Skinny-fit-jeans.svg",
    rating: 4.5
  };

  return <ProductDetails productData={productData} />;
};

export default SkinnyFitJeans;
