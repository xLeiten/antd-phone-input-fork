import dts from "rollup-plugin-dts";
import less from "rollup-plugin-less";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import {readFileSync} from "fs";

const pkg = JSON.parse(readFileSync("./package.json") as unknown as string);

const input = "src/index.ts";
const cjsOutput = {file: pkg.main, format: "cjs", exports: "auto"};
const esmOutput = {file: pkg.module, format: "es"};
const dtsOutput = {file: pkg.types, format: "es"};

const jsonPlugin = json();
const tsPlugin = typescript();
const lessPlugin = less({insert: true, output: false});

const external = [
	...Object.keys({...pkg.dependencies, ...pkg.peerDependencies}),
	/^react($|\/)/,
	/^antd($|\/)/,
];

export default [
	{input, output: cjsOutput, plugins: [tsPlugin, jsonPlugin, lessPlugin], external},
	{input, output: esmOutput, plugins: [tsPlugin, jsonPlugin, lessPlugin], external},
	{input, output: dtsOutput, plugins: [dts()], external: [/\.less$/]},
];