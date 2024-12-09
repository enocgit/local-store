"use client";

import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Review, User, Product } from "@prisma/client";

interface ReviewWithRelations extends Review {
  user: User;
  product: Product;
}

interface ReviewClientProps {
  data: ReviewWithRelations[];
}

export function ReviewClient({ data }: ReviewClientProps) {
  return (
    <>
      <Heading title={`Reviews`} description="Manage product reviews" />
      <DataTable searchKey="content" columns={columns} data={data} />
    </>
  );
}
