import json from "@/Tools/System/Json";

/**
 * Typescript config
 * 
 */
const tsconfig = json<TsconfigInterface>('./tsconfig.json').read();

/**
 * Tsconfig interface
 * 
 */
export interface TsconfigInterface {
    compilerOptions: {
        target: string
        module: string
        allowJs: boolean
        strict: boolean
        noImplicitAny: boolean
        esModuleInterop: boolean
        moduleResolution: string
        resolveJsonModule: boolean
        outDir: string
        baseUrl: string
        paths: Record<string, string[]>
    };
    exclude: string[]
    include: string[]
}

export default tsconfig