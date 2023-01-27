import path from "path";
import {Command} from "commander";
import {serve} from "local-api";

export const defaultFilename = 'notebook.js';

interface LocalApiError {
    code: string;
    message?: string;
}

export const serveCommand = new Command()
    .command('serve [filename]')
    .description('Open a file for editing')
    .option('-p, --port <number>', 'server port', '4005')
    .action(async (filename = defaultFilename, options: {port: string}) => {
        const isLocalApiError = (err: any): err is LocalApiError => {
            return typeof err.code === "string";
        };

        const dir = path.join(process.cwd(), path.dirname(filename));
        try {
            await serve(parseInt(options.port), path.basename(filename), dir);
            console.log(`Opened ${filename}. Navigate to http://localhost:${options.port}`);
        } catch (err) {
            if (isLocalApiError(err)) {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Error: port ${options.port} is in use. Use -p, --port option to specify port`)
                } else {
                    console.error('Error from local-api:', err.message);
                }
            } else {
                console.error(err);
            }
            process.exit(1);
        }
    })
