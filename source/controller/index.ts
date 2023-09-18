/*
|-----------------------------
|    Alias import support
|-----------------------------
|
|
*/
import './alias'
import { params } from "./Tools/Console/Router";
import { readdirSync } from "fs";
import { bgCyan } from "chalk";

/*
|-----------------------------
|       Found all roots
|-----------------------------
|
|
*/
const roots = readdirSync(`${__dirname}/Roots`).filter(root => !root.endsWith('.hold') && (!params[0] || params[0] === root))

/*
|-----------------------------
|    Print all roots used
|-----------------------------
|
|
*/
if (roots.length) console.log("\n", ...roots.map(root => bgCyan(` ${root} `)), "\n")

/*
|-----------------------------
|        Require roots
|-----------------------------
|
|
*/
roots.forEach(root => require(`./Roots/${root}`))