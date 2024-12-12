"use client";

import { Card } from "@/components/ui/card";
import { ConfigGroup } from "./config-group";
import { useQuery } from "@tanstack/react-query";
import { SiteConfig } from "@prisma/client";
import Loader from "../ui/loader";

export function CmsContent() {
  const { data: configs, isLoading } = useQuery<SiteConfig[]>({
    queryKey: ["site-configs"],
    queryFn: async () => {
      const res = await fetch("/api/cms/config");
      return res.json();
    },
  });

  if (isLoading) {
    return <Loader className="border-t-black" />;
  }

  // Group configs by their group field
  const groupedConfigs = configs?.reduce(
    (acc, config) => {
      if (!acc[config.group]) {
        acc[config.group] = [];
      }
      acc[config.group].push(config);
      return acc;
    },
    {} as Record<string, SiteConfig[]>,
  );

  return (
    <div className="mt-5 grid gap-6 lg:grid-cols-2">
      {Object.entries(groupedConfigs || {}).map(([group, configs]) => (
        <Card key={group} className="p-6">
          <h2 className="mb-4 text-lg font-semibold capitalize">{group}</h2>
          <ConfigGroup configs={configs} />
        </Card>
      ))}
    </div>
  );
}
