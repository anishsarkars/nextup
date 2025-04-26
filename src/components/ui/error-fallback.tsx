
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorFallback({
  title = "Failed to load content",
  message = "There was a problem loading this content. Please try again later.",
  onRetry
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/30 min-h-[16rem]">
      <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry} 
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
