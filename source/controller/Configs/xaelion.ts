import json from "@/Tools/System/Json";

/**
 * Xaelion config
 * 
 */
const xaelion = json<XaelionInterface>('./xaelion.json').read();

/**
 * Xaelion interface
 * 
 */
export interface XaelionInterface {
    devPaths: string[]
    storagePaths: string[]
    depsPaths: string[]
}

export default xaelion;