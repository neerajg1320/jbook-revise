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

# Test with package https://unpkg.com/tiny-test-pkg@1.0.0/index.js



