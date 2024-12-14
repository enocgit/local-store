"use client";

import { SiteConfig } from "@prisma/client";
import { ConfigItem } from "./config-item";

interface ConfigGroupProps {
  configs: SiteConfig[];
}

export function ConfigGroup({ configs }: ConfigGroupProps) {
  return (
    <div className="space-y-4">
      {configs.map((config) => (
        <ConfigItem key={config.id} config={config} />
      ))}
    </div>
  );
}
