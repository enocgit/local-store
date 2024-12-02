import Image from "next/image";

export function WishlistHeader() {
  return (
    <div className="relative flex h-[300px] items-center">
      <Image
        src="/images/wishlist.jpg"
        alt="Wishlist"
        fill
        className="object-cover brightness-50"
        priority
      />
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold text-white">Wishlist</h1>
          <p className="text-xl text-gray-200">
            Save your favorite products for later and keep track of items
            you&apos;d love to purchase
          </p>
        </div>
      </div>
    </div>
  );
}
