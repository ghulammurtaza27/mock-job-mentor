
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import sdk from '@stackblitz/sdk';
import { defaultFiles } from '@/data/templates/react-cra';
import type { StackBlitzVM, Ticket, UserRepl, CodeReview } from '@/types/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from "sonner";

const TicketWorkspace = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const vmRef = useRef<StackBlitzVM | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: ticket } = useQuery<Ticket>({
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
          progress: defaultFiles as Record<string, string>
        })
        .select()
        .single();

      if (createError) throw createError;
      return newRepl;
    }
  });

  const saveProgress = useMutation({
    mutationFn: async (files: Record<string, string>) => {
      if (!userRepl?.id) return;
      
      const { error } = await supabase
        .from('user_repls')
        .update({
          progress: files,
          last_accessed: new Date().toISOString()
        })
        .eq('id', userRepl.id);

      if (error) throw error;
    }
  });

  const submitReview = useMutation({
    mutationFn: async (review: Omit<CodeReview, 'id' | 'created_at' | 'updated_at'>) => {
      if (!vmRef.current || !ticketId) return;
      
      // First save current progress
      const files = await vmRef.current.getFsSnapshot();
      await saveProgress.mutateAsync(files);

      // Start a transaction to update both tables
      const { error: reviewError } = await supabase
        .from('code_reviews')
        .insert([review]);

      if (reviewError) throw reviewError;

      // Update ticket status to 'in_review'
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

  const handleSave = async () => {
    if (!vmRef.current) return;
    setIsSaving(true);
    
    try {
      const vm = vmRef.current;
      const files = await vm.getFsSnapshot();
      await saveProgress.mutateAsync(files);
      toast.success('Progress saved successfully');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsSaving(false);
    }
  };

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

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading workspace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl py-8 space-y-8">
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
              onClick={handleSubmitForReview}
              className="gap-2"
            >
              Submit for Review
            </Button>
          </div>
        </div>

        <div 
          id="repl-container" 
          className="w-full h-[800px] rounded-lg overflow-hidden border"
        />
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
