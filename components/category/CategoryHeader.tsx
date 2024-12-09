import Image from "next/image";

interface CategoryHeaderProps {
  title: string;
  description: string;
  image: string;
}

export function CategoryHeader({
  title,
  description,
  image,
}: CategoryHeaderProps) {
  return (
    <div className="relative flex h-[300px] items-center">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover brightness-50"
        priority
      />
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="mb-4 animate-fade-in text-4xl font-bold text-white">
            {title}
          </h1>
          <p className="animate-slide-up-delay text-xl text-gray-200">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
