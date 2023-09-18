import json from "@/Tools/System/Json";

/**
 * App package config
 * 
 */
const app = json<PackageInterface>('./package.json').read();

/**
 * Package interface
 * 
 */
export interface PackageInterface {
    name: string
    version: string
    description: string
    main: string
    author: string
    license: string
    engines: {
        node: string
    }
    scripts: {
        [name: string]: string
    }
    dependencies: {
        [name: string]: string
    }
    devDependencies: {
        [name: string]: string
    }
}

export default app