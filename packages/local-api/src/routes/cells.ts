import express from "express";
import fs from 'fs/promises';
import path from "path";

interface Cell {
    id: string,
    type: 'text' | 'code',
    content: string
}

const defaultFileEncoding = 'utf-8';

interface LocalApiError {
    code: string;
}

export const createCellsRouter = (filename: string, dir: string) => {
    // console.log('createCellsRouter:');

    const router = express.Router();
    // body parsing middleware
    router.use(express.json());

    const fullPath = path.join(dir, filename);

    router.get('/cells', async (req, res) => {
        // console.log('GET: cells');
        const isLocalApiError = (err: any): err is LocalApiError => {
            return typeof err.code === "string";
        };

        // create cell storage file if not exists
        try {
            // Read the file
            const result = await fs.readFile(fullPath, {encoding: defaultFileEncoding});
            res.send(JSON.parse(result));
        } catch (err) {
            if (isLocalApiError(err)) {
                if (err.code === "ENOENT") {
                    await fs.writeFile(fullPath, "[]", defaultFileEncoding);
                    res.send([]);
                }
            } else {
                throw err;
            }
        }
    });

    router.post('/cells', async (req, res) => {
        // Get the list of cells from the req object
        const { cells }: {cells: Cell[]} = req.body;

        await fs.writeFile(fullPath, JSON.stringify(cells), defaultFileEncoding);

        res.send({status: 'ok'});
    });

    return router;
}

