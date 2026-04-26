import React from "react";
import ProductDetails from "../ProductDetails/ProductDetails";

const SleeveStrippedTShirt = () => {
  const productData = {
    id: 4,
    name: "Sleeve Striped T-shirt",
    price: 350,
    image: "/assets/Stripped-t-shirt.svg",
    rating: 4.5
  };

  return <ProductDetails productData={productData} />;
};

export default SleeveStrippedTShirt;
