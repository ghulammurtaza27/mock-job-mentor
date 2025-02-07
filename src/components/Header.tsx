import { Button } from "@/components/ui/button";
import { Bell, User, Code2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">MockJob</h2>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </a>
            {user && (
              <>
                <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  My Tasks
                </a>
                <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Progress
                </a>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
                <User className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Sign in
              </Button>
              <Button onClick={() => navigate("/signup")}>
                Sign up
              </Button>
            </>
          )}
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/workspace">
            <Button variant="ghost" className="gap-2">
              <Code2 className="h-4 w-4" />
              Workspace
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;