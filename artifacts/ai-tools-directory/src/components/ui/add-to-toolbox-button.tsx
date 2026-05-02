import { useUser, useClerk } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetToolbox, useAddToToolbox, useRemoveFromToolbox, getGetToolboxQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Wrench, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToToolboxButtonProps {
  toolId: number;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

export function AddToToolboxButton({ toolId, className, variant = "outline", size = "default" }: AddToToolboxButtonProps) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const queryClient = useQueryClient();

  const { data: toolbox } = useGetToolbox({
    query: { enabled: !!isSignedIn, queryKey: getGetToolboxQueryKey() },
  });

  const isSaved = toolbox?.some((item) => item.toolId === toolId) ?? false;

  const addMutation = useAddToToolbox({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetToolboxQueryKey() }),
    },
  });

  const removeMutation = useRemoveFromToolbox({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetToolboxQueryKey() }),
    },
  });

  const isPending = addMutation.isPending || removeMutation.isPending;

  function handleClick() {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    if (isSaved) {
      removeMutation.mutate({ toolId });
    } else {
      addMutation.mutate({ toolId });
    }
  }

  return (
    <Button
      variant={isSaved ? "default" : variant}
      size={size}
      onClick={handleClick}
      disabled={isPending}
      className={cn(isSaved && "bg-primary text-primary-foreground", className)}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isSaved ? (
        <Check className="w-4 h-4 mr-2" />
      ) : (
        <Wrench className="w-4 h-4 mr-2" />
      )}
      {isSaved ? "In Toolbox" : "Add to Toolbox"}
    </Button>
  );
}
