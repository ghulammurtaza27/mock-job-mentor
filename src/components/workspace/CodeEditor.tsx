import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CodeEditorProps {
  initialValue?: string
  language?: string
  onChange?: (value: string) => void
  onSave?: () => void
}

const CodeEditor = ({
  initialValue = '',
  language = 'typescript',
  onChange,
  onSave
}: CodeEditorProps) => {
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark')

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
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

        <div className="space-x-2">
          <Button variant="outline" onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}>
            Toggle Theme
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      </div>

      <Editor
        height="600px"
        defaultLanguage={language}
        defaultValue={initialValue}
        theme={theme}
        onChange={(value) => onChange?.(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />
    </Card>
  )
}

export default CodeEditor 