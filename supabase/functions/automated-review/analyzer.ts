import { parse } from 'https://esm.sh/@babel/parser'
import traverse from 'https://esm.sh/@babel/traverse'
import { ESLint } from 'https://esm.sh/eslint'
import type { AutomatedReviewResult, CodeReviewComment } from '../../../src/services/codeReview'

interface AnalysisMetrics {
  complexity: {
    cyclomatic: number
    cognitive: number
  }
  maintainability: number
  duplication: number
  issues: {
    errors: number
    warnings: number
    info: number
  }
}

export async function analyze(files: Record<string, string>): Promise<AutomatedReviewResult> {
  const comments: CodeReviewComment[] = []
  const metrics: AnalysisMetrics = {
    complexity: { cyclomatic: 0, cognitive: 0 },
    maintainability: 0,
    duplication: 0,
    issues: { errors: 0, warnings: 0, info: 0 }
  }

  const bestPractices = {
    followed: [] as string[],
    violations: [] as string[]
  }

  // Initialize ESLint
  const eslint = new ESLint({
    useEslintrc: false,
    overrideConfig: {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
      ],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'react', 'react-hooks'],
      rules: {
        // Custom rules configuration
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'warn'
      }
    }
  })

  for (const [filePath, content] of Object.entries(files)) {
    try {
      // Parse the code
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      })

      // Analyze code metrics
      const fileMetrics = analyzeMetrics(ast)
      metrics.complexity.cyclomatic += fileMetrics.complexity.cyclomatic
      metrics.complexity.cognitive += fileMetrics.complexity.cognitive

      // Run ESLint
      const lintResults = await eslint.lintText(content, { filePath })
      const issues = processLintResults(lintResults[0], filePath)
      comments.push(...issues)

      // Update issue counts
      metrics.issues.errors += issues.filter(i => i.severity === 'high').length
      metrics.issues.warnings += issues.filter(i => i.severity === 'medium').length
      metrics.issues.info += issues.filter(i => i.severity === 'low').length

      // Check best practices
      const practices = analyzeBestPractices(ast, content)
      bestPractices.followed.push(...practices.followed)
      bestPractices.violations.push(...practices.violations)

    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error)
    }
  }

  // Calculate maintainability index
  metrics.maintainability = calculateMaintainabilityIndex(metrics)

  return {
    comments,
    summary: {
      suggestions: comments.filter(c => c.type === 'suggestion').length,
      issues: comments.filter(c => c.type === 'issue').length,
      praise: comments.filter(c => c.type === 'praise').length,
      overallScore: calculateOverallScore(metrics)
    },
    bestPractices
  }
}

function analyzeMetrics(ast: any) {
  let cyclomatic = 0
  let cognitive = 0

  traverse(ast, {
    IfStatement() { cyclomatic++; cognitive++ },
    WhileStatement() { cyclomatic++; cognitive++ },
    ForStatement() { cyclomatic++; cognitive++ },
    SwitchCase() { cyclomatic++ },
    LogicalExpression() { cyclomatic++ },
    ConditionalExpression() { cyclomatic++ }
  })

  return {
    complexity: {
      cyclomatic,
      cognitive
    }
  }
}

function processLintResults(results: any, filePath: string): CodeReviewComment[] {
  return results.messages.map((msg: any) => ({
    id: `${filePath}-${msg.line}-${msg.column}`,
    filePath,
    lineNumber: msg.line,
    content: msg.message,
    type: msg.severity === 2 ? 'issue' : 'suggestion',
    severity: msg.severity === 2 ? 'high' : 'medium',
    author: {
      id: 'system',
      name: 'Code Analyzer'
    },
    createdAt: new Date()
  }))
}

function analyzeBestPractices(ast: any, content: string) {
  const practices = {
    followed: [] as string[],
    violations: [] as string[]
  }

  // Check for early returns
  let hasEarlyReturns = false
  traverse(ast, {
    ReturnStatement(path: any) {
      if (path.parent.type !== 'BlockStatement') {
        hasEarlyReturns = true
      }
    }
  })
  if (hasEarlyReturns) {
    practices.followed.push('Uses early returns for better readability')
  } else {
    practices.violations.push('Consider using early returns to improve code readability')
  }

  // Check for proper component naming
  let hasProperNaming = false
  traverse(ast, {
    FunctionDeclaration(path: any) {
      if (path.node.id && /^[A-Z]/.test(path.node.id.name)) {
        hasProperNaming = true
      }
    },
    VariableDeclarator(path: any) {
      if (path.node.id && /^[A-Z]/.test(path.node.id.name)) {
        hasProperNaming = true
      }
    }
  })
  if (hasProperNaming) {
    practices.followed.push('Uses proper component naming conventions')
  } else {
    practices.violations.push('Component names should start with an uppercase letter')
  }

  // Check for proper event handler naming
  const hasProperHandlerNaming = /handle[A-Z]/.test(content)
  if (hasProperHandlerNaming) {
    practices.followed.push('Uses proper event handler naming (handle* prefix)')
  } else {
    practices.violations.push('Event handlers should use the handle* prefix')
  }

  return practices
}

function calculateMaintainabilityIndex(metrics: AnalysisMetrics): number {
  // Simplified maintainability index calculation
  const maxComplexity = 30
  const complexity = (metrics.complexity.cyclomatic + metrics.complexity.cognitive) / 2
  const normalizedComplexity = Math.min(complexity / maxComplexity, 1)
  return Math.round((1 - normalizedComplexity) * 100)
}

function calculateOverallScore(metrics: AnalysisMetrics): number {
  const weights = {
    maintainability: 0.4,
    complexity: 0.3,
    issues: 0.3
  }

  const complexityScore = Math.max(0, 100 - (metrics.complexity.cyclomatic + metrics.complexity.cognitive) * 2)
  const issuesScore = Math.max(0, 100 - (
    metrics.issues.errors * 10 +
    metrics.issues.warnings * 5 +
    metrics.issues.info * 2
  ))

  return Math.round(
    metrics.maintainability * weights.maintainability +
    complexityScore * weights.complexity +
    issuesScore * weights.issues
  )
} 