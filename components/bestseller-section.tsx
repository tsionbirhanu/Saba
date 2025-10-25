

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Card } from "@/components/ui/card";
// import { Instagram, Youtube, Send, Music } from "lucide-react";
// // import { Icon } from "lucide-react";

// const bestsellerProducts = [
//   {
//     id: "1",
//     name: "Amina Kedir",
//     artisan: "Artisan Weaver",
//     price: 6.48,
//     originalPrice: 16.48,
//     image: "/images/dress.jpg",
//   },
//   {
//     id: "2",
//     name: "Hana Badege",
//     artisan: "Artisan Weaver",
//     price: 6.48,
//     originalPrice: 16.48,
//     image: "/images/tr2.jpg",
//   },
//   {
//     id: "3",
//     name: "Sitra Tcha",
//     artisan: "Artisan Weaver",
//     price: 6.48,
//     originalPrice: 16.48,
//     image: "/images/traditional.jpg",
//   },
//   {
//     id: "4",
//     name: "Amina Kedir",
//     artisan: "Artisan Weaver",
//     price: 6.48,
//     originalPrice: 16.48,
//     image: "/images/tr2.jpg",
//   },
//   {
//     id: "5",
//     name: "Hana Badege",
//     artisan: "Artisan Weaver",
//     price: 6.48,
//     originalPrice: 16.48,
//     image: "/images/traditional.jpg",
//   },
//   {
//     id: "6",
//     name: "Sitra Tcha",
//     artisan: "Artisan Weaver",
//     price: 6.48,
//     originalPrice: 16.48,
//     image: "/images/tr2.jpg",
//   },
// ];

// const bestsellerMenProducts = [
//   {
//     id: "1",
//     name: "Kedir Mohammed",
//     artisan: "Artisan Weaver",
//     price: 6.48,
//     originalPrice: 16.49,
//     image: "/images/men3.png",
//   },
//   {
//     id: "2",
//     name: "Hana Badege",
//     artisan: "Artisan Weaver",
//     price: 6.48,
//     originalPrice: 16.49,
//     image: "/images/men4.jpg",
//   },
//   {
//     id: "3",
//     name: "Sitta Tcha",
//     artisan: "Artisan Weaver",
//     price: 6.48,
//     originalPrice: 16.49,
//     image: "/images/men3.png",
//   },
//   {
//     id: "4",
//     name: "Amina Kedir",
//     artisan: "Artisan Weaver",
//     price: 6.48,
//     originalPrice: 16.49,
//     image: "/images/men4.jpg",
//   },
//   {
//     id: "5",
//     name: "Hana Badege",
//     artisan: "Artisan Weaver",
//     price: 6.48,
//     originalPrice: 16.49,
//     image: "/images/men3.png",
//   },
//   {
//     id: "6",
//     name: "Sitta Tcha",
//     artisan: "Artisan Weaver",
//     price: 6.48,
//     originalPrice: 16.49,
//     image: "/images/men4.jpg",
//   },
// ];

// export function BestsellerSection() {
//   const [selectedProduct, setSelectedProduct] = useState(bestsellerProducts[0]);
//   const [selectedMenProduct, setSelectedMenProduct] = useState(
//     bestsellerMenProducts[0]
//   );

//   return (
//     <>
//       {/* Bestseller Dresses Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Main Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
//             {/* Left Side - Tall Big Image with Text Overlay */}
//             <div className="lg:col-span-1 flex justify-center">
//               <Card className="overflow-hidden border-0 shadow-lg w-full max-w-xs relative">
//                 {/* Text overlay at the top of the big image */}
//                 <div className="absolute top-4 left-4 z-10 text-black">
//                   <div className="flex flex-col space-y-1">
//                     <span className="font-medium text-sm">For Women</span>
//                     <span className="text-sm">5 items</span>
//                   </div>
//                 </div>

//                 {/* Big tall image - full height display without cropping */}
//                 <div className="relative h-[600px] bg-gray-50 flex items-center justify-center">
//                   <div className="relative w-full h-full">
//                     <Image
//                       src={selectedProduct.image || "/placeholder.svg"}
//                       alt={selectedProduct.name}
//                       fill
//                       className="object-contain"
//                       priority
//                       sizes="(max-width: 768px) 100vw, 400px"
//                     />
//                   </div>
//                 </div>
//                 {/* No product info section for big image */}
//               </Card>
//             </div>

//             {/* Right Side - Content Area */}
//             <div className="lg:col-span-2 flex flex-col">
//               {/* BESTSELLER DRESSES Title with full width underline */}
//               <div className="text-center lg:text-left mb-8">
//                 <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
//                   <h1 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase">
//                     BESTSELLER DRESSES
//                   </h1>
//                   {/* Arrows at the end of text with margin left */}
//                   <div className="flex items-center gap-1 ml-4">
//                     <svg
//                       className="w-5 h-5 text-gray-700"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 19l-7-7 7-7"
//                       />
//                     </svg>
//                     <svg
//                       className="w-5 h-5 text-gray-700"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </div>
//                 </div>

//                 {/* Full width black underline */}
//                 <div className="w-full h-0.5 bg-black mt-2"></div>
//               </div>

//               {/* Small Products Grid - Full height equal to big image */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
//                 {bestsellerProducts.map((product) => (
//                   <Card
//                     key={product.id}
//                     className={`overflow-hidden border-0 cursor-pointer transition-all flex flex-col h-full ${
//                       selectedProduct.id === product.id
//                         ? "shadow-lg bg-gray-50"
//                         : "shadow-md hover:shadow-lg"
//                     }`}
//                     onClick={() => setSelectedProduct(product)}>
//                     {/* Product image - full height display without cropping */}
//                     <div className="relative flex-grow bg-gray-100 min-h-[180px] flex items-center justify-center">
//                       <div className="relative w-full h-full">
//                         <Image
//                           src={product.image || "/placeholder.svg"}
//                           alt={product.name}
//                           fill
//                           className="object-contain"
//                           sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
//                         />
//                       </div>
//                     </div>

