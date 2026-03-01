"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Check, AlertCircle } from "lucide-react";
import { Button } from "@/app/ui/Primitives/ui/Button";
import { queryKeys } from "@/app/hooks/useQuery";

interface SyncButtonProps {
  owner: string;
  repo: string;
}

type SyncStatus = "idle" | "syncing" | "success" | "error";

export function SyncButton({ owner, repo }: SyncButtonProps) {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const queryClient = useQueryClient();

  const handleSync = async () => {
    setStatus("syncing");
    
    try {
      // Invalidate all GitHub-related queries
      await queryClient.invalidateQueries({
        queryKey: queryKeys.github.repo(owner, repo),
      });

      // Force a hard refresh to get fresh server data
      await queryClient.refetchQueries({
        queryKey: queryKeys.github.repo(owner, repo),
        type: "active",
      });

      setStatus("success");
      
      // Reset to idle after 2 seconds
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("Sync failed:", error);
      setStatus("error");
      
      // Reset to idle after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case "syncing":
        return {
          icon: <RefreshCw className="h-4 w-4 animate-spin" />,
          text: "Syncing...",
          variant: "default" as const,
          disabled: true,
        };
      case "success":
        return {
          icon: <Check className="h-4 w-4" />,
          text: "Synced!",
          variant: "secondary" as const,
          disabled: false,
        };
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: "Failed",
          variant: "destructive" as const,
          disabled: false,
        };
      default:
        return {
          icon: <RefreshCw className="h-4 w-4" />,
          text: "Sync",
          variant: "outline" as const,
          disabled: false,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Button
      onClick={handleSync}
      variant={config.variant}
      disabled={config.disabled}
      size="sm"
      className="min-w-[80px] transition-all"
    >
      {config.icon}
      <span className="ml-2 hidden sm:inline">{config.text}</span>
    </Button>
  );
}
