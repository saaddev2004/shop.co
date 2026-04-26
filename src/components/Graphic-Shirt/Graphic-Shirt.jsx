import React from "react";
import ProductDetails from "../ProductDetails/ProductDetails";

const GraphicShirt = () => {
  const productData = {
    id: 10,
    name: "One Life Graphic T-Shirt",
    price: 120,
    image: "/assets/graphic-t-shirt.svg",
    rating: 4.5
  };

  return <ProductDetails productData={productData} />;
};

export default GraphicShirt;
