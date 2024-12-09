import { useQuery } from "@tanstack/react-query";
import { SiteConfig } from "@prisma/client";

// Type for the transformed config object
type TransformedConfig = {
  [key: string]: string | Record<string, any> | null | number | boolean | any[];
};

function transformConfigs(configs: SiteConfig[]): TransformedConfig {
  return configs.reduce((acc, config) => {
    // If it's a JSON type, use valueJson, otherwise use value
    acc[config.key] = config.type === "json" ? config.valueJson : config.value;
    return acc;
  }, {} as TransformedConfig);
}

export function useSiteConfig() {
  return useQuery({
    queryKey: ["site-config"],
    queryFn: async () => {
      const res = await fetch("/api/config");
      const configs: SiteConfig[] = await res.json();
      return transformConfigs(configs);
    },
  });
}
