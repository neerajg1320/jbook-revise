import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from "localforage";

const debug = false;

const fileCache = localforage.createInstance({
    name: 'filecache'
});

if (debug) {
    (async () => {
        await fileCache.setItem('color', 'red');

        const color = await fileCache.getItem('color');

        console.log('color:', color);
    })();
}

export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                console.log('onResolve', args);
                if (args.path === 'index.js') {
                    return { path: args.path, namespace: 'a' };
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
                console.log('onLoad', args);

                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        // tiny-test-pkg, medium-test-pkg, nested-tested-pkg
                        contents: `
              import React, {useState} from 'react-select';
              console.log(react, useState);
            `,
                    };
                }

                // If we have already fetched this file then return from cache
                // We use args.path as key in the cache
                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
                if (cachedResult) {
                    return cachedResult;
                }

                // Fetch the file from repo, add object to cache, and return object
                const {data, request} = await axios.get(args.path);
                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: new URL('./', request.responseURL).pathname
                }

                // Store result in cache
                await fileCache.setItem(args.path, result);
                return result;
            });
        },
    };
};