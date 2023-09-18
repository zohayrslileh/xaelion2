
/*
 |-----------------------------
 |   Development Environment
 |-----------------------------
 |   Use: npx ts-node index.js
 |
 */
if (process.execArgv.some(arg => arg.includes('ts-node')))
    require('./source/controller');


/*
|-----------------------------
|   Production Environment
|-----------------------------
|   Use: node index.js
|
*/
else require('./deploy/controller');