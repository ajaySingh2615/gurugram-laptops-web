"use client";

import {
  Truck,
  ShieldCheck,
  BadgePercent,
  Headset,
  Award,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Free shipping on orders above ₹15,000",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% protected transactions",
    color: "from-emerald-500 to-green-400",
  },
  {
    icon: BadgePercent,
    title: "Great Discounts",
    desc: "Up to 60% off on all laptops",
    color: "from-orange-500 to-amber-400",
  },
  {
    icon: Headset,
    title: "24/7 Help Center",
    desc: "Dedicated support, anytime",
    color: "from-purple-500 to-violet-400",
  },
  {
    icon: Award,
    title: "ISO Certified",
    desc: "Quality assured refurbishment",
    color: "from-rose-500 to-pink-400",
  },
];

export function TrustBar() {
  return (
    <section className="relative z-10 -mt-8 md:-mt-10" id="trust-bar">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border border-white/10 bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group flex flex-col items-center text-center gap-2 p-3 rounded-xl transition-all duration-300 hover:bg-gray-50"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
