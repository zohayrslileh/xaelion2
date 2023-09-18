import chalk from 'chalk';
import path, { makedir } from '@/Tools/System/Path';
import tsconfig from '@/Configs/tsconfig';
import { run } from "@/Tools/Console/Command";

/**
 * Controller builder
 * 
 */
export default async function () {

    // Make out directory
    const outDir = makedir(tsconfig.compilerOptions.outDir);

    // Clear old
    await outDir.clear()

    // Build new
    const build = await run({ command: 'npx tsc' })

    // Check build
    if (build !== 0) throw new Error(chalk.bgRed(` Error for build with code ${build} `));

    // Minify JS
    await outDir.minify();

    // Copy other files
    await path(tsconfig.compilerOptions.baseUrl).ignore(['*.ts']).copy(tsconfig.compilerOptions.outDir);
}