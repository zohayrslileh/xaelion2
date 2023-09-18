import json from "@/Tools/System/Json";

/*
|-----------------------------
|       DEFINE DEV_MODE
|-----------------------------
|
|
*/
export const DEV_MODE: boolean = process.execArgv.some(arg => arg.includes('ts-node'));

/*
|-----------------------------
|         Read config
|-----------------------------
|
|
*/
const config = json<Record<string, any>>('./.config').read();

export default config