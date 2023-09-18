import path, { makedir } from "@/Tools/System/Path";
import app, { PackageInterface } from "@/Configs/app";
import xaelion from "@/Configs/xaelion";
import json from "@/Tools/System/Json";
import { join } from "path";

/**
 * Production
 * 
 */
export default async function () {

    // build dir
    const buildDir = join('./build', app.version);

    // Clear old
    await makedir(buildDir).clear()

    // Copy new
    await path('./').ignore([
        ...xaelion.storagePaths,
        ...xaelion.depsPaths,
        ...xaelion.devPaths
    ]).copy(buildDir);

    // Remove dev dependencies from packages
    json<Partial<PackageInterface>>(join(buildDir, 'package.json'))
        .update(old => ({ ...old, devDependencies: undefined }))
        .save()
}