//                     {/* Product info */}
//                     <div className="p-3 text-center flex-shrink-0">
//                       <h3 className="font-bold text-base text-gray-900 mb-1">
//                         {product.name}
//                       </h3>
//                       <p className="text-xs text-gray-600 mb-2">
//                         {product.artisan}
//                       </p>
//                       <div className="flex items-center justify-center gap-2">
//                         <span className="text-xs text-gray-500 line-through">
//                           ${product.originalPrice}
//                         </span>
//                         <span className="text-base font-bold text-primary">
//                           ${product.price}
//                         </span>
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Mobile Layout */}
//           <div className="lg:hidden mt-8">
//             {/* Mobile Header with arrows and full width underline */}
//             <div className="text-center mb-6">
//               <div className="flex items-center justify-center gap-4 text-sm text-black mb-2">
//                 <span className="font-medium">For Women</span>
//                 <span>5 items</span>
//               </div>

//               <div className="flex items-center justify-center gap-2 mb-4">
//                 <h1 className="text-2xl font-bold text-gray-900 uppercase">
//                   BESTSELLER DRESSES
//                 </h1>
//                 {/* Arrows at the end of text for mobile with margin left */}
//                 <div className="flex items-center gap-1 ml-4">
//                   <svg
//                     className="w-4 h-4 text-gray-700"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                   <svg
//                     className="w-4 h-4 text-gray-700"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </div>
//               </div>

//               {/* Full width black underline for mobile */}
//               <div className="w-full h-0.5 bg-black"></div>
//             </div>

//             {/* Mobile Products Grid */}
//             <div className="grid grid-cols-2 gap-3">
//               {bestsellerProducts.slice(0, 4).map((product) => (
//                 <Card
//                   key={product.id}
//                   className={`overflow-hidden border-0 cursor-pointer transition-all flex flex-col h-full ${
//                     selectedProduct.id === product.id
//                       ? "shadow-md bg-gray-50"
//                       : "shadow-sm"
//                   }`}
//                   onClick={() => setSelectedProduct(product)}>
//                   <div className="relative h-32 bg-gray-100 flex items-center justify-center">
//                     <div className="relative w-full h-full">
//                       <Image
//                         src={product.image || "/placeholder.svg"}
//                         alt={product.name}
//                         fill
//                         className="object-contain"
//                         sizes="(max-width: 768px) 50vw, 25vw"
//                       />
//                     </div>
//                   </div>
//                   <div className="p-2 flex-grow flex flex-col justify-center">
//                     <h4 className="font-semibold text-sm text-gray-900">
//                       {product.name}
//                     </h4>
//                     <p className="text-xs text-gray-600">{product.artisan}</p>
//                     <div className="flex items-center gap-1 mt-1">
//                       <span className="text-xs text-gray-500 line-through">
//                         ${product.originalPrice}
//                       </span>
//                       <span className="text-sm font-bold text-primary">
//                         ${product.price}
//                       </span>
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Couples Clothing Section */}
//       <section className="py-12 px-4 md:px-8 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
//             {/* Left Column - Large Image */}
//             <div className="space-y-6">
//               <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
//                 <Image
//                   src="/images/couple.jpg"
//                   alt="Couples Clothing"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             </div>

//             {/* Right Column - Content */}
//             <div className="space-y-6">
//               <div>
//                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//                   Couples Clothing
//                 </h2>
//                 <p className="text-gray-600 text-base leading-relaxed mb-2">
//                   We celebrate togetherness in style.
//                 </p>
//                 <p className="text-gray-600 text-base leading-relaxed mb-2">
//                   Matching tradition, woven with love.
//                 </p>
//                 <p className="text-gray-600 text-base leading-relaxed">
//                   A perfect pair, made to last.
//                 </p>
//               </div>

//               {/* Product showcase card */}
//               <div className="bg-gray-100 rounded-lg p-6 text-center">
//                 <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
//                   <Image
//                     src="/images/couple2.jpg"
//                     alt="Couples Product"
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <p className="text-sm text-gray-600 mb-2">Saba</p>
//                 <p className="font-semibold text-gray-900 mb-3">
//                   Couples Traditional Set
//                 </p>
//                 <div className="flex justify-center gap-2">
//                   <span className="text-gray-400 line-through text-sm">
//                     $16.49
//                   </span>
//                   <span className="text-teal-600 font-semibold">$6.48</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Features Row - Displayed under both images in a single row */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 mt-8">
//             <div className="space-y-2 text-center">
//               <div className="text-2xl font-bold text-red-700">1.</div>
//               <h3 className="font-semibold text-gray-900 text-sm">Authentic</h3>
//               <p className="text-xs text-gray-600 leading-relaxed">
//                 Real cultural designs made by local artisans.
//               </p>
//             </div>
//             <div className="space-y-2 text-center">
//               <div className="text-2xl font-bold text-red-700">2.</div>
//               <h3 className="font-semibold text-gray-900 text-sm">Handmade</h3>
//               <p className="text-xs text-gray-600 leading-relaxed">
//                 Crafted with care — not mass-produced.
//               </p>
//             </div>
//             <div className="space-y-2 text-center">
//               <div className="text-2xl font-bold text-red-700">3.</div>
//               <h3 className="font-semibold text-gray-900 text-sm">
//                 Sustainable
//               </h3>
//               <p className="text-xs text-gray-600 leading-relaxed">
//                 Support local weavers and eco-friendly fashion.
//               </p>
//             </div>
//             <div className="space-y-2 text-center">
//               <div className="text-2xl font-bold text-red-700">4.</div>
//               <h3 className="font-semibold text-gray-900 text-sm">Unique</h3>
//               <p className="text-xs text-gray-600 leading-relaxed">
//                 Every piece is one-of-a-kind and full of heritage.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Bestseller Men Cloth Section - Reversed Layout */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Main Content Grid - Reversed order */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
//             {/* Left Side - Content Area */}
//             <div className="lg:col-span-2 flex flex-col order-2 lg:order-1">
//               {/* BESTSELLER MEN CLOTH Title with full width underline */}
//               <div className="text-center lg:text-left mb-8">
//                 <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
//                   <h1 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase">
//                     BESTSELLER MEN CLOTH
//                   </h1>
//                   {/* Arrows at the end of text with margin left */}
//                   <div className="flex items-center gap-1 ml-4">
//                     <svg
//                       className="w-5 h-5 text-gray-700"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 19l-7-7 7-7"
//                       />
//                     </svg>
//                     <svg
//                       className="w-5 h-5 text-gray-700"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24">
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </div>
//                 </div>

