import React from "react";
import ProductDetails from "../ProductDetails/ProductDetails";

const BlackStrippedShirt = () => {
  const productData = {
    id: 2,
    name: "Black Stripped Shirt",
    price: 120,
    image: "/assets/black-stripped-t-shirt.svg",
    rating: 4.5
  };

  return <ProductDetails productData={productData} />;
};

export default BlackStrippedShirt;
