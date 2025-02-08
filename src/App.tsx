import React from "react"; // Add explicit React import
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Dashboard from '@/pages/Index';
import Landing from '@/pages/landing';
import Pricing from '@/pages/pricing';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Workspace from "@/pages/workspace";
import { ErrorBoundary } from '@/components/error-boundary';
import MainLayout from '@/components/layout/MainLayout';
import CodeEditor from '@/pages/workspace/CodeEditor';
import SprintPlanning from '@/pages/workspace/SprintPlanning';
import CodeReview from '@/pages/workspace/CodeReview';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LearningPath from '@/pages/learning/LearningPath'
import LearningModule from '@/pages/learning/LearningModule'
import Lesson from '@/pages/learning/Lesson'
import WorkspaceHub from "@/pages/workspace/WorkspaceHub"
import DevOpsHub from "@/pages/devops/DevOpsHub"
import TeamHub from "@/pages/team/TeamHub"
import IncidentHub from "@/pages/incidents/IncidentHub"
import CareerHub from "@/pages/career/CareerHub"
import GitHubHub from "@/pages/github/GitHubHub"
import SystemDesign from "@/pages/workspace/SystemDesign"
import InterviewPrep from "@/pages/career/InterviewPrep"
import AIMentor from "@/pages/learning/AIMentor"
import GitWorkflow from "@/pages/workspace/GitWorkflow"
import CloudConsole from "@/pages/infrastructure/CloudConsole"
import Deployments from "@/pages/infrastructure/Deployments"
import MonitoringDashboard from "@/pages/monitoring/MonitoringDashboard"
import Database from "@/pages/infrastructure/Database"
import Infrastructure from "@/pages/infrastructure/Infrastructure"
import Alerts from "@/pages/monitoring/Alerts"
import Practice from "@/pages/learning/Practice"
import { ProgressProvider } from '@/contexts/ProgressContext'
import ProjectSetup from "@/pages/setup/ProjectSetup"
import TicketWorkspace from "@/pages/tickets/TicketWorkspace"
import PullRequests from "@/pages/github/PullRequests"
import { NotificationProvider } from '@/contexts/NotificationContext'
import TicketList from '@/pages/tickets/TicketList'
import TicketDetail from '@/pages/tickets/TicketDetail'


// Move queryClient outside of component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ProgressProvider>
            <NotificationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/pricing" element={<Pricing />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* Project Setup & Management */}
                      <Route path="/setup" element={<ProjectSetup />} />
                      <Route path="/tickets" element={<TicketList />} />
                      <Route path="/tickets/:ticketId" element={<TicketDetail />} />
                      <Route path="/pull-requests" element={<PullRequests />} />
                      
                      {/* Infrastructure routes */}
                      <Route path="/cloud" element={<CloudConsole />} />
                      <Route path="/deployments" element={<Deployments />} />
                      <Route path="/database" element={<Database />} />
                      <Route path="/infrastructure" element={<Infrastructure />} />
                      
                      {/* Monitoring routes */}
                      <Route path="/monitoring" element={<MonitoringDashboard />} />
                      <Route path="/alerts" element={<Alerts />} />
                      <Route path="/incidents" element={<IncidentHub />} />
                      
                      {/* Learning routes */}
                      <Route path="/learning" element={<LearningPath />} />
                      <Route path="/learning/:moduleId" element={<LearningModule />} />
                      <Route path="/learning/:moduleId/lesson/:lessonId" element={<Lesson />} />
                      <Route path="/mentor" element={<AIMentor />} />
                      <Route path="/practice" element={<Practice />} />
                      
                      {/* Workspace routes */}
                      <Route path="/workspace-hub" element={<WorkspaceHub />} />
                      <Route path="/workspace" element={<Workspace />} />
                      <Route path="/editor" element={<CodeEditor />} />
                      <Route path="/system-design" element={<SystemDesign />} />
                      <Route path="/git-workflow" element={<GitWorkflow />} />
                      
                      {/* Project management routes */}
                      <Route path="/sprints" element={<SprintPlanning />} />
                      <Route path="/code-review" element={<CodeReview />} />
                      
                      {/* Team routes */}
                      <Route path="/team" element={<TeamHub />} />
                      
                      {/* Career routes */}
                      <Route path="/career" element={<CareerHub />} />
                      <Route path="/interview-prep" element={<InterviewPrep />} />
                      <Route path="/github" element={<GitHubHub />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* Fallback routes */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </NotificationProvider>
          </ProgressProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;