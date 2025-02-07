
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { githubService } from '@/services/github';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import type { Repository } from '@/types/tickets';

interface RepositorySelectorProps {
  onSelect: (repo: string) => void;
}

export function RepositorySelector({ onSelect }: RepositorySelectorProps) {
  const [username, setUsername] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: repositories, isLoading } = useQuery<Repository[]>({
    queryKey: ['repositories', username],
    queryFn: () => githubService.getRepository(),
    enabled: !!username,
  });

  const filteredRepos = repositories?.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button 
          variant="secondary"
          disabled={!username || isLoading}
        >
          {isLoading ? 'Loading...' : 'Search'}
        </Button>
      </div>

      {repositories && repositories.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="grid gap-2">
        {filteredRepos.map((repo) => (
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
    </div>
  );
}
