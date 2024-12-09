"use client";

import { SiteConfig } from "@prisma/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UploadButton } from "@/components/ui/upload-button";
import Image from "next/image";
import { X } from "lucide-react";

interface ConfigItemProps {
  config: SiteConfig;
}

export function ConfigItem({ config }: ConfigItemProps) {
  const [jsonValues, setJsonValues] = useState<Record<string, string>>(
    config.type === "json" ? (config.valueJson as Record<string, string>) : {},
  );
  const [value, setValue] = useState(config.value || "");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newValue: string | Record<string, string>) => {
      let dataToSend;

      if (config.type === "json") {
        dataToSend = { valueJson: newValue };
      } else {
        dataToSend = { value: newValue };
      }

      const res = await fetch(`/api/cms/config/${config.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        throw new Error("Failed to update config");
      }

      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["site-configs"] });
      queryClient.invalidateQueries({ queryKey: ["site-config"] });

      if (config.type === "json") {
        setJsonValues(data.valueJson);
      } else {
        setValue(data.value);
      }

      setIsEditing(false);
      setError("");
      toast({
        title: "Config updated",
        description: "Config has been updated successfully",
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (config.type === "json") {
      mutation.mutate(jsonValues);
    } else {
      mutation.mutate(value);
    }
  };

  const handleJsonInputChange = (key: string, newValue: string) => {
    setJsonValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const renderInput = () => {
    if (config.type === "json") {
      return (
        <div className="space-y-2">
          {Object.entries(jsonValues).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              {key === "image" ? (
                <div className="w-full space-y-4">
                  <label className="w-24 text-sm capitalize text-muted-foreground">
                    {key.replace(/_/g, " ")}
                  </label>
                  <UploadButton
                    onUploadComplete={(url) => handleJsonInputChange(key, url)}
                    onUploadError={(error: Error) => {
                      toast({
                        title: "Error",
                        description:
                          "Failed to upload image. Please try again.",
                        variant: "destructive",
                      });
                    }}
                  />
                  {value && (
                    <div className="relative w-[200px]">
                      <div className="relative h-[100px] w-full">
                        <Image
                          src={value}
                          alt="Config image"
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6"
                        onClick={() => handleJsonInputChange(key, "")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <label className="w-24 text-sm capitalize text-muted-foreground">
                    {key.replace(/_/g, " ")}
                  </label>
                  <Input
                    value={value}
                    onChange={(e) => handleJsonInputChange(key, e.target.value)}
                    className="flex-1"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (config.key.includes("image")) {
      return (
        <div className="space-y-4">
          <UploadButton
            onUploadComplete={(url) => setValue(url)}
            onUploadError={(error: Error) => {
              toast({
                title: "Error",
                description: "Failed to upload image. Please try again.",
                variant: "destructive",
              });
            }}
          />
          {value && (
            <div className="relative w-[200px]">
              <div className="relative h-[100px] w-full">
                <Image
                  src={value}
                  alt="Config image"
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6"
                onClick={() => setValue("")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1"
      />
    );
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{config.label}</label>
      <div className="space-y-2">
        {isEditing ? (
          renderInput()
        ) : (
          <div className="flex-1 rounded-md border p-2 font-mono text-sm">
            {config.type === "json" ? (
              <div className="space-y-1 overflow-x-hidden">
                {Object.entries(jsonValues).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="capitalize text-muted-foreground">
                      {key.replace(/_/g, " ")}:
                    </span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            ) : config.key.includes("image") ? (
              value && (
                <div className="relative w-[200px]">
                  <div className="relative h-[100px] w-full">
                    <Image
                      src={value}
                      alt="Config image"
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                </div>
              )
            ) : (
              <div className="overflow-x-hidden">{value}</div>
            )}
          </div>
        )}
        <div className="flex justify-end">
          {mutation.isPending && <Loader2 className="animate-spin" />}

          <Button
            variant={isEditing ? "default" : "secondary"}
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
