import React from "react";
import ProductDetails from "../ProductDetails/ProductDetails";

const PoloTShirt = () => {
  const productData = {
    id: 5,
    name: "Polo with Contrast Trims",
    price: 120,
    image: "/assets/polo-t-shirt.svg",
    rating: 4.5
  };

  return <ProductDetails productData={productData} />;
};

export default PoloTShirt;
