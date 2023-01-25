import "./preview.css";
import React, {useEffect, useRef} from "react";

const html = `\
    <html>
    <head></head>
    <body>
        <div id="root"></div>
        <script>
            window.addEventListener('message', (event) => {
              try {
                eval(event.data);  
              } catch (err) {
                const root = document.querySelector('#root');
                root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
                console.error(err);
              }
            }, false);
        </script>
    </body>
    </html>
    `;

interface  PreviewProps {
    code: string
}

const Preview: React.FC<PreviewProps> = ({code}) => {
    const iframeRef = useRef<any>();

    useEffect(() => {
        iframeRef.current.srcdoc = html;
        // We need to wait for the iframe to be ready
        setTimeout(() => {
            iframeRef.current.contentWindow.postMessage(code, '*');
        }, 10);
    }, [code]);

    return (
        <div className="preview-wrapper">
            <iframe
                ref={iframeRef}
                title="userCode"
                sandbox="allow-scripts"
                srcDoc={html}
            />
        </div>
    );
}

export default Preview;
