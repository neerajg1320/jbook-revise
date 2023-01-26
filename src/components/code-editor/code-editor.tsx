import './code-editor.css';
import './syntax.css';
import MonacoEditor, {EditorDidMount} from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import {useRef} from "react";
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';



interface CodeEditorProps {
    initialValue: string;
    onChange(value:string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({initialValue, onChange}) => {
    const editorRef = useRef<any>();

    // invoked when editor is first time displayed
    const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
        editorRef.current = monacoEditor;

        monacoEditor.onDidChangeModelContent(() => {
            onChange(getValue());
        });

        monacoEditor.getModel()?.updateOptions({tabSize: 2});

        const highlighter = new Highlighter(
            // @ts-ignore
            window.monaco,
            codeShift,
            monacoEditor
        );

        highlighter.highLightOnDidChangeModelContent(
            () => {},
            () => {},
            undefined,
            () => {}
        );
    };

    const onFormatClick = () => {
        const monacoEditor = editorRef.current;
        // get, format, set value in editor
        const unformatted = monacoEditor.getModel().getValue();
        const formatted = prettier.format(unformatted, {
            parser: "babel",
            plugins: [parser],
            useTabs: false,
            semi: true,
            singleQuote: true
        }).replace(/\n$/, '');

        monacoEditor.setValue(formatted);
    };

    return (
      <div className="editor-wrapper">
          <button
              className="button button-format is-primary is-small"
              onClick={onFormatClick}
          >
              Format
          </button>
          <MonacoEditor
            editorDidMount={onEditorDidMount}
            value={initialValue}
            height="100%"
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
      </div>
    );
}

export default CodeEditor;
