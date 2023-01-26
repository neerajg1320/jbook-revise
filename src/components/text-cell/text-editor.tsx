import './text-editor.css';
import './editor-dark-theme.css';
import {useEffect, useRef, useState} from "react";
import MDEditor from '@uiw/react-md-editor';
import {debugListeners} from "../../global/config";


const TextEditor = () => {
    const divRef = useRef<HTMLDivElement | null>(null);
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState('# Header');

    useEffect(() => {
        const listener = (event: MouseEvent) => {
            const editorDiv = divRef.current;
            if (debugListeners) {
                console.log(`listener invoked: editorDiv=${editorDiv}`);
            }

            // editorDiv is non-null only in editing mode
            if (editorDiv) {
                const targetNode = event.target as Node;
                if (targetNode && editorDiv.contains(targetNode)) {
                    // console.log(event.target, 'inside div');
                }  else {
                    // console.log(event.target, 'outside div');
                    setEditing(false);
                }
            }
        }

        if (debugListeners) {
            console.log(`TextEditor:useEffect() listener added`);
        }
        document.addEventListener('click', listener, {capture: true});

        return () => {
            if (debugListeners) {
                console.log(`TextEditor:useEffect() listener removed`);
            }
            document.removeEventListener('click', listener, {capture: true});
        }
    }, [])

    if (editing) {
        return (
            <div className="text-editor" ref={divRef}>
                <MDEditor value={value} onChange={(v) => setValue(v || '')}/>
            </div>
        );
    }

    return (
      <div className="text-editor card" onClick={() => setEditing(true)}>
          <div className="card-content">
            <MDEditor.Markdown source={value} />
          </div>
      </div>
    );
}

export default TextEditor;
