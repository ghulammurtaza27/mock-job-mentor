import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Ticket, UserRepl, CodeReview } from '@/types/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from "sonner";
import { PostgrestResponse } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Clock,
  AlertTriangle,
  Star,
  CheckCircle2,
  Calendar
} from 'lucide-react'
import type { Ticket as WorkspaceTicket } from '@/types/workspace'
import type { StackBlitzVM } from '@/types/stackblitz'
import { StackBlitzService } from '@/services/stackblitz'

const REPO_OWNER = 'oldboyxx';
const REPO_NAME = 'jira_clone';

interface ReplFile {
  file_path: string;
}

interface ReplFileContent {
  file_path: string;
  content: string;
}

const TicketWorkspace = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const stackblitzRef = useRef<StackBlitzService | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ticket, setTicket] = useState<WorkspaceTicket | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  // Initialize StackBlitz service
  useEffect(() => {
    stackblitzRef.current = new StackBlitzService('repl-container');
    return () => {
      if (stackblitzRef.current) {
        stackblitzRef.current.destroy();
      }
    };
  }, []);

  const { data: ticketData, isLoading: isTicketLoading } = useQuery<Ticket>({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      if (!ticketId) throw new Error('No ticket ID provided');
      
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!ticketId
  });

  const { data: userRepl } = useQuery<UserRepl>({
    queryKey: ["userRepl", ticketId],
    queryFn: async () => {
      const session = await supabase.auth.getSession();
      if (!session.data.session) throw new Error('Not authenticated');

      const userId = session.data.session.user.id;
      
      const { data: existing, error } = await supabase
        .from('user_repls')
        .select('*')
        .eq('user_id', userId)
        .eq('template_id', 'react-advanced')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (existing?.progress) {
        return existing;
      }

      const { data: newRepl, error: createError } = await supabase
        .from('user_repls')
        .upsert({
          id: existing?.id,
          template_id: 'react-advanced',
          user_id: userId,
          current_ticket_id: ticketId,
          progress: {}
        })
        .select()
        .single();

      if (createError) throw createError;
      return newRepl;
    }
  });

  const saveFiles = useMutation({
    mutationFn: async (files: { path: string; content: string }[]) => {
      if (!userRepl?.id) return;
      
      // Get current files
      const { data: existingFiles, error: fetchError } = await supabase
        .from('user_repl_files')
        .select('file_path') as PostgrestResponse<ReplFile[]>;

      if (fetchError) throw fetchError;

      const existingPaths = new Set(existingFiles?.map(f => f.file_path) || []);
      const now = new Date().toISOString();

      // Prepare upsert data
      const upsertData = files.map(file => ({
        user_repl_id: userRepl.id,
        file_path: file.path,
        content: file.content,
        updated_at: now,
        created_at: existingPaths.has(file.path) ? undefined : now
      }));

      const { error } = await supabase
        .from('user_repl_files')
        .upsert(upsertData, {
          onConflict: 'user_repl_id,file_path'
        });

      if (error) throw error;

      // Update last_accessed in user_repls
      const { error: updateError } = await supabase
        .from('user_repls')
        .update({ last_accessed: now })
        .eq('id', userRepl.id);

      if (updateError) throw updateError;
    }
  });

  const handleSave = useCallback(async () => {
    if (!stackblitzRef.current) return;

    try {
      setIsSaving(true);
      const files = await stackblitzRef.current.getFiles();
      await saveFiles.mutateAsync(
        Object.entries(files).map(([path, content]) => ({ path, content }))
      );
      toast.success('Changes saved successfully');
    } catch (error) {
      console.error('Error saving files:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, [saveFiles]);

  // Add keyboard shortcut for saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  const submitReview = useMutation({
    mutationFn: async (review: Omit<CodeReview, 'id' | 'created_at' | 'updated_at'>) => {
      if (!ticketId) return;
      
      // First save current files
      await handleSave();

      // Get all files for this repl
      const { data: files, error: filesError } = await supabase
        .from('user_repl_files')
        .select('file_path, content') as PostgrestResponse<ReplFileContent[]>;

      if (filesError) throw filesError;

      // Transform files into the format expected by code_reviews
      const changes = files?.reduce((acc, file) => ({
        ...acc,
        [file.file_path]: file.content
      }), {});

      // Create the review
      const { error: reviewError } = await supabase
        .from('code_reviews')
        .insert([{ ...review, changes }]);

      if (reviewError) throw reviewError;

      // Update ticket status
      const { error: ticketError } = await supabase
        .from('tickets')
        .update({ status: 'review' })
        .eq('id', ticketId);

      if (ticketError) throw ticketError;
    },
    onSuccess: () => {
      toast.success('Changes submitted for review!');
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error('Failed to submit: ' + error.message);
      setIsSubmitting(false);
    }
  });

  useEffect(() => {
    if (!userRepl?.id) return;

    const initProject = async () => {
      try {
        const { data: latestRepl, error } = await supabase
          .from('user_repls')
          .select('*')
          .eq('id', userRepl.id)
          .single();

        if (error) throw error;

        const files = latestRepl?.progress || defaultFiles;

        const vm = await sdk.embedProject('repl-container', {
          title: 'React Advanced Template',
          description: 'A modern React application template',
          template: 'create-react-app',
          files: files as Record<string, string>
        }, {
          height: 800,
          showSidebar: true,
          sidebarView: 'project',
          openFile: 'src/App.tsx',
          terminalHeight: 32,
          hideDevTools: false,
          devToolsHeight: 200,
          hideNavigation: false,
          view: 'default'
        });

        // Safe cast as we've defined the exact shape we need
        vmRef.current = vm as unknown as StackBlitzVM;

        // Note: Currently StackBlitz SDK doesn't fully support setKeybinding
        // We'll implement an alternative save mechanism
        const handleKeyDown = (e: KeyboardEvent) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            handleSave();
          }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);

      } catch (error) {
        console.error('Error initializing StackBlitz:', error);
        toast.error('Failed to initialize workspace');
      }
    };

    initProject();
    return () => { vmRef.current = null; };
  }, [userRepl?.id]);

  const handleSubmitForReview = async () => {
    if (!vmRef.current || !ticketId) return;
    
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) throw new Error('Not authenticated');

      const files = await vmRef.current.getFsSnapshot();
      
      await submitReview.mutateAsync({
        ticket_id: ticketId,
        user_id: session.data.session.user.id,
        changes: files,
        status: 'pending',
        feedback: null
      });
    } catch (error) {
      console.error('Error submitting for review:', error);
    }
  };

  useEffect(() => {
    // TODO: Fetch ticket data from API
    // Mock data for now
    setTicket({
      id: ticketId || '1',
      title: 'Implement User Authentication',
      description: 'Add login and signup functionality with OAuth support',
      status: 'in_progress',
      priority: 'high',
      type: 'feature',
      assignee: 'John Doe',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      points: 8,
      tags: ['auth', 'frontend', 'security'],
      progress: 35,
      subtasks: [
        { id: '1', title: 'Setup OAuth providers', completed: true },
        { id: '2', title: 'Implement login flow', completed: false },
        { id: '3', title: 'Add form validation', completed: false }
      ]
    });
  }, [ticketId]);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading workspace...</div>
      </div>
    );
  }

  const priorityColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  }

  const handleSubtaskToggle = (subtaskId: string) => {
    if (!ticket) return
    const updatedSubtasks = ticket.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    )
    setTicket({
      ...ticket,
      subtasks: updatedSubtasks,
      progress: Math.round((updatedSubtasks.filter(st => st.completed).length / updatedSubtasks.length) * 100)
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{ticket.title}</h1>
            <Badge variant="outline">{ticket.type}</Badge>
            <div className={`w-3 h-3 rounded-full ${priorityColors[ticket.priority]}`} />
          </div>
          <div className="flex gap-4 mt-2 text-gray-600">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {ticket.points} points
            </span>
            {ticket.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Due: {new Date(ticket.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <Button variant="outline">Edit Ticket</Button>
      </div>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Progress</span>
          <span>{ticket.progress}%</span>
        </div>
        <Progress value={ticket.progress} className="h-2" />
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{ticket.description}</p>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex gap-2">
                {ticket.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="subtasks">
          <Card className="p-6">
            <div className="space-y-4">
              {ticket.subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center gap-3">
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => handleSubtaskToggle(subtask.id)}
                  />
                  <span className={subtask.completed ? 'line-through text-gray-500' : ''}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="p-6">
            {/* TODO: Implement activity log */}
            <p className="text-gray-600">Activity log coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between gap-4 bg-card p-6 rounded-lg shadow-sm">
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
            {ticket.title}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg leading-relaxed">
            {ticket.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button 
            variant="default"
            onClick={() => setIsSubmitting(true)}
            className="gap-2"
          >
            Submit for Review
          </Button>
        </div>
      </div>

      <Dialog 
        open={isSubmitting} 
        onOpenChange={setIsSubmitting}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit for Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you ready to submit your changes for review?</p>
            <p className="text-sm text-muted-foreground">
              This will save your current progress and create a review request.
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsSubmitting(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitForReview}
                disabled={submitReview.isPending}
              >
                {submitReview.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketWorkspace;
