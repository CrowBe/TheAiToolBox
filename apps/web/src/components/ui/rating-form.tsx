import { useState } from "react";
import { useSubmitRating } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { getGetToolRatingsQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function RatingForm({ toolId }: { toolId: number }) {
  const [score, setScore] = useState<number>(0);
  const [hoveredScore, setHoveredScore] = useState<number>(0);
  const [review, setReview] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const submitRating = useSubmitRating({
    mutation: {
      onSuccess: () => {
        toast({ description: "Rating submitted successfully!" });
        setScore(0);
        setReview("");
        queryClient.invalidateQueries({ queryKey: getGetToolRatingsQueryKey(toolId) });
      },
      onError: () => {
        toast({ variant: "destructive", description: "Failed to submit rating. Please try again." });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (score === 0) {
      toast({ variant: "destructive", description: "Please select a rating score." });
      return;
    }
    submitRating.mutate({ toolId, data: { score, review } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-xl p-6 bg-card">
      <h3 className="text-lg font-medium">Leave a Review</h3>
      
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 focus:outline-none"
            onMouseEnter={() => setHoveredScore(star)}
            onMouseLeave={() => setHoveredScore(0)}
            onClick={() => setScore(star)}
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                (hoveredScore ? star <= hoveredScore : star <= score)
                  ? "fill-amber-500 text-amber-500"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>

      <Textarea
        placeholder="Share your experience with this tool (optional)..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="min-h-[100px] resize-none"
      />

      <Button 
        type="submit" 
        disabled={submitRating.isPending || score === 0}
      >
        {submitRating.isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
