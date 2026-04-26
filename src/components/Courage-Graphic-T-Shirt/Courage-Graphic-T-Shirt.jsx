import React from "react";
import ProductDetails from "../ProductDetails/ProductDetails";

const CourageGraphicTShirt = () => {
  const productData = {
    id: 6,
    name: "Courage Graphic T-Shirt",
    price: 120,
    image: "/assets/courage-graphic-tshirt.svg",
    rating: 4.5
  };

  return <ProductDetails productData={productData} />;
};

export default CourageGraphicTShirt;
