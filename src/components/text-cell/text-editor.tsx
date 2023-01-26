import './text-editor.css';
import {useEffect, useRef, useState} from "react";
import MDEditor from '@uiw/react-md-editor';


const TextEditor = () => {
    const divRef = useRef<HTMLDivElement | null>(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const listener = (event: MouseEvent) => {
            const editorDiv = divRef.current;
            console.log(`listener invoked: editorDiv=${editorDiv}`);

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

        console.log(`TextEditor:useEffect() listener added`);
        document.addEventListener('click', listener, {capture: true});

        return () => {
            console.log(`TextEditor:useEffect() listener removed`);
            document.removeEventListener('click', listener, {capture: true});
        }
    }, [])

    if (editing) {
        return (
            <div ref={divRef}>
                <MDEditor />
            </div>
        );
    }

    return (
      <div onClick={() => setEditing(true)}>
          <MDEditor.Markdown source={'# Header'} />
      </div>
    );
}

export default TextEditor;
