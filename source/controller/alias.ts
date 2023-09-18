import Module from 'module'
import { join } from 'path';

/*
|-----------------------------
|    Save original resolve
|-----------------------------
|
|
*/
const originalResolveFilename = (Module as any)._resolveFilename;

/*
|-----------------------------
|      Set alias resolve
|-----------------------------
|
|
*/
(Module as any)._resolveFilename = function (request: string, parentModule: unknown, isMain: unknown) {

    /*
    |-----------------------------
    |        Normal import
    |-----------------------------
    |
    |
    */
    if (!request.startsWith('@/')) return originalResolveFilename.call(this, request, parentModule, isMain);

    /*
    |-----------------------------
    |         Alias import
    |-----------------------------
    |
    |
    */
    else return originalResolveFilename.call(this, join(__dirname, request.slice(1)), parentModule, isMain);
}