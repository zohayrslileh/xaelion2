import { readdir, copyFile, rmdir, unlink, mkdir, readFile, writeFile } from 'fs/promises';
import { join, resolve, sep, extname, dirname } from 'path';
import { existsSync, lstatSync, mkdirSync } from 'fs';
import { minify } from 'uglify-js'

/**
 * Path class
 * 
 */
class Path {

    /**
     * Directory
     * 
     */
    private directory: string;

    /**
     * Ignores
     * 
     */
    private ignores?: string[];


    /**
     * Json constructor
     * 
     */
    public constructor(directory: string) {

        // Full directory
        const fullDirectory = resolve(directory)

        // Check is directory
        if (!lstatSync(fullDirectory).isDirectory())
            throw new Error(`Not found ${fullDirectory} directory`);

        // Set directory
        this.directory = fullDirectory;
    }

    /**
     * Go method
     * 
     * @returns
     */
    public go(directory: string): this {

        // Full directory
        const fullDirectory = join(this.directory, directory);

        // Check is directory
        if (!lstatSync(fullDirectory).isDirectory())
            throw new Error(`Not found ${fullDirectory} directory`);

        // Set directory
        this.directory = fullDirectory;

        return this;
    }

    /**
     * Back method
     * 
     * @returns
     */
    public back(times: number = 1): this {

        // Split directory
        const splitDirectory = this.directory.split(sep)

        // Update directory
        this.directory = splitDirectory.slice(0, splitDirectory.length - times).join(sep);

        return this;
    }

    /**
     * Make method
     * 
     * @returns
     */
    public make(directory: string): this {

        // Make directory
        mkdirSync(join(this.directory, directory), { recursive: true });

        return this.go(directory);
    }

    /**
     * Ignore method
     * 
     * @returns
     */
    public ignore(ignores: string[]): this {

        // Set ignores
        this.ignores = ignores;

        return this;
    }

    /**
     * In ignores method
     * 
     * @returns
     */
    private inIgnores(subPath: string): boolean {

        // Check ignores
        if (!this.ignores) return false;

        return this.ignores.find(ignore => {

            return subPath.startsWith(ignore) || `*${extname(subPath)}` === ignore;
        }) ? true : false;
    }

    /**
     * Scan
     * 
     * @returns
     */
    public async scan(onFound: OnFoundType, directory: string = this.directory, parent?: string): Promise<void> {

        // Start scan
        for (const subPath of await readdir(directory)) {

            // Sub parent
            const subParent = parent ? `${parent}/${subPath}` : subPath;

            // Full child
            const fullChild = join(directory, subPath);

            // Check in ignores
            if (this.inIgnores(subParent)) continue;

            // Is directory
            const isDirectory = lstatSync(fullChild).isDirectory();

            // Scan child
            if (isDirectory) await this.scan(onFound, fullChild, subParent);

            // On found callback
            await onFound({ isDirectory, subPath: subParent, fullPath: fullChild });
        }
    }

    /**
     * Copy methodd
     * 
     * @returns
     */
    public async clear(): Promise<void> {

        // Scan
        await this.scan(async ({ isDirectory, fullPath }) => {

            // Remove directory
            if (isDirectory && (await readdir(fullPath)).length === 0)
                await rmdir(fullPath);

            // Remove file
            else await unlink(fullPath);
        })
    }

    /**
     * Copy methodd
     * 
     * @returns
     */
    public async copy(distension: string): Promise<void> {

        // Full distension
        const fullDistension = resolve(distension);

        // Create distension
        await mkdir(fullDistension, { recursive: true });

        // Scan
        await this.scan(async ({ isDirectory, subPath, fullPath }) => {

            // Skeep if is directory
            if (isDirectory || fullPath.startsWith(fullDistension)) return;

            // directory
            const directory = dirname(join(distension, subPath));

            // Make dir
            if (!existsSync(directory)) await mkdir(directory, { recursive: true });

            // Copy
            await copyFile(fullPath, join(distension, subPath));
        })
    }

    /**
     * Move methodd
     * 
     * @returns
     */
    public async move(distension: string): Promise<void> {

        // Copy
        await this.copy(distension)

        // Clear
        await this.clear()
    }

    /**
     * Minify methodd support js files
     * 
     * @returns
     */
    public async minify(): Promise<void> {

        // Scan
        await this.scan(async ({ isDirectory, fullPath }) => {

            // Skeep if is directory
            if (isDirectory || extname(fullPath) !== '.js') return;

            // Original code
            const originalCode = await readFile(fullPath, { encoding: 'utf8' });

            // Minify code
            const minifyCode = minify(originalCode).code;

            // Save minify code
            await writeFile(fullPath, minifyCode)
        })
    }
}


/**
 * Path method
 * 
 * @returns 
 */
export default function path(directory: string): Path {

    return new Path(directory);
}

/**
 * Make dir method
 * 
 * @returns 
 */
export function makedir(directory: string): Path {

    // Make dir
    mkdirSync(directory, { recursive: true })

    return new Path(directory);
}


/**
 * On found type
 * 
 */
type OnFoundType = (params: { isDirectory: boolean, subPath: string, fullPath: string }) => Promise<void>