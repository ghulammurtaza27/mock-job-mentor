
import { ErrorBoundary } from '@/components/error-boundary';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  children: React.ReactNode;
  name?: string;
}

export const ErrorBoundaryWrapper = ({ children, name }: Props) => {
  return (
    <ErrorBoundary>
      <ErrorFallback name={name}>
        {children}
      </ErrorFallback>
    </ErrorBoundary>
  );
};

const ErrorFallback = ({ children, name }: Props) => {
  return (
    <div className="relative">
      {children}
      <div className="error-boundary-fallback hidden">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error in {name || 'component'}</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default ErrorBoundaryWrapper;
