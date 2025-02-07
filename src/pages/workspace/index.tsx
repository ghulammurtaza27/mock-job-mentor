import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

const REPO_OWNER = 'oldboyxx';
const REPO_NAME = 'jira_clone';

const Workspace = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 bg-card p-6 rounded-lg shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Jira Clone Workspace
            </h1>
            <p className="text-muted-foreground mt-2">
              A simplified Jira clone built with React/Babel (Client), and Node/TypeScript (API)
            </p>
          </div>
          <a 
            href="https://github.com/oldboyxx/jira_clone"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View on GitHub →
          </a>
        </div>

        {/* GitHub Repository */}
        <div className="relative w-full h-[800px] rounded-lg overflow-hidden border bg-white">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading workspace...</span>
              </div>
            </div>
          )}
          <iframe
            src={`https://stackblitz.com/github/${REPO_OWNER}/${REPO_NAME}?embed=1&view=editor&preset=node`}
            className="w-full h-full border-0"
            title="Jira Clone Repository"
            onLoad={handleIframeLoad}
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        </div>

        {/* Features List */}
        <div className="grid grid-cols-2 gap-8 bg-card p-6 rounded-lg">
          <div>
            <h2 className="text-xl font-semibold mb-4">Key Features</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Modern React with functional components and hooks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Custom light-weight UI components</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Simple local React state management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Custom webpack setup without CRA</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>React/Babel (Client)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Node/TypeScript (API)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>PostgreSQL with TypeORM</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Cypress for testing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace; 