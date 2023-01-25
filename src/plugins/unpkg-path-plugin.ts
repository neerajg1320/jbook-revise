import * as esbuild from 'esbuild-wasm';
import {debugPlugin} from "../global/config";

export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            // The first onResolve match is called

            build.onResolve({filter: /^index\.js[x]?$/}, (args: any) => {
                if (debugPlugin) {
                    console.log('onResolve', args);
                }
                return { path: args.path, namespace: 'a'}
            });

            build.onResolve({filter: /^\.{1,2}\//}, (args: any) => {
                if (debugPlugin) {
                    console.log('onResolve', args);
                }
                return {
                    path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href,
                    namespace: 'a'
                };
            });

            build.onResolve({ filter: /.*/ }, async (args: any) => {
                if (debugPlugin) {
                    console.log('onResolve', args);
                }
                return {
                    path: `https://unpkg.com/${args.path}`,
                    namespace: 'a'
                };
            });
        },
    };
};