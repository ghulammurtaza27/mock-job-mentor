
import { Repository } from "@/types/tickets";
import { Button } from "../ui/button";

interface RepositoryListProps {
  repositories: Repository[];
  onSelect: (repo: string) => void;
}

export function RepositoryList({ repositories, onSelect }: RepositoryListProps) {
  return (
    <div className="grid gap-2">
      {repositories.map((repo) => (
        <Button
          key={repo.id}
          variant="outline"
          className="justify-start"
          onClick={() => onSelect(repo.full_name)}
        >
          <div className="flex flex-col items-start">
            <span className="font-medium">{repo.name}</span>
            <span className="text-sm text-muted-foreground">
              {repo.description || 'No description'}
            </span>
          </div>
        </Button>
      ))}
    </div>
  );
}

