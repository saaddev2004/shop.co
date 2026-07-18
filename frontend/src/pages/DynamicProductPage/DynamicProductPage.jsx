import React from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../../Context/ProductContext";
import ProductDetails from "../../components/ProductDetails/ProductDetails";
import SimilarProducts from "../../components/SimilarProducts/SimilarProducts";

const DynamicProductPage = () => {
  const { id } = useParams();
  const { products } = useProducts();
  
  const product = products.find((p) => p.id === parseInt(id) || p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500">The product you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div>
      <ProductDetails key={id} productData={product} />
      <SimilarProducts />
    </div>
  );
};

export default DynamicProductPage;

