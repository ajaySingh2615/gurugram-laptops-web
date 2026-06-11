"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

const formatInr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

type BudgetTab = "under20k" | "under25k" | "under35k";

const budgetTabs: { key: BudgetTab; label: string; maxPrice: number }[] = [
  { key: "under20k", label: "Under ₹20,000", maxPrice: 20000 },
  { key: "under25k", label: "Under ₹25,000", maxPrice: 25000 },
  { key: "under35k", label: "Under ₹35,000", maxPrice: 35000 },
];

const budgetProducts: Record<BudgetTab, Array<{
  id: string;
  title: string;
  brand: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  rating: number;
  specs: string;
}>> = {
  under20k: [
    { id: "b1", title: "Acer Aspire 3", brand: "Acer", image: "/images/banners/banner-1.jpg", originalPrice: 32000, salePrice: 17999, rating: 4.0, specs: "i3 10th Gen / 4GB / 256GB" },
    { id: "b2", title: "Lenovo V14", brand: "Lenovo", image: "/images/banners/banner-2.jpg", originalPrice: 30000, salePrice: 15999, rating: 3.9, specs: "i3 10th Gen / 4GB / 256GB" },
    { id: "b3", title: "HP 245 G7", brand: "HP", image: "/images/banners/banner-3.jpg", originalPrice: 28000, salePrice: 14999, rating: 4.1, specs: "Ryzen 3 / 4GB / 256GB" },
    { id: "b4", title: "Dell Vostro 14", brand: "Dell", image: "/images/banners/banner-4.jpg", originalPrice: 35000, salePrice: 18999, rating: 4.2, specs: "i3 11th Gen / 4GB / 256GB" },
  ],
  under25k: [
    { id: "b5", title: "HP Pavilion x360", brand: "HP", image: "/images/banners/banner-2.jpg", originalPrice: 45000, salePrice: 23999, rating: 4.3, specs: "i5 11th Gen / 8GB / 256GB" },
    { id: "b6", title: "Lenovo IdeaPad Slim 3", brand: "Lenovo", image: "/images/banners/banner-3.jpg", originalPrice: 40000, salePrice: 21999, rating: 4.4, specs: "Ryzen 5 / 8GB / 512GB" },
    { id: "b7", title: "ASUS VivoBook 14", brand: "ASUS", image: "/images/banners/banner-4.jpg", originalPrice: 42000, salePrice: 22999, rating: 4.2, specs: "i5 10th Gen / 8GB / 256GB" },
    { id: "b8", title: "Acer Swift 3", brand: "Acer", image: "/images/banners/banner-1.jpg", originalPrice: 48000, salePrice: 24999, rating: 4.5, specs: "Ryzen 5 / 8GB / 512GB" },
  ],
  under35k: [
    { id: "b9", title: "Dell Latitude 5420", brand: "Dell", image: "/images/banners/banner-4.jpg", originalPrice: 65000, salePrice: 32999, rating: 4.6, specs: "i5 12th Gen / 16GB / 512GB" },
    { id: "b10", title: "HP EliteBook 840", brand: "HP", image: "/images/banners/banner-1.jpg", originalPrice: 70000, salePrice: 34999, rating: 4.7, specs: "i7 11th Gen / 16GB / 512GB" },
    { id: "b11", title: "Lenovo ThinkPad L14", brand: "Lenovo", image: "/images/banners/banner-2.jpg", originalPrice: 60000, salePrice: 29999, rating: 4.5, specs: "i5 11th Gen / 8GB / 512GB" },
    { id: "b12", title: "ASUS ZenBook 14", brand: "ASUS", image: "/images/banners/banner-3.jpg", originalPrice: 58000, salePrice: 33999, rating: 4.4, specs: "Ryzen 7 / 16GB / 512GB" },
  ],
};

export function BudgetCategories() {
  const [activeTab, setActiveTab] = useState<BudgetTab>("under20k");
  const products = budgetProducts[activeTab];

  return (
    <section className="py-12 md:py-16" id="budget-categories">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Laptops by Budget
        </h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Find the perfect laptop that fits your pocket. Quality guaranteed.
        </p>
      </div>

      {/* Tab Pills */}
      <div className="flex justify-center gap-2 md:gap-3 mb-10">
        {budgetTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href="/shop"
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative h-[140px] md:h-[170px] bg-gray-50 overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Save Badge */}
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-md">
                  Save {formatInr(product.originalPrice - product.salePrice)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 md:p-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{product.brand}</p>
              <h3 className="font-bold text-gray-900 text-sm mt-0.5 line-clamp-1">{product.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{product.specs}</p>

              <div className="flex items-center gap-1 mt-2">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-gray-500">{product.rating}</span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-base md:text-lg font-extrabold text-gray-900">{formatInr(product.salePrice)}</span>
                <span className="text-xs text-gray-400 line-through">{formatInr(product.originalPrice)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All */}
      <div className="flex justify-center mt-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 hover:shadow-lg transition-all duration-300 group"
        >
          Browse All Laptops
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
