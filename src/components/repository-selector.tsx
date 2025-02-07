
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { githubService } from '@/services/github';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { RepositoryList } from './repository/RepositoryList';
import type { Repository } from '@/types/tickets';

interface RepositorySelectorProps {
  onSelect: (repo: string) => void;
}

export function RepositorySelector({ onSelect }: RepositorySelectorProps) {
  const [username, setUsername] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: repositories = [], isLoading } = useQuery<Repository[]>({
    queryKey: ['repositories', username],
    queryFn: async () => {
      const repo = await githubService.getRepository();
      return [repo];
    },
    enabled: !!username,
  });

  const filteredRepos = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {repositories.length > 0 && (
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

      <RepositoryList 
        repositories={filteredRepos}
        onSelect={onSelect}
      />
    </div>
  );
}

