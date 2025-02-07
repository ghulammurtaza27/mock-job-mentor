import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import sdk from '@stackblitz/sdk';
import { reactAdvancedTemplate } from '@/data/templates/react-advanced';
import type { Database } from '@/types/supabase';
import { debounce } from 'lodash';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from "sonner";
import { defaultFiles, type TemplateFiles } from '@/data/templates/react-cra';

type UserRepl = Database['public']['Tables']['user_repls']['Row'];



// Add type for code review
type CodeReview = {
  ticket_id: string;
  user_id: string;
  changes: TemplateFiles;
  status: 'pending' | 'completed';
};

// Update the VM ref type
type StackBlitzVM = {
  editor: {
    setKeybinding: (bindings: Record<string, () => Promise<boolean>>) => void;
  };
  getFsSnapshot: () => Promise<TemplateFiles>;
};

const TicketWorkspace = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const vmRef = useRef<StackBlitzVM | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch ticket data
  const { data: ticket } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
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

  // Fetch user's REPL with proper caching
  const { data: userRepl, isLoading } = useQuery<UserRepl>({
    queryKey: ["userRepl", ticketId],
    queryFn: async () => {
      const session = await supabase.auth.getSession();
      if (!session.data.session) throw new Error('Not authenticated');

      const userId = session.data.session.user.id;
      console.log('Fetching REPL for user:', userId);

      // Try to find existing REPL
      const { data: existing, error } = await supabase
        .from('user_repls')
        .select('*')
        .eq('user_id', userId)
        .eq('template_id', 'react-advanced')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // If we found an existing REPL with progress, return it
      if (existing?.progress && Object.keys(existing.progress).length > 0) {
        console.log('Found existing REPL with progress:', Object.keys(existing.progress));
        return existing;
      }

      // Create new REPL with template files
      const { data: newRepl, error: createError } = await supabase
        .from('user_repls')
        .upsert({
          id: existing?.id, // Will update if exists
          template_id: 'react-advanced',
          user_id: userId,
          current_ticket_id: ticketId,
          progress: defaultFiles // Initialize with template files
        })
        .select()
        .single();

      if (createError) throw createError;
      console.log('Created new REPL with files:', Object.keys(defaultFiles));
      return newRepl;
    },
    staleTime: Infinity, // Prevent unnecessary refetches
    cacheTime: Infinity
  });

  // Save progress mutation
  const saveProgress = useMutation<void, Error, Record<string, string>>({
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

  // Add submit review mutation
  const submitReview = useMutation<void, Error, CodeReview>({
    mutationFn: async (review: CodeReview) => {
      // First save current progress
      await saveProgress.mutateAsync(review.changes);

      // Start a transaction to update both tables
      const { error: reviewError } = await supabase
        .from('code_reviews')
        .insert([review]);

      if (reviewError) throw reviewError;

      // Update ticket status to 'in_review'
      const { error: ticketError } = await supabase
        .from('tickets')
        .update({ status: 'review' })
        .eq('id', review.ticket_id);

      if (ticketError) throw ticketError;
    },
    onSuccess: () => {
      toast.success('Changes submitted for review!');
      setIsSubmitting(false);
      // Optionally redirect to tickets page
      // navigate('/tickets');
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
      
      // Get the current file content directly from the editor
      const files = await vm.getFsSnapshot();
      console.log('Current files to save:', files);

      // Save to database
      await saveProgress.mutateAsync(files);
      
      console.log('Save successful');
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Initialize StackBlitz
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
        console.log('Initializing with files:', files);

        const vm = await sdk.embedProject('repl-container', {
          title: 'React Advanced Template',
          description: 'A modern React application template',
          template: 'create-react-app',
          files: files
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

        vmRef.current = vm;

        // Handle Cmd+S
        vm.editor.setKeybinding({
          'cmd+s': async () => {
            await handleSave();
            return false;
          }
        });

      } catch (error) {
        console.error('Error initializing StackBlitz:', error);
      }
    };

    initProject();
    return () => { vmRef.current = null; };
  }, [userRepl?.id]);

  // Update submit handler
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
        status: 'pending'
      });
    } catch (error) {
      console.error('Error submitting for review:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading workspace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl py-8 space-y-8">
        {/* Header Section */}
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
              {ticket?.title || 'Loading...'}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg leading-relaxed">
              {ticket?.description || 'Loading description...'}
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

        {/* StackBlitz Editor */}
        <div 
          id="repl-container" 
          className="w-full h-[800px] rounded-lg overflow-hidden border"
        />
      </div>

      {/* Update Dialog content */}
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