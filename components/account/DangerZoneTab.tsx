import { DeleteAccountDialog } from "@/components/DeleteAccountDialog";

export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="border-t pt-6">
        <h2 className="mb-4 text-xl font-semibold">Danger Zone</h2>
        <div className="rounded-lg bg-destructive/10 p-4">
          <h3 className="mb-2 font-medium">Delete Account</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <DeleteAccountDialog />
        </div>
      </div>
    </div>
  );
}
