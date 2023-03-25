import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import typescript from "@rollup/plugin-typescript";
import {readFileSync} from "fs";

const pkg = JSON.parse(readFileSync("./package.json") as unknown as string);

const input4 = "src/Input4/index.tsx";
const input5 = "src/Input5/index.tsx";
const cjsInput4 = {file: "Input4/index.cjs.js", format: "cjs", exports: "auto"};
const esmInput4 = {file: "Input4/index.esm.js", format: "es"};
const dtsInput4 = {file: "Input4/index.d.ts", format: "es"};
const cjsInput5 = {file: "Input5/index.cjs.js", format: "cjs", exports: "auto"};
const esmInput5 = {file: "Input5/index.esm.js", format: "es"};
const dtsInput5 = {file: "Input5/index.d.ts", format: "es"};

const jsonPlugin = json();
const cssPlugin = postcss();
const tsPlugin = typescript();

const external = [
	...Object.keys({...pkg.dependencies, ...pkg.peerDependencies}),
	/^react($|\/)/,
	/^antd($|\/)/,
];

export default [
	{input: input4, output: cjsInput4, plugins: [tsPlugin, jsonPlugin, cssPlugin], external},
	{input: input4, output: esmInput4, plugins: [tsPlugin, jsonPlugin, cssPlugin], external},
	{input: input4, output: dtsInput4, plugins: [dts()], external: [/\.css$/]},
	{input: input5, output: cjsInput5, plugins: [tsPlugin, jsonPlugin, cssPlugin], external},
	{input: input5, output: esmInput5, plugins: [tsPlugin, jsonPlugin, cssPlugin], external},
	{input: input5, output: dtsInput5, plugins: [dts()], external: [/\.css$/]},
];
