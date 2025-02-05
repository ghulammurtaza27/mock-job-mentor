import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">MockJob</h2>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              My Tasks
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Progress
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button>New Task</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;