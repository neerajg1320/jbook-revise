import {Command} from "commander";

export const serveCommand = new Command()
    .command('serve [filename]')
    .description('Open a file for editing')
    .option('-p, --port <number>', 'server port', '4005')
    .action(() => {
        console.log('Getting ready to serve a file');
    })