//                 {/* Full width black underline */}
//                 <div className="w-full h-0.5 bg-black mt-2"></div>
//               </div>

//               {/* Small Products Grid - Full height equal to big image */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
//                 {bestsellerMenProducts.map((product) => (
//                   <Card
//                     key={product.id}
//                     className={`overflow-hidden border-0 cursor-pointer transition-all flex flex-col h-full ${
//                       selectedMenProduct.id === product.id
//                         ? "shadow-lg bg-gray-50"
//                         : "shadow-md hover:shadow-lg"
//                     }`}
//                     onClick={() => setSelectedMenProduct(product)}>
//                     {/* Product image - full height display without cropping */}
//                     <div className="relative flex-grow bg-gray-100 min-h-[180px] flex items-center justify-center">
//                       <div className="relative w-full h-full">
//                         <Image
//                           src={product.image || "/placeholder.svg"}
//                           alt={product.name}
//                           fill
//                           className="object-contain"
//                           sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
//                         />
//                       </div>
//                     </div>

//                     {/* Product info */}
//                     <div className="p-3 text-center flex-shrink-0">
//                       <h3 className="font-bold text-base text-gray-900 mb-1">
//                         {product.name}
//                       </h3>
//                       <p className="text-xs text-gray-600 mb-2">
//                         {product.artisan}
//                       </p>
//                       <div className="flex items-center justify-center gap-2">
//                         <span className="text-xs text-gray-500 line-through">
//                           ${product.originalPrice}
//                         </span>
//                         <span className="text-base font-bold text-primary">
//                           ${product.price}
//                         </span>
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             </div>

//             {/* Right Side - Tall Big Image with Text Overlay */}
//             <div className="lg:col-span-1 flex justify-center order-1 lg:order-2">
//               <Card className="overflow-hidden border-0 shadow-lg w-full max-w-xs relative">
//                 {/* Text overlay at the top of the big image */}
//                 <div className="absolute top-4 left-4 z-10 text-black">
//                   <div className="flex flex-col space-y-1">
//                     <span className="font-medium text-sm">FINNITURE</span>
//                     <span className="text-sm">5 Items</span>
//                   </div>
//                 </div>

//                 {/* Big tall image - full height display without cropping */}
//                 <div className="relative h-[600px] bg-gray-50 flex items-center justify-center">
//                   <div className="relative w-full h-full">
//                     <Image
//                       src="/images/men.jpg"
//                       alt={selectedMenProduct.name}
//                       fill
//                       className="object-contain"
//                       priority
//                       sizes="(max-width: 768px) 100vw, 400px"
//                     />
//                   </div>
//                 </div>
//                 {/* No product info section for big image */}
//               </Card>
//             </div>
//           </div>

//           {/* Mobile Layout */}
//           <div className="lg:hidden mt-8">
//             {/* Mobile Header with arrows and full width underline */}
//             <div className="text-center mb-6">
//               <div className="flex items-center justify-center gap-4 text-sm text-black mb-2">
//                 <span className="font-medium">FINNITURE</span>
//                 <span>5 Items</span>
//               </div>

//               <div className="flex items-center justify-center gap-2 mb-4">
//                 <h1 className="text-2xl font-bold text-gray-900 uppercase">
//                   BESTSELLER MEN CLOTH
//                 </h1>
//                 {/* Arrows at the end of text for mobile with margin left */}
//                 <div className="flex items-center gap-1 ml-4">
//                   <svg
//                     className="w-4 h-4 text-gray-700"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                   <svg
//                     className="w-4 h-4 text-gray-700"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </div>
//               </div>

//               {/* Full width black underline for mobile */}
//               <div className="w-full h-0.5 bg-black"></div>
//             </div>

//             {/* Mobile Products Grid */}
//             <div className="grid grid-cols-2 gap-3">
//               {bestsellerMenProducts.slice(0, 4).map((product) => (
//                 <Card
//                   key={product.id}
//                   className={`overflow-hidden border-0 cursor-pointer transition-all flex flex-col h-full ${
//                     selectedMenProduct.id === product.id
//                       ? "shadow-md bg-gray-50"
//                       : "shadow-sm"
//                   }`}
//                   onClick={() => setSelectedMenProduct(product)}>
//                   <div className="relative h-32 bg-gray-100 flex items-center justify-center">
//                     <div className="relative w-full h-full">
//                       <Image
//                         src={product.image || "/placeholder.svg"}
//                         alt={product.name}
//                         fill
//                         className="object-contain"
//                         sizes="(max-width: 768px) 50vw, 25vw"
//                       />
//                     </div>
//                   </div>
//                   <div className="p-2 flex-grow flex flex-col justify-center">
//                     <h4 className="font-semibold text-sm text-gray-900">
//                       {product.name}
//                     </h4>
//                     <p className="text-xs text-gray-600">{product.artisan}</p>
//                     <div className="flex items-center gap-1 mt-1">
//                       <span className="text-xs text-gray-500 line-through">
//                         ${product.originalPrice}
//                       </span>
//                       <span className="text-sm font-bold text-primary">
//                         ${product.price}
//                       </span>
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//        <section className="py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Main Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] items-center gap-8">
//           {/* Left Side - Text + Small Card */}
//           <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
//             {/* Heading + Description */}
//             <div>
//               <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
//                 GET YOUR GABI!
//               </h1>
//               <p className="text-gray-600 text-base leading-relaxed">
//                 Wrap yourself in comfort and culture.
//               </p>
//               <p className="text-gray-600 text-base leading-relaxed">
//                 It&apos;s style with a story.
//               </p>
//             </div>

//             {/* Small Product Card */}
//             <div className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg w-full max-w-xs p-5 border border-gray-100">
//               {/* Product Image */}
//               <div className="relative h-44 w-full rounded-md overflow-hidden mb-4">
//                 <Image
//                   src="/images/gabi2.jpg"
//                   alt="Gabi Folded"
//                   fill
//                   className="object-cover"
//                 />
//               </div>

