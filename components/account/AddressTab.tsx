"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Address } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
} from "../ui/alert-dialog";
import { AlertDialogHeader } from "../ui/alert-dialog";

export function AddressTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await fetch("/api/addresses");
      const data = await response.json();
      setAddresses(data.addresses);
    } catch (error) {
      toast({
        title: "Failed to load addresses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleDelete = async () => {
    if (!addressToDelete) return;

    try {
      const response = await fetch(`/api/addresses/${addressToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.text();
        if (response.status === 400) {
          toast({
            title: "Cannot Delete Address",
            description: errorData,
            variant: "destructive",
          });
        } else {
          throw new Error("Failed to delete address");
        }
        return;
      }

      toast({
        title: "Address deleted successfully",
        variant: "default",
      });
      fetchAddresses(); // Refresh the list
    } catch (error) {
      toast({
        title: "Failed to delete address",
        variant: "destructive",
      });
    } finally {
      setIsDialogOpen(false);
      setAddressToDelete(null);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-semibold">Saved Addresses</h2>
        {addresses.length === 0 ? (
          <p className="text-muted-foreground">No saved addresses found.</p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">
                    {address.address1}
                    {address.address2 && `, ${address.address2}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.postcode}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setAddressToDelete(address.id);
                    setIsDialogOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone if the address isn&apos;t linked to any orders.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
