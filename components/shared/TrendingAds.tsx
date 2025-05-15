//import { getTrendingProducts } from "@/lib/actions/ad.product";
//import { IProduct } from "@/lib/database/models/product.model";
import { getTrendingProducts } from "@/lib/actions/dynamicAd.actions";
import React, { useState, useEffect } from "react";

const TrendingAds = () => {
  const [timeFrame, setTimeFrame] = useState<string>("week");
  const [products, setProducts] = useState<any>([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const trending = await getTrendingProducts(timeFrame);
        setProducts(trending);
      } catch {}
    };

    fetchdata();
  }, [timeFrame]);

  return (
    <div className="p-4 m-w-[400px] rounded-xl dark:bg-[#2D3236] dark:text-gray-300 bg-gray-100">
      <h2 className="text-lg  dark:text-gray-300 text-black font-bold mb-4">
        Trending Ads
      </h2>

      {/* Timeframe Selector */}
      <div className="mb-4">
        <label className="mr-2  dark:text-gray-400 text-gray-800 text-xs">
          Select Time Frame:
        </label>
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          className="p-2 dark:bg-[#131B1E] dark:text-gray-300 text-gray-800 border text-xs rounded"
        >
          <option value="day">Last 24 Hours</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {products.map((product: any, index: number) => (
          <div
            key={index}
            className="border dark:bg-[#131B1E] dark:text-gray-300 text-gray-700 bg-white p-4 rounded-md shadow-sm"
          >
            <div className="flex">
              <img
                src={product.data.imageUrls[0]}
                alt={product.data.title}
                className="w-16 h-16 object-cover rounded-xl mr-2"
              />
              <div className="flex gap-2">
                <div className="text-xs">
                  <h3 className="font-bold text-sm">{product.data.title}</h3>
                  <h3 className="text-sm dark:text-gray-500 ">
                    {product.data.category}
                  </h3>

                  <h3 className="text-xs dark:text-gray-500 ">
                    {product.data.subcategory}
                  </h3>
                
                     <span className="font-bold">
              {product.data.budget ? (<> Budget : Ksh {product.data.budget.toLocaleString()}</>):(<>Price: KES {product.data.price.toLocaleString()}</>)}   
                </span>
                  <p>Total Views: {product.views}</p>
                </div>
                <div className="text-xs">
                  <p>WhatsApp: {product.whatsapp}</p>
                  <p>Liked: {product.bookmarked}</p>
                  <p>Shared: {product.shared}</p>
                  <p>Calls: {product.calls}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingAds;
