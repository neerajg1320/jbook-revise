npx create-react-app jbook-revise --template typescript
npm install --save-exact esbuild-wasm@0.8.27

# delete all files in src folder

touch index.tsx

npm start

# A temporary step.
# copy the ./node_modules/esbuild-wasm/esbuild.wasm to ./public (~11MB)
cp ./node_modules/esbuild-wasm/esbuild.wasm ./public