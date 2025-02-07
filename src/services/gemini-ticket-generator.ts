import { GoogleGenerativeAI } from "@google/generative-ai";
import { Octokit } from '@octokit/rest';
import { Base64 } from 'js-base64';

const REPO_OWNER = 'ghulammurtaza27';
const REPO_NAME = 'pingg';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

export interface GeminiTicket {
  id: string;
  title: string;
  description: string;
  category: 'feature' | 'bug' | 'improvement' | 'documentation';
  priority: 'low' | 'medium' | 'high';
  learningObjectives: string[];
  technicalRequirements: {
    skills: string[];
    concepts: string[];
    suggestedApproach: string;
  };
  estimatedHours: number;
}

// Helper functions
const getReadmeContent = async (): Promise<string> => {
  try {
    const { data } = await octokit.repos.getReadme({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      mediaType: {
        format: 'raw',
      },
    });
    
    if (typeof data === 'object' && 'content' in data) {
      return Base64.decode(data.content);
    }
    
    return data as string;
  } catch (error) {
    console.error('Error fetching README:', error);
    return '';
  }
};

const validateCategory = (category: string): GeminiTicket['category'] => {
  const validCategories: GeminiTicket['category'][] = [
    'feature', 'bug', 'improvement', 'documentation'
  ];
  return validCategories.includes(category as any) 
    ? category as GeminiTicket['category']
    : 'feature';
};

const validatePriority = (priority: string): GeminiTicket['priority'] => {
  const validPriorities: GeminiTicket['priority'][] = [
    'low', 'medium', 'high'
  ];
  return validPriorities.includes(priority as any)
    ? priority as GeminiTicket['priority']
    : 'medium';
};

export const geminiTicketGenerator = {
  async analyzeRepository(): Promise<GeminiTicket[]> {
    // Fetch repository data
    const [repo, readme, issues] = await Promise.all([
      octokit.repos.get({ owner: REPO_OWNER, repo: REPO_NAME }),
      getReadmeContent(),
      octokit.issues.listForRepo({ owner: REPO_OWNER, repo: REPO_NAME, state: 'all' })
    ]);

    // Prepare context for Gemini
    const prompt = `
      As a senior developer and mentor, analyze this repository and create learning-focused development tickets.
      
      Repository Information:
      Name: ${repo.data.name}
      Description: ${repo.data.description}
      Language: ${repo.data.language}
      Topics: ${repo.data.topics.join(', ')}
      
      README:
      ${readme}
      
      Create 5-7 development tickets that:
      1. Progress from basic to advanced concepts
      2. Focus on practical learning outcomes
      3. Include clear technical requirements
      4. Provide learning objectives
      5. Suggest implementation approaches
      
      Format each ticket as a JSON object with these fields:
      {
        id: string,
        title: string,
        description: string,
        category: "feature" | "bug" | "improvement" | "documentation",
        priority: "low" | "medium" | "high",
        learningObjectives: string[],
        technicalRequirements: {
          skills: string[],
          concepts: string[],
          suggestedApproach: string
        },
        estimatedHours: number
      }
      
      Return the tickets as a JSON array.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    try {
      // Extract JSON array from the response
      const jsonStr = text.substring(
        text.indexOf('['),
        text.lastIndexOf(']') + 1
      );
      const tickets = JSON.parse(jsonStr);
      
      // Validate and clean up tickets
      return tickets.map((ticket: any) => ({
        ...ticket,
        id: `ticket-${Math.random().toString(36).substr(2, 9)}`,
        category: validateCategory(ticket.category),
        priority: validatePriority(ticket.priority),
        estimatedHours: Number(ticket.estimatedHours) || 4
      }));
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Failed to generate tickets');
    }
  }
}; 