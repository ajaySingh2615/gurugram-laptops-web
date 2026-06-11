"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, ArrowRight, Star } from "lucide-react";

const flashProducts = [
  {
    id: "flash-1",
    title: "HP Pavilion 15",
    image: "/images/banners/banner-1.jpg",
    originalPrice: 58000,
    salePrice: 32999,
    discount: 43,
    rating: 4.5,
    specs: "i5 12th Gen / 8GB / 512GB SSD",
  },
  {
    id: "flash-2",
    title: "Dell Inspiron 14",
    image: "/images/banners/banner-2.jpg",
    originalPrice: 52000,
    salePrice: 28999,
    discount: 44,
    rating: 4.3,
    specs: "i5 11th Gen / 8GB / 256GB SSD",
  },
  {
    id: "flash-3",
    title: "Lenovo IdeaPad 3",
    image: "/images/banners/banner-3.jpg",
    originalPrice: 45000,
    salePrice: 24999,
    discount: 44,
    rating: 4.4,
    specs: "Ryzen 5 / 8GB / 512GB SSD",
  },
  {
    id: "flash-4",
    title: "ASUS VivoBook 15",
    image: "/images/banners/banner-4.jpg",
    originalPrice: 48000,
    salePrice: 26999,
    discount: 44,
    rating: 4.2,
    specs: "i5 11th Gen / 8GB / 512GB SSD",
  },
  {
    id: "flash-5",
    title: "Acer Aspire 5",
    image: "/images/banners/banner-1.jpg",
    originalPrice: 42000,
    salePrice: 22999,
    discount: 45,
    rating: 4.1,
    specs: "i3 12th Gen / 8GB / 256GB SSD",
  },
];

function useCountdown(endTime: Date) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = endTime.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return timeLeft;
}

const formatInr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function FlashSale() {
  // End time: 12 hours from now (resets on page load)
  const [endTime] = useState(() => new Date(Date.now() + 12 * 60 * 60 * 1000));
  const { hours, minutes, seconds } = useCountdown(endTime);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="py-12 md:py-16" id="flash-sale">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Live</span>
            </div>
            <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Flash Sale</h2>
          <p className="text-gray-500 mt-1">Grab these deals before time runs out.</p>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium mr-1">Ends in</span>
          {[
            { label: "Hrs", value: pad(hours) },
            { label: "Min", value: pad(minutes) },
            { label: "Sec", value: pad(seconds) },
          ].map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="text-lg md:text-xl font-mono font-extrabold text-white bg-gray-900 rounded-lg px-3 py-1.5 min-w-[48px] text-center shadow-lg">
                  {unit.value}
                </span>
                <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{unit.label}</span>
              </div>
              {i < 2 && <span className="text-xl font-bold text-gray-300 -mt-4">:</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Cards */}
      <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
        {flashProducts.map((product) => (
          <Link
            href="/shop"
            key={product.id}
            className="group flex-shrink-0 w-[260px] md:w-[280px] snap-start"
          >
            <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Discount Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg">
                  <Zap className="h-3 w-3 fill-white" />
                  {product.discount}% OFF
                </span>
              </div>

              {/* Image */}
              <div className="relative h-[160px] bg-gray-50 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="280px"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{product.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{product.specs}</p>

                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-gray-600">{product.rating}</span>
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-lg font-extrabold text-gray-900">{formatInr(product.salePrice)}</span>
                  <span className="text-sm text-gray-400 line-through">{formatInr(product.originalPrice)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All */}
      <div className="flex justify-center mt-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors group"
        >
          View all deals
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
