import path from "path";
import {Command} from "commander";
import {serve} from "local-api";

export const defaultFilename = 'notebook.js';

export const serveCommand = new Command()
    .command('serve [filename]')
    .description('Open a file for editing')
    .option('-p, --port <number>', 'server port', '4005')
    .action((filename = defaultFilename, options: {port: string}) => {
        console.log(
            'folder:',
            path.join(process.cwd(), path.dirname(filename))
        );
        console.log(
            'file',
            path.basename(filename)
        );
        serve(parseInt(options.port), filename, '/');
    })
