import React from "react";
import ProductDetails from "../ProductDetails/ProductDetails";

const FadedSkinnyJeans = () => {
  const productData = {
    id: 9,
    name: "Faded Skinny Jeans",
    price: 120,
    image: "/assets/faded-skinny-jeans.svg",
    rating: 4.5
  };

  return <ProductDetails productData={productData} />;
};

export default FadedSkinnyJeans;
