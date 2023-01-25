import * as esbuild from "esbuild-wasm";
import axios from "axios";
import {debugPlugin, debugCache, cacheEnabled} from "../global/config";
import localforage from "localforage";

const refereceCode = false;
let fileCache: LocalForage;

if (cacheEnabled) {
    fileCache = localforage.createInstance({
        name: 'fileCache'
    });

    // Sample function to demonstrate usage of fileCache
    if (refereceCode) {
        (async () => {
            await fileCache.setItem('color', 'red');
            const color = await fileCache.getItem('color');
            console.log('color:', color);
        })();
    }
}

export const fetchPlugin = (inputCode: string) => {
    return {
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onLoad({ filter: /.*/ }, async (args: any) => {
                if (debugPlugin) {
                    console.log('onLoad', args);
                }

                if (args.path === 'index.js' || args.path === 'index.jsx') {
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