//               {/* Product Info */}
//               <div className="text-center space-y-2">
//                 <p className="text-gray-800 font-semibold text-lg">Saba</p>

//                 <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
//                   <span>15 Sales</span>
//                 </div>

//                 <div className="flex items-center justify-center gap-2">
//                   <span className="text-gray-400 line-through text-sm">$16.48</span>
//                   <span className="text-teal-600 font-bold text-lg">$6.48</span>
//                 </div>

//                 {/* Color Dots */}
//                 <div className="flex justify-center gap-2 mt-2">
//                   <span className="w-3 h-3 rounded-full bg-teal-500"></span>
//                   <span className="w-3 h-3 rounded-full bg-orange-500"></span>
//                   <span className="w-3 h-3 rounded-full bg-blue-500"></span>
//                   <span className="w-3 h-3 rounded-full bg-gray-500"></span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Big Image */}
//           <div className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden">
//             <Image
//               src="/images/gabi.jpg"
//               alt="Gabi Traditional Cloth"
//               fill
//               className="object-cover object-center"
//             />
//           </div>
//         </div>
//       </div>
//     </section>

//     <section className="py-16 bg-white">
//   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//     <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wider mb-8">
//       JEWELRY PRODUCTS
//     </h2>

//     {/* Jewelry Product Grid */}
//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
//       {/* Product 1: Amina Kedir - Necklace 1 */}
//       <div className="flex flex-col items-start">
//         {/* Product Image Container */}
//         <div className="relative w-full aspect-[4/5] overflow-hidden mb-3">
//           <Image
//             src="/images/rings.png"
//             alt="Silver and bead multi-strand necklace"
//             fill
//             className="object-cover"
//           />
//         </div>
//         {/* Product Details */}
//         <p className="text-gray-900 font-semibold text-lg leading-snug">Amina Kedir</p>
//         <p className="text-gray-600 text-sm mb-1">Artisan Weaver</p>
//         <div className="flex items-center gap-1 text-sm">
//           <span className="text-gray-500 line-through">$16.48</span>
//           <span className="text-teal-600 font-bold">$6.48</span>
//         </div>
//       </div>

//       {/* Product 2: Hana Badge - Necklace 2 */}
//       <div className="flex flex-col items-start">
//         {/* Product Image Container */}
//         <div className="relative w-full aspect-[4/5] overflow-hidden mb-3">
//           <Image
//             src="/images/rings2.jpg"
//             alt="Elaborate silver bib-style necklace"
//             fill
//             className="object-cover"
//           />
//         </div>
//         {/* Product Details */}
//         <p className="text-gray-900 font-semibold text-lg leading-snug">Hana Badge</p>
//         <p className="text-gray-600 text-sm mb-1">Artisan Weaver</p>
//         <div className="flex items-center gap-1 text-sm">
//           <span className="text-gray-500 line-through">$16.48</span>
//           <span className="text-teal-600 font-bold">$6.48</span>
//         </div>
//       </div>

//       {/* Product 3: Sitra Teha - Cuffs/Bracelets */}
//       <div className="flex flex-col items-start">
//         {/* Product Image Container */}
//         <div className="relative w-full aspect-[4/5] overflow-hidden mb-3">
//           <Image
//             src="/images/rings3.jpg"
//             alt="Collection of silver cuffs and bracelets"
//             fill
//             className="object-cover"
//           />
//         </div>
//         {/* Product Details */}
//         <p className="text-gray-900 font-semibold text-lg leading-snug">Sitra Teha</p>
//         <p className="text-gray-600 text-sm mb-1">Artisan Weaver</p>
//         <div className="flex items-center gap-1 text-sm">
//           <span className="text-gray-500 line-through">$16.48</span>
//           <span className="text-teal-600 font-bold">$6.48</span>
//         </div>
//       </div>

//       {/* Product 4: Hermella Kassahun - Rings */}
//       <div className="flex flex-col items-start">
//         {/* Product Image Container */}
//         <div className="relative w-full aspect-[4/5] overflow-hidden mb-3">
//           <Image
//             src="/images/rings4.jpg"
//             alt="Assortment of artisan silver rings"
//             fill
//             className="object-cover"
//           />
//         </div>
//         {/* Product Details */}
//         <p className="text-gray-900 font-semibold text-lg leading-snug">Hermella Kassahun</p>
//         <p className="text-gray-600 text-sm mb-1">Artisan Weaver</p>
//         <div className="flex items-center gap-1 text-sm">
//           <span className="text-gray-500 line-through">$16.48</span>
//           <span className="text-teal-600 font-bold">$6.48</span>
//         </div>
//       </div>
//     </div>
    
//    <section className="py-16 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 text-center">
       
//         <div className="flex justify-center items-center gap-8 md:gap-12">
//           {/* TikTok */}
//           <a
//             href="#"
//             target="_blank"
//             className="p-4 rounded-full bg-white shadow-md hover:shadow-xl transition duration-300 hover:scale-110"
//             title="TikTok"
//           >
//             <Image
//               src="/images/tiktok.svg"
//               alt="TikTok"
//               width={40}
//               height={40}
//               className="hover:opacity-80 transition duration-300"
//             />
//           </a>

//           {/* Instagram */}
//           <a
//             href="#"
//             target="_blank"
//             className="p-4 rounded-full bg-white shadow-md hover:shadow-xl transition duration-300 hover:scale-110"
//             title="Instagram"
//           >
//             <Image
//               src="/images/instagram.svg"
//               alt="Instagram"
//               width={40}
//               height={40}
//               className="hover:opacity-80 transition duration-300"
//             />
//           </a>

//           {/* Telegram */}
//           <a
//             href="#"
//             target="_blank"
//             className="p-4 rounded-full bg-white shadow-md hover:shadow-xl transition duration-300 hover:scale-110"
//             title="Telegram"
//           >
//             <Image
//               src="/images/telegram.svg"
//               alt="Telegram"
//               width={40}
//               height={40}
//               className="hover:opacity-80 transition duration-300"
//             />
//           </a>

//           {/* YouTube */}
//           <a
//             href="#"
//             target="_blank"
//             className="p-4 rounded-full bg-white shadow-md hover:shadow-xl transition duration-300 hover:scale-110"
//             title="YouTube"
//           >
//             <Image
//               src="/images/tiktok.svg"
//               alt="YouTube"
//               width={40}
//               height={40}
//               className="hover:opacity-80 transition duration-300"
//             />
//           </a>
//         </div>
//       </div>
//     </section>

   
//   </div>
// </section>

// <section className="py-16 bg-white">
//   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//     {/* Section Header */}
//     <div className="text-center mb-12">
//       <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-2">
//         Practice Advice
//       </p>
//       <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
//         Meet the Weavers!
//       </h2>
//     </div>

//     {/* Weavers Grid */}
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//       {/* Weaver Card 1 */}
//       <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
//         {/* Weaver Image */}
//         <div className="relative w-full h-64">
//           <Image
//             src="/images/girl1.png"
//             alt="Amina Kedir"
//             fill
//             className="object-cover "
//           />
//         </div>
//         {/* Weaver Info */}
//         <div className="p-6">
//           <h3 className="text-xl font-bold text-gray-900 mb-2">Amina Kedir</h3>
//           <p className="text-gray-600 text-sm leading-relaxed mb-4">
//             Amina is a young professional who celebrates her culture through fashion.
//             She loves finding handmade traditional clothes that blend
//             authenticity with modern style, letting her wear her heritage with pride.
//           </p>
//           <div className="flex items-center text-gray-500 text-xs mb-4">
//             {/* Calendar Icon */}
//             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//             </svg>
//             <span>22 April 2021</span>
//             {/* Star Ratings */}
//             <div className="flex ml-auto space-x-0.5">
//               {[...Array(3)].map((_, i) => (
//                 <svg key={i} className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
//                 </svg>
//               ))}
//               <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
//               </svg>
//             </div>
//           </div>
//           <a href="#" className="flex items-center text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors duration-200">
//             See Profile
//             <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//             </svg>
//           </a>
//         </div>
//       </div>

//       {/* Weaver Card 2 (using girl2.jpg) */}
//       <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
//         {/* Weaver Image */}
//         <div className="relative w-full h-64">
//           <Image
//             src="/images/girl2.png"
//             alt="Amina Kedir"
//             fill
//             className="object-cover object-top"
//           />
//         </div>
//         {/* Weaver Info */}
//         <div className="p-6">
//           <h3 className="text-xl font-bold text-gray-900 mb-2">Amina Kedir</h3>
//           <p className="text-gray-600 text-sm leading-relaxed mb-4">
//             Amina is a young professional who celebrates her culture through fashion.
//             She loves finding handmade traditional clothes that blend
//             authenticity with modern style, letting her wear her heritage with pride.
//           </p>
//           <div className="flex items-center text-gray-500 text-xs mb-4">
//             {/* Calendar Icon */}
//             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//             </svg>
//             <span>22 April 2021</span>
//             {/* Star Ratings */}
//             <div className="flex ml-auto space-x-0.5">
//               {[...Array(3)].map((_, i) => (
//                 <svg key={i} className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
//                 </svg>
//               ))}
//               <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
//               </svg>
//             </div>
//           </div>
//           <a href="#" className="flex items-center text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors duration-200">
//             See Profile
//             <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//             </svg>
//           </a>
//         </div>
//       </div>

//       {/* Weaver Card 3 (using girl3.jpg) */}
//       <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
//         {/* Weaver Image */}
//         <div className="relative w-full h-64">
//           <Image
//             src="/images/girl3.jpg" // Note: Corrected typo from "girl3.ljp" to "girl3.jpg"
//             alt="Amina Kedir"
//             fill
//             className="object-cover object-top"
//           />
//         </div>
//         {/* Weaver Info */}
//         <div className="p-6">
//           <h3 className="text-xl font-bold text-gray-900 mb-2">Amina Kedir</h3>
//           <p className="text-gray-600 text-sm leading-relaxed mb-4">
//             Amina is a young professional who celebrates her culture through fashion.
//             She loves finding handmade traditional clothes that blend
//             authenticity with modern style, letting her wear her heritage with pride.
//           </p>
//           <div className="flex items-center text-gray-500 text-xs mb-4">
//             {/* Calendar Icon */}
//             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//             </svg>
//             <span>22 April 2021</span>
//             {/* Star Ratings */}
//             <div className="flex ml-auto space-x-0.5">
//               {[...Array(3)].map((_, i) => (
//                 <svg key={i} className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
//                 </svg>
//               ))}
//               <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
//               </svg>
//             </div>
//           </div>
//           <a href="#" className="flex items-center text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors duration-200">
//             See Profile
//             <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//             </svg>
//           </a>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>
//     </>
//   );
// }




"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
// import { Icon } from 'lucide-react';

const bestsellerProducts = [
  {
    id: "1",
    name: "Amina Kedir",
    artisan: "Artisan Weaver",
    price: 6.48,
    originalPrice: 16.48,
    image: "/images/dress.jpg",
  },
  {
    id: "2",
    name: "Hana Badege",
    artisan: "Artisan Weaver",
    price: 6.48,
    originalPrice: 16.48,
    image: "/images/tr2.jpg",
  },
  {
    id: "3",
    name: "Sitra Tcha",
    artisan: "Artisan Weaver",
    price: 6.48,
    originalPrice: 16.48,
    image: "/images/traditional.jpg",
  },
  {
    id: "4",
    name: "Amina Kedir",
    artisan: "Artisan Weaver",
    price: 6.48,
    originalPrice: 16.48,
    image: "/images/tr2.jpg",
  },
  {
    id: "5",
    name: "Hana Badege",
    artisan: "Artisan Weaver",
    price: 6.48,
    originalPrice: 16.48,
    image: "/images/traditional.jpg",
  },
  {
    id: "6",
    name: "Sitra Tcha",
    artisan: "Artisan Weaver",
    price: 6.48,
    originalPrice: 16.48,
    image: "/images/tr2.jpg",
  },
]

