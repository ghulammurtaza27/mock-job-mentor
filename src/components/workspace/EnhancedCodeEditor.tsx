import { useState, useRef, useEffect } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Settings,
  Play,
  Save,
  Copy,
  FileCode,
  Paintbrush,
  Wrench,
  Terminal
} from 'lucide-react'
import type { editor } from 'monaco-editor'

interface EnhancedCodeEditorProps {
  initialValue?: string
  language?: string
  readOnly?: boolean
  onChange?: (value: string) => void
  onSave?: (value: string) => void
  onRun?: (value: string) => void
}

const EnhancedCodeEditor = ({
  initialValue = '',
  language = 'typescript',
  readOnly = false,
  onChange,
  onSave,
  onRun
}: EnhancedCodeEditorProps) => {
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark')
  const [fontSize, setFontSize] = useState(14)
  const [wordWrap, setWordWrap] = useState('on')
  const [minimap, setMinimap] = useState(true)
  const [output, setOutput] = useState<string>('')
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Add custom actions
    editor.addAction({
      id: 'format-code',
      label: 'Format Code',
      keybindings: [
        monaco.KeyMod.Alt | monaco.KeyCode.KeyF
      ],
      run: (ed) => {
        ed.getAction('editor.action.formatDocument').run()
      }
    })
  }

  const handleCopyCode = () => {
    const code = editorRef.current?.getValue()
    if (code) {
      navigator.clipboard.writeText(code)
    }
  }

  const handleRunCode = async () => {
    const code = editorRef.current?.getValue()
    if (code && onRun) {
      try {
        onRun(code)
        // For demonstration, we'll just show the code in output
        setOutput(`Running code...\n${code}`)
      } catch (error) {
        setOutput(`Error: ${error}`)
      }
    }
  }

  const handleSaveCode = () => {
    const code = editorRef.current?.getValue()
    if (code && onSave) {
      onSave(code)
    }
  }

  const formatCode = () => {
    editorRef.current?.getAction('editor.action.formatDocument').run()
  }

  return (
    <Card className="flex flex-col h-full">
      <div className="border-b p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Select defaultValue={language}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
              </SelectContent>
            </Select>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}>
                    <Paintbrush className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={formatCode}>
                    <Wrench className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Format code (Alt+F)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy code</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleSaveCode}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save (Ctrl+S)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleRunCode}>
                    <Play className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Run code</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[400px]">
        <Editor
          height="100%"
          defaultLanguage={language}
          defaultValue={initialValue}
          theme={theme}
          onChange={(value) => onChange?.(value || '')}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            minimap: { enabled: minimap },
            fontSize,
            wordWrap: wordWrap as 'on' | 'off',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            formatOnPaste: true,
            formatOnType: true,
            quickSuggestions: true,
            folding: true,
            foldingHighlight: true,
            foldingStrategy: 'auto',
            showFoldingControls: 'always',
            matchBrackets: 'always',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoIndent: 'full',
            dragAndDrop: true,
            links: true,
            mouseWheelZoom: true,
          }}
        />
      </div>

      {output && (
        <div className="border-t">
          <Tabs defaultValue="output">
            <TabsList>
              <TabsTrigger value="output">
                <Terminal className="h-4 w-4 mr-2" />
                Output
              </TabsTrigger>
            </TabsList>
            <TabsContent value="output">
              <div className="p-4 bg-muted font-mono text-sm">
                <pre>{output}</pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </Card>
  )
}

export default EnhancedCodeEditor 