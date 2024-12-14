import { CmsContent } from "@/components/cms/cms-content";
import { Heading } from "@/components/ui/heading";

export default function CmsPage() {
  return (
    <div className="p-6">
      <Heading
        title="Content Management"
        description="Manage website content and settings"
      />
      <CmsContent />
    </div>
  );
}
