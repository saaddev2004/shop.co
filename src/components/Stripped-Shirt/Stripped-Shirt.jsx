import React from "react";
import ProductDetails from "../ProductDetails/ProductDetails";

const StrippedShirt = () => {
  const productData = {
    id: 11,
    name: "Vertical Stripped Shirt",
    price: 120,
    image: "/assets/Vertical-Stripped-Shirt.svg",
    rating: 4.5
  };

  return <ProductDetails productData={productData} />;
};

export default StrippedShirt;