const bestsellerMenProducts = [
  {
    id: "1",
    name: "Kedir Mohammed",
    artisan: "Artisan Weaver",
    price: 6.48,
    originalPrice: 16.49,
    image: "/images/men3.png",
  },
  {
    id: "2",
    name: "Hana Badege",
    artisan: "Artisan Weaver",
    price: 6.48,
    originalPrice: 16.49,
    image: "/images/men4.jpg",
  },
  {
    id: "3",
    name: "Sitta Tcha",
    artisan: "Artisan Weaver",
    price: 6.48,
    originalPrice: 16.49,
    image: "/images/men3.png",
  },
  {
    id: "4",
    name: "Amina Kedir",
    artisan: "Artisan Weaver",
    price: 6.48,
    originalPrice: 16.49,
    image: "/images/men4.jpg",
  },
  {
    id: "5",
    name: "Hana Badege",
    artisan: "Artisan Weaver",
    price: 6.48,
    originalPrice: 16.49,
    image: "/images/men3.png",
  },
  {
    id: "6",
    name: "Sitta Tcha",
    artisan: "Artisan Weaver",
    price: 6.48,
    originalPrice: 16.49,
    image: "/images/men4.jpg",
  },
]

export function BestsellerSection() {
  const [selectedProduct, setSelectedProduct] = useState(bestsellerProducts[0])
  const [selectedMenProduct, setSelectedMenProduct] = useState(bestsellerMenProducts[0])

  return (
    <>
      {/* Bestseller Dresses Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Left Side - Tall Big Image with Text Overlay */}
            <div className="lg:col-span-1 flex justify-center">
              <Card className="overflow-hidden border-0 shadow-lg w-full max-w-xs relative">
                {/* Text overlay at the top of the big image */}
                <div className="absolute top-4 left-4 z-10 text-black">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium text-sm">For Women</span>
                    <span className="text-sm">5 items</span>
                  </div>
                </div>

                {/* Big tall image - full height display without cropping */}
                <div className="relative h-[600px] bg-gray-50 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                </div>
                {/* No product info section for big image */}
              </Card>
            </div>

            {/* Right Side - Content Area */}
            <div className="lg:col-span-2 flex flex-col">
              {/* BESTSELLER DRESSES Title with full width underline */}
              <div className="text-center lg:text-left mb-8">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase">BESTSELLER DRESSES</h1>
                  {/* Arrows at the end of text with margin left */}
                  <div className="flex items-center gap-1 ml-4">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Full width black underline */}
                <div className="w-full h-0.5 bg-black mt-2"></div>
              </div>

              {/* Small Products Grid - Full height equal to big image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
                {bestsellerProducts.map((product) => (
                  <Card
                    key={product.id}
                    className={`overflow-hidden border-0 cursor-pointer transition-all flex flex-col h-full ${
                      selectedProduct.id === product.id ? "shadow-lg bg-gray-50" : "shadow-md hover:shadow-lg"
                    }`}
                    onClick={() => {
                      setSelectedProduct(product)
                      window.location.href = `/products/${product.id}`
                    }}
                  >
                    {/* Product image - full height display without cropping */}
                    <div className="relative flex-grow bg-gray-100 min-h-[180px] flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </div>
                    </div>

                    {/* Product info */}
                    <div className="p-3 text-center flex-shrink-0">
                      <h3 className="font-bold text-base text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{product.artisan}</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-gray-500 line-through">Birr{product.originalPrice}</span>
                        <span className="text-base font-bold text-primary">Birr{product.price}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden mt-8">
            {/* Mobile Header with arrows and full width underline */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-4 text-sm text-black mb-2">
                <span className="font-medium">For Women</span>
                <span>5 items</span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <h1 className="text-2xl font-bold text-gray-900 uppercase">BESTSELLER DRESSES</h1>
                {/* Arrows at the end of text for mobile with margin left */}
                <div className="flex items-center gap-1 ml-4">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Full width black underline for mobile */}
              <div className="w-full h-0.5 bg-black"></div>
            </div>

            {/* Mobile Products Grid */}
            <div className="grid grid-cols-2 gap-3">
              {bestsellerProducts.slice(0, 4).map((product) => (
                <Card
                  key={product.id}
                  className={`overflow-hidden border-0 cursor-pointer transition-all flex flex-col h-full ${
                    selectedProduct.id === product.id ? "shadow-md bg-gray-50" : "shadow-sm"
                  }`}
                  onClick={() => {
                    setSelectedProduct(product)
                    window.location.href = `/products/${product.id}`
                  }}
                >
                  <div className="relative h-32 bg-gray-100 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  </div>
                  <div className="p-2 flex-grow flex flex-col justify-center">
                    <h4 className="font-semibold text-sm text-gray-900">{product.name}</h4>
                    <p className="text-xs text-gray-600">{product.artisan}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-gray-500 line-through">Birr{product.originalPrice}</span>
                      <span className="text-sm font-bold text-primary">Birr{product.price}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Couples Clothing Section */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left Column - Large Image */}
            <div className="space-y-6">
              <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
                <Image src="/images/couple.jpg" alt="Couples Clothing" fill className="object-cover" />
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Couples Clothing</h2>
                <p className="text-gray-600 text-base leading-relaxed mb-2">We celebrate togetherness in style.</p>
                <p className="text-gray-600 text-base leading-relaxed mb-2">Matching tradition, woven with love.</p>
                <p className="text-gray-600 text-base leading-relaxed">A perfect pair, made to last.</p>
              </div>

              {/* Product showcase card */}
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image src="/images/couple2.jpg" alt="Couples Product" fill className="object-cover" />
                </div>
                <p className="text-sm text-gray-600 mb-2">Saba</p>
                <p className="font-semibold text-gray-900 mb-3">Couples Traditional Set</p>
                <div className="flex justify-center gap-2">
                  <span className="text-gray-400 line-through text-sm">Birr 10,000</span>
                  <span className="text-teal-600 font-semibold">Birr 5000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Row - Displayed under both images in a single row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 mt-8">
            <div className="space-y-2 text-center">
              <div className="text-2xl font-bold text-red-700">1.</div>
              <h3 className="font-semibold text-gray-900 text-sm">Authentic</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Real cultural designs made by local artisans.</p>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-2xl font-bold text-red-700">2.</div>
              <h3 className="font-semibold text-gray-900 text-sm">Handmade</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Crafted with care — not mass-produced.</p>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-2xl font-bold text-red-700">3.</div>
              <h3 className="font-semibold text-gray-900 text-sm">Sustainable</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Support local weavers and eco-friendly fashion.</p>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-2xl font-bold text-red-700">4.</div>
              <h3 className="font-semibold text-gray-900 text-sm">Unique</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every piece is one-of-a-kind and full of heritage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bestseller Men Cloth Section - Reversed Layout */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content Grid - Reversed order */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Left Side - Content Area */}
            <div className="lg:col-span-2 flex flex-col order-2 lg:order-1">
              {/* BESTSELLER MEN CLOTH Title with full width underline */}
              <div className="text-center lg:text-left mb-8">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase">BESTSELLER MEN CLOTH</h1>
                  {/* Arrows at the end of text with margin left */}
                  <div className="flex items-center gap-1 ml-4">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Full width black underline */}
                <div className="w-full h-0.5 bg-black mt-2"></div>
              </div>

              {/* Small Products Grid - Full height equal to big image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
                {bestsellerMenProducts.map((product) => (
                  <Card
                    key={product.id}
                    className={`overflow-hidden border-0 cursor-pointer transition-all flex flex-col h-full ${
                      selectedMenProduct.id === product.id ? "shadow-lg bg-gray-50" : "shadow-md hover:shadow-lg"
                    }`}
                    onClick={() => {
                      setSelectedMenProduct(product)
                      window.location.href = `/products/${product.id}`
                    }}
                  >
                    {/* Product image - full height display without cropping */}
                    <div className="relative flex-grow bg-gray-100 min-h-[180px] flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </div>
                    </div>

                    {/* Product info */}
                    <div className="p-3 text-center flex-shrink-0">
                      <h3 className="font-bold text-base text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{product.artisan}</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-gray-500 line-through">Birr {product.originalPrice}</span>
                        <span className="text-base font-bold text-primary">Birr {product.price}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Side - Tall Big Image with Text Overlay */}
            <div className="lg:col-span-1 flex justify-center order-1 lg:order-2">
              <Card className="overflow-hidden border-0 shadow-lg w-full max-w-xs relative">
                {/* Text overlay at the top of the big image */}
                <div className="absolute top-4 left-4 z-10 text-black">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium text-sm">FINNITURE</span>
                    <span className="text-sm">5 Items</span>
                  </div>
                </div>

                {/* Big tall image - full height display without cropping */}
                <div className="relative h-[600px] bg-gray-50 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/men.jpg"
                      alt={selectedMenProduct.name}
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                </div>
                {/* No product info section for big image */}
              </Card>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden mt-8">
            {/* Mobile Header with arrows and full width underline */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-4 text-sm text-black mb-2">
                <span className="font-medium">FINNITURE</span>
                <span>5 Items</span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <h1 className="text-2xl font-bold text-gray-900 uppercase">BESTSELLER MEN CLOTH</h1>
                {/* Arrows at the end of text for mobile with margin left */}
                <div className="flex items-center gap-1 ml-4">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Full width black underline for mobile */}
              <div className="w-full h-0.5 bg-black"></div>
            </div>

            {/* Mobile Products Grid */}
            <div className="grid grid-cols-2 gap-3">
              {bestsellerMenProducts.slice(0, 4).map((product) => (
                <Card
                  key={product.id}
                  className={`overflow-hidden border-0 cursor-pointer transition-all flex flex-col h-full ${
                    selectedMenProduct.id === product.id ? "shadow-md bg-gray-50" : "shadow-sm"
                  }`}
                  onClick={() => {
                    setSelectedMenProduct(product)
                    window.location.href = `/products/${product.id}`
                  }}
                >
                  <div className="relative h-32 bg-gray-100 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  </div>
                  <div className="p-2 flex-grow flex flex-col justify-center">
                    <h4 className="font-semibold text-sm text-gray-900">{product.name}</h4>
                    <p className="text-xs text-gray-600">{product.artisan}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-gray-500 line-through">Birr{product.originalPrice}</span>
                      <span className="text-sm font-bold text-primary">Birr{product.price}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] items-center gap-8">
            {/* Left Side - Text + Small Card */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              {/* Heading + Description */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">GET YOUR GABI!</h1>
                <p className="text-gray-600 text-base leading-relaxed">Wrap yourself in comfort and culture.</p>
                <p className="text-gray-600 text-base leading-relaxed">It&apos;s style with a story.</p>
              </div>

              {/* Small Product Card */}
              <div className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg w-full max-w-xs p-5 border border-gray-100">
                {/* Product Image */}
                <div className="relative h-44 w-full rounded-md overflow-hidden mb-4">
                  <Image src="/images/gabi2.jpg" alt="Gabi Folded" fill className="object-cover" />
                </div>

                {/* Product Info */}
                <div className="text-center space-y-2">
                  <p className="text-gray-800 font-semibold text-lg">Saba</p>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span>15 Sales</span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <span className="text-gray-400 line-through text-sm">Birr 10000</span>
                    <span className="text-teal-600 font-bold text-lg">Birr 5000</span>
                  </div>

                  {/* Color Dots */}
                  <div className="flex justify-center gap-2 mt-2">
                    <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Big Image */}
            <div className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden">
              <Image src="/images/gabi.jpg" alt="Gabi Traditional Cloth" fill className="object-cover object-center" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wider mb-8">
            JEWELRY PRODUCTS
          </h2>

          {/* Jewelry Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
            {/* Product 1: Amina Kedir - Necklace 1 */}
            <div className="flex flex-col items-start">
              {/* Product Image Container */}
              <div className="relative w-full aspect-[4/5] overflow-hidden mb-3">
                <Image
                  src="/images/rings.png"
                  alt="Silver and bead multi-strand necklace"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Product Details */}
              <p className="text-gray-900 font-semibold text-lg leading-snug">Amina Kedir</p>
              <p className="text-gray-600 text-sm mb-1">Artisan Weaver</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500 line-through">$16.48</span>
                <span className="text-teal-600 font-bold">$6.48</span>
              </div>
            </div>

            {/* Product 2: Hana Badge - Necklace 2 */}
            <div className="flex flex-col items-start">
              {/* Product Image Container */}
              <div className="relative w-full aspect-[4/5] overflow-hidden mb-3">
                <Image
                  src="/images/rings2.jpg"
                  alt="Elaborate silver bib-style necklace"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Product Details */}
              <p className="text-gray-900 font-semibold text-lg leading-snug">Hana Badge</p>
              <p className="text-gray-600 text-sm mb-1">Artisan Weaver</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500 line-through">$16.48</span>
                <span className="text-teal-600 font-bold">$6.48</span>
              </div>
            </div>

            {/* Product 3: Sitra Teha - Cuffs/Bracelets */}
            <div className="flex flex-col items-start">
              {/* Product Image Container */}
              <div className="relative w-full aspect-[4/5] overflow-hidden mb-3">
                <Image
                  src="/images/rings3.jpg"
                  alt="Collection of silver cuffs and bracelets"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Product Details */}
              <p className="text-gray-900 font-semibold text-lg leading-snug">Sitra Teha</p>
              <p className="text-gray-600 text-sm mb-1">Artisan Weaver</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500 line-through">$16.48</span>
                <span className="text-teal-600 font-bold">$6.48</span>
              </div>
            </div>

            {/* Product 4: Hermella Kassahun - Rings */}
            <div className="flex flex-col items-start">
              {/* Product Image Container */}
              <div className="relative w-full aspect-[4/5] overflow-hidden mb-3">
                <Image
                  src="/images/rings4.jpg"
                  alt="Assortment of artisan silver rings"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Product Details */}
              <p className="text-gray-900 font-semibold text-lg leading-snug">Hermella Kassahun</p>
              <p className="text-gray-600 text-sm mb-1">Artisan Weaver</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500 line-through">$16.48</span>
                <span className="text-teal-600 font-bold">$6.48</span>
              </div>
            </div>
          </div>

          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="flex justify-center items-center gap-8 md:gap-12">
                {/* TikTok */}
                <a
                  href="#"
                  target="_blank"
                  className="p-4 rounded-full bg-white shadow-md hover:shadow-xl transition duration-300 hover:scale-110"
                  title="TikTok"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/tiktok.svg"
                    alt="TikTok"
                    width={40}
                    height={40}
                    className="hover:opacity-80 transition duration-300"
                  />
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  target="_blank"
                  className="p-4 rounded-full bg-white shadow-md hover:shadow-xl transition duration-300 hover:scale-110"
                  title="Instagram"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/instagram.svg"
                    alt="Instagram"
                    width={40}
                    height={40}
                    className="hover:opacity-80 transition duration-300"
                  />
                </a>

                {/* Telegram */}
                <a
                  href="#"
                  target="_blank"
                  className="p-4 rounded-full bg-white shadow-md hover:shadow-xl transition duration-300 hover:scale-110"
                  title="Telegram"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/telegram.svg"
                    alt="Telegram"
                    width={40}
                    height={40}
                    className="hover:opacity-80 transition duration-300"
                  />
                </a>

                {/* YouTube */}
                <a
                  href="#"
                  target="_blank"
                  className="p-4 rounded-full bg-white shadow-md hover:shadow-xl transition duration-300 hover:scale-110"
                  title="YouTube"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/tiktok.svg"
                    alt="YouTube"
                    width={40}
                    height={40}
                    className="hover:opacity-80 transition duration-300"
                  />
                </a>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-2">Practice Advice</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Meet the Weavers!</h2>
          </div>

          {/* Weavers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Weaver Card 1 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              {/* Weaver Image */}
              <div className="relative w-full h-64">
                <Image src="/images/girl1.png" alt="Amina Kedir" fill className="object-cover " />
              </div>
              {/* Weaver Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Amina Kedir</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Amina is a young professional who celebrates her culture through fashion. She loves finding handmade
                  traditional clothes that blend authenticity with modern style, letting her wear her heritage with
                  pride.
                </p>
                <div className="flex items-center text-gray-500 text-xs mb-4">
                  {/* Calendar Icon */}
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span>22 April 2021</span>
                  {/* Star Ratings */}
                  <div className="flex ml-auto space-x-0.5">
                    {[...Array(3)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-orange-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                    <svg
                      className="w-4 h-4 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </div>
                <a
                  href="#"
                  className="flex items-center text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors duration-200"
                >
                  See Profile
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Weaver Card 2 (using girl2.jpg) */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              {/* Weaver Image */}
              <div className="relative w-full h-64">
                <Image src="/images/girl2.png" alt="Amina Kedir" fill className="object-cover object-top" />
              </div>
              {/* Weaver Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Amina Kedir</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Amina is a young professional who celebrates her culture through fashion. She loves finding handmade
                  traditional clothes that blend authenticity with modern style, letting her wear her heritage with
                  pride.
                </p>
                <div className="flex items-center text-gray-500 text-xs mb-4">
                  {/* Calendar Icon */}
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span>22 April 2021</span>
                  {/* Star Ratings */}
                  <div className="flex ml-auto space-x-0.5">
                    {[...Array(3)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-orange-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                    <svg
                      className="w-4 h-4 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </div>
                <a
                  href="#"
                  className="flex items-center text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors duration-200"
                >
                  See Profile
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Weaver Card 3 (using girl3.jpg) */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              {/* Weaver Image */}
              <div className="relative w-full h-64">
                <Image
                  src="/images/girl3.jpg" // Note: Corrected typo from "girl3.ljp" to "girl3.jpg"
                  alt="Amina Kedir"
                  fill
                  className="object-cover object-top"
                />
              </div>
              {/* Weaver Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Amina Kedir</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Amina is a young professional who celebrates her culture through fashion. She loves finding handmade
                  traditional clothes that blend authenticity with modern style, letting her wear her heritage with
                  pride.
                </p>
                <div className="flex items-center text-gray-500 text-xs mb-4">
                  {/* Calendar Icon */}
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span>22 April 2021</span>
                  {/* Star Ratings */}
                  <div className="flex ml-auto space-x-0.5">
                    {[...Array(3)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-orange-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                    <svg
                      className="w-4 h-4 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </div>
                <a
                  href="#"
                  className="flex items-center text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors duration-200"
                >
                  See Profile
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
