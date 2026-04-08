"use client";

import { HiOutlineArrowRight } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { ProductCategory } from "@/lib/actions";

const defaultCategories: { title: string; desc: string; shortDesc?: string }[] = [
  {
    title: "Wood Products",
    desc: "High-quality wood materials are used for flooring, accent walls, cabinetry, and architectural design.",
  },
  {
    title: "Wall Panels",
    desc: "Decorative and functional wall panels that transform interior spaces with texture and depth.",
  },
  {
    title: "Tiles",
    desc: "Modern and classic tile options for kitchens, bathrooms, floors, and feature walls.",
  },
  {
    title: "Vinyl Flooring",
    desc: "Durable, water-resistant flooring that offers style and practicality for modern homes.",
  },
  {
    title: "Granite",
    desc: "Premium natural stone surfaces ideal for countertops and luxury interiors.",
  },
  {
    title: "Cabinets",
    desc: "Kitchen and bathroom cabinetry designed for both functionality and aesthetics.",
  },
  {
    title: "Shower Doors",
    desc: "Custom shower doors that enhance the beauty and functionality of bathrooms.",
  },
  {
    title: "Bathroom Vanities",
    desc: "Stylish and functional vanities that elevate bathroom design and storage.",
  },
  {
    title: "Doors",
    desc: "Interior and exterior doors that combine durability with elegant design.", 
  }

];

type CategoriesProps = {
  categories: ProductCategory[];
};

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const getPlainText = (value: string) =>
  decodeHtmlEntities(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const summarize = (text: string, length = 135) =>
  text.length > length ? `${text.slice(0, length).trim()}…` : text;

export default function Categories({ categories }: CategoriesProps) {
  const router = useRouter();
  const displayedCategories = categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="bg-[#f5f2ed] py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-800">
          Product Categories Overview
        </h2>

        <div className="w-16 h-[2px] bg-[#c9a46c] mx-auto my-6"></div>

        <p className="text-gray-600 max-w-2xl mx-auto mb-16 leading-relaxed">
          At Southern Design Warehouse, you can explore a wide selection of
          remodeling materials used by contractors and designers across
          residential and commercial projects.
        </p>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
          {displayedCategories.map((cat, i) => (
            <div
              key={cat.title || i}
              className="bg-white p-8 shadow-sm hover:shadow-lg transition duration-300 border-l-4 border-[#c9a46c]"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {cat.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {cat.shortDesc ? summarize(getPlainText(cat.shortDesc), 120) : summarize(getPlainText(cat.desc), 120)}
              </p>

              <button
                type="button"
                onClick={() => router.push(`/products?category=${encodeURIComponent(cat.title)}`)}
                className="flex items-center text-sm font-medium text-gray-800 group"
              >
                <span>Explore</span>
                <HiOutlineArrowRight className="ml-2 group-hover:translate-x-1 transition" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}