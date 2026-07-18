import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../../Context/ProductContext";
import ProductDetails from "../../components/ProductDetails/ProductDetails";
import SimilarProducts from "../../components/SimilarProducts/SimilarProducts";

const DynamicProductPage = () => {
  const { id } = useParams();
  const { products } = useProducts();
  
  // Nayi State: Loading circle ke liye
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // FIX 1: Jab bhi 'id' change ho (naye product pe click ho), page automatically smoothly top pe chala jaye
    window.scrollTo({ top: 0, behavior: "smooth" });

    // FIX 2: Naye product pe click karne par ek chota sa loading spinner dikhaye (400ms ke liye)
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400); 

    // Cleanup function
    return () => clearTimeout(timer);
  }, [id]); // Array mein 'id' hai, iska matlab URL change hone pe yeh useEffect dobara chalega

  // Agar context abhi tak backend se data fetch kar raha hai, ya humara timer chal raha hai, tab tak Spinner dikhao
  if (products.length === 0 || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* Tailwind CSS ka gol ghoomne wala Loading Circle */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black dark:border-white border-b-transparent"></div>
      </div>
    );
  }

  // Find the product (MongoDB ke _id ko bhi support karega aur purani id ko bhi)
  const product = products.find((p) => p._id === id || p.id === parseInt(id) || p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Product Not Found</h1>
        <p className="text-gray-500">The product you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div>
      {/* key={id} boht zaroori hai taake ProductDetails component naye data ke sath dobara load ho */}
      <ProductDetails key={id} productData={product} />
      <SimilarProducts />
    </div>
  );
};

export default DynamicProductPage;
