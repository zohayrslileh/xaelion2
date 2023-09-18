import { writeFileSync, readFileSync, existsSync } from 'fs'
import { resolve } from 'path';

/**
 * Json class
 * 
 */
class Json<Template> {

    /**
     * Path
     * 
     */
    private path: string;

    /**
     * Data
     * 
     */
    private data: Template;

    /**
     * Route
     * 
     */
    public route: string[] = [];


    /**
     * Json constructor
     * 
     */
    public constructor(path: string, create?: boolean) {

        // Set path
        this.path = resolve(path);

        // Check Path
        if (existsSync(this.path))
            this.data = JSON.parse(readFileSync(this.path, 'utf-8'));

        else {

            // Not found
            if (!create) throw new Error(`Not found "${this.path}" json file`);

            // Create
            writeFileSync(this.path, '{}')

            // Set default data
            this.data = {} as Template;
        }
    }

    /**
     * Go method
     * 
     * @returns
     */
    public go(route: string): this {

        // Add route
        this.route = [...this.route, ...route.split('/')];

        return this;
    }

    /**
     * Back method
     * 
     * @returns
     */
    public back(times: number = 1): this {

        // Remove from route
        this.route = this.route.slice(0, this.route.length - times);

        return this;
    }

    /**
     * Read method
     * 
     * @returns
     */
    public read(): Template {

        // Export data
        var exportData: any = this.data;

        // Go to real route
        for (const route of this.route)
            exportData = exportData[route];

        return exportData;
    }

    /**
     * Set method
     * 
     * @returns
     */
    public update(data: Template | ((old: Template) => Template)): this {

        // New data
        const newData: any = data instanceof Function ? data(this.read()) : data;

        // Current data
        var current: any = this.data;

        // Check route
        if (this.route.length) {

            // Fetch route and update
            for (const route of this.route.slice(0, this.route.length - 1))
                current = current[route];

            // Update last key with new data
            const lastKey = this.route[this.route.length - 1];
            current[lastKey] = newData;
        }

        // Update base
        else this.data = newData;

        return this;
    }

    /**
     * Save method
     * 
     * @returns
     */
    public save(minify?: boolean): void {

        writeFileSync(this.path, minify ?
            JSON.stringify(this.data) :
            JSON.stringify(this.data, null, 4))
    }
}


/**
 * Json method
 * 
 * @returns 
 */
export default function json<Template = Record<string, any>>(path: string, create?: boolean): Json<Template> {

    return new Json<Template>(path, create);
}

/**
 * Create json method
 * 
 * @returns 
 */
export function cjson<Template = Record<string, any>>(path: string): Json<Template> {

    return new Json<Template>(path, true);
}