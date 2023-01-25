import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from "localforage";

const debug = false;
const debugPlugin = false;
const debugCache = true;

const cacheEnabled = true;
let fileCache: LocalForage;

if (cacheEnabled) {
    fileCache = localforage.createInstance({
        name: 'fileCache'
    });

    // Sample function to demonstrate usage of fileCache
    if (debug) {
        (async () => {
            await fileCache.setItem('color', 'red');
            const color = await fileCache.getItem('color');
            console.log('color:', color);
        })();
    }
}


export const unpkgPathPlugin = (inputCode: string) => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onResolve({filter: /(^index\.jsx?$)/}, (args: any) => {
                return { path: args.path, namespace: 'a'}
            });

            build.onResolve({ filter: /.*/ }, async (args: any) => {
                if (debugPlugin) {
                    console.log('onResolve', args);
                }

                if (args.path.includes('./') || args.path.includes('../') ) {
                    return {
                        path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href,
                        namespace: 'a'
                    };
                }

                return {
                    path: `https://unpkg.com/${args.path}`,
                    namespace: 'a'
                };
            });

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                if (debugPlugin) {
                    console.log('onLoad', args);
                }

                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        // tiny-test-pkg, medium-test-pkg, nested-tested-pkg
                        // using react-select loads more than 50 dependencies
                        contents: inputCode,
                    };
                }

                // If we have already fetched this file then return from cache
                // We use args.path as key in the cache
                if (cacheEnabled) {
                    const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
                    if (cachedResult) {
                        if (debugCache) {
                            console.log(`loaded ${args.path} from cache`);
                        }
                        return cachedResult;
                    }
                }

                // Fetch the package from repo
                const {data, request} = await axios.get(args.path);
                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: new URL('./', request.responseURL).pathname
                }

                if (cacheEnabled) {
                    // Store result in cache
                    await fileCache.setItem(args.path, result);
                    if (debugCache) {
                        console.log(`stored ${args.path} to cache`);
                    }
                }

                return result;
            });
        },
    };
};