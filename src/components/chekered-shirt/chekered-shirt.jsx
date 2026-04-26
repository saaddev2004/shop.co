import React from "react";
import ProductDetails from "../ProductDetails/ProductDetails";

const CheckeredShirt = () => {
  const productData = {
    id: 3,
    name: "Checkered Shirt",
    price: 120,
    image: "/assets/chekered-shirts.svg",
    rating: 4.5
  };

  return <ProductDetails productData={productData} />;
};

export default CheckeredShirt;
