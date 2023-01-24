import React, {useState} from "react";
import { createRoot } from "react-dom/client";

const App = () => {
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');

    const onSubmit = () => {
        // console.log(input);
    }

    return (
        <div>
            <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
            />
            <div>
                <button onClick={onSubmit}>Submit</button>
            </div>

            <pre>{code}</pre>
        </div>
    );
}

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);