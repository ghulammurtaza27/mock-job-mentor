
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({ size = 24, className = "" }: LoadingSpinnerProps) => {
  return (
    <div 
      role="status" 
      aria-label="Loading" 
      className={`flex items-center justify-center ${className}`}
    >
      <Loader2 
        className="animate-spin" 
        size={size} 
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
