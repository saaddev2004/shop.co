import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ item }) => {
  return (
    <div className="group h-full flex flex-col">
      <Link to={item.link} className="aspect-[3/4] rounded-[15px] overflow-hidden bg-[#F0EEED] dark:bg-neutral-800 flex items-center justify-center mb-3 transition-all group-hover:shadow-md relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {item.discount && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm z-10 uppercase tracking-tighter">
                {item.discount}
            </div>
        )}
      </Link>
      
      <div className="flex flex-col">
        <div className="flex justify-between items-start gap-2">
            <h3 className="text-[13px] md:text-[14px] font-medium leading-tight dark:text-white line-clamp-2 flex-1">
                {item.name}
            </h3>
            <span className="text-[13px] md:text-[14px] font-semibold dark:text-white whitespace-nowrap">
                Rs.{item.price.toLocaleString()}
            </span>
        </div>
        
        {item.oldPrice && (
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-medium text-black/30 dark:text-white/30 line-through">
                    Rs.{item.oldPrice.toLocaleString()}
                </span>
            </div>
        )}

        <div className="flex gap-1 mt-2">
            {item.colors?.slice(0, 3).map((color, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full border border-black/5" style={{ backgroundColor: color }} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
