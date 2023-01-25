import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
    initialValue: string;
    onChange(value:string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({initialValue, onChange}) => {
    // invoked when editor is first time displayed
    const onEditorDidMount = (getValue: () => string, monacoEditor: any) => {
        // console.log(`editorValue:`, getValue());
        monacoEditor.onDidChangeModelContent(() => {
            if (onChange) {
                onChange(getValue());
            }
        });
    };

    return (
      // value is only the initialValue
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        height="200px"
        language="javascript"
        theme="dark"
        options={{
            wordWrap: 'on',
            minimap: {enabled: false},
            showUnused: false,
            folding: false,
            lineNumbersMinChars: 3,
            fontSize: 16,
            scrollBeyondLastLine: false,
            automaticLayout: true
        }}
      />
    );
}

export default CodeEditor